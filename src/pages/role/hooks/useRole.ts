import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import RoleAPI from '~/api/services/RoleAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Role } from '~/typing'
import { RoleTableDataType } from '../type'

export default function useRole(table: UseTableProps<RoleTableDataType>) {
  const { setLoading, setDataSource, handleConfirmCancelEditing, handleConfirmDeleting } = table

  // Services
  const roleService = useAPIService<Role>(RoleAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<Role>({})

  // List
  const [roles, setRoles] = useState<Role[]>([])

  const loadData = async () => {
    try {
      setLoading(true)
      await roleService.getListItems(defaultRequestBody, setLoading, (meta) => {
        if (meta?.success) {
          setRoles(meta.data as Role[])
        }
      })
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    selfConvertDataSource(roles)
  }, [roles])

  const selfConvertDataSource = (_roles: Role[]) => {
    const items = _roles ? _roles : roles
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          key: item.id
        } as RoleTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<RoleTableDataType>) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    try {
      setLoading(true)
      await roleService.updateItemByPk(record.id!, { ...newRecord }, setLoading, (meta) => {
        if (!meta?.success) throw new Error('API update failed')
        message.success('Success!')
      })
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      handleConfirmCancelEditing()
      loadData()
      setLoading(false)
    }
  }

  const handleAddNewItem = async (formAddNew: Role) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await roleService.createNewItem(
        {
          ...formAddNew
        },
        setLoading,
        async (meta, msg) => {
          if (!meta?.success) throw new Error(`${msg}`)
          message.success(msg)
        }
      )
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setOpenModal(false)
      loadData()
      setLoading(false)
    }
  }

  const handleConfirmDelete = async (
    record: TableItemWithKey<RoleTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    console.log(record)
    try {
      setLoading(true)
      await roleService.deleteItemByPk(record.id!, setLoading, (meta, msg) => {
        if (!meta?.success) throw new Error(`${msg}`)
        handleConfirmDeleting(record.id!)
        message.success(msg)
        onDataSuccess?.(meta)
      })
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      loadData()
      setLoading(false)
    }
  }

  const handlePageChange = async (_page: number) => {
    try {
      setLoading(true)
      await roleService.pageChange(
        _page,
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as Role[])
          }
        },
        { field: 'desc', term: searchText }
      )
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleResetClick = async () => {
    try {
      setLoading(true)
      setSearchText('')
      await roleService.getListItems(defaultRequestBody, setLoading, (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as Role[])
        }
      })
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      loadData()
      setLoading(false)
    }
  }

  const handleSortChange = async (checked: boolean) => {
    try {
      setLoading(true)
      await roleService.sortedListItems(
        checked ? 'asc' : 'desc',
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as Role[])
          }
        },
        { field: 'desc', term: searchText }
      )
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (value: string) => {
    try {
      setLoading(true)
      if (value.length > 0) {
        await roleService.getListItems(
          {
            ...defaultRequestBody,
            search: {
              field: 'desc',
              term: value
            }
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              selfConvertDataSource(meta?.data as Role[])
            }
          }
        )
      }
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      loadData()
      setLoading(false)
    }
  }

  return {
    searchText,
    setSearchText,
    openModal,
    loadData,
    newRecord,
    setNewRecord,
    setLoading,
    setOpenModal,
    setDataSource,
    roleService,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    selfConvertDataSource,
    handlePageChange,
    handleSortChange,
    handleResetClick,
    handleSearch
  }
}
