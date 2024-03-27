import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserAPI from '~/api/services/UserAPI'
import useLocalStorage from '~/hooks/useLocalStorage'
import { UserRole, UserRoleType } from '~/typing'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ProtectedLayout: React.FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [accessTokenStored] = useLocalStorage<string>('accessToken', '')
  const navigate = useNavigate()

  useEffect(() => {
    const callApi = async () => {
      try {
        setLoading(true)
        if (accessTokenStored) {
          UserAPI.userRolesFromAccessToken(accessTokenStored)
            .then((meta) => {
              if (!meta?.success) {
                throw new Error(meta?.message)
              }
              const userRoles = meta.data as UserRole[]
              const userRolesType = userRoles.map((userRole) => {
                return userRole.role?.role as UserRoleType
              })
              if (!userRolesType.includes('admin')) navigate('/')
            })
            .catch((error) => {
              console.error(error)
            })
        } else {
          navigate('/login')
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    callApi()
  }, [])

  return <>{loading ? <Spin /> : children}</>
}

export default ProtectedLayout
