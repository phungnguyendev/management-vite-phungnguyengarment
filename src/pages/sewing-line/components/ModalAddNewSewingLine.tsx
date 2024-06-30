import { Form } from 'antd'
import React, { memo } from 'react'
import SkyModal, { SkyModalProps } from '~/components/sky-ui/SkyModal'
import SkyModalRow from '~/components/sky-ui/SkyModalRow'
import SkyModalRowItem from '~/components/sky-ui/SkyModalRowItem'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import { SewingLineAddNewProps } from '../type'

interface Props extends SkyModalProps {
  onAddNew: (formAddNew: SewingLineAddNewProps) => void
}

const ModalAddNewSewingLine: React.FC<Props> = ({ onAddNew, ...props }) => {
  const [form] = Form.useForm()

  const handleOk = async () => {
    const row = await form.validateFields()
    onAddNew({
      name: row.name
    })
  }

  return (
    <SkyModal {...props} title='Thêm chuyền may' okText='Create' onOk={handleOk}>
      <Form form={form} labelCol={{ xs: 24, md: 6 }} labelAlign='left' labelWrap>
        <SkyModalRow>
          <SkyModalRowItem>
            <EditableFormCell
              isEditing={true}
              title='Tên chuyền:'
              placeholder='Ví dụ: Chuyền 1'
              dataIndex='name'
              inputType='text'
              required
            />
          </SkyModalRowItem>
        </SkyModalRow>
      </Form>
    </SkyModal>
  )
}

export default memo(ModalAddNewSewingLine)
