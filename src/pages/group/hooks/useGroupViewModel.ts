import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Paginator } from '~/api/client'
import GroupAPI from '~/api/services/GroupAPI'
import useTable from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Group } from '~/typing'
import { textComparator } from '~/utils/helpers'
import { GroupAddNewProps } from '../components/ModalAddNewGroup'
import { GroupTableDataType } from '../type'

export default function useGroupViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<GroupTableDataType>([])

  const groupService = useAPIService<Group>(GroupAPI)

  // State
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchTextChange, setSearchTextChange] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<any>({})
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
      await groupService.getItemsSync(
        {
          paginator: paginator,
          sorting: { column: 'id', direction: shorted ? 'asc' : 'desc' },
          filter: { field: 'id', items: [-1], status: showDeleted ? 'deleted' : 'active' },
          search: { field: 'name', term: searchText }
        },
        table.setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(`${meta.message}`)
          const Groups = meta.data as Group[]
          table.setDataSource(
            Groups.map((item) => {
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

  const handleUpdate = async (record: GroupTableDataType) => {
    console.log('handleUpdate')
    // const row = (await form.validateFields()) as any
    try {
      if (textComparator(record.name, newRecord.name)) {
        console.log('Group progressing...')
        await groupService.updateItemByPkSync(record.id!, { name: newRecord.name }, table.setLoading, (meta) => {
          if (!meta?.success) throw new Error(`${meta.message}`)
          const itemUpdated = meta.data as Group
          table.handleUpdate(record.key, { ...itemUpdated, key: `${itemUpdated.id}` } as GroupTableDataType)
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

  const handleAddNew = async (formAddNew: GroupAddNewProps) => {
    try {
      console.log('handleAddNew')
      console.log(formAddNew)
      table.setLoading(true)
      await groupService.createItemSync(
        {
          name: formAddNew.name
        },
        table.setLoading,
        async (meta) => {
          if (!meta?.success) throw new Error(`${meta.message}`)
          const newGroup = meta.data as Group
          table.handleAddNew({ ...newGroup, key: `${newGroup.id}` })
          message.success(meta.message)
        }
      )
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
      setOpenModal(false)
    }
  }

  const handleDelete = async (record: GroupTableDataType) => {
    console.log('handleDelete')
    try {
      await groupService.updateItemByPkSync(record.id!, { status: 'deleted' }, table.setLoading, (meta) => {
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
      await groupService.deleteItemSync(id, table.setLoading, (res) => {
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

  const handleRestore = async (record: GroupTableDataType) => {
    try {
      await groupService.updateItemByPkSync(record.id!, { status: 'active' }, table.setLoading, (meta) => {
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
      groupService
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
