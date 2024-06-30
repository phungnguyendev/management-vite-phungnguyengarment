import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Paginator, ResponseDataType } from '~/api/client'
import AccessoryNoteAPI from '~/api/services/AccessoryNoteAPI'
import GarmentAccessoryAPI from '~/api/services/GarmentAccessoryAPI'
import GarmentAccessoryNoteAPI from '~/api/services/GarmentAccessoryNoteAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import useTable from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { AccessoryNote, GarmentAccessory, GarmentAccessoryNote, Product, ProductColor } from '~/typing'
import { GarmentAccessoryNewRecordProps, GarmentAccessoryTableDataType } from '../type'

export default function useGarmentAccessoryViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<GarmentAccessoryTableDataType>([])

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const accessoryNoteService = useAPIService<AccessoryNote>(AccessoryNoteAPI)
  const garmentAccessoryService = useAPIService<GarmentAccessory>(GarmentAccessoryAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const garmentAccessoryNoteService = useAPIService<GarmentAccessoryNote>(GarmentAccessoryNoteAPI)

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
  const [newRecord, setNewRecord] = useState<GarmentAccessoryNewRecordProps>({})
  // List
  const [products, setProducts] = useState<Product[]>([])
  const [accessoryNotes, setAccessoryNotes] = useState<AccessoryNote[]>([])
  const [garmentAccessories, setGarmentAccessories] = useState<GarmentAccessory[]>([])
  const [garmentAccessoryNotes, setGarmentAccessoryNotes] = useState<GarmentAccessoryNote[]>([])

  const [productColors, setProductColors] = useState<ProductColor[]>([])

  // New
  const [garmentAccessoryNew, setGarmentAccessoryNew] = useState<GarmentAccessory | undefined>(undefined)

  useEffect(() => {
    loadData()
  }, [garmentAccessoryNew, showDeleted])

  useEffect(() => {
    mappedData()
  }, [products, productColors, garmentAccessories, garmentAccessoryNotes])

  const mappedData = useCallback(() => {
    table.setDataSource(() => {
      const dataSource = products.map((self) => {
        return {
          ...self,
          key: `${self.id}`,
          productColor: productColors.find((item) => item.productID === self.id),
          garmentAccessory: garmentAccessories.find((item) => item.productID === self.id),
          garmentAccessoryNotes: garmentAccessoryNotes.find((item) => item.productID === self.id)
        } as GarmentAccessoryTableDataType
      })
      return [...dataSource]
    })
  }, [products, productColors, accessoryNotes])

  const loadData = async () => {
    try {
      table.setLoading(true)
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

      await productColorService.getItemsSync(
        {
          paginator: { page: 1, pageSize: -1 }
        },
        table.setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(meta.message)
          setProductColors(meta.data as ProductColor[])
        }
      )

      await garmentAccessoryService.getItemsSync(
        {
          paginator: { page: 1, pageSize: -1 }
        },
        table.setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(meta.message)
          setGarmentAccessories(meta.data as GarmentAccessory[])
        }
      )

      await garmentAccessoryNoteService.getItemsSync(
        { paginator: { page: 1, pageSize: -1 } },
        table.setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(meta.message)
          setGarmentAccessoryNotes(meta.data as GarmentAccessoryNote[])
        }
      )

      await accessoryNoteService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, table.setLoading, (meta) => {
        if (!meta?.success) throw new Error(meta.message)
        setAccessoryNotes(meta.data as AccessoryNote[])
      })
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleUpdate = async (record: GarmentAccessoryTableDataType) => {
    // const row = (await form.validateFields()) as any
    // console.log({ old: record, new: newRecord })
    // try {
    //   table.setLoading(true)
    //   if (record.garmentAccessory) {
    //     // Update GarmentAccessory
    //     if (
    //       numberComparator(newRecord.amountCutting, record.garmentAccessory.amountCutting) ||
    //       dateComparator(newRecord.passingDeliveryDate, record.garmentAccessory.passingDeliveryDate) ||
    //       newRecord.syncStatus ||
    //       !newRecord.syncStatus
    //     ) {
    //       console.log('Update GarmentAccessory')
    //       try {
    //         await garmentAccessoryService.updateItemByPk(
    //           record.garmentAccessory.id!,
    //           {
    //             amountCutting: newRecord.amountCutting,
    //             passingDeliveryDate: newRecord.passingDeliveryDate,
    //             syncStatus: newRecord.syncStatus
    //           },
    //           table.setLoading,
    //           (meta) => {
    //             if (!meta?.success) throw new Error('API update GarmentAccessory failed')
    //           }
    //         )
    //       } catch (error: any) {
    //         const resError: ResponseDataType = error
    //         throw resError
    //       }
    //     }
    //   } else {
    //     console.log('Create GarmentAccessory')
    //     try {
    //       await garmentAccessoryService.createNewItem(
    //         {
    //           productID: record.id!,
    //           amountCutting: newRecord.amountCutting,
    //           passingDeliveryDate: newRecord.passingDeliveryDate,
    //           syncStatus: newRecord.syncStatus
    //         },
    //         table.setLoading,
    //         (meta) => {
    //           if (!meta?.success) throw new Error('API create GarmentAccessory failed')
    //         }
    //       )
    //     } catch (error: any) {
    //       const resError: ResponseDataType = error
    //       throw resError
    //     }
    //   }
    //   if (newRecord.garmentAccessoryNotes) {
    //     try {
    //       await GarmentAccessoryNoteAPI.updateItemsBy?.(
    //         { field: 'productID', key: record.id! },
    //         newRecord.garmentAccessoryNotes!.map((garmentAccessoryNote) => {
    //           return {
    //             accessoryNoteID: garmentAccessoryNote.accessoryNoteID,
    //             garmentAccessoryID: record.garmentAccessory?.id,
    //             productID: record.id
    //           }
    //         }) as GarmentAccessoryNote[],
    //         currentUser.user.accessToken!
    //       ).then((meta) => {
    //         if (!meta?.success) throw new Error('API update Garment Accessory Note failed')
    //       })
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
    //   loadData()
    //   handleConfirmCancelEditing()
    //   table.setLoading(false)
    // }
  }

  const handleDelete = async (record: GarmentAccessoryTableDataType) => {
    // try {
    //   table.setLoading(true)
    //   await garmentAccessoryService.updateItemBy(
    //     {
    //       field: 'productID',
    //       key: record.id!
    //     },
    //     { amountCutting: null, passingDeliveryDate: null, syncStatus: null },
    //     table.setLoading,
    //     async (meta, msg) => {
    //       if (!meta?.success) throw new Error('API delete GarmentAccessory failed')
    //       try {
    //         await garmentAccessoryNoteService.deleteItemBy(
    //           {
    //             field: 'productID',
    //             key: record.id!
    //           },
    //           table.setLoading,
    //           (meta2) => {
    //             if (!meta2?.success) throw new Error('API delete GarmentAccessoryNote failed')
    //             onDataSuccess?.(meta)
    //             message.success(msg)
    //           }
    //         )
    //       } catch (error: any) {
    //         const resError: ResponseDataType = error
    //         throw resError
    //       }
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

  const handleRestore = async (record: GarmentAccessoryTableDataType) => {
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
  const handleSortChange = async (checked: boolean, _event: React.MouseEvent<HTMLButtonElement>) => {
    // try {
    //   table.setLoading(true)
    //   await productService.sortedListItems(
    //     checked ? 'asc' : 'desc',
    //     table.setLoading,
    //     (meta) => {
    //       if (!meta?.success) throw new Error(meta.message)
    //         selfConvertDataSource(meta?.data as Product[])
    //       }
    //     },
    //     { field: 'productCode', term: searchText }
    //   )
    // } catch (error: any) {
    //   const resError: ResponseDataType = error.data
    //   message.error(`${resError.message}`)
    // } finally {
    //   loadData()
    //   table.setLoading(false)
    // }
  }

  const handleSearch = async (value: string) => {
    // try {
    //   if (value.length > 0) {
    //     await productService.getItemsSync(
    //       {
    //         search: {
    //           field: 'productCode',
    //           term: value
    //         }
    //       },
    //       table.setLoading,
    //       (meta) => {
    //         if (!meta?.success) throw new Error(meta.message)
    //           selfConvertDataSource(meta?.data as Product[])
    //         }
    //       }
    //     )
    //   }
    // } catch (error: any) {
    //   const resError: ResponseDataType = error.data
    //   message.error(`${resError.message}`)
    // } finally {
    //   loadData()
    //   table.setLoading(false)
    // }
  }

  return {
    state: {
      accessoryNotes,
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
      accessoryNoteService
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
