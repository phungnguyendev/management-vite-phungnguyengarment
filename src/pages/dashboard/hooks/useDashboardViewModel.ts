import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import CompletionAPI from '~/api/services/CompletionAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import ProductGroupAPI from '~/api/services/ProductGroupAPI'
import SewingLineDeliveryAPI from '~/api/services/SewingLineDeliveryAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants'
import useAPIService from '~/hooks/useAPIService'
import { Completion, Product, ProductColor, ProductGroup, SewingLineDelivery } from '~/typing'
import { DashboardTableDataType } from '../type'

export default function useDashboardViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<DashboardTableDataType>([])

  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const productGroupService = useAPIService<ProductGroup>(ProductGroupAPI)
  const completionService = useAPIService<Completion>(CompletionAPI)
  const sewingLineDeliveryService = useAPIService<SewingLineDelivery>(SewingLineDeliveryAPI)

  const [searchText, setSearchText] = useState<string>('')
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)

  // Data
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [completions, setCompletions] = useState<Completion[]>([])
  const [sewingLineDeliveries, setSewingLineDeliveries] = useState<SewingLineDelivery[]>([])

  useEffect(() => {
    initialize()
  }, [])

  /**
   * Function convert data list of model to dataSource of table and other attributes
   */
  const dataMapped = (
    products: Product[],
    productColors: ProductColor[],
    productGroups: ProductGroup[],
    sewingLineDeliveries: SewingLineDelivery[],
    completions: Completion[]
  ) => {
    const newDataSource = products.map((product) => {
      return {
        ...product,
        key: `${product.id}`,
        productColor: productColors.find((item) => item.productID === product.id),
        productGroup: productGroups.find((item) => item.productID === product.id),
        completion: completions.find((item) => item.productID === product.id),
        sewingLineDeliveries: sewingLineDeliveries.filter((item) => item.productID === product.id)
      } as DashboardTableDataType
    })
    table.setDataSource(newDataSource)
  }

  /**
   * Initialize function
   */
  const initialize = useCallback(async () => {
    try {
      const productsResult = await productService.getItems({ paginator: { page: 1, pageSize: -1 } }, table.setLoading)
      const newProducts = productsResult.data as Product[]

      const productColorsResult = await productColorService.getItems(
        { paginator: { page: 1, pageSize: -1 } },
        table.setLoading
      )
      const newProductColors = productColorsResult.data as ProductColor[]
      setProductColors(newProductColors)

      const productGroupsResult = await productGroupService.getItems(
        { paginator: { page: 1, pageSize: -1 } },
        table.setLoading
      )
      const newProductGroups = productGroupsResult.data as ProductGroup[]
      setProductGroups(newProductGroups)

      const completionsResult = await completionService.getItems(
        { paginator: { page: 1, pageSize: -1 } },
        table.setLoading
      )
      const newCompletions = completionsResult.data as Completion[]
      setCompletions(newCompletions)

      const sewingLineDeliveriesResult = await sewingLineDeliveryService.getItems(
        { paginator: { page: 1, pageSize: -1 } },
        table.setLoading
      )
      const newSewingLineDeliveries = sewingLineDeliveriesResult.data as SewingLineDelivery[]
      setSewingLineDeliveries(newSewingLineDeliveries)

      dataMapped(newProducts, newProductColors, newProductGroups, newSewingLineDeliveries, newCompletions)
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }, [])

  /**
   * Function query data whenever paginator (page change), isDeleted (Switch) and searchText change
   */
  const loadData = async (query: { isDeleted: boolean; searchTerm: string }) => {
    try {
      await productService.getItemsSync(
        {
          paginator: { page: 1, pageSize: -1 },
          filter: { field: 'id', items: [-1], status: query.isDeleted ? 'deleted' : 'active' },
          search: { field: 'productCode', term: query.searchTerm }
        },
        table.setLoading,
        (meta) => {
          if (!meta.success) throw new Error(define('dataLoad_failed'))
          const newProducts = meta.data as Product[]
          dataMapped(newProducts, productColors, productGroups, sewingLineDeliveries, completions)
        }
      )
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  /**
   * Function query paginator (page and pageSize)
   */
  const handlePageChange = async (page: number, pageSize: number) => {
    table.setPaginator({ page, pageSize })
  }

  /**
   * Function handle switch delete button
   */
  const handleSwitchDeleteChange = (checked: boolean) => {
    setShowDeleted(checked)
    loadData({ isDeleted: checked, searchTerm: searchText })
  }

  /**
   * Function handle switch sort button
   */
  const handleSwitchSortChange = (checked: boolean) => {
    table.setDataSource((prevDataSource) => {
      return checked
        ? [...prevDataSource.sort((a, b) => a.id! - b.id!)]
        : [...prevDataSource.sort((a, b) => b.id! - a.id!)]
    })
  }

  /**
   * Function handle search button
   */
  const handleSearch = (value: string) => {
    setSearchText(value)
    loadData({ isDeleted: showDeleted, searchTerm: value })
  }

  return {
    state: {
      showDeleted,
      openModal,
      setOpenModal
    },
    service: {
      productService,
      productColorService,
      productGroupService,
      completionService
    },
    action: {
      loadData,
      handleSearch,
      handlePageChange,
      handleSwitchSortChange,
      handleSwitchDeleteChange
    },
    table
  }
}
