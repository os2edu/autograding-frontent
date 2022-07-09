const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse')
const _ = require('lodash')
const { getAuthenticated, getUserInfo, getRepoCommits, getRepoLanguages, get_runs_and_jobs } = require('./githubAPI')

const ASSIGNMENT_DIR = './assignments'
const EXTENSION = '.csv'

async function parseAssignment(filename) {
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

        const assignments = result.slice(1, 2)
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
              student_repositories: await Promise.all(
                _.map(assignments, async (assignment) => {
                  return {
                    name: assignment.github_username,
                    studentInfo: (await getUserInfo(assignment.github_username)),
                    repoURL: assignment.student_repository_url,
                    commits: await getRepoCommits(assignment),
                    languages: (await getRepoLanguages(assignment.student_repository_name)),
                    runs: await get_runs_and_jobs(assignment.student_repository_name),
                    submission_timestamp: assignment.submission_timestamp,
                    points_awarded: assignment.points_awarded,
                    points_available: assignment.points_awarded
                  }
                })
              )
            }
          }
          resolve(classroom)
        }
        resolve()
      }
    )
  })
}

// parseAssignment()
async function run() {

  const authoried = await getAuthenticated()
  if (!authoried) {
    return new Error('unauthoried')
  }

  fs.readdir(ASSIGNMENT_DIR, async (err, files) => {
    if (err) {
      throw new Error(err)
    }
    const csvFiles = files.filter((file) => {
      return path.extname(file).toLowerCase() === EXTENSION
    })
    const result = await Promise.all(
      csvFiles.map(async (filename) => {
        return await parseAssignment(filename)
      })
    )

    const classroomGroup = _.groupBy(result, 'id')

    const classrooms = _.map(_.values(classroomGroup), (classrooms) => {
      return {
        id: classrooms[0].id,
        title: classrooms[0].title,
        assignments: _.map(classrooms, 'assignment')
      }
    })
    const json = JSON.stringify(classrooms)
    fs.writeFileSync('data.json', json)
  })
}

run()
