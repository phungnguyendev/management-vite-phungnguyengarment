import { SewingLine } from '~/typing'

export interface SewingLineTableDataType extends SewingLine {
  key: string
}

export interface SewingLineAddNewProps {
  name?: string
}
