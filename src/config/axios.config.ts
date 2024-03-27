import { CreateAxiosDefaults } from 'axios'
import appConfig from './app.config'

const axiosConfig: CreateAxiosDefaults = {
  baseURL: appConfig.baseURL,
  timeout: 10000
}

export default axiosConfig
