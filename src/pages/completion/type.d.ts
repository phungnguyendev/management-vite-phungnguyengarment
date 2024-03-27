import { Completion, Product, ProductColor } from '~/typing'

export interface CompletionTableDataType extends Product {
  key?: React.Key
  productColor?: ProductColor
  completion?: Completion
}

export interface CompletionNewRecordProps extends Completion {}
