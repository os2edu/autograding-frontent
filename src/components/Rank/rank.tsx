import React, { useState, useMemo } from 'react'
import { Table, Tag, Button } from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { ColumnsType } from 'antd/lib/table'
import { orderBy, isEmpty } from 'lodash'
import Icon from '../../components/Icon'
import type { TAssignment, IAssignment, TStudentHomework } from './types'
import Search, { ISearchProps } from './search'

import exerciseData from '../../data/exercise.json'

dayjs.extend(relativeTime)

interface IRankListProps {
  assignment?: TAssignment
}


const RankList = (props: IRankListProps) => {
  const [query, setQuery] = useState<Partial<ISearchProps>>({})

  const columns: ColumnsType<TStudentHomework> = useMemo(
    () => [
      {
        title: '排名',
        dataIndex: 'rank',
        align: 'center',
        key: 'rank',
        render(_text: any, _record: TStudentHomework, index: number) {
          let content: any = index + 1
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
        title: '学生',
        align: 'center',
        dataIndex: 'name',
        className: "top-three",
        key: 'name'
      },
      {
        title: '分数',
        align: 'center',
        dataIndex: 'points_awarded',
        className: "top-three",
        key: 'score',
      },
      {
        title: '状态',
        align: 'center',
        dataIndex: 'points_available',
        key: 'points_available',
        render(_text: string, record: TStudentHomework) {
          const passed = Number(record.points_awarded) > 0 && record.points_awarded === record.points_available
          return <Tag color={passed ? 'green' : 'red'}>{passed ? '成功' : '失败'}</Tag>
        }
      },
      // {
      //   title: 'Use Case',
      //   align: 'center',
      //   dataIndex: 'useCase',
      //   key: 'useCase',
      //   className: 'use-case',
      //   render(_text: string, record: TStudentHomework) {
      //     return (
      //       <span>
      //         {record.passCase}/{props.assignment!.useCases}
      //         <span style={{ marginLeft: 8 }}>
      //           <Icon symbol="icon-autoround_rank_fill" />
      //         </span>
      //       </span>
      //     )
      //   }
      // },
      {
        title: '版本',
        align: 'center',
        dataIndex: 'commits',
        key: 'commits',
        render(_text: any, record: TStudentHomework) {
          return record.commits.length > 0 ? (
            <Button type="link" onClick={() => window.open(`${record.repoURL}/commits/main`)}>
              {record.commits.length}
            </Button>
          ) : '-'
        }
      },
      {
        title: '耗时',
        align: 'center',
        dataIndex: 'executeSpendTime',
        key: 'executeSpendTime',
        render(text: string) {
          return text ? `${text}s` : '-'
        }
      },
      {
        title: '语言',
        align: 'center',
        dataIndex: 'languages',
        key: 'languages',
        render(text: string[]) {
          return text?.map((l) => <Tag key={l}>{l}</Tag>)
        }
      },
      {
        title: '提交时间',
        align: 'center',
        dataIndex: 'submission_timestamp',
        key: 'submission_timestamp',
        render(text) {
          return text ? dayjs(text).fromNow() : '-'
        }
      },
      {
        title: '作业仓库',
        align: 'center',
        dataIndex: 'operate',
        key: 'operate',
        render(_text: any, record: TStudentHomework) {
          return (
            <Icon style={{ cursor: 'pointer' }} symbol='icon-autorizhi' onClick={() => window.open(record.repoURL)} />
          )
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.assignment?.id]
  )

  const assignmentId = props.assignment?.id
  let dataSource: TStudentHomework[] = useMemo(
    () =>
      orderBy(
        props.assignment?.student_repositories,
        ['points_awarded', 'submission_timestamp'],
        ['desc', 'asc']
      ),
    [assignmentId]
  )
  dataSource = dataSource.filter((item: TStudentHomework) => {
    let searchName = true
    let searchAssignment = true
    let searchLuanage = true
    if (query.name) {
      searchName = item.name.toLowerCase().includes(query.name.toLowerCase())
    }

    // if (query.assignment) {
    //   searchAssignment = item.assignmentTitle.toLowerCase().includes(query.assignment.toLowerCase())
    // }

    // if (!isEmpty(query.language)) {
    //   searchLuanage = item.languages.some((l) => query.language?.includes(l))
    // }

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