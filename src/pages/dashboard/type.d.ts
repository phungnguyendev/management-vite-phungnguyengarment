import { Completion, Product, ProductColor, ProductGroup, SewingLineDelivery } from '~/typing'

export interface DashboardTableDataType extends Product {
  key: string
  productColor?: ProductColor
  productGroup?: ProductGroup
  completion?: Completion
  sewingLineDeliveries?: SewingLineDelivery[]
}
