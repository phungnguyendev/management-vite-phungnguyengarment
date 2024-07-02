import { Product, ProductColor, SampleSewing } from '~/typing'

export interface SampleSewingTableDataType extends Product {
  key: string
  productColor: ProductColor
  sampleSewing: SampleSewing
}

export interface SampleSewingAddNewProps {
  dateSubmissionNPL?: string
  dateApprovalSO?: string
  dateApprovalPP?: string
  dateSubmissionFirstTime?: string
  dateSubmissionSecondTime?: string
  dateSubmissionThirdTime?: string
  dateSubmissionForthTime?: string
  dateSubmissionFifthTime?: string
}
