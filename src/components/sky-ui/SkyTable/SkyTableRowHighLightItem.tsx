import React from 'react'
import { UserRoleType } from '~/typing'
import { cn } from '~/utils/helpers'
import SkyTableTypography from './SkyTableTypography'

interface Props {
  title?: string
  role?: UserRoleType
  background?: boolean
  index?: number
}

const SkyTableRowHighLightItem: React.FC<Props> = ({ title, role, background }) => {
  return (
    <SkyTableTypography
      type={role === 'admin' ? 'success' : undefined}
      className={cn('my-[2px] h-6 rounded-sm bg-opacity-[0.06] py-1', {
        'bg-black px-2': background
      })}
    >
      {title}
    </SkyTableTypography>
  )
}

export default SkyTableRowHighLightItem
