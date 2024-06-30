import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Paginator } from '~/api/client'
import PrintAPI from '~/api/services/PrintAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants'
import useAPIService from '~/hooks/useAPIService'
import { Print } from '~/typing'
import { textComparator } from '~/utils/helpers'
import { PrintAddNewProps, PrintableTableDataType } from '../type'

export default function usePrintableViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<PrintableTableDataType>([])

  const printService = useAPIService<Print>(PrintAPI)

  // State
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchTextChange, setSearchTextChange] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<PrintAddNewProps>({})
  const [paginator, setPaginator] = useState<Paginator>({
    page: 1,
    pageSize: -1
  })
  const [shorted, setSorted] = useState<boolean>(false)

  const [prints, setPrints] = useState<Print[]>([])

  useEffect(() => {
    loadData()
  }, [showDeleted, shorted, paginator, searchText])

  useEffect(() => {
    mappedData()
  }, [prints])

  const mappedData = useCallback(() => {
    table.setDataSource(() => {
      const _dataSource = prints.map((self) => {
        return {
          ...self,
          key: `${self.id}`
        } as PrintableTableDataType
      })
      return _dataSource
    })
  }, [prints])

  const loadData = useCallback(async () => {
    try {
      await printService.getItemsSync(
        {
          paginator: paginator,
          sorting: { column: 'id', direction: shorted ? 'asc' : 'desc' },
          filter: { field: 'id', items: [-1], status: showDeleted ? 'deleted' : 'active' },
          search: { field: 'name', term: searchText }
        },
        table.setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(define('dataLoad_failed'))
          const _prints = meta.data as Print[]
          setPrints(_prints)
        }
      )
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }, [showDeleted, paginator, shorted, searchText])

  const handleUpdate = async (record: PrintableTableDataType) => {
    try {
      if (textComparator(record.name, newRecord.name)) {
        await printService.updateItemByPkSync(record.id!, { name: newRecord.name }, table.setLoading, (meta) => {
          if (!meta?.success) throw new Error(define('update_failed'))
          const itemUpdated = meta.data as Print
          table.handleUpdate(record.key, { ...itemUpdated, key: `${itemUpdated.id}` } as PrintableTableDataType)
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

  const handleAddNew = async (formAddNew: PrintAddNewProps) => {
    try {
      await printService.createItemSync(
        {
          name: formAddNew.name
        },
        table.setLoading,
        async (meta) => {
          if (!meta?.success) throw new Error(define('create_failed'))
          const newPrint = meta.data as Print
          table.handleAddNew({ ...newPrint, key: `${newPrint.id}` })
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

  const handleDelete = async (record: PrintableTableDataType) => {
    try {
      await printService.updateItemByPkSync(record.id!, { status: 'deleted' }, table.setLoading, (meta) => {
        if (!meta?.success) throw new Error(define('update_failed'))
        table.handleDeleting(record.key)
        message.success(define('updated_success'))
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleDeleteForever = async (id?: number) => {
    try {
      await printService.deleteItemSync(id, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('failed'))
        table.handleDeleting(`${id}`)
        message.success(`${define('success')}`)
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleRestore = async (record: PrintableTableDataType) => {
    try {
      await printService.updateItemByPkSync(record.id!, { status: 'active' }, table.setLoading, (meta) => {
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
      printService
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
