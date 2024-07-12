import { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useState } from 'react'
import { Paginator } from '~/api/client'

type RequiredDataType = {
  key: string
  createdAt?: string
  updatedAt?: string
  orderNumber?: number
}

export interface UseTableProps<T extends RequiredDataType> {
  loading: boolean
  dataSource: T[]
  scrollIndex: number
  addingKey: { key: string; payload?: T }
  expandingKeys: string[]
  editingKey: string
  deletingKey: string
  paginator: Paginator
  setPaginator: React.Dispatch<React.SetStateAction<Paginator>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setScrollIndex: React.Dispatch<React.SetStateAction<number>>
  setEditingKey: React.Dispatch<React.SetStateAction<string>>
  setDeletingKey: React.Dispatch<React.SetStateAction<string>>
  setDataSource: React.Dispatch<React.SetStateAction<T[]>>
  isAdding: (key: string) => boolean
  isEditing: (key: string) => boolean
  isDelete: (key: string) => boolean
  handleStartExpanding: (expanded: boolean, key: string) => void
  handleStartAdding: (key: string, payload?: T) => void
  handleStartEditing: (key: string) => void
  handleStartDeleting: (key: string) => void
  handleStartRestore: (key: string) => void
  handleUpdate: (key: string, itemToUpdate: T) => void
  handleAddNew: (item: T) => void
  handleDeleting: (key: string) => void
  handleRestore: (key: string) => void
  handleCloseExpanding: () => void
  handleCancelAdding: () => void
  handleCancelEditing: () => void
  handleCancelDeleting: () => void
  handleCancelRestore: () => void
  handleDraggableEnd: (event: DragEndEvent, onSuccess?: (newDataSource: T[]) => void) => void
}

export default function useTable<T extends RequiredDataType>(initValue: T[]): UseTableProps<T> {
  const [scrollIndex, setScrollIndex] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<T[]>(initValue)
  const [expandingKeys, setExpandingKeys] = useState<string[]>([])
  const [addingKey, setAddingKey] = useState<{ key: string; payload?: T }>({ key: '' })
  const [editingKey, setEditingKey] = useState<string>('')
  const [deletingKey, setDeletingKey] = useState<string>('')
  const [paginator, setPaginator] = useState<Paginator>({ page: 1, pageSize: 10 })

  const isAdding = (key: string) => key === addingKey.key
  const isEditing = (key: string) => key === editingKey
  const isDelete = (key: string) => key === deletingKey

  const handleStartExpanding = (expanded: boolean, key: string) => {
    const newExpandingKeys = [...expandingKeys]
    if (expanded) {
      // Adding new item
      newExpandingKeys.unshift(key)
    } else {
      // Removing item
      const removeIndexKey = newExpandingKeys.findIndex((_key) => _key === key)
      if (removeIndexKey !== -1) newExpandingKeys.splice(removeIndexKey, 1)
    }
    setExpandingKeys(newExpandingKeys)
  }

  const handleStartAdding = (key: string, payload?: T) => {
    setAddingKey({ key, payload })
  }

  const handleStartEditing = (key: string) => {
    setEditingKey(key)
  }

  const handleStartDeleting = (key: string) => {
    setDeletingKey(key)
  }

  const handleStartRestore = (key: string) => {
    setDeletingKey(key)
  }

  const handleDeleting = (key: string) => {
    setLoading(true)
    const itemFound = dataSource.find((item) => item.key === key)
    if (itemFound) {
      const dataSourceRemovedItem = dataSource.filter((item) => item.key !== key)
      setDataSource(dataSourceRemovedItem)
    }
    setLoading(false)
  }

  const handleRestore = (key: string) => {
    setLoading(true)
    const itemFound = dataSource.find((item) => item.key === key)
    if (itemFound) {
      const dataSourceRemovedItem = dataSource.filter((item) => item.key !== key)
      setDataSource(dataSourceRemovedItem)
    }
    setLoading(false)
  }

  const handleCloseExpanding = () => {
    setExpandingKeys([])
  }

  const handleCancelAdding = () => {
    setAddingKey({ key: '' })
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

  const handleUpdate = async (key: string, itemToUpdate: T) => {
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
        // After updated local data
        // We need to update on database
      } else {
        newData.push(itemToUpdate)
      }
      setDataSource(newData)
    } catch (errInfo) {
      throw errInfo
    } finally {
      setEditingKey('')
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
    isAdding,
    isEditing,
    isDelete,
    paginator,
    setPaginator,
    expandingKeys,
    addingKey,
    editingKey,
    deletingKey,
    setEditingKey,
    setDeletingKey,
    scrollIndex,
    setScrollIndex,
    dataSource,
    setDataSource,
    handleAddNew,
    handleStartExpanding,
    handleStartAdding,
    handleStartEditing,
    handleStartDeleting,
    handleStartRestore,
    handleUpdate,
    handleCloseExpanding,
    handleCancelAdding,
    handleCancelEditing,
    handleCancelDeleting,
    handleCancelRestore,
    handleDeleting,
    handleRestore,
    handleDraggableEnd
  }
}
