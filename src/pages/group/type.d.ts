import { Group } from '~/typing'

export interface GroupTableDataType extends Group {
  key: string
}

export interface GroupAddNewProps {
  name?: string
}
