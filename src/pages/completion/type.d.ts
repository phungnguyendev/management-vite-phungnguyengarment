import { Completion, Product, ProductColor } from '~/typing'

export interface CompletionTableDataType extends Product {
  key: string
  productColor: ProductColor
  completion: Completion
}

export interface CompletionNewRecordProps {
  productID?: number
  quantityIroned?: number
  quantityCheckPassed?: number
  quantityPackaged?: number
  exportedDate?: string
  passFIDate?: string
  status?: ItemStatusType
}
