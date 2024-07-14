import { CuttingGroup, Product, ProductColor, ProductGroup } from '~/typing'

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
  dateArrived1Th?: string
  quantityArrived1Th?: number
  dateArrived2Th?: string
  quantityArrived2Th?: number
  dateArrived3Th?: string
  quantityArrived3Th?: number
  dateArrived4Th?: string
  quantityArrived4Th?: number
  dateArrived5Th?: string
  quantityArrived5Th?: number
  dateArrived6Th?: string
  quantityArrived6Th?: number
  dateArrived7Th?: string
  quantityArrived7Th?: number
  dateArrived8Th?: string
  quantityArrived8Th?: number
  dateArrived9Th?: string
  quantityArrived9Th?: number
  dateArrived10Th?: string
  quantityArrived10Th?: number
}
