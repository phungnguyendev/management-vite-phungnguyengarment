import { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useState } from 'react'

type RequiredDataType = {
  key?: string
  createdAt?: string
  updatedAt?: string
  orderNumber?: number | null
}

interface Props<T extends RequiredDataType> {
  loading: boolean
  dataSource: T[]
  scrollIndex: number
  editingKey: string
  deletingKey: string
  setLoading: (state: boolean) => void
  setScrollIndex: (index: number) => void
  setEditingKey: (key: string) => void
  setDeletingKey: (key: string) => void
  setDataSource: (newDataSource: T[]) => void
  isEditing: (key: string) => boolean
  isDelete: (key: string) => boolean
  handleStartEditing: (key: string) => void
  handleStartDeleting: (key: string) => void
  handleStartRestore: (key: string) => void
  handleEditing: (key: string, itemToUpdate: T, onDataSuccess?: (updatedItem: T) => void) => void
  handleAddNew: (item: T) => void
  handleDeleting: (key: string, onDataSuccess?: (deletedItem: T) => void) => void
  handleRestore: (key: string, onDataSuccess?: (deletedItem: T) => void) => void
  handleCancelEditing: () => void
  handleCancelDeleting: () => void
  handleCancelRestore: () => void
  handleDraggableEnd: (event: DragEndEvent, onSuccess?: (newDataSource: T[]) => void) => void
}

export default function useTable<T extends RequiredDataType>(initValue: T[]): Props<T> {
  const [scrollIndex, setScrollIndex] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<T[]>(initValue)
  const [editingKey, setEditingKey] = useState<string>('')
  const [deletingKey, setDeletingKey] = useState<string>('')
  const isEditing = (key: string) => key === editingKey
  const isDelete = (key: string) => key === deletingKey

  const handleStartEditing = (key: string) => {
    setEditingKey(key)
  }

  const handleStartDeleting = (key: string) => {
    setDeletingKey(key)
  }

  const handleStartRestore = (key: string) => {
    setDeletingKey(key)
  }

  const handleDeleting = (key: string, onDataSuccess?: (deletedItem: T) => void) => {
    setLoading(true)
    const itemFound = dataSource.find((item) => item.key === key)
    if (itemFound) {
      const dataSourceRemovedItem = dataSource.filter((item) => item.key !== key)
      setDataSource(dataSourceRemovedItem)
      onDataSuccess?.(itemFound)
    }
    setLoading(false)
  }

  const handleRestore = (key: string, onDataSuccess?: (deletedItem: T) => void) => {
    setLoading(true)
    const itemFound = dataSource.find((item) => item.key === key)
    if (itemFound) {
      const dataSourceRemovedItem = dataSource.filter((item) => item.key !== key)
      setDataSource(dataSourceRemovedItem)
      onDataSuccess?.(itemFound)
    }
    setLoading(false)
  }

  const handleCancelEditing = () => {
    setEditingKey('')
  }

  const handleCancelDeleting = () => {
    setDeletingKey('')
  }

  const handleCancelRestore = () => {
    setDeletingKey('')
  }

  const handleEditing = async (key: string, itemToUpdate: T, onDataSuccess?: (updatedItem: T) => void) => {
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

  const handleAddNew = (item: T) => {
    const newDataSource = [...dataSource]
    newDataSource.unshift({
      ...item,
      key: item.key
    } as T)
    setDataSource(newDataSource)
  }

  const handleDraggableEnd = ({ active, over }: DragEndEvent, onFinish?: (newData: T[]) => void) => {
    if (active.id !== over?.id) {
      const activeIndex = dataSource.findIndex((i) => i.key === active.id)
      const overIndex = dataSource.findIndex((i) => i.key === over?.id)
      const newData = arrayMove(dataSource, activeIndex, overIndex)
      setDataSource(newData)
      onFinish?.(newData)
    }
  }

  return {
    loading,
    setLoading,
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
    handleAddNew,
    handleStartEditing,
    handleStartDeleting,
    handleStartRestore,
    handleEditing,
    handleCancelEditing,
    handleCancelDeleting,
    handleCancelRestore,
    handleDeleting,
    handleRestore,
    handleDraggableEnd
  }
}
