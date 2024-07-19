import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import ColorAPI from '~/api/services/ColorAPI'
import GroupAPI from '~/api/services/GroupAPI'
import ImportationAPI from '~/api/services/ImportationAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import ProductGroupAPI from '~/api/services/ProductGroupAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants'
import useAPIService from '~/hooks/useAPIService'
import { Color, Group, Importation, Product, ProductColor, ProductGroup, TableStatusType } from '~/typing'
import { dateComparator, isValidArray, numberComparator, numberValidatorCalc, sumArray } from '~/utils/helpers'
import { ImportationExpandableAddNewProps, ImportationExpandableTableDataType, ImportationTableDataType } from '../type'

export default function useImportationViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<ImportationTableDataType>([])

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const productGroupService = useAPIService<ProductGroup>(ProductGroupAPI)
  // const printablePlaceService = useAPIService<PrintablePlace>(PrintablePlaceAPI)
  const importationService = useAPIService<Importation>(ImportationAPI)
  const groupService = useAPIService<Group>(GroupAPI)
  const colorService = useAPIService<Color>(ColorAPI)

  // State changes
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<ImportationExpandableAddNewProps>({})

  // List
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [importations, setImportations] = useState<Importation[]>([])

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
    importations: Importation[]
  ) => {
    const newDataSource = products.map((product) => {
      return {
        ...product,
        key: `${product.id}`,
        productColor: productColors.find((item) => item.productID === product.id),
        productGroup: productGroups.find((item) => item.productID === product.id),
        expandableImportationTableDataTypes: importations
          .filter((item) => item.productID === product.id)
          .map((item) => {
            return { ...item, key: `${item.id}` }
          })
      } as ImportationTableDataType
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

      const importationsResult = await importationService.getItems(
        { paginator: { page: 1, pageSize: -1 } },
        table.setLoading
      )
      const newImportations = importationsResult.data as Importation[]
      setImportations(newImportations)

      await colorService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, table.setLoading, (result) => {
        if (!result.success) throw new Error(define('dataLoad_failed'))
        setColors(result.data as Color[])
      })
      await groupService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, table.setLoading, (result) => {
        if (!result.success) throw new Error(define('dataLoad_failed'))
        setGroups(result.data as Group[])
      })

      dataMapped(newProducts, newProductColors, newProductGroups, newImportations)
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

      const importationResult = await importationService.getItems(
        {
          paginator: { page: 1, pageSize: -1 }
        },
        table.setLoading
      )
      if (!importationResult.success) throw new Error(define('dataLoad_failed'))
      const newImportations = importationResult.data as Importation[]

      dataMapped(newProducts, productColors, productGroups, newImportations)
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleUpdateImportationExpandableRow = (
    productRecord: ImportationTableDataType,
    newRecord: ImportationExpandableTableDataType
  ) => {
    const index = productRecord.expandableImportationTableDataTypes.findIndex((item) => item.key === newRecord.key)
    const newImportationExpandableTableDataSource = productRecord.expandableImportationTableDataTypes
    newImportationExpandableTableDataSource[index] = newRecord
    const newImportationTableDataSourceItem: ImportationTableDataType = {
      ...productRecord,
      expandableImportationTableDataTypes: newImportationExpandableTableDataSource
    }
    table.handleUpdate(productRecord.key, newImportationTableDataSourceItem)
  }

  const handleDeleteImportationExpandableRow = (
    productRecord: ImportationTableDataType,
    recordToDelete: ImportationExpandableTableDataType
  ) => {
    const newImportationTableDataSourceItem: ImportationTableDataType = {
      ...productRecord,
      expandableImportationTableDataTypes: productRecord.expandableImportationTableDataTypes.filter(
        (item) => item.key !== recordToDelete.key
      )
    }
    // Update table dataSource
    table.handleUpdate(productRecord.key, newImportationTableDataSourceItem)
  }

  /**
   * Function update record
   */
  const handleUpdate = async (productRecord: ImportationTableDataType, record: ImportationExpandableTableDataType) => {
    try {
      if (
        numberComparator(newRecord.quantity, record.quantity) ||
        dateComparator(newRecord.dateImported, record.dateImported)
      ) {
        await importationService.updateItemByPkSync(
          record.id!,
          {
            ...newRecord
          },
          table.setLoading,
          (meta) => {
            if (!meta.success) throw new Error(define('update_failed'))
            const itemUpdated = meta.data as Importation
            handleUpdateImportationExpandableRow(productRecord, { ...itemUpdated, key: `${itemUpdated.id}` })
          }
        )
      }
      message.success(define('updated_success'))
    } catch (error: any) {
      message.error(error.message)
    } finally {
      table.handleCancelEditing()
      table.setLoading(false)
    }
  }

  /**
   * Function add new record
   */
  const handleAddNew = async (formAddNew: ImportationExpandableAddNewProps) => {
    try {
      await importationService.createItemSync(
        {
          ...formAddNew,
          productID: table.addingKey.payload?.id
        },
        table.setLoading,
        (meta) => {
          if (!meta.success) throw new Error(define('create_failed'))
          const newImportation = meta.data as Importation

          const prevDataSourceItem = table.dataSource.find((item) => item.key === table.addingKey.payload?.key)
          if (prevDataSourceItem) {
            const newImportationExpandableDataSource = prevDataSourceItem.expandableImportationTableDataTypes
            newImportationExpandableDataSource.unshift({
              ...newImportation,
              key: `${newImportation.id}`
            })
            // table.handleAddNew({
            //   ...prevDataSourceItem,
            //   key: `${formAddNew.productID}`,
            //   expandableImportationTableDataTypes: newImportationExpandableDataSource
            // })
          }
        }
      )
      message.success(define('created_success'))
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setOpenModal(false)
      table.setLoading(false)
    }
  }

  /**
   * Function delete (update status => 'deleted') record
   */
  const handleDelete = async (productRecord: ImportationTableDataType, record: ImportationExpandableTableDataType) => {
    try {
      await importationService.updateItemByPkSync(record.id!, { status: 'deleted' }, table.setLoading, (meta) => {
        if (!meta.success) throw new Error(define('failed'))
        handleDeleteImportationExpandableRow(productRecord, record)
      })
      message.success(define('success'))
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setOpenModal(false)
      table.setLoading(false)
    }
  }

  /**
   * Function delete record forever
   */
  const handleDeleteForever = async (
    productRecord: ImportationTableDataType,
    record: ImportationExpandableTableDataType
  ) => {
    try {
      await importationService.deleteItemSync(record.id!, table.setLoading, (meta) => {
        if (!meta.success) throw new Error(define('delete_failed'))
        handleDeleteImportationExpandableRow(productRecord, record)
        message.success(define('deleted_success'))
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setOpenModal(false)
      table.setLoading(false)
    }
  }

  /**
   * Function restore record
   */
  const handleRestore = async (record: ImportationExpandableAddNewProps) => {
    try {
      await importationService.updateItemBySync(
        { field: 'productID', id: record.productID! },
        { status: 'active' },
        table.setLoading,
        (meta) => {
          if (!meta.success) throw new Error(define('failed'))
          message.success(define('success'))
        }
      )
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setOpenModal(false)
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
   * Function query paginator (page and pageSize)
   */
  const handlePageExpandedChange = () => {}

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
   * Function handle switch delete button
   */
  const handleSwitchDeleteChange = (checked: boolean) => {
    setShowDeleted(checked)
    loadData({ isDeleted: checked, searchTerm: searchText })
  }

  /**
   * Function handle search button
   */
  const handleSearch = (value: string) => {
    setSearchText(value)
    loadData({ isDeleted: showDeleted, searchTerm: value })
  }

  const isChecked = (record: ImportationTableDataType): boolean | undefined => {
    return isValidArray(record.expandableImportationTableDataTypes)
  }

  const isCheckImported = (record: ImportationTableDataType): boolean | undefined => {
    return isValidArray(record.expandableImportationTableDataTypes)
  }

  /**
   * Hàm kiểm tra xem có nên show icon status hay không
   * @param record SewingLineDeliveryTableDataType
   * @returns boolean
   */
  const isShowStatusIcon = (record: ImportationTableDataType): boolean => {
    return isValidArray(record.expandableImportationTableDataTypes)
      ? sumArray(
          record.expandableImportationTableDataTypes.map((item) => {
            return numberValidatorCalc(item.quantity)
          })
        ) > 0
      : false
  }

  /**
   * Hàm kiểm tra trạng thái của icon
   * @param record SewingLineDeliveryTableDataType
   * @returns boolean
   */
  const statusIconType = (record: ImportationTableDataType): TableStatusType => {
    const sum = isValidArray(record.expandableImportationTableDataTypes)
      ? sumArray(
          record.expandableImportationTableDataTypes.map((item) => {
            return numberValidatorCalc(item.quantity)
          })
        )
      : 0
    return sum > 0 ? 'success' : 'normal'
  }

  return {
    state: {
      productColors,
      colors,
      groups,
      productGroups,
      importations,
      showDeleted,
      setShowDeleted,
      searchText,
      setSearchText,
      openModal,
      newRecord,
      setNewRecord,
      setOpenModal
    },
    service: {
      productService,
      productColorService,
      productGroupService,
      importationService
    },
    action: {
      isChecked,
      isCheckImported,
      loadData,
      handleAddNew,
      handleUpdate,
      handleSwitchSortChange,
      handleSwitchDeleteChange,
      handleSearch,
      handlePageChange,
      handlePageExpandedChange,
      handleDelete,
      handleDeleteForever,
      handleRestore,
      isShowStatusIcon,
      statusIconType
    },
    table
  }
}
