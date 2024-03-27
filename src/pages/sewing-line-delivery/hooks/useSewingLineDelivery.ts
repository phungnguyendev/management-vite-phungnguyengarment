import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import SewingLineAPI from '~/api/services/SewingLineAPI'
import SewingLineDeliveryAPI from '~/api/services/SewingLineDeliveryAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { GarmentAccessory, Product, ProductColor, SewingLine, SewingLineDelivery } from '~/typing'
import { SewingLineDeliveryTableDataType } from '../type'

export default function useSewingLineDelivery(table: UseTableProps<SewingLineDeliveryTableDataType>) {
  const { setLoading, showDeleted, setDataSource, handleConfirmCancelEditing } = table

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const sewingLineService = useAPIService<SewingLine>(SewingLineAPI)
  const sewingLineDeliveryService = useAPIService<SewingLineDelivery>(SewingLineDeliveryAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<SewingLineDelivery[]>([])

  // List
  const [products, setProducts] = useState<Product[]>([])
  const [sewingLineDeliveries, setSewingLineDeliveries] = useState<SewingLineDelivery[]>([])
  const [sewingLines, setSewingLines] = useState<SewingLine[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])

  // New
  const [garmentAccessoryNew, setGarmentAccessoryNew] = useState<GarmentAccessory | undefined>(undefined)

  const loadData = async () => {
    try {
      setLoading(true)
      try {
        await productService.getListItems(
          {
            ...defaultRequestBody,
            paginator: { page: productService.page, pageSize: defaultRequestBody.paginator?.pageSize },
            filter: { ...defaultRequestBody.filter, status: showDeleted ? 'deleted' : 'active' }
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              setProducts(meta.data as Product[])
            }
          }
        )
      } catch (error: any) {
        const resError: ResponseDataType = error
        throw resError
      }
      try {
        await productColorService.getListItems(defaultRequestBody, setLoading, (meta) => {
          if (meta?.success) {
            setProductColors(meta.data as ProductColor[])
          }
        })
      } catch (error: any) {
        const resError: ResponseDataType = error
        throw resError
      }
      try {
        await sewingLineDeliveryService.getListItems(
          { ...defaultRequestBody, paginator: { page: 1, pageSize: -1 } },
          setLoading,
          (meta) => {
            if (meta?.success) {
              setSewingLineDeliveries(meta.data as SewingLineDelivery[])
            }
          }
        )
      } catch (error: any) {
        const resError: ResponseDataType = error
        throw resError
      }
      try {
        await sewingLineService.getListItems(
          { ...defaultRequestBody, paginator: { pageSize: -1, page: 1 }, sorting: { direction: 'asc', column: 'id' } },
          setLoading,
          (meta) => {
            if (meta?.success) {
              setSewingLines(meta.data as SewingLine[])
            }
          }
        )
      } catch (error: any) {
        const resError: ResponseDataType = error
        throw resError
      }
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [garmentAccessoryNew, showDeleted])

  useEffect(() => {
    selfConvertDataSource(products, productColors, sewingLineDeliveries)
  }, [products, productColors, sewingLineDeliveries, sewingLines])

  const selfConvertDataSource = (
    _products: Product[],
    _productColors?: ProductColor[],
    _sewingLineDeliveries?: SewingLineDelivery[]
  ) => {
    setDataSource(
      _products.map((item) => {
        return {
          ...item,
          key: item.id,
          productColor: (_productColors ? _productColors : productColors).find((i) => i.productID === item.id),
          sewingLineDeliveries: (_sewingLineDeliveries ? _sewingLineDeliveries : sewingLineDeliveries).filter(
            (i) => i.productID === item.id
          )
        } as SewingLineDeliveryTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<SewingLineDeliveryTableDataType>) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    try {
      setLoading(true)
      if (record.sewingLineDeliveries && record.sewingLineDeliveries.length > 0) {
        // Update GarmentAccessory
        console.log('Update SewingLineDelivery')
        try {
          await sewingLineDeliveryService.updateItemsBy(
            { field: 'productID', key: record.id! },
            newRecord,
            setLoading,
            (meta) => {
              if (!meta?.success) throw new Error('API update SewingLineDelivery failed')
              console.log(meta.data)
            }
          )
        } catch (error: any) {
          const resError: ResponseDataType = error
          throw resError
        }
      } else {
        console.log('Create SewingLineDelivery')
        try {
          await sewingLineDeliveryService.createNewItems(
            newRecord.map((item) => {
              return {
                ...item,
                productID: record.id
              } as SewingLineDelivery
            }),
            setLoading,
            (meta) => {
              if (!meta?.success) throw new Error('API create SewingLineDelivery failed')
            }
          )
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
      await sewingLineDeliveryService.createNewItem(
        {
          quantitySewed: formAddNew.quantitySewed,
          expiredDate: formAddNew.expiredDate
        },
        setLoading,
        async (meta, msg) => {
          if (meta?.data) {
            setGarmentAccessoryNew(meta.data as GarmentAccessory)
            message.success(msg)
          } else {
            console.log('Errr')
            message.error(msg)
          }
        }
      )
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      setOpenModal(false)
    }
  }

  const handleConfirmDelete = async (
    record: TableItemWithKey<SewingLineDeliveryTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      setLoading(true)
      await sewingLineDeliveryService.deleteItemBy(
        {
          field: 'productID',
          key: record.id!
        },
        setLoading,
        async (meta, msg) => {
          if (!meta?.success) throw new Error('API delete GarmentAccessory failed')

          // Other service here...
          onDataSuccess?.(meta)
          message.success(msg)
        }
      )
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
      await productService.pageChange(
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
      await productService.sortedListItems(
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
        await productService.getListItems(
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
    handleAddNewItem,
    handleConfirmDelete,
    handleSaveClick,
    selfConvertDataSource,
    handlePageChange,
    handleSortChange,
    handleResetClick,
    handleSearch,
    productService,
    productColorService,
    sewingLines
  }
}
