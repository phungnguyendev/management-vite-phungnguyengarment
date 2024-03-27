import { Importation, Product, ProductColor } from '~/typing'

export interface ImportationPageDataType extends Product {
  key: React.Key
  productColor: ProductColor
  importation: Importation
}

export interface ImportationTableDataType extends Importation {
  key: React.Key
}
