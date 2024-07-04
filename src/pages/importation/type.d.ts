import { Importation, ItemStatusType, Product, ProductColor, ProductGroup } from '~/typing'

export interface ImportationTableDataType extends Product {
  key: string
  productColor?: ProductColor
  productGroup?: ProductGroup
  // printablePlace?: PrintablePlace
  expandableImportationTableDataTypes: ImportationExpandableTableDataType[]
}

export interface ImportationExpandableTableDataType extends Importation {
  key: string
}

export interface ImportationExpandableAddNewProps {
  productID?: number
  quantity?: number
  status?: ItemStatusType
  dateImported?: string
}
