import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import ProductGroupAPI from '~/api/services/ProductGroupAPI'
import SewingLineAPI from '~/api/services/SewingLineAPI'
import SewingLineDeliveryAPI from '~/api/services/SewingLineDeliveryAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants'
import useAPIService from '~/hooks/useAPIService'
import { Product, ProductColor, ProductGroup, SewingLine, SewingLineDelivery } from '~/typing'
import { isValidArray } from '~/utils/helpers'
import { SewingLineDeliveryTableDataType } from '../type'

export default function useSewingLineDeliveryViewModel() {
  // UI
  const { message } = AntApp.useApp()
  const table = useTable<SewingLineDeliveryTableDataType>([])

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const productGroupService = useAPIService<ProductGroup>(ProductGroupAPI)
  const sewingLineService = useAPIService<SewingLine>(SewingLineAPI)
  const sewingLineDeliveryService = useAPIService<SewingLineDelivery>(SewingLineDeliveryAPI)

  // State changes
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<SewingLineDelivery[] | null>(null)

  // List
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [sewingLineDeliveries, setSewingLineDeliveries] = useState<SewingLineDelivery[]>([])
  const [sewingLines, setSewingLines] = useState<SewingLine[]>([])

  useEffect(() => {
    initialize()
  }, [])

  useEffect(() => {
    loadDataEditingChange()
  }, [table.editingKey])

  /**
   * Function convert data list of model to dataSource of table and other attributes
   */
  const dataMapped = (
    products: Product[],
    productColors: ProductColor[],
    productGroups: ProductGroup[],
    sewingLineDeliveries: SewingLineDelivery[]
  ) => {
    const newDataSource = products.map((product) => {
      return {
        ...product,
        key: `${product.id}`,
        productColor: productColors.find((item) => item.productID === product.id),
        productGroup: productGroups.find((item) => item.productID === product.id),
        sewingLineDeliveries: sewingLineDeliveries.filter((item) => item.productID === product.id)
      } as SewingLineDeliveryTableDataType
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
      if (!productsResult.success) throw new Error(define('dataLoad_failed'))

      const productColorsResult = await productColorService.getItems(
        { paginator: { page: 1, pageSize: -1 } },
        table.setLoading
      )
      if (!productColorsResult.success) throw new Error(define('dataLoad_failed'))
      const newProductColors = productColorsResult.data as ProductColor[]
      setProductColors(newProductColors)

      const productGroupsResult = await productGroupService.getItems(
        { paginator: { page: 1, pageSize: -1 } },
        table.setLoading
      )
      if (!productGroupsResult.success) throw new Error(define('dataLoad_failed'))
      const newProductGroups = productGroupsResult.data as ProductGroup[]
      setProductGroups(newProductGroups)

      const sewingLineDeliveryResult = await sewingLineDeliveryService.getItems(
        { paginator: { page: 1, pageSize: -1 } },
        table.setLoading
      )
      if (!sewingLineDeliveryResult.success) throw new Error(define('dataLoad_failed'))
      const newSewingLineDeliveries = sewingLineDeliveryResult.data as SewingLineDelivery[]
      setSewingLineDeliveries(newSewingLineDeliveries)

      const sewingLineResult = await sewingLineService.getItems(
        { paginator: { page: 1, pageSize: -1 }, sorting: { column: 'id', direction: 'asc' } },

        table.setLoading
      )
      if (!sewingLineResult.success) throw new Error(define('dataLoad_failed'))
      const newSewingLines = sewingLineResult.data as SewingLine[]
      setSewingLines(newSewingLines)

      dataMapped(newProducts, newProductColors, newProductGroups, newSewingLineDeliveries)
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
      const productsResult = await productService.getItems(
        {
          paginator: { page: 1, pageSize: -1 },
          filter: { field: 'id', items: [-1], status: query.isDeleted ? 'deleted' : 'active' },
          search: { field: 'productCode', term: query.searchTerm }
        },
        table.setLoading
      )
      if (!productsResult.success) throw new Error(define('dataLoad_failed'))
      const newProducts = productsResult.data as Product[]

      const sewingLineDeliveriesResult = await sewingLineDeliveryService.getItems(
        {
          paginator: { page: 1, pageSize: -1 }
        },
        table.setLoading
      )
      if (!sewingLineDeliveriesResult.success) throw new Error(define('dataLoad_failed'))
      const newSewingLineDeliveries = sewingLineDeliveriesResult.data as SewingLineDelivery[]

      dataMapped(newProducts, productColors, productGroups, newSewingLineDeliveries)
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  /**
   * Function will be load data whenever edit button clicked
   */
  const loadDataEditingChange = async () => {}

  const handleUpdate = async (record: SewingLineDeliveryTableDataType) => {
    try {
      table.setLoading(true)
      // Update multiple SewingLineDeliveryItem
      if (isValidArray(newRecord)) {
        const sewingLineDeliveriesResult = await sewingLineDeliveryService.updateItemsBy(
          { field: 'productID', id: record.id! },
          newRecord,
          table.setLoading
        )
        if (!sewingLineDeliveriesResult.success) throw new Error(define('update_failed'))
        const updatedSewingLineDeliveries = sewingLineDeliveriesResult.data as SewingLineDelivery[]

        table.handleUpdate(record.key, {
          ...record,
          sewingLineDeliveries: updatedSewingLineDeliveries
        })
      }

      message.success(define('success'))
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setNewRecord(null)
      table.handleCancelEditing()
      table.setLoading(false)
    }
  }

  const handleDelete = async () => {}

  const handleDeleteForever = async (record: SewingLineDeliveryTableDataType) => {
    try {
      await sewingLineDeliveryService.deleteItemBySync(
        { field: 'productID', id: record.id! },
        table.setLoading,
        (res) => {
          if (!res.success) throw new Error(define('delete_failed'))
          delete record.sewingLineDeliveries
          table.handleUpdate(record.key, record)
        }
      )
      message.success(define('deleted_success'))
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  /**
   * Function restore record
   */
  const handleRestore = async () => {}

  /**
   * Function query paginator (page and pageSize)
   */
  const handlePageChange = () => {}

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
      sewingLines,
      sewingLineDeliveries,
      showDeleted,
      setShowDeleted,
      searchText,
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
      handleSwitchDeleteChange,
      handleSwitchSortChange,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleDeleteForever,
      handleRestore
    },
    table
  }
}
