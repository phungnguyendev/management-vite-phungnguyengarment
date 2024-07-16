import type { DropdownProps } from 'antd'
import { App, Button, Dropdown, Flex, Form, List, Typography } from 'antd'
import React from 'react'
import define from '~/constants'
import EditableFormCell from './SkyTable/EditableFormCell'
import { EditableStateCellProps } from './SkyTable/EditableStateCell'

export interface ItemDataType extends EditableStateCellProps {
  label: string
  dataSource: {
    key: React.Key
    label?: React.ReactNode
    value?: string | number | null
  }[]
}

export interface DropDownFilterModalProps extends DropdownProps {
  items: ItemDataType[]
  onApply?: (record: any) => void
  onClose?: () => void
}

const DropDownFilterModal: React.FC<DropDownFilterModalProps> = ({ ...props }) => {
  const { message } = App.useApp()
  const [form] = Form.useForm()

  const handleApply = async () => {
    try {
      const row = await form.validateFields()
      props.onApply?.(row)
    } catch (error) {
      message.error(define('invalidate_form'))
    }
  }

  return (
    <>
      <Dropdown
        {...props}
        trigger={['click']}
        placement='bottomRight'
        dropdownRender={() => {
          return (
            <>
              <Form form={form}>
                <Flex
                  gap={20}
                  vertical
                  className='h-fit w-[300px] rounded-md border-[1px] border-solid bg-white p-5 shadow-xl'
                >
                  <List
                    className='w-full'
                    itemLayout='vertical'
                    split={false}
                    dataSource={props.items}
                    renderItem={(item, index) => {
                      return (
                        <List.Item key={index}>
                          <Flex vertical gap={10}>
                            <Typography.Text type='secondary' className='select-none'>
                              {item.label}
                            </Typography.Text>
                            <EditableFormCell
                              {...item}
                              isEditing
                              placeholder={item.placeholder ?? `Select ${item.label.toLowerCase()}`}
                              onValueChange={(val: number) => {
                                console.log(val)
                              }}
                              selectProps={{
                                options: item.dataSource
                              }}
                            />
                          </Flex>
                        </List.Item>
                      )
                    }}
                  />
                  <Flex gap={20}>
                    <Button type='dashed' className='w-full' onClick={props.onClose}>
                      Close
                    </Button>
                    <Button type='primary' className='w-full' onClick={handleApply}>
                      Apply
                    </Button>
                  </Flex>
                </Flex>
              </Form>
            </>
          )
        }}
      >
        {props.children}
      </Dropdown>
    </>
  )
}

export default DropDownFilterModal
