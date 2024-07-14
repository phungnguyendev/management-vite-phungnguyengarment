import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import RoleAPI from '~/api/services/RoleAPI'
import UserAPI from '~/api/services/UserAPI'
import UserRoleAPI from '~/api/services/UserRoleAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants'
import useAPIService from '~/hooks/useAPIService'
import { Role, User, UserRole } from '~/typing'
import { arrayComparator, isValidArray, textComparator } from '~/utils/helpers'
import { UserAddNewProps, UserTableDataType } from '../type'

export default function useUserViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<UserTableDataType>([])
  // Services
  const userService = useAPIService<User>(UserAPI)
  const roleService = useAPIService<Role>(RoleAPI)
  const userRoleService = useAPIService<UserRole>(UserRoleAPI)

  // State changes
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<UserAddNewProps>({})

  // List
  const [roles, setRoles] = useState<Role[]>([])
  const [userRoles, setUserRoles] = useState<UserRole[]>([])

  useEffect(() => {
    initialize()
  }, [])

  const dataMapped = (users: User[], userRoles: UserRole[], roles: Role[]) => {
    table.setDataSource(() => {
      return users.map((self) => {
        const userRoleIDsMapped = userRoles
          .filter((item) => item.userID === self.id)
          .map((item) => {
            return item.roleID
          })
        return {
          ...self,
          key: `${self.id}`,
          roles: roles.filter((item) => userRoleIDsMapped.includes(item.id))
        } as UserTableDataType
      })
    })
  }

  const initialize = async () => {
    try {
      const userResult = await userService.getItems({ paginator: { page: 1, pageSize: -1 } }, table.setLoading)
      if (!userResult.success) throw new Error(define('dataLoad_failed'))
      const newUsers = userResult.data as User[]

      const userRoleResult = await userRoleService.getItems({ paginator: { page: 1, pageSize: -1 } }, table.setLoading)
      if (!userRoleResult.success) throw new Error(define('dataLoad_failed'))
      const newUserRoles = userRoleResult.data as UserRole[]
      setUserRoles(newUserRoles)

      const roleResult = await roleService.getItems({ paginator: { page: 1, pageSize: -1 } }, table.setLoading)
      if (!roleResult.success) throw new Error(define('dataLoad_failed'))
      const newRoles = roleResult.data as Role[]
      setRoles(newRoles)

      dataMapped(newUsers, newUserRoles, newRoles)
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const loadData = async (query: { isDeleted: boolean; searchTerm: string }) => {
    try {
      const result = await userService.getItems(
        {
          paginator: { page: 1, pageSize: -1 },
          filter: { field: 'id', items: [-1], status: query.isDeleted ? ['deleted'] : ['active'] },
          search: { field: 'email', term: query.searchTerm }
        },
        table.setLoading
      )
      if (!result.success) throw new Error(define('dataLoad_failed'))
      const newUsers = result.data as User[]

      dataMapped(newUsers, userRoles, roles)
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleUpdate = async (record: UserTableDataType) => {
    try {
      let newItemSource: UserTableDataType = record
      if (
        textComparator(newRecord.email, record.email) ||
        textComparator(newRecord.password, record.password) ||
        textComparator(newRecord.fullName, record.fullName) ||
        textComparator(newRecord.phone, record.phone) ||
        textComparator(newRecord.workDescription, record.workDescription) ||
        textComparator(newRecord.avatar, record.avatar) ||
        textComparator(newRecord.birthday, record.birthday)
      ) {
        await userService.updateItemByPkSync(record.id!, { ...newRecord }, table.setLoading, (meta) => {
          if (!meta.success) throw new Error(define('update_failed'))
          const dataUpdated = meta.data as User
          newItemSource = { ...dataUpdated, key: record.key, roles: record.roles }
        })
      }

      if (!isValidArray(newRecord.roleIDs)) throw new Error(define('user_role_not_blank'))
      if (
        isValidArray(newRecord.roleIDs) &&
        isValidArray(record.roles) &&
        arrayComparator(
          newRecord.roleIDs,
          record.roles.map((item) => {
            return item.id
          })
        )
      ) {
        await userRoleService.updateItemsSync(
          { field: 'userID', id: record.id! },
          newRecord.roleIDs.map((roleID) => {
            return { userID: record.id, roleID: roleID } as UserRole
          }),
          table.setLoading,
          (res) => {
            if (!res.success) throw new Error(define('update_failed'))
            const updatedUserRoles = res.data as UserRole[]
            newItemSource = {
              ...newItemSource,
              roles: updatedUserRoles.map((item) => {
                return item.role!
              })
            }
          }
        )
      }
      table.handleUpdate(record.key, newItemSource)
      message.success(define('updated_success'))
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.handleCancelEditing()
      table.setLoading(false)
    }
  }

  const handleAddNew = async (formAddNew: UserAddNewProps) => {
    try {
      const result = await userService.createItem({ ...formAddNew }, table.setLoading)
      if (!result.success) throw new Error(define('create_failed'))
      const data = result.data as User
      if (isValidArray(formAddNew.roleIDs)) {
        const newUserRolesResult = await userRoleService.updateItemsBy(
          { field: 'userID', id: data.id! },
          formAddNew.roleIDs.map((roleID) => {
            return { userID: data.id, roleID: roleID } as UserRole
          }),
          table.setLoading
        )
        const _userRoles = newUserRolesResult.data as UserRole[]
        // setUserRoles(_userRoles)
        table.handleAddNew({
          ...data,
          key: `${data.id}`,
          roles: roles.filter((item) => _userRoles.some((self) => self.roleID === item.id))
        } as UserTableDataType)
      } else {
        table.handleAddNew({ ...data, key: `${data.id}` } as UserTableDataType)
      }
      message.success(define('created_success'))
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
      setOpenModal(false)
    }
  }

  const handleDelete = async (record: UserTableDataType) => {
    try {
      table.setLoading(true)
      await userService.updateItemByPkSync(record.id!, { status: 'deleted' }, table.setLoading, (meta) => {
        if (!meta.success) throw new Error(define('failed'))
        table.handleDeleting(record.key)
        message.success(define('success'))
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleDeleteForever = async (record: UserTableDataType) => {
    try {
      table.setLoading(true)
      await userService.deleteItemSync(record.id!, table.setLoading, (meta) => {
        if (!meta.success) throw new Error(`${define('delete_failed')}`)
        table.handleDeleting(record.key)
        message.success(define('deleted_success'))
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleRestore = async (record: UserTableDataType) => {
    try {
      table.setLoading(true)
      await userService.updateItemByPkSync(record.id!, { status: 'active' }, table.setLoading, (meta) => {
        if (!meta.success) throw new Error(define('restore_failed'))
        table.handleDeleting(record.key)
        message.success(define('restored_success'))
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handlePageChange = async (page: number, pageSize: number) => {
    table.setPaginator({ page, pageSize })
  }

  /**
   * Function handle switch delete button
   */
  const handleSwitchDeleteChange = (checked: boolean) => {
    setShowDeleted(checked)
    loadData({ isDeleted: checked, searchTerm: searchText })
  }

  /**
   * Function handle switch sort button
   */
  const handleSwitchSortChange = (checked: boolean) => {
    table.setDataSource((prevDataSource) => {
      return checked
        ? [...prevDataSource.sort((a, b) => a.id! - b.id!)]
        : [...prevDataSource.sort((a, b) => b.id! - a.id!)]
    })
  }

  const handleSearch = async (value: string) => {
    setSearchText(value)
    loadData({ isDeleted: showDeleted, searchTerm: value })
  }

  return {
    state: {
      roles,
      showDeleted,
      setShowDeleted,
      searchText,
      setSearchText,
      openModal,
      newRecord,
      setNewRecord,
      setOpenModal
    },
    service: {
      userService,
      userRoleService
    },
    action: {
      loadData,
      handleUpdate,
      handleSwitchDeleteChange,
      handleSwitchSortChange,
      handleSearch,
      handleAddNew,
      handlePageChange,
      handleDelete,
      handleDeleteForever,
      handleRestore
    },
    table
  }
}
