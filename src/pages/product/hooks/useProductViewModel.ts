import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Paginator } from '~/api/client'
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
import { dateComparator, isValidNumber, isValidString, numberComparator, textComparator } from '~/utils/helpers'

interface ProductNewRecord {
  colorID?: number
  quantityPO?: number
  productCode?: string
  dateInputNPL?: string
  dateOutputFCR?: string
  groupID?: number
  printID?: number
}

export default function useProductViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<ProductTableDataType>([])

  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const productGroupService = useAPIService<ProductGroup>(ProductGroupAPI)
  const printablePlaceService = useAPIService<PrintablePlace>(PrintablePlaceAPI)
  const colorService = useAPIService<Color>(ColorAPI)
  const groupService = useAPIService<Group>(GroupAPI)
  const printService = useAPIService<Group>(PrintAPI)

  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<ProductNewRecord>({})
  const [paginator, setPaginator] = useState<Paginator>({
    page: 1,
    pageSize: -1
  })
  const [shorted, setSorted] = useState<boolean>(false)
  // Data
  const [products, setProducts] = useState<Product[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [printablePlaces, setPrintablePlaces] = useState<PrintablePlace[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [prints, setPrints] = useState<Print[]>([])

  useEffect(() => {
    loadDataEditingChange()
  }, [table.editingKey])

  useEffect(() => {
    loadData()
  }, [showDeleted, shorted, paginator, searchText])

  useEffect(() => {
    mappedData()
  }, [products, productColors, productGroups, printablePlaces])

  const mappedData = useCallback(() => {
    table.setDataSource(() => {
      const _dataSource = products.map((self) => {
        return {
          ...self,
          key: `${self.id}`,
          productColor: productColors.find((item) => item.productID === self.id),
          productGroup: productGroups.find((item) => item.productID === self.id),
          printablePlace: printablePlaces.find((item) => item.productID === self.id)
        } as ProductTableDataType
      })
      return _dataSource
    })
  }, [products, productColors, productGroups, printablePlaces])

  const loadData = async () => {
    try {
      await productService.getItemsSync(
        {
          paginator: paginator,
          sorting: { column: 'id', direction: shorted ? 'asc' : 'desc' },
          filter: { field: 'id', items: [-1], status: showDeleted ? 'deleted' : 'active' },
          search: { field: 'name', term: searchText }
        },
        table.setLoading,
        (meta) => {
          if (!meta.success) throw new Error(define('dataLoad_failed'))
          const data = meta.data as Product[]
          setProducts(data)
        }
      )
      await productColorService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, table.setLoading, (meta) => {
        if (!meta.success) throw new Error(define('dataLoad_failed'))
        const data = meta.data as ProductColor[]
        setProductColors(data)
        console.log(data)
      })
      await productGroupService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, table.setLoading, (meta) => {
        if (!meta.success) throw new Error(define('dataLoad_failed'))
        const data = meta.data as ProductGroup[]
        setProductGroups(data)
      })
      await printablePlaceService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, table.setLoading, (meta) => {
        if (!meta.success) throw new Error(define('dataLoad_failed'))
        const data = meta.data as PrintablePlace[]
        setPrintablePlaces(data)
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const loadDataEditingChange = async () => {
    try {
      if (isValidString(table.editingKey)) {
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
      }
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleUpdate = async (record: ProductTableDataType) => {
    try {
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
          }
        )
      }
      if (numberComparator(newRecord.colorID, record.productColor?.colorID)) {
        await productColorService.updateItemBySync(
          { field: 'productID', id: record.id! },
          { colorID: newRecord.colorID },
          table.setLoading,
          (meta) => {
            if (!meta.success) throw new Error(define('update_failed'))
          }
        )
      }
      if (numberComparator(newRecord.groupID, record.productGroup?.groupID)) {
        await productGroupService.updateItemBySync(
          { field: 'productID', id: record.id! },
          { groupID: newRecord.groupID },
          table.setLoading,
          (meta) => {
            if (!meta.success) throw new Error(define('update_failed'))
          }
        )
      }
      if (numberComparator(newRecord.printID, record.printablePlace?.printID)) {
        await printablePlaceService.updateItemBySync(
          { field: 'productID', id: record.id! },
          { printID: newRecord.printID },
          table.setLoading,
          (meta) => {
            if (!meta.success) throw new Error(define('update_failed'))
          }
        )
      }
      message.success(define('updated_success'))
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.handleCancelEditing()
      table.setLoading(false)
    }
  }

  const handleAddNew = async (formAddNew: ProductAddNewProps) => {
    try {
      console.log(formAddNew)
      const productResult = await productService.createItem(
        {
          productCode: formAddNew.productCode,
          quantityPO: formAddNew.quantityPO,
          dateInputNPL: formAddNew.dateInputNPL,
          dateOutputFCR: formAddNew.dateOutputFCR
        },
        table.setLoading
      )
      if (!productResult.success) throw new Error(define('create_failed'))

      const productNew = productResult.data as Product
      let dataSourceItem: ProductTableDataType = { ...productNew, key: `${productNew.id}` } as ProductTableDataType

      if (isValidNumber(formAddNew.colorID)) {
        console.log('Product color created')
        await productColorService.createItemSync(
          { productID: productNew.id!, colorID: formAddNew.colorID },
          table.setLoading,
          (meta) => {
            if (!meta?.success) throw new Error(define('create_failed'))
            dataSourceItem = { ...dataSourceItem, productColor: meta.data as ProductColor }
          }
        )
      }

      if (isValidNumber(formAddNew.groupID)) {
        console.log('Product group created')
        await productGroupService.createItemSync(
          { productID: productNew.id!, groupID: formAddNew.groupID },
          table.setLoading,
          (meta) => {
            if (!meta?.success) throw new Error(define('create_failed'))
            dataSourceItem = { ...dataSourceItem, productGroup: meta.data as ProductGroup }
          }
        )
      }
      if (isValidNumber(formAddNew.printID)) {
        console.log('Product print created')
        await printablePlaceService.createItemSync(
          { productID: productNew.id!, printID: formAddNew.printID },
          table.setLoading,
          (meta) => {
            if (!meta?.success) throw new Error(define('create_failed'))
            dataSourceItem = { ...dataSourceItem, printablePlace: meta.data as PrintablePlace }
          }
        )
      }
      table.handleAddNew(dataSourceItem)
      message.success(define('created_success'))
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setOpenModal(false)
      table.setLoading(false)
    }
  }

  const handleDelete = async (record: ProductTableDataType) => {
    // try {
    //   table.setLoading(true)
    //   await productService.updateItemByPk(item.id!, { status: 'deleted' }, table.setLoading, (meta, msg) => {
    //     if (meta) {
    //       if (meta.success) {
    //         handleDeleting(item.id!)
    //         message.success('Deleted!')
    //       }
    //     } else {
    //       message.error(msg)
    //     }
    //     onDataSuccess?.(meta)
    //   })
    // } catch (error: any) {
    //   const resError: ResponseDataType = error.data
    //   message.error(`${resError.message}`)
    // } finally {
    //   table.setLoading(false)
    // }
  }

  const handleDeleteForever = async (id?: number) => {
    // try {
    //   table.setLoading(true)
    //   await productService.deleteItemByPk(id, table.setLoading, (meta, msg) => {
    //     if (meta) {
    //       if (meta.success) {
    //         handleDeleting(id)
    //         message.success('Deleted!')
    //       }
    //     } else {
    //       message.error(msg)
    //     }
    //     onDataSuccess?.(meta)
    //   })
    // } catch (error: any) {
    //   const resError: ResponseDataType = error.data
    //   message.error(`${resError.message}`)
    // } finally {
    //   table.setLoading(false)
    // }
  }

  const handleRestore = async (record: ProductTableDataType) => {
    // try {
    //   table.setLoading(true)
    //   await productService.updateItemByPk(
    //     item.id!,
    //     {
    //       status: 'active'
    //     },
    //     table.setLoading,
    //     (meta) => {
    //       if (!meta?.success) throw new Error('API update Product failed')
    //       onDataSuccess?.(meta)
    //       message.success('Restored!')
    //     }
    //   )
    // } catch (error: any) {
    //   const resError: ResponseDataType = error.data
    //   message.error(`${resError.message}`)
    // } finally {
    //   loadData()
    //   table.setLoading(false)
    // }
  }

  const handlePageChange = async (page: number, pageSize: number) => {
    // try {
    //   table.setLoading(true)
    //   await productService.pageChange(
    //     _page,
    //     table.setLoading,
    //     (meta) => {
    //       if (!meta?.success) throw new Error(`${meta.message}`)
    //       selfConvertDataSource(meta?.data as Product[])
    //     },
    //     { field: 'productCode', term: searchText }
    //   )
    // } catch (error: any) {
    //   const resError: ResponseDataType = error.data
    //   message.error(`${resError.message}`)
    // } finally {
    //   table.setLoading(false)
    // }
  }

  const handleSortChange = async (checked: boolean) => {
    // try {
    //   table.setLoading(true)
    //   await productService.sortedListItems(
    //     checked ? 'asc' : 'desc',
    //     table.setLoading,
    //     (meta) => {
    //       if (meta?.success) {
    //         selfConvertDataSource(meta?.data as Product[])
    //       }
    //     },
    //     { field: 'productCode', term: searchText }
    //   )
    // } catch (error: any) {
    //   const resError: ResponseDataType = error.data
    //   message.error(`${resError.message}`)
    // } finally {
    //   table.setLoading(false)
    // }
  }

  const handleSearch = async (value: string) => {
    // try {
    //   table.setLoading(true)
    //   if (value.length > 0) {
    //     await productService.getItemsSync(
    //       {
    //         ...defaultRequestBody,
    //         search: {
    //           field: 'productCode',
    //           term: value
    //         }
    //       },
    //       table.setLoading,
    //       (meta) => {
    //         if (meta?.success) {
    //           selfConvertDataSource(meta?.data as Product[])
    //         }
    //       }
    //     )
    //   }
    // } catch (error: any) {
    //   const resError: ResponseDataType = error.data
    //   message.error(`${resError.message}`)
    // } finally {
    //   table.setLoading(false)
    // }
  }

  return {
    state: {
      showDeleted,
      setShowDeleted,
      searchText,
      setSearchText,
      openModal,
      newRecord,
      setNewRecord,
      setOpenModal,
      prints,
      colors,
      groups,
      products,
      productColors,
      productGroups,
      printablePlaces
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
      handleSortChange,
      handleSearch,
      handleAddNew,
      handlePageChange,
      handleDelete,
      handleDeleteForever,
      handleRestore
    },
    table
  }
}
