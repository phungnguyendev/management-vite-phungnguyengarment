import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import CuttingGroupAPI from '~/api/services/CuttingGroupAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { CuttingGroup, Product, ProductColor } from '~/typing'
import { dateValidator, numberValidator } from '~/utils/helpers'
import { CuttingGroupNewRecordProps, CuttingGroupTableDataType } from '../type'

export default function useCuttingGroup(table: UseTableProps<CuttingGroupTableDataType>) {
  const { setLoading, showDeleted, setDataSource, handleConfirmCancelEditing } = table

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const cuttingGroupService = useAPIService<CuttingGroup>(CuttingGroupAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<CuttingGroupNewRecordProps>({
    quantityRealCut: null,
    timeCut: null,
    dateSendEmbroidered: null,
    quantityDeliveredBTP: null,
    productColorID: null,
    cuttingGroupID: null,
    syncStatus: null,
    quantityArrived1Th: null,
    dateArrived1Th: null,
    quantityArrived2Th: null,
    dateArrived2Th: null,
    quantityArrived3Th: null,
    dateArrived3Th: null,
    quantityArrived4Th: null,
    dateArrived4Th: null,
    quantityArrived5Th: null,
    dateArrived5Th: null
  })

  // List
  const [products, setProducts] = useState<Product[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [cuttingGroups, setCuttingGroups] = useState<CuttingGroup[]>([])

  // New
  const [sampleSewingNew, setCuttingGroupNew] = useState<CuttingGroup | undefined>(undefined)

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
        await cuttingGroupService.getListItems(
          { ...defaultRequestBody, paginator: { page: 1, pageSize: -1 } },
          setLoading,
          (meta) => {
            if (meta?.success) {
              setCuttingGroups(meta.data as CuttingGroup[])
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
  }, [sampleSewingNew, showDeleted])

  useEffect(() => {
    selfConvertDataSource(products, productColors, cuttingGroups)
  }, [products, productColors, cuttingGroups])

  const selfConvertDataSource = (
    _products: Product[],
    _productColors?: ProductColor[],
    _cuttingGroups?: CuttingGroup[]
  ) => {
    const items = _products ? _products : products
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          key: item.id,
          productColor: (_productColors ? _productColors : productColors).find((i) => i.productID === item.id),
          cuttingGroup: (_cuttingGroups ? _cuttingGroups : cuttingGroups).find((i) => i.productID === item.id)
        } as CuttingGroupTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<CuttingGroupTableDataType>) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    try {
      setLoading(true)
      if (newRecord) {
        if (newRecord.quantityRealCut && !numberValidator(newRecord.quantityRealCut))
          throw new Error('Quantity must be than zero!')

        if (newRecord.timeCut && !dateValidator(newRecord.timeCut)) throw new Error('Invalid time cut!')

        if (newRecord.dateSendEmbroidered && !dateValidator(newRecord.dateSendEmbroidered))
          throw new Error('Invalid date send embroidered!')

        if (newRecord.quantityDeliveredBTP && !numberValidator(newRecord.quantityDeliveredBTP))
          throw new Error('Invalid quantity delivery BTP!')

        if (newRecord.quantityArrived1Th && !numberValidator(newRecord.quantityArrived1Th))
          throw new Error('Invalid 1!')

        if (newRecord.quantityArrived2Th && !numberValidator(newRecord.quantityArrived2Th))
          throw new Error('Invalid 2!')

        if (newRecord.quantityArrived3Th && !numberValidator(newRecord.quantityArrived3Th))
          throw new Error('Invalid 3!')

        if (newRecord.quantityArrived4Th && !numberValidator(newRecord.quantityArrived4Th))
          throw new Error('Invalid 4!')

        if (newRecord.quantityArrived5Th && !numberValidator(newRecord.quantityArrived5Th))
          throw new Error('Invalid 5!')

        if (newRecord.quantityArrived6Th && !numberValidator(newRecord.quantityArrived6Th))
          throw new Error('Invalid 6!')

        if (newRecord.quantityArrived7Th && !numberValidator(newRecord.quantityArrived7Th))
          throw new Error('Invalid 7!')

        if (newRecord.quantityArrived8Th && !numberValidator(newRecord.quantityArrived8Th))
          throw new Error('Invalid 8!')

        if (newRecord.quantityArrived9Th && !numberValidator(newRecord.quantityArrived9Th))
          throw new Error('Invalid 9!')

        if (newRecord.quantityArrived10Th && !numberValidator(newRecord.quantityArrived10Th))
          throw new Error('Invalid 10!')

        if (
          !record.cuttingGroup &&
          (newRecord.quantityRealCut ||
            newRecord.timeCut ||
            newRecord.dateSendEmbroidered ||
            newRecord.quantityDeliveredBTP ||
            newRecord.quantityArrived1Th ||
            newRecord.quantityArrived2Th ||
            newRecord.quantityArrived3Th ||
            newRecord.quantityArrived4Th ||
            newRecord.quantityArrived5Th ||
            newRecord.quantityArrived6Th ||
            newRecord.quantityArrived7Th ||
            newRecord.quantityArrived8Th ||
            newRecord.quantityArrived9Th ||
            newRecord.quantityArrived10Th)
        ) {
          console.log('add new')
          try {
            await cuttingGroupService.createNewItem({ ...newRecord, productID: record.id }, setLoading, (meta) => {
              if (!meta?.success) throw new Error('API create group failed')
            })
          } catch (error: any) {
            const resError: ResponseDataType = error
            throw resError
          }
        }
        if (record.cuttingGroup) {
          console.log('CuttingGroup progressing: ', newRecord)
          try {
            await cuttingGroupService.updateItemBy(
              { field: 'productID', key: record.key },
              {
                ...newRecord
              },
              setLoading,
              (meta) => {
                if (!meta?.success) throw new Error('API update group failed')
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
      loadData()
      handleConfirmCancelEditing()
      setLoading(false)
    }
  }

  const handleAddNewItem = async (formAddNew: any) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await cuttingGroupService.createNewItem(
        {
          productID: formAddNew.id,
          quantityRealCut: formAddNew.quantityRealCut,
          dateSendEmbroidered: formAddNew.dateSendEmbroidered,
          timeCut: formAddNew.timeCut,
          quantityArrivedEmbroidered: formAddNew.quantityArrivedEmbroidered,
          quantityDeliveredBTP: formAddNew.quantityDeliveredBTP
        },
        setLoading,
        async (meta, msg) => {
          if (!meta?.success) throw new Error(`${meta?.message}`)
          setCuttingGroupNew(meta.data as CuttingGroup)
          message.success(msg)
        }
      )
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setOpenModal(false)
      setLoading(false)
    }
  }

  const handleConfirmDelete = async (
    record: TableItemWithKey<CuttingGroupTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      setLoading(true)
      if (record.cuttingGroup) {
        await cuttingGroupService.deleteItemByPk(record.cuttingGroup.id!, setLoading, (meta, msg) => {
          if (!meta?.success) throw new Error('API delete failed')
          message.success(msg)
          onDataSuccess?.(meta)
        })
      }
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      loadData()
      setLoading(false)
      setOpenModal(false)
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSortChange = async (checked: boolean, _event: React.MouseEvent<HTMLButtonElement>) => {
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
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    selfConvertDataSource,
    handlePageChange,
    handleSortChange,
    handleResetClick,
    handleSearch,
    productService,
    cuttingGroupService
  }
}
