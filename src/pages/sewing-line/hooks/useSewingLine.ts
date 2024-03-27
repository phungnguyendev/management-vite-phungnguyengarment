import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import SewingLineAPI from '~/api/services/SewingLineAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { SewingLine } from '~/typing'
import { SewingLineTableDataType } from '../type'

export default function useSewingLine(table: UseTableProps<SewingLineTableDataType>) {
  const { setLoading, showDeleted, setDataSource, handleConfirmCancelEditing, handleConfirmDeleting } = table

  // Services
  const sewingLineService = useAPIService<SewingLine>(SewingLineAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<any>({})

  // List
  const [sewingLines, setSewingLines] = useState<SewingLine[]>([])

  // New
  const [SewingLineNew, setSewingLineNew] = useState<SewingLine | undefined>(undefined)

  const loadData = async () => {
    try {
      setLoading(true)
      await sewingLineService.getListItems(
        {
          ...defaultRequestBody,
          paginator: { page: sewingLineService.page, pageSize: defaultRequestBody.paginator?.pageSize },
          filter: { ...defaultRequestBody.filter, status: showDeleted ? 'deleted' : 'active' }
        },
        setLoading,
        (meta) => {
          if (meta?.success) {
            setSewingLines(meta.data as SewingLine[])
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
  }, [SewingLineNew, showDeleted])

  useEffect(() => {
    selfConvertDataSource(sewingLines)
  }, [sewingLines])

  const selfConvertDataSource = (_sewingLines: SewingLine[]) => {
    const items = _sewingLines ? _sewingLines : sewingLines
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          key: item.id
        } as SewingLineTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<SewingLineTableDataType>, newRecord: any) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    try {
      setLoading(true)
      if (newRecord) {
        if (newRecord.name && newRecord.name !== record.name) {
          console.log('SewingLine progressing...')
          await sewingLineService.updateItemByPk(record.id!, { name: newRecord.name }, setLoading, (meta) => {
            if (!meta?.success) throw new Error('API update SewingLine failed')
          })
        }
        message.success('Success!')
      }
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      handleConfirmCancelEditing()
      loadData()
      setLoading(false)
    }
  }

  const handleAddNewItem = async (formAddNew: SewingLine) => {
    try {
      // console.log(formAddNew)
      setLoading(true)
      await sewingLineService.createNewItem(
        {
          name: formAddNew.name
        },
        setLoading,
        async (meta, msg) => {
          if (!meta?.success) throw new Error(msg)
          setSewingLineNew(meta.data as SewingLine)
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
    record: TableItemWithKey<SewingLineTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    console.log(record)
    try {
      setLoading(true)
      await sewingLineService.updateItemByPk(record.id!, { status: 'deleted' }, setLoading, (meta, msg) => {
        if (!meta?.success) throw new Error(msg)
        handleConfirmDeleting(record.id!)
        onDataSuccess?.(meta)
        message.success('Deleted!')
      })
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmRestore = async (
    record: TableItemWithKey<SewingLineTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      await sewingLineService.updateItemByPk(record.id!, { status: 'active' }, setLoading, (meta) => {
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
      await sewingLineService.pageChange(
        _page,
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as SewingLine[])
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
      await sewingLineService.getListItems(defaultRequestBody, setLoading, (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as SewingLine[])
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
      await sewingLineService.sortedListItems(
        checked ? 'asc' : 'desc',
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as SewingLine[])
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
        await sewingLineService.getListItems(
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
              selfConvertDataSource(meta?.data as SewingLine[])
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
    sewingLineService,
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
