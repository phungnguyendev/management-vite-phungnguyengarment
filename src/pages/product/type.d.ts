import { PrintablePlace, Product, ProductColor, ProductGroup } from '~/typing'

export interface ProductTableDataType extends Product {
  key: string
  productColor?: ProductColor
  productGroup?: ProductGroup
  printablePlaces?: PrintablePlace[]
}

export interface ProductAddNewProps {
  productCode?: string
  quantityPO?: number
  colorID?: number
  groupID?: number
  printIDs?: number[]
  dateInputNPL?: string
  dateOutputFCR?: string
}
