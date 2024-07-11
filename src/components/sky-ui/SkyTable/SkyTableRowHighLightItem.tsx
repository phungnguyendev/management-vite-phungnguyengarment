import { Typography } from 'antd'
import React from 'react'
import { cn } from '~/utils/helpers'
import { SkyTableTypographyProps } from './SkyTableTypography'

interface SkyTableRowHighLightItemProps extends SkyTableTypographyProps {}

const SkyTableRowHighLightItem: React.FC<SkyTableRowHighLightItemProps> = ({ status, type, ...props }) => {
  return (
    <Typography.Text
      {...props}
      className={cn(
        'w-full flex-shrink-0 rounded-sm px-2 py-1',
        {
          'bg-lightGrey': type === 'secondary',
          'bg-bgSuccess text-success': type === 'success',
          'bg-warn text-white': type === 'warning',
          'bg-error text-white': type === 'danger'
        },
        props.className
      )}
      delete={status === 'deleted'}
      type={type ?? (status === 'deleted' ? 'danger' : undefined)}
    >
      {props.children}
    </Typography.Text>
  )
}

export default SkyTableRowHighLightItem
