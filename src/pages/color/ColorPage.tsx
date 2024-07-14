import { Color as AntColor } from 'antd/es/color-picker'
import { ColumnsType, ColumnType } from 'antd/es/table'
import { ColorPicker } from 'antd/lib'
import { memo } from 'react'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import ProtectedLayout from '~/components/layout/ProtectedLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableActionRow from '~/components/sky-ui/SkyTable/SkyTableActionRow'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import SkyTableWrapperLayout from '~/components/sky-ui/SkyTable/SkyTableWrapperLayout'
import { colorValidatorChange, textValidatorChange, textValidatorDisplay } from '~/utils/helpers'
import ModalAddNewColor from './components/ModalAddNewColor'
import useColorViewModel from './hooks/useColorViewModel'
import { ColorTableDataType } from './type'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ColorPage: React.FC<Props> = () => {
  useTitle('Colors | Phung Nguyen')
  const viewModel = useColorViewModel()

  const tableColumns: ColumnsType<ColorTableDataType> = [
    {
      title: 'Tên màu',
      dataIndex: 'name',
      width: '15%',
      render: (_value: any, record: ColorTableDataType) => {
        return (
          <EditableStateCell
            isEditing={viewModel.table.isEditing(record.key!)}
            dataIndex='name'
            title='Tên màu'
            inputType='text'
            required={true}
            defaultValue={record.name}
            value={viewModel.state.newRecord.name}
            onValueChange={(val) =>
              viewModel.state.setNewRecord((prev) => {
                return { ...prev, name: textValidatorChange(val) }
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
            isEditing={viewModel.table.isEditing(record.key!)}
            dataIndex='hexColor'
            title='Mã màu'
            inputType='colorPicker'
            required={true}
            className='w-fit'
            defaultValue={record.hexColor}
            value={viewModel.state.newRecord.hexColor}
            onValueChange={(val: AntColor) =>
              viewModel.state.setNewRecord((prev) => {
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

  const actionCol: ColumnType<ColorTableDataType> = {
    title: 'Operation',
    width: '0.001%',
    render: (_value: any, record: ColorTableDataType) => {
      return (
        <SkyTableActionRow
          record={record}
          editingKey={viewModel.table.editingKey}
          deletingKey={viewModel.table.deletingKey}
          buttonEdit={{
            onClick: () => {
              viewModel.state.setNewRecord({ ...record })
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
      <BaseLayout title='Danh sách màu'>
        <SkyTableWrapperLayout
          loading={viewModel.table.loading}
          searchProps={{
            onSearch: viewModel.action.handleSearch,
            placeholder: 'Ví dụ: Black, White,..'
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
          />
        </SkyTableWrapperLayout>
      </BaseLayout>
      {viewModel.state.openModal && (
        <ModalAddNewColor
          okButtonProps={{ loading: viewModel.table.loading }}
          open={viewModel.state.openModal}
          setOpenModal={viewModel.state.setOpenModal}
          onAddNew={viewModel.action.handleAddNew}
        />
      )}
    </ProtectedLayout>
  )
}

export default memo(ColorPage)
