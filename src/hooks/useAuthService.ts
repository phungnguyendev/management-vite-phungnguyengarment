import { ResponseDataType } from '~/api/client'
import useLocalStorage from './useLocalStorage'

export interface AuthService {
  login: (email: string, password: string) => Promise<ResponseDataType>
  userInfoFromAccessToken: (accessToken: string) => Promise<ResponseDataType>
  verifyEmailAndSendOTP: (sendToEmail: string) => Promise<ResponseDataType>
  verifyOTPCode: (email: string, otp: string) => Promise<ResponseDataType>
  logout: (refreshToken: string) => Promise<ResponseDataType>
}

export default function useAuthService(authService: AuthService) {
  const [, setAccessToken] = useLocalStorage('accessToken', '')
  const [, setRefreshToken] = useLocalStorage('refreshToken', '')

  const login = async (email: string, password: string, setLoading?: (enable: boolean) => void) => {
    try {
      setLoading?.(true)
      const result = await authService.login(email, password)
      setAccessToken(`Bearer ${result.data.accessToken}`)
      setRefreshToken(result.data.refreshToken)
      return result
    } catch (err: any) {
      throw err.data.message
    } finally {
      setLoading?.(false)
    }
  }

  const userInfoFromAccessToken = async (accessToken: string, setLoading?: (enable: boolean) => void) => {
    try {
      setLoading?.(true)
      return await authService.userInfoFromAccessToken(accessToken)
    } catch (err: any) {
      throw `${err}`
    } finally {
      setLoading?.(false)
    }
  }

  const verifyEmailAndSendOTP = async (emailToVerify: string, setLoading?: (enable: boolean) => void) => {
    try {
      setLoading?.(true)
      return await authService.verifyEmailAndSendOTP(emailToVerify)
    } catch (err: any) {
      throw `${err}`
    } finally {
      setLoading?.(false)
    }
  }

  const verifyOTPCode = async (emailToVerify: string, otp: string, setLoading?: (enable: boolean) => void) => {
    try {
      setLoading?.(true)
      return await authService.verifyOTPCode(emailToVerify, otp)
    } catch (err: any) {
      throw `${err}`
    } finally {
      setLoading?.(false)
    }
  }

  const logout = async (refreshToken: string, setLoading?: (enable: boolean) => void) => {
    try {
      setLoading?.(true)
      return await authService.logout(refreshToken)
    } catch (err: any) {
      throw `${err}`
    } finally {
      setLoading?.(false)
    }
  }

  return {
    login,
    logout,
    userInfoFromAccessToken,
    verifyEmailAndSendOTP,
    verifyOTPCode
  }
}
