import React, { useState } from 'react'
import { Popover, Badge, Drawer } from 'antd'
import Icon from './components/Icon'
import contactImg from './teacharContact.jpeg'

interface IProps {
  isMobile?: boolean
}

const ContactIcon = ({ onClick, className }: { className?: string; onClick?: () => void }) => {
  return (
    <Badge dot={true} className={`contact ${className || ''}`}>
      <Icon symbol="icon-autobell1" onClick={onClick} />
    </Badge>
  )
}

const PCContact = () => {
  const content = (
    <div className="contact-card">
      <img src={contactImg} alt="contact-image" />
      <div className="contact-notice">
        <span>对这个网址有好的想法和建议</span>
        <span>可以加李明老师的微信，欢迎反馈!</span>
      </div>
    </div>
  )
  return (
    <Popover content={content} trigger="click" placement="bottomRight">
      <ContactIcon />
    </Popover>
  )
}

const MobileContact = () => {
  const [visible, setVisible] = useState(false)

  const onOpen = () => {
    setVisible(true)
  }
  const onClose = () => {
    setVisible(false)
  }
  return (
    <>
      <ContactIcon className="contact-mobile" onClick={onOpen} />
      <Drawer placement="bottom" visible={visible} onClose={onClose} height={320}>
        <div className="contact-card contact-card-mobile">
          <img src={contactImg} alt="contact-image" />
          <div className="contact-notice">
            <span>对这个网址有好的想法和建议</span>
            <span>可以加李明老师的微信，欢迎反馈!</span>
          </div>
        </div>
      </Drawer>
    </>
  )
}

const Contact = (props: IProps) => {
  return props.isMobile ? <MobileContact /> : <PCContact />
}

export default Contact
