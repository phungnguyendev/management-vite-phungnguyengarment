import { Avatar } from 'antd'
import React from 'react'

export interface SideIconProps extends React.HTMLAttributes<HTMLElement> {
  src: string
}

const SideIcon = (src: string) => {
  return (
    <div className=''>
      <Avatar size='small' shape='square' src={<img src={src} alt='icon' />} />
    </div>
  )
}

export default SideIcon
