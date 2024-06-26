import { RequestBodyType, ResponseDataType } from '~/api/client'
import useLocalStorage from './useLocalStorage'

export const defaultRequestBody: RequestBodyType = {
  filter: {
    status: 'active',
    items: [-1]
  },
  paginator: {
    page: 1,
    pageSize: 5
  },
  search: {
    field: 'id',
    term: ''
  },
  sorting: {
    column: 'id',
    direction: 'asc'
  }
}

interface RequiredDataType {
  id?: number
}

export type SortedDirection = 'asc' | 'desc'

export interface APIService<T extends RequiredDataType> {
  createItem: (newItem: T, accessToken: string) => Promise<ResponseDataType | undefined>
  getItemByPk: (id: number, accessToken: string) => Promise<ResponseDataType | undefined>
  getItemBy?: (query: T, accessToken: string) => Promise<ResponseDataType | undefined>
  getItems: (params: RequestBodyType, accessToken: string) => Promise<ResponseDataType | undefined>
  updateItemByPk: (id: number, itemToUpdate: T, accessToken: string) => Promise<ResponseDataType | undefined>
  updateItemBy?: (query: T, itemToUpdate: T, accessToken: string) => Promise<ResponseDataType | undefined>
  updateItems: (itemsToUpdate: T[], accessToken: string) => Promise<ResponseDataType | undefined>
  deleteItemByPk: (id: number, accessToken: string) => Promise<ResponseDataType | undefined>
  deleteItemBy?: (query: T, accessToken: string) => Promise<ResponseDataType | undefined>
}

export default function useAPIService<T extends RequiredDataType>(apiService: APIService<T>) {
  const [tokenStored] = useLocalStorage<string>('accessToken', '')
  const accessTokenStored = tokenStored ?? ''

  const createItem = async (
    itemNew: T,
    setLoading?: (enable: boolean) => void
  ): Promise<ResponseDataType | undefined> => {
    try {
      setLoading?.(true)
      return await apiService.createItem(itemNew, accessTokenStored)
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const createItemSync = async (
    itemNew: T,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (res: ResponseDataType) => void
  ) => {
    try {
      setLoading?.(true)
      await apiService
        .createItem(itemNew, accessTokenStored)
        .then((res) => {
          if (!res?.success) throw new Error(`${res?.message}`)
          onDataSuccess?.(res)
        })
        .catch((err) => {
          throw new Error(err)
        })
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const getItemByPk = async (
    id: number,
    setLoading?: (enable: boolean) => void
  ): Promise<ResponseDataType | undefined> => {
    try {
      setLoading?.(true)
      return await apiService.getItemByPk(id, accessTokenStored)
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const getItemByPkSync = async (
    id: number,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (res: ResponseDataType) => void
  ) => {
    try {
      setLoading?.(true)
      const res = await apiService.getItemByPk(id, accessTokenStored)
      if (!res?.success) throw new Error(`${res?.message}`)
      onDataSuccess?.(res)
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const getItemBy = async (
    query: T,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (res: ResponseDataType) => void
  ) => {
    try {
      setLoading?.(true)
      const res = await apiService.getItemBy?.(query, accessTokenStored)
      if (!res?.success) throw new Error(`${res?.message}`)
      onDataSuccess?.(res)
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const getItemBySync = async (
    query: T,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (res: ResponseDataType) => void
  ) => {
    try {
      setLoading?.(true)
      const res = await apiService.getItemBy?.(query, accessTokenStored)
      if (!res?.success) throw new Error(`${res?.message}`)
      onDataSuccess?.(res)
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const getItems = async (
    params: RequestBodyType,
    setLoading?: (enable: boolean) => void
  ): Promise<ResponseDataType | undefined> => {
    try {
      setLoading?.(true)
      const res = await apiService.getItems({ ...defaultRequestBody, ...params }, accessTokenStored)
      return res
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const getItemsSync = async (
    params: RequestBodyType,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (res: ResponseDataType) => void
  ) => {
    try {
      setLoading?.(true)
      const res = await apiService.getItems({ ...defaultRequestBody, ...params }, accessTokenStored)
      if (!res?.message) throw new Error(`${res}`)
      onDataSuccess?.(res)
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const updateItemByPk = async (
    id: number,
    itemToUpdate: T,
    setLoading?: (enable: boolean) => void
  ): Promise<ResponseDataType | undefined> => {
    try {
      setLoading?.(true)
      const meta = await apiService.updateItemByPk(id, itemToUpdate, accessTokenStored)
      return meta
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const updateItemByPkSync = async (
    id: number,
    itemToUpdate: T,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType) => void
  ) => {
    try {
      setLoading?.(true)
      const res = await apiService.updateItemByPk(id, itemToUpdate, accessTokenStored)
      if (!res?.success) throw new Error(`${res?.message}`)
      onDataSuccess?.(res)
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const updateItemBy = async (
    query: T,
    itemToUpdate: T,
    setLoading?: (enable: boolean) => void
  ): Promise<ResponseDataType | undefined> => {
    try {
      setLoading?.(true)
      const meta = await apiService.updateItemBy?.(query, itemToUpdate, accessTokenStored)
      return meta
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const updateItemBySync = async (
    query: T,
    itemToUpdate: T,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType) => void
  ) => {
    try {
      setLoading?.(true)
      const res = await apiService.updateItemBy?.(query, itemToUpdate, accessTokenStored)
      if (!res?.success) throw new Error(`${res?.message}`)
      onDataSuccess?.(res)
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const updateItems = async (
    itemsToUpdate: T[],
    setLoading?: (enable: boolean) => void
  ): Promise<ResponseDataType | undefined> => {
    try {
      setLoading?.(true)
      const meta = await apiService.updateItems(itemsToUpdate, accessTokenStored)
      return meta
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const updateItemsSync = async (
    itemsToUpdate: T[],
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType) => void
  ) => {
    try {
      setLoading?.(true)
      const res = await apiService.updateItems(itemsToUpdate, accessTokenStored)
      if (!res?.success) throw new Error(`${res?.message}`)
      onDataSuccess?.(res)
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const deleteItem = async (
    id: number,
    setLoading?: (enable: boolean) => void
  ): Promise<ResponseDataType | undefined> => {
    try {
      setLoading?.(true)
      const res = await apiService.deleteItemByPk(id, accessTokenStored)
      return res
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const deleteItemSync = async (
    id: number,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType) => void
  ) => {
    try {
      setLoading?.(true)
      const res = await apiService.deleteItemByPk(id, accessTokenStored)
      if (!res?.success) throw new Error(`${res?.message}`)
      onDataSuccess?.(res)
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const deleteItemBy = async (
    query: T,
    setLoading?: (enable: boolean) => void
  ): Promise<ResponseDataType | undefined> => {
    try {
      setLoading?.(true)
      const res = await apiService.deleteItemBy?.(query, accessTokenStored)
      return res
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const deleteItemBySync = async (
    query: T,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType) => void
  ) => {
    try {
      setLoading?.(true)
      const res = await apiService.deleteItemBy?.(query, accessTokenStored)
      if (!res?.success) throw new Error(`${res?.message}`)
      onDataSuccess?.(res)
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  return {
    createItem,
    createItemSync,
    getItemByPk,
    getItemByPkSync,
    getItemBy,
    getItemBySync,
    getItems,
    getItemsSync,
    updateItemByPk,
    updateItemByPkSync,
    updateItemBy,
    updateItemBySync,
    updateItems,
    updateItemsSync,
    deleteItem,
    deleteItemSync,
    deleteItemBy,
    deleteItemBySync
  }
}
