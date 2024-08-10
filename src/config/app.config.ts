// import 'dotenv/config'

const appConfig = {
  baseURL: import.meta.env.VITE_BASE_URL ?? '',
  port: import.meta.env.VITE_PORT_BUILDER ?? 8000
}

export default appConfig
