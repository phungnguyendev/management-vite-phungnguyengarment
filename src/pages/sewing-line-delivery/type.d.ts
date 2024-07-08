import { Product, ProductColor, ProductGroup, SewingLineDelivery } from '~/typing'

export interface SewingLineDeliveryTableDataType extends Product {
  key: string
  productColor?: ProductColor
  productGroup?: ProductGroup
  sewingLineDeliveries?: SewingLineDelivery[]
}

// export interface SewingLineDeliveryRecordProps extends Product {
//   key: string
//   productColor: ProductColor
//   sewingLineDeliveries: SewingLineDelivery[]
// }
