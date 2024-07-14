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

export type Filter = { status?: ItemStatusType[]; field?: string; items: number[] }
export type Paginator = { page?: number; pageSize?: number }
export type Search = {
  field?: string
  term?: string // searchTerm: chỉ lấy những product có productCode chứa từ được truyền vào.
}
export type Sorting = {
  column?: string // id
  direction?: SortDirection // direction: asc|desc sắp xếp trước sau
}

export type RequestBodyType = {
  filter?: Filter
  paginator?: Paginator
  search?: Search
  sorting?: Sorting
}

const client: AxiosInstance = axios.create(axiosConfig)

export default client
