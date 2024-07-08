import { Print } from '~/typing'

export interface PrintableTableDataType extends Print {
  key: string
}

export interface PrintAddNewProps {
  name?: string
}
