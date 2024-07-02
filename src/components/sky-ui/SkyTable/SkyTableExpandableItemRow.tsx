import { Flex } from 'antd'
import { memo } from 'react'
import { cn } from '~/utils/helpers'
import { EditableStateCellProps } from './EditableStateCell'
import SkyTableTypography from './SkyTableTypography'

interface Props extends EditableStateCellProps {}

const SkyTableSkyTableExpandableItemRow = ({ ...props }: Props) => {
  return (
    <Flex className='w-full' align='center' justify='start' gap={5}>
      <SkyTableTypography strong className={cn('', props.className)}>
        {props.title}
      </SkyTableTypography>
      {props.children}
    </Flex>
  )
}

export default memo(SkyTableSkyTableExpandableItemRow)
