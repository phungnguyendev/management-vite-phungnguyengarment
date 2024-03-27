import { Divider, Flex, Space } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import { useSelector } from 'react-redux'
import useDevice from '~/components/hooks/useDevice'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import ProtectedLayout from '~/components/layout/ProtectedLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import ExpandableItemRow from '~/components/sky-ui/SkyTable/ExpandableItemRow'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import TextHint from '~/components/sky-ui/TextHint'
import { RootState } from '~/store/store'
import { UserRole } from '~/typing'
import {
  breakpoint,
  dateValidatorChange,
  dateValidatorDisplay,
  dateValidatorInit,
  textValidatorChange,
  textValidatorDisplay,
  textValidatorInit
} from '~/utils/helpers'
import ModalAddNewUser from './components/ModalAddNewUser'
import useUser from './hooks/useUser'
import { UserTableDataType } from './type'

const UserPage = () => {
  const table = useTable<UserTableDataType>([])
  const { setLoading } = table
  const {
    searchText,
    setSearchText,
    newRecord,
    setNewRecord,
    openModal,
    setOpenModal,
    handleResetClick,
    handleSortChange,
    handleSearch,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    handlePageChange,
    userService,
    roles
  } = useUser(table)
  const { width } = useDevice()
  const currentUser = useSelector((state: RootState) => state.user)

  const columns = {
    email: (record: UserTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='email'
          title='Email'
          inputType='text'
          required={true}
          initialValue={textValidatorInit(record.email)}
          value={newRecord.email}
          onValueChange={(val) => setNewRecord({ ...newRecord, email: textValidatorChange(val) })}
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
          required={true}
          initialValue={textValidatorInit(record.fullName)}
          value={newRecord.fullName}
          onValueChange={(val) => setNewRecord({ ...newRecord, fullName: textValidatorChange(val) })}
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
          required={true}
          initialValue={textValidatorInit(record.password)}
          value={newRecord.password}
          onValueChange={(val) => setNewRecord({ ...newRecord, password: textValidatorChange(val) })}
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
          required={true}
          initialValue={textValidatorInit(record.phone)}
          value={newRecord.phone}
          onValueChange={(val) => setNewRecord({ ...newRecord, phone: textValidatorChange(val) })}
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
          required={true}
          initialValue={textValidatorInit(record.workDescription)}
          value={newRecord.workDescription}
          onValueChange={(val) => setNewRecord({ ...newRecord, workDescription: textValidatorChange(val) })}
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
          required={true}
          initialValue={dateValidatorInit(record.birthday)}
          onValueChange={(val: Dayjs) => setNewRecord({ ...newRecord, birthday: dateValidatorChange(val) })}
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
          required={true}
          selectProps={{
            options: roles.map((item) => {
              return {
                value: item.id,
                label: item.desc
              }
            }),
            defaultValue:
              record.userRoles &&
              record.userRoles.map((item) => {
                return {
                  value: item.role?.id,
                  label: item.role?.desc
                }
              })
          }}
          onValueChange={(val: number[]) => {
            setNewRecord({
              ...newRecord,
              userRoles: val.map((roleID) => {
                return { roleID: roleID, userID: record.id } as UserRole
              })
            })
          }}
        >
          <Space size='small' wrap>
            {record.userRoles &&
              record.userRoles.map((item, index) => {
                return (
                  <SkyTableTypography
                    type={item.role?.role === 'admin' ? 'success' : undefined}
                    className='my-[2px] h-6 rounded-sm bg-black bg-opacity-[0.06] px-2 py-1'
                    key={index}
                  >
                    {textValidatorDisplay(item.role?.desc)}
                  </SkyTableTypography>
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
      width: '15%',
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
      responsive: ['xl'],
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
        onLoading={(enable) => setLoading(enable)}
        title='Danh sách người dùng'
        searchValue={searchText}
        // onDeletedRecordStateChange={(enable) => table.setDeletedRecordState(enable)}
        onSearchChange={(e) => setSearchText(e.target.value)}
        onSearch={(value) => handleSearch(value)}
        searchPlaceHolder='Tên...'
        onSortChange={(checked) => handleSortChange(checked)}
        onResetClick={{
          onClick: () => handleResetClick(),
          isShow: true
        }}
        onAddNewClick={{
          onClick: () => setOpenModal(true),
          isShow: currentUser.userRoles.includes('admin')
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
          metaData={userService.metaData}
          onPageChange={handlePageChange}
          isShowDeleted={table.showDeleted}
          actions={{
            onEdit: {
              onClick: (_e, record) => {
                setNewRecord({ ...record })
                table.handleStartEditing(record!.key!)
              }
            },
            onSave: {
              onClick: (_e, record) => handleSaveClick(record!)
            },
            onDelete: {
              onClick: (_e, record) => table.handleStartDeleting(record!.key!)
            },
            onConfirmCancelEditing: () => table.handleConfirmCancelEditing(),
            onConfirmCancelDeleting: () => table.handleConfirmCancelDeleting(),
            onConfirmDelete: (record) => handleConfirmDelete(record),
            isShow: currentUser.userRoles.includes('admin')
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
                    {!(width >= breakpoint.xl) && (
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
      {openModal && <ModalAddNewUser openModal={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNewItem} />}
    </ProtectedLayout>
  )
}

export default UserPage
