import { Flex, Form, Input, Modal, Typography } from 'antd'
import React, { memo } from 'react'
import AddNewTitle from '~/components/sky-ui/AddNewTitle'
import { Color } from '~/typing'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  setOpenModal: (enable: boolean) => void
  onAddNew: (itemToAddNew: Color) => void
}

const ModalAddNewGroup: React.FC<Props> = ({ openModal, setOpenModal, onAddNew, ...props }) => {
  const [form] = Form.useForm()

  async function handleOk() {
    const row = await form.validateFields()
    onAddNew({
      name: row.name
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
            <Typography.Text className='w-24 flex-shrink-0'>Group name:</Typography.Text>
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
              <Input className='w-52' allowClear placeholder='G13+, G1-4,...' />
            </Form.Item>
          </Flex>
        </Flex>
      </Form>
    </Modal>
  )
}

export default memo(ModalAddNewGroup)
