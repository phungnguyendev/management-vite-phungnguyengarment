import { Button, ButtonProps, Flex, Input, Spin, Switch, Typography } from 'antd'
import { SearchProps } from 'antd/es/input'
import { SwitchProps } from 'antd/lib'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'

interface Props extends React.HTMLAttributes<HTMLElement> {
  loading?: boolean
  onLoading?: (enable: boolean) => void
  searchProps: SearchProps
  sortProps?: SwitchProps
  deleteProps?: SwitchProps
  addNewProps?: ButtonProps
}

const { Search } = Input

const BaseLayout: React.FC<Props> = ({
  searchProps,
  sortProps,
  deleteProps,
  addNewProps,
  children,
  loading,
  // onLoading,
  ...props
}) => {
  const [searchText, setSearchText] = useState<string>('')

  return (
    <div {...props} className='w-full'>
      <Flex vertical gap={20} className='w-full'>
        {props.title && <Typography.Title level={2}>{props.title}</Typography.Title>}
        <Flex vertical gap={20} className='w-full'>
          {searchProps && (
            <Search
              {...searchProps}
              placeholder={searchProps.placeholder ?? 'Search...'}
              size='middle'
              enterButton
              value={searchProps.value ?? searchText}
              onChange={(e) => {
                props.onChange?.(e)
                setSearchText(e.target.value)
              }}
              className='w-full lg:hidden'
              name='search'
              allowClear
            />
          )}
          <Flex justify='space-between' className='w-full' align='start' gap={20}>
            <Flex gap={20} align='start' className='w-full flex-col'>
              {searchProps && (
                <Search
                  {...searchProps}
                  placeholder={searchProps.placeholder ?? 'Search...'}
                  size='middle'
                  enterButton
                  value={searchProps.value ?? searchText}
                  onChange={(e) => {
                    props.onChange?.(e)
                    setSearchText(e.target.value)
                  }}
                  className='hidden w-full lg:block lg:w-2/3'
                  name='search'
                  allowClear
                />
              )}
              <Flex gap={10} className='w-full'>
                {sortProps && (
                  <Switch {...sortProps} checkedChildren='Sắp xếp' unCheckedChildren='Sắp xếp' defaultChecked={false} />
                )}
                {deleteProps && <Switch {...deleteProps} checkedChildren='Đã xoá' unCheckedChildren='Đã xoá' />}
              </Flex>
            </Flex>
            <Flex gap={10} align='center' justify='flex-end' className='w-fit'>
              {addNewProps && (
                <Button {...addNewProps} className='flex items-center' type='primary' icon={<Plus size={20} />}>
                  Mới
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
        {loading ? <Spin /> : children}
      </Flex>
    </div>
  )
}

export default BaseLayout
