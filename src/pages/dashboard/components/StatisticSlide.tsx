import { Col, ColProps, Flex, Row, Statistic, Typography } from 'antd'
import React, { HTMLAttributes, useEffect, useState } from 'react'
import { defaultRequestBody } from '~/api/client'
import ProductAPI from '~/api/services/ProductAPI'
import UserAPI from '~/api/services/UserAPI'
import useAPIService from '~/hooks/useAPIService'
import { Product, User } from '~/typing'
import { cn } from '~/utils/helpers'

interface Props extends HTMLAttributes<HTMLElement> {}

interface CartType extends ColProps {
  value: number
  type: 'red' | 'yellow' | 'blue' | 'green' | 'grey'
  status?: 'danger' | 'secondary' | 'success' | 'waring'
}

const StatisticSlide: React.FC<Props> = ({ ...props }) => {
  const productService = useAPIService<Product>(ProductAPI)
  const userService = useAPIService<User>(UserAPI)

  const [loading, setLoading] = useState<boolean>(false)
  const [products, setProducts] = useState<Product[]>([])
  const [productsDeleted, setProductsDeleted] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      await productService.getListItems(
        {
          ...defaultRequestBody,
          paginator: { page: 1, pageSize: -1 }
        },
        setLoading,
        (meta) => {
          if (!meta?.success) {
            throw new Error(meta?.message)
          } else {
            setProducts(meta.data as Product[])
          }
        }
      )

      await productService.getListItems(
        {
          ...defaultRequestBody,
          filter: { status: 'deleted', items: [-1] },
          paginator: { page: 1, pageSize: -1 }
        },
        setLoading,
        (meta) => {
          if (!meta?.success) {
            throw new Error(meta?.message)
          } else {
            setProductsDeleted(meta.data as Product[])
          }
        }
      )

      await userService.getListItems(
        {
          ...defaultRequestBody,
          paginator: { page: 1, pageSize: -1 }
        },
        setLoading,
        (meta) => {
          if (!meta?.success) {
            throw new Error(meta?.message)
          } else {
            setUsers(meta.data as User[])
          }
        }
      )
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const Card: React.FC<CartType> = ({ type, status, value, ...props }) => {
    const resultMessage = (() => {
      switch (type) {
        case 'red':
          return 'Error'
        case 'blue':
          return 'Active'
        case 'yellow':
          return 'Warning'
        case 'green':
          return 'Live'
        default:
          return 'Deleted'
      }
    })()

    return (
      <Col span={8} {...props} className={cn('relative overflow-hidden', props.className)}>
        <Flex
          vertical
          gap={20}
          align='center'
          justify='center'
          className={cn('flex items-center rounded-lg bg-gradient-to-r p-2 sm:p-3 md:p-4 lg:p-5', {
            'from-[#ffbf96] to-[#ed114b]': type === 'red',
            'from-[#dde48e] to-[#c3c31b]': type === 'yellow',
            'from-[#90caf9] to-[#047edf]': type === 'blue',
            'from-[#84d985] to-[#02d514]': type === 'green',
            'from-[#6d6d6d] to-[#000000]': type === 'grey'
          })}
        >
          <Statistic
            loading={loading}
            valueStyle={{ color: '#ffffff' }}
            title={<Typography.Text className='font-normal text-white'>{props.title}</Typography.Text>}
            value={value}
            className='h-full w-full font-bold'
          />
          <Flex gap={5} className='h-full w-full' align='center'>
            <div
              className={cn('h-2 w-2 rounded-full', {
                'bg-error': status ? status === 'danger' : type === 'red',
                'bg-warning': status ? status === 'waring' : type === 'yellow',
                'bg-success': status ? status === 'success' : type === 'blue',
                'bg-green-500': status ? status === 'danger' : type === 'green',
                'bg-black': type === 'grey'
              })}
            />
            <Typography.Text code className='text-white'>
              {resultMessage}
            </Typography.Text>
          </Flex>
          <div className='absolute -right-12 -top-6 h-20 w-20 rounded-full bg-white bg-opacity-50 md:-top-12 md:h-40 md:w-40' />
          <div className='absolute -bottom-14 -right-10 h-32 w-32 rounded-full bg-white bg-opacity-25 md:-bottom-28 md:h-48 md:w-48' />
        </Flex>
      </Col>
    )
  }

  return (
    <>
      <Flex vertical className={cn(props.className)}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} wrap className='w-full justify-around'>
          <Card
            value={products.filter((item) => item.status === 'active').length}
            type='blue'
            title='Tổng mã sản phẩm'
          />
          {/* <Card value={123} type='red' title='Tổng mã đang lỗi' /> */}
          <Card value={users.length} type='green' title='Tổng người dùng' />
          <Card value={productsDeleted.length} type='grey' title='Tổng mã đã xoá' />
        </Row>
      </Flex>
    </>
  )
}

export default StatisticSlide
