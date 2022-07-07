import React, { useState, useMemo } from 'react'
import { Table, Button } from 'antd'
import { orderBy, isEmpty, map, groupBy, keys, reduce } from 'lodash'
import Icon from '../../components/Icon'
import type { ColumnsType } from 'antd/lib/table'
import type { IClassroom, IAssignment, IExercise } from './types'
import Search, { ISearchProps } from './search'
import AssignmentBar from './assignmentBar'

import exerciseData from '../../data/exercise.json'
import { render } from '@testing-library/react'

interface IProps {
  classroom?: IClassroom
}

interface IDatasourceAssignment extends IAssignment {
  score: number
}
interface IDatasource {
  repoOwner: string
  repoURL: string
  assigments: IDatasourceAssignment[]
  assigmentsMap: Record<string, IDatasourceAssignment>
  totalScore: number
  averageScore: number
}

const ClassRoomRank = (props: IProps) => {
  const [query, setQuery] = useState<Partial<ISearchProps>>({})

  const classroomId = props.classroom?.id
  const assimentsIds = map(props.classroom?.assignments, 'id')
  const columns: ColumnsType<IDatasource> = useMemo(
    () => [
      {
        title: 'Rank',
        dataIndex: 'rank',
        align: 'center',
        key: 'rank',
        render(_text: any, _record: IDatasource, index: number) {
          let content: any = index
          switch (index) {
            case 0:
              content = <Icon symbol="icon-autojiangbei-" />
              break
            case 1:
              content = <Icon symbol="icon-autojiangbei-1" />
              break
            case 2:
              content = <Icon symbol="icon-autojiangbei-2" />
              break
            default:
              break
          }
          return <span className="rank-modal">{content}</span>
        }
      },
      {
        title: 'Name',
        align: 'center',
        dataIndex: 'repoOwner',
        className: 'top-three',
        key: 'repoOwner',
        render(text: string, record: IDatasource) {
          return <span className="link" onClick={() => window.location.assign(record.repoURL)}>{text}</span>
        }
      },
      {
        title: 'Score',
        align: 'center',
        dataIndex: 'averageScore',
        className: 'top-three',
        key: 'averageScore'
      },
      ...(map(props.classroom?.assignments, (item) => {
        return {
          title: item.title,
          dataIndex: `assignments-${item.id}`,
          align: 'center',
          key: item.id,
          render(_text: string, record: IDatasource) {
            if (record.assigmentsMap[item.id]) {
              const currentAssigment = record.assigmentsMap[item.id]
              return <AssignmentBar score={currentAssigment.score * 100} />
            }
            return <span>-</span>
          }
        }
      }) as ColumnsType<IDatasource>),
      {
        title: 'like',
        dataIndex: 'like',
        key: 'like',
        render() {
          return (
            <span style={{ fontSize: 18 }}>
              <Icon symbol="icon-autolike" />
            </span>
          )
        }
      },
      {
        title: 'Detail',
        dataIndex: 'detail',
        key: 'detail',
        render() {
          return (
            <Button type="link" onClick={() => console.log('click')}>
              View
            </Button>
          )
        }
      }
    ],
    [classroomId]
  )

  let dataSource: IDatasource[] = useMemo(() => {
    exerciseData.filter((item) => assimentsIds.includes(item.assignmentId))
    const groupData = groupBy(exerciseData, 'repoOwner')
    const repoOwners = keys(groupData)
    let rankList: IDatasource[] = map(repoOwners, (repoOwner) => {
      const exercises = groupData[repoOwner]
      const assigmentsMap: Record<string, IDatasourceAssignment> = {}
      let assigments: IDatasourceAssignment[] =
        props.classroom?.assignments.map((assignment) => {
          const exercise = exercises.find(({ assignmentId }) => assignment.id === assignmentId)
          let score = -100
          let result = {
            ...assignment,
            score
          }
          if (exercise) {
            score = exercise.passCase / assignment.useCases
            result.score = score
            assigmentsMap[assignment.id] = result
          }
          return result
        }) || []
      assigments = assigments.filter(({ score }) => score !== -100)
      const totalScore = reduce(
        assigments,
        (total, item) => {
          return total + item.score
        },
        0
      )

      return {
        repoOwner,
        repoURL: 'xx',
        assigments,
        assigmentsMap,
        totalScore,
        averageScore: totalScore > 0 ? Number((totalScore / props.classroom!.assignments.length).toFixed(2)) * 100 : -100
      }
    })

    return orderBy(rankList, ['averageScore'], ['desc'])
  }, [classroomId])


  dataSource = dataSource.filter((item: IDatasource) => {
    let searchName = true
    if (query.name) {
      searchName = item.repoOwner.toLowerCase().includes(query.name.toLowerCase())
    }
    return searchName
  })

  return (
    <div className="rank-list">
      <Search defaultQuery={query} onChange={(query) => setQuery(query)} />
      <Table
        className="rank-table"
        rowKey={'repoOwner'}
        dataSource={dataSource}
        columns={columns}
        size="middle"
      />
    </div>
  )
}

export default ClassRoomRank
