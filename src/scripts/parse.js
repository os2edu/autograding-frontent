const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse')
const _ = require('lodash')
const { Octokit } = require('octokit')

const ASSIGNMENT_DIR = './assignments'
const EXTENSION = '.csv';
const ORG = 'LearningOS'

const userInfoCache = {}
const commitsCache = {}

const octokit = new Octokit({ auth: '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' })

const getUserInfo = async (student_name) => {
  const res = await octokit.request('GET /users/{username}', {
    username: student_name
  })
  return pick(res.data, 'avatar_url')
}

const getRepoCommits = async (assignment) => {
    const res = await octokit.request('GET /repos/{owner}/{repo}/commits', {
      owner: ORG,
      repo: assignment.student_repository_name,
      author: assignment.github_username
    })
    return res.data
}

async function parseAssignment(filename) {
  // const csvFilePath = path.resolve(__dirname, filename)

  return new Promise((resolve, reject) => {

    const csvFilePath = path.resolve(__dirname, `${ASSIGNMENT_DIR}/${filename}`)

    const headers = [
      'assignment_name',
      'assignment_url',
      'starter_code_url',
      'github_username',
      'roster_identifier',
      'student_repository_name',
      'student_repository_url',
      'submission_timestamp',
      'points_awarded',
      'points_available'
    ]

    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' })

    parse(
      fileContent,
      {
        delimiter: ',',
        columns: headers
      },
      async (error, result) => {
        if (error) {
          reject(error)
        }

        const assignments = result.slice(1, 10)
        if (assignments.length) {
          const classroomStr = assignments[0].assignment_url.split('/')[4]
          classroomIdLen = 8
          const classroomTitle = classroomStr.slice(classroomIdLen + 1)
          const classroom = {
            id: classroomTitle,
            title: classroomTitle,
            assignment: {
                id: assignments[0].assignment_name,
                title: assignments[0].assignment_name,
                url: assignments[0].assignment_url,
                starter_code_url: assignments[0].starter_code_url,
                student_repositories: await Promise.all(_.map(assignments, async (assignment) => {
                  return {
                    name: assignment.github_username,
                    studentInfo: {}, // || await getUserInfo(assignment.github_username),
                    repoURL: assignment.student_repository_url,
                    commits: [],// await getRepoCommits(assignment),
                    submission_timestamp: assignment.submission_timestamp,
                    points_awarded: assignment.points_awarded,
                    points_available: assignment.points_awarded
                  }
                }))
              }
          }
          resolve(classroom)
        }
        resolve()
      }
    )
  });
}

// parseAssignment()
async function run() {

  const res = await octokit.rest.users.getAuthenticated()
  const authoried = res.data.login
  if(!authoried) { return new Error('unauthoried')}

  fs.readdir(ASSIGNMENT_DIR, async (err, files) => {
    if(err) {
      throw new Error(err)
    }
    const csvFiles = files.filter(file => {
        return path.extname(file).toLowerCase() === EXTENSION;
    });
    const result = await Promise.all(csvFiles.map(async filename => {
      return await parseAssignment(filename)
    }))

    const classroomGroup = _.groupBy(result, 'id')
    
    const classrooms = _.map(_.values(classroomGroup), classrooms => {
      return {
        id: classrooms[0].id,
        title: classrooms[0].title,
        assignments: _.map(classrooms, 'assignment')
      }
    })
    const json = JSON.stringify(classrooms)
    fs.writeFileSync('data.json', json)
  });
}

run()
