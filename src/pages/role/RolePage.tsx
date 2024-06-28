import { ColumnsType } from 'antd/es/table'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import ProtectedLayout from '~/components/layout/ProtectedLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { UserRoleType } from '~/typing'
import { textValidatorChange, textValidatorDisplay, textValidatorInit } from '~/utils/helpers'
import ModalAddNewRole from './components/ModalAddNewRole'
import useRoleViewModel from './hooks/useRoleViewModel'
import { RoleTableDataType } from './type'

const RolePage = () => {
  useTitle('Vai trò | Phung Nguyen')
  const { state, action, table } = useRoleViewModel()
  const {
    newRecord,
    setNewRecord,
    openModal,
    setOpenModal,
    showDeleted,
    setShowDeleted,
    searchTextChange,
    setSearchTextChange
  } = state
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

  const columns = {
    role: (record: RoleTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='role'
          title='Role'
          inputType='text'
          required={true}
          initialValue={textValidatorInit(record.role)}
          value={newRecord.role}
          onValueChange={(val: UserRoleType) =>
            setNewRecord((prev) => {
              return { ...prev, role: val }
            })
          }
        >
          <SkyTableTypography strong status={'active'}>
            {textValidatorDisplay(record.role)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    shortName: (record: RoleTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='shortName'
          title='Short name'
          inputType='text'
          required={true}
          initialValue={textValidatorInit(record.shortName)}
          value={newRecord.shortName}
          onValueChange={(val: string) =>
            setNewRecord((prev) => {
              return { ...prev, shortName: textValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography status={'active'}>{textValidatorDisplay(record.shortName)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    desc: (record: RoleTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='desc'
          title='Description'
          inputType='textarea'
          required={true}
          initialValue={textValidatorInit(record.desc)}
          value={newRecord.desc}
          onValueChange={(val) =>
            setNewRecord((prev) => {
              return { ...prev, desc: textValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography status={'active'}>{textValidatorDisplay(record.desc)}</SkyTableTypography>
        </EditableStateCell>
      )
    }
  }

  const tableColumns: ColumnsType<RoleTableDataType> = [
    {
      title: 'Role',
      dataIndex: 'role',
      width: '10%',
      render: (_value: any, record: RoleTableDataType) => {
        return columns.role(record)
      }
    },
    {
      title: 'Short name',
      dataIndex: 'shortName',
      width: '10%',
      render: (_value: any, record: RoleTableDataType) => {
        return columns.shortName(record)
      }
    },
    {
      title: 'Description',
      dataIndex: 'desc',
      width: '10%',
      render: (_value: any, record: RoleTableDataType) => {
        return columns.desc(record)
      }
    }
  ]

  return (
    <ProtectedLayout>
      <BaseLayout
        title='Danh sách vai trò'
        loading={table.loading}
        searchProps={{
          onSearch: handleSearch,
          placeholder: 'Ví dụ: Product Manager...',
          value: searchTextChange,
          onChange: (e) => setSearchTextChange(e.target.value)
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
                setNewRecord({ ...record })
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
        />
      </BaseLayout>
      {openModal && <ModalAddNewRole open={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNew} />}
    </ProtectedLayout>
  )
}

export default RolePage
