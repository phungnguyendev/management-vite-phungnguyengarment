import { App } from 'antd'
import { useEffect, useState } from 'react'
import ColorAPI from '~/api/services/ColorAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants'
import useAPIService from '~/hooks/useAPIService'
import { Color } from '~/typing'
import { textComparator } from '~/utils/helpers'
import { ColorAddNewProps, ColorTableDataType } from '../type'

export default function useColorViewModel() {
  const { message } = App.useApp()
  const table = useTable<ColorTableDataType>([])

  const colorService = useAPIService<Color>(ColorAPI)

  // State
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchTextChange, setSearchTextChange] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<ColorAddNewProps>({})

  useEffect(() => {
    initialize()
  }, [])

  const dataMapped = (colors: Color[]) => {
    table.setDataSource(() => {
      return colors.map((self) => {
        return {
          ...self,
          key: `${self.id}`
        } as ColorTableDataType
      })
    })
  }

  const initialize = async () => {
    try {
      const result = await colorService.getItems(
        {
          paginator: { page: 1, pageSize: -1 }
        },
        table.setLoading
      )
      if (!result.success) throw new Error(define('dataLoad_failed'))
      const newColors = result.data as Color[]

      dataMapped(newColors)
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const loadData = async (query: { isDeleted: boolean; searchTerm: string }) => {
    try {
      const result = await colorService.getItems(
        {
          paginator: { page: 1, pageSize: -1 },
          filter: { field: 'id', items: [-1], status: query.isDeleted ? ['deleted'] : ['active'] },
          search: { field: 'name', term: query.searchTerm }
        },
        table.setLoading
      )
      if (!result.success) throw new Error(define('dataLoad_failed'))
      const newColors = result.data as Color[]
      dataMapped(newColors)
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleUpdate = async (record: ColorTableDataType) => {
    try {
      if (textComparator(record.name, newRecord.name) || textComparator(record.hexColor, newRecord.hexColor)) {
        await colorService.updateItemByPkSync(
          record.id!,
          { name: newRecord.name, hexColor: newRecord.hexColor },
          table.setLoading,
          (meta) => {
            if (!meta?.success) throw new Error(define('update_failed'))
            const itemUpdated = meta.data as Color
            table.handleUpdate(record.key, { ...itemUpdated, key: `${itemUpdated.id}` } as ColorTableDataType)
            message.success(define('updated_success'))
          }
        )
      }
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
      table.handleCancelEditing()
    }
  }

  const handleAddNew = async (formAddNew: ColorAddNewProps) => {
    try {
      await colorService.createItemSync(
        {
          name: formAddNew.name,
          hexColor: formAddNew.hexColor
        },
        table.setLoading,
        async (meta) => {
          if (!meta?.success) throw new Error(define('create_failed'))
          const newColor = meta.data as Color
          table.handleAddNew({ ...newColor, key: `${newColor.id}` })
          message.success(define('created_success'))
        }
      )
    } catch (error: any) {
      message.error(define('existed'))
    } finally {
      table.setLoading(false)
      setOpenModal(false)
    }
  }

  const handleDelete = async (record: ColorTableDataType) => {
    try {
      await colorService.updateItemByPkSync(record.id!, { status: 'deleted' }, table.setLoading, (meta) => {
        if (!meta.success) throw new Error(define('failed'))
        table.handleDeleting(record.key)
        message.success(define('success'))
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleDeleteForever = async (record: ColorTableDataType) => {
    try {
      await colorService.deleteItemSync(record.id!, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('delete_failed'))
        table.handleDeleting(record.key)
        message.success(define('deleted_success'))
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleRestore = async (record: ColorTableDataType) => {
    try {
      await colorService.updateItemByPkSync(record.id!, { status: 'active' }, table.setLoading, (meta) => {
        if (!meta.success) throw new Error(define('restore_failed'))
        table.handleDeleting(record.key)
        message.success(define('restored_success'))
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handlePageChange = async (page: number, pageSize: number) => {
    table.setPaginator({ page, pageSize })
  }

  /**
   * Function handle switch delete button
   */
  const handleSwitchDeleteChange = (checked: boolean) => {
    setShowDeleted(checked)
    loadData({ isDeleted: checked, searchTerm: searchText })
  }

  /**
   * Function handle switch sort button
   */
  const handleSwitchSortChange = (checked: boolean) => {
    table.setDataSource((prevDataSource) => {
      return checked
        ? [...prevDataSource.sort((a, b) => a.id! - b.id!)]
        : [...prevDataSource.sort((a, b) => b.id! - a.id!)]
    })
  }

  const handleSearch = async (value: string) => {
    setSearchText(value)
    loadData({ isDeleted: showDeleted, searchTerm: value })
  }

  return {
    state: {
      showDeleted,
      setShowDeleted,
      searchTextChange,
      setSearchTextChange,
      openModal,
      loadData,
      newRecord,
      setNewRecord,
      setOpenModal
    },
    service: {
      colorService
    },
    action: {
      handleUpdate,
      handleSwitchSortChange,
      handleSwitchDeleteChange,
      handleSearch,
      handleAddNew,
      handlePageChange,
      handleDelete,
      handleDeleteForever,
      handleRestore
    },
    table
  }
}
