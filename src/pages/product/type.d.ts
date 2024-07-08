import { PrintablePlace, Product, ProductColor, ProductGroup } from '~/typing'

export interface ProductTableDataType extends Product {
  key: string
  productColor?: ProductColor
  productGroup?: ProductGroup
  printablePlace?: PrintablePlace
}

export interface ProductAddNewProps {
  productCode?: string
  quantityPO?: number
  colorID?: number
  groupID?: number
  printID?: number
  dateInputNPL?: string
  dateOutputFCR?: string
}
