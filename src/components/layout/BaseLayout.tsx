import { Button, ButtonProps, Flex, Spin, Switch, Typography } from 'antd'
import { SearchProps } from 'antd/es/input'
import { SwitchProps } from 'antd/lib'
import { Plus } from 'lucide-react'
import React from 'react'
import SearchBar from '../sky-ui/SearchBar'

interface Props extends React.HTMLAttributes<HTMLElement> {
  loading?: boolean
  onLoading?: (enable: boolean) => void
  searchProps: SearchProps
  sortProps?: SwitchProps
  deleteProps?: SwitchProps
  addNewProps?: ButtonProps
}

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
  return (
    <div {...props} className='w-full'>
      <Flex vertical gap={20} className='w-full'>
        {props.title && <Typography.Title level={2}>{props.title}</Typography.Title>}
        <Flex vertical gap={20} className='w-full'>
          <Flex gap={20} align='start' className='w-full flex-col'>
            {searchProps && <SearchBar {...searchProps} />}
            <Flex justify='space-between' className='w-full'>
              <Flex gap={10} className='w-full'>
                {sortProps && (
                  <Switch {...sortProps} checkedChildren='Sorted' unCheckedChildren='Sort' defaultChecked={false} />
                )}
                {deleteProps && (
                  <Switch {...deleteProps} checkedChildren='Showed delete' unCheckedChildren='Show delete' />
                )}
              </Flex>
              {addNewProps && (
                <Button {...addNewProps} className='flex items-center' type='primary' icon={<Plus size={20} />}>
                  Add
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
