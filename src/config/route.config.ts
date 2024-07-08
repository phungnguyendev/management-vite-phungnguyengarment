import { lazy } from 'react'
import { Outlet } from 'react-router-dom'
import {
  AgeGroupIcon,
  ColorIcon,
  CutIcon,
  DeliveryIcon,
  NoteIcon,
  PackageSearchIcon,
  PackageSuccessIcon,
  PrintIcon,
  SewingMachineIcon,
  UserIcon,
  WarehouseIcon
} from '~/assets/icons'
import { UserRoleType } from '~/typing'
// const Dashboard = lazy(() => import('~/pages/dashboard/Dashboard'))
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
  role?: UserRoleType
  component: React.LazyExoticComponent<() => JSX.Element> | React.ReactNode | any
  isGroup?: boolean
  icon: string
}

const routes: SideType[] = [
  // {
  //   key: '0',
  //   name: 'Dashboard',
  //   path: '/',
  //   component: Dashboard,
  //   isGroup: false,
  //   icon: DashboardIcon
  // },
  {
    key: '1',
    name: 'Sản phẩm',
    path: '/',
    component: ProductPage,
    isGroup: false,
    role: 'product_manager',
    icon: PackageSearchIcon
  },
  {
    key: '16',
    name: 'Xuất nhập khẩu',
    path: '/importations',
    component: ImportationPage,
    isGroup: false,
    role: 'importation_manager',
    icon: PackageSearchIcon
  },
  {
    key: '2',
    name: 'May mẫu',
    path: 'sample-sewing',
    component: SampleSewingPage,
    isGroup: false,
    role: 'sample_sewing_manager',
    icon: SewingMachineIcon
  },
  {
    key: '3',
    name: 'Phụ liệu',
    path: 'garment-accessories',
    component: GarmentAccessoryPage,
    isGroup: false,
    role: 'accessory_manager',
    icon: WarehouseIcon
  },
  {
    key: '4',
    name: 'Tổ cắt',
    path: 'cutting-groups',
    isGroup: false,
    role: 'cutting_group_manager',
    component: CuttingGroupPage,
    icon: CutIcon
  },
  {
    key: '5',
    name: 'Chuyền may',
    path: 'sewing-line-deliveries',
    role: 'sample_sewing_manager',
    component: SewingLineDeliveryPage,
    icon: DeliveryIcon
  },
  {
    key: '6',
    name: 'Hoàn thành',
    path: 'finish',
    component: FinishPage,
    isGroup: false,
    role: 'completion_manager',
    icon: PackageSuccessIcon
  },
  {
    key: '9',
    name: 'Định nghĩa',
    path: 'structure',
    component: Outlet,
    isGroup: true,
    role: 'admin',
    icon: PackageSuccessIcon
  },
  {
    key: '10',
    name: 'Màu',
    path: 'colors',
    role: 'admin',
    component: ColorPage,
    icon: ColorIcon
  },
  {
    key: '11',
    name: 'Nhóm',
    path: 'groups',
    role: 'admin',
    component: GroupPage,
    icon: AgeGroupIcon
  },
  {
    key: '12',
    name: 'Chuyền may',
    role: 'admin',
    path: 'sewing-line',
    component: SewingLinePage,
    icon: DeliveryIcon
  },
  {
    key: '13',
    name: 'Nơi in - Thêu',
    path: 'prints',
    role: 'admin',
    component: PrintPage,
    icon: PrintIcon
  },
  {
    key: '14',
    name: 'Ghi chú phụ liệu',
    path: 'accessory-notes',
    role: 'admin',
    component: NotePage,
    icon: NoteIcon
  },
  {
    key: '7',
    name: 'Khác',
    path: 'structure',
    component: Outlet,
    isGroup: true,
    role: 'admin',
    icon: PackageSuccessIcon
  },
  {
    key: '8',
    name: 'Người dùng',
    path: 'users',
    role: 'admin',
    component: UserPage,
    icon: UserIcon
  }
  // {
  //   key: '15',
  //   name: 'Vai trò',
  //   path: 'roles',
  //   role: 'admin',
  //   component: RolePage,
  //   icon: UserRoleIcon
  // }
]

export default routes
