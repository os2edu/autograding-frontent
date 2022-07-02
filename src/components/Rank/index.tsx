import React, { useState, useMemo } from 'react'
import { Tree, Table, Input, Space, Tag, Button } from 'antd'
import type { DataNode, DirectoryTreeProps } from 'antd/lib/tree'
import type { IAssignment, IExercise } from './types'

import classRoom from '../../data/classAndAssignment.json'
import exerciseData from '../../data/exercise.json'

import './index.less'

const { DirectoryTree } = Tree
const { Search } = Input

interface IRankListProps {
  assignment?: IAssignment
}

const findAssignment = (key: string) => {
  const idx = classRoom.findIndex((item) =>
    item.assignments.some((assignment) => assignment.id === key)
  )
  if (idx > -1) {
    return classRoom[idx].assignments.find((assignment) => assignment.id === key)
  }
}

const RankList = (props: IRankListProps) => {
  console.log(props)
  const columns = useMemo(
    () => [
      {
        title: 'Rank',
        dataIndex: 'rank',
        key: 'rank'
      },
      {
        title: 'Name',
        dataIndex: 'repoOwner',
        key: 'repoOwner'
      },
      {
        title: 'Assignment',
        dataIndex: 'assignmentTitle',
        key: 'assignmentTitle'
      },
      {
        title: 'Result',
        dataIndex: 'passCase',
        key: 'passCase',
        render(_text: string, record: IExercise) {
          const passed = record.passCase === props.assignment!.useCases
          return <Tag color={passed ? 'green' : 'red'}>{passed ? 'passed' : 'failed'}</Tag>
        }
      },
      {
        title: 'Use Case',
        dataIndex: 'useCase',
        key: 'useCase',
        render(_text: string, record: IExercise) {
          return (
            <span>
              {record.passCase}/{props.assignment!.useCases}
            </span>
          )
        }
      },
      {
        title: 'times',
        dataIndex: 'executeSpendTime',
        key: 'executeSpendTime',
        render(text: string) {
          return `${text}s`
        }
      },
      {
        title: 'Class',
        dataIndex: 'classroomTitle',
        key: 'classroomTitle'
      },
      {
        title: 'Language',
        dataIndex: 'languages',
        key: 'languages',
        render(text: string[]) {
          return text?.map((l) => <Tag key={l}>{l}</Tag>)
        }
      },
      {
        title: 'submit Time',
        dataIndex: 'submitAt',
        key: 'submitAt'
      },
      {
        title: 'Update',
        dataIndex: 'updateAt',
        key: 'updateAt'
      },
      {
        title: 'Link To Github',
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
  const dataSource: IExercise[] = useMemo(
    () => exerciseData.filter((item) => item.assignmentId === assignmentId),
    [assignmentId]
  )
  console.log(dataSource)

  const renderSearch = () => {
    const onSearch = () => {}
    return (
      <Space size={60} style={{ marginBottom: 20 }}>
        <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />
        <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />
        <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />
      </Space>
    )
  }
  return (
    <div className="assignment-list">
      {renderSearch()}
      <Table rowKey={'id'} dataSource={dataSource} columns={columns} size="middle" />
    </div>
  )
}

const defaultSelectedAssignment = classRoom[0].assignments[0].id
const Rank = () => {
  const treeData: DataNode[] = classRoom.map((item) => {
    return {
      title: item.title,
      key: item.id,
      children: item.assignments.map((assignment) => {
        return {
          title: assignment.title,
          key: assignment.id,
          isLeaf: true
        }
      })
    }
  })

  const [selectedAssignmentId, setSelectedAssignmentId] =
    useState<string>(defaultSelectedAssignment)

  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
    console.log('Trigger Select', keys, info)
    setSelectedAssignmentId(keys[0] as string)
  }

  const selectedAssignment = findAssignment(selectedAssignmentId)

  return (
    <div className="rank-container">
      <DirectoryTree
        className="classroom-tree"
        multiple
        defaultSelectedKeys={[selectedAssignmentId]}
        defaultExpandAll
        onSelect={onSelect}
        treeData={treeData}
      />
      <RankList assignment={selectedAssignment} />
    </div>
  )
}

export default Rank
