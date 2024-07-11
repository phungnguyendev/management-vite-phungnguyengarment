import { Typography } from 'antd'
import { BlockProps } from 'antd/es/typography/Base'
import { ItemStatusType } from '~/typing'
import { cn } from '~/utils/helpers'
import DotRequired from '../DotRequired'

export interface SkyTableTypographyProps extends BlockProps {
  status?: ItemStatusType
  required?: boolean
}

const SkyTableTypography: React.FC<SkyTableTypographyProps> = ({ status, type, required, ...props }) => {
  return (
    <Typography.Text
      {...props}
      delete={status === 'deleted'}
      type={type ?? (status === 'deleted' ? 'danger' : undefined)}
      className={cn('w-full flex-shrink-0', props.className)}
    >
      {props.children} {required && <DotRequired />}
    </Typography.Text>
  )
}

export default SkyTableTypography
