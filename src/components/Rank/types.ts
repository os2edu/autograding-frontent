type TCommit = {
  html_url: string
}
type TStudentInfo = {
  avatar_url: string
}

type IJob = {
  id: string;
  name: string;
  conclusion: string;
  status: string;
  html_url: string;
  completed_at: string;
  started_at: string;
}

type TRun = {
  id: string;
  name: string;
  conclusion: string;
  status: string;
  check_suite_id: string;
  head_branch: string;
  html_url: string;
  run_started_at: string;
  update_at: string
  jobs: IJob[]
}

export type TStudentHomework = {
  name: string;
  studentInfo: TStudentInfo;
  repoURL: string;
  commits: TCommit[];
  languages: string[];
  runs: TRun[];
  submission_timestamp: string;
  points_awarded: string,
  points_available: string
}

export type TAssignment = {
  id: string;
  title: string;
  url: string;
  starter_code_url: string;
  student_repositories: TStudentHomework[]
}

export type TClassroom = {
  id: string
  title: string
  assignments: TAssignment[]
}