import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Paginator } from '~/api/client'
import RoleAPI from '~/api/services/RoleAPI'
import useTable from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Role } from '~/typing'
import { textComparator } from '~/utils/helpers'
import { RoleAddNewProps } from '../components/ModalAddNewRole'
import { RoleTableDataType } from '../type'

export default function useRoleViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<RoleTableDataType>([])

  const roleService = useAPIService<Role>(RoleAPI)

  // State
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchTextChange, setSearchTextChange] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<RoleAddNewProps>({})
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
      await roleService.getItemsSync(
        {
          paginator: paginator,
          sorting: { column: 'id', direction: shorted ? 'asc' : 'desc' },
          filter: { field: 'id', items: [-1], status: showDeleted ? 'deleted' : 'active' },
          search: { field: 'name', term: searchText }
        },
        table.setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(`${meta.message}`)
          const roles = meta.data as Role[]
          table.setDataSource(
            roles.map((item) => {
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

  const handleUpdate = async (record: RoleTableDataType) => {
    console.log('handleUpdate')
    // const row = (await form.validateFields()) as any
    try {
      if (
        textComparator(record.role, newRecord.role) ||
        textComparator(record.shortName, newRecord.shortName) ||
        textComparator(record.desc, newRecord.desc)
      ) {
        console.log('Role progressing...')
        await roleService.updateItemByPkSync(record.id!, { ...newRecord }, table.setLoading, (meta) => {
          if (!meta?.success) throw new Error(`${meta.message}`)
          const itemUpdated = meta.data as Role
          table.handleUpdate(record.key, { ...itemUpdated, key: `${itemUpdated.id}` } as RoleTableDataType)
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

  const handleAddNew = async (formAddNew: RoleAddNewProps) => {
    // try {
    //   console.log('handleAddNew')
    //   console.log(formAddNew)
    //   table.setLoading(true)
    //   await roleService.createItemSync(
    //     {
    //       name: formAddNew.name
    //     },
    //     table.setLoading,
    //     async (meta) => {
    //       if (!meta?.success) throw new Error(`${meta.message}`)
    //       const newRole = meta.data as Role
    //       table.handleAddNew({ ...newRole, key: `${newRole.id}` })
    //       message.success(meta.message)
    //     }
    //   )
    // } catch (error: any) {
    //   message.error(`${error.message}`)
    // } finally {
    //   table.setLoading(false)
    //   setOpenModal(false)
    // }
  }

  const handleDelete = async (record: RoleTableDataType) => {
    console.log('handleDelete')
    try {
      await roleService.updateItemByPkSync(record.id!, { status: 'deleted' }, table.setLoading, (meta) => {
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
      await roleService.deleteItemSync(id, table.setLoading, (res) => {
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

  const handleRestore = async (record: RoleTableDataType) => {
    try {
      await roleService.updateItemByPkSync(record.id!, { status: 'active' }, table.setLoading, (meta) => {
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
      roleService
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
