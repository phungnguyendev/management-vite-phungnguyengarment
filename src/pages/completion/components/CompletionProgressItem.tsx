import { Flex } from 'antd'
import React from 'react'
import SkyTableExpandableItemRow from '~/components/sky-ui/SkyTable/SkyTableExpandableItemRow'
import SkyTableTypography, { SkyTableTypographyProps } from '~/components/sky-ui/SkyTable/SkyTableTypography'

interface Props {
  title: string
  isEditing: boolean
  disabled?: boolean
  top: SkyTableTypographyProps
  bottom: SkyTableTypographyProps
}

const CompletionProgressItem: React.FC<Props> = ({ ...props }) => {
  return (
    <>
      <Flex className='flex-col md:flex-row' gap={20}>
        <SkyTableTypography strong className='w-full text-center md:w-1/2 md:text-start' disabled={props.disabled} code>
          {props.title}
        </SkyTableTypography>
        <Flex className='h-fit w-full'>
          <Flex vertical className='w-full' gap={20}>
            <SkyTableExpandableItemRow {...props.top} isEditing={props.isEditing} className='w-[150px]'>
              {props.top.children}
            </SkyTableExpandableItemRow>
            <SkyTableExpandableItemRow {...props.bottom} isEditing={props.isEditing} className='w-[150px]'>
              {props.bottom.children}
            </SkyTableExpandableItemRow>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default CompletionProgressItem
