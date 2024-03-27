import { Product, ProductColor, SewingLineDelivery } from '~/typing'

export interface ExpandableTableDataType extends SewingLineDelivery {
  key?: React.Key
}

export interface SewingLineDeliveryTableDataType extends Product {
  key?: React.Key
  productColor?: ProductColor
  sewingLineDeliveries?: SewingLineDelivery[]
}
