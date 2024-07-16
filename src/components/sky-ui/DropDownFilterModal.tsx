import type { DropdownProps, MenuProps } from 'antd'
import { Dropdown, Flex, Select, Typography } from 'antd'
import React from 'react'

export interface DropDownFilterModalProps extends DropdownProps {}

const DropDownFilterModal: React.FC<DropDownFilterModalProps> = ({ ...props }) => {
  const items: MenuProps['items'] = [
    {
      key: '0',
      label: (
        <>
          <Flex vertical gap={5}>
            <Typography.Text>123</Typography.Text>
            <Select
              defaultValue='lucy'
              style={{ width: 120 }}
              options={[
                { value: 'jack', label: 'Jack' },
                { value: 'lucy', label: 'Lucy' },
                { value: 'Yiminghe', label: 'yiminghe' },
                { value: 'disabled', label: 'Disabled', disabled: true }
              ]}
            />
          </Flex>
        </>
      )
    },
    {
      label: <a href='https://www.aliyun.com'>2nd menu item</a>,
      key: '1'
    },
    {
      type: 'divider'
    },
    {
      label: '3rd menu item',
      key: '3'
    }
  ]

  return (
    <>
      <Dropdown {...props} menu={{ items }} trigger={['click']}>
        {props.children}
      </Dropdown>
    </>
  )
}

export default DropDownFilterModal
