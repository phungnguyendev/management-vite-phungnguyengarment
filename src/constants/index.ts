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
  | 'error_valid_form'
  | 'login_session_expired'
  | 'error_verify_email'
  | 'error_verify_otp'
  | 'password_not_match'
  | 'password_reset_successful'
  | 'login_success'
  | 'login_failed'
  | 'user_role_not_blank'
  | 'invalidate_form'

const define = (type: DefineType): string => {
  switch (type) {
    case 'created_success':
      return 'Created!'
    case 'create_failed':
      return 'Create failed!'
    case 'updated_success':
      return 'Updated!'
    case 'update_failed':
      return 'Update failed!'
    case 'deleted_success':
      return 'Deleted!'
    case 'delete_failed':
      return 'Delete failed!'
    case 'restored_success':
      return 'Restored!'
    case 'restore_failed':
      return 'Restore failed!'
    case 'dataLoaded_success':
      return 'Data loaded!'
    case 'existed':
      return 'Data existed!'
    case 'failed':
      return 'Failed!'
    case 'success':
      return 'Success!'
    case 'error_valid_form':
      return 'Error valid form!'
    case 'error_verify_email':
      return 'Error verify your email!'
    case 'error_verify_otp':
      return 'Error verify otp!'
    case 'password_not_match':
      return 'Mật khẩu không trùng khớp!'
    case 'password_reset_successful':
      return 'Mật khẩu đã đổi thành công!'
    case 'login_failed':
      return 'Đăng nhập thất bại!'
    case 'login_success':
      return 'Đăng nhập thành công!'
    case 'user_role_not_blank':
      return 'User roles cannot be set blank!'
    case 'login_session_expired':
      return 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!'
    case 'invalidate_form':
      return 'Invalidate form!'
    default:
      return 'Data load failed!'
  }
}

export default define
