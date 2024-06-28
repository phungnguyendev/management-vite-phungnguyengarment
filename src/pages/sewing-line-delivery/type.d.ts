import { Product, ProductColor, SewingLineDelivery } from '~/typing'

export interface SewingLineDeliveryTableDataType extends Product {
  key: string
  productColor: ProductColor
  sewingLineDeliveries: SewingLineDelivery[]
}

// export interface SewingLineDeliveryRecordProps extends Product {
//   key: string
//   productColor: ProductColor
//   sewingLineDeliveries: SewingLineDelivery[]
// }

export interface ExpandableTableDataType extends SewingLineDelivery {
  key: string
}
