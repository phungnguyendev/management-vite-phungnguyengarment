import { Divider, Flex, Space } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import useDevice from '~/components/hooks/useDevice'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import ProtectedLayout from '~/components/layout/ProtectedLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import ExpandableItemRow from '~/components/sky-ui/SkyTable/ExpandableItemRow'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableRowHighLightItem from '~/components/sky-ui/SkyTable/SkyTableRowHighLightItem'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import TextHint from '~/components/sky-ui/TextHint'
import { dateFormatter } from '~/utils/date-formatter'
import {
  breakpoint,
  dateValidatorDisplay,
  dateValidatorInit,
  textValidatorChange,
  textValidatorDisplay,
  textValidatorInit
} from '~/utils/helpers'
import ModalAddNewUser from './components/ModalAddNewUser'
import useUserViewModel from './hooks/useUserViewModel'
import { UserTableDataType } from './type'

const UserPage = () => {
  useTitle('Người dùng - Phung Nguyen')
  const { state, action, table } = useUserViewModel()
  const { roles, newRecord, setNewRecord, openModal, setOpenModal, showDeleted, setShowDeleted, setSearchText } = state
  const {
    handleAddNew,
    handleUpdate,
    handleDelete,
    handleDeleteForever,
    handlePageChange,
    handleRestore,
    handleSearch,
    handleSortChange
  } = action
  const { width } = useDevice()

  const columns = {
    email: (record: UserTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='email'
          title='Email'
          inputType='text'
          required
          initialValue={textValidatorInit(record.email)}
          value={newRecord.email}
          onValueChange={(val: string) =>
            setNewRecord((prev) => {
              return { ...prev, email: textValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography status={'active'}>{textValidatorDisplay(record.email)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    fullName: (record: UserTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='fullName'
          title='Full name'
          inputType='text'
          required
          initialValue={textValidatorInit(record.fullName)}
          value={newRecord.fullName}
          onValueChange={(val: string) =>
            setNewRecord((prev) => {
              return { ...prev, fullName: textValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography status={'active'}>{textValidatorDisplay(record.fullName)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    password: (record: UserTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='password'
          title='Password'
          inputType='password'
          required
          initialValue={textValidatorInit(record.password)}
          value={newRecord.password}
          onValueChange={(val: string) =>
            setNewRecord((prev) => {
              return { ...prev, password: textValidatorChange(val) }
            })
          }
        >
          <TextHint title={record.password ?? undefined} />
        </EditableStateCell>
      )
    },
    phone: (record: UserTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='phone'
          title='Phone'
          inputType='text'
          required
          initialValue={textValidatorInit(record.phone)}
          value={newRecord.phone}
          onValueChange={(val: string) =>
            setNewRecord((prev) => {
              return { ...prev, phone: textValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography copyable={record.phone !== null} status={'active'}>
            {textValidatorDisplay(record.phone)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    workDescription: (record: UserTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='workDescription'
          title='Work description'
          inputType='textarea'
          required
          placeholder='Ví dụ: Quản lý sản phẩm, Quản lý xuất nhập khẩu,...'
          initialValue={textValidatorInit(record.workDescription)}
          value={newRecord.workDescription}
          onValueChange={(val: string) =>
            setNewRecord((prev) => {
              return { ...prev, workDescription: textValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography status={'active'}>{textValidatorDisplay(record.workDescription)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    birthday: (record: UserTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='birthday'
          title='Birthday'
          inputType='datepicker'
          required
          initialValue={dateValidatorInit(record.birthday)}
          onValueChange={(val: Dayjs) =>
            setNewRecord((prev) => {
              return { ...prev, birthday: dateFormatter(val.toDate(), 'iso8601') }
            })
          }
        >
          <SkyTableTypography status={'active'}>{dateValidatorDisplay(record.birthday)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    role: (record: UserTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='roles'
          title='Vai trò'
          inputType='multipleselect'
          required
          selectProps={{
            options: roles.map((role) => {
              return {
                value: role.id,
                label: <SkyTableRowHighLightItem title={role.desc} role={role.role} />
              }
            }),
            defaultValue: record.roles.map((role) => {
              return {
                value: role.id,
                label: <SkyTableRowHighLightItem title={role.desc} role={role.role} />
              }
            })
          }}
          onValueChange={(roleIDs: number[]) => {
            setNewRecord((prevData) => {
              return { ...prevData, roleIDs: roleIDs }
            })
          }}
        >
          <Space size='small' wrap>
            {record.roles.map((role, index) => {
              return (
                <span key={index}>
                  <SkyTableRowHighLightItem title={role.desc} role={role.role} background />
                </span>
              )
            })}
          </Space>
        </EditableStateCell>
      )
    }
  }

  const tableColumns: ColumnsType<UserTableDataType> = [
    {
      title: 'Full name',
      key: 'fullName',
      dataIndex: 'fullName',
      width: '10%',
      render: (_value: any, record: UserTableDataType) => {
        return columns.fullName(record)
      }
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
      width: '15%',
      responsive: ['lg'],
      render: (_value: any, record: UserTableDataType) => {
        return columns.email(record)
      }
    },
    {
      title: 'Password',
      key: 'password',
      dataIndex: 'password',
      width: '15%',
      responsive: ['md'],
      render: (_value: any, record: UserTableDataType) => {
        return columns.password(record)
      }
    },
    {
      title: 'Roles',
      key: 'roles',
      dataIndex: 'roles',
      responsive: ['sm'],
      width: '20%',
      render: (_value: any, record: UserTableDataType) => {
        return columns.role(record)
      }
    },
    {
      title: 'Phone',
      key: 'phone',
      dataIndex: 'phone',
      width: '10%',
      responsive: ['xxl'],
      render: (_value: any, record: UserTableDataType) => {
        return columns.phone(record)
      }
    },
    {
      title: 'Work description',
      key: 'workDescription',
      dataIndex: 'workDescription',
      width: '15%',
      responsive: ['xxl'],
      render: (_value: any, record: UserTableDataType) => {
        return columns.workDescription(record)
      }
    },
    {
      title: 'Birthday',
      key: 'birthday',
      dataIndex: 'birthday',
      width: '15%',
      responsive: ['xxl'],
      render: (_value: any, record: UserTableDataType) => {
        return columns.birthday(record)
      }
    }
  ]

  return (
    <ProtectedLayout>
      <BaseLayout
        title='Danh sách người dùng'
        loading={table.loading}
        searchProps={{
          onSearch: handleSearch,
          placeholder: 'Ví dụ: abc@gmail.com'
        }}
        sortProps={{
          onChange: handleSortChange
        }}
        deleteProps={{
          onChange: setShowDeleted
        }}
        addNewProps={{
          onClick: () => setOpenModal(true)
        }}
      >
        <SkyTable
          bordered
          loading={table.loading}
          columns={tableColumns}
          editingKey={table.editingKey}
          deletingKey={table.deletingKey}
          dataSource={table.dataSource}
          rowClassName='editable-row'
          onPageChange={handlePageChange}
          isShowDeleted={showDeleted}
          actionProps={{
            onEdit: {
              handleClick: (record) => {
                setNewRecord({
                  ...record,
                  roleIDs:
                    record.roles &&
                    record.roles.map((item) => {
                      return item.id!
                    })
                })
                table.handleStartEditing(record.key)
              },
              isShow: !showDeleted
            },
            onSave: {
              handleClick: (record) => handleUpdate(record),
              isShow: !showDeleted
            },
            onDelete: {
              handleClick: (record) => table.handleStartDeleting(record.key),
              isShow: !showDeleted
            },
            onDeleteForever: {
              isShow: showDeleted
            },
            onRestore: {
              handleClick: (record) => table.handleStartRestore(record.key),
              isShow: showDeleted
            },
            onConfirmDeleteForever: (record) => handleDeleteForever(record.id!),
            onConfirmCancelEditing: () => table.handleCancelEditing(),
            onConfirmCancelDeleting: () => table.handleCancelDeleting(),
            onConfirmDelete: (record) => handleDelete(record),
            onConfirmCancelRestore: () => table.handleCancelRestore(),
            onConfirmRestore: (record) => handleRestore(record),
            isShow: true
          }}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <Flex vertical className='w-full lg:w-1/2'>
                  <Space direction='vertical' size={10} split={<Divider className='my-0 w-full py-0' />}>
                    {!(width >= breakpoint.lg) && (
                      <ExpandableItemRow title='Email:' isEditing={table.isEditing(record.id!)}>
                        {columns.email(record)}
                      </ExpandableItemRow>
                    )}
                    {!(width >= breakpoint.sm) && (
                      <ExpandableItemRow title='Roles:' isEditing={table.isEditing(record.id!)}>
                        {columns.role(record)}
                      </ExpandableItemRow>
                    )}
                    {!(width >= breakpoint.md) && (
                      <ExpandableItemRow title='Password:' isEditing={table.isEditing(record.id!)}>
                        {columns.password(record)}
                      </ExpandableItemRow>
                    )}
                    {!(width >= breakpoint.xxl) && (
                      <ExpandableItemRow title='Phone:' isEditing={table.isEditing(record.id!)}>
                        {columns.phone(record)}
                      </ExpandableItemRow>
                    )}
                    {!(width >= breakpoint.xxl) && (
                      <ExpandableItemRow title='Work description:' isEditing={table.isEditing(record.id!)}>
                        {columns.workDescription(record)}
                      </ExpandableItemRow>
                    )}
                    {!(width >= breakpoint.xxl) && (
                      <ExpandableItemRow title='Birthday:' isEditing={table.isEditing(record.id!)}>
                        {columns.birthday(record)}
                      </ExpandableItemRow>
                    )}
                  </Space>
                </Flex>
              )
            },
            columnWidth: '0.001%',
            showExpandColumn: !(width >= breakpoint.xxl)
          }}
        />
      </BaseLayout>
      {openModal && (
        <ModalAddNewUser
          okButtonProps={{ loading: table.loading }}
          open={openModal}
          setOpenModal={setOpenModal}
          onAddNew={handleAddNew}
        />
      )}
    </ProtectedLayout>
  )
}

export default UserPage
