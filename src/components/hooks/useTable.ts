import React, { useState } from 'react'
import { ResponseDataType } from '~/api/client'

export type TableItemWithKey<T> = T & { key?: React.Key }
export type TableItemWithId<T> = T & { id?: number }

export interface UseTableProps<T extends { key?: React.Key }> {
  loading: boolean
  setLoading: (state: boolean) => void
  scrollIndex: number
  setScrollIndex: (index: number) => void
  editingKey: React.Key
  setEditingKey: (key: React.Key) => void
  setDeletingKey: (key: React.Key) => void
  deletingKey: React.Key
  showDeleted: boolean
  setDeletedRecordState: (enable: boolean) => void
  dataSource: TableItemWithKey<T>[]
  setDataSource: (newDataSource: TableItemWithKey<T>[]) => void
  isEditing: (key?: React.Key) => boolean
  isDelete: (key?: React.Key) => boolean
  handleStartEditing: (key: React.Key) => void
  handleStartDeleting: (key: React.Key) => void
  handleStartRestore: (key: React.Key) => void
  handleStartSaveEditing: (key: React.Key, itemToUpdate: T, onDataSuccess?: (updatedItem: T) => void) => void
  handleStartAddNew: (item: TableItemWithKey<T>) => void
  handleConfirmDeleting: (key: React.Key, onDataSuccess?: (deletedItem: TableItemWithKey<T>) => void) => void
  handleConfirmRestore: (key: React.Key, onDataSuccess?: (deletedItem: TableItemWithKey<T>) => void) => void
  handleConfirmCancelEditing: () => void
  handleConfirmCancelDeleting: () => void
  handleConfirmCancelRestore: () => void
  handleConvertDataSource: (meta: ResponseDataType) => void
}

export default function useTable<T extends { key?: React.Key }>(initValue: TableItemWithKey<T>[]): UseTableProps<T> {
  const [scrollIndex, setScrollIndex] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<TableItemWithKey<T>[]>(initValue)
  const [editingKey, setEditingKey] = useState<React.Key>('')
  const [deletingKey, setDeletingKey] = useState<React.Key>('')
  const [showDeleted, setDeletedRecordState] = useState<boolean>(false)
  const isEditing = (key?: React.Key) => key === editingKey
  const isDelete = (key?: React.Key) => key === deletingKey

  const handleConvertDataSource = (meta: ResponseDataType) => {
    setLoading(true)
    const items = meta.data as TableItemWithId<T>[]
    setDataSource(
      items.map((item: TableItemWithId<T>) => {
        return {
          ...item,
          key: item.id
        } as TableItemWithKey<T>
      })
    )
    setLoading(false)
  }

  const handleStartEditing = (key: React.Key) => {
    setEditingKey(key)
  }

  const handleStartDeleting = (key: React.Key) => {
    setDeletingKey(key)
  }

  const handleStartRestore = (key: React.Key) => {
    setDeletingKey(key)
  }

  const handleConfirmDeleting = (key: React.Key, onDataSuccess?: (deletedItem: TableItemWithKey<T>) => void) => {
    setLoading(true)
    const itemFound = dataSource.find((item) => item.key === key)
    if (itemFound) {
      const dataSourceRemovedItem = dataSource.filter((item) => item.key !== key)
      setDataSource(dataSourceRemovedItem)
      onDataSuccess?.(itemFound)
    }
    setLoading(false)
  }

  const handleConfirmRestore = (key: React.Key, onDataSuccess?: (deletedItem: TableItemWithKey<T>) => void) => {
    setLoading(true)
    const itemFound = dataSource.find((item) => item.key === key)
    if (itemFound) {
      const dataSourceRemovedItem = dataSource.filter((item) => item.key !== key)
      setDataSource(dataSourceRemovedItem)
      onDataSuccess?.(itemFound)
    }
    setLoading(false)
  }

  const handleConfirmCancelEditing = () => {
    setEditingKey('')
  }

  const handleConfirmCancelDeleting = () => {
    setDeletingKey('')
  }

  const handleConfirmCancelRestore = () => {
    setDeletingKey('')
  }

  const handleStartSaveEditing = async (key: React.Key, itemToUpdate: T, onDataSuccess?: (updatedItem: T) => void) => {
    try {
      setLoading(true)
      const newData = [...dataSource]
      const index = newData.findIndex((item) => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...itemToUpdate
        })
        setDataSource(newData)
        setEditingKey('')
        onDataSuccess?.(itemToUpdate)
        // After updated local data
        // We need to update on database
      } else {
        newData.push(itemToUpdate)
        setDataSource(newData)
        setEditingKey('')
        onDataSuccess?.(itemToUpdate)
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    } finally {
      setLoading(false)
    }
  }

  const handleStartAddNew = (item: TableItemWithKey<T>) => {
    const newDataSource = [...dataSource]
    newDataSource.unshift({
      ...item,
      key: item.key
    } as TableItemWithKey<T>)
    setDataSource(newDataSource)
  }

  return {
    loading,
    setLoading,
    showDeleted,
    setDeletedRecordState,
    isDelete,
    isEditing,
    editingKey,
    deletingKey,
    setEditingKey,
    setDeletingKey,
    scrollIndex,
    setScrollIndex,
    dataSource,
    setDataSource,
    handleStartAddNew,
    handleStartEditing,
    handleStartDeleting,
    handleStartRestore,
    handleStartSaveEditing,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting,
    handleConfirmCancelRestore,
    handleConfirmDeleting,
    handleConfirmRestore,
    handleConvertDataSource
  }
}
