import { Product, ProductColor, SampleSewing } from '~/typing'

export interface SampleSewingTableDataType extends Product {
  key: React.Key
  productColor: ProductColor
  sampleSewing: SampleSewing
}
