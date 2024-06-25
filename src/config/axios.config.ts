import { CreateAxiosDefaults } from 'axios'
import appConfig from './app.config'

const axiosConfig: CreateAxiosDefaults = {
  baseURL: appConfig.baseURL,
  timeout: 100000
}

export default axiosConfig
