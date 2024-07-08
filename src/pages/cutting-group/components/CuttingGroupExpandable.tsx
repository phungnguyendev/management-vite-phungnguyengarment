import { Flex } from 'antd'
import React from 'react'
import SkyTableExpandableItemRow from '~/components/sky-ui/SkyTable/SkyTableExpandableItemRow'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'

interface Props {
  isEditing: boolean
  index: number
  quantityArrivedRender: React.ReactNode
  dateArrivedRender: React.ReactNode
}

const CuttingGroupExpandableItemRow: React.FC<Props> = ({
  quantityArrivedRender,
  dateArrivedRender,
  isEditing,
  index
}) => {
  return (
    <>
      <Flex key={index} justify='center' align='center' className='w-full flex-col md:flex-row' gap={10}>
        <SkyTableTypography className='h-fit w-[60px]'>Lần {index}:</SkyTableTypography>
        <Flex vertical className='w-full' gap={20}>
          <SkyTableExpandableItemRow title='SL về:' isEditing={isEditing} className='w-[120px]'>
            {quantityArrivedRender}
          </SkyTableExpandableItemRow>
          <SkyTableExpandableItemRow title='Ngày về:' isEditing={isEditing} className='w-[120px]'>
            {dateArrivedRender}
          </SkyTableExpandableItemRow>
        </Flex>
      </Flex>
    </>
  )
}

export default CuttingGroupExpandableItemRow
