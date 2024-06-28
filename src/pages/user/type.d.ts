import { Role, User } from '~/typing'

export interface UserTableDataType extends User {
  key: string
  roles: Role[]
}
