import { useState } from 'react'
import { RequestBodyType, ResponseDataType, defaultRequestBody } from '~/api/client'
import { ItemStatusType, SortDirection } from '~/typing'
import useLocalStorage from './useLocalStorage'

export interface ItemWithId {
  id?: number
  status?: ItemStatusType
  // ... other common properties
}

export interface APIService<T extends ItemWithId> {
  createNewItem: (itemNew: Partial<T>, accessToken: string) => Promise<ResponseDataType | undefined>
  createNewItems?: (itemsNew: Partial<T>[], accessToken: string) => Promise<ResponseDataType | undefined>
  createOrUpdateItemByPk?: (id: number, item: Partial<T>, accessToken: string) => Promise<ResponseDataType | undefined>
  createOrUpdateItemBy?: (
    query: { field: string; key: React.Key },
    item: Partial<T>,
    accessToken: string
  ) => Promise<ResponseDataType | undefined>
  getItemByPk: (id: number, accessToken: string) => Promise<ResponseDataType | undefined>
  getItemBy: (query: { field: string; key: React.Key }, accessToken: string) => Promise<ResponseDataType | undefined>
  getItems: (params: RequestBodyType, accessToken: string) => Promise<ResponseDataType | undefined>
  updateItemByPk: (id: number, itemToUpdate: Partial<T>, accessToken: string) => Promise<ResponseDataType | undefined>
  updateItemsBy?: (
    query: { field: string; key: React.Key },
    recordsToUpdate: Partial<T>[],
    accessToken: string
  ) => Promise<ResponseDataType | undefined>
  updateItemBy: (
    query: {
      field: string
      key: React.Key
    },
    itemToUpdate: Partial<T>,
    accessToken: string
  ) => Promise<ResponseDataType | undefined>
  deleteItemByPk: (id: number, accessToken: string) => Promise<ResponseDataType | undefined>
  deleteItemBy?: (
    query: { field: string; key: React.Key },
    accessToken: string
  ) => Promise<ResponseDataType | undefined>
}

export default function useAPIService<T extends { id?: number }>(apiService: APIService<ItemWithId>) {
  const [accessTokenStored] = useLocalStorage<string>('accessToken', '')
  const [metaData, setMetaData] = useState<ResponseDataType | undefined>(undefined)
  const [page, setPage] = useState<number>(1)

  const createNewItem = async (
    itemNew: T,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (meta: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.createNewItem(itemNew, accessTokenStored ?? '')
      if (meta?.success) {
        onDataSuccess?.(meta, 'Created!')
      } else {
        onDataSuccess?.(undefined, 'Failed!')
      }
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  const createNewItems = async (
    itemsNew: T[],
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (meta: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.createNewItems?.(itemsNew, accessTokenStored ?? '')
      if (meta?.success) {
        onDataSuccess?.(meta, 'Created!')
      } else {
        onDataSuccess?.(undefined, 'Failed!')
      }
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  const getItemByPk = async (
    id: number,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.getItemByPk(id, accessTokenStored ?? '')
      if (meta?.success) {
        onDataSuccess?.(meta, 'Success!')
      } else {
        onDataSuccess?.(undefined, 'Failed!')
      }
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  const getItemBy = async (
    query: {
      field: string
      key: React.Key
    },
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.getItemBy?.(query, accessTokenStored ?? '')
      if (meta?.success) {
        onDataSuccess?.(meta, 'Success!')
      } else {
        onDataSuccess?.(undefined, 'Failed!')
      }
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  const getListItems = async (
    params: RequestBodyType,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.getItems(params, accessTokenStored ?? '')
      if (meta?.success) {
        onDataSuccess?.(meta, 'Success!')
      } else {
        onDataSuccess?.(undefined, 'Failed!')
      }
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  const sortedListItems = async (
    direction: SortDirection,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void,
    search?: {
      field: string
      term: string
    }
  ) => {
    try {
      const body: RequestBodyType = {
        ...defaultRequestBody,
        paginator: {
          page: page,
          pageSize: 5
        },
        sorting: {
          column: 'id',
          direction: direction
        },
        search: search
      }
      await getListItems(body, setLoading, onDataSuccess)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading?.(false)
    }
  }

  const pageChange = async (
    _page: number,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void,
    search?: {
      field: string
      term: string
    }
  ) => {
    try {
      setPage(_page)
      const body: RequestBodyType = {
        ...defaultRequestBody,
        paginator: {
          page: _page,
          pageSize: 5
        },
        search: search
      }
      await getListItems(body, setLoading, onDataSuccess)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading?.(false)
    }
  }

  const updateItemByPk = async (
    id: number,
    itemToUpdate: T,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.updateItemByPk(id, itemToUpdate, accessTokenStored ?? '')
      if (meta?.success) {
        onDataSuccess?.(meta, 'Updated!')
      } else {
        onDataSuccess?.(undefined, 'Failed!')
      }
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  const updateItemsBy = async (
    query: {
      field: string
      key: React.Key
    },
    recordsToUpdate: T[],
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.updateItemsBy?.(query, recordsToUpdate, accessTokenStored ?? '')
      if (meta?.success) {
        onDataSuccess?.(meta, 'Updated!')
      } else {
        onDataSuccess?.(undefined, 'Failed!')
      }
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  const updateItemBy = async (
    query: {
      field: string
      key: React.Key
    },
    itemToUpdate: T,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.updateItemBy(query, itemToUpdate, accessTokenStored ?? '')
      if (meta?.success) {
        onDataSuccess?.(meta, 'Updated!')
      } else {
        onDataSuccess?.(undefined, 'Failed!')
      }
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  const deleteItemByPk = async (
    id: number,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.deleteItemByPk(id, accessTokenStored ?? '')
      if (meta?.success) {
        onDataSuccess?.(meta, 'Deleted!')
      } else {
        onDataSuccess?.(undefined, 'Failed!')
      }
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  const deleteItemBy = async (
    query: {
      field: string
      key: React.Key
    },
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.deleteItemBy?.(query, accessTokenStored ?? '')
      if (meta?.success) {
        onDataSuccess?.(meta, 'Deleted!')
      } else {
        onDataSuccess?.(undefined, 'Failed!')
      }
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  const createOrUpdateItemByPk = async (
    id: number,
    item: Partial<T>,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.createOrUpdateItemByPk?.(id, item, accessTokenStored ?? '')
      onDataSuccess?.(meta, meta?.message)
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  const createOrUpdateItemBy = async (
    query: {
      field: string
      key: React.Key
    },
    item: Partial<T>,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.createOrUpdateItemBy?.(query, item, accessTokenStored ?? '')
      onDataSuccess?.(meta, meta?.message)
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  return {
    metaData,
    page,
    setPage,
    createNewItem,
    createNewItems,
    getItemByPk,
    getItemBy,
    getListItems,
    updateItemByPk,
    updateItemBy,
    updateItemsBy,
    deleteItemByPk,
    deleteItemBy,
    sortedListItems,
    pageChange,
    createOrUpdateItemBy,
    createOrUpdateItemByPk
  }
}
