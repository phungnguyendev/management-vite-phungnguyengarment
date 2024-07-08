import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '~/store/store'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ProtectedLayout: React.FC<Props> = ({ children }) => {
  const userState = useSelector((state: RootState) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    initialize()
  }, [])

  const initialize = () => {
    if (!userState.user?.isAdmin) navigate('/')
  }

  return children
}

export default ProtectedLayout
