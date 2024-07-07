import { Flex } from 'antd'
import React from 'react'
import SkyTableExpandableItemRow from '~/components/sky-ui/SkyTable/SkyTableExpandableItemRow'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'

interface Props {
  isEditing: boolean
  disabled?: boolean
  index: number
  quantityArrivedRender: React.ReactNode
  dateArrivedRender: React.ReactNode
}

const CuttingGroupExpandableItemRow: React.FC<Props> = ({
  quantityArrivedRender,
  dateArrivedRender,
  isEditing,
  disabled,
  index
}) => {
  return (
    <>
      <Flex>
        <SkyTableTypography strong className='w-1/2' code disabled={disabled}>
          Lần {index}:
        </SkyTableTypography>
        <Flex vertical className='w-full' gap={20}>
          <SkyTableExpandableItemRow
            title='SL in thêu về:'
            isEditing={isEditing}
            className='w-[150px]'
            disabled={disabled}
          >
            {quantityArrivedRender}
          </SkyTableExpandableItemRow>
          <SkyTableExpandableItemRow title='Ngày về:' isEditing={isEditing} className='w-[150px]' disabled={disabled}>
            {dateArrivedRender}
          </SkyTableExpandableItemRow>
        </Flex>
      </Flex>
    </>
  )
}

export default CuttingGroupExpandableItemRow
