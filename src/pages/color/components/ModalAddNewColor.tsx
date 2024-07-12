import { Form } from 'antd'
import type { Color as AntColor } from 'antd/es/color-picker'
import React, { memo } from 'react'
import SkyModal, { SkyModalProps } from '~/components/sky-ui/SkyModal'
import SkyModalRow from '~/components/sky-ui/SkyModalRow'
import SkyModalRowItem from '~/components/sky-ui/SkyModalRowItem'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import { ColorAddNewProps } from '../type'

interface Props extends SkyModalProps {
  onAddNew: (formAddNew: ColorAddNewProps) => void
}

const ModalAddNewColor: React.FC<Props> = ({ onAddNew, ...props }) => {
  const [form] = Form.useForm()

  const handleOk = async () => {
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

  return (
    <SkyModal {...props} title='Thêm màu' okText='Create' onOk={handleOk}>
      <Form form={form} labelCol={{ xs: 24, md: 6 }} labelAlign='left' labelWrap>
        <SkyModalRow>
          <SkyModalRowItem>
            <EditableFormCell
              isEditing={true}
              title='Tên màu:'
              placeholder='Ví dụ: Black'
              dataIndex='name'
              inputType='text'
              required
            />
          </SkyModalRowItem>
          <SkyModalRowItem>
            <EditableFormCell
              isEditing={true}
              title='Chọn mã màu:'
              placeholder='Ví dụ: #000000'
              dataIndex='hexColor'
              inputType='colorPicker'
              required
            />
          </SkyModalRowItem>
        </SkyModalRow>
      </Form>
    </SkyModal>
  )
}

export default memo(ModalAddNewColor)
