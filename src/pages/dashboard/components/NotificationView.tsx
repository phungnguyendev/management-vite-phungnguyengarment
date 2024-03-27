import { Flex, List, Skeleton, Typography } from 'antd'
import dayjs from 'dayjs'
import React, { HTMLAttributes, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { defaultRequestBody } from '~/api/client'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import SewingLineDeliveryAPI from '~/api/services/SewingLineDeliveryAPI'
import useAPIService from '~/hooks/useAPIService'
import { Product, ProductColor, SewingLineDelivery } from '~/typing'
import { cn } from '~/utils/helpers'
import { NotificationDataType } from '../type'

interface Props extends HTMLAttributes<HTMLElement> {}

const NotificationView: React.FC<Props> = ({ ...props }) => {
  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const sewingLineDeliveryService = useAPIService<SewingLineDelivery>(SewingLineDeliveryAPI)

  const [loading, setLoading] = useState<boolean>(false)
  const [products, setProducts] = useState<Product[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [data, setData] = useState<NotificationDataType[]>([])
  const [sewingLineDeliveries, setSewingLineDeliveries] = useState<SewingLineDelivery[]>([])

  const loadMoreData = async () => {}

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
      await sewingLineDeliveryService.getListItems(
        {
          ...defaultRequestBody,
          paginator: { page: 1, pageSize: -1 }
        },
        setLoading,
        (meta) => {
          if (!meta?.success) {
            throw new Error(meta?.message)
          } else {
            setSewingLineDeliveries(meta.data as SewingLineDelivery[])
          }
        }
      )
      await productColorService.getListItems(
        {
          ...defaultRequestBody,
          paginator: { page: 1, pageSize: -1 }
        },
        setLoading,
        (meta) => {
          if (!meta?.success) {
            throw new Error(meta?.message)
          } else {
            setProductColors(meta.data as ProductColor[])
          }
        }
      )
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const messagesMapping = (product: Product): SewingLineDelivery[] => {
    const messages = sewingLineDeliveries.filter((item) =>
      item.productID === product.id && dayjs(product.dateOutputFCR).diff(item.expiredDate, 'days') < 5
        ? `${item.sewingLine?.name} | Bị bể`
        : undefined
    )

    return messages
  }

  useEffect(() => {
    if (products.length > 0 && sewingLineDeliveries.length > 0) {
      const items = products.filter((item) =>
        sewingLineDeliveries.some(
          (i) => i.productID === item.id && dayjs(item.dateOutputFCR).diff(i.expiredDate, 'days') < 5
        )
      )
      console.log(items)
      setData(
        items.map((item) => {
          return {
            ...item,
            key: item.id,
            messages: messagesMapping(item).map((j) => {
              return `${j.sewingLine?.name} - Bể ngày dự kiến hoàn thành`
            }),
            productColor: productColors.find((productColor) => productColor.productID === item.id)
          }
        })
      )
    }
  }, [sewingLineDeliveries, products, productColors])

  return (
    <Flex vertical>
      <Typography.Title className='m-0 w-fit' level={4}>
        Thông báo
      </Typography.Title>
      <Flex className={cn('bg-white p-3', props.className)} vertical>
        <div
          id='scrollableDiv'
          style={{
            height: 300,
            overflow: 'auto',
            padding: '0 16px'
          }}
        >
          <InfiniteScroll
            dataLength={products.length}
            next={loadMoreData}
            hasMore={products.length < 5}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            // endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            scrollableTarget='scrollableDiv'
          >
            <List
              loading={loading}
              dataSource={data}
              renderItem={(item) => (
                <List.Item key={item.key}>
                  <Flex vertical>
                    <Flex align='center' gap={10}>
                      <div className='h-[6px] w-[6px] rounded-full bg-error' />
                      <Typography.Text strong>
                        {item.productCode}{' '}
                        <Typography.Text className='font-normal'>({item.productColor?.color?.name})</Typography.Text>
                      </Typography.Text>
                    </Flex>
                    <ul className='list-none'>
                      {item.messages?.map((message, index) => {
                        return (
                          <li key={index}>
                            <Flex align='center' gap={5}>
                              <div className='h-1 w-1 rounded-full bg-warn' />
                              <Typography.Text>{message}</Typography.Text>
                            </Flex>
                          </li>
                        )
                      })}
                    </ul>
                  </Flex>
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </div>
      </Flex>
    </Flex>
  )
}

export default NotificationView
