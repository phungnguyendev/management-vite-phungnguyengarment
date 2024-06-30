import { Color as AntColor } from 'antd/es/color-picker'
import { ColumnsType } from 'antd/es/table'
import { ColorPicker } from 'antd/lib'
import { memo } from 'react'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import ProtectedLayout from '~/components/layout/ProtectedLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { colorValidatorChange, textValidatorChange, textValidatorDisplay } from '~/utils/helpers'
import ModalAddNewColor from './components/ModalAddNewColor'
import useColorViewModel from './hooks/useColorViewModel'
import { ColorTableDataType } from './type'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ColorPage: React.FC<Props> = () => {
  useTitle('Colors | Phung Nguyen')
  const { state, action, table } = useColorViewModel()
  const { newRecord, setNewRecord, openModal, setOpenModal, showDeleted, setShowDeleted } = state
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

  const tableColumns: ColumnsType<ColorTableDataType> = [
    {
      title: 'Tên màu',
      dataIndex: 'name',
      width: '15%',
      render: (_value: any, record: ColorTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='name'
            title='Tên màu'
            inputType='text'
            required={true}
            initialValue={record.name}
            value={newRecord.name}
            onValueChange={(val) =>
              setNewRecord((prev) => {
                return { ...prev, name: textValidatorChange(val.trim()) }
              })
            }
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
      render: (_, record: ColorTableDataType) => {
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
            onValueChange={(val: AntColor) =>
              setNewRecord((prev) => {
                return { ...prev, hexColor: colorValidatorChange(val) }
              })
            }
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
        title='Danh sách màu'
        loading={table.loading}
        searchProps={{
          onSearch: handleSearch,
          placeholder: 'Ví dụ: Black, White,..'
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
      {openModal && (
        <ModalAddNewColor
          okButtonProps={{ loading: table.loading }}
          open={openModal}
          setOpenModal={setOpenModal}
          onAddNew={handleAddNew}
        />
      )}
    </ProtectedLayout>
  )
}

export default memo(ColorPage)
