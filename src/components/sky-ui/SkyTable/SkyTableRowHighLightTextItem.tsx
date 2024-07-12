import { Typography } from 'antd'
import React from 'react'
import { cn } from '~/utils/helpers'
import { SkyTableTypographyProps } from './SkyTableTypography'

interface SkyTableRowHighLightTextItemProps extends SkyTableTypographyProps {}

const SkyTableRowHighLightTextItem: React.FC<SkyTableRowHighLightTextItemProps> = ({ type, status, ...props }) => {
  return (
    <Typography.Text
      {...props}
      className={cn(
        'w-full flex-shrink-0 rounded-sm px-2 py-1',
        {
          'text-foreground': type === 'secondary',
          'text-success': type === 'success',
          'text-warn': type === 'warning',
          'text-error': type === 'danger'
        },
        props.className
      )}
      delete={status === 'deleted'}
    >
      {props.children}
    </Typography.Text>
  )
}

export default SkyTableRowHighLightTextItem
