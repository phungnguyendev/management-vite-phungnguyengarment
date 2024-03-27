import React from 'react'
import { ItemStatusType } from '~/typing'

export type SewingLineTableDataType = {
  key?: React.Key
  id?: number
  name?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}
