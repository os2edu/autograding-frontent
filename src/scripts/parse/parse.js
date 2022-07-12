const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse')
const _ = require('lodash')
const { getAuthenticated, getUserInfo, getRepoCommits, getRepoLanguages, getCIInfo, getJobs } = require('./githubAPI')

// 由于有api调用次数限制(5000/小时)，所以需要对数据做缓存操作，避免造成次数浪费
const user = require('../cache/user.json')
const language = require('../cache/language.json')
const workflow = require('../cache/workflow.json')
const job = require('../cache/job.json')
console.log(user)
console.log(job)
console.log('cache log')

//TODO: 相对于整个项目的路径
const ASSIGNMENT_DIR = '../assignments'
const EXTENSION = '.csv'

async function parseAssignment(filename) {
  return new Promise((resolve, reject) => {

    const csvFilePath = path.resolve(__dirname, `${ASSIGNMENT_DIR}/${filename}`)
    console.log("path", csvFilePath)
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
        // console.log("result:::"+result)
        if(!result) {
          console.log('parseCSVContent maybe fail...')
          return resolve()
        }
        const assignments = result.slice(1)
        if (assignments.length) {
          const classroomStr = assignments[0].assignment_url.split('/')[4]
          //TODO: 命名变量
          const classroomIdLen = 8
          const classroomTitle = classroomStr.slice(classroomIdLen + 1)
          const assignmentName = assignments[0].assignment_name
          const classroom = {
            id: classroomTitle,
            title: classroomTitle,
            assignment: {
              id: assignmentName,
              title: assignmentName,
              url: assignments[0].assignment_url,
              starter_code_url: assignments[0].starter_code_url,
              student_repositories: await Promise.all(
                _.map(assignments, async (assignment) => {
                  const repoName = assignment.student_repository_name

                  const studentInfo = user[assignment.github_username] || await getUserInfo(assignment.github_username)
                  if (studentInfo === 'NotFound') { return null };
                  user[assignment.github_username] = studentInfo

                  const languages = language[assignmentName] || await getRepoLanguages(repoName, assignmentName)
                  language[assignmentName] = languages

                  const [workflowId, runs] = await getCIInfo(repoName, workflow[repoName])
                  workflow[repoName] = workflowId
                  const withJobsRuns = await Promise.all(_.map(runs, async run => {
                    const jobs = job[run.id] || await getJobs(repoName, run.id)
                    job[run.id] = jobs
                    return {
                      ...run,
                      jobs
                    }
                  }))

                  return {
                    name: assignment.github_username,
                    studentInfo: studentInfo,
                    repoURL: assignment.student_repository_url,
                    commits: await getRepoCommits(assignment),
                    languages: languages,
                    runs: withJobsRuns,
                    submission_timestamp: assignment.submission_timestamp,
                    points_awarded: assignment.points_awarded,
                    points_available: assignment.points_awarded
                  }
                })
              )
            }
          }
          // 过滤不存在的学生
          classroom.assignment.student_repositories = classroom.assignment.student_repositories.filter(repo => !!repo)
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

  //TODO: PATH相对于项目的路径
  const filePath = path.resolve(__dirname, ASSIGNMENT_DIR)
  // console.log("filePath", filePath)

  fs.readdir(filePath, async (err, files) => {
    if (err) {
      throw new Error(err)
    }
    const csvFiles = files.filter((file) => {
      return path.extname(file).toLowerCase() === EXTENSION
    })
    let result = await Promise.all(
      csvFiles.map(async (filename) => {
        return await parseAssignment(filename)
      })
    )

    result = result.filter(result => !!result)
    const classroomGroup = _.groupBy(result, 'id')

    const classrooms = _.map(_.values(classroomGroup), (classrooms) => {
      return {
        id: classrooms[0].id,
        title: classrooms[0].title,
        assignments: _.map(classrooms, 'assignment')
      }
    })
    const json = JSON.stringify(classrooms)

    const dataPathJson = path.resolve(__dirname, '../data.json')
    fs.writeFileSync(dataPathJson, json)

    // console.log(user, language, workflow, job)
    const userPathJson = path.resolve(__dirname, '../cache/user.json')
    const languagePathJson = path.resolve(__dirname, '../cache/language.json')
    const workflowPathJson = path.resolve(__dirname, '../cache/workflow.json')
    const jobPathJson = path.resolve(__dirname, '../cache/job.json')

    fs.writeFileSync(userPathJson, JSON.stringify(user))
    fs.writeFileSync(languagePathJson, JSON.stringify(language))
    fs.writeFileSync(workflowPathJson, JSON.stringify(workflow))
    fs.writeFileSync(jobPathJson, JSON.stringify(job))
  })
}

run()
