import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Paginator } from '~/api/client'
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
  const [paginator, setPaginator] = useState<Paginator>({
    page: 1,
    pageSize: -1
  })
  const [shorted, setSorted] = useState<boolean>(false)

  const [accessoryNotes, setAccessoryNotes] = useState<AccessoryNote[]>([])

  useEffect(() => {
    loadData()
  }, [showDeleted, shorted, paginator, searchText])

  useEffect(() => {
    mappedData()
  }, [accessoryNotes])

  const mappedData = useCallback(() => {
    table.setDataSource(() => {
      const _dataSource = accessoryNotes.map((self) => {
        return {
          ...self,
          key: `${self.id}`
        } as AccessoryNoteTableDataType
      })
      return _dataSource
    })
  }, [accessoryNotes])

  const loadData = useCallback(async () => {
    try {
      await accessoryNoteService.getItemsSync(
        {
          paginator: paginator,
          sorting: { column: 'id', direction: shorted ? 'asc' : 'desc' },
          filter: { field: 'id', items: [-1], status: showDeleted ? 'deleted' : 'active' },
          search: { field: 'title', term: searchText }
        },
        table.setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(define('dataLoad_failed'))
          const _accessoryNotes = meta.data as AccessoryNote[]
          setAccessoryNotes(_accessoryNotes)
        }
      )
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }, [showDeleted, paginator, shorted, searchText])

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

  const handleDeleteForever = async (id?: number) => {
    console.log(id)
    try {
      await accessoryNoteService.deleteItemSync(id, table.setLoading, (res) => {
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

  const handleRestore = async (record: AccessoryNoteTableDataType) => {
    try {
      await accessoryNoteService.updateItemByPkSync(record.id!, { status: 'active' }, table.setLoading, (meta) => {
        if (!meta?.success) throw new Error(define('restore_failed'))
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
    console.log(value)
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
