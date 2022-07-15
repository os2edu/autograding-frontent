import React, { useState, useMemo } from 'react'
import { Table, Tag, Button, Progress } from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { ColumnsType } from 'antd/lib/table'
import { orderBy } from 'lodash'
import Icon from '../../components/Icon'
import type { TAssignment, TStudentHomework } from './types'
import Search, { ISearchProps } from './search'

// const languageColorArra = [
//   'red',
//   'volcano',
//   'orange',
//   'gold',
//   'lime',
//   'green',
//   'cyan',
//   'blue',
//   'geekblue',
//   'purple'
// ]

dayjs.extend(relativeTime)

interface IRankListProps {
  assignment?: TAssignment
  isMobile?: boolean
}

const RankList = (props: IRankListProps) => {
  const [query, setQuery] = useState<Partial<ISearchProps>>({})

  const columns: ColumnsType<TStudentHomework> = useMemo(
    () => [
      {
        title: '排名',
        dataIndex: 'rank',
        fixed: true,
        width: 80,
        align: 'center',
        key: 'rank',
        render(text: number) {
          let content: React.ReactNode = text
          switch (text) {
            case 1:
              content = <Icon symbol="icon-autojiangbei-" />
              break
            case 2:
              content = <Icon symbol="icon-autojiangbei-1" />
              break
            case 3:
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
        fixed: true,
        width: 120,
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
              <span title={text} className="student-info-name">
                {text}
              </span>
            </span>
          )
        }
      },
      {
        title: '分数',
        align: 'center',
        width: 100,
        dataIndex: 'points_awarded',
        className: 'top-three',
        key: 'score'
      },
      {
        title: '状态',
        align: 'center',
        width: 100,
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
        width: 100,
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
        width: 100,
        dataIndex: 'executeSpendTime',
        key: 'executeSpendTime',
        render(_text: any, record: TStudentHomework) {
          const latestRun = record.runs[0]
          if (latestRun && latestRun.jobs?.[0]) {
            const { completed_at, started_at } = latestRun.jobs[0]
            const executeSecond = Math.floor(
              dayjs(completed_at).diff(dayjs(started_at), 'second', true)
            )
            return `${executeSecond}s`
          }
          return '-'
        }
      },
      // {
      //   title: '语言',
      //   align: 'center',
      //   dataIndex: 'languages',
      //   key: 'languages',
      //   render(_text: string[]) {
      //     return (
      //       <Tag
      //         style={{ height: 18, display: 'inline-flex', alignItems: 'center' }}
      //         color={languageColorArra[0]}
      //       >
      //         {_text?.[0]}
      //       </Tag>
      //     )
      //     // return text?.slice(0, 3).map((l, index) => (
      //     //   <Tag
      //     //     style={{ height: 18, lineHeight: '18px' }}
      //     //     color={languageColorArra[index]}
      //     //     key={l}
      //     //   >
      //     //     {l}
      //     //   </Tag>
      //     // ))
      //   }
      // },
      {
        title: '提交时间',
        align: 'center',
        width: 150,
        dataIndex: 'submission_timestamp',
        key: 'submission_timestamp',
        render(text) {
          return text ? dayjs(text.replace(/\s|UTC/g, '')).fromNow() : '-'
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
        width: 100,
        key: 'actions',
        render(_text: never, record: TStudentHomework) {
          const latestRun = record.runs[0]
          if (latestRun && latestRun.jobs?.[0]) {
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
      }
      // {
      //   title: '仓库',
      //   align: 'center',
      //   width: 100,
      //   dataIndex: 'operate',
      //   key: 'operate',
      //   render(_text: any, record: TStudentHomework) {
      //     return (
      //       <Icon
      //         style={{ cursor: 'pointer' }}
      //         symbol="icon-autogithub"
      //         onClick={() => window.open(record.repoURL)}
      //       />
      //     )
      //   }
      // }
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
      ).map((item, index) => ({
        ...item,
        rank: index + 1
      })),
    // eslint-disable-next-line
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
    if (props.isMobile) {
      return (
        <div className="total-passed-info">
          <Progress
            strokeColor={'rgb(82, 196, 26)'}
            trailColor="#ff4d4f"
            type="circle"
            width={40}
            style={{ fontSize: '12px' }}
            format={() => passRepos?.length}
            percent={percent}
          />
        </div>
      )
    }

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

  const setClassname = (rank: number) => {
    const ranks = ['championship', 'second-place', 'third-place']
    return ranks[rank] || ''
  }

  const renderMobileRankList = () => {
    const renderStatus = (item: TStudentHomework) => {
      const passed =
        Number(item.points_awarded) > 0 && item.points_awarded === item.points_available
      return <span className={passed ? 'green' : 'red'}>{passed ? '成功' : '失败'}</span>
    }
    const renderCommits = (record: TStudentHomework) => {
      return record.commits.length > 0 ? (
        <span onClick={() => window.open(`${record.repoURL}/commits?author=${record.name}`)}>
          {record.commits.length} {record.commits.length > 1 ? 'commits' : 'commit'}
        </span>
      ) : (
        '-'
      )
    }
    const renderExecuteSpendTime = (record: TStudentHomework) => {
      const latestRun = record.runs[0]
      if (latestRun && latestRun.jobs?.[0]) {
        const { completed_at, started_at } = latestRun.jobs[0]
        const executeSecond = Math.floor(
          dayjs(completed_at).diff(dayjs(started_at), 'second', true)
        )
        return `${executeSecond}s`
      }
      return '-'
    }
    const renderSubmission = (record: TStudentHomework) => {
      console.log(record.submission_timestamp.replace(/\s|UTC/g, ''))
      return record.submission_timestamp
        ? dayjs(record.submission_timestamp.replace(/\s|UTC/g, '')).fromNow()
        : '-'
    }

    const renderAction = (record: TStudentHomework) => {
      const latestRun = record.runs[0]
      if (latestRun && latestRun.jobs?.[0]) {
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

    return (
      <ul className="rank-table-mobile">
        {dataSource.map((item) => {
          return (
            <li
              className={`rank-table-row rank-table-row-assigment ${setClassname(
                (item.rank || 0) - 1
              )}`}
              key={item.name + item.rank}
            >
              <span className="list-order-index">{item.rank}</span>
              <span
                className="info-avartar"
                onClick={() => window.open(`https://github.com/${item.name}`)}
              >
                {(item.rank || 1000) <= 3 && (
                  <Icon className="order-hat" symbol="icon-autorexiao-huangguan" />
                )}
                <img src={item.studentInfo.avatar_url} alt="avatar" />
              </span>
              <div className="rank-info rank-info-more">
                <span className="rank-info-name">{item.name}</span>
                <span className="rank-info-status">{renderStatus(item)}</span>
                <span className="rank-info-detail">
                  <span className="commits">{renderCommits(item)}</span>
                  <span className="executeSpend-time">{renderExecuteSpendTime(item)}</span>
                  <span className="submission-time">{renderSubmission(item)}</span>
                </span>
              </div>
              <span className="rank-action">{renderAction(item)}</span>
              <span
                className={`rank-score ${
                  item.points_awarded === '100' ? 'rank-score-success' : ''
                }`}
              >
                {item.points_awarded}
              </span>
            </li>
          )
        })}
      </ul>
    )
  }
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Search
          isMobile={props.isMobile}
          defaultQuery={query}
          onChange={(query) => setQuery(query)}
          langs={dataSource[0]?.languages}
        />
        {renderComplateStatus()}
      </div>

      {props.isMobile ? (
        renderMobileRankList()
      ) : (
        <Table
          className="rank-table"
          scroll={{ x: 1440 }}
          rowKey="name"
          dataSource={dataSource}
          columns={columns}
          size="middle"
        />
      )}
    </>
  )
}

export default RankList
