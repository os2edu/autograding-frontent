import React, { useState } from 'react'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import Icon from './components/Icon'
import Rank from './components/Rank'
import dayjs from "dayjs"
import 'dayjs/locale/zh-cn'

import './app.less'

dayjs.locale('zh-cn')

function App() {
  const [activeKey, setActiveKey] = useState('rank')
  const items: MenuProps['items'] = [
    {
      label: 'Rank',
      key: 'rank',
      icon: <Icon symbol="icon-autorank1" />
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
      <Icon symbol="icon-autojiangbei" id="logo" />
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
