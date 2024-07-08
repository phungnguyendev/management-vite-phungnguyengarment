import client, { RequestBodyType, ResponseDataType } from '~/api/client'
import { SewingLineDelivery } from '~/typing'
import { responseFormatter, throwErrorFormatter } from '~/utils/response-formatter'
const NAMESPACE = 'sewing-line-deliveries'

export default {
  createItem: async (newItem: SewingLineDelivery, accessToken: string): Promise<ResponseDataType> => {
    return await client
      .post(`${NAMESPACE}`, newItem, {
        headers: {
          authorization: accessToken
        }
      })
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  getItemByPk: async (id: number, accessToken: string): Promise<ResponseDataType> => {
    return client
      .get(`${NAMESPACE}/${id}`, {
        headers: {
          authorization: accessToken
        }
      })
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  getItemBy: async (query: { field: string; id: number }, accessToken: string): Promise<ResponseDataType> => {
    return client
      .get(`${NAMESPACE}/${query.field}/${query.id}`, {
        headers: {
          authorization: accessToken
        }
      })
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  getItems: async (bodyRequest: RequestBodyType, accessToken: string): Promise<ResponseDataType> => {
    return await client
      .post(`${NAMESPACE}/find`, bodyRequest, {
        headers: {
          authorization: accessToken
        }
      })
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  updateItemByPk: async (
    id: number,
    itemToUpdate: SewingLineDelivery,
    accessToken: string
  ): Promise<ResponseDataType> => {
    return client
      .patch(`${NAMESPACE}/${id}`, itemToUpdate, {
        headers: {
          authorization: accessToken
        }
      })
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  updateItemBy: async (
    query: { field: string; id: number },
    itemToUpdate: SewingLineDelivery,
    accessToken: string
  ): Promise<ResponseDataType> => {
    return client
      .patch(`${NAMESPACE}/${query.field}/${query.id}`, itemToUpdate, {
        headers: {
          authorization: accessToken
        }
      })
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  updateItemsBy: async (
    query: { field: string; id: number },
    itemsToUpdate: SewingLineDelivery[],
    accessToken: string
  ): Promise<ResponseDataType> => {
    return client
      .put(`${NAMESPACE}/${query.field}/${query.id}`, itemsToUpdate, {
        headers: {
          authorization: accessToken
        }
      })
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  deleteItemByPk: async (id: number, accessToken: string): Promise<ResponseDataType> => {
    return client
      .delete(`${NAMESPACE}/${id}`, {
        headers: {
          authorization: accessToken
        }
      })
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  deleteItemBy: async (query: { field: string; id: number }, accessToken: string): Promise<ResponseDataType> => {
    return client
      .delete(`${NAMESPACE}/${query.field}/${query.id}`, {
        headers: {
          authorization: accessToken
        }
      })
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  }
}
