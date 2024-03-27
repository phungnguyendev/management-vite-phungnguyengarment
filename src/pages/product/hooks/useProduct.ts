import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import GroupAPI from '~/api/services/GroupAPI'
import PrintAPI from '~/api/services/PrintAPI'
import PrintablePlaceAPI from '~/api/services/PrintablePlaceAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import ProductGroupAPI from '~/api/services/ProductGroupAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { ProductTableDataType } from '~/pages/product/type'
import { Color, Group, Print, PrintablePlace, Product, ProductColor, ProductGroup } from '~/typing'
import { dateComparator, dateValidatorChange, numberComparator, textComparator } from '~/utils/helpers'
import { ProductAddNewProps } from '../components/ModalAddNewProduct'

export interface ProductNewRecordProps {
  colorID?: number | null
  quantityPO?: number | null
  productCode?: string | null
  dateInputNPL?: string | null
  dateOutputFCR?: string | null
  groupID?: number | null
  printID?: number | null
}

export default function useProduct(table: UseTableProps<ProductTableDataType>) {
  const { showDeleted, setLoading, setDataSource, handleConfirmCancelEditing, handleConfirmDeleting } = table

  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const productGroupService = useAPIService<ProductGroup>(ProductGroupAPI)
  const printablePlaceService = useAPIService<PrintablePlace>(PrintablePlaceAPI)
  const colorService = useAPIService<Color>(ColorAPI)
  const groupService = useAPIService<Group>(GroupAPI)
  const printService = useAPIService<Group>(PrintAPI)

  const { message } = AntApp.useApp()

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<ProductNewRecordProps>({})

  const [products, setProducts] = useState<Product[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [printablePlaces, setPrintablePlaces] = useState<PrintablePlace[]>([])

  const [colors, setColors] = useState<Color[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [prints, setPrints] = useState<Print[]>([])

  useEffect(() => {
    if (table.editingKey !== '') {
      colorService.getListItems({ ...defaultRequestBody, paginator: { page: 1, pageSize: -1 } }, setLoading, (meta) => {
        if (meta?.success) {
          setColors(meta.data as Color[])
        }
      })
      groupService.getListItems({ ...defaultRequestBody, paginator: { page: 1, pageSize: -1 } }, setLoading, (meta) => {
        if (meta?.success) {
          setGroups(meta.data as Group[])
        }
      })
      printService.getListItems({ ...defaultRequestBody, paginator: { page: 1, pageSize: -1 } }, setLoading, (meta) => {
        if (meta?.success) {
          setPrints(meta.data as Print[])
        }
      })
    }
  }, [table.editingKey])

  const loadData = async () => {
    try {
      setLoading(true)
      try {
        await productService.getListItems(
          {
            ...defaultRequestBody,
            paginator: { page: productService.page, pageSize: defaultRequestBody.paginator?.pageSize },
            filter: { ...defaultRequestBody.filter, status: showDeleted ? 'deleted' : 'active' }
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              setProducts(meta.data as Product[])
            }
          }
        )
      } catch (error: any) {
        const resError: ResponseDataType = error
        throw resError
      }

      try {
        await productColorService.getListItems(
          { ...defaultRequestBody, paginator: { page: 1, pageSize: -1 } },
          setLoading,
          (meta) => {
            if (meta?.success) {
              setProductColors(meta.data as ProductColor[])
            }
          }
        )
      } catch (error: any) {
        const resError: ResponseDataType = error
        throw resError
      }

      try {
        await productGroupService.getListItems(
          { ...defaultRequestBody, paginator: { page: 1, pageSize: -1 } },
          setLoading,
          (meta) => {
            if (meta?.success) {
              setProductGroups(meta.data as ProductGroup[])
            }
          }
        )
      } catch (error: any) {
        const resError: ResponseDataType = error
        throw resError
      }

      try {
        await printablePlaceService.getListItems(
          { ...defaultRequestBody, paginator: { page: 1, pageSize: -1 } },
          setLoading,
          (meta) => {
            if (meta?.success) {
              setPrintablePlaces(meta.data as PrintablePlace[])
            }
          }
        )
      } catch (error: any) {
        const resError: ResponseDataType = error
        throw resError
      }
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [showDeleted])

  useEffect(() => {
    selfConvertDataSource(products, productColors, productGroups, printablePlaces)
  }, [products, productColors, productGroups, printablePlaces])

  const selfConvertDataSource = (
    _products: Product[],
    _productColors?: ProductColor[],
    _productGroups?: ProductGroup[],
    _printablePlaces?: PrintablePlace[]
  ) => {
    const items = _products ? _products : products
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          productColor: (_productColors ? _productColors : productColors).find((i) => i.productID === item.id),
          productGroup: (_productGroups ? _productGroups : productGroups).find((i) => i.productID === item.id),
          printablePlace: (_printablePlaces ? _printablePlaces : printablePlaces).find((i) => i.productID === item.id),
          key: item.id
        } as ProductTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<ProductTableDataType>) => {
    // const row = (await form.validateFields()) as any
    try {
      setLoading(true)
      if (newRecord) {
        console.log({ old: record, new: newRecord })
        if (
          textComparator(newRecord.productCode, record.productCode) ||
          numberComparator(newRecord.quantityPO, record.quantityPO) ||
          dateComparator(newRecord.dateInputNPL, record.dateInputNPL) ||
          dateComparator(newRecord.dateOutputFCR, record.dateOutputFCR)
        ) {
          console.log('Product progressing...')
          try {
            await productService.updateItemByPk(
              record.id!,
              {
                productCode: newRecord.productCode,
                quantityPO: newRecord.quantityPO,
                dateInputNPL: newRecord.dateInputNPL,
                dateOutputFCR: newRecord.dateOutputFCR
              },
              setLoading,
              (meta) => {
                if (!meta?.success) throw new Error('API update Product failed')
              }
            )
          } catch (error: any) {
            const resError: ResponseDataType = error
            throw resError
          }
        }
        if (
          (newRecord.colorID && !record.productColor?.colorID) ||
          numberComparator(newRecord.colorID, record.productColor?.colorID)
        ) {
          console.log('Product color progressing...')
          try {
            await productColorService.createOrUpdateItemBy(
              { field: 'productID', key: record.key! },
              { colorID: newRecord.colorID },
              setLoading,
              (meta) => {
                if (!meta?.success) throw new Error('API update ProductColor failed')
              }
            )
          } catch (error: any) {
            const resError: ResponseDataType = error
            throw resError
          }
        }
        if (
          (newRecord.groupID && !record.productGroup?.groupID) ||
          numberComparator(newRecord.groupID, record.productGroup?.groupID)
        ) {
          console.log('ProductGroup progressing...')
          try {
            await productGroupService.createOrUpdateItemBy(
              { field: 'productID', key: record.key! },
              { groupID: newRecord.groupID },
              setLoading,
              (meta) => {
                if (!meta?.success) throw new Error('API update ProductGroup failed')
              }
            )
          } catch (error: any) {
            const resError: ResponseDataType = error
            throw resError
          }
        }
        if (
          (newRecord.printID && !record.printablePlace?.printID) ||
          numberComparator(newRecord.printID, record.printablePlace?.printID)
        ) {
          console.log('PrintablePlace progressing...')
          try {
            await printablePlaceService.createOrUpdateItemBy(
              { field: 'productID', key: record.key! },
              { printID: newRecord.printID },
              setLoading,
              (meta) => {
                if (!meta?.success) throw new Error('API update PrintablePlace failed')
              }
            )
          } catch (error: any) {
            const resError: ResponseDataType = error
            throw resError
          }
        }
        message.success('Success!')
      }
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      handleConfirmCancelEditing()
      loadData()
      setLoading(false)
    }
  }

  const handleAddNewItem = async (formAddNew: ProductAddNewProps) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await productService.createNewItem(
        {
          productCode: formAddNew.productCode,
          quantityPO: formAddNew.quantityPO,
          dateInputNPL: dateValidatorChange(formAddNew.dateInputNPL),
          dateOutputFCR: dateValidatorChange(formAddNew.dateOutputFCR)
        },
        setLoading,
        async (meta) => {
          if (!meta?.success) throw new Error('Create new product item failed!')
          const productNew = meta.data as Product
          if (formAddNew.colorID) {
            console.log('Product color created')
            try {
              await productColorService.createNewItem(
                { productID: productNew.id!, colorID: formAddNew.colorID },
                setLoading,
                (meta) => {
                  if (!meta?.success) {
                    throw new Error('Create new color item failed!')
                  }
                }
              )
            } catch (error: any) {
              const resError: ResponseDataType = error
              throw resError
            }
          }
          if (formAddNew.groupID) {
            console.log('Product group created')
            try {
              await productGroupService.createNewItem(
                { productID: productNew.id!, groupID: formAddNew.groupID },
                setLoading,
                (meta) => {
                  if (!meta?.success) {
                    throw new Error('Create new group item failed!')
                  }
                }
              )
            } catch (error: any) {
              const resError: ResponseDataType = error
              throw resError
            }
          }
          if (formAddNew.printID) {
            console.log('Product print created')
            try {
              await printablePlaceService.createNewItem(
                { productID: productNew.id!, printID: formAddNew.printID },
                setLoading,
                (meta) => {
                  if (!meta?.success) {
                    throw new Error('Create new print item failed!')
                  }
                }
              )
            } catch (error: any) {
              const resError: ResponseDataType = error
              throw resError
            }
          }
        }
      )
      message.success('Success')
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setOpenModal(false)
      loadData()
      setLoading(false)
    }
  }

  const handleConfirmDelete = async (
    item: TableItemWithKey<ProductTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      setLoading(true)
      await productService.updateItemByPk(item.id!, { status: 'deleted' }, setLoading, (meta, msg) => {
        if (meta) {
          if (meta.success) {
            handleConfirmDeleting(item.id!)
            message.success('Deleted!')
          }
        } else {
          message.error(msg)
        }
        onDataSuccess?.(meta)
      })
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmRestore = async (
    item: TableItemWithKey<ProductTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      setLoading(true)
      await productService.updateItemByPk(
        item.id!,
        {
          status: 'active'
        },
        setLoading,
        (meta) => {
          if (!meta?.success) throw new Error('API update Product failed')
          onDataSuccess?.(meta)
          message.success('Restored!')
        }
      )
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      loadData()
      setLoading(false)
    }
  }

  const handlePageChange = async (_page: number) => {
    try {
      setLoading(true)
      await productService.pageChange(
        _page,
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as Product[])
          }
        },
        { field: 'productCode', term: searchText }
      )
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleResetClick = async () => {
    setSearchText('')
    loadData()
  }

  const handleSortChange = async (checked: boolean) => {
    try {
      setLoading(true)
      await productService.sortedListItems(
        checked ? 'asc' : 'desc',
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as Product[])
          }
        },
        { field: 'productCode', term: searchText }
      )
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (value: string) => {
    try {
      setLoading(true)
      if (value.length > 0) {
        await productService.getListItems(
          {
            ...defaultRequestBody,
            search: {
              field: 'productCode',
              term: value
            }
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              selfConvertDataSource(meta?.data as Product[])
            }
          }
        )
      }
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  return {
    searchText,
    setSearchText,
    openModal,
    loadData,
    newRecord,
    setNewRecord,
    setLoading,
    setOpenModal,
    setDataSource,
    productService,
    handleSaveClick,
    handleResetClick,
    handleSortChange,
    handleSearch,
    handleAddNewItem,
    handlePageChange,
    productColorService,
    productGroupService,
    handleConfirmDelete,
    handleConfirmRestore,
    printablePlaceService,
    selfConvertDataSource,
    handleConfirmCancelEditing,
    prints,
    colors,
    groups,
    products
  }
}
