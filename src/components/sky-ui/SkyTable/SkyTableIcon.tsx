import { Check, CircleAlert, LoaderCircle, TriangleAlert } from 'lucide-react'
import React from 'react'
import { TableStatusType } from '~/typing'

export interface SkyTableIconProps {
  type: TableStatusType
}

const SkyTableIcon: React.FC<SkyTableIconProps> = ({ type }) => {
  const content = () => {
    switch (type) {
      case 'success':
        return <Check size={16} color='#ffffff' className='relative top-[2px] m-0 rounded-full bg-success p-[2px]' />
      case 'warning':
        return (
          <TriangleAlert size={16} color='#ffffff' className='relative top-[2px] m-0 rounded-full bg-warn p-[2px]' />
        )
      case 'danger':
        return (
          <CircleAlert size={16} color='#ffffff' className='relative top-[2px] m-0 rounded-full bg-error p-[2px]' />
        )
      case 'progress':
        return (
          <LoaderCircle
            size={16}
            color='#ffffff'
            className='relative top-[2px] m-0 animate-spin rounded-full bg-warn p-[2px]'
          />
        )
      default:
        return <Check size={16} color='#ffffff' className='relative top-[2px] m-0 rounded-full bg-lightGrey p-[2px]' />
    }
  }

  return <>{content()}</>
}

export default SkyTableIcon
