import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { ResponseDataType } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import CutGroupEmbroideringAPI from '~/api/services/CutGroupEmbroideringAPI'
import CuttingGroupAPI from '~/api/services/CuttingGroupAPI'
import GroupAPI from '~/api/services/GroupAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import ProductGroupAPI from '~/api/services/ProductGroupAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants'
import useAPIService from '~/hooks/useAPIService'
import { Color, CutGroupEmbroidering, CuttingGroup, Group, Product, ProductColor, ProductGroup } from '~/typing'
import { booleanComparator, dateComparator, isValidBoolean, isValidObject, numberComparator } from '~/utils/helpers'
import { CuttingGroupNewRecordProps, CuttingGroupTableDataType } from '../type'
import useCutGroupExpandableViewModel from './useCutGroupViewModel'

export default function useCuttingGroupViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<CuttingGroupTableDataType>([])
  const expandableViewModel = useCutGroupExpandableViewModel()

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const productGroupService = useAPIService<ProductGroup>(ProductGroupAPI)
  const cuttingGroupService = useAPIService<CuttingGroup>(CuttingGroupAPI)
  const cutGroupEmbroideringService = useAPIService<CutGroupEmbroidering>(CutGroupEmbroideringAPI)
  const colorService = useAPIService<Color>(ColorAPI)
  const groupService = useAPIService<Group>(GroupAPI)

  // State changes
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<CuttingGroupNewRecordProps | null>(null)

  // List
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [cuttingGroups, setCuttingGroups] = useState<CuttingGroup[]>([])
  const [cutGroupEmbroideries, setCutGroupEmbroideries] = useState<CutGroupEmbroidering[]>([])
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
    cuttingGroups: CuttingGroup[],
    cutGroupEmbroideries: CutGroupEmbroidering[]
  ) => {
    const newDataSource = products.map((product) => {
      const cuttingGroup = cuttingGroups.find((item) => item.productID === product.id)

      return {
        ...product,
        key: `${product.id}`,
        productColor: productColors.find((item) => item.productID === product.id),
        productGroup: productGroups.find((item) => item.productID === product.id),
        cuttingGroup: cuttingGroups.find((item) => item.productID === product.id),
        expandable: cutGroupEmbroideries.filter((item) => item.cuttingGroupID === cuttingGroup?.id)
      } as CuttingGroupTableDataType
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

      const cuttingGroupResult = await cuttingGroupService.getItems(
        { paginator: { page: 1, pageSize: -1 } },
        table.setLoading
      )
      const newCuttingGroups = cuttingGroupResult.data as CuttingGroup[]
      setCuttingGroups(newCuttingGroups)

      const cutGroupEmbroideringResult = await cutGroupEmbroideringService.getItems(
        { paginator: { page: 1, pageSize: -1 } },
        table.setLoading
      )
      const newCutGroupEmbroideries = cutGroupEmbroideringResult.data as CutGroupEmbroidering[]
      setCutGroupEmbroideries(newCutGroupEmbroideries)

      await colorService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, table.setLoading, (result) => {
        if (!result.success) throw new Error(define('dataLoad_failed'))
        setColors(result.data as Color[])
      })
      await groupService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, table.setLoading, (result) => {
        if (!result.success) throw new Error(define('dataLoad_failed'))
        setGroups(result.data as Group[])
      })

      dataMapped(newProducts, newProductColors, newProductGroups, newCuttingGroups, newCutGroupEmbroideries)
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }, [])

  const loadData = async (query: { isDeleted: boolean; searchTerm: string }) => {
    try {
      const productResult = await productService.getItems(
        {
          paginator: { page: 1, pageSize: -1 },
          filter: { field: 'id', items: [-1], status: query.isDeleted ? ['deleted'] : ['active'] },
          search: { field: 'productCode', term: query.searchTerm }
        },
        table.setLoading
      )

      if (!productResult.success) throw new Error(define('dataLoad_failed'))
      const newProducts = productResult.data as Product[]

      dataMapped(newProducts, productColors, productGroups, cuttingGroups, cutGroupEmbroideries)
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleUpdate = async (record: CuttingGroupTableDataType) => {
    try {
      console.log({ newRecord, record })
      table.setLoading(true)
      if (!newRecord) return
      if (
        isValidObject(record.cuttingGroup) &&
        (numberComparator(newRecord.quantityRealCut, record.cuttingGroup.quantityRealCut) ||
          dateComparator(newRecord.dateTimeCut, record.cuttingGroup.dateTimeCut) ||
          dateComparator(newRecord.dateSendEmbroidered, record.cuttingGroup.dateSendEmbroidered) ||
          dateComparator(newRecord.dateSendDeliveredBTP, record.cuttingGroup.dateSendDeliveredBTP) ||
          numberComparator(newRecord.quantitySendDeliveredBTP, record.cuttingGroup.quantitySendDeliveredBTP) ||
          booleanComparator(newRecord.syncStatus, record.cuttingGroup.syncStatus))
      ) {
        await cuttingGroupService.updateItemBySync(
          { field: 'productID', id: record.id! },
          { ...newRecord },
          table.setLoading,
          (result) => {
            if (!result.success) throw new Error(define('update_failed'))
            const newCuttingGroup = result.data as CuttingGroup
            table.handleUpdate(record.key, { ...record, cuttingGroup: newCuttingGroup })
          }
        )
      }

      if (!isValidObject(record.cuttingGroup)) {
        await cuttingGroupService.createItemSync(
          { ...newRecord, productID: record.id! },
          table.setLoading,
          (result) => {
            if (!result.success) throw new Error(define('update_failed'))
            const newCuttingGroup = result.data as CuttingGroup
            table.handleUpdate(record.key, { ...record, cuttingGroup: newCuttingGroup })
          }
        )
      }

      message.success(define('success'))
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setNewRecord({})
      table.handleCancelEditing()
      table.setLoading(false)
    }
  }

  const handleDelete = async () => {}

  const handleDeleteForever = async (record: CuttingGroupTableDataType) => {
    try {
      await cuttingGroupService.deleteItemBySync({ field: 'productID', id: record.id! }, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('delete_failed'))
        delete record.cuttingGroup
        table.handleUpdate(record.key, { ...record })
        message.success(define('deleted_success'))
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

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

  const isChecked = (record: CuttingGroupTableDataType): boolean => {
    return isValidBoolean(record.cuttingGroup?.syncStatus) ? record.cuttingGroup.syncStatus : false
  }

  const isDisableRecord = (record: CuttingGroupTableDataType): boolean => {
    return table.isEditing(record.key)
      ? isValidBoolean(newRecord?.syncStatus)
        ? !newRecord.syncStatus
        : true
      : isValidBoolean(record.cuttingGroup?.syncStatus)
        ? !record.cuttingGroup.syncStatus
        : true
  }

  return {
    state: {
      colors,
      groups,
      showDeleted,
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
      isChecked,
      loadData,
      handleUpdate,
      handleSwitchDeleteChange,
      handleSwitchSortChange,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleDeleteForever,
      isDisableRecord,
      handleRestore
    },
    table,
    expandableViewModel
  }
}
