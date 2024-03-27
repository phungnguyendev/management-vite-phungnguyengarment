import React from 'react'
import { Role } from '~/typing'

export interface RoleTableDataType extends Role {
  key?: React.Key
}
