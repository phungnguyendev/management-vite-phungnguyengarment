import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import ColorAPI from '~/api/services/ColorAPI'
import GroupAPI from '~/api/services/GroupAPI'
import PrintAPI from '~/api/services/PrintAPI'
import PrintablePlaceAPI from '~/api/services/PrintablePlaceAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import ProductGroupAPI from '~/api/services/ProductGroupAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants'
import useAPIService from '~/hooks/useAPIService'
import { ProductAddNewProps, ProductTableDataType } from '~/pages/product/type'
import { Color, Group, Print, PrintablePlace, Product, ProductColor, ProductGroup } from '~/typing'
import {
  arrayComparator,
  dateComparator,
  isValidArray,
  isValidNumber,
  isValidObject,
  numberComparator,
  textComparator
} from '~/utils/helpers'

export default function useProductViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<ProductTableDataType>([])

  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const productGroupService = useAPIService<ProductGroup>(ProductGroupAPI)
  const printablePlaceService = useAPIService<PrintablePlace>(PrintablePlaceAPI)
  const colorService = useAPIService<Color>(ColorAPI)
  const groupService = useAPIService<Group>(GroupAPI)
  const printService = useAPIService<Print>(PrintAPI)

  const [searchText, setSearchText] = useState<string>('')
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [newRecord, setNewRecord] = useState<ProductAddNewProps>({
    productCode: undefined,
    quantityPO: undefined,
    colorID: undefined,
    groupID: undefined,
    printIDs: undefined,
    dateInputNPL: undefined,
    dateOutputFCR: undefined
  })

  // Data
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [printablePlaces, setPrintablePlaces] = useState<PrintablePlace[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [prints, setPrints] = useState<Print[]>([])

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
    printablePlaces: PrintablePlace[]
  ) => {
    const newDataSource = products.map((product) => {
      return {
        ...product,
        key: `${product.id}`,
        productColor: productColors.find((item) => item.productID === product.id),
        productGroup: productGroups.find((item) => item.productID === product.id),
        printablePlaces: printablePlaces.filter((item) => item.productID === product.id)
      } as ProductTableDataType
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

      const printablePlacesResult = await printablePlaceService.getItems(
        { paginator: { page: 1, pageSize: -1 } },
        table.setLoading
      )
      const newPrintablePlaces = printablePlacesResult.data as PrintablePlace[]
      setPrintablePlaces(newPrintablePlaces)

      dataMapped(newProducts, newProductColors, newProductGroups, newPrintablePlaces)

      await colorService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, table.setLoading, (result) => {
        if (!result.success) throw new Error(define('dataLoad_failed'))
        setColors(result.data as Color[])
      })
      await groupService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, table.setLoading, (result) => {
        if (!result.success) throw new Error(define('dataLoad_failed'))
        setGroups(result.data as Group[])
      })
      await printService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, table.setLoading, (result) => {
        if (!result.success) throw new Error(define('dataLoad_failed'))
        setPrints(result.data as Print[])
      })
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
          dataMapped(newProducts, productColors, productGroups, printablePlaces)
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

  /**
   * Function update record
   */
  const handleUpdate = async (record: ProductTableDataType) => {
    try {
      table.setLoading(true)
      // Update product
      let updatedProduct: ProductTableDataType = record
      if (
        textComparator(newRecord.productCode, record.productCode) ||
        numberComparator(newRecord.quantityPO, record.quantityPO) ||
        dateComparator(newRecord.dateInputNPL, record.dateInputNPL) ||
        dateComparator(newRecord.dateOutputFCR, record.dateOutputFCR)
      ) {
        await productService.updateItemByPkSync(
          record.id!,
          {
            productCode: newRecord.productCode,
            quantityPO: newRecord.quantityPO,
            dateInputNPL: newRecord.dateInputNPL,
            dateOutputFCR: newRecord.dateOutputFCR
          },
          table.setLoading,
          (meta) => {
            if (!meta.success) throw new Error(define('update_failed'))
            const newProduct = meta.data as Product
            updatedProduct = {
              ...newProduct,
              key: `${newProduct.id}`
            }
          }
        )
      }

      // Update color
      if (isValidObject(record.productColor) && numberComparator(newRecord.colorID, record.productColor.colorID)) {
        await productColorService.updateItemBySync(
          { field: 'productID', id: record.id! },
          { colorID: newRecord.colorID },
          table.setLoading,
          (meta) => {
            if (!meta.success) throw new Error(define('update_failed'))
            const newProductColor = meta.data as ProductColor
            updatedProduct = {
              ...updatedProduct,
              productColor: newProductColor
            }
          }
        )
      }

      // Create product color
      if (!isValidObject(record.productColor) && isValidNumber(newRecord.colorID)) {
        await productColorService.createItemSync(
          { productID: record.id, colorID: newRecord.colorID },
          table.setLoading,
          (meta) => {
            if (!meta.success) throw new Error(define('update_failed'))
            const newItem = meta.data as ProductColor
            updatedProduct = {
              ...updatedProduct,
              productColor: newItem
            }
          }
        )
      }

      // Update group
      if (isValidObject(record.productGroup) && numberComparator(newRecord.groupID, record.productGroup.groupID)) {
        await productGroupService.updateItemBySync(
          { field: 'productID', id: record.id! },
          { groupID: newRecord.groupID },
          table.setLoading,
          (meta) => {
            if (!meta.success) throw new Error(define('update_failed'))
            const newItem = meta.data as ProductGroup
            updatedProduct = {
              ...updatedProduct,
              productGroup: newItem
            }
          }
        )
      }

      // Create product group
      if (!isValidObject(record.productGroup) && isValidNumber(newRecord.groupID)) {
        await productGroupService.createItemSync(
          { productID: record.id, groupID: newRecord.groupID },
          table.setLoading,
          (meta) => {
            if (!meta.success) throw new Error(define('update_failed'))
            const newItem = meta.data as ProductGroup
            updatedProduct = {
              ...updatedProduct,
              productGroup: newItem
            }
          }
        )
      }

      // Update PrintablePlaces
      if (
        isValidArray(newRecord.printIDs) &&
        arrayComparator(
          newRecord.printIDs,
          record.printablePlaces?.map((item) => {
            return item.printID
          })
        )
      ) {
        await printablePlaceService.updateItemsSync(
          { field: 'productID', id: record.id! },
          newRecord.printIDs.map((printID) => {
            return { productID: record.id!, printID: printID! } as PrintablePlace
          }),
          table.setLoading,
          (meta) => {
            if (!meta?.success) throw new Error(define('create_failed'))
            const newItems = meta.data as PrintablePlace[]
            updatedProduct = {
              ...updatedProduct,
              printablePlaces: newItems
            }
          }
        )
      }

      // Update record with newRecord
      table.handleUpdate(record.key, updatedProduct)
      message.success(define('updated_success'))
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.handleCancelEditing()
      table.setLoading(false)
    }
  }

  /**
   * Function add new record
   */
  const handleAddNew = async (formAddNew: ProductAddNewProps) => {
    try {
      await productService.createItemSync(
        {
          productCode: formAddNew.productCode,
          quantityPO: formAddNew.quantityPO,
          dateInputNPL: formAddNew.dateInputNPL,
          dateOutputFCR: formAddNew.dateOutputFCR
        },
        table.setLoading,
        async (meta) => {
          if (!meta.success) throw new Error(define('create_failed'))

          const newProduct = meta.data as Product
          let newProductColor: ProductColor | undefined = undefined
          let newProductGroup: ProductGroup | undefined = undefined
          let newPrintablePlaces: PrintablePlace[] | undefined = undefined

          if (isValidNumber(formAddNew.colorID)) {
            await productColorService.createItemSync(
              { productID: newProduct.id!, colorID: formAddNew.colorID },
              table.setLoading,
              (meta) => {
                if (!meta?.success) throw new Error(define('create_failed'))
                newProductColor = meta.data as ProductColor
              }
            )
          }

          if (isValidNumber(formAddNew.groupID)) {
            await productGroupService.createItemSync(
              { productID: newProduct.id!, groupID: formAddNew.groupID },
              table.setLoading,
              (meta) => {
                if (!meta?.success) throw new Error(define('create_failed'))
                newProductGroup = meta.data as ProductGroup
              }
            )
          }

          if (isValidArray(formAddNew.printIDs)) {
            await printablePlaceService.updateItemsSync(
              { field: 'productID', id: newProduct.id! },
              formAddNew.printIDs.map((item) => {
                return { productID: newProduct.id!, printID: item } as PrintablePlace
              }),
              table.setLoading,
              (meta) => {
                if (!meta?.success) throw new Error(define('create_failed'))
                newPrintablePlaces = meta.data as PrintablePlace[]
              }
            )
          }

          table.handleAddNew({
            ...newProduct,
            key: `${newProduct.id}`,
            productColor: newProductColor,
            productGroup: newProductGroup,
            printablePlaces: newPrintablePlaces
          })
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
  const handleDelete = async (record: ProductTableDataType) => {
    try {
      table.setLoading(true)
      await productService.updateItemByPkSync(record.id!, { status: 'deleted' }, table.setLoading, (meta) => {
        if (!meta.success) throw new Error(define('failed'))
        table.handleDeleting(record.key)
      })
      message.success(define('success'))
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  /**
   * Function delete record forever
   */
  const handleDeleteForever = async (record: ProductTableDataType) => {
    try {
      await productService.deleteItemSync(record.id!, table.setLoading, (meta) => {
        if (!meta.success) throw new Error(define('delete_failed'))
      })
      table.handleDeleting(record.key)
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
  const handleRestore = async (record: ProductTableDataType) => {
    try {
      await productService.updateItemByPkSync(record.id!, { status: 'active' }, table.setLoading, (meta) => {
        if (!meta?.success) throw new Error(define('restore_failed'))
        table.handleDeleting(record.key)
        message.success(define('restored_success'))
      })
    } catch (error: any) {
      message.error(error.message)
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

  // const handlePageChange = () => {}

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
      newRecord,
      setNewRecord,
      setOpenModal,
      prints,
      colors,
      groups
    },
    service: {
      productService,
      productColorService,
      productGroupService,
      printablePlaceService
    },
    action: {
      loadData,
      handleUpdate,
      handleSearch,
      handleAddNew,
      handlePageChange,
      handleDelete,
      handleDeleteForever,
      handleRestore,
      handleSwitchSortChange,
      handleSwitchDeleteChange
    },
    table
  }
}
