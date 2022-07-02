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
