import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import SampleSewingAPI from '~/api/services/SampleSewingAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Product, ProductColor, SampleSewing } from '~/typing'
import { SampleSewingTableDataType } from '../type'

export default function useSampleSewing(table: UseTableProps<SampleSewingTableDataType>) {
  const { setLoading, showDeleted, setDataSource, handleConfirmCancelEditing } = table

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const sampleSewingService = useAPIService<SampleSewing>(SampleSewingAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<SampleSewing>({})

  // List
  const [products, setProducts] = useState<Product[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [sampleSewings, setSampleSewings] = useState<SampleSewing[]>([])

  // New
  const [sampleSewingNew, setSampleSewingNew] = useState<SampleSewing | undefined>(undefined)

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
          {
            ...defaultRequestBody,
            paginator: { page: 1, pageSize: -1 }
          },
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
        await sampleSewingService.getListItems(defaultRequestBody, setLoading, (meta, msg) => {
          if (!meta?.success) throw new Error(msg)
          setSampleSewings(meta.data as SampleSewing[])
        })
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
    selfConvertDataSource(products, productColors, sampleSewings)
  }, [products, productColors, sampleSewings])

  const selfConvertDataSource = (
    _products: Product[],
    _productColors?: ProductColor[],
    _sampleSewings?: SampleSewing[]
  ) => {
    const items = _products ? _products : products
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          key: item.id,
          productColor: (_productColors ? _productColors : productColors).find((i) => i.productID === item.id),
          sampleSewing: (_sampleSewings ? _sampleSewings : sampleSewings).find((i) => i.productID === item.id)
        } as SampleSewingTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<SampleSewingTableDataType>, newRecord: SampleSewing) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    try {
      setLoading(true)
      if (newRecord && record.sampleSewing) {
        console.log('SampleSewing progressing: ', newRecord)
        try {
          await sampleSewingService.updateItemByPk(
            newRecord.id!,
            {
              dateSubmissionNPL: newRecord.dateSubmissionNPL,
              dateApprovalPP: newRecord.dateApprovalPP,
              dateApprovalSO: newRecord.dateApprovalSO,
              dateSubmissionFirstTime: newRecord.dateSubmissionFirstTime,
              dateSubmissionSecondTime: newRecord.dateSubmissionSecondTime,
              dateSubmissionThirdTime: newRecord.dateSubmissionThirdTime,
              dateSubmissionForthTime: newRecord.dateSubmissionForthTime,
              dateSubmissionFifthTime: newRecord.dateSubmissionFifthTime
            },
            setLoading,
            (meta, msg) => {
              if (!meta?.success) throw new Error(msg)
            }
          )
        } catch (error: any) {
          const resError: ResponseDataType = error
          throw resError
        }
      } else {
        console.log('add new')
        try {
          await sampleSewingService.createNewItem(
            { ...newRecord, productID: record.id },
            table.setLoading,
            (meta, msg) => {
              if (!meta?.success) throw new Error(msg)
            }
          )
        } catch (error: any) {
          const resError: ResponseDataType = error
          throw resError
        }
      }
      message.success('Success!')
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      handleConfirmCancelEditing()
      loadData()
      setLoading(false)
    }
  }

  const handleAddNewItem = async (formAddNew: any) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await sampleSewingService.createNewItem(
        {
          productID: formAddNew.productID,
          dateSubmissionNPL: formAddNew.dateSubmissionNPL,
          dateApprovalPP: formAddNew.dateApprovalPP,
          dateApprovalSO: formAddNew.dateApprovalSO,
          dateSubmissionFirstTime: formAddNew.dateSubmissionFirstTime,
          dateSubmissionSecondTime: formAddNew.dateSubmissionSecondTime,
          dateSubmissionThirdTime: formAddNew.dateSubmissionThirdTime,
          dateSubmissionForthTime: formAddNew.dateSubmissionForthTime,
          dateSubmissionFifthTime: formAddNew.dateSubmissionFifthTime
        },
        setLoading,
        async (meta, msg) => {
          if (!meta?.success) throw new Error(`${msg}`)
          setSampleSewingNew(meta.data as SampleSewing)
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
    record: TableItemWithKey<SampleSewingTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      setLoading(true)
      if (record.sampleSewing) {
        await sampleSewingService.deleteItemByPk(record.sampleSewing.id!, setLoading, (meta, msg) => {
          if (!meta?.success) throw new Error(msg)

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
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    selfConvertDataSource,
    handlePageChange,
    handleSortChange,
    handleResetClick,
    handleSearch,
    productService,
    sampleSewingService
  }
}
