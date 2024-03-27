import { Flex, Form, Modal } from 'antd'
import React, { memo } from 'react'
import AddNewTitle from '~/components/sky-ui/AddNewTitle'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import { AccessoryNote } from '~/typing'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  setOpenModal: (enable: boolean) => void
  onAddNew: (itemToAddNew: AccessoryNote) => void
}

const ModalAddNewAccessoryNote: React.FC<Props> = ({ openModal, setOpenModal, onAddNew, ...props }) => {
  const [form] = Form.useForm()

  async function handleOk() {
    const row = await form.validateFields()
    onAddNew({
      title: row.title,
      summary: row.summary
    })
  }

  function handleCancel() {
    setOpenModal(false)
  }

  return (
    <Modal title={<AddNewTitle title='Add new' />} open={openModal} onOk={handleOk} onCancel={handleCancel} centered>
      <Form form={form} labelWrap labelCol={{ flex: '100px' }} labelAlign='left' {...props}>
        <Flex vertical gap={10} className=''>
          <EditableFormCell
            isEditing={true}
            required
            title='Title:'
            placeholder='Enter title'
            subtitle='Please enter title!'
            dataIndex='title'
            inputType='text'
          />
          <EditableFormCell
            isEditing={true}
            title='Chi tiết:'
            placeholder='Enter description'
            dataIndex='desc'
            inputType='textarea'
          />
        </Flex>
      </Form>
    </Modal>
  )
}

export default memo(ModalAddNewAccessoryNote)
