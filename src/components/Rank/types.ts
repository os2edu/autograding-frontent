export interface IClassroom {
  id: string
  title: string
  desc: string
  assignments: IAssignment[]
}

export interface IAssignment {
  id: string
  title: string
  desc: string
  deadline: string
  useCases: number
}

export interface IExercise {
  id: string
  repoOwner: string
  repoURL: string

  classroomId: string
  classroomTitle: string
  assignmentId: string
  assignmentTitle: string

  passCase: number
  executeSpendTime: number
  languages: string[]

  submitAt: string
  updateAt: string
}


export type TStudentHomework = {
  name: string;
  studentInfo: any;
  repoURL: string;
  commits: any[];
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