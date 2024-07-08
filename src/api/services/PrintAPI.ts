import client, { RequestBodyType, ResponseDataType } from '~/api/client'
import { Print } from '~/typing'
import { responseFormatter, throwErrorFormatter } from '~/utils/response-formatter'
const NAMESPACE = 'prints'

export default {
  createItem: async (newItem: Print, accessToken: string): Promise<ResponseDataType> => {
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
  updateItemByPk: async (id: number, itemToUpdate: Print, accessToken: string): Promise<ResponseDataType> => {
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
  }
}
