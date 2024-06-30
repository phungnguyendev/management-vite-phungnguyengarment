import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Paginator } from '~/api/client'
import ImportationAPI from '~/api/services/ImportationAPI'
import PrintablePlaceAPI from '~/api/services/PrintablePlaceAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import ProductGroupAPI from '~/api/services/ProductGroupAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants'
import useAPIService from '~/hooks/useAPIService'
import { Importation, PrintablePlace, Product, ProductColor, ProductGroup } from '~/typing'
import { dateComparator, numberComparator } from '~/utils/helpers'
import { ImportationExpandableAddNewProps, ImportationExpandableTableDataType, ImportationTableDataType } from '../type'

export default function useImportationViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<ImportationTableDataType>([])

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const productGroupService = useAPIService<ProductGroup>(ProductGroupAPI)
  const printablePlaceService = useAPIService<PrintablePlace>(PrintablePlaceAPI)
  const importationService = useAPIService<Importation>(ImportationAPI)

  // State changes
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [paginator, setPaginator] = useState<Paginator>({
    page: 1,
    pageSize: -1
  })
  const [shorted, setSorted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<ImportationExpandableAddNewProps>({})

  // List
  const [products, setProducts] = useState<Product[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [printablePlaces, setPrintablePlaces] = useState<PrintablePlace[]>([])
  const [importations, setImportations] = useState<Importation[]>([])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadData()
  }, [showDeleted, shorted, paginator, searchText])

  useEffect(() => {
    mappedData()
  }, [products, productColors, productGroups, printablePlaces, importations])

  const mappedData = useCallback(() => {
    table.setDataSource(() => {
      const dataSource = products.map((product) => {
        return {
          ...product,
          key: `${product.id}`,
          productColor: productColors.find((item) => item.productID === product.id),
          productGroup: productGroups.find((item) => item.productID === product.id),
          printablePlace: printablePlaces.find((item) => item.productID === product.id),
          expandableImportationTableDataTypes: importations
            .filter((item) => item.productID === product.id)
            .map((item) => {
              return { ...item, key: `${item.id}` }
            })
        } as ImportationTableDataType
      })
      return dataSource
    })
  }, [products, productColors, productGroups, printablePlaces, importations])

  const loadData = async () => {
    try {
      await productService.getItemsSync(
        {
          paginator: paginator,
          sorting: { column: 'id', direction: shorted ? 'asc' : 'desc' },
          filter: { field: 'id', items: [-1], status: showDeleted ? 'deleted' : 'active' },
          search: { field: 'title', term: searchText }
        },
        table.setLoading,
        (meta) => {
          if (!meta.success) throw new Error(define('dataLoad_failed'))
          setProducts(meta.data as Product[])
        }
      )

      await productColorService.getItemsSync(
        {
          paginator: { page: 1, pageSize: -1 }
        },
        table.setLoading,
        (meta) => {
          if (!meta.success) throw new Error(define('dataLoad_failed'))
          setProductColors(meta.data as ProductColor[])
        }
      )

      await productGroupService.getItemsSync(
        {
          paginator: { page: 1, pageSize: -1 }
        },
        table.setLoading,
        (meta) => {
          if (!meta.success) throw new Error(define('dataLoad_failed'))
          setProductGroups(meta.data as ProductGroup[])
        }
      )

      await printablePlaceService.getItemsSync(
        {
          paginator: { page: 1, pageSize: -1 }
        },
        table.setLoading,
        (meta) => {
          if (!meta.success) throw new Error(define('dataLoad_failed'))
          setPrintablePlaces(meta.data as PrintablePlace[])
        }
      )

      await importationService.getItemsSync(
        {
          paginator: { page: 1, pageSize: -1 },
          sorting: { column: 'id', direction: 'desc' }
        },
        table.setLoading,
        (meta) => {
          if (!meta.success) throw new Error(define('dataLoad_failed'))
          setImportations(meta.data as Importation[])
        }
      )
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
      message.success('Success!')
    } catch (error: any) {
      message.error(error.message)
    } finally {
      table.handleCancelEditing()
      table.setLoading(false)
    }
  }

  const handleAddNew = async (formAddNew: ImportationExpandableAddNewProps) => {
    console.log(formAddNew)
    try {
      await importationService.createItemSync(
        {
          ...formAddNew,
          productID: table.addingKey.payload?.id
        },
        table.setLoading,
        (meta) => {
          if (!meta.success) throw new Error(define('create_failed'))
          const importation = meta.data as Importation
          const prevDataSourceItem = table.dataSource.find((item) => item.key === table.addingKey.payload?.key)
          if (prevDataSourceItem) {
            const newImportationExpandableDataSource = prevDataSourceItem.expandableImportationTableDataTypes
            newImportationExpandableDataSource.unshift({
              ...importation,
              key: `${importation.id}`
            })
            table.handleAddNew({
              ...prevDataSourceItem,
              key: `${formAddNew.productID}`,
              expandableImportationTableDataTypes: newImportationExpandableDataSource
            })
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

  const handleDelete = async (productRecord: ImportationTableDataType, record: ImportationExpandableTableDataType) => {
    try {
      await importationService.updateItemByPkSync(record.id!, { status: 'deleted' }, table.setLoading, (meta) => {
        if (!meta.success) throw new Error(define('failed'))
        handleDeleteImportationExpandableRow(productRecord, record)
        message.success(define('success'))
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setOpenModal(false)
      table.setLoading(false)
    }
  }

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

  const handlePageChange = (page: number, pageSize: number) => {
    setPaginator({ page, pageSize })
  }

  const handleSortChange = (checked: boolean) => {
    setSorted(checked)
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  return {
    state: {
      productColors,
      printablePlaces,
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
      printablePlaceService,
      productGroupService,
      importationService
    },
    action: {
      loadData,
      handleAddNew,
      handleUpdate,
      handleSortChange,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleDeleteForever,
      handleRestore
    },
    table
  }
}
