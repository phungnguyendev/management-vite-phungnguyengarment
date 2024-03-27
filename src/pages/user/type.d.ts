import React from 'react'
import { User, UserRole } from '~/typing'

export interface UserTableDataType extends User {
  key?: React.Key
  userRoles?: UserRole[]
}

export interface UserNewRecordProps extends User {
  userRoles?: UserRole[] | null
}
