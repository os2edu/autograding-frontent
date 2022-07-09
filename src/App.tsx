import React, { useState } from 'react'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import Icon from './components/Icon'
import Rank from './components/Rank'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

import './app.less'

dayjs.locale('zh-cn')

function App() {
  const [activeKey/*, setActiveKey*/] = useState('rank')
  const items: MenuProps['items'] = [
    {
      label: '排行榜',
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

  const onClick = () => {}

  return (
    <div className="container">
      <div id="logo-box">
        <Icon symbol="icon-autojiangbei" id="logo" />
        <div className='logo-title'>
          <span>2022开源操作系统</span>
          <span>训练营排行榜</span>
        </div>
      </div>
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
