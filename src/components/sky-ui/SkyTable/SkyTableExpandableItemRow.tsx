import { Flex } from 'antd'
import { cn } from '~/utils/helpers'
import SkyTableTypography, { SkyTableTypographyProps } from './SkyTableTypography'

interface Props extends SkyTableTypographyProps {
  isEditing: boolean
}

const SkyTableSkyTableExpandableItemRow = ({ ...props }: Props) => {
  return (
    <Flex className='' gap={5}>
      <SkyTableTypography strong className={cn('w-1/2', props.className)} disabled={props.disabled} code={props.code}>
        {props.title}
      </SkyTableTypography>
      <Flex className='h-fit w-full'>{props.children}</Flex>
    </Flex>
  )
}

export default SkyTableSkyTableExpandableItemRow
