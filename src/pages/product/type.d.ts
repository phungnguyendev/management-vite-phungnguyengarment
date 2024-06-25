import { PrintablePlace, Product, ProductColor, ProductGroup } from '~/typing'

export interface ProductTableDataType extends Product {
  key: string
  productColor?: ProductColor
  productGroup?: ProductGroup
  printablePlace?: PrintablePlace
}
