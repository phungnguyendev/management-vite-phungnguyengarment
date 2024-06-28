import { Color } from '~/typing'

export interface ColorTableDataType extends Color {
  key: string
}

export interface ColorAddNewProps {
  name?: string
  hexColor?: string
}
