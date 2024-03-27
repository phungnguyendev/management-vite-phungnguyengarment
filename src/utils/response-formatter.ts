import { AxiosError, AxiosResponse } from 'axios'
import { ResponseDataType } from '~/api/client'

export const logError = (error: AxiosError) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(error.response)
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request)
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message)
  }
  console.log(error.config)
}

export const throwErrorFormatter = (error: any) => {
  const axiosError: AxiosError = error
  logError(axiosError)

  throw axiosError.response
}

export const responseFormatter = (res: AxiosResponse<any, any>) => {
  if (res.data) {
    return res.data as ResponseDataType
  }
  return res.data
}
