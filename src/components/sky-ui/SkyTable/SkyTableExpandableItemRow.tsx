import { Flex } from 'antd'
import { cn } from '~/utils/helpers'
import SkyTableTypography, { SkyTableTypographyProps } from './SkyTableTypography'

interface Props extends SkyTableTypographyProps {
  isEditing: boolean
  subTitle?: string
}

const SkyTableExpandableItemRow = ({ ...props }: Props) => {
  return (
    <Flex className='w-full' gap={5}>
      <Flex vertical className='w-full'>
        <SkyTableTypography strong className={cn('w-1/2', props.className)} disabled={props.disabled} code={props.code}>
          {props.title}
        </SkyTableTypography>
        {props.subTitle && (
          <SkyTableTypography
            className={cn('w-1/2 text-sm font-medium', props.className)}
            disabled={props.disabled}
            type='secondary'
          >
            {props.subTitle}
          </SkyTableTypography>
        )}
      </Flex>
      <Flex className='h-fit w-full'>{props.children}</Flex>
    </Flex>
  )
}

export default SkyTableExpandableItemRow
