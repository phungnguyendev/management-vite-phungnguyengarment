export type UserRoleType =
  | 'admin'
  | 'product_manager'
  | 'importation_manager'
  | 'sample_sewing_manager'
  | 'accessory_manager'
  | 'cutting_group_manager'
  | 'completion_manager'
  | 'sewing_line_manager'
  | 'staff'

export type StatusType = 'normal' | 'warn' | 'error' | 'success'

export type SortDirection = 'asc' | 'desc'

export type ItemStatusType = 'draft' | 'active' | 'closed' | 'archived' | 'deleted'

export type NoteItemStatusType = 'lake' | 'enough' | 'arrived' | 'not_arrived'

export type InputType =
  | 'number'
  | 'text'
  | 'colorpicker'
  | 'select'
  | 'datepicker'
  | 'colorselector'
  | 'textarea'
  | 'checkbox'
  | 'multipleselect'
  | 'password'
  | 'email'

export type StepRound = {
  name: string
  type: StatusType
}

export type TableListDataType<T> = {
  key: React.Key
  data: T
}

export interface Role {
  id?: number
  role?: UserRoleType
  shortName?: string
  desc?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}

export interface UserRole {
  id?: number
  roleID?: number
  userID?: number
  role?: Role
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}

export interface User {
  id?: number
  fullName?: string
  email?: string
  password?: string
  avatar?: string
  phone?: string
  otp?: string
  isAdmin?: boolean
  accessKey?: string
  workDescription?: string
  birthday?: string
  status?: ItemStatusType
  accessToken?: string
  refreshToken?: string
  createdAt?: string
  updatedAt?: string
}

export interface Product {
  id?: number
  productCode?: string
  quantityPO?: number
  dateInputNPL?: string
  dateOutputFCR?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}

export interface Color {
  id?: number
  name?: string
  hexColor?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
  orderNumber?: number
}

export interface ProductColor {
  id?: number
  colorID?: number
  productID?: number
  status?: ItemStatusType
  color?: Color
  product?: Product
  createdAt?: string
  updatedAt?: string
}

export interface Group {
  id?: number
  name?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
  orderNumber?: number
}

export interface Print {
  id?: number
  name?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
  orderNumber?: number
}

export interface PrintablePlace {
  id?: number
  printID?: number
  productID?: number
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
  product?: Product
  print?: Print
}

export interface ProductGroup {
  id?: number
  groupID?: number
  productID?: number
  name?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
  product?: Product
  group?: Group
}

export interface GarmentAccessory {
  id?: number
  productID?: number
  amountCutting?: number
  passingDeliveryDate?: string
  status?: ItemStatusType
  syncStatus?: boolean
  product?: Product
  createdAt?: string
  updatedAt?: string
}

export interface AccessoryNote {
  id?: number
  title?: string
  summary?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}

export interface GarmentAccessoryNote {
  id?: number
  productID?: number
  product?: Product
  accessoryNoteID?: number
  accessoryNote?: AccessoryNote
  garmentAccessoryID?: number
  garmentAccessory?: GarmentAccessory
  noteStatus?: NoteItemStatusType
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}

export interface Importation {
  id?: number
  productID?: number
  quantity?: number
  status?: ItemStatusType
  dateImported?: string
  product?: Product
  createdAt?: string
  updatedAt?: string
}

export type SampleSewing = {
  id?: number
  productID?: number
  dateSubmissionNPL?: string
  dateApprovalSO?: string
  dateApprovalPP?: string
  dateSubmissionFirstTime?: string
  dateSubmissionSecondTime?: string
  dateSubmissionThirdTime?: string
  dateSubmissionForthTime?: string
  dateSubmissionFifthTime?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
  product?: Product
}

export interface CuttingGroup {
  id?: number
  productID?: number
  quantityRealCut?: number
  timeCut?: string
  dateSendEmbroidered?: string
  quantityArrivedEmbroidered?: number
  quantityDeliveredBTP?: number
  status?: ItemStatusType
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
  createdAt?: string
  updatedAt?: string
}

export interface SewingLineDelivery {
  id?: number
  productID?: number
  sewingLineID?: number
  quantityOriginal?: number
  quantitySewed?: number
  expiredDate?: string
  status?: ItemStatusType
  product?: Product
  sewingLine?: SewingLine
}

export interface SewingLine {
  id?: number
  name?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}

export interface Completion {
  id?: number
  productID?: number
  quantityIroned?: number
  quantityCheckPassed?: number
  quantityPackaged?: number
  exportedDate?: string
  passFIDate?: string
  status?: ItemStatusType
  product?: Product
  createdAt?: string
  updatedAt?: string
}
