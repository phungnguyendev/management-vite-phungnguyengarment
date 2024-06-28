import { GarmentAccessory, GarmentAccessoryNote, Product, ProductColor } from '~/typing'

export interface GarmentAccessoryTableDataType extends Product {
  key: string
  productColor: ProductColor
  garmentAccessory: GarmentAccessory
  garmentAccessoryNotes: GarmentAccessoryNote[]
}

export interface GarmentAccessoryNewRecordProps {
  garmentAccessoryID?: number // Using for compare check box
  productColorID?: number // Using for compare check box
  amountCutting?: number
  passingDeliveryDate?: string
  syncStatus?: boolean
  garmentAccessoryNotes?: GarmentAccessoryNote[]
}
