import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Paginator } from '~/api/client'
import AccessoryNoteAPI from '~/api/services/AccessoryNoteAPI'
import useTable from '~/components/hooks/useTable'
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

  useEffect(() => {
    loadData()
  }, [showDeleted, shorted, paginator, searchText])

  const loadData = useCallback(async () => {
    try {
      table.setLoading(true)
      await accessoryNoteService.getItemsSync(
        {
          paginator: paginator,
          sorting: { column: 'id', direction: shorted ? 'asc' : 'desc' },
          filter: { field: 'id', items: [-1], status: showDeleted ? 'deleted' : 'active' },
          search: { field: 'title', term: searchText }
        },
        table.setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(`${meta.message}`)
          const accessoryNotes = meta.data as AccessoryNote[]
          table.setDataSource(
            accessoryNotes.map((item) => {
              return {
                ...item,
                key: `${item.id}`
              }
            })
          )
        }
      )
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }, [showDeleted, paginator, shorted, searchText])

  const handleUpdate = async (record: AccessoryNoteTableDataType) => {
    console.log('handleUpdate')
    // const row = (await form.validateFields()) as any
    try {
      if (textComparator(record.title, newRecord.title) || textComparator(record.summary, newRecord.summary)) {
        console.log('AccessoryNote progressing...')
        await accessoryNoteService.updateItemByPkSync(record.id!, newRecord, table.setLoading, (meta) => {
          if (!meta?.success) throw new Error(`${meta.message}`)
          const itemUpdated = meta.data as AccessoryNote
          table.handleUpdate(record.key, { ...itemUpdated, key: `${itemUpdated.id}` } as AccessoryNoteTableDataType)
          message.success('Success!')
        })
      }
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
      table.handleCancelEditing()
    }
  }

  const handleAddNew = async (formAddNew: AccessoryNoteAddNewProps) => {
    try {
      console.log('handleAddNew')
      console.log(formAddNew)
      table.setLoading(true)
      await accessoryNoteService.createItemSync(formAddNew, table.setLoading, async (meta) => {
        if (!meta?.success) throw new Error(`${meta.message}`)
        const newAccessoryNote = meta.data as AccessoryNote
        table.handleAddNew({ ...newAccessoryNote, key: `${newAccessoryNote.id}` })
        message.success(meta.message)
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
      setOpenModal(false)
    }
  }

  const handleDelete = async (record: AccessoryNoteTableDataType) => {
    console.log('handleDelete')
    try {
      await accessoryNoteService.updateItemByPkSync(record.id!, { status: 'deleted' }, table.setLoading, (meta) => {
        if (!meta?.success) throw new Error(meta?.message)
        table.handleDeleting(record.key)
        message.success('Deleted!')
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleDeleteForever = async (id: number) => {
    console.log(id)
    try {
      await accessoryNoteService.deleteItemSync(id, table.setLoading, (res) => {
        if (!res.success) throw new Error(res.message)
        table.handleDeleting(`${id}`)
        message.success(`${res.message}`)
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
        if (!meta?.success) throw new Error(meta?.message)
        table.handleDeleting(`${record.id!}`)
        message.success('Restored!')
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
