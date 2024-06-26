import { Flex, Typography } from 'antd'
import React, { HTMLAttributes, memo } from 'react'
import ProgressBar from '~/components/sky-ui/ProgressBar'
import { ProductTableDataType } from '../type'

interface Props extends HTMLAttributes<HTMLElement> {
  record: ProductTableDataType
}

interface ProcessableProps {
  list: { task: string; quantity: number }[]
}

const ProductProgressStatus: React.FC<Props> = ({ record }) => {
  const progressArr: { task: string; quantity: number }[] = [
    {
      task: 'May',
      quantity: 100
    },
    {
      task: 'Ủi',
      quantity: 20
    },
    {
      task: 'Kiểm',
      quantity: 30
    },
    {
      task: 'Hoàn thành',
      quantity: 50
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
