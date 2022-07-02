import React from 'react'
import { Tree, Table, Input, Space } from 'antd'
import type { DataNode, DirectoryTreeProps } from 'antd/lib/tree'

import './index.less'

const { DirectoryTree } = Tree
const { Search } = Input

const RankList = () => {
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

  const dataSource = [
    {
      key: '1',
      rank: '1',
      name: 'mi',
      score: '123'
    },
    {
      key: '2',
      rank: '1',
      name: 'mi',
      score: '123'
    }
  ]
  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Assignment',
      dataIndex: 'assignment',
      key: 'assignment'
    },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result'
    },
    {
      title: 'Use Case',
      dataIndex: 'useCase',
      key: 'useCase'
    },
    {
      title: 'times',
      dataIndex: 'times',
      key: 'times'
    },
    {
      title: 'Class',
      dataIndex: 'classroom',
      key: 'classroom'
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language'
    },
    {
      title: 'submit Time',
      dataIndex: 'submitTime',
      key: 'submitTime'
    },
    {
      title: 'Update',
      dataIndex: 'udpate',
      key: 'udpate'
    },
    {
      title: 'Link To Github',
      dataIndex: 'operate',
      key: 'operate'
    }
  ]
  return (
    <div className="assignment-list">
      {renderSearch()}
      <Table dataSource={dataSource} columns={columns} size="middle" />;
    </div>
  )
}

const Rank = () => {
  const treeData: DataNode[] = [
    {
      title: 'parent 0',
      key: '0-0',
      children: [
        { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
        { title: 'leaf 0-1', key: '0-0-1', isLeaf: true }
      ]
    },
    {
      title: 'parent 1',
      key: '0-1',
      children: [
        { title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
        { title: 'leaf 1-1', key: '0-1-1', isLeaf: true }
      ]
    }
  ]
  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
    console.log('Trigger Select', keys, info)
  }

  const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
    console.log('Trigger Expand', keys, info)
  }
  return (
    <div className="rank-container">
      <DirectoryTree
        className="classroom-tree"
        multiple
        defaultExpandAll
        onSelect={onSelect}
        onExpand={onExpand}
        treeData={treeData}
      />
      <RankList />
    </div>
  )
}

export default Rank
