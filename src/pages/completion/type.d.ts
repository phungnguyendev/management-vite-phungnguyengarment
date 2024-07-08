import { Completion, Product, ProductColor, ProductGroup } from '~/typing'

export interface CompletionTableDataType extends Product {
  key: string
  productColor?: ProductColor
  productGroup?: ProductGroup
  completion?: Completion
}

export interface CompletionNewRecordProps {
  productID?: number
  quantityIroned?: number
  quantityCheckPassed?: number
  quantityPackaged?: number
  exportedDate?: string
  passFIDate?: string
}
