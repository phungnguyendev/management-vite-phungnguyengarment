import { App as AntApp, Form } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import RoleAPI from '~/api/services/RoleAPI'
import SkyModal, { SkyModalProps } from '~/components/sky-ui/SkyModal'
import SkyModalRow from '~/components/sky-ui/SkyModalRow'
import SkyModalRowItem from '~/components/sky-ui/SkyModalRowItem'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import SkyTableRowHighLightItem from '~/components/sky-ui/SkyTable/SkyTableRowHighLightItem'
import useAPIService from '~/hooks/useAPIService'
import { Role } from '~/typing'
import { UserAddNewProps } from '../type'

interface Props extends SkyModalProps {
  onAddNew: (formAddNew: UserAddNewProps) => void
}

const ModalAddNewUser: React.FC<Props> = ({ onAddNew, ...props }) => {
  const { message } = AntApp.useApp()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const roleService = useAPIService<Role>(RoleAPI)
  const [roles, setRoles] = useState<Role[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      await roleService.getItemsSync({ paginator: { pageSize: -1, page: 1 } }, setLoading, (meta) => {
        if (!meta?.success) throw new Error(`${meta.message}`)
        const data = meta.data as Role[]
        setRoles(data)
      })
    } catch (error: any) {
      message.error(error.message)
    }
  }

  const handleOk = async () => {
    const row = await form.validateFields()
    onAddNew({
      ...row
    })
  }

  return (
    <SkyModal {...props} loading={loading} title='Thêm người dùng' okText='Create' onOk={handleOk}>
      <Form form={form} labelCol={{ xs: 24, md: 6 }} labelAlign='left' labelWrap>
        <SkyModalRow>
          <SkyModalRowItem>
            <EditableFormCell
              isEditing={true}
              title='Email'
              required
              dataIndex='email'
              inputType='text'
              placeholder='Ví dụ: nguyenvana@gmail.com'
            />
          </SkyModalRowItem>
          <SkyModalRowItem>
            <EditableFormCell
              isEditing={true}
              title='Password'
              required
              dataIndex='password'
              inputType='password'
              placeholder='Ví dụ: Abc@@123??'
            />
          </SkyModalRowItem>
          <SkyModalRowItem>
            <EditableFormCell
              isEditing={true}
              title='Full name'
              required
              dataIndex='fullName'
              inputType='text'
              placeholder='Ví dụ: Nguyễn Văn A'
            />
          </SkyModalRowItem>
          <SkyModalRowItem>
            <EditableFormCell
              isEditing={true}
              title='Role'
              required
              dataIndex='roleIDs'
              inputType='multipleSelect'
              placeholder='Select role'
              selectProps={{
                options: roles.map((role) => {
                  return {
                    label: <SkyTableRowHighLightItem title={role.desc} role={role.role} />,
                    value: role.id,
                    key: role.id
                  }
                })
              }}
            />
          </SkyModalRowItem>
          <SkyModalRowItem>
            <EditableFormCell
              isEditing={true}
              title='Phone'
              dataIndex='phone'
              inputType='text'
              placeholder='Ví dụ: 0123456789'
            />
          </SkyModalRowItem>
          <SkyModalRowItem>
            <EditableFormCell
              isEditing={true}
              title='Work description'
              dataIndex='workDescription'
              inputType='textarea'
              placeholder='Ví dụ: Nhân viên'
            />
          </SkyModalRowItem>
          <SkyModalRowItem>
            <EditableFormCell
              isEditing={true}
              title='Birthday'
              dataIndex='birthday'
              inputType='datepicker'
              placeholder='Ví dụ: 01/01/1990'
              // defaultValue={DayJS(Date.now())}
            />
          </SkyModalRowItem>
        </SkyModalRow>
      </Form>
    </SkyModal>
  )
}

export default memo(ModalAddNewUser)
