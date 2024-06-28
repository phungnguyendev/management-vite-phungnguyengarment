import { Form } from 'antd'
import React, { memo } from 'react'
import SkyModal, { SkyModalProps } from '~/components/sky-ui/SkyModal'
import SkyModalRow from '~/components/sky-ui/SkyModalRow'
import SkyModalRowItem from '~/components/sky-ui/SkyModalRowItem'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'

export interface AccessoryNoteAddNewProps {
  title?: string
  summary?: string
}

interface Props extends SkyModalProps {
  onAddNew: (formAddNew: AccessoryNoteAddNewProps) => void
}

const ModalAddNewAccessoryNote: React.FC<Props> = ({ onAddNew, ...props }) => {
  const [form] = Form.useForm()

  const handleOk = async () => {
    const row = await form.validateFields()
    onAddNew({
      title: row.title,
      summary: row.summary
    })
  }

  return (
    <SkyModal {...props} title='Thêm ghi chú' okText='Create' onOk={handleOk}>
      <Form form={form} labelCol={{ xs: 24, md: 6 }} labelAlign='left' labelWrap>
        <SkyModalRow>
          <SkyModalRowItem>
            <EditableFormCell
              isEditing={true}
              title='Ghi chú:'
              placeholder='Ví dụ: Chưa về'
              dataIndex='title'
              inputType='text'
              required
            />
          </SkyModalRowItem>
          <SkyModalRowItem>
            <EditableFormCell
              isEditing={true}
              title='Chi tiết:'
              placeholder='Ví dụ: Chưa về'
              dataIndex='summary'
              inputType='text'
            />
          </SkyModalRowItem>
        </SkyModalRow>
      </Form>
    </SkyModal>
  )
}

export default memo(ModalAddNewAccessoryNote)
