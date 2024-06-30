import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Paginator, ResponseDataType } from '~/api/client'
import CompletionAPI from '~/api/services/CompletionAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import useTable from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Completion, Product, ProductColor } from '~/typing'
import { dateComparator, numberComparator } from '~/utils/helpers'
import { CompletionNewRecordProps, CompletionTableDataType } from '../type'

export default function useCompletionViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<CompletionTableDataType>([])

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const completionService = useAPIService<Completion>(CompletionAPI)
  // UI

  // State changes
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [paginator, setPaginator] = useState<Paginator>({
    page: 1,
    pageSize: -1
  })
  const [shorted, setSorted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchTextChange, setSearchTextChange] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<CompletionNewRecordProps | null>(null)
  // List
  const [products, setProducts] = useState<Product[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [completions, setCompletions] = useState<Completion[]>([])

  useEffect(() => {
    mappedData()
  }, [products, productColors, completions])

  const mappedData = useCallback(() => {
    table.setDataSource(() => {
      const _dataSource = products.map((self) => {
        return {
          ...self,
          key: `${self.id}`,
          productColor: productColors.find((item) => item.productID === self.id),
          completion: completions.find((item) => item.productID === self.id)
        } as CompletionTableDataType
      })
      return [..._dataSource]
    })
  }, [products, productColors, completions])

  const loadData = async () => {
    try {
      table.setLoading(true)
      const productResult = await productService.getItems(
        {
          paginator: paginator,
          sorting: { column: 'id', direction: shorted ? 'asc' : 'desc' },
          filter: { field: 'id', items: [-1], status: showDeleted ? 'deleted' : 'active' },
          search: { field: 'title', term: searchText }
        },
        table.setLoading
      )
      setProducts(productResult.data as Product[])

      const productColorResult = await productColorService.getItems(
        {
          paginator: { page: 1, pageSize: -1 }
        },
        table.setLoading
      )
      setProductColors(productColorResult.data as ProductColor[])

      const completionResult = await completionService.getItems(
        {
          paginator: { page: 1, pageSize: -1 }
        },
        table.setLoading
      )
      setCompletions(completionResult.data as Completion[])
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleUpdate = async (record: CompletionTableDataType) => {
    console.log({ old: record, new: newRecord })
    try {
      if (record.completion && newRecord) {
        if (
          numberComparator(newRecord.quantityIroned, record.completion.quantityIroned) ||
          numberComparator(newRecord.quantityCheckPassed, record.completion.quantityCheckPassed) ||
          numberComparator(newRecord.quantityPackaged, record.completion.quantityPackaged) ||
          dateComparator(newRecord.exportedDate, record.completion.exportedDate) ||
          dateComparator(newRecord.passFIDate, record.completion.passFIDate)
        ) {
          console.log('Update')
          await completionService.updateItemByPkSync(
            record.completion.id!,
            {
              ...newRecord
            },
            table.setLoading,
            (meta) => {
              if (!meta?.success) throw new Error(meta.message)
            }
          )
        }
      } else {
        console.log('Create')
        try {
          await completionService.createItemSync(
            {
              ...newRecord,
              productID: record.id!
            },
            table.setLoading,
            (meta) => {
              if (!meta?.success) throw new Error(meta.message)
            }
          )
        } catch (error: any) {
          const resError: ResponseDataType = error
          throw resError
        }
      }
      message.success('Success!')
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
      table.handleCancelEditing()
    }
  }

  const handleDelete = async (record: CompletionTableDataType) => {
    try {
      // await completionService.deleteItemBySync(
      //   {
      //     field: 'productID',
      //     key: record.id!
      //   },
      //   table.setLoading,
      //   async (meta, msg) => {
      //     if (!meta?.success) {
      //       throw new Error('API delete failed')
      //     }
      //     onDataSuccess?.(meta)
      //     message.success(msg)
      //   }
      // )
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      loadData()
      table.setLoading(false)
    }
  }

  const handleDeleteForever = async (id?: number) => {}

  const handleRestore = async (record: CompletionTableDataType) => {}

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
      productColors,
      completions,
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
      productService,
      productColorService,
      completionService
    },
    action: {
      loadData,
      handleUpdate,
      handleSortChange,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleDeleteForever,
      handleRestore
    },
    table
  }
}
