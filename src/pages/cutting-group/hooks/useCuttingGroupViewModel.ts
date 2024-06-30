import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Paginator, ResponseDataType } from '~/api/client'
import CuttingGroupAPI from '~/api/services/CuttingGroupAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import useTable from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { CuttingGroup, Product, ProductColor } from '~/typing'
import { dateValidator, numberValidator } from '~/utils/helpers'
import { CuttingGroupNewRecordProps, CuttingGroupTableDataType } from '../type'

export default function useCuttingGroupViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<CuttingGroupTableDataType>([])

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const cuttingGroupService = useAPIService<CuttingGroup>(CuttingGroupAPI)

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
  const [newRecord, setNewRecord] = useState<CuttingGroupNewRecordProps>({})

  // List
  const [products, setProducts] = useState<Product[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [cuttingGroups, setCuttingGroups] = useState<CuttingGroup[]>([])

  // New
  const [sampleSewingNew, setCuttingGroupNew] = useState<CuttingGroup | undefined>(undefined)

  useEffect(() => {
    loadData()
  }, [sampleSewingNew, showDeleted])

  useEffect(() => {
    mappedData()
  }, [products, productColors, cuttingGroups])

  const mappedData = useCallback(() => {
    table.setDataSource(() => {
      const _dataSource = products.map((self) => {
        return {
          ...self,
          key: `${self.id}`,
          productColor: productColors.find((item) => item.productID === self.id),
          cuttingGroup: cuttingGroups.find((item) => item.productID === self.id)
        } as CuttingGroupTableDataType
      })
      return [..._dataSource]
    })
  }, [products, productColors, cuttingGroups])

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

      const completionResult = await cuttingGroupService.getItems(
        {
          paginator: { page: 1, pageSize: -1 }
        },
        table.setLoading
      )
      setCuttingGroups(completionResult.data as CuttingGroup[])
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleUpdate = async (record: CuttingGroupTableDataType) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    try {
      table.setLoading(true)
      if (newRecord.quantityRealCut && !numberValidator(newRecord.quantityRealCut))
        throw new Error('Quantity must be than zero!')

      if (newRecord.timeCut && !dateValidator(newRecord.timeCut)) throw new Error('Invalid time cut!')

      if (newRecord.dateSendEmbroidered && !dateValidator(newRecord.dateSendEmbroidered))
        throw new Error('Invalid date send embroidered!')

      if (newRecord.quantityDeliveredBTP && !numberValidator(newRecord.quantityDeliveredBTP))
        throw new Error('Invalid quantity delivery BTP!')

      if (newRecord.quantityArrived1Th && !numberValidator(newRecord.quantityArrived1Th)) throw new Error('Invalid 1!')

      if (newRecord.quantityArrived2Th && !numberValidator(newRecord.quantityArrived2Th)) throw new Error('Invalid 2!')

      if (newRecord.quantityArrived3Th && !numberValidator(newRecord.quantityArrived3Th)) throw new Error('Invalid 3!')

      if (newRecord.quantityArrived4Th && !numberValidator(newRecord.quantityArrived4Th)) throw new Error('Invalid 4!')

      if (newRecord.quantityArrived5Th && !numberValidator(newRecord.quantityArrived5Th)) throw new Error('Invalid 5!')

      if (newRecord.quantityArrived6Th && !numberValidator(newRecord.quantityArrived6Th)) throw new Error('Invalid 6!')

      if (newRecord.quantityArrived7Th && !numberValidator(newRecord.quantityArrived7Th)) throw new Error('Invalid 7!')

      if (newRecord.quantityArrived8Th && !numberValidator(newRecord.quantityArrived8Th)) throw new Error('Invalid 8!')

      if (newRecord.quantityArrived9Th && !numberValidator(newRecord.quantityArrived9Th)) throw new Error('Invalid 9!')

      if (newRecord.quantityArrived10Th && !numberValidator(newRecord.quantityArrived10Th))
        throw new Error('Invalid 10!')

      if (
        !record.cuttingGroup &&
        (newRecord.quantityRealCut ||
          newRecord.timeCut ||
          newRecord.dateSendEmbroidered ||
          newRecord.quantityDeliveredBTP ||
          newRecord.quantityArrived1Th ||
          newRecord.quantityArrived2Th ||
          newRecord.quantityArrived3Th ||
          newRecord.quantityArrived4Th ||
          newRecord.quantityArrived5Th ||
          newRecord.quantityArrived6Th ||
          newRecord.quantityArrived7Th ||
          newRecord.quantityArrived8Th ||
          newRecord.quantityArrived9Th ||
          newRecord.quantityArrived10Th)
      ) {
        console.log('add new')
        await cuttingGroupService.createItemSync({ ...newRecord, productID: record.id }, table.setLoading, (meta) => {
          if (!meta?.success) throw new Error(meta.message)
        })
      }
      if (record.cuttingGroup) {
        console.log('CuttingGroup progressing: ', newRecord)
        await cuttingGroupService.updateItemBySync(
          { field: 'productID', id: record.id! },
          {
            ...newRecord
          },
          table.setLoading,
          (meta) => {
            if (!meta?.success) throw new Error(meta.message)
          }
        )
      }
      message.success('Success!')
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.handleCancelEditing()
      table.setLoading(false)
    }
  }

  const handleDelete = async (record: CuttingGroupTableDataType) => {
    // try {
    //   table.setLoading(true)
    //   if (record.cuttingGroup) {
    //     await cuttingGroupService.deleteItemByPk(record.cuttingGroup.id!, table.setLoading, (meta, msg) => {
    //       if (!meta?.success) throw new Error('API delete failed')
    //       message.success(msg)
    //       onDataSuccess?.(meta)
    //     })
    //   }
    // } catch (error: any) {
    //   const resError: ResponseDataType = error.data
    //   message.error(`${resError.message}`)
    // } finally {
    //   loadData()
    //   table.setLoading(false)
    //   setOpenModal(false)
    // }
  }

  const handleDeleteForever = async (id: number) => {
    // console.log(id)
    // try {
    //   await accessoryNoteService.deleteItemSync(id, table.setLoading, (res) => {
    //     if (!res.success) throw new Error(res.message)
    //     table.handleDeleting(`${id}`)
    //     message.success(`${res.message}`)
    //   })
    // } catch (error: any) {
    //   message.error(`${error.message}`)
    // } finally {
    //   table.setLoading(false)
    // }
  }

  const handleRestore = async (record: CuttingGroupTableDataType) => {
    // try {
    //   await accessoryNoteService.updateItemByPkSync(record.id!, { status: 'active' }, table.setLoading, (meta) => {
    //     if (!meta?.success) throw new Error(meta?.message)
    //     table.handleDeleting(`${record.id!}`)
    //     message.success('Restored!')
    //   })
    // } catch (error: any) {
    //   message.error(`${error.message}`)
    // } finally {
    //   loadData()
    //   table.setLoading(false)
    // }
  }

  const handlePageChange = async (_page: number) => {
    // try {
    //   table.setLoading(true)
    //   await productService.pageChange(
    //     _page,
    //     table.setLoading,
    //     (meta) => {
    //       if (meta?.success) {
    //         selfConvertDataSource(meta?.data as Product[])
    //       }
    //     },
    //     { field: 'productCode', term: searchText }
    //   )
    // } catch (error: any) {
    //   const resError: ResponseDataType = error.data
    //   message.error(`${resError.message}`)
    // } finally {
    //   table.setLoading(false)
    // }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSortChange = async (checked: boolean) => {
    // try {
    //   table.setLoading(true)
    //   await productService.sortedListItems(
    //     checked ? 'asc' : 'desc',
    //     table.setLoading,
    //     (meta) => {
    //       if (meta?.success) {
    //         selfConvertDataSource(meta?.data as Product[])
    //       }
    //     },
    //     { field: 'productCode', term: searchText }
    //   )
    // } catch (error: any) {
    //   const resError: ResponseDataType = error.data
    //   message.error(`${resError.message}`)
    // } finally {
    //   table.setLoading(false)
    // }
  }

  const handleSearch = async (value: string) => {
    // try {
    //   table.setLoading(true)
    //   if (value.length > 0) {
    //     await productService.getListItems(
    //       {
    //         ...defaultRequestBody,
    //         search: {
    //           field: 'productCode',
    //           term: value
    //         }
    //       },
    //       table.setLoading,
    //       (meta) => {
    //         if (meta?.success) {
    //           selfConvertDataSource(meta?.data as Product[])
    //         }
    //       }
    //     )
    //   }
    // } catch (error: any) {
    //   const resError: ResponseDataType = error.data
    //   message.error(`${resError.message}`)
    // } finally {
    //   table.setLoading(false)
    // }
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
      productService,
      productColorService,
      cuttingGroupService
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
