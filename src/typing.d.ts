export type UserRoleType =
  | 'admin'
  | 'product_manager'
  | 'importation_manager'
  | 'accessory_manager'
  | 'cutting_group_manager'
  | 'sample_sewing_manager'
  | 'completion_manager'
  | 'plan_manager'
  | 'hcns_manager'
  | 'accountant_manager'
  | 'sewing_manager'
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

export type ItemWithKeyAndTitleType = {
  key?: React.Key
  title?: string | null | React.ReactNode
  desc?: string | null | React.ReactNode
  editable?: boolean
  dataIndex: string
  initialField?: {
    value: any
    data?: any[]
  }
  inputType?: InputType
  responsive?: Breakpoint[]
}

export type StepRound = {
  name: string
  type: StatusType
}

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
  userID?: number | null
  role?: UserRoleType | null
  isAdmin?: boolean | null
  shortName?: string | null
  desc?: string | null
  status?: ItemStatusType | null
  user?: User | null
  createdAt?: string
  updatedAt?: string
}

export interface UserRole {
  id?: number
  roleID?: number | null
  userID?: number | null
  role?: Role | null
  user?: User | null
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}

export interface User {
  id?: number
  fullName?: string | null
  email?: string | null
  password?: string | null
  avatar?: string | null
  phone?: string | null
  otp?: string | null
  appPassword?: string | null
  accessToken?: string | null
  workDescription?: string | null
  birthday?: string | null
  status?: ItemStatusType | null
  createdAt?: string
  updatedAt?: string
}

export interface Product {
  id?: number
  productCode?: string | null
  quantityPO?: number | null
  dateInputNPL?: string | null
  dateOutputFCR?: string | null
  progress?: {
    sewing?: number | null
    iron?: number | null
    check?: number | null
    pack?: number | null
  }
  status?: ItemStatusType | null
  createdAt?: string
  updatedAt?: string
}

export interface Color {
  id?: number
  name?: string | null
  hexColor?: string | null
  status?: ItemStatusType | null
  createdAt?: string
  updatedAt?: string
  orderNumber?: number | null
}

export interface ProductColor {
  id?: number
  colorID?: number | null
  productID?: number | null
  status?: ItemStatusType | null
  color?: Color
  product?: Product | null
  createdAt?: string
  updatedAt?: string
}

export interface Group {
  id?: number
  name?: string | null
  status?: ItemStatusType | null
  createdAt?: string
  updatedAt?: string
  orderNumber?: number | null
}

export interface Print {
  id?: number
  name?: string | null
  status?: ItemStatusType | null
  createdAt?: string
  updatedAt?: string
  orderNumber?: number | null
}

export interface PrintablePlace {
  id?: number
  printID?: number | null
  productID?: number | null
  status?: ItemStatusType | null
  product?: Product | null
  print?: Print | null
  createdAt?: string
  updatedAt?: string
}

export interface ProductGroup {
  id?: number
  groupID?: number | null
  productID?: number | null
  name?: string | null
  status?: ItemStatusType | null
  createdAt?: string
  updatedAt?: string
  product?: Product | null
  group?: Group | null
}

export interface GarmentAccessory {
  id?: number
  productID?: number | null
  amountCutting?: number | null
  passingDeliveryDate?: string | null
  status?: ItemStatusType | null
  syncStatus?: boolean | null
  product?: Product | null
  createdAt?: string
  updatedAt?: string
}

export interface AccessoryNote {
  id?: number
  title?: string | null
  summary?: string | null
  status?: ItemStatusType | null
  createdAt?: string
  updatedAt?: string
}

export interface GarmentAccessoryNote {
  id?: number
  productID?: number | null
  product?: Product | null
  accessoryNoteID?: number | null
  accessoryNote?: AccessoryNote
  garmentAccessoryID?: number | null
  garmentAccessory?: GarmentAccessory | null
  noteStatus?: NoteItemStatusType | null
  status?: ItemStatusType | null
  createdAt?: string
  updatedAt?: string
}

export interface Importation {
  id?: number
  productID?: number | null
  quantity?: number | null
  status?: ItemStatusType | null
  dateImported?: string | null
  product?: Product | null
  createdAt?: string
  updatedAt?: string
}

export type SampleSewing = {
  id?: number
  productID?: number | null
  dateSubmissionNPL?: string | null
  dateApprovalSO?: string | null
  dateApprovalPP?: string | null
  dateSubmissionFirstTime?: string | null
  dateSubmissionSecondTime?: string | null
  dateSubmissionThirdTime?: string | null
  dateSubmissionForthTime?: string | null
  dateSubmissionFifthTime?: string | null
  status?: ItemStatusType | null
  createdAt?: string
  updatedAt?: string
  product?: Product | null
}

export interface CuttingGroup {
  id?: number
  productID?: number | null
  quantityRealCut?: number | null
  timeCut?: string | null
  dateSendEmbroidered?: string | null
  quantityArrivedEmbroidered?: number | null
  quantityDeliveredBTP?: number | null
  status?: ItemStatusType
  syncStatus?: boolean | null
  dateArrived1Th?: string | null
  quantityArrived1Th?: number | null
  dateArrived2Th?: string | null
  quantityArrived2Th?: number | null
  dateArrived3Th?: string | null
  quantityArrived3Th?: number | null
  dateArrived4Th?: string | null
  quantityArrived4Th?: number | null
  dateArrived5Th?: string | null
  quantityArrived5Th?: number | null
  dateArrived6Th?: string | null
  quantityArrived6Th?: number | null
  dateArrived7Th?: string | null
  quantityArrived7Th?: number | null
  dateArrived8Th?: string | null
  quantityArrived8Th?: number | null
  dateArrived9Th?: string | null
  quantityArrived9Th?: number | null
  dateArrived10Th?: string | null
  quantityArrived10Th?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface SewingLineDelivery {
  id?: number
  productID?: number | null
  sewingLineID?: number | null
  quantityOriginal?: number | null
  quantitySewed?: number | null
  expiredDate?: string | null
  status?: ItemStatusType | null
  product?: Product | null
  sewingLine?: SewingLine | null
}

export interface SewingLine {
  id?: number
  name?: string | null
  status?: ItemStatusType | null
  createdAt?: string
  updatedAt?: string
}

export interface Completion {
  id?: number
  productID?: number | null
  quantityIroned?: number | null
  quantityCheckPassed?: number | null
  quantityPackaged?: number | null
  exportedDate?: string | null
  passFIDate?: string | null
  status?: ItemStatusType | null
  product?: Product | null
  createdAt?: string
  updatedAt?: string
}
