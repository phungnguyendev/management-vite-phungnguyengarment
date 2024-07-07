import { Role, User } from '~/typing'

export interface UserTableDataType extends User {
  key: string
  roles?: Role[]
}

export interface UserAddNewProps {
  fullName?: string
  email?: string
  password?: string
  avatar?: string
  phone?: string
  otp?: string
  isAdmin?: boolean
  workDescription?: string
  birthday?: string
  roleIDs?: number[]
}
