import { Button, ButtonProps, Flex, Spin, Switch, Typography } from 'antd'
import { SearchProps } from 'antd/es/input'
import { SwitchProps } from 'antd/lib'
import { Plus } from 'lucide-react'
import React from 'react'
import ExportToExcel, { ExportToExcelProps } from '../sky-ui/ExportToExcel'
import SearchBar from '../sky-ui/SearchBar'

interface BaseLayoutProps extends React.HTMLAttributes<HTMLElement> {
  loading?: boolean
  onLoading?: (enable: boolean) => void
  searchProps: SearchProps
  sortProps?: SwitchProps
  deleteProps?: SwitchProps
  addNewProps?: ButtonProps
  exportAsExcelProps?: ExportToExcelProps
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  searchProps,
  sortProps,
  deleteProps,
  addNewProps,
  children,
  loading,
  exportAsExcelProps,
  ...props
}) => {
  return (
    <div {...props} className='w-full'>
      <Flex vertical gap={40} className='w-full'>
        {props.title && (
          <Typography.Title level={2} className='ml-5 md:m-0'>
            {props.title}
          </Typography.Title>
        )}
        <Flex vertical gap={20} className='w-full rounded-md bg-white p-5'>
          <Flex gap={20} align='center' className='w-full flex-col md:flex-row'>
            {searchProps && <SearchBar {...searchProps} className='w-full md:w-[500px]' />}
            <Flex justify='space-between' align='center' className='w-full'>
              <Flex gap={10} align='center' className='w-full'>
                {sortProps && (
                  <Switch {...sortProps} checkedChildren='Sorted' unCheckedChildren='Sort' defaultChecked={false} />
                )}
                {deleteProps && (
                  <Switch {...deleteProps} checkedChildren='Deleted list' unCheckedChildren='Deleted list' />
                )}
                {exportAsExcelProps && <ExportToExcel {...exportAsExcelProps} />}
              </Flex>
              {addNewProps && (
                <Button {...addNewProps} className='flex items-center' type='primary' icon={<Plus size={20} />}>
                  Add
                </Button>
              )}
            </Flex>
          </Flex>
          {loading ? <Spin /> : children}
        </Flex>
      </Flex>
    </div>
  )
}

export default BaseLayout
