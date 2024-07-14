import { Space } from 'antd'
import { ColumnsType, ColumnType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import useDevice from '~/components/hooks/useDevice'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import ProtectedLayout from '~/components/layout/ProtectedLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableActionRow from '~/components/sky-ui/SkyTable/SkyTableActionRow'
import SkyTableExpandableItemRow from '~/components/sky-ui/SkyTable/SkyTableExpandableItemRow'
import SkyTableExpandableLayout from '~/components/sky-ui/SkyTable/SkyTableExpandableLayout'
import SkyTableRowHighLightItem from '~/components/sky-ui/SkyTable/SkyTableRowHighLightItem'
import SkyTableRowHighLightTextItem from '~/components/sky-ui/SkyTable/SkyTableRowHighLightTextItem'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import SkyTableWrapperLayout from '~/components/sky-ui/SkyTable/SkyTableWrapperLayout'
import TextHint from '~/components/sky-ui/TextHint'
import { dateFormatter } from '~/utils/date-formatter'
import {
  breakpoint,
  dateValidatorDisplay,
  dateValidatorInit,
  isValidArray,
  textValidatorChange,
  textValidatorDisplay,
  textValidatorInit
} from '~/utils/helpers'
import ModalAddNewUser from './components/ModalAddNewUser'
import useUserViewModel from './hooks/useUserViewModel'
import { UserTableDataType } from './type'

const UserPage = () => {
  useTitle('Users - Phung Nguyen')
  const viewModel = useUserViewModel()
  const { width } = useDevice()

  const columns = {
    email: (record: UserTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='email'
          title='Email'
          inputType='text'
          required
          defaultValue={textValidatorInit(record.email)}
          value={viewModel.state.newRecord.email}
          onValueChange={(val: string) =>
            viewModel.state.setNewRecord((prev) => {
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
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='fullName'
          title='Full name'
          inputType='text'
          required
          defaultValue={textValidatorInit(record.fullName)}
          value={viewModel.state.newRecord.fullName}
          onValueChange={(val: string) =>
            viewModel.state.setNewRecord((prev) => {
              return { ...prev, fullName: textValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography status={record.status}>{textValidatorDisplay(record.fullName)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    password: (record: UserTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='password'
          title='Password'
          inputType='password'
          required
          defaultValue={textValidatorInit(record.password)}
          value={viewModel.state.newRecord.password}
          onValueChange={(val: string) =>
            viewModel.state.setNewRecord((prev) => {
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
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='phone'
          title='Phone'
          inputType='text'
          required
          defaultValue={textValidatorInit(record.phone)}
          value={viewModel.state.newRecord.phone}
          onValueChange={(val: string) =>
            viewModel.state.setNewRecord((prev) => {
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
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='workDescription'
          title='Work description'
          inputType='textarea'
          required
          placeholder='Ví dụ: Quản lý sản phẩm, Quản lý xuất nhập khẩu,...'
          defaultValue={textValidatorInit(record.workDescription)}
          value={viewModel.state.newRecord.workDescription}
          onValueChange={(val: string) =>
            viewModel.state.setNewRecord((prev) => {
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
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='birthday'
          title='Birthday'
          inputType='datepicker'
          required
          defaultValue={dateValidatorInit(record.birthday)}
          onValueChange={(val: Dayjs) =>
            viewModel.state.setNewRecord((prev) => {
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
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='roles'
          title='Vai trò'
          inputType='multipleSelect'
          required
          selectProps={{
            options: viewModel.state.roles.map((role) => {
              return {
                value: role.id,
                label: (
                  <SkyTableRowHighLightTextItem type={role.role === 'admin' ? 'success' : 'secondary'}>
                    {role.desc}
                  </SkyTableRowHighLightTextItem>
                )
              }
            }),
            defaultValue: record.roles?.map((role) => {
              return {
                value: role.id,
                label: (
                  <SkyTableRowHighLightTextItem type={role.role === 'admin' ? 'success' : 'secondary'}>
                    {role.desc}
                  </SkyTableRowHighLightTextItem>
                )
              }
            })
          }}
          onValueChange={(roleIDs: number[]) => {
            viewModel.state.setNewRecord((prevData) => {
              return { ...prevData, roleIDs: roleIDs }
            })
          }}
        >
          {isValidArray(record.roles) && (
            <Space size='small' wrap>
              {record.roles.map((role, index) => {
                return (
                  <SkyTableRowHighLightItem
                    key={index}
                    type={role.role === 'admin' ? 'success' : 'secondary'}
                    status={role.status}
                  >
                    {role.desc}
                  </SkyTableRowHighLightItem>
                )
              })}
            </Space>
          )}
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

  const actionCol: ColumnType<UserTableDataType> = {
    title: 'Operation',
    width: '0.001%',
    render: (_value: any, record: UserTableDataType) => {
      return (
        <SkyTableActionRow
          record={record}
          editingKey={viewModel.table.editingKey}
          deletingKey={viewModel.table.deletingKey}
          buttonEdit={{
            onClick: () => {
              viewModel.state.setNewRecord({
                fullName: record.fullName,
                email: record.email,
                password: record.password,
                avatar: record.avatar,
                phone: record.phone,
                otp: record.otp,
                isAdmin: record.isAdmin,
                workDescription: record.workDescription,
                birthday: record.birthday,
                roleIDs: isValidArray(record.roles)
                  ? record.roles.map((item) => {
                      return item.id!
                    })
                  : undefined
              })
              viewModel.table.handleStartEditing(record.key)
            },
            isShow: !viewModel.state.showDeleted
          }}
          buttonSave={{
            // Save
            onClick: () => viewModel.action.handleUpdate(record),
            isShow: !viewModel.state.showDeleted
          }}
          // Start delete
          buttonDelete={{
            onClick: () => viewModel.table.handleStartDeleting(record.key),
            isShow: !viewModel.state.showDeleted
          }}
          // Start delete forever
          buttonDeleteForever={{
            onClick: () => {},
            isShow: viewModel.state.showDeleted
          }}
          // Start restore
          buttonRestore={{
            onClick: () => viewModel.table.handleStartRestore(record.key),
            isShow: viewModel.state.showDeleted
          }}
          // Delete forever
          onConfirmDeleteForever={() => viewModel.action.handleDeleteForever(record)}
          // Cancel editing
          onConfirmCancelEditing={() => viewModel.table.handleCancelEditing()}
          // Cancel delete
          onConfirmCancelDeleting={() => viewModel.table.handleCancelDeleting()}
          // Delete (update status record => 'deleted')
          onConfirmDelete={() => viewModel.action.handleDelete(record)}
          // Cancel restore
          onConfirmCancelRestore={() => viewModel.table.handleCancelRestore()}
          // Restore
          onConfirmRestore={() => viewModel.action.handleRestore(record)}
          // Show hide action col
        />
      )
    }
  }

  return (
    <ProtectedLayout>
      <BaseLayout title='Danh sách người dùng'>
        <SkyTableWrapperLayout
          loading={viewModel.table.loading}
          searchProps={{
            onSearch: viewModel.action.handleSearch,
            placeholder: 'Ví dụ: abc@gmail.com'
          }}
          sortProps={{
            onChange: viewModel.action.handleSwitchSortChange
          }}
          deleteProps={{
            onChange: viewModel.action.handleSwitchDeleteChange
          }}
          addNewProps={{
            onClick: () => viewModel.state.setOpenModal(true)
          }}
        >
          <SkyTable
            loading={viewModel.table.loading}
            columns={tableColumns}
            tableColumns={{
              columns: tableColumns,
              actionColumn: actionCol
            }}
            dataSource={viewModel.table.dataSource}
            pagination={{
              pageSize: viewModel.table.paginator.pageSize,
              current: viewModel.table.paginator.page,
              onChange: viewModel.action.handlePageChange
            }}
            expandable={{
              expandedRowRender: (record) => {
                return (
                  <SkyTableExpandableLayout>
                    {!(width >= breakpoint.lg) && (
                      <SkyTableExpandableItemRow title='Email:' isEditing={viewModel.table.isEditing(record.id!)}>
                        {columns.email(record)}
                      </SkyTableExpandableItemRow>
                    )}
                    {!(width >= breakpoint.sm) && (
                      <SkyTableExpandableItemRow title='Roles:' isEditing={viewModel.table.isEditing(record.id!)}>
                        {columns.role(record)}
                      </SkyTableExpandableItemRow>
                    )}
                    {!(width >= breakpoint.md) && (
                      <SkyTableExpandableItemRow title='Password:' isEditing={viewModel.table.isEditing(record.id!)}>
                        {columns.password(record)}
                      </SkyTableExpandableItemRow>
                    )}
                    {!(width >= breakpoint.xxl) && (
                      <SkyTableExpandableItemRow title='Phone:' isEditing={viewModel.table.isEditing(record.id!)}>
                        {columns.phone(record)}
                      </SkyTableExpandableItemRow>
                    )}
                    {!(width >= breakpoint.xxl) && (
                      <SkyTableExpandableItemRow
                        title='Work description:'
                        isEditing={viewModel.table.isEditing(record.id!)}
                      >
                        {columns.workDescription(record)}
                      </SkyTableExpandableItemRow>
                    )}
                    {!(width >= breakpoint.xxl) && (
                      <SkyTableExpandableItemRow title='Birthday:' isEditing={viewModel.table.isEditing(record.id!)}>
                        {columns.birthday(record)}
                      </SkyTableExpandableItemRow>
                    )}
                  </SkyTableExpandableLayout>
                )
              },
              columnWidth: '0.001%',
              showExpandColumn: !(width >= breakpoint.xxl)
            }}
          />
        </SkyTableWrapperLayout>
      </BaseLayout>
      {viewModel.state.openModal && (
        <ModalAddNewUser
          okButtonProps={{ loading: viewModel.table.loading }}
          open={viewModel.state.openModal}
          setOpenModal={viewModel.state.setOpenModal}
          onAddNew={viewModel.action.handleAddNew}
        />
      )}
    </ProtectedLayout>
  )
}

export default UserPage
