import { Typography } from 'antd'
import React from 'react'
import { cn } from '~/utils/helpers'
import { SkyTableTypographyProps } from './SkyTableTypography'

interface SkyTableRowHighLightItemProps extends SkyTableTypographyProps {}

const SkyTableRowHighLightItem: React.FC<SkyTableRowHighLightItemProps> = ({
  status,
  type = 'secondary',
  ...props
}) => {
  return (
    <Typography.Text
      {...props}
      className={cn(
        'w-full flex-shrink-0 rounded-sm px-2 py-1',
        {
          'bg-lightGrey text-foreground': type === 'secondary',
          'bg-bgSuccess text-success': type === 'success',
          'bg-bgWarn text-warn': type === 'warning',
          'bg-bgError text-error': type === 'danger' || status === 'deleted'
        },
        props.className
      )}
      delete={status === 'deleted'}
    >
      {props.children}
    </Typography.Text>
  )
}

export default SkyTableRowHighLightItem
