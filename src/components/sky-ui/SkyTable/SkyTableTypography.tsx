import { Typography } from 'antd'
import { BlockProps } from 'antd/es/typography/Base'
import { ItemStatusType } from '~/typing'
import { cn } from '~/utils/helpers'
import DotRequired from '../DotRequired'

export interface SkyTableTypographyProps extends BlockProps {
  status?: ItemStatusType | null
  required?: boolean
}

const SkyTableTypography = ({ status, required, ...props }: SkyTableTypographyProps) => {
  return (
    <Typography.Text
      {...props}
      delete={status === 'deleted'}
      className={cn('w-full flex-shrink-0', props.className)}
      type={props.type ? props.type : props.type ? props.type : status === 'deleted' ? 'danger' : undefined}
    >
      {props.children} {required && <DotRequired />}
    </Typography.Text>
  )
}

export default SkyTableTypography
