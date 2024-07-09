import client, { ResponseDataType } from '~/api/client'
import { responseFormatter, throwErrorFormatter } from '~/utils/response-formatter'

const NAMESPACE = 'auth'

export default {
  login: async (email: string, password: string): Promise<ResponseDataType> => {
    return await client
      .post(`${NAMESPACE}/login`, { email, password })
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  refreshAccessToken: async (refreshToken: string): Promise<ResponseDataType> => {
    return await client
      .post(`${NAMESPACE}/refresh-token`, refreshToken)
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  userInfoFromAccessToken: async (accessToken: string): Promise<ResponseDataType> => {
    return await client
      .get(`${NAMESPACE}/user-info`, {
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
  verifyEmailAndSendOTP: async (emailToVerify: string): Promise<ResponseDataType> => {
    return await client
      .post(`${NAMESPACE}/verify-email/${emailToVerify}`)
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  verifyOTPCode: async (emailToVerify: string, otp: string): Promise<ResponseDataType> => {
    return await client
      .post(`${NAMESPACE}/verify-otp/${emailToVerify}`, { otp })
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  resetPasswordWithAccessKey: async (
    email: string,
    data: {
      newPassword: string
      accessKey: string
    }
  ): Promise<ResponseDataType> => {
    return await client
      .post(`${NAMESPACE}/reset-password/${email}`, { newPassword: data.newPassword, accessKey: data.accessKey })
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  logout: async (refreshToken: string): Promise<ResponseDataType> => {
    return await client
      .post(`${NAMESPACE}/logout`, {
        refreshToken: refreshToken
      })
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  }
}
