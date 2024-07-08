import { AccessoryNote, GarmentAccessory, PrintablePlace, Product, ProductColor, ProductGroup } from '~/typing'

export interface GarmentAccessoryTableDataType extends Product {
  key: string
  productColor?: ProductColor
  productGroup?: ProductGroup
  printablePlace?: PrintablePlace
  expandableGarmentAccessory?: ExpandableGarmentAccessoryTableDataType
}

export interface ExpandableGarmentAccessoryTableDataType extends GarmentAccessory {
  accessoryNotes?: AccessoryNote[]
}

export interface GarmentAccessoryAddNewProps {
  id?: number
  amountCutting?: number
  passingDeliveryDate?: string
  syncStatus?: boolean
  accessoryNoteIDs?: number[] // Danh sách id ghi chú phụ liệu
  notes?: string
}
