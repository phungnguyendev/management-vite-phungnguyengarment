export type DefineType =
  | 'created_success'
  | 'create_failed'
  | 'updated_success'
  | 'update_failed'
  | 'deleted_success'
  | 'delete_failed'
  | 'restored_success'
  | 'restore_failed'
  | 'dataLoaded_success'
  | 'dataLoad_failed'
  | 'existed'
  | 'failed'
  | 'success'

const define = (type: DefineType): string => {
  switch (type) {
    case 'created_success':
      return 'Thêm mới thành công!'
    case 'create_failed':
      return 'Thêm mới thất bại!'
    case 'updated_success':
      return 'Cập nhật thành công!'
    case 'update_failed':
      return 'Cập nhật thất bại!'
    case 'deleted_success':
      return 'Đã xoá thành công!'
    case 'delete_failed':
      return 'Đã xoá thất bại!'
    case 'restored_success':
      return 'Khôi phục thành công!'
    case 'restore_failed':
      return 'Khôi phục thất bại!'
    case 'dataLoaded_success':
      return 'Tải dữ liệu thành công!'
    case 'existed':
      return 'Dữ liệu đã tồn tại!'
    case 'failed':
      return 'Thất bại!'
    case 'success':
      return 'Thành công!'
    default:
      return 'Tải dữ liệu thất bại!'
  }
}

export default define
