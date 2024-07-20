import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import ColorAPI from '~/api/services/ColorAPI'
import CompletionAPI from '~/api/services/CompletionAPI'
import GroupAPI from '~/api/services/GroupAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import ProductGroupAPI from '~/api/services/ProductGroupAPI'
import useStatistic from '~/components/hooks/useStatistic'
import useTable from '~/components/hooks/useTable'
import define from '~/constants'
import useAPIService from '~/hooks/useAPIService'
import { Color, Completion, Group, Product, ProductColor, ProductGroup, TableStatusType } from '~/typing'
import { dateComparator, isValidObject, numberComparator, numberValidatorCalc } from '~/utils/helpers'
import { CompletionNewRecordProps, CompletionTableDataType } from '../type'

export default function useCompletionViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<CompletionTableDataType>([])
  const statistic = useStatistic()

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const productGroupService = useAPIService<ProductGroup>(ProductGroupAPI)
  const completionService = useAPIService<Completion>(CompletionAPI)
  const colorService = useAPIService<Color>(ColorAPI)
  const groupService = useAPIService<Group>(GroupAPI)
  // UI

  // State changes
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchTextChange, setSearchTextChange] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<CompletionNewRecordProps | null>(null)
  // List
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [completions, setCompletions] = useState<Completion[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [groups, setGroups] = useState<Group[]>([])

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
    completions: Completion[]
  ) => {
    const newDataSource = products.map((product) => {
      return {
        ...product,
        key: `${product.id}`,
        productColor: productColors.find((item) => item.productID === product.id),
        productGroup: productGroups.find((item) => item.productID === product.id),
        completion: completions.find((item) => item.productID === product.id)
      } as CompletionTableDataType
    })
    table.setDataSource(newDataSource)
  }

  /**
   * Initialize function
   */
  const initialize = useCallback(async () => {
    try {
      const productsResult = await productService.getItems({ paginator: { page: 1, pageSize: -1 } }, table.setLoading)
      if (!productsResult.success) throw new Error(define('dataLoad_failed'))
      const newProducts = productsResult.data as Product[]

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

      const completionResult = await completionService.getItems(
        { paginator: { page: 1, pageSize: -1 } },
        table.setLoading
      )
      if (!completionResult.success) throw new Error(define('dataLoad_failed'))
      const newCompletions = completionResult.data as Completion[]
      setCompletions(newCompletions)

      await colorService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, table.setLoading, (result) => {
        if (!result.success) throw new Error(define('dataLoad_failed'))
        setColors(result.data as Color[])
      })
      await groupService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, table.setLoading, (result) => {
        if (!result.success) throw new Error(define('dataLoad_failed'))
        setGroups(result.data as Group[])
      })

      dataMapped(newProducts, newProductColors, newProductGroups, newCompletions)
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
          dataMapped(newProducts, productColors, productGroups, completions)
        }
      )
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

  const handleUpdate = async (record: CompletionTableDataType) => {
    try {
      // Update Completion
      if (
        isValidObject(record.completion) &&
        newRecord &&
        (numberComparator(newRecord.quantityIroned, record.completion.quantityIroned) ||
          numberComparator(newRecord.quantityCheckPassed, record.completion.quantityCheckPassed) ||
          numberComparator(newRecord.quantityPackaged, record.completion.quantityPackaged) ||
          dateComparator(newRecord.exportedDate, record.completion.exportedDate) ||
          dateComparator(newRecord.passFIDate, record.completion.passFIDate))
      ) {
        const completionResult = await completionService.updateItemBy(
          { field: 'productID', id: record.id! },
          {
            ...newRecord
          },
          table.setLoading
        )
        if (!completionResult.success) throw new Error(define('update_failed'))
        const updatedCompletion = completionResult.data as Completion
        table.handleUpdate(record.key, { ...record, completion: updatedCompletion })
      }

      // Create Completion
      if (!isValidObject(record.completion) && newRecord) {
        const completionResult = await completionService.createItem(
          {
            ...newRecord,
            productID: record.id!
          },
          table.setLoading
        )
        if (!completionResult.success) throw new Error(define('create_failed'))
        const newCompletion = completionResult.data as Completion
        table.handleUpdate(record.key, { ...record, completion: newCompletion })
      }

      message.success(define('success'))
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setNewRecord(null)
      table.setLoading(false)
      table.handleCancelEditing()
    }
  }

  const handleDelete = async () => {}

  const handleDeleteForever = async (record: CompletionTableDataType) => {
    try {
      await completionService.deleteItemBySync({ field: 'productID', id: record.id! }, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('delete_failed'))
        delete record.completion
        table.handleUpdate(record.key, record)
      })
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

  /**
   * Hàm kiểm tra xem có nên show icon status hay không
   * @param record SewingLineDeliveryTableDataType
   * @returns boolean
   */
  const isShowStatusIcon = (record: CompletionTableDataType): boolean => {
    const po = numberValidatorCalc(record.quantityPO)
    return isValidObject(record.completion)
      ? statistic.ironPassed(po, numberValidatorCalc(record.completion.quantityIroned)) ||
          statistic.ironPassed(po, numberValidatorCalc(record.completion.quantityCheckPassed)) ||
          statistic.ironPassed(po, numberValidatorCalc(record.completion.quantityPackaged))
      : false
  }

  /**
   * Hàm kiểm tra trạng thái của icon
   * @param record SewingLineDeliveryTableDataType
   * @returns boolean
   */
  const statusIconType = (record: CompletionTableDataType): TableStatusType => {
    const po = numberValidatorCalc(record.quantityPO)
    return isValidObject(record.completion)
      ? statistic.ironPassed(po, numberValidatorCalc(record.completion.quantityIroned)) &&
        statistic.ironPassed(po, numberValidatorCalc(record.completion.quantityCheckPassed)) &&
        statistic.ironPassed(po, numberValidatorCalc(record.completion.quantityPackaged))
        ? 'success'
        : 'warning'
      : 'normal'
  }

  return {
    state: {
      colors,
      groups,
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
      handleSwitchDeleteChange,
      handleSwitchSortChange,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleDeleteForever,
      handleRestore,
      isShowStatusIcon,
      statusIconType
    },
    table
  }
}
