import { PrintablePlace, Product, ProductColor, ProductGroup } from '~/typing'

export interface ProductTableDataType extends Product {
  key?: React.Key
  productColor?: ProductColor
  productGroup?: ProductGroup
  printablePlace?: PrintablePlace
}
