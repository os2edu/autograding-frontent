import React, { useState, useMemo } from 'react'
import { Table, Button } from 'antd'
import { orderBy, isEmpty, map } from 'lodash'
import Icon from '../../components/Icon'
import type { ColumnsType } from 'antd/lib/table'
import type { IClassroom, IExercise } from './types'
import Search, { ISearchProps } from './search'

import exerciseData from '../../data/exercise.json'

interface IProps {
  classroom?: IClassroom
}

const ClassRoomRank = (props: IProps) => {
  const [query, setQuery] = useState<Partial<ISearchProps>>({})

  const classroomId = props.classroom?.id
  const assimentsIds = map(props.classroom?.assignments, 'id')
  const columns: ColumnsType<IExercise> = useMemo(
    () => [
      {
        title: 'Rank',
        dataIndex: 'rank',
        align: 'center',
        key: 'rank',
        render(_text: any, _record: IExercise, index: number) {
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
        key: 'repoOwner'
      },
      {
        title: 'Score',
        align: 'center',
        dataIndex: 'score',
        className: 'top-three',
        key: 'score',
        render() {
          //   let score = record.passCase / props.assignment!.useCases
          //   return <span> {Number(score.toFixed(2)) * 100}</span>
          return 10
        }
      },
      ...map(props.classroom?.assignments, (item) => {
        return {
          title: item.title,
          dataIndex: `assignments-${item.id}`,
          key: item.id,
          render() {
            return <span>123</span>
          }
        }
      }),
      {
        title: 'like',
        dataIndex: 'like',
        key: 'like',
        render() {
          return <span>like</span>
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

  let dataSource: IExercise[] = useMemo(
    () => exerciseData.filter((item) => assimentsIds.includes(item.assignmentId)),
    //   orderBy(
    //     exerciseData.filter((item) => assimentsIds.includes(item.assignmentId)),
    //     ['passCase', 'submitAt'],
    //     ['desc', 'asc']
    //   ),
    [classroomId]
  )

  console.log(dataSource)

  return (
    <div className="rank-list">
      <Search defaultQuery={query} onChange={(query) => setQuery(query)} />
      <Table
        className="rank-table"
        rowKey={'id'}
        dataSource={dataSource}
        columns={columns}
        size="middle"
      />
    </div>
  )
}

export default ClassRoomRank
