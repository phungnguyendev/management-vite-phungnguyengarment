import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import ColorAPI from '~/api/services/ColorAPI'
import CompletionAPI from '~/api/services/CompletionAPI'
import GroupAPI from '~/api/services/GroupAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import ProductGroupAPI from '~/api/services/ProductGroupAPI'
import SewingLineDeliveryAPI from '~/api/services/SewingLineDeliveryAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants'
import useAPIService from '~/hooks/useAPIService'
import { Color, Completion, Group, Product, ProductColor, ProductGroup, SewingLineDelivery } from '~/typing'
import { isValidNumber, isValidObject } from '~/utils/helpers'
import { DashboardTableDataType } from '../type'

export default function useDashboardViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<DashboardTableDataType>([])

  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const productGroupService = useAPIService<ProductGroup>(ProductGroupAPI)
  const completionService = useAPIService<Completion>(CompletionAPI)
  const sewingLineDeliveryService = useAPIService<SewingLineDelivery>(SewingLineDeliveryAPI)
  const colorService = useAPIService<Color>(ColorAPI)
  const groupService = useAPIService<Group>(GroupAPI)

  const [searchText, setSearchText] = useState<string>('')
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)

  // Data
  const [products, setProducts] = useState<Product[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [completions, setCompletions] = useState<Completion[]>([])
  const [sewingLineDeliveries, setSewingLineDeliveries] = useState<SewingLineDelivery[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [groups, setGroups] = useState<Group[]>([])

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
    const newDataSource = products
      .filter((item) => item.status === 'active')
      .map((product) => {
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
      const productsResult = await productService.getItems(
        { paginator: { page: 1, pageSize: -1 }, filter: { status: ['active', 'deleted'], field: 'id', items: [-1] } },
        table.setLoading
      )
      const newProducts = productsResult.data as Product[]
      setProducts(newProducts)

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

      await colorService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, table.setLoading, (result) => {
        if (!result.success) throw new Error(define('dataLoad_failed'))
        setColors(result.data as Color[])
      })
      await groupService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, table.setLoading, (result) => {
        if (!result.success) throw new Error(define('dataLoad_failed'))
        setGroups(result.data as Group[])
      })

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
          filter: { field: 'id', items: [-1], status: query.isDeleted ? ['deleted'] : ['active'] },
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

  const sumProductAll = (): number => {
    return products.length
  }

  const sumProductCompleted = (): number => {
    const listCompletion = completions.filter((item) => {
      const quantityPO =
        isValidObject(item.product) && isValidNumber(item.product.quantityPO) ? item.product.quantityPO : 0
      return (
        item.quantityIroned === quantityPO &&
        item.quantityCheckPassed === quantityPO &&
        item.quantityPackaged === quantityPO
      )
    })
    return listCompletion.length
  }

  const sumProductProgressing = (): number => {
    return products.length
  }

  const sumProductError = (): number => {
    return products.length
  }

  return {
    state: {
      sumProductAll,
      sumProductCompleted,
      sumProductProgressing,
      sumProductError,
      products,
      colors,
      groups,
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
