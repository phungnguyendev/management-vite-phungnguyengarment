import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Paginator } from '~/api/client'
import GroupAPI from '~/api/services/GroupAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants'
import useAPIService from '~/hooks/useAPIService'
import { Group } from '~/typing'
import { textComparator } from '~/utils/helpers'
import { GroupAddNewProps, GroupTableDataType } from '../type'

export default function useGroupViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<GroupTableDataType>([])

  const groupService = useAPIService<Group>(GroupAPI)

  // State
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchTextChange, setSearchTextChange] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<GroupAddNewProps>({})
  const [paginator, setPaginator] = useState<Paginator>({
    page: 1,
    pageSize: -1
  })
  const [shorted, setSorted] = useState<boolean>(false)
  const [groups, setGroups] = useState<Group[]>([])

  useEffect(() => {
    loadData()
  }, [showDeleted, shorted, paginator, searchText])

  useEffect(() => {
    mappedData()
  }, [groups])

  const mappedData = useCallback(() => {
    table.setDataSource(() => {
      const _dataSource = groups.map((self) => {
        return {
          ...self,
          key: `${self.id}`
        } as GroupTableDataType
      })
      return _dataSource
    })
  }, [groups])

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
          if (!meta?.success) throw new Error(define('dataLoad_failed'))
          const _groups = meta.data as Group[]
          setGroups(_groups)
        }
      )
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }, [showDeleted, paginator, shorted, searchText])

  const handleUpdate = async (record: GroupTableDataType) => {
    try {
      if (textComparator(record.name, newRecord.name)) {
        await groupService.updateItemByPkSync(record.id!, { name: newRecord.name }, table.setLoading, (meta) => {
          if (!meta?.success) throw new Error(define('update_failed'))
          const itemUpdated = meta.data as Group
          table.handleUpdate(record.key, { ...itemUpdated, key: `${itemUpdated.id}` } as GroupTableDataType)
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

  const handleAddNew = async (formAddNew: GroupAddNewProps) => {
    try {
      await groupService.createItemSync(
        {
          name: formAddNew.name
        },
        table.setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(define('create_failed'))
          const newGroup = meta.data as Group
          table.handleAddNew({ ...newGroup, key: `${newGroup.id}` })
          message.success(define('created_success'))
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
    try {
      await groupService.updateItemByPkSync(record.id!, { status: 'deleted' }, table.setLoading, (meta) => {
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

  const handleDeleteForever = async (id: number) => {
    console.log(id)
    try {
      await groupService.deleteItemSync(id, table.setLoading, (res) => {
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

  const handleRestore = async (record: GroupTableDataType) => {
    try {
      await groupService.updateItemByPkSync(record.id!, { status: 'active' }, table.setLoading, (meta) => {
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
