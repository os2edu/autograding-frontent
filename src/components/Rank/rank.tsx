import React, { useState, useMemo } from 'react'
import { Table, Tag, Button, Progress } from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { ColumnsType } from 'antd/lib/table'
import { orderBy } from 'lodash'
import Icon from '../../components/Icon'
import type { TAssignment, TStudentHomework } from './types'
import Search, { ISearchProps } from './search'

const languageColorArra = [
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple'
]

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
        className: 'top-three',
        render(text: string, record: TStudentHomework) {
          return (
            <span
              className="link student-info"
              onClick={() => window.open(`https://github.com/${text}`)}
            >
              {record.studentInfo.avatar_url && (
                <img src={record.studentInfo.avatar_url} alt="avatar" />
              )}
              {text}
            </span>
          )
        }
      },
      {
        title: '分数',
        align: 'center',
        dataIndex: 'points_awarded',
        className: 'top-three',
        key: 'score'
      },
      {
        title: '状态',
        align: 'center',
        dataIndex: 'points_available',
        key: 'points_available',
        render(_text: string, record: TStudentHomework) {
          const passed =
            Number(record.points_awarded) > 0 && record.points_awarded === record.points_available
          return <Tag color={passed ? 'green' : 'red'}>{passed ? '成功' : '失败'}</Tag>
        }
      },
      {
        title: '版本',
        align: 'center',
        dataIndex: 'commits',
        key: 'commits',
        render(_text: any, record: TStudentHomework) {
          return record.commits.length > 0 ? (
            <Button
              type="link"
              onClick={() => window.open(`${record.repoURL}/commits?author=${record.name}`)}
            >
              {record.commits.length} {record.commits.length > 1 ? 'commits' : 'commit'}
            </Button>
          ) : (
            '-'
          )
        }
      },
      {
        title: '耗时',
        align: 'center',
        dataIndex: 'executeSpendTime',
        key: 'executeSpendTime',
        render(_text: any, record: TStudentHomework) {
          const latestRun = record.runs[0]
          if (latestRun) {
            const { completed_at, started_at } = latestRun.jobs[0]
            const executeSecond = Math.floor(
              dayjs(completed_at).diff(dayjs(started_at), 'second', true)
            )
            return `${executeSecond}s`
          }
          return '-'
        }
      },
      {
        title: '语言',
        align: 'center',
        dataIndex: 'languages',
        key: 'languages',
        render(text: string[]) {
          return text?.slice(0, 3).map((l, index) => (
            <Tag
              style={{ height: 18, lineHeight: '18px' }}
              color={languageColorArra[index]}
              key={l}
            >
              {l}
            </Tag>
          ))
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
      // {
      //   title: '更新时间',
      //   align: 'center',
      //   dataIndex: 'update_at',
      //   key: 'update_at',
      //   render(_text: never, record: TStudentHomework) {
      //     const latestRun = record.runs[0]
      //     if (latestRun && latestRun.run_started_at) {
      //       return dayjs(latestRun.run_started_at).fromNow()
      //     }
      //     return '-'
      //   }
      // },
      {
        title: 'Action',
        align: 'center',
        dataIndex: 'actions',
        key: 'actions',
        render(_text: never, record: TStudentHomework) {
          const latestRun = record.runs[0]
          if (latestRun) {
            const url = latestRun.jobs[0].html_url
            return (
              <Icon
                style={{ cursor: 'pointer' }}
                symbol="icon-autowj-rz"
                onClick={() => window.open(url)}
              />
            )
          }
          return '-'
        }
      },
      {
        title: '仓库',
        align: 'center',
        dataIndex: 'operate',
        key: 'operate',
        render(_text: any, record: TStudentHomework) {
          return (
            <Icon
              style={{ cursor: 'pointer' }}
              symbol="icon-autogithub"
              onClick={() => window.open(record.repoURL)}
            />
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

  const renderComplateStatus = () => {
    const passRepos = props.assignment?.student_repositories.filter(
      (item) => item.submission_timestamp && item.points_awarded === '100'
    )

    const percent = (passRepos!.length / props.assignment!.student_repositories.length) * 100

    return (
      <div className="total-passed-info">
        <div className="passed-count">
          <span>完成作业</span>
          <span>
            {passRepos?.length}/{props.assignment?.student_repositories.length}
          </span>
        </div>
        <Progress
          strokeColor={'rgb(82, 196, 26)'}
          trailColor="#ff4d4f"
          percent={percent}
          showInfo={false}
        />
      </div>
    )
  }
  return (
    <div className="rank-list">
      <Search
        defaultQuery={query}
        onChange={(query) => setQuery(query)}
        langs={dataSource[0]?.languages}
      />
      {renderComplateStatus()}
      <Table
        className="rank-table"
        rowKey="name"
        dataSource={dataSource}
        columns={columns}
        size="middle"
      />
    </div>
  )
}

export default RankList
