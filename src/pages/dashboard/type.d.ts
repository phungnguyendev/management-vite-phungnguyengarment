import { Completion, Product, ProductColor, SewingLineDelivery } from '~/typing'

export interface DashboardTableDataType extends Product {
  key?: React.Key
  productColor?: ProductColor
  sewingLineDeliveries?: SewingLineDelivery[]
  completion?: Completion
}

export interface NotificationDataType extends Product {
  key?: React.Key
  messages?: string[]
  productColor?: ProductColor
}
