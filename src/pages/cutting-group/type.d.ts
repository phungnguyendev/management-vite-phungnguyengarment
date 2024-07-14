import { CutGroupEmbroidering, CuttingGroup, Product, ProductColor, ProductGroup } from '~/typing'

export interface CuttingGroupTableDataType extends Product {
  key: string
  productColor?: ProductColor
  productGroup?: ProductGroup
  cuttingGroup?: CuttingGroup
  expandable?: CutGroupEmbroideringTableDataType[]
}

export interface CuttingGroupNewRecordProps {
  productID?: number
  quantityRealCut?: number
  dateTimeCut?: string
  dateSendEmbroidered?: string
  dateSendDeliveredBTP?: string
  quantitySendDeliveredBTP?: number
  syncStatus?: boolean
}

export interface CutGroupEmbroideringTableDataType extends CutGroupEmbroidering {
  key: string
}

export interface CutGroupEmbroideringNewRecordProps {
  cuttingGroupID?: number
  dateArrived?: string
  quantityArrived?: number
}
