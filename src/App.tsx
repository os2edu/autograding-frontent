import React, { useState } from 'react'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import Icon from './components/Icon'
import Rank from './components/Rank'

import './app.less'

function App() {
  const [activeKey, setActiveKey] = useState('rank')
  const items: MenuProps['items'] = [
    {
      label: 'Rank',
      key: 'rank',
      icon: <Icon symbol="icon-autorank" />
    },
    {
      label: 'Example',
      key: 'example',
      icon: <Icon symbol="icon-auto34ranking" />,
      disabled: true
    }
  ]

  const onChange = (key: string) => {
    console.log(key)
  }

  const onClick = () => {}

  return (
    <div className="container">
      <Icon symbol="icon-autoround_rank_fill" id="logo" />
      <Menu
        className="main-menu"
        onClick={onClick}
        selectedKeys={[activeKey]}
        mode="horizontal"
        items={items}
      />
      <Rank />
    </div>
  )
}

export default App
