import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import AccessoryNoteAPI from '~/api/services/AccessoryNoteAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants'
import useAPIService from '~/hooks/useAPIService'
import { AccessoryNote } from '~/typing'
import { textComparator } from '~/utils/helpers'
import { AccessoryNoteAddNewProps } from '../components/ModalAddNewAccessoryNote'
import { AccessoryNoteTableDataType } from '../type'

export default function useAccessoryNoteViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<AccessoryNoteTableDataType>([])

  const accessoryNoteService = useAPIService<AccessoryNote>(AccessoryNoteAPI)

  // State
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchTextChange, setSearchTextChange] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<AccessoryNoteAddNewProps>({})

  useEffect(() => {
    initialize()
  }, [])

  const dataMapped = (colors: AccessoryNote[]) => {
    table.setDataSource(() => {
      return colors.map((self) => {
        return {
          ...self,
          key: `${self.id}`
        } as AccessoryNoteTableDataType
      })
    })
  }

  const initialize = async () => {
    try {
      const result = await accessoryNoteService.getItems(
        {
          paginator: { page: 1, pageSize: -1 }
        },
        table.setLoading
      )
      if (!result.success) throw new Error(define('dataLoad_failed'))
      const newColors = result.data as AccessoryNote[]

      dataMapped(newColors)
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const loadData = async (query: { isDeleted: boolean; searchTerm: string }) => {
    try {
      const result = await accessoryNoteService.getItems(
        {
          paginator: { page: 1, pageSize: -1 },
          filter: { field: 'id', items: [-1], status: query.isDeleted ? ['deleted'] : ['active'] },
          search: { field: 'title', term: query.searchTerm }
        },
        table.setLoading
      )
      if (!result.success) throw new Error(define('dataLoad_failed'))
      const newColors = result.data as AccessoryNote[]
      dataMapped(newColors)
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleUpdate = async (record: AccessoryNoteTableDataType) => {
    try {
      if (textComparator(record.title, newRecord.title) || textComparator(record.summary, newRecord.summary)) {
        await accessoryNoteService.updateItemByPkSync(record.id!, newRecord, table.setLoading, (meta) => {
          if (!meta?.success) throw new Error(define('update_failed'))
          const itemUpdated = meta.data as AccessoryNote
          table.handleUpdate(record.key, { ...itemUpdated, key: `${itemUpdated.id}` } as AccessoryNoteTableDataType)
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

  const handleAddNew = async (formAddNew: AccessoryNoteAddNewProps) => {
    try {
      await accessoryNoteService.createItemSync(formAddNew, table.setLoading, async (meta) => {
        if (!meta.success) throw new Error(define('create_failed'))
        const newAccessoryNote = meta.data as AccessoryNote
        table.handleAddNew({ ...newAccessoryNote, key: `${newAccessoryNote.id}` })
        message.success(define('created_success'))
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
      setOpenModal(false)
    }
  }

  const handleDelete = async (record: AccessoryNoteTableDataType) => {
    try {
      await accessoryNoteService.updateItemByPkSync(record.id!, { status: 'deleted' }, table.setLoading, (meta) => {
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

  const handleDeleteForever = async (record: AccessoryNoteTableDataType) => {
    try {
      await accessoryNoteService.deleteItemSync(record.id!, table.setLoading, (res) => {
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

  const handleRestore = async (record: AccessoryNoteTableDataType) => {
    try {
      await accessoryNoteService.updateItemByPkSync(record.id!, { status: 'active' }, table.setLoading, (meta) => {
        if (!meta?.success) throw new Error(define('restore_failed'))
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
      newRecord,
      setNewRecord,
      setOpenModal
    },
    service: {
      accessoryNoteService
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
