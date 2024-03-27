/**
 * All the necessary configuration will be handled in the client.js.
 * We can specify what is the URL to call API or specify logic that should be used reused for every API call.
 * The file can look something like this.
 */

import axios, { AxiosInstance } from 'axios'
import axiosConfig from '~/config/axios.config'
import { ItemStatusType, SortDirection } from '~/typing'

export type ResponseDataType = {
  success?: boolean
  message: string
  data?: any
  meta?: any
  length?: number
  page?: number
  pageSize?: number
  total?: number
}

export type RequestBodyType = {
  filter?: {
    status?: ItemStatusType
    field?: string
    items?: number[] // items: mảng id : default -1: Lấy tất cả post
  }
  paginator?: {
    page?: number // trang hiện tại : default = 1
    pageSize?: number // số lượng post cần lấy : default = 10
  }
  search?: {
    field?: string
    term?: string // searchTerm: chỉ lấy những product có productCode chứa từ được truyền vào.
  }
  sorting?: {
    column?: string // id
    direction?: SortDirection // direction: asc|desc sắp xếp trước sau
  }
}

export const defaultRequestBody: RequestBodyType = {
  filter: {
    items: [-1],
    field: '',
    status: 'active'
  },
  paginator: { page: 1, pageSize: 5 },
  search: {
    field: 'id',
    term: ''
  },
  sorting: {
    column: 'id', // id
    direction: 'desc' // direction: asc|desc sắp xếp trước sau
  }
}

const client: AxiosInstance = axios.create(axiosConfig)

export default client
