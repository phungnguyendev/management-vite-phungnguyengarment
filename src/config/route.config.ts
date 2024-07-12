import { lazy } from 'react'
import { Outlet } from 'react-router-dom'
import {
  AgeGroupIcon,
  ColorIcon,
  CutIcon,
  DashboardIcon,
  DeliveryIcon,
  ImportExportIcon,
  NoteIcon,
  PackageSearchIcon,
  PackageSuccessIcon,
  PrintIcon,
  SewingMachineIcon,
  UserIcon,
  WarehouseIcon
} from '~/assets/icons'
import { UserRoleType } from '~/typing'
const DashboardPage = lazy(() => import('~/pages/dashboard/DashboardPage'))
const CuttingGroupPage = lazy(() => import('~/pages/cutting-group/CuttingGroupPage'))
const ColorPage = lazy(() => import('~/pages/color/ColorPage'))
const GroupPage = lazy(() => import('~/pages/group/GroupPage'))
const NotePage = lazy(() => import('~/pages/accessory-note/AccessoryNotePage'))
const UserPage = lazy(() => import('~/pages/user/UserPage'))
const GarmentAccessoryPage = lazy(() => import('~/pages/garment-accessory/GarmentAccessoryPage'))
const PrintPage = lazy(() => import('~/pages/print/PrintPage'))
const ProductPage = lazy(() => import('~/pages/product/ProductPage'))
const ImportationPage = lazy(() => import('~/pages/importation/ImportationPage'))
const SampleSewingPage = lazy(() => import('~/pages/sample-sewing/SampleSewingPage'))
const SewingLinePage = lazy(() => import('~/pages/sewing-line/SewingLinePage'))
const SewingLineDeliveryPage = lazy(() => import('~/pages/sewing-line-delivery/SewingLineDeliveryPage'))
const FinishPage = lazy(() => import('~/pages/completion/CompletionPage'))

export type SideType = {
  key: string
  name: string
  path: string
  roles: UserRoleType[]
  component: React.LazyExoticComponent<() => JSX.Element> | React.ReactNode | any
  isGroup?: boolean
  icon: string
}

const routes: SideType[] = [
  {
    key: '0',
    name: 'Dashboard',
    path: '/',
    component: DashboardPage,
    isGroup: false,
    roles: [
      'admin',
      'staff',
      'product_manager',
      'importation_manager',
      'sample_sewing_manager',
      'accessory_manager',
      'completion_manager',
      'cutting_group_manager',
      'sewing_line_manager'
    ],
    icon: DashboardIcon
  },
  {
    key: '1',
    name: 'Sản phẩm',
    path: '/products',
    component: ProductPage,
    isGroup: false,
    roles: ['admin', 'product_manager', 'staff'],
    icon: PackageSearchIcon
  },
  {
    key: '16',
    name: 'Xuất nhập khẩu',
    path: '/importations',
    component: ImportationPage,
    isGroup: false,
    roles: ['admin', 'importation_manager', 'staff'],
    icon: ImportExportIcon
  },
  {
    key: '2',
    name: 'May mẫu',
    path: '/sample-sewing',
    component: SampleSewingPage,
    isGroup: false,
    roles: ['admin', 'sample_sewing_manager', 'staff'],
    icon: SewingMachineIcon
  },
  {
    key: '3',
    name: 'Nguyên phụ liệu',
    path: '/garment-accessories',
    component: GarmentAccessoryPage,
    isGroup: false,
    roles: ['admin', 'accessory_manager', 'staff'],
    icon: WarehouseIcon
  },
  {
    key: '4',
    name: 'Tổ cắt',
    path: '/cutting-groups',
    isGroup: false,
    roles: ['admin', 'cutting_group_manager', 'staff'],
    component: CuttingGroupPage,
    icon: CutIcon
  },
  {
    key: '5',
    name: 'Chuyền may',
    path: '/sewing-line-deliveries',
    roles: ['admin', 'sample_sewing_manager', 'staff'],
    component: SewingLineDeliveryPage,
    icon: DeliveryIcon
  },
  {
    key: '6',
    name: 'Hoàn thành',
    path: '/completions',
    component: FinishPage,
    isGroup: false,
    roles: ['admin', 'completion_manager', 'staff'],
    icon: PackageSuccessIcon
  },
  {
    key: '9',
    name: 'Định nghĩa',
    path: 'structure',
    component: Outlet,
    isGroup: true,
    roles: ['admin'],
    icon: PackageSuccessIcon
  },
  {
    key: '10',
    name: 'Màu',
    path: '/colors',
    roles: ['admin'],
    component: ColorPage,
    icon: ColorIcon
  },
  {
    key: '11',
    name: 'Nhóm',
    path: '/groups',
    roles: ['admin'],
    component: GroupPage,
    icon: AgeGroupIcon
  },
  {
    key: '12',
    name: 'Chuyền may',
    path: '/sewing-lines',
    roles: ['admin'],
    component: SewingLinePage,
    icon: DeliveryIcon
  },
  {
    key: '13',
    name: 'Nơi in - Thêu',
    path: '/prints',
    roles: ['admin'],
    component: PrintPage,
    icon: PrintIcon
  },
  {
    key: '14',
    name: 'Ghi chú phụ liệu',
    path: '/accessory-notes',
    roles: ['admin'],
    component: NotePage,
    icon: NoteIcon
  },
  {
    key: '7',
    name: 'Khác',
    path: 'structure',
    component: Outlet,
    isGroup: true,
    roles: ['admin'],
    icon: PackageSuccessIcon
  },
  {
    key: '8',
    name: 'Người dùng',
    path: '/users',
    roles: ['admin'],
    component: UserPage,
    icon: UserIcon
  }
  // {
  //   key: '15',
  //   name: 'Vai trò',
  //   path: 'roles',
  //   roles: ['admin'],
  //   component: RolePage,
  //   icon: UserRoleIcon
  // }
]

export default routes
