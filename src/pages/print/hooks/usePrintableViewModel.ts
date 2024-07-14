import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
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

  useEffect(() => {
    initialize()
  }, [])

  const dataMapped = (groups: Print[]) => {
    table.setDataSource(() => {
      return groups.map((self) => {
        return {
          ...self,
          key: `${self.id}`
        } as PrintableTableDataType
      })
    })
  }

  const initialize = async () => {
    try {
      const result = await printService.getItems(
        {
          paginator: { page: 1, pageSize: -1 }
        },
        table.setLoading
      )
      if (!result.success) throw new Error(define('dataLoad_failed'))
      const newSewingLines = result.data as Print[]

      dataMapped(newSewingLines)
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const loadData = async (query: { isDeleted: boolean; searchTerm: string }) => {
    try {
      const result = await printService.getItems(
        {
          paginator: { page: 1, pageSize: -1 },
          filter: { field: 'id', items: [-1], status: query.isDeleted ? ['deleted'] : ['active'] },
          search: { field: 'name', term: query.searchTerm }
        },
        table.setLoading
      )
      if (!result.success) throw new Error(define('dataLoad_failed'))
      const newSewingLines = result.data as Print[]
      dataMapped(newSewingLines)
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleUpdate = async (record: PrintableTableDataType) => {
    try {
      if (textComparator(record.name, newRecord.name)) {
        await printService.updateItemByPkSync(record.id!, { name: newRecord.name }, table.setLoading, (meta) => {
          if (!meta.success) throw new Error(define('update_failed'))
          const itemUpdated = meta.data as Print
          table.handleUpdate(record.key, { ...itemUpdated, key: record.key } as PrintableTableDataType)
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

  const handleDeleteForever = async (record: PrintableTableDataType) => {
    try {
      await printService.deleteItemSync(record.id!, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('failed'))
        table.handleDeleting(record.key)
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
      handleSwitchDeleteChange,
      handleSwitchSortChange,
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
