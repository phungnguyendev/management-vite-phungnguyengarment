import { Form, Modal } from 'antd'
import React, { memo } from 'react'
import AddNewTitle from '~/components/sky-ui/AddNewTitle'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import { SewingLine } from '~/typing'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  setOpenModal: (enable: boolean) => void
  onAddNew: (itemToAddNew: SewingLine) => void
}

const ModalAddNewPrint: React.FC<Props> = ({ openModal, setOpenModal, onAddNew, ...props }) => {
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
    <Modal title={<AddNewTitle title='Add new' />} open={openModal} onOk={handleOk} onCancel={handleCancel} centered>
      <Form form={form} labelCol={{ flex: '100px' }} {...props}>
        <EditableFormCell
          isEditing
          allowClear
          dataIndex='print-place'
          title='Print place'
          subtitle='Please enter print place!'
          placeholder='TIẾN THẮNG, ĐẠI VIỆT PHÁT, v.v..'
          required
        />
      </Form>
    </Modal>
  )
}

export default memo(ModalAddNewPrint)
