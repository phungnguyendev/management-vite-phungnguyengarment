import { App as AntApp } from 'antd'
import { BaseType } from 'antd/es/typography/Base'
import { useCallback, useEffect, useState } from 'react'
import ColorAPI from '~/api/services/ColorAPI'
import CompletionAPI from '~/api/services/CompletionAPI'
import GroupAPI from '~/api/services/GroupAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import ProductGroupAPI from '~/api/services/ProductGroupAPI'
import SewingLineDeliveryAPI from '~/api/services/SewingLineDeliveryAPI'
import useStatistic from '~/components/hooks/useStatistic'
import useTable from '~/components/hooks/useTable'
import define from '~/constants'
import useAPIService from '~/hooks/useAPIService'
import {
  Color,
  Completion,
  Group,
  Product,
  ProductColor,
  ProductGroup,
  SewingLineDelivery,
  TableStatusType
} from '~/typing'
import { expiriesDateType, isValidArray, numberValidatorCalc } from '~/utils/helpers'
import { DashboardTableDataType } from '../type'

export default function useDashboardViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<DashboardTableDataType>([])
  const statistic = useStatistic()

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

  const checkExpiry = (record: DashboardTableDataType, type: BaseType) =>
    isValidArray(record.sewingLineDeliveries)
      ? record.sewingLineDeliveries.some((item) => expiriesDateType(record.dateOutputFCR, item.expiredDate) === type)
      : false

  const sumProductAll = (): number => {
    return products.length
  }

  const productsCompleted = (): DashboardTableDataType[] => {
    return table.dataSource.filter((record) => {
      const po = numberValidatorCalc(record.quantityPO)
      return (
        statistic.sewPassed(po, statistic.sumQuantitySewed(record.id!, sewingLineDeliveries)) &&
        statistic.ironPassed(po, statistic.sumQuantityIroned(record.id!, completions)) &&
        statistic.checkPassed(po, statistic.sumQuantityCheckPassed(record.id!, completions)) &&
        statistic.packagePassed(po, statistic.sumQuantityPackaged(record.id!, completions))
      )
    })
  }

  const productsProgressing = (): DashboardTableDataType[] => {
    return table.dataSource.filter((record) => {
      const po = numberValidatorCalc(record.quantityPO)
      const totalQuantitySewed = statistic.sumQuantitySewed(record.id!, sewingLineDeliveries)
      const totalQuantityIroned = statistic.sumQuantityIroned(record.id!, completions)
      const totalQuantityCheckPassed = statistic.sumQuantityCheckPassed(record.id!, completions)
      const totalQuantityPackaged = statistic.sumQuantityPackaged(record.id!, completions)
      const hasSmallerQuantityPO =
        statistic.isValidQuantity(po, totalQuantitySewed) ||
        statistic.isValidQuantity(po, totalQuantityIroned) ||
        statistic.isValidQuantity(po, totalQuantityCheckPassed) ||
        statistic.isValidQuantity(po, totalQuantityPackaged)
      const hasLargerOrEqualQuantityPO =
        totalQuantitySewed >= po ||
        totalQuantityIroned >= po ||
        totalQuantityCheckPassed >= po ||
        totalQuantityPackaged >= po
      return (
        (checkExpiry(record, 'warning') || checkExpiry(record, 'success')) &&
        (hasSmallerQuantityPO || hasLargerOrEqualQuantityPO)
      )
    })
  }

  const productsError = (): DashboardTableDataType[] => {
    return table.dataSource.filter((record) => {
      const po = numberValidatorCalc(record.quantityPO)
      const hasAllLargerOrEqualQuantityPO =
        statistic.sewPassed(po, statistic.sumQuantitySewed(record.id!, sewingLineDeliveries)) &&
        statistic.ironPassed(po, statistic.sumQuantityIroned(record.id!, completions)) &&
        statistic.checkPassed(po, statistic.sumQuantityCheckPassed(record.id!, completions)) &&
        statistic.packagePassed(po, statistic.sumQuantityPackaged(record.id!, completions))
      return checkExpiry(record, 'danger') && !hasAllLargerOrEqualQuantityPO
    })
  }

  /**
   * Hàm dùng để kiểm tra xem có nên hiển thị IconStatus hay không
   */
  const isShowStatusIcon = (record: DashboardTableDataType): boolean => {
    const po = numberValidatorCalc(record.quantityPO)
    // Show status icon khi có 1 trong các yếu tố sau: May, Ủi, Kiếm, Đóng gói
    const totalQuantitySewed = statistic.sumQuantitySewed(record.id!, sewingLineDeliveries)
    const totalQuantityIroned = statistic.sumQuantityIroned(record.id!, completions)
    const totalQuantityCheckPassed = statistic.sumQuantityCheckPassed(record.id!, completions)
    const totalQuantityPackaged = statistic.sumQuantityPackaged(record.id!, completions)

    return (
      statistic.isValidQuantity(po, totalQuantitySewed) ||
      statistic.isValidQuantity(po, totalQuantityIroned) ||
      statistic.isValidQuantity(po, totalQuantityCheckPassed) ||
      statistic.isValidQuantity(po, totalQuantityPackaged) ||
      totalQuantitySewed >= po ||
      totalQuantityIroned >= po ||
      totalQuantityCheckPassed >= po ||
      totalQuantityPackaged >= po
    )
  }

  /**
   * Hàm dùng để kiểm tra xem nên hiển thị loại icon nào
   */
  const statusIconType = (record: DashboardTableDataType): TableStatusType => {
    const po = numberValidatorCalc(record.quantityPO)
    if (po <= 0) return 'normal'
    const totalQuantitySewed = statistic.sumQuantitySewed(record.id!, sewingLineDeliveries)
    const totalQuantityIroned = statistic.sumQuantityIroned(record.id!, completions)
    const totalQuantityCheckPassed = statistic.sumQuantityCheckPassed(record.id!, completions)
    const totalQuantityPackaged = statistic.sumQuantityPackaged(record.id!, completions)

    const hasSmallerQuantityPO =
      statistic.isValidQuantity(po, totalQuantitySewed) ||
      statistic.isValidQuantity(po, totalQuantityIroned) ||
      statistic.isValidQuantity(po, totalQuantityCheckPassed) ||
      statistic.isValidQuantity(po, totalQuantityPackaged)
    const hasLargerOrEqualQuantityPO =
      totalQuantitySewed >= po ||
      totalQuantityIroned >= po ||
      totalQuantityCheckPassed >= po ||
      totalQuantityPackaged >= po
    const hasAllLargerOrEqualQuantityPO =
      statistic.sewPassed(po, totalQuantitySewed) &&
      statistic.ironPassed(po, totalQuantityIroned) &&
      statistic.checkPassed(po, totalQuantityCheckPassed) &&
      statistic.packagePassed(po, totalQuantityPackaged)

    if (checkExpiry(record, 'danger')) {
      return hasAllLargerOrEqualQuantityPO ? 'success' : 'danger'
    }

    if (checkExpiry(record, 'warning')) {
      return hasAllLargerOrEqualQuantityPO
        ? 'success'
        : hasSmallerQuantityPO || hasLargerOrEqualQuantityPO
          ? 'progress'
          : 'warning'
    }

    if (checkExpiry(record, 'success')) {
      return hasAllLargerOrEqualQuantityPO ? 'success' : 'progress'
    }

    return 'progress'
  }

  return {
    state: {
      products,
      colors,
      groups,
      showDeleted,
      openModal,
      setOpenModal,
      sewingLineDeliveries,
      completions
    },
    service: {
      productService,
      productColorService,
      productGroupService,
      completionService,
      sewingLineDeliveryService
    },
    action: {
      loadData,
      handleSearch,
      handlePageChange,
      handleSwitchSortChange,
      handleSwitchDeleteChange,
      isShowStatusIcon,
      statusIconType,
      sumProductAll,
      productsCompleted,
      productsProgressing,
      productsError
    },
    table,
    statistic
  }
}
