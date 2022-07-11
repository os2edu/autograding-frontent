const _ = require('lodash')
const { Octokit } = require('octokit')
require('dotenv').config()

const { ORG, AUTH } = process.env
console.log(AUTH)
console.log(ORG)
const octokit = new Octokit({ auth: AUTH })

const userCache = {}
const languagesCache = {}

const getAuthenticated = async () => {
  const res = await octokit.rest.users.getAuthenticated()
  console.log('x-ratelimit-remaining: ', res.headers['x-ratelimit-remaining'])
  return res.data.login
}

const getUserInfo = async (student_name) => {
  if (userCache[student_name]) { return userCache[student_name] }
  try {
    const res = await octokit.request('GET /users/{username}', {
      username: student_name
    })
    const result = _.pick(res.data, 'avatar_url')
    userCache[student_name] = result
    return result
  } catch (err) {
    console.log(`NotFound Account: ${student_name}`)
    userCache[student_name] = 'NotFound'
    return 'NotFound'
  }
}

const getRepoCommits = async (assignment) => {
  try {
    const res = await octokit.request('GET /repos/{owner}/{repo}/commits', {
      owner: ORG,
      repo: assignment.student_repository_name,
      author: assignment.github_username
    })
    return _.map(res.data, (item) => _.pick(item, 'html_url'))
  } catch (err) {
    console.log(`getRepoCommits: ${err}  in ${assignment.student_repository_name}`)
    return []
  }
}

const getRepoLanguages = async (repoName, assignmentName) => {
  try {
    if (languagesCache[assignmentName]) { return languagesCache[assignmentName] }
    const res = await octokit.request('GET /repos/{owner}/{repo}/languages', {
      owner: ORG,
      repo: repoName
    })
    const languages = _.keys(res.data)
    languagesCache[assignmentName] = languages
    return languages
  } catch (err) {
    console.log(`getRepoLanguages: ${err} in ${repoName}`)
    return []
  }
}

const get_workflow_runs = async (repoName, workflowId) => {
  try {
    const res = await octokit.request(
      'GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs',
      {
        owner: ORG,
        repo: repoName,
        workflow_id: workflowId,
        per_page: 3 // 仅取最新的三条run
      }
    )
    // 最多取3条runs
    return res.data.workflow_runs
  } catch (err) {
    console.log(`get_workflow_runs: ${err} in ${repoName}`)
    return []
  }
}
const getJobs = async (repoName, runId) => {
  try {
    const res = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs', {
      owner: ORG,
      repo: repoName,
      run_id: runId
    })
    return res.data.jobs.map((item) =>
      _.pick(item, ['id', 'name', 'html_url', 'conclusion', 'status', 'completed_at', 'started_at'])
    )
  } catch (err) {
    console.log(`getJobs: ${err} in ${repoName}`)
    return []
  }
}

async function getClassroomWorkflowId(repoName) {
  try {
    const resWorkflows = await octokit.request('GET /repos/{owner}/{repo}/actions/workflows', {
      owner: ORG,
      repo: repoName
    })
    const classroomWorkflow = resWorkflows.data.workflows.find(
      (workflow) =>
        workflow.name.includes('GitHub Classroom Workflow') || workflow.path.includes('classroom.yml')
    )
    return (classroomWorkflow || {}).id
  } catch (err) {
    console.log(`getClassroomWorkflowId: ${err} in ${repoName}`)
    return undefined
  }
}
const getCIInfo = async (repoName, workflow_id) => {
  try {
    const classroomWorkflowId = workflow_id || await getClassroomWorkflowId(repoName)
    if (classroomWorkflowId) {
      const resRuns = await get_workflow_runs(repoName, classroomWorkflowId)
      const runs = await Promise.all(resRuns.map(async (item) => (
        _.pick(item, [
          'id',
          'name',
          'conclusion',
          'status',
          'check_suite_id',
          'head_branch',
          'html_url',
          'run_started_at',
          'update_at'
        ])
      ))
      )
      return [classroomWorkflowId, runs]
    }
    return []
  } catch (err) {
    console.log(`getCIInfo ${err} in ${repoName}`)
    return []
  }
}

module.exports = {
  getAuthenticated,
  getUserInfo,
  getRepoCommits,
  getRepoLanguages,
  getCIInfo,
  getJobs
}