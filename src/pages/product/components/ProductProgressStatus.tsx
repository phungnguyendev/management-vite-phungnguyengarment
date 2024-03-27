import { Flex, Typography } from 'antd'
import React, { HTMLAttributes, memo } from 'react'
import { TableItemWithKey } from '~/components/hooks/useTable'
import ProgressBar from '~/components/sky-ui/ProgressBar'
import { ProductTableDataType } from '../type'

interface Props extends HTMLAttributes<HTMLElement> {
  record: TableItemWithKey<ProductTableDataType>
}

interface ProcessableProps {
  list: { task: string; quantity: number }[]
}

const ProductProgressStatus: React.FC<Props> = ({ record }) => {
  const progressArr: { task: string; quantity: number }[] = [
    {
      task: 'May',
      quantity: record.progress?.sewing ?? 0
    },
    {
      task: 'Ủi',
      quantity: record.progress?.iron ?? 0
    },
    {
      task: 'Kiểm',
      quantity: record.progress?.check ?? 0
    },
    {
      task: 'Hoàn thành',
      quantity: record.progress?.pack ?? 0
    }
  ]

  const Processable = ({ list }: ProcessableProps) => {
    return (
      <Flex className='w-full' vertical>
        {list.map((item, index) => {
          return (
            <Flex key={index} className='w-full' align='center' justify='start' gap={5}>
              <Typography.Text className='w-40 font-semibold'>{item.task}</Typography.Text>
              <Flex className='w-full' align='center' vertical>
                <ProgressBar count={item.quantity ?? 0} total={record.quantityPO ?? 0} />
                <Typography.Text type='secondary' className='w-24 font-medium'>
                  <span>{item.quantity ?? 0}</span>/<span>{record.quantityPO ?? 0}</span>
                </Typography.Text>
              </Flex>
            </Flex>
          )
        })}
      </Flex>
    )
  }

  return (
    <>
      <Processable list={progressArr} />
    </>
  )
}

export default memo(ProductProgressStatus)
