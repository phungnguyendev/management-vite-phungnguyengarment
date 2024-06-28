import { Product, ProductColor, SampleSewing } from '~/typing'

export interface SampleSewingTableDataType extends Product {
  key: string
  productColor: ProductColor
  sampleSewing: SampleSewing
}
