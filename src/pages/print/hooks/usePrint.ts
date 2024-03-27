import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import PrintAPI from '~/api/services/PrintAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Print } from '~/typing'
import { PrintTableDataType } from '../type'

export default function usePrint(table: UseTableProps<PrintTableDataType>) {
  const { setLoading, showDeleted, setDataSource, handleConfirmCancelEditing, handleConfirmDeleting } = table

  // Services
  const printService = useAPIService<Print>(PrintAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<any>({})

  // List
  const [prints, setPrints] = useState<Print[]>([])

  // New
  const [groupNew, setGroupNew] = useState<Print | undefined>(undefined)

  const loadData = async () => {
    try {
      setLoading(true)
      await printService.getListItems(
        {
          ...defaultRequestBody,
          paginator: { page: printService.page, pageSize: defaultRequestBody.paginator?.pageSize },
          filter: { ...defaultRequestBody.filter, status: showDeleted ? 'deleted' : 'active' }
        },
        setLoading,
        (meta) => {
          if (meta?.success) {
            setPrints(meta.data as Print[])
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
    selfConvertDataSource(prints)
  }, [prints])

  const selfConvertDataSource = (_prints: Print[]) => {
    const items = _prints ? _prints : prints
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          key: item.id
        } as PrintTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<PrintTableDataType>) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    try {
      setLoading(true)
      if (newRecord.name && newRecord.name !== record.name) {
        console.log('Group progressing...')
        await printService.updateItemByPk(record.id!, { name: newRecord.name }, setLoading, (meta) => {
          if (!meta?.success) throw new Error('API update group failed')
        })
      }
      message.success('Success!')
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
      handleConfirmCancelEditing()
      loadData()
    }
  }

  const handleAddNewItem = async (formAddNew: any) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await printService.createNewItem(
        {
          name: formAddNew.name
        },
        setLoading,
        async (meta, msg) => {
          if (!meta?.success) throw new Error(`${msg}`)
          setGroupNew(meta.data as Print)
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
    record: TableItemWithKey<PrintTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    console.log(record)
    try {
      setLoading(true)
      await printService.updateItemByPk(record.id!, { status: 'deleted' }, setLoading, (meta, msg) => {
        if (!meta?.success) throw new Error(`${msg}`)
        handleConfirmDeleting(record.id!)
        message.success('Deleted!')
        onDataSuccess?.(meta)
      })
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setOpenModal(false)
      setLoading(false)
    }
  }

  const handleConfirmRestore = async (
    record: TableItemWithKey<PrintTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      await printService.updateItemByPk(record.id!, { status: 'active' }, setLoading, (meta) => {
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
      await printService.pageChange(
        _page,
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as Print[])
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
    try {
      setLoading(true)
      setSearchText('')
      await printService.getListItems(defaultRequestBody, setLoading, (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as Print[])
        }
      })
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = async (checked: boolean) => {
    try {
      setLoading(true)
      await printService.sortedListItems(
        checked ? 'asc' : 'desc',
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as Print[])
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
        await printService.getListItems(
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
              selfConvertDataSource(meta?.data as Print[])
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
    printService,
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
