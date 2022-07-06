import React, { useState, useMemo } from 'react'
import { Table, Tag, Button } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { orderBy, isEmpty } from 'lodash'
import Icon from '../../components/Icon'
import type { IAssignment, IExercise } from './types'
import Search, { ISearchProps } from './search'

import exerciseData from '../../data/exercise.json'

interface IRankListProps {
  assignment?: IAssignment
}


const RankList = (props: IRankListProps) => {
  const [query, setQuery] = useState<Partial<ISearchProps>>({})

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
        className: "top-three",
        key: 'repoOwner'
      },
      {
        title: 'Score',
        align: 'center',
        dataIndex: 'score',
        className: "top-three",
        key: 'score',
        render(_text, record) {
          let score = record.passCase / props.assignment!.useCases
          return <span> {Number(score.toFixed(2)) * 100}</span>
        }
      },
      {
        title: 'Result',
        align: 'center',
        dataIndex: 'passCase',
        key: 'passCase',
        render(_text: string, record: IExercise) {
          const passed = record.passCase === props.assignment!.useCases
          return <Tag color={passed ? 'green' : 'red'}>{passed ? 'passed' : 'failed'}</Tag>
        }
      },
      {
        title: 'Use Case',
        align: 'center',
        dataIndex: 'useCase',
        key: 'useCase',
        className: 'use-case',
        render(_text: string, record: IExercise) {
          return (
            <span>
              {record.passCase}/{props.assignment!.useCases}
              <span style={{ marginLeft: 8 }}>
                <Icon symbol="icon-autoround_rank_fill" />
              </span>
            </span>
          )
        }
      },
      {
        title: 'Commits',
        align: 'center',
        dataIndex: 'commits',
        key: 'commits'
      },
      {
        title: 'times',
        align: 'center',
        dataIndex: 'executeSpendTime',
        key: 'executeSpendTime',
        render(text: string) {
          return `${text}s`
        }
      },
      {
        title: 'Language',
        align: 'center',
        dataIndex: 'languages',
        key: 'languages',
        render(text: string[]) {
          return text?.map((l) => <Tag key={l}>{l}</Tag>)
        }
      },
      {
        title: 'Update',
        align: 'center',
        dataIndex: 'updateAt',
        key: 'updateAt'
      },
      {
        title: 'Link To Github',
        align: 'center',
        dataIndex: 'operate',
        key: 'operate',
        render(_text: any, record: IExercise) {
          return (
            <Button type="link" onClick={() => window.location.assign(record.repoURL)}>
              repo
            </Button>
          )
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.assignment?.id]
  )

  const assignmentId = props.assignment?.id
  let dataSource: IExercise[] = useMemo(
    () =>
      orderBy(
        exerciseData.filter((item) => item.assignmentId === assignmentId),
        ['passCase', 'submitAt'],
        ['desc', 'asc']
      ),
    [assignmentId]
  )
  dataSource = dataSource.filter((item: IExercise) => {
    let searchName = true
    let searchAssignment = true
    let searchLuanage = true
    if (query.name) {
      searchName = item.repoOwner.toLowerCase().includes(query.name.toLowerCase())
    }

    if (query.assignment) {
      searchAssignment = item.assignmentTitle.toLowerCase().includes(query.assignment.toLowerCase())
    }

    if (!isEmpty(query.language)) {
      searchLuanage = item.languages.some((l) => query.language?.includes(l))
    }

    return searchName && searchAssignment && searchLuanage
  })

  return (
    <div className="rank-list">
      <Search defaultQuery={query} onChange={(query) => setQuery(query)} />
      <Table className="rank-table" rowKey={'id'} dataSource={dataSource} columns={columns} size="middle" />
    </div>
  )

}

export default RankList;