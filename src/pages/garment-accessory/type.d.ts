import { GarmentAccessory, GarmentAccessoryNote, Product, ProductColor } from '~/typing'

export interface GarmentAccessoryTableDataType extends Product {
  key?: React.Key
  productColor?: ProductColor
  garmentAccessory?: GarmentAccessory
  garmentAccessoryNotes?: GarmentAccessoryNote[]
}
