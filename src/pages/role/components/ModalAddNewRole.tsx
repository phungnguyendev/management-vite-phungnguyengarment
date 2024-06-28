import { Form } from 'antd'
import React, { memo } from 'react'
import SkyModal, { SkyModalProps } from '~/components/sky-ui/SkyModal'
import SkyModalRow from '~/components/sky-ui/SkyModalRow'
import SkyModalRowItem from '~/components/sky-ui/SkyModalRowItem'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import { UserRoleType } from '~/typing'

export interface RoleAddNewProps {
  role?: UserRoleType
  shortName?: string
  desc?: string
}

interface Props extends SkyModalProps {
  onAddNew: (formAddNew: RoleAddNewProps) => void
}

const ModalAddNewRole: React.FC<Props> = ({ onAddNew, ...props }) => {
  const [form] = Form.useForm()

  const handleOk = async () => {
    const row = await form.validateFields()
    onAddNew({
      ...row
    })
  }

  return (
    <SkyModal {...props} title='Thêm vai trò' okText='Create' onOk={handleOk}>
      <Form form={form} labelCol={{ xs: 24, md: 6 }} labelAlign='left' labelWrap>
        <SkyModalRow>
          <SkyModalRowItem>
            <EditableFormCell
              isEditing={true}
              title='Role'
              required
              subtitle='Please enter role name!'
              dataIndex='role'
              inputType='text'
              placeholder='admin, product_manager, v.v...'
            />
          </SkyModalRowItem>
          <SkyModalRowItem>
            <EditableFormCell
              isEditing={true}
              title='Short name'
              required
              subtitle='Please enter short name!'
              dataIndex='shortName'
              inputType='text'
              placeholder='Admin, Product Manager, v.v..'
            />
          </SkyModalRowItem>
          <SkyModalRowItem>
            <EditableFormCell
              isEditing={true}
              title='Description'
              dataIndex='desc'
              inputType='text'
              placeholder='Quản trị, Quản lý sản phẩm, v.v..'
            />
          </SkyModalRowItem>
        </SkyModalRow>
      </Form>
    </SkyModal>
  )
}

export default memo(ModalAddNewRole)
