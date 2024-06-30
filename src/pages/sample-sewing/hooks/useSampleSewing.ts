import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Paginator } from '~/api/client'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import SampleSewingAPI from '~/api/services/SampleSewingAPI'
import useTable from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Product, ProductColor, SampleSewing } from '~/typing'
import { SampleSewingAddNewProps } from '../components/ModalAddNewSampleSewing'
import { SampleSewingTableDataType } from '../type'

export default function useSampleSewing() {
  const { message } = AntApp.useApp()
  const table = useTable<SampleSewingTableDataType>([])

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const sampleSewingService = useAPIService<SampleSewing>(SampleSewingAPI)

  // State changes
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [paginator, setPaginator] = useState<Paginator>({
    page: 1,
    pageSize: -1
  })
  const [shorted, setSorted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchTextChange, setSearchTextChange] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<SampleSewingAddNewProps>({})

  // List
  const [products, setProducts] = useState<Product[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [sampleSewings, setSampleSewings] = useState<SampleSewing[]>([])

  // New
  const [sampleSewingNew, setSampleSewingNew] = useState<SampleSewing | undefined>(undefined)

  useEffect(() => {
    loadData()
  }, [sampleSewingNew, showDeleted])

  useEffect(() => {
    mappedData()
  }, [products, productColors, sampleSewings])

  const mappedData = useCallback(() => {
    table.setDataSource(() => {
      const dataSource = products.map((self) => {
        return {
          ...self,
          key: `${self.id}`,
          productColor: productColors.find((item) => item.productID === item.id),
          sampleSewing: sampleSewings.find((item) => item.productID === item.id)
        } as SampleSewingTableDataType
      })
      return [...dataSource]
    })
  }, [products, productColors, sampleSewings])

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
          if (!meta?.success) throw new Error(meta.message)
          setProducts(meta.data as Product[])
        }
      )
      await productColorService.getItemsSync(
        {
          paginator: { page: 1, pageSize: -1 }
        },
        table.setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(meta.message)
          setProductColors(meta.data as ProductColor[])
        }
      )
      await sampleSewingService.getItemsSync(
        {
          paginator: { page: 1, pageSize: -1 }
        },
        table.setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(meta.message)
          setSampleSewings(meta.data as SampleSewing[])
        }
      )
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleUpdate = async (record: SampleSewingTableDataType) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    try {
      table.setLoading(true)
      if (newRecord && record.sampleSewing) {
        console.log('SampleSewing progressing: ', newRecord)
        await sampleSewingService.updateItemBySync(
          { productID: record.id },
          {
            ...newRecord
          },
          table.setLoading,
          (meta) => {
            if (!meta?.success) throw new Error(meta.message)
          }
        )
      } else {
        console.log('add new')
        await sampleSewingService.createItemSync({ ...newRecord, productID: record.id }, table.setLoading, (meta) => {
          if (!meta?.success) throw new Error(meta.message)
        })
      }
      message.success('Success!')
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.handleCancelEditing()
      table.setLoading(false)
    }
  }

  const handleAddNewItem = async (formAddNew: any) => {
    // try {
    //   console.log(formAddNew)
    //   table.setLoading(true)
    //   await sampleSewingService.createNewItem(
    //     {
    //       productID: formAddNew.productID,
    //       dateSubmissionNPL: formAddNew.dateSubmissionNPL,
    //       dateApprovalPP: formAddNew.dateApprovalPP,
    //       dateApprovalSO: formAddNew.dateApprovalSO,
    //       dateSubmissionFirstTime: formAddNew.dateSubmissionFirstTime,
    //       dateSubmissionSecondTime: formAddNew.dateSubmissionSecondTime,
    //       dateSubmissionThirdTime: formAddNew.dateSubmissionThirdTime,
    //       dateSubmissionForthTime: formAddNew.dateSubmissionForthTime,
    //       dateSubmissionFifthTime: formAddNew.dateSubmissionFifthTime
    //     },
    //     table.setLoading,
    //     async (meta, msg) => {
    //       if (!meta?.success) throw new Error(`${msg}`)
    //       setSampleSewingNew(meta.data as SampleSewing)
    //       message.success(msg)
    //     }
    //   )
    // } catch (error: any) {
    //   const resError: ResponseDataType = error.data
    //   message.error(`${resError.message}`)
    // } finally {
    //   setOpenModal(false)
    //   table.setLoading(false)
    // }
  }

  const handleDelete = async (record: SampleSewingTableDataType) => {
    // try {
    //   table.setLoading(true)
    //   if (record.sampleSewing) {
    //     await sampleSewingService.deleteItemByPk(record.sampleSewing.id!, table.setLoading, (meta, msg) => {
    //       if (!meta?.success) throw new Error(msg)
    //       message.success(msg)
    //       onDataSuccess?.(meta)
    //     })
    //   }
    // } catch (error: any) {
    //   const resError: ResponseDataType = error.data
    //   message.error(`${resError.message}`)
    // } finally {
    //   loadData()
    //   table.setLoading(false)
    //   setOpenModal(false)
    // }
  }

  const handleDeleteForever = async (id?: number) => {
    // console.log(id)
    // try {
    //   await accessoryNoteService.deleteItemSync(id, table.setLoading, (res) => {
    //     if (!res.success) throw new Error(res.message)
    //     table.handleDeleting(`${id}`)
    //     message.success(`${res.message}`)
    //   })
    // } catch (error: any) {
    //   message.error(`${error.message}`)
    // } finally {
    //   table.setLoading(false)
    // }
  }

  const handleRestore = async (record: SampleSewingTableDataType) => {
    // try {
    //   await accessoryNoteService.updateItemByPkSync(record.id!, { status: 'active' }, table.setLoading, (meta) => {
    //     if (!meta?.success) throw new Error(meta?.message)
    //     table.handleDeleting(`${record.id!}`)
    //     message.success('Restored!')
    //   })
    // } catch (error: any) {
    //   message.error(`${error.message}`)
    // } finally {
    //   loadData()
    //   table.setLoading(false)
    // }
  }

  const handlePageChange = async (_page: number) => {
    // try {
    //   table.setLoading(true)
    //   await productService.pageChange(
    //     _page,
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
