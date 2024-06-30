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
    default:
      return 'Data load failed!'
  }
}

export default define
