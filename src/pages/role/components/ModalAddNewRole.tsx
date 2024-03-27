import { Flex, Form, Modal } from 'antd'
import React, { memo } from 'react'
import AddNewTitle from '~/components/sky-ui/AddNewTitle'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import { Role } from '~/typing'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  setOpenModal: (enable: boolean) => void
  onAddNew: (itemToAddNew: Role) => void
}

const ModalAddNewRole: React.FC<Props> = ({ openModal, setOpenModal, onAddNew, ...props }) => {
  const [form] = Form.useForm()

  async function handleOk() {
    const row = await form.validateFields()
    onAddNew({ ...row })
  }

  function handleCancel() {
    setOpenModal(false)
  }

  return (
    <Modal
      title={<AddNewTitle title='New role' />}
      open={openModal}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      width='450px'
    >
      <Form form={form} {...props} labelCol={{ flex: '100px' }} labelAlign='left'>
        <Flex vertical gap={10}>
          <EditableFormCell
            isEditing={true}
            title='Role'
            required
            subtitle='Please enter role name!'
            dataIndex='role'
            inputType='text'
            placeholder='admin, product_manager, v.v...'
          />
          <EditableFormCell
            isEditing={true}
            title='Short name'
            required
            subtitle='Please enter short name!'
            dataIndex='shortName'
            inputType='text'
            placeholder='Admin, Product Manager, v.v..'
          />
          <EditableFormCell
            isEditing={true}
            title='Description'
            dataIndex='desc'
            inputType='text'
            placeholder='Quản trị, Quản lý sản phẩm, v.v..'
          />
        </Flex>
      </Form>
    </Modal>
  )
}

export default memo(ModalAddNewRole)
