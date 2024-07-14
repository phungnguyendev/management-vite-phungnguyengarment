import { Col, Flex, Spin, Typography } from 'antd'
import { LoaderCircle } from 'lucide-react'
import React from 'react'
import AnimatedNumber from '~/components/sky-ui/AnimationNumber'
import { cn } from '~/utils/helpers'

interface StatisticCardProps {
  loading?: boolean
  title: string
  value: number
  icon: React.ReactNode
  type: 'danger' | 'warning' | 'success' | 'default' | 'base'
}

const StatisticCard: React.FC<StatisticCardProps> = ({ loading, icon, title, value, type = 'default' }) => {
  return (
    <>
      <Col xs={24} sm={12} lg={6}>
        <Flex
          gap={20}
          vertical
          align='center'
          justify='center'
          className={cn('relative w-full overflow-hidden rounded-lg bg-gradient-to-r p-5', {
            'from-[#f5242e] to-[#ff8187]': type === 'danger',
            'from-[#f6c000] to-[#ffe480]': type === 'warning',
            'from-[#17c654] to-[#37ff7d]': type === 'success',
            'from-[#000000] to-[#00000080]': type === 'default',
            'from-[#0000ff] to-[#8484ff]': type === 'base'
          })}
        >
          <Flex justify='center' align='start' className='w-full' gap={20}>
            <Flex justify='center' align='center' className='h-fit w-fit text-white'>
              {icon}
            </Flex>
            <Flex vertical className='w-full' gap={10}>
              <Typography.Text className='text-md font-bold text-white'>{title.toUpperCase()}</Typography.Text>
              {loading ? (
                <Flex className='w-full'>
                  <Spin size='large' indicator={<LoaderCircle className='animate-spin text-white' strokeWidth={2} />} />
                </Flex>
              ) : (
                <AnimatedNumber end={value} duration={2000} className='text-3xl font-bold text-white' />
              )}
            </Flex>
          </Flex>
          <div className='absolute -right-16 -top-20 h-40 w-40 rounded-full bg-white bg-opacity-50' />
          <div className='absolute -right-10 top-12 h-48 w-48 rounded-full bg-white bg-opacity-25' />
        </Flex>
      </Col>
    </>
  )
}

export default StatisticCard
