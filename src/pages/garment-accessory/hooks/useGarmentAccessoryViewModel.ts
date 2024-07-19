import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import AccessoryNoteAPI from '~/api/services/AccessoryNoteAPI'
import ColorAPI from '~/api/services/ColorAPI'
import GarmentAccessoryAPI from '~/api/services/GarmentAccessoryAPI'
import GarmentAccessoryNoteAPI from '~/api/services/GarmentAccessoryNoteAPI'
import GroupAPI from '~/api/services/GroupAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import ProductGroupAPI from '~/api/services/ProductGroupAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants'
import useAPIService from '~/hooks/useAPIService'
import {
  AccessoryNote,
  Color,
  GarmentAccessory,
  GarmentAccessoryNote,
  Group,
  Product,
  ProductColor,
  ProductGroup
} from '~/typing'
import {
  booleanComparator,
  dateComparator,
  isValidArray,
  isValidBoolean,
  isValidNumber,
  isValidObject,
  numberComparator,
  textComparator
} from '~/utils/helpers'
import {
  ExpandableGarmentAccessoryTableDataType,
  GarmentAccessoryAddNewProps,
  GarmentAccessoryTableDataType
} from '../type'

export default function useGarmentAccessoryViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<GarmentAccessoryTableDataType>([])

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const productGroupService = useAPIService<ProductGroup>(ProductGroupAPI)
  const garmentAccessoryService = useAPIService<GarmentAccessory>(GarmentAccessoryAPI)
  const garmentAccessoryNoteService = useAPIService<GarmentAccessoryNote>(GarmentAccessoryNoteAPI)
  const accessoryNoteService = useAPIService<AccessoryNote>(AccessoryNoteAPI)
  const colorService = useAPIService<Color>(ColorAPI)
  const groupService = useAPIService<Group>(GroupAPI)

  // State changes
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchTextChange, setSearchTextChange] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<GarmentAccessoryAddNewProps>({
    id: 0,
    amountCutting: 0,
    passingDeliveryDate: '',
    syncStatus: false,
    accessoryNoteIDs: [],
    notes: ''
  })

  // List
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [garmentAccessories, setGarmentAccessories] = useState<GarmentAccessory[]>([])
  const [garmentAccessoryNotes, setGarmentAccessoryNotes] = useState<GarmentAccessoryNote[]>([])
  const [accessoryNotes, setAccessoryNotes] = useState<AccessoryNote[]>([])
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
    garmentAccessories: GarmentAccessory[],
    garmentAccessoryNotes: GarmentAccessoryNote[]
  ) => {
    const newDataSource = products.map((product) => {
      let expandableGarmentAccessory: ExpandableGarmentAccessoryTableDataType | undefined = undefined

      if (garmentAccessories.length > 0) {
        const garmentAccessoryFound = garmentAccessories.find((item) => item.productID === product.id)
        if (garmentAccessoryFound) {
          expandableGarmentAccessory = {
            ...garmentAccessoryFound,
            accessoryNotes:
              garmentAccessoryNotes.length > 0 && garmentAccessories.length > 0
                ? garmentAccessoryNotes
                    .filter((item) =>
                      garmentAccessories.some(
                        (self) => self.productID === product.id && item.garmentAccessoryID === self.id
                      )
                    )
                    .map((item) => {
                      return item.accessoryNote!
                    })
                : undefined
          }
        }
      }

      return {
        ...product,
        key: `${product.id}`,
        productColor: productColors.find((item) => item.productID === product.id),
        productGroup: productGroups.find((item) => item.productID === product.id),
        expandableGarmentAccessory: expandableGarmentAccessory
      } as GarmentAccessoryTableDataType
    })
    table.setDataSource(newDataSource)
  }

  /**
   * Initialize function
   */
  const initialize = useCallback(async () => {
    try {
      // Call list Product
      const productsResult = await productService.getItems({ paginator: { page: 1, pageSize: -1 } }, table.setLoading)
      const newProducts = productsResult.data as Product[]

      // Call list ProductColor
      const productColorsResult = await productColorService.getItems(
        { paginator: { page: 1, pageSize: -1 } },
        table.setLoading
      )
      const newProductColors = productColorsResult.data as ProductColor[]
      setProductColors(newProductColors)

      // Call list ProductGroup
      const productGroupsResult = await productGroupService.getItems(
        { paginator: { page: 1, pageSize: -1 } },
        table.setLoading
      )
      const newProductGroups = productGroupsResult.data as ProductGroup[]
      setProductGroups(newProductGroups)

      // Call list GarmentAccessory
      const garmentAccessoryResult = await garmentAccessoryService.getItems(
        { paginator: { page: 1, pageSize: -1 } },
        table.setLoading
      )
      const newGarmentAccessories = garmentAccessoryResult.data as GarmentAccessory[]
      setGarmentAccessories(newGarmentAccessories)

      // Call list GarmentAccessoryNote
      const garmentAccessoryNoteResult = await garmentAccessoryNoteService.getItems(
        { paginator: { page: 1, pageSize: -1 } },
        table.setLoading
      )
      const newGarmentAccessoryNotes = garmentAccessoryNoteResult.data as GarmentAccessoryNote[]
      setGarmentAccessoryNotes(newGarmentAccessoryNotes)

      // Call list AccessoryNote
      const accessoryNoteResult = await accessoryNoteService.getItems(
        { paginator: { page: 1, pageSize: -1 } },
        table.setLoading
      )
      const newAccessoryNotes = accessoryNoteResult.data as AccessoryNote[]
      setAccessoryNotes(newAccessoryNotes)

      await colorService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, table.setLoading, (result) => {
        if (!result.success) throw new Error(define('dataLoad_failed'))
        setColors(result.data as Color[])
      })
      await groupService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, table.setLoading, (result) => {
        if (!result.success) throw new Error(define('dataLoad_failed'))
        setGroups(result.data as Group[])
      })

      dataMapped(newProducts, newProductColors, newProductGroups, newGarmentAccessories, newGarmentAccessoryNotes)
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
          dataMapped(newProducts, productColors, productGroups, garmentAccessories, garmentAccessoryNotes)
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

  const handleUpdate = async (record: GarmentAccessoryTableDataType) => {
    try {
      // Kiểm tra nếu record có tồn tại và nếu một trong các thuộc tính thay đổi thì Update
      if (
        isValidObject(record.expandableGarmentAccessory) &&
        (numberComparator(newRecord.amountCutting, record.expandableGarmentAccessory.amountCutting) ||
          dateComparator(newRecord.passingDeliveryDate, record.expandableGarmentAccessory.passingDeliveryDate) ||
          booleanComparator(newRecord.syncStatus, record.expandableGarmentAccessory.syncStatus) ||
          textComparator(newRecord.notes, record.expandableGarmentAccessory.notes))
      ) {
        const result = await garmentAccessoryService.updateItemByPk(
          record.expandableGarmentAccessory.id!,
          {
            ...newRecord
          },
          table.setLoading
        )
        // Checking error and throw error
        if (!result.success) throw new Error(define('update_failed'))
        const updatedItem = result.data as GarmentAccessory
        delete updatedItem.product
        const updatedGarmentAccessoryNotes = await handleUpdateGarmentAccessoryNotes(updatedItem.id!)
        table.handleUpdate(record.key, {
          ...record,
          expandableGarmentAccessory: { ...updatedItem, accessoryNotes: updatedGarmentAccessoryNotes }
        })
      }

      if (!isValidObject(record.expandableGarmentAccessory)) {
        const result = await garmentAccessoryService.createItem(
          { ...newRecord, productID: record.id },
          table.setLoading
        )
        // Checking error and throw error
        if (!result.success) throw new Error(define('update_failed'))
        const createdItem = result.data as GarmentAccessory
        delete createdItem.product
        const updatedGarmentAccessoryNotes = await handleUpdateGarmentAccessoryNotes(createdItem.id!)

        table.handleUpdate(record.key, {
          ...record,
          expandableGarmentAccessory: { ...createdItem, accessoryNotes: updatedGarmentAccessoryNotes }
        })
      }

      message.success(define('updated_success'))
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setNewRecord({})
      table.handleCancelEditing()
      table.setLoading(false)
    }
  }

  const handleUpdateGarmentAccessoryNotes = async (garmentAccessoryID: number): Promise<AccessoryNote[]> => {
    try {
      // Kiểm tra accessoryNotes (Ghi chú phụ liệu)
      const result = await garmentAccessoryNoteService.updateItemsBy(
        {
          field: 'garmentAccessoryID',
          id: garmentAccessoryID
        },
        isValidArray(newRecord.accessoryNoteIDs)
          ? newRecord.accessoryNoteIDs.map((accessoryNoteID) => {
              return {
                accessoryNoteID: accessoryNoteID,
                garmentAccessoryID: garmentAccessoryID
              } as GarmentAccessoryNote
            })
          : []
      )
      if (!result.success) throw new Error(define('update_failed'))
      const updatedItems = result.data as GarmentAccessoryNote[]
      return updatedItems.map((item) => {
        delete item.garmentAccessory
        return item.accessoryNote!
      })
    } catch (error) {
      throw error
    }
  }

  /**
   * Function add new record
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddNew = async (_formAddNew: GarmentAccessoryAddNewProps) => {}

  /**
   * Function delete (update status => 'deleted') record
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = async (_record: GarmentAccessoryTableDataType) => {}

  /**
   * Function delete record forever
   */
  const handleDeleteForever = async (record: GarmentAccessoryTableDataType) => {
    try {
      await garmentAccessoryService.deleteItemBySync(
        { field: 'productID', id: record.id! },
        table.setLoading,
        (res) => {
          if (!res.success) throw new Error(define('delete_failed'))
        }
      )
      table.handleUpdate(record.key, { ...record, expandableGarmentAccessory: {} })
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRestore = async (_record: GarmentAccessoryTableDataType) => {}

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

  const handleSearch = (value: string) => {
    setSearchText(value)
    loadData({ isDeleted: showDeleted, searchTerm: value })
  }

  const isDisabledRecord = (record: GarmentAccessoryTableDataType): boolean => {
    return table.isEditing(record.key)
      ? newRecord.syncStatus ?? false
      : isValidObject(record.expandableGarmentAccessory) && isValidNumber(record.expandableGarmentAccessory?.id)
        ? record.expandableGarmentAccessory.syncStatus ?? false
        : false
  }

  /**
   * Hàm kiểm tra xem có nên show icon status hay không
   * @param record SewingLineDeliveryTableDataType
   * @returns boolean
   */
  const isShowStatusIcon = (record: GarmentAccessoryTableDataType): boolean => {
    return (
      isValidObject(record.expandableGarmentAccessory) &&
      isValidBoolean(record.expandableGarmentAccessory.syncStatus) &&
      record.expandableGarmentAccessory.syncStatus
    )
  }

  return {
    state: {
      colors,
      groups,
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
      productGroupService,
      garmentAccessoryService,
      garmentAccessoryNoteService
    },
    action: {
      loadData,
      handleAddNew,
      handleUpdate,
      handleSwitchDeleteChange,
      handleSwitchSortChange,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleDeleteForever,
      handleRestore,
      isDisabledRecord,
      isShowStatusIcon
    },
    table
  }
}
