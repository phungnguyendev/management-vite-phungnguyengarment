import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Paginator, ResponseDataType } from '~/api/client'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import SewingLineAPI from '~/api/services/SewingLineAPI'
import SewingLineDeliveryAPI from '~/api/services/SewingLineDeliveryAPI'
import useTable from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { GarmentAccessory, Product, ProductColor, SewingLine, SewingLineDelivery } from '~/typing'
import { SewingLineDeliveryTableDataType } from '../type'

export default function useSewingLineDeliveryViewModel() {
  const table = useTable<SewingLineDeliveryTableDataType>([])

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const sewingLineService = useAPIService<SewingLine>(SewingLineAPI)
  const sewingLineDeliveryService = useAPIService<SewingLineDelivery>(SewingLineDeliveryAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)

  // UI
  const { message } = AntApp.useApp()

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
  const [newRecord, setNewRecord] = useState<SewingLineDelivery[]>([])

  // List
  const [products, setProducts] = useState<Product[]>([])
  const [sewingLineDeliveries, setSewingLineDeliveries] = useState<SewingLineDelivery[]>([])
  const [sewingLines, setSewingLines] = useState<SewingLine[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])

  // New
  const [garmentAccessoryNew, setGarmentAccessoryNew] = useState<GarmentAccessory | undefined>(undefined)

  useEffect(() => {
    loadData()
  }, [garmentAccessoryNew, showDeleted])

  useEffect(() => {
    mappedData()
  }, [products, productColors, sewingLineDeliveries])

  const mappedData = useCallback(() => {
    table.setDataSource(() => {
      const dataSource = products.map((self) => {
        return {
          ...self,
          key: `${self.id}`,
          productColor: productColors.find((item) => item.productID === item.id),
          sewingLineDeliveries: sewingLineDeliveries.find((item) => item.productID === item.id)
        } as SewingLineDeliveryTableDataType
      })
      return [...dataSource]
    })
  }, [products, productColors, sewingLineDeliveries])

  const loadData = async () => {
    try {
      await productService.getItemsSync(
        {
          paginator: paginator,
          sorting: { column: 'id', direction: shorted ? 'asc' : 'desc' },
          filter: { field: 'id', items: [-1], status: showDeleted ? 'deleted' : 'active' },
          search: { field: 'title', term: searchText }
        },
        table.setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(meta.message)
          setProducts(meta.data as Product[])
        }
      )
      await productColorService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, table.setLoading, (meta) => {
        if (!meta?.success) throw new Error(meta.message)
        setProductColors(meta.data as ProductColor[])
      })
      await sewingLineDeliveryService.getItemsSync(
        { paginator: { page: 1, pageSize: -1 } },
        table.setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(meta.message)
          setSewingLineDeliveries(meta.data as SewingLineDelivery[])
        }
      )
      await sewingLineService.getItemsSync(
        { paginator: { pageSize: -1, page: 1 }, sorting: { direction: 'asc', column: 'id' } },
        table.setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(meta.message)
          setSewingLines(meta.data as SewingLine[])
        }
      )
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleUpdate = async (record: SewingLineDeliveryTableDataType) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    // try {
    //   table.setLoading(true)
    //   if (record.sewingLineDeliveries && record.sewingLineDeliveries.length > 0) {
    //     // Update GarmentAccessory
    //     console.log('Update SewingLineDelivery')
    //     try {
    //       await sewingLineDeliveryService.updateItemBySync(
    //         { productID: record.id! },
    //         { ...newRecord },
    //         table.setLoading,
    //         (meta) => {
    //           if (!meta?.success) throw new Error('API update SewingLineDelivery failed')
    //           console.log(meta.data)
    //         }
    //       )
    //     } catch (error: any) {
    //       const resError: ResponseDataType = error
    //       throw resError
    //     }
    //   } else {
    //     console.log('Create SewingLineDelivery')
    //     try {
    //       await sewingLineDeliveryService.createNewItems(
    //         newRecord.map((item) => {
    //           return {
    //             ...item,
    //             productID: record.id
    //           } as SewingLineDelivery
    //         }),
    //         table.setLoading,
    //         (meta) => {
    //           if (!meta?.success) throw new Error('API create SewingLineDelivery failed')
    //         }
    //       )
    //     } catch (error: any) {
    //       const resError: ResponseDataType = error
    //       throw resError
    //     }
    //   }

    //   message.success('Success!')
    // } catch (error: any) {
    //   const resError: ResponseDataType = error.data
    //   message.error(`${resError.message}`)
    // } finally {
    //   handleConfirmCancelEditing()
    //   loadData()
    //   table.setLoading(false)
    // }
  }

  const handleAddNew = async (formAddNew: any) => {
    // try {
    //   console.log(formAddNew)
    //   table.setLoading(true)
    //   await sewingLineDeliveryService.createNewItem(
    //     {
    //       quantitySewed: formAddNew.quantitySewed,
    //       expiredDate: formAddNew.expiredDate
    //     },
    //     table.setLoading,
    //     async (meta, msg) => {
    //       if (meta?.data) {
    //         setGarmentAccessoryNew(meta.data as GarmentAccessory)
    //         message.success(msg)
    //       } else {
    //         console.log('Errr')
    //         message.error(msg)
    //       }
    //     }
    //   )
    // } catch (error) {
    //   console.error(error)
    // } finally {
    //   table.setLoading(false)
    //   setOpenModal(false)
    // }
  }

  const handleDelete = async (record: SewingLineDeliveryTableDataType) => {
    // try {
    //   table.setLoading(true)
    //   await sewingLineDeliveryService.deleteItemBy(
    //     {
    //       field: 'productID',
    //       key: record.id!
    //     },
    //     table.setLoading,
    //     async (meta, msg) => {
    //       if (!meta?.success) throw new Error('API delete GarmentAccessory failed')
    //       // Other service here...
    //       onDataSuccess?.(meta)
    //       message.success(msg)
    //     }
    //   )
    // } catch (error: any) {
    //   const resError: ResponseDataType = error.data
    //   message.error(`${resError.message}`)
    // } finally {
    //   loadData()
    //   table.setLoading(false)
    // }
  }

  const handleDeleteForever = async (id?: number) => {
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

  const handleRestore = async (record: SewingLineDeliveryTableDataType) => {
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
    //       if (!meta?.success) throw new Error(meta.message)
    //       selfConvertDataSource(meta?.data as Product[])
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

  const handleSortChange = async (checked: boolean) => {
    // try {
    //   table.setLoading(true)
    //   await productService.sortedListItems(
    //     checked ? 'asc' : 'desc',
    //     table.setLoading,
    //     (meta) => {
    //       if (!meta?.success) throw new Error(meta.message)
    //       selfConvertDataSource(meta?.data as Product[])
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
    //     await productService.getItemsSync(
    //       {
    //         ...defaultRequestBody,
    //         search: {
    //           field: 'productCode',
    //           term: value
    //         }
    //       },
    //       table.setLoading,
    //       (meta) => {
    //         if (!meta?.success) throw new Error(meta.message)
    //         selfConvertDataSource(meta?.data as Product[])
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
      sewingLines,
      sewingLineDeliveries,
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
      sewingLineDeliveryService
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
