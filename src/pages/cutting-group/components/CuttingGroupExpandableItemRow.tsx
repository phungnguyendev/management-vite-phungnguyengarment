import { Flex } from 'antd'
import React from 'react'
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
          <Flex className='w-full flex-col md:flex-row' gap={5}>
            <Flex vertical className='w-full'>
              <SkyTableTypography strong disabled={disabled}>
                SL in thêu về:
              </SkyTableTypography>
            </Flex>
            <Flex className='h-fit w-full'>{quantityArrivedRender}</Flex>
          </Flex>
          <Flex className='w-full flex-col md:flex-row' gap={5}>
            <Flex vertical className='w-full'>
              <SkyTableTypography strong disabled={disabled}>
                Ngày về:
              </SkyTableTypography>
            </Flex>
            <Flex className='h-fit w-full'>{dateArrivedRender}</Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default CuttingGroupExpandableItemRow
