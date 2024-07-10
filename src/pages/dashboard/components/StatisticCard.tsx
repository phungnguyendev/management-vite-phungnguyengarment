import { Col, Flex, Statistic, Typography } from 'antd'
import React from 'react'
import { cn } from '~/utils/helpers'

interface StatisticCardProps {
  loading?: boolean
  title: string
  value: number | string
  subTitle: string
  type: 'danger' | 'warning' | 'success' | 'default'
}

const StatisticCard: React.FC<StatisticCardProps> = ({ loading, title, value, type = 'default', subTitle }) => {
  return (
    <>
      <Col span={6} className={cn('relative overflow-hidden')}>
        <Flex
          vertical
          gap={20}
          align='center'
          justify='center'
          className={cn('flex items-center rounded-lg p-2 sm:p-3 md:p-4 lg:p-5', {
            'bg-error': type === 'danger',
            'bg-fixing': type === 'warning',
            'bg-success': type === 'success',
            'bg-blue': type === 'default'
          })}
        >
          <Statistic
            loading={loading}
            title={<Typography.Text className='text-2xl font-bold text-white'>{title}</Typography.Text>}
            value={value}
            valueStyle={{ color: '#ffffff', fontSize: '32px', fontFamily: 'monospace' }}
            className='h-full w-full font-bold'
          />
          <Flex gap={5} className='h-full w-full' align='center'>
            <div
              className={cn('h-2 w-2 rounded-full bg-black', {
                // 'bg-black': type === 'danger',
                // 'bg-black': type === 'warning',
                // 'bg-black': type === 'success',
                // 'bg-black': type === 'default'
              })}
            />
            <Typography.Text
              code
              className={cn('text-white', {
                hidden: !subTitle
              })}
            >
              {subTitle}
            </Typography.Text>
          </Flex>
          <div className='absolute -right-12 -top-6 h-20 w-20 rounded-full bg-white bg-opacity-50 md:-top-12 md:h-40 md:w-40' />
          <div className='absolute -bottom-14 -right-10 h-32 w-32 rounded-full bg-white bg-opacity-25 md:-bottom-28 md:h-48 md:w-48' />
        </Flex>
      </Col>
    </>
  )
}

export default StatisticCard
