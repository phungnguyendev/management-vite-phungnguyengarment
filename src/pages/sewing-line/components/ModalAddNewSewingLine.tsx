import { Flex, Form, Modal } from 'antd'
import React, { memo } from 'react'
import AddNewTitle from '~/components/sky-ui/AddNewTitle'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import { SewingLine } from '~/typing'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  setOpenModal: (enable: boolean) => void
  onAddNew: (itemToAddNew: SewingLine) => void
}

const ModalAddNewSewingLine: React.FC<Props> = ({ openModal, setOpenModal, onAddNew, ...props }) => {
  const [form] = Form.useForm()

  async function handleOk() {
    const row = await form.validateFields()
    onAddNew({
      ...row
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
      width={450}
    >
      <Form form={form} labelCol={{ flex: '100px' }} labelAlign='left' {...props}>
        <Flex vertical gap={10}>
          <EditableFormCell
            isEditing={true}
            title='Name:'
            required
            subtitle='Please enter name!'
            dataIndex='name'
            inputType='text'
            placeholder='C1, C2, v.v..'
          />
        </Flex>
      </Form>
    </Modal>
  )
}

export default memo(ModalAddNewSewingLine)
