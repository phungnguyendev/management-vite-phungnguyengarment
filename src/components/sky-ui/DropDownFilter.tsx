import type { DropdownProps } from 'antd'
import { App, Button, Dropdown, Flex, Form, List, Typography } from 'antd'
import React from 'react'
import define from '~/constants'

export interface FilterItemDataType {
  label: string
  render: () => React.ReactNode
}

export interface DropDownFilterProps extends DropdownProps {
  items: FilterItemDataType[]
  onApply?: (record: any) => void
  onClose?: () => void
}

const DropDownFilter: React.FC<DropDownFilterProps> = ({ ...props }) => {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  // const divRef = useRef<HTMLDivElement>(null)

  // const handleClickOutside = (event: MouseEvent) => {
  //   if (divRef.current && !divRef.current.contains(event.target as Node)) {
  //     props.onClose?.()
  //   }
  // }

  // useEffect(() => {
  //   document.addEventListener('mousedown', handleClickOutside)
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside)
  //   }
  // }, [])

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
                  // ref={divRef}
                  gap={10}
                  vertical
                  className='h-fit w-[300px] rounded-md border-[1px] border-solid bg-white p-5 shadow-xl'
                >
                  <List
                    className='w-full'
                    itemLayout='vertical'
                    split={false}
                    grid={{
                      column: 1
                    }}
                    dataSource={props.items}
                    renderItem={(item, index) => {
                      return (
                        <List.Item key={index}>
                          <Flex vertical>
                            <Typography.Text type='secondary' className='select-none'>
                              {item.label}
                            </Typography.Text>
                            {item.render()}
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

export default DropDownFilter
