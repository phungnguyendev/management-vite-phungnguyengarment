import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
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

  useEffect(() => {
    initialize()
  }, [])

  const dataMapped = (groups: Group[]) => {
    table.setDataSource(() => {
      return groups.map((self) => {
        return {
          ...self,
          key: `${self.id}`
        } as GroupTableDataType
      })
    })
  }

  const initialize = async () => {
    try {
      const result = await groupService.getItems(
        {
          paginator: { page: 1, pageSize: -1 }
        },
        table.setLoading
      )
      if (!result.success) throw new Error(define('dataLoad_failed'))
      const newGroups = result.data as Group[]

      dataMapped(newGroups)
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const loadData = async (query: { isDeleted: boolean; searchTerm: string }) => {
    try {
      const result = await groupService.getItems(
        {
          paginator: { page: 1, pageSize: -1 },
          filter: { field: 'id', items: [-1], status: query.isDeleted ? ['deleted'] : ['active'] },
          search: { field: 'name', term: query.searchTerm }
        },
        table.setLoading
      )
      if (!result.success) throw new Error(define('dataLoad_failed'))
      const newGroups = result.data as Group[]
      dataMapped(newGroups)
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

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

  const handleDeleteForever = async (record: GroupTableDataType) => {
    try {
      await groupService.deleteItemSync(record.id!, table.setLoading, (res) => {
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

  const handleRestore = async (record: GroupTableDataType) => {
    try {
      await groupService.updateItemByPkSync(record.id!, { status: 'active' }, table.setLoading, (meta) => {
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
