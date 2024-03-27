import { CuttingGroup, Product, ProductColor } from '~/typing'

export interface CuttingGroupTableDataType extends Product {
  key: React.Key
  productColor: ProductColor
  cuttingGroup: CuttingGroup
}

export interface CuttingGroupNewRecordProps extends CuttingGroup {
  productColorID?: number | null // Using for compare check box
  cuttingGroupID?: number | null // Using for compare check box
}
