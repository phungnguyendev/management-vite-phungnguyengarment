import { ColumnType } from 'antd/es/table'
import { useSelector } from 'react-redux'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import ProtectedLayout from '~/components/layout/ProtectedLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { RootState } from '~/store/store'
import { textValidatorDisplay } from '~/utils/helpers'
import ModalAddNewPrint from './components/ModalAddNewPrint'
import usePrint from './hooks/usePrint'
import { PrintTableDataType } from './type'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const PrintTable: React.FC<Props> = () => {
  const table = useTable<PrintTableDataType>([])

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
    handleConfirmRestore,
    handlePageChange,
    printService
  } = usePrint(table)
  const currentUser = useSelector((state: RootState) => state.user)

  const columns: ColumnType<PrintTableDataType>[] = [
    {
      title: 'Nơi in',
      dataIndex: 'name',
      width: '15%',
      render: (_value: any, record: TableItemWithKey<PrintTableDataType>) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='name'
            title='Nơi in'
            inputType='text'
            required={true}
            initialValue={record.name}
            value={newRecord.name}
            onValueChange={(val) => setNewRecord({ ...newRecord, name: val })}
          >
            <SkyTableTypography status={record.status}>{textValidatorDisplay(record.name)}</SkyTableTypography>
          </EditableStateCell>
        )
      }
    }
  ]

  return (
    <ProtectedLayout>
      <BaseLayout
        title='Nơi in - Thêu'
        searchValue={searchText}
        onDeletedRecordStateChange={
          currentUser.userRoles.includes('admin') ? (enable) => table.setDeletedRecordState(enable) : undefined
        }
        onSearchChange={(e) => setSearchText(e.target.value)}
        onSearch={(value) => handleSearch(value)}
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
          columns={columns}
          editingKey={table.editingKey}
          deletingKey={table.deletingKey}
          dataSource={table.dataSource}
          rowClassName='editable-row'
          metaData={printService.metaData}
          onPageChange={handlePageChange}
          isShowDeleted={table.showDeleted}
          actions={{
            onEdit: {
              onClick: (_e, record) => {
                setNewRecord(record)
                table.handleStartEditing(record!.key!)
              },
              isShow: !table.showDeleted
            },
            onSave: {
              onClick: (_e, record) => handleSaveClick(record!)
            },
            onDelete: {
              onClick: (_e, record) => table.handleStartDeleting(record!.key!),
              isShow: !table.showDeleted
            },
            onRestore: {
              onClick: (_e, record) => table.handleStartRestore(record!.key!),
              isShow: table.showDeleted
            },
            onConfirmCancelEditing: () => table.handleConfirmCancelEditing(),
            onConfirmCancelDeleting: () => table.handleConfirmCancelDeleting(),
            onConfirmDelete: (record) => handleConfirmDelete(record),
            onConfirmCancelRestore: () => table.handleConfirmCancelRestore(),
            onConfirmRestore: (record) => handleConfirmRestore(record),
            isShow: currentUser.userRoles.includes('admin')
          }}
        />
      </BaseLayout>
      {openModal && <ModalAddNewPrint openModal={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNewItem} />}
    </ProtectedLayout>
  )
}

export default PrintTable
