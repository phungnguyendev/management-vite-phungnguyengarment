import { App } from 'antd'
import React, { useEffect, useState } from 'react'
import CutGroupEmbroideringAPI from '~/api/services/CutGroupEmbroideringAPI'
import useTable, { UseTableProps } from '~/components/hooks/useTable'
import define from '~/constants'
import useAPIService from '~/hooks/useAPIService'
import { CutGroupEmbroidering } from '~/typing'
import { CutGroupEmbroideringNewRecordProps, CutGroupEmbroideringTableDataType } from '../type'

export interface CutGroupExpandableViewModelProps {
  table: UseTableProps<CutGroupEmbroideringTableDataType>
  openModal: boolean
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>
  newRecord: CutGroupEmbroideringNewRecordProps
  setNewRecord: React.Dispatch<React.SetStateAction<CutGroupEmbroideringNewRecordProps>>
  handleAddNew: (recordAddNews: CutGroupEmbroideringNewRecordProps) => void
  handleUpdate: (record: CutGroupEmbroideringTableDataType) => void
  handleDelete: (record: CutGroupEmbroideringTableDataType) => void
}

export default function useCutGroupExpandableViewModel(): CutGroupExpandableViewModelProps {
  const { message } = App.useApp()
  const table = useTable<CutGroupEmbroideringTableDataType>([])

  const service = useAPIService<CutGroupEmbroidering>(CutGroupEmbroideringAPI)

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [newRecord, setNewRecord] = useState<CutGroupEmbroideringNewRecordProps>({})

  useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    try {
      await service.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, table.setLoading, (res) => {
        if (!res.success) throw Error(define('dataLoad_failed'))
        const newCutGroupEmbroideries = res.data as CutGroupEmbroidering[]

        dataMapped(newCutGroupEmbroideries)
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const dataMapped = (cutGroupEmbroideries: CutGroupEmbroidering[]) => {
    table.setDataSource(
      cutGroupEmbroideries.map((item) => {
        return {
          ...item,
          key: `${item.id}`
        }
      })
    )
  }

  const handleAddNew = async (recordAddNews: CutGroupEmbroideringNewRecordProps) => {
    try {
      await service.createItemSync(
        { ...recordAddNews, cuttingGroupID: newRecord.cuttingGroupID },
        table.setLoading,
        (res) => {
          if (!res.success) throw new Error(define('create_failed'))
          const newItem = res.data as CutGroupEmbroidering
          table.handleAddNew({ key: `${newItem.id}`, ...newItem })
          message.success(define('created_success'))
        }
      )
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleUpdate = async (record: CutGroupEmbroideringTableDataType) => {
    try {
      await service.updateItemByPkSync(
        record.id!,
        {
          quantityArrived: newRecord.quantityArrived,
          dateArrived: newRecord.dateArrived
        },
        table.setLoading,
        (res) => {
          if (!res.success) throw Error(define('dataLoad_failed'))
          const newCutGroupEmbroideries = res.data as CutGroupEmbroidering[]

          dataMapped(newCutGroupEmbroideries)
        }
      )
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleDelete = async (record: CutGroupEmbroideringTableDataType) => {
    try {
      await service.deleteItemSync(record.id!, table.setLoading, (res) => {
        if (!res.success) throw Error(define('delete_failed'))
        // const newCutGroupEmbroideries = res.data as CutGroupEmbroidering[]

        table.handleDeleting(record.key)
      })
      message.success(define('deleted_success'))
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  return {
    table,
    openModal,
    setOpenModal,
    newRecord,
    setNewRecord,
    handleAddNew,
    handleUpdate,
    handleDelete
  }
}
