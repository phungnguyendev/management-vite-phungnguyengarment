import { Color as AntColor } from 'antd/es/color-picker'
import { ColumnsType } from 'antd/es/table'
import { ColorPicker } from 'antd/lib'
import { useSelector } from 'react-redux'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import ProtectedLayout from '~/components/layout/ProtectedLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { RootState } from '~/store/store'
import { textValidatorDisplay } from '~/utils/helpers'
import ModalAddNewColor from './components/ModalAddNewColor'
import useColor from './hooks/useColor'
import { ColorTableDataType } from './type'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ColorPage: React.FC<Props> = () => {
  const table = useTable<ColorTableDataType>([])
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
    colorService
  } = useColor(table)
  const currentUser = useSelector((state: RootState) => state.user)

  const columns: ColumnsType<ColorTableDataType> = [
    {
      title: 'Tên màu',
      dataIndex: 'name',
      width: '15%',
      render: (_value: any, record: TableItemWithKey<ColorTableDataType>) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='name'
            title='Tên màu'
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
    },
    {
      title: 'Mã màu',
      dataIndex: 'hexColor',
      width: '15%',
      render: (_, record: TableItemWithKey<ColorTableDataType>) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='hexColor'
            title='Mã màu'
            inputType='colorpicker'
            required={true}
            className='w-fit'
            initialValue={record.hexColor}
            value={newRecord.hexColor}
            onValueChange={(val: AntColor) => setNewRecord({ ...newRecord, hexColor: val.toHexString() })}
          >
            <ColorPicker
              disabled={true}
              value={record.hexColor}
              defaultFormat='hex'
              defaultValue={record.hexColor}
              showText
            />
          </EditableStateCell>
        )
      }
    }
  ]

  return (
    <ProtectedLayout>
      <BaseLayout
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
          metaData={colorService.metaData}
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
              onClick: (_e, record) => handleSaveClick(record!, newRecord)
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
            isShow: true
          }}
        />
      </BaseLayout>
      {openModal && <ModalAddNewColor openModal={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNewItem} />}
    </ProtectedLayout>
  )
}

export default ColorPage
