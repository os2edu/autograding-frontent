const _ = require('lodash')
const { Octokit } = require('octokit')

const octokit = new Octokit({ auth: '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' })

const ORG = 'LearningOS'

const userCache = {}
const languagesCache = {}

const getAuthenticated = async () => {
  const res = await octokit.rest.users.getAuthenticated()
  return res.data.login
}

const getUserInfo = async (student_name) => {
  if(userCache[student_name]) { return userCache[student_name] }
  const res = await octokit.request('GET /users/{username}', {
    username: student_name
  })
  const result = _.pick(res.data, 'avatar_url')
  userCache[student_name] = result
  return result
}

const getRepoCommits = async (assignment) => {
  const res = await octokit.request('GET /repos/{owner}/{repo}/commits', {
    owner: ORG,
    repo: assignment.student_repository_name,
    author: assignment.github_username
  })
  return _.map(res.data, (item) => _.pick(item, 'html_url'))
}

const getRepoLanguages = async (repoName) => {
  if(languagesCache[repoName]) { return languagesCache[repoName]}
  const res = await octokit.request('GET /repos/{owner}/{repo}/languages', {
    owner: ORG,
    repo: repoName
  })
  const languages = _.keys(res.data)
  languagesCache[repoName] = languages
  return languages
}

const get_workflow_runs = async (repoName, workflowId) => {
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
}
const get_jobs = async (repoName, runId) => {
  const res = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs', {
    owner: ORG,
    repo: repoName,
    run_id: runId
  })
  return res.data.jobs.map((item) =>
    _.pick(item, ['id', 'name', 'html_url', 'conclusion', 'status', 'completed_at', 'started_at'])
  )
}
const get_runs_and_jobs = async (repoName) => {
  const resWorkflows = await octokit.request('GET /repos/{owner}/{repo}/actions/workflows', {
    owner: ORG,
    repo: repoName
  })
  const classroomWorkflow = resWorkflows.data.workflows.find(
    (workflow) =>
      workflow.name.includes('GitHub Classroom Workflow') || workflow.path.includes('classroom.yml')
  )
  if (classroomWorkflow) {
    const resRuns = await get_workflow_runs(repoName, classroomWorkflow.id)
    return await Promise.all(
      resRuns.map(async (item) => ({
        ..._.pick(item, [
          'id',
          'name',
          'conclusion',
          'status',
          'check_suite_id',
          'head_branch',
          'html_url',
          'run_started_at',
          'update_at'
        ]),
        jobs: await get_jobs(repoName, item.id)
      }))
    )
  }
  return []
}

module.exports = {
    getAuthenticated,
    getUserInfo,
    getRepoCommits,
    getRepoLanguages,
    get_runs_and_jobs
}