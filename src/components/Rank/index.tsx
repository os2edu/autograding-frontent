import React, { useState } from 'react'
import { Tree } from 'antd'
import type { DataNode, DirectoryTreeProps } from 'antd/lib/tree'
import RankList from './rank'
import ClassRankList from './classRank'
import { TAssignment, TClassroom } from './types'
import data from '../../scripts/data.json'

import './index.less'
import './responsive.less'

const { DirectoryTree } = Tree

// @ts-ignore
const classroomData  = data as TClassroom[]

const findClassroom = (key: string): TClassroom | undefined => {
  return classroomData.find(({ id }) => id === key)
}

const findAssignment = (key: string): TAssignment | undefined => {
  const idx = classroomData.findIndex((item) =>
    item.assignments.some((assignment) => assignment.id === key)
  )
  if (idx > -1) {
    return classroomData[idx].assignments.find((assignment) => assignment.id === key)
  }
}

// const defaultSelectedAssignment = classRoom[0].assignments[0].id
const defaultSelectedClass = data[0].id
const Rank = () => {
  const treeData: DataNode[] = data.map((item) => {
    return {
      title: item.title,
      key: item.id,
      isClass: true,
      children: item.assignments.map((assignment) => {
        return {
          title: assignment.title,
          key: assignment.id,
          isLeaf: true
        }
      })
    }
  })

  const [treeNodeId, setTreeNodeId] = useState<string>(defaultSelectedClass)
  const [isClassNode, setIsClassNode] = useState(true)

  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
    setTreeNodeId(keys[0] as string)
    //@ts-ignore
    setIsClassNode(info.node.isClass)
  }

  return (
    <div className="rank-container">
      <DirectoryTree
        className="classroom-tree"
        multiple
        expandAction={false}
        defaultSelectedKeys={[treeNodeId]}
        defaultExpandAll
        onSelect={onSelect}
        treeData={treeData}
      />
      {isClassNode ? (
        <ClassRankList classroom={findClassroom(treeNodeId)} />
      ) : (
        <RankList assignment={findAssignment(treeNodeId)} />
      )}
    </div>
  )
}

export default Rank
