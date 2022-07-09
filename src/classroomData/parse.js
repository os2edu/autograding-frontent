const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse')
const { map, pick } = require('lodash')
const { Octokit } = require('octokit')

const octokit = new Octokit({ auth: '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' })

const getInfo = async () => {

return new Promise((resolve) => {
setTimeout(() => {
return resolve(111)
}, 1000)
})
  
}

// interface IAssignment {
//     'assignment_name': string,
//     'assignment_url': string,
//     'starter_code_url': string,
//     'github_username': string,
//     'roster_identifier': string,
//     'student_repository_name': string,
//     'student_repository_url': string,
//     'submission_timestamp': string,
//     'points_awarded': number,
//     'points_available': number
// }

  const getUserInfo = async (student_name) => {
    const res = await octokit.request('GET /users/{username}', {
      username: student_name
    })
    return pick(res.data, 'avatar_url')
  }
async function parseAssignment() {
  const csvFilePath = path.resolve(__dirname, './assignment.csv')
  await octokit.rest.users.getAuthenticated()

  const getRepoCommits = async (assignment) => {
      const res = await octokit.request('GET /repos/{owner}/{repo}/commits', {
        owner: ORG,
        repo: assignment.student_repository_name,
        author: assignment.github_username
      })
      return res.data
  }

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
  const ORG = 'LearningOS'

  parse(
    fileContent,
    {
      delimiter: ',',
      columns: headers
    },
    async (error, result) => {
      if (error) {
        console.error(error)
      }

      const assignments = result.slice(1)
      if (assignments.length) {
        const classroomStr = assignments[0].assignment_url.split('/')[4]
        classroomIdLen = 8
        const classroomId = classroomStr.slice(0, classroomIdLen)
        const classroomTitle = classroomStr.slice(classroomIdLen + 1)
        const classroom = {
          id: classroomId,
          title: classroomTitle,
          assignments: [
            {
              id: assignments[0].assignment_name,
              title: assignments[0].assignment_name,
              url: assignments[0].assignment_url,
              starter_code_url: assignments[0].starter_code_url,
              student_repositories: await Promise.all(map(assignments.slice(20), async (assignment) => {
                return {
                  name: assignment.github_username,
                  studentInfo: await getUserInfo(assignment.github_username),
                  repoURL: assignment.student_repository_url,
                  commits: await getRepoCommits(assignment),
                  points_awarded: assignment.points_awarded,
                  points_available: assignment.points_awarded
                }
              }))
            }
          ]
        }
        console.log(classroom)
        const json = JSON.stringify(classroom)
        fs.writeFileSync('data.json', json)
      }

    }
  )
}

parseAssignment()
