import { RequestBodyType, ResponseDataType } from '~/api/client'
import useLocalStorage from './useLocalStorage'

export const defaultRequestBody: RequestBodyType = {
  filter: {
    status: ['active'],
    items: [-1]
  },
  paginator: {
    page: 1,
    pageSize: 10
  },
  search: {
    field: 'id',
    term: ''
  },
  sorting: {
    column: 'id',
    direction: 'desc'
  }
}

interface RequiredDataType {
  id?: number
}

export type SortedDirection = 'asc' | 'desc'

export interface APIService<T extends RequiredDataType> {
  createItem: (newItem: T, accessToken: string) => Promise<ResponseDataType>
  getItemByPk: (id: number, accessToken: string) => Promise<ResponseDataType>
  getItemBy?: (query: { field: string; id: number }, accessToken: string) => Promise<ResponseDataType>
  getItems: (params: RequestBodyType, accessToken: string) => Promise<ResponseDataType>
  updateItemByPk: (id: number, itemToUpdate: T, accessToken: string) => Promise<ResponseDataType>
  updateItemBy?: (
    query: { field: string; id: number },
    itemToUpdate: T,
    accessToken: string
  ) => Promise<ResponseDataType>
  updateItemsBy?: (
    query: { field: string; id: number },
    itemsToUpdate: T[],
    accessToken: string
  ) => Promise<ResponseDataType>
  deleteItemByPk: (id: number, accessToken: string) => Promise<ResponseDataType>
  deleteItemBy?: (query: { field: string; id: number }, accessToken: string) => Promise<ResponseDataType>
}

export default function useAPIService<T extends RequiredDataType>(apiService: APIService<T>) {
  const [tokenStored] = useLocalStorage<string>('accessToken', '')
  const accessTokenStored = tokenStored ?? ''

  const createItem = async (itemNew: T, setLoading?: (enable: boolean) => void): Promise<ResponseDataType> => {
    try {
      setLoading?.(true)
      return await apiService.createItem(itemNew, accessTokenStored)
    } catch (err) {
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
      await apiService.createItem(itemNew, accessTokenStored).then((res) => {
        if (!res?.success) throw new Error(`${res?.message}`)
        onDataSuccess?.(res)
      })
    } catch (err) {
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const getItemByPk = async (id: number, setLoading?: (enable: boolean) => void): Promise<ResponseDataType> => {
    try {
      setLoading?.(true)
      return await apiService.getItemByPk(id, accessTokenStored)
    } catch (err) {
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
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const getItemBy = async (
    query: { field: string; id: number },
    setLoading?: (enable: boolean) => void
  ): Promise<ResponseDataType> => {
    try {
      setLoading?.(true)
      const res = await apiService.getItemBy?.(query, accessTokenStored)
      if (!res?.success) throw new Error(`${res?.message}`)
      return res
    } catch (err) {
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const getItemBySync = async (
    query: { field: string; id: number },
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (res: ResponseDataType) => void
  ) => {
    try {
      setLoading?.(true)
      const res = await apiService.getItemBy?.(query, accessTokenStored)
      if (!res?.success) throw new Error(`${res?.message}`)
      onDataSuccess?.(res)
    } catch (err) {
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const getItems = async (
    params: RequestBodyType,
    setLoading?: (enable: boolean) => void
  ): Promise<ResponseDataType> => {
    try {
      setLoading?.(true)
      const res = await apiService.getItems({ ...defaultRequestBody, ...params }, accessTokenStored)
      return res
    } catch (err) {
      console.log(err)
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
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const updateItemByPk = async (
    id: number,
    itemToUpdate: T,
    setLoading?: (enable: boolean) => void
  ): Promise<ResponseDataType> => {
    try {
      setLoading?.(true)
      const meta = await apiService.updateItemByPk(id, itemToUpdate, accessTokenStored)
      return meta
    } catch (err) {
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
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const updateItemBy = async (
    query: { field: string; id: number },
    itemToUpdate: T,
    setLoading?: (enable: boolean) => void
  ): Promise<ResponseDataType> => {
    try {
      setLoading?.(true)
      const res = await apiService.updateItemBy?.(query, itemToUpdate, accessTokenStored)
      if (!res?.success) throw new Error(`${res?.message}`)
      return res
    } catch (err) {
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const updateItemBySync = async (
    query: { field: string; id: number },
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
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const updateItemsBy = async (
    query: { field: string; id: number },
    itemsToUpdate: T[],
    setLoading?: (enable: boolean) => void
  ): Promise<ResponseDataType> => {
    try {
      setLoading?.(true)
      const res = await apiService.updateItemsBy?.(query, itemsToUpdate, accessTokenStored)
      if (!res?.success) throw new Error(`${res?.message}`)
      return res
    } catch (err) {
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const updateItemsSync = async (
    query: { field: string; id: number },
    itemsToUpdate: T[],
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType) => void
  ) => {
    try {
      setLoading?.(true)
      const res = await apiService.updateItemsBy?.(query, itemsToUpdate, accessTokenStored)
      if (!res?.success) throw new Error(`${res?.message}`)
      onDataSuccess?.(res)
    } catch (err) {
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const deleteItem = async (id: number, setLoading?: (enable: boolean) => void): Promise<ResponseDataType> => {
    try {
      setLoading?.(true)
      const res = await apiService.deleteItemByPk(id, accessTokenStored)
      return res
    } catch (err) {
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
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const deleteItemBy = async (
    query: { field: string; id: number },
    setLoading?: (enable: boolean) => void
  ): Promise<ResponseDataType> => {
    try {
      setLoading?.(true)
      const res = await apiService.deleteItemBy?.(query, accessTokenStored)
      if (!res?.success) throw new Error(`${res?.message}`)
      return res
    } catch (err) {
      throw err
    } finally {
      setLoading?.(false)
    }
  }

  const deleteItemBySync = async (
    query: { field: string; id: number },
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType) => void
  ) => {
    try {
      setLoading?.(true)
      const res = await apiService.deleteItemBy?.(query, accessTokenStored)
      if (!res?.success) throw new Error(`${res?.message}`)
      onDataSuccess?.(res)
    } catch (err) {
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
    updateItemsBy,
    updateItemsSync,
    deleteItem,
    deleteItemSync,
    deleteItemBy,
    deleteItemBySync
  }
}
