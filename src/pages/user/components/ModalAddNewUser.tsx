import { Flex, Form, Modal, Spin } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import { defaultRequestBody } from '~/api/client'
import RoleAPI from '~/api/services/RoleAPI'
import AddNewTitle from '~/components/sky-ui/AddNewTitle'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import useAPIService from '~/hooks/useAPIService'
import { Role, User } from '~/typing'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  setOpenModal: (enable: boolean) => void
  onAddNew: (itemToAddNew: User) => void
}

const ModalAddNewUser: React.FC<Props> = ({ openModal, setOpenModal, onAddNew, ...props }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const roleService = useAPIService<Role>(RoleAPI)
  const [roles, setRoles] = useState<Role[]>([])

  const loadData = async () => {
    await roleService.getListItems(
      { ...defaultRequestBody, paginator: { pageSize: -1, page: 1 } },
      setLoading,
      (meta) => {
        if (meta?.success) {
          setRoles(meta.data as Role[])
        }
      }
    )
  }

  useEffect(() => {
    loadData()
  }, [])

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
      title={<AddNewTitle title='New user' />}
      open={openModal}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      width='450px'
    >
      {loading ? (
        <Flex justify='center' className='' align='center'>
          <Spin />
        </Flex>
      ) : (
        <Form form={form} {...props} autoComplete='aaa' labelWrap labelCol={{ flex: '100px' }} labelAlign='left'>
          <Flex vertical gap={10}>
            <EditableFormCell
              isEditing={true}
              title='Email'
              required
              dataIndex='email'
              subtitle='Please enter email!'
              inputType='text'
              placeholder='Enter email'
            />
            <EditableFormCell
              isEditing={true}
              title='Password'
              required
              dataIndex='password'
              subtitle='Please enter password!'
              inputType='password'
              placeholder='Enter password'
            />
            <EditableFormCell
              isEditing={true}
              title='Full name'
              required
              subtitle='Please enter full name!'
              dataIndex='fullName'
              inputType='text'
              placeholder='Enter full name'
            />
            <EditableFormCell
              isEditing={true}
              title='Role'
              required
              subtitle='Please select role!'
              dataIndex='roles'
              inputType='multipleselect'
              placeholder='Select role'
              selectProps={{
                options: roles.map((role) => {
                  return {
                    label: role.desc,
                    value: role.id,
                    key: role.id
                  }
                })
              }}
            />
            <EditableFormCell
              isEditing={true}
              title='Phone'
              dataIndex='phone'
              inputType='text'
              placeholder='Enter phone'
            />
            <EditableFormCell
              isEditing={true}
              title='Work description'
              dataIndex='workDescription'
              inputType='textarea'
              placeholder='Enter description'
            />
            <EditableFormCell
              isEditing={true}
              title='Birthday'
              dataIndex='birthday'
              inputType='datepicker'
              // placeholder=''
              // initialValue={DayJS(Date.now())}
            />
          </Flex>
        </Form>
      )}
    </Modal>
  )
}

export default memo(ModalAddNewUser)
