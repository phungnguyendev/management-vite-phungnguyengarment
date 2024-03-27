import { ColorPicker, Flex, Form, Input, Modal, Typography } from 'antd'
import type { Color as AntColor } from 'antd/es/color-picker'
import React, { memo } from 'react'
import AddNewTitle from '~/components/sky-ui/AddNewTitle'
import { Color } from '~/typing'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  setOpenModal: (enable: boolean) => void
  onAddNew: (itemToAddNew: Color) => void
}

const ModalAddNewColor: React.FC<Props> = ({ openModal, setOpenModal, onAddNew, ...props }) => {
  const [form] = Form.useForm()

  async function handleOk() {
    const row = await form.validateFields()
    const hexColor = row.hexColor
      ? typeof row.hexColor === 'string'
        ? row.hexColor
        : (row.hexColor as AntColor).toHexString()
      : ''
    onAddNew({
      name: row.name,
      hexColor: hexColor
    })
  }

  function handleCancel() {
    setOpenModal(false)
  }

  return (
    <Modal
      title={<AddNewTitle title='Add new' />}
      open={openModal}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      width='auto'
    >
      <Form form={form} {...props}>
        <Flex vertical gap={10}>
          <Flex align='center' gap={5}>
            <Typography.Text className='w-24 flex-shrink-0'>Color name:</Typography.Text>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: `Please input this field!`
                }
              ]}
              name='name'
              className='m-0'
            >
              <Input className='w-52' allowClear placeholder='Orange' />
            </Form.Item>
          </Flex>
          <Flex align='center' gap={5}>
            <Typography.Text className='w-24 flex-shrink-0'>Pick color:</Typography.Text>
            <Form.Item name='hexColor' className='m-0' initialValue='#000000'>
              <ColorPicker size='middle' showText className='w-52' />
            </Form.Item>
          </Flex>
        </Flex>
      </Form>
    </Modal>
  )
}

export default memo(ModalAddNewColor)
