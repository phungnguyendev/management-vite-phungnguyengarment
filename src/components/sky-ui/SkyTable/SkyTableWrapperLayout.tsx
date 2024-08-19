import { Button, ButtonProps, Flex, Spin, Switch } from 'antd'
import { SearchProps } from 'antd/es/input'
import { SwitchProps } from 'antd/lib'
import { ArrowDownWideNarrow, Plus } from 'lucide-react'
import React, { useState } from 'react'
import { isValidNumber } from '~/utils/helpers'
import DropDownFilter, { DropDownFilterProps } from '../DropDownFilter'
import SearchBar from '../SearchBar'

interface FilterProps extends DropDownFilterProps {
  count?: number
}

interface BaseLayoutProps extends React.HTMLAttributes<HTMLElement> {
  loading?: boolean
  onLoading?: (enable: boolean) => void
  searchProps: SearchProps
  sortProps?: SwitchProps
  deleteProps?: SwitchProps
  addNewProps?: ButtonProps
  filterProps?: FilterProps
  moreFrames?: React.ReactNode
}

const SkyTableWrapperLayout: React.FC<BaseLayoutProps> = ({
  searchProps,
  sortProps,
  deleteProps,
  addNewProps,
  filterProps,
  children,
  loading,
  moreFrames,
  ...props
}) => {
  const [open, setOpen] = useState<boolean>(false)

  const handleClose = () => {
    filterProps?.onClose?.()
    setOpen(false)
  }

  return (
    <>
      <Flex {...props} vertical gap={20} className='w-full rounded-md bg-white p-5'>
        <Flex gap={20} align='center' className='w-full flex-col md:flex-row'>
          {searchProps && <SearchBar {...searchProps} className='w-full md:w-[500px]' />}
          <Flex gap={20} justify='space-between' align='center' className='w-full'>
            <Flex gap={10} align='center' className='w-full'>
              {sortProps && (
                <Switch
                  {...sortProps}
                  checkedChildren='Sorted'
                  unCheckedChildren='Sort'
                  defaultChecked={false}
                  className='flex-shrink-0'
                />
              )}
              {deleteProps && (
                <Switch
                  {...deleteProps}
                  checkedChildren='Deleted list'
                  unCheckedChildren='Deleted list'
                  className='flex-shrink-0'
                />
              )}
              {moreFrames}
            </Flex>
            {filterProps && (
              <DropDownFilter open={open} items={filterProps.items} onClose={handleClose} onApply={filterProps.onApply}>
                <Button
                  className='flex items-center'
                  type='dashed'
                  icon={<ArrowDownWideNarrow size={16} />}
                  iconPosition='start'
                  disabled={open}
                  onClick={() => {
                    if (!open) setOpen((prev) => !prev)
                  }}
                >
                  <span>Filter {isValidNumber(filterProps.count) && `(${filterProps.count})`}</span>
                </Button>
              </DropDownFilter>
            )}
            {addNewProps && (
              <Button {...addNewProps} className='flex items-center' type='primary' icon={<Plus size={20} />}>
                Add
              </Button>
            )}
          </Flex>
        </Flex>
        {loading ? <Spin /> : children}
      </Flex>
    </>
  )
}

export default SkyTableWrapperLayout
