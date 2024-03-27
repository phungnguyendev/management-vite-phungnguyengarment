import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Color } from '~/typing'
import { ColorTableDataType } from '../type'

export default function useColor(table: UseTableProps<ColorTableDataType>) {
  const { setLoading, showDeleted, setDataSource, handleConfirmCancelEditing, handleConfirmDeleting } = table

  // Services
  const colorService = useAPIService<Color>(ColorAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<any>({})

  // List
  const [colors, setColors] = useState<Color[]>([])

  // New
  const [colorNew, setColorNew] = useState<Color | undefined>(undefined)

  const loadData = async () => {
    try {
      setLoading(true)
      await colorService.getListItems(
        {
          ...defaultRequestBody,
          paginator: { page: colorService.page, pageSize: defaultRequestBody.paginator?.pageSize },
          filter: { ...defaultRequestBody.filter, status: showDeleted ? 'deleted' : 'active' }
        },
        setLoading,
        (meta) => {
          if (meta?.success) {
            setColors(meta.data as Color[])
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
  }, [colorNew, showDeleted])

  useEffect(() => {
    selfConvertDataSource(colors)
  }, [colors])

  const selfConvertDataSource = (_colors: Color[]) => {
    const items = _colors ? _colors : colors
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          key: item.id
        } as ColorTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<ColorTableDataType>, newRecord: any) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    if (newRecord) {
      try {
        if (
          (newRecord.name && newRecord.name !== record.name) ||
          (newRecord.hexColor && newRecord.hexColor !== record.hexColor)
        ) {
          console.log('Color progressing...')
          await colorService.updateItemByPk(
            record.id!,
            { name: newRecord.name, hexColor: newRecord.hexColor },
            setLoading,
            (meta) => {
              if (!meta?.success) {
                throw new Error('API update Color failed')
              }
            }
          )
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
  }

  const handleAddNewItem = async (formAddNew: any) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await colorService.createNewItem(
        {
          name: formAddNew.name,
          hexColor: formAddNew.hexColor
        },
        setLoading,
        async (meta, msg) => {
          if (meta?.data) {
            setColorNew(meta.data as Color)
            message.success(msg)
          } else {
            console.log('Errr')
            message.error(msg)
          }
        }
      )
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
      setOpenModal(false)
    }
  }

  const handleConfirmDelete = async (
    record: TableItemWithKey<ColorTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      await colorService.updateItemByPk(record.id!, { status: 'deleted' }, setLoading, (meta) => {
        if (!meta?.success) throw new Error(meta?.message)
        handleConfirmDeleting(record.id!)
        message.success('Deleted!')
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
    record: TableItemWithKey<ColorTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      await colorService.updateItemByPk(record.id!, { status: 'active' }, setLoading, (meta) => {
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
    await colorService.pageChange(
      _page,
      setLoading,
      (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as Color[])
        }
      },
      { field: 'productCode', term: searchText }
    )
  }

  const handleResetClick = async () => {
    try {
      setSearchText('')
      await colorService.getListItems(defaultRequestBody, setLoading, (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as Color[])
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
      await colorService.sortedListItems(
        checked ? 'asc' : 'desc',
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as Color[])
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
      if (value.length > 0) {
        await colorService.getListItems(
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
              selfConvertDataSource(meta?.data as Color[])
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
    colorService,
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
