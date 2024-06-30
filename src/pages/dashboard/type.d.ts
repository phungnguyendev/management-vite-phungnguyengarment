import { Completion, Product, ProductColor, SewingLineDelivery } from '~/typing'

export interface DashboardTableDataType extends Product {
  key: string
  productColor?: ProductColor
  sewingLineDeliveries?: SewingLineDelivery[]
  completion?: Completion
}

export interface NotificationDataType extends Product {
  key: string
  messages?: string[]
  productColor?: ProductColor
}
