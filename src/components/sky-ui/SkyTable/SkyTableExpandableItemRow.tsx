import { Flex } from 'antd'
import { memo } from 'react'
import { cn } from '~/utils/helpers'
import SkyTableTypography, { SkyTableTypographyProps } from './SkyTableTypography'

interface Props extends SkyTableTypographyProps {
  isEditing: boolean
}

const SkyTableSkyTableExpandableItemRow = ({ ...props }: Props) => {
  return (
    <Flex className='' gap={5}>
      <SkyTableTypography strong className={cn('w-1/2', props.className)} disabled={props.disabled}>
        {props.title}
      </SkyTableTypography>
      <Flex className='h-fit w-full'>{props.children}</Flex>
    </Flex>
  )
}

export default memo(SkyTableSkyTableExpandableItemRow)
