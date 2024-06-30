import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Paginator } from '~/api/client'
import SewingLineAPI from '~/api/services/SewingLineAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants'
import useAPIService from '~/hooks/useAPIService'
import { SewingLine } from '~/typing'
import { textComparator } from '~/utils/helpers'
import { SewingLineAddNewProps, SewingLineTableDataType } from '../type'

export default function useSewingLineViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<SewingLineTableDataType>([])

  const sewingLineService = useAPIService<SewingLine>(SewingLineAPI)

  // State
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchTextChange, setSearchTextChange] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<SewingLineAddNewProps>({})
  const [paginator, setPaginator] = useState<Paginator>({
    page: 1,
    pageSize: -1
  })
  const [shorted, setSorted] = useState<boolean>(false)

  const [sewingLines, setSewingLines] = useState<SewingLine[]>([])

  useEffect(() => {
    loadData()
  }, [showDeleted, shorted, paginator, searchText])

  useEffect(() => {
    mappedData()
  }, [sewingLines])

  const mappedData = useCallback(() => {
    table.setDataSource(() => {
      const _dataSource = sewingLines.map((self) => {
        return {
          ...self,
          key: `${self.id}`
        } as SewingLineTableDataType
      })
      return _dataSource
    })
  }, [sewingLines])

  const loadData = useCallback(async () => {
    try {
      await sewingLineService.getItemsSync(
        {
          paginator: paginator,
          sorting: { column: 'id', direction: shorted ? 'asc' : 'desc' },
          filter: { field: 'id', items: [-1], status: showDeleted ? 'deleted' : 'active' },
          search: { field: 'name', term: searchText }
        },
        table.setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(define('dataLoad_failed'))
          const _sewingLines = meta.data as SewingLine[]
          setSewingLines(_sewingLines)
        }
      )
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }, [showDeleted, paginator, shorted, searchText])

  const handleUpdate = async (record: SewingLineTableDataType) => {
    try {
      if (textComparator(record.name, newRecord.name)) {
        await sewingLineService.updateItemByPkSync(record.id!, { name: newRecord.name }, table.setLoading, (meta) => {
          if (!meta?.success) throw new Error(define('update_failed'))
          const itemUpdated = meta.data as SewingLine
          table.handleUpdate(record.key, { ...itemUpdated, key: `${itemUpdated.id}` } as SewingLineTableDataType)
          message.success(define('updated_success'))
        })
      }
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.handleCancelEditing()
      table.setLoading(false)
    }
  }

  const handleAddNew = async (formAddNew: SewingLineAddNewProps) => {
    try {
      await sewingLineService.createItemSync(
        {
          name: formAddNew.name
        },
        table.setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(define('create_failed'))
          const newSewingLine = meta.data as SewingLine
          table.handleAddNew({ ...newSewingLine, key: `${newSewingLine.id}` })
          message.success(define('created_success'))
        }
      )
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setOpenModal(false)
      table.setLoading(false)
    }
  }

  const handleDelete = async (record: SewingLineTableDataType) => {
    try {
      await sewingLineService.updateItemByPkSync(record.id!, { status: 'deleted' }, table.setLoading, (meta) => {
        if (!meta?.success) throw new Error(define('delete_failed'))
        table.handleDeleting(record.key)
        message.success(define('deleted_success'))
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleDeleteForever = async (id?: number) => {
    try {
      await sewingLineService.deleteItemSync(id, table.setLoading, (res) => {
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

  const handleRestore = async (record: SewingLineTableDataType) => {
    try {
      await sewingLineService.updateItemByPkSync(record.id!, { status: 'active' }, table.setLoading, (meta) => {
        if (!meta?.success) throw new Error(define('restore_failed'))
        table.handleDeleting(`${record.id!}`)
        message.success(define('restored_success'))
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
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
      newRecord,
      setNewRecord,
      setOpenModal
    },
    service: {
      sewingLineService
    },
    action: {
      loadData,
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
