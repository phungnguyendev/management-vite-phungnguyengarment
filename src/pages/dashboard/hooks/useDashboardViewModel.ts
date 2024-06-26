import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType } from '~/api/client'
import CompletionAPI from '~/api/services/CompletionAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import SewingLineDeliveryAPI from '~/api/services/SewingLineDeliveryAPI'
import useAPIService from '~/hooks/useAPIService'
import { Completion, Product, ProductColor, SewingLineDelivery } from '~/typing'
import { DashboardTableDataType } from '../type'

export interface ProductNewRecordProps {
  colorID?: number | null
  quantityPO?: number | null
  productCode?: string | null
  dateInputNPL?: string | null
  dateOutputFCR?: string | null
  groupID?: number | null
  printID?: number | null
}

export default function useDashboardViewModel() {
  const { setLoading, setDataSource, handleConfirmCancelEditing } = table

  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const sewingLineDeliveryService = useAPIService<SewingLineDelivery>(SewingLineDeliveryAPI)
  const completionService = useAPIService<Completion>(CompletionAPI)

  const { message } = AntApp.useApp()

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<ProductNewRecordProps>({})

  const [products, setProducts] = useState<Product[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [sewingLineDeliveries, setSewingLineDeliveries] = useState<SewingLineDelivery[]>([])
  const [completions, setCompletions] = useState<Completion[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      await productService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, setLoading, (meta) => {
        if (meta?.success) {
          setProducts(meta.data as Product[])
        }
      })

      await productColorService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, setLoading, (meta) => {
        if (meta?.success) {
          setProductColors(meta.data as ProductColor[])
        }
      })

      await sewingLineDeliveryService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, setLoading, (meta) => {
        if (meta?.success) {
          setSewingLineDeliveries(meta.data as SewingLineDelivery[])
        }
      })

      await completionService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, setLoading, (meta) => {
        if (meta?.success) {
          setCompletions(meta.data as Completion[])
        }
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    selfConvertDataSource(products, productColors, sewingLineDeliveries, completions)
  }, [products, productColors, sewingLineDeliveries, completions])

  const selfConvertDataSource = (
    _products: Product[],
    _productColors?: ProductColor[],
    _sewingLineDeliveries?: SewingLineDelivery[],
    _completions?: Completion[]
  ) => {
    const items = _products ? _products : products
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          productColor: (_productColors ? _productColors : productColors).find((i) => i.productID === item.id),
          sewingLineDeliveries: (_sewingLineDeliveries ? _sewingLineDeliveries : sewingLineDeliveries).filter(
            (i) => i.productID === item.id
          ),
          completion: (_completions ? _completions : completions).find((i) => i.productID === item.id),
          key: item.id
        } as DashboardTableDataType
      })
    )
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
    loadData(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSortChange = async (checked: boolean, _event: React.MouseEvent<HTMLButtonElement>) => {
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
        await productService.getItemsSync(
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
    productService,
    handleResetClick,
    handleSortChange,
    handleSearch,
    handlePageChange,
    productColorService,
    selfConvertDataSource,
    handleConfirmCancelEditing
  }
}
