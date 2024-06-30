import { App } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Paginator } from '~/api/client'
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
  const [paginator, setPaginator] = useState<Paginator>({
    page: 1,
    pageSize: -1
  })
  const [shorted, setSorted] = useState<boolean>(false)

  const [colors, setColors] = useState<Color[]>([])

  useEffect(() => {
    loadData()
  }, [showDeleted, shorted, paginator, searchText])

  useEffect(() => {
    mappedData()
  }, [colors])

  const mappedData = useCallback(() => {
    table.setDataSource(() => {
      const _dataSource = colors.map((self) => {
        return {
          ...self,
          key: `${self.id}`
        } as ColorTableDataType
      })
      return _dataSource
    })
  }, [colors])

  const loadData = useCallback(async () => {
    try {
      await colorService.getItemsSync(
        {
          paginator: paginator,
          sorting: { column: 'id', direction: shorted ? 'asc' : 'desc' },
          filter: { field: 'id', items: [-1], status: showDeleted ? 'deleted' : 'active' },
          search: { field: 'name', term: searchText }
        },
        table.setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(define('dataLoad_failed'))
          const _colors = meta.data as Color[]
          setColors(_colors)
        }
      )
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }, [showDeleted, paginator, shorted, searchText])

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

  const handleDeleteForever = async (id?: number) => {
    try {
      await colorService.deleteItemSync(id, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('delete_failed'))
        table.handleDeleting(`${id}`)
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
        table.handleDeleting(`${record.id!}`)
        message.success(define('restored_success'))
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      loadData()
      table.setLoading(false)
    }
  }

  const handlePageChange = async (page: number, pageSize: number) => {
    setPaginator({ page, pageSize })
  }

  const handleSortChange = async (checked: boolean) => {
    setSorted(checked)
  }

  const handleSearch = async (value: string) => {
    setSearchText(value)
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
      handleSortChange,
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
