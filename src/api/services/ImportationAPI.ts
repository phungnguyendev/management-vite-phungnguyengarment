import client, { RequestBodyType, ResponseDataType } from '~/api/client'
import { Importation } from '~/typing'
import { responseFormatter, throwErrorFormatter } from '~/utils/response-formatter'

const NAMESPACE = 'importations'

export default {
  createItem: async (newItem: Importation, accessToken: string): Promise<ResponseDataType | undefined> => {
    return await client
      .post(
        `${NAMESPACE}`,
        {
          ...newItem,
          status: newItem.status ?? 'active'
        },
        {
          headers: {
            authorization: accessToken
          }
        }
      )
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  getItemByPk: async (id: number, accessToken: string): Promise<ResponseDataType | undefined> => {
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
  getItemBy: async (query: Importation, accessToken: string): Promise<ResponseDataType | undefined> => {
    return client
      .get(`${NAMESPACE}/${[query]}/${query}`, {
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
  getItems: async (bodyRequest: RequestBodyType, accessToken: string): Promise<ResponseDataType | undefined> => {
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
    itemToUpdate: Importation,
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${NAMESPACE}/${id}`, itemToUpdate, {
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
    query: Importation,
    itemToUpdate: Importation,
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return client
      .patch(`${NAMESPACE}/${[query]}/${query}`, itemToUpdate, {
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
  updateItems: async (itemsToUpdate: Importation[], accessToken: string): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${NAMESPACE}`, itemsToUpdate, {
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
  deleteItemByPk: async (id: number, accessToken: string): Promise<ResponseDataType | undefined> => {
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
  deleteItemBy: async (query: Importation, accessToken: string): Promise<ResponseDataType | undefined> => {
    return client
      .delete(`${NAMESPACE}/${[query]}/${query}`, {
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
