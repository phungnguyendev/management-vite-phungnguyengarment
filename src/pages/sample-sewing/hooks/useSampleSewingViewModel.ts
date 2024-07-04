import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Paginator } from '~/api/client'
import PrintablePlaceAPI from '~/api/services/PrintablePlaceAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import ProductGroupAPI from '~/api/services/ProductGroupAPI'
import SampleSewingAPI from '~/api/services/SampleSewingAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants'
import useAPIService from '~/hooks/useAPIService'
import { PrintablePlace, Product, ProductColor, ProductGroup, SampleSewing } from '~/typing'
import { dateComparator } from '~/utils/helpers'
import { SampleSewingAddNewProps, SampleSewingTableDataType } from '../type'

export default function useSampleSewingViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<SampleSewingTableDataType>([])

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const productGroupService = useAPIService<ProductGroup>(ProductGroupAPI)
  const printablePlaceService = useAPIService<PrintablePlace>(PrintablePlaceAPI)
  const sampleSewingService = useAPIService<SampleSewing>(SampleSewingAPI)

  // State changes
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [paginator, setPaginator] = useState<Paginator>({ page: 1, pageSize: -1 })
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchTextChange, setSearchTextChange] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<SampleSewingAddNewProps>({})

  // List
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [printablePlaces, setPrintablePlaces] = useState<PrintablePlace[]>([])
  const [sampleSewings, setSampleSewings] = useState<SampleSewing[]>([])

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
    printablePlaces: PrintablePlace[],
    sampleSewings: SampleSewing[]
  ) => {
    const newDataSource = products.map((product) => {
      return {
        ...product,
        key: `${product.id}`,
        productColor: productColors.find((item) => item.productID === product.id),
        productGroup: productGroups.find((item) => item.productID === product.id),
        printablePlace: printablePlaces.find((item) => item.productID === product.id),
        sampleSewing: sampleSewings.find((item) => item.productID === product.id)
      } as SampleSewingTableDataType
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

      const sampleSewingResult = await sampleSewingService.getItems(
        { paginator: { page: 1, pageSize: -1 } },
        table.setLoading
      )
      const newSampleSewing = sampleSewingResult.data as SampleSewing[]
      setSampleSewings(newSampleSewing)

      dataMapped(newProducts, newProductColors, newProductGroups, newPrintablePlaces, newSampleSewing)
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }, [])

  /**
   * Function query data whenever paginator (page change), isDeleted (Switch) and searchText change
   */
  const loadData = async (query: { paginator: Paginator; isDeleted: boolean; searchTerm: string }) => {
    try {
      await productService.getItemsSync(
        {
          paginator: query.paginator,
          filter: { field: 'id', items: [-1], status: query.isDeleted ? 'deleted' : 'active' },
          search: { field: 'productCode', term: query.searchTerm }
        },
        table.setLoading,
        (meta) => {
          if (!meta.success) throw new Error(define('dataLoad_failed'))
          const newProducts = meta.data as Product[]
          dataMapped(newProducts, productColors, productGroups, printablePlaces, sampleSewings)
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
  const handleUpdate = async (record: SampleSewingTableDataType) => {
    try {
      let updatedRecord: SampleSewingTableDataType = record
      if (
        record.sampleSewing &&
        (!record.sampleSewing.dateSubmissionNPL ||
          dateComparator(newRecord.dateSubmissionNPL, record.sampleSewing.dateSubmissionNPL) ||
          !record.sampleSewing.dateApprovalSO ||
          dateComparator(newRecord.dateApprovalSO, record.sampleSewing.dateApprovalSO) ||
          !record.sampleSewing.dateApprovalPP ||
          dateComparator(newRecord.dateApprovalPP, record.sampleSewing.dateApprovalPP) ||
          !record.sampleSewing.dateSubmissionFirstTime ||
          dateComparator(newRecord.dateSubmissionFirstTime, record.sampleSewing.dateSubmissionFirstTime) ||
          !record.sampleSewing.dateSubmissionSecondTime ||
          dateComparator(newRecord.dateSubmissionSecondTime, record.sampleSewing.dateSubmissionSecondTime) ||
          !record.sampleSewing.dateSubmissionThirdTime ||
          dateComparator(newRecord.dateSubmissionThirdTime, record.sampleSewing.dateSubmissionThirdTime) ||
          !record.sampleSewing.dateSubmissionForthTime ||
          dateComparator(newRecord.dateSubmissionForthTime, record.sampleSewing.dateSubmissionForthTime) ||
          !record.sampleSewing.dateSubmissionFifthTime ||
          dateComparator(newRecord.dateSubmissionFifthTime, record.sampleSewing.dateSubmissionFifthTime))
      ) {
        console.log('Update')
        await sampleSewingService.updateItemBySync(
          { field: 'productID', id: record.id! },
          {
            ...newRecord
          },
          table.setLoading,
          (meta) => {
            if (!meta?.success) throw new Error(define('update_failed'))
            const updatedItem = meta.data as SampleSewing
            console.log(updatedItem)
            updatedRecord = { ...updatedRecord, sampleSewing: updatedItem }
          }
        )
      } else {
        console.log('Create')
        await sampleSewingService.createItemSync({ ...newRecord, productID: record.id }, table.setLoading, (meta) => {
          if (!meta.success) throw new Error(define('create_failed'))
          const newItem = meta.data as SampleSewing
          console.log(newItem)
          updatedRecord = { ...updatedRecord, sampleSewing: newItem }
        })
      }
      console.log(updatedRecord)
      table.handleUpdate(record.key, updatedRecord)
      message.success(define('updated_success'))
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setNewRecord({})
      table.handleCancelEditing()
      table.setLoading(false)
    }
  }

  /**
   * Function add new record
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddNew = async (_formAddNew: SampleSewingAddNewProps) => {}

  /**
   * Function delete (update status => 'deleted') record
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = async (_record: SampleSewingTableDataType) => {}

  /**
   * Function delete record forever
   */
  const handleDeleteForever = async (record: SampleSewingTableDataType) => {
    try {
      await sampleSewingService.deleteItemBySync({ field: 'productID', id: record.id! }, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('delete_failed'))
      })
      table.handleUpdate(record.key, { ...record, sampleSewing: {} })
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
  const handleRestore = async (_record: SampleSewingTableDataType) => {}

  /**
   * Function query paginator (page and pageSize)
   */
  const handlePageChange = (page: number, pageSize: number) => {
    setPaginator({ page, pageSize })
    loadData({ paginator: { page, pageSize }, isDeleted: showDeleted, searchTerm: searchText })
  }

  /**
   * Function handle switch delete button
   */
  const handleSwitchDeleteChange = (checked: boolean) => {
    setShowDeleted(checked)
    loadData({ paginator, isDeleted: checked, searchTerm: searchText })
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
    loadData({ paginator, isDeleted: showDeleted, searchTerm: value })
  }

  return {
    state: {
      sampleSewings,
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
      sampleSewingService
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
      handleRestore
    },
    table
  }
}
