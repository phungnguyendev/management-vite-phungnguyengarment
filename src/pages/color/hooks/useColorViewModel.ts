import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Paginator } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import useTable from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Color } from '~/typing'
import { textComparator } from '~/utils/helpers'
import { ColorAddNewProps } from '../components/ModalAddNewColor'
import { ColorTableDataType } from '../type'

export default function useColorViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<ColorTableDataType>([])

  const colorService = useAPIService<Color>(ColorAPI)

  // State
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchTextChange, setSearchTextChange] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<any>({})
  const [paginator, setPaginator] = useState<Paginator>({
    page: 1,
    pageSize: -1
  })
  const [shorted, setSorted] = useState<boolean>(false)

  console.log('loadViewModel')

  useEffect(() => {
    loadData()
  }, [showDeleted, shorted, paginator, searchText])

  const loadData = useCallback(async () => {
    try {
      console.log('loadData')
      table.setLoading(true)
      await colorService.getItemsSync(
        {
          paginator: paginator,
          sorting: { column: 'id', direction: shorted ? 'asc' : 'desc' },
          filter: { field: 'id', items: [-1], status: showDeleted ? 'deleted' : 'active' },
          search: { field: 'name', term: searchText }
        },
        table.setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(`${meta.message}`)
          const colors = meta.data as Color[]
          console.log(colors.length)
          table.setDataSource(
            colors.map((item) => {
              return {
                ...item,
                key: `${item.id}`
              }
            })
          )
        }
      )
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }, [showDeleted, paginator, shorted, searchText])

  const handleUpdate = async (record: ColorTableDataType) => {
    console.log('handleUpdate')
    // const row = (await form.validateFields()) as any
    try {
      if (textComparator(record.name, newRecord.name) || textComparator(record.hexColor, newRecord.hexColor)) {
        console.log('Color progressing...')
        await colorService.updateItemByPkSync(
          record.id!,
          { name: newRecord.name, hexColor: newRecord.hexColor },
          table.setLoading,
          (meta) => {
            if (!meta?.success) throw new Error(`${meta.message}`)
            const itemUpdated = meta.data as Color
            table.handleEditing(record.key, { ...itemUpdated, key: `${itemUpdated.id}` } as ColorTableDataType)
            message.success('Success!')
          }
        )
      }
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
      table.handleCancelEditing()
    }
  }

  const handleAddNew = async (formAddNew: ColorAddNewProps) => {
    try {
      console.log('handleAddNew')
      console.log(formAddNew)
      table.setLoading(true)
      await colorService.createItemSync(
        {
          name: formAddNew.name,
          hexColor: formAddNew.hexColor
        },
        table.setLoading,
        async (meta) => {
          if (!meta?.success) throw new Error(`${meta.message}`)
          const newColor = meta.data as Color
          table.handleAddNew({ ...newColor, key: `${newColor.id}` })
          message.success(meta.message)
        }
      )
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
      setOpenModal(false)
    }
  }

  const handleDelete = async (record: ColorTableDataType) => {
    console.log('handleDelete')
    try {
      await colorService.updateItemByPkSync(record.id!, { status: 'deleted' }, table.setLoading, (meta) => {
        if (!meta?.success) throw new Error(meta?.message)
        table.handleDeleting(record.key)
        message.success('Deleted!')
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleDeleteForever = async (id: number) => {
    try {
      await colorService.deleteItemSync(id, table.setLoading, (res) => {
        if (!res.success) throw new Error(res.message)
        table.handleDeleting(`${id}`)
        message.success(`${res.message}`)
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleRestore = async (record: ColorTableDataType) => {
    try {
      await colorService.updateItemByPkSync(record.id!, { status: 'active' }, table.setLoading, (meta) => {
        if (!meta?.success) throw new Error(meta?.message)
        table.handleDeleting(`${record.id!}`)
        message.success('Restored!')
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      loadData()
      table.setLoading(false)
    }
  }

  const handlePageChange = async (page: number, pageSize: number) => {
    setPaginator({ page, pageSize })
  }

  const handleSortChange = async (checked: boolean) => {
    setSorted(checked)
  }

  const handleSearch = async (value: string) => {
    setSearchText(value)
    console.log(value)
  }

  return {
    state: {
      showDeleted,
      setShowDeleted,
      searchTextChange,
      setSearchTextChange,
      openModal,
      loadData,
      newRecord,
      setNewRecord,
      setOpenModal
    },
    service: {
      colorService
    },
    action: {
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
