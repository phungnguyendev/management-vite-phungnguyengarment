import { Form } from 'antd'
import React, { memo } from 'react'
import SkyModal, { SkyModalProps } from '~/components/sky-ui/SkyModal'
import SkyModalRow from '~/components/sky-ui/SkyModalRow'
import SkyModalRowItem from '~/components/sky-ui/SkyModalRowItem'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'

export interface SampleSewingAddNewProps {
  productID?: number
  dateSubmissionNPL?: string
  dateApprovalSO?: string
  dateApprovalPP?: string
  dateSubmissionFirstTime?: string
  dateSubmissionSecondTime?: string
  dateSubmissionThirdTime?: string
  dateSubmissionForthTime?: string
  dateSubmissionFifthTime?: string
}

interface Props extends SkyModalProps {
  onAddNew: (formAddNew: SampleSewingAddNewProps) => void
}

const ModalAddNewGroup: React.FC<Props> = ({ onAddNew, ...props }) => {
  const [form] = Form.useForm()

  const handleOk = async () => {
    const row = await form.validateFields()
    onAddNew({
      ...row
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
        </SkyModalRow>
      </Form>
    </SkyModal>
  )
}

export default memo(ModalAddNewGroup)
