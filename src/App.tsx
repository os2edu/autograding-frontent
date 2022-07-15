import React, { useState } from 'react'
import { Menu } from 'antd'
import Icon from './components/Icon'
import Rank from './components/Rank'
import dayjs from 'dayjs'
import MobileDetect from 'mobile-detect'
import Contact from './Contact'
import 'dayjs/locale/zh-cn'

import './app.less'
import './responsive.less'

dayjs.locale('zh-cn')

const md = new MobileDetect(window.navigator.userAgent)
export function isMobile() {
  return !!md.mobile()
}

function App() {
  const [activeKey /*, setActiveKey*/] = useState('rank')
  const items = [
    {
      label: '排行榜',
      key: 'rank',
      icon: <Icon symbol="icon-autorank1" />
    }
    // {
    //   label: '点赞排行榜',
    //   key: 'favorite',
    //   icon: <Icon symbol="icon-auto34ranking" />,
    //   disabled: true
    // },
    // {
    //   label: '夜猫子排行榜',
    //   key: 'catNight',
    //   icon: <Icon symbol="icon-auto34ranking" />,
    //   disabled: true
    // }
  ]

  const mobile = isMobile()

  return (
    <div className={`container ${mobile ? 'container-mobile' : ''}`}>
      <header>
        <div id="logo-box">
          <Icon symbol="icon-autojiangbei" id="logo" />
          <div className="logo-title">
            <span>2022开源操作系统训练营排行榜</span>
          </div>
        </div>
        <Contact isMobile={mobile} />
        {mobile ? (
          <div style={{ marginTop: 10 }} />
        ) : (
          // <ul className="main-menu">
          //   {items.map((item) => (
          //     <li className={`${item.key === activeKey ? 'active' : ''}`} key={item.key}>
          //       {item.label}
          //     </li>
          //   ))}
          // </ul>
          <></>
          // <Menu
          //   className="main-menu"
          //   onClick={onClick}
          //   selectedKeys={[activeKey]}
          //   mode="horizontal"
          //   items={items}
          // />
        )}
      </header>
      <Rank isMobile={mobile} />
    </div>
  )
}

export default App
