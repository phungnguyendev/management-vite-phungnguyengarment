import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import ImportationAPI from '~/api/services/ImportationAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { ProductTableDataType } from '~/pages/product/type'
import { Importation, Product } from '~/typing'
import { dateFormatter } from '~/utils/date-formatter'
import { ImportationTableDataType } from '../type'

export default function useImportationTable(
  table: UseTableProps<ImportationTableDataType>,
  record: ProductTableDataType
) {
  const { dataSource, setDataSource, setLoading, handleConfirmCancelEditing } = table

  // Services
  const importationService = useAPIService<Importation>(ImportationAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<Importation>({})

  // List
  const [importations, setImportations] = useState<Importation[]>([])

  const amountQuantity =
    dataSource && dataSource.length > 0 ? dataSource.reduce((acc, current) => acc + (current.quantity ?? 0), 0) : 0

  // New
  const loadData = async () => {
    try {
      setLoading(true)
      await importationService.getListItems(
        {
          ...defaultRequestBody,
          paginator: { page: importationService.page, pageSize: defaultRequestBody.paginator?.pageSize },
          search: { field: 'productID', term: `${record.id}` }
        },
        setLoading,
        (meta) => {
          if (meta?.success) {
            setImportations(meta.data as Importation[])
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
  }, [])

  useEffect(() => {
    selfConvertDataSource(importations)
  }, [importations])

  const selfConvertDataSource = (_importations: Importation[]) => {
    const items = _importations ? _importations : importations
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          key: item.id
        } as ImportationTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<ImportationTableDataType>) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    try {
      setLoading(true)
      if (newRecord) {
        console.log('Importation progressing: ', newRecord)
        try {
          await importationService.updateItemByPk(
            record.id!,
            {
              ...newRecord
            },
            setLoading,
            (meta) => {
              if (!meta?.success) {
                throw new Error('API update failed')
              }
            }
          )
        } catch (error: any) {
          const resError: ResponseDataType = error
          throw resError
        }
      } else {
        console.log('add new')
        try {
          await importationService.createNewItem(newRecord, table.setLoading, (meta) => {
            if (!meta?.success) {
              throw new Error('API create failed')
            }
          })
        } catch (error: any) {
          const resError: ResponseDataType = error
          throw resError
        }
      }
      message.success('Success!')
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      handleConfirmCancelEditing()
      loadData()
      setLoading(false)
    }
  }

  const handleAddNewItem = async (formAddNew: any) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await importationService.createNewItem(
        {
          productID: record.id!,
          quantity: formAddNew.quantity,
          dateImported: dateFormatter(formAddNew.dateImported, 'iso8601')
        },
        setLoading,
        async (meta, msg) => {
          if (!meta?.success) throw new Error('API create failed')
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
    record: TableItemWithKey<ImportationTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      setLoading(true)
      await importationService.deleteItemByPk(record.id!, setLoading, (meta, msg) => {
        if (!meta?.success) {
          throw new Error('API delete failed')
        }
        message.success(msg)
        onDataSuccess?.(meta)
      })
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      loadData()
      setOpenModal(false)
      setLoading(false)
    }
  }

  const handlePageChange = async (_page: number) => {
    try {
      setLoading(true)
      await importationService.pageChange(
        _page,
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as Product[])
          }
        },
        { field: 'productCode', term: searchText }
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
    loadData()
  }

  const handleSortChange = async (checked: boolean) => {
    try {
      setLoading(true)
      await importationService.sortedListItems(
        checked ? 'asc' : 'desc',
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as Product[])
          }
        },
        { field: 'productCode', term: searchText }
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
        await importationService.getListItems(
          {
            ...defaultRequestBody,
            search: {
              field: 'productCode',
              term: value
            }
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              selfConvertDataSource(meta?.data as Product[])
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
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    selfConvertDataSource,
    handlePageChange,
    handleSortChange,
    handleResetClick,
    handleSearch,
    importationService,
    amountQuantity
  }
}
