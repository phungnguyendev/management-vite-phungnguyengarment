import { Typography } from 'antd'
import React from 'react'
import { cn } from '~/utils/helpers'
import { SkyTableTypographyProps } from './SkyTableTypography'

interface SkyTableRowHighLightItemProps extends SkyTableTypographyProps {}

const SkyTableRowHighLightItem: React.FC<SkyTableRowHighLightItemProps> = ({ type = 'secondary', ...props }) => {
  return (
    <Typography.Text
      {...props}
      className={cn(
        'w-full flex-shrink-0 rounded-sm px-2 py-1',
        {
          'bg-lightGrey': type === 'secondary',
          'bg-success text-white': type === 'success',
          'bg-warn text-white': type === 'warning',
          'bg-error text-white': type === 'danger'
        },
        props.className
      )}
    >
      {props.children}
    </Typography.Text>
  )
}

export default SkyTableRowHighLightItem
