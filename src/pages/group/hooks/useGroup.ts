import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import GroupAPI from '~/api/services/GroupAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Group } from '~/typing'
import { GroupTableDataType } from '../type'

export default function useGroup(table: UseTableProps<GroupTableDataType>) {
  const { setLoading, showDeleted, setDataSource, handleConfirmCancelEditing, handleConfirmDeleting } = table

  // Services
  const groupService = useAPIService<Group>(GroupAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<any>({})

  // List
  const [groups, setGroups] = useState<Group[]>([])

  // New
  const [groupNew, setGroupNew] = useState<Group | undefined>(undefined)

  const loadData = async () => {
    try {
      setLoading(true)
      await groupService.getListItems(
        {
          ...defaultRequestBody,
          paginator: { page: groupService.page, pageSize: defaultRequestBody.paginator?.pageSize },
          filter: { ...defaultRequestBody.filter, status: showDeleted ? 'deleted' : 'active' }
        },
        setLoading,
        (meta) => {
          if (meta?.success) {
            setGroups(meta.data as Group[])
          }
        }
      )
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [groupNew, showDeleted])
  useEffect(() => {
    selfConvertDataSource(groups)
  }, [groups])

  const selfConvertDataSource = (_groups: Group[]) => {
    const items = _groups ? _groups : groups
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          key: item.id
        } as GroupTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<GroupTableDataType>) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    try {
      setLoading(true)
      if (newRecord) {
        if (newRecord.name && newRecord.name !== record.name) {
          console.log('Group progressing...')
          await groupService.updateItemByPk(record.id!, { name: newRecord.name }, setLoading, (meta) => {
            if (!meta?.success) throw new Error('API update group failed')
          })
        }
        message.success('Success!')
      }
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      loadData()
      handleConfirmCancelEditing()
      setLoading(false)
    }
  }

  const handleAddNewItem = async (formAddNew: any) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await groupService.createNewItem(
        {
          name: formAddNew.name
        },
        setLoading,
        async (meta, msg) => {
          if (!meta?.success) throw new Error(`${msg}`)
          setGroupNew(meta.data as Group)
          message.success(msg)
        }
      )
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setOpenModal(false)
      setLoading(false)
    }
  }

  const handleConfirmDelete = async (
    record: TableItemWithKey<GroupTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      console.log(record)
      setLoading(true)
      await groupService.updateItemByPk(record.id!, { status: 'deleted' }, setLoading, (meta, msg) => {
        if (meta) {
          if (meta.success) {
            handleConfirmDeleting(record.id!)
            message.success(msg)
          }
        } else {
          message.error(msg)
        }
        onDataSuccess?.(meta)
      })
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmRestore = async (
    record: TableItemWithKey<GroupTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      await groupService.updateItemByPk(record.id!, { status: 'active' }, setLoading, (meta) => {
        if (!meta?.success) throw new Error(meta?.message)
        handleConfirmDeleting(record.id!)
        message.success('Restored!')
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
      await groupService.pageChange(
        _page,
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as Group[])
          }
        },
        { field: 'name', term: searchText }
      )
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleResetClick = async () => {
    setSearchText('')
    try {
      setLoading(true)
      await groupService.getListItems(defaultRequestBody, setLoading, (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as Group[])
        }
      })
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSortChange = async (checked: boolean, _event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setLoading(true)
      await groupService.sortedListItems(
        checked ? 'asc' : 'desc',
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as Group[])
          }
        },
        { field: 'name', term: searchText }
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
        await groupService.getListItems(
          {
            ...defaultRequestBody,
            search: {
              field: 'name',
              term: value
            }
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              selfConvertDataSource(meta?.data as Group[])
            }
          }
        )
      }
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
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
    groupService,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    handleConfirmRestore,
    selfConvertDataSource,
    handlePageChange,
    handleSortChange,
    handleResetClick,
    handleSearch
  }
}
