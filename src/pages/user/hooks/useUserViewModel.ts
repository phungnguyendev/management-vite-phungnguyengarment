import { App as AntApp } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Paginator } from '~/api/client'
import RoleAPI from '~/api/services/RoleAPI'
import UserAPI from '~/api/services/UserAPI'
import UserRoleAPI from '~/api/services/UserRoleAPI'
import useTable from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Role, User, UserRole } from '~/typing'
import { arrayComparator, isValidArray, textComparator } from '~/utils/helpers'
import { UserAddNewProps } from '../components/ModalAddNewUser'
import { UserTableDataType } from '../type'
import define from '~/constants'

export default function useUserViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<UserTableDataType>([])
  // Services
  const userService = useAPIService<User>(UserAPI)
  const roleService = useAPIService<Role>(RoleAPI)
  const userRoleService = useAPIService<UserRole>(UserRoleAPI)

  // State changes
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [paginator, setPaginator] = useState<Paginator>({
    page: 1,
    pageSize: -1
  })
  const [shorted, setSorted] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<UserAddNewProps>({})

  // List
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [userRoles, setUserRoles] = useState<UserRole[]>([])

  useEffect(() => {
    loadData()
  }, [showDeleted, shorted, paginator, searchText])

  useEffect(() => {
    mappedData()
  }, [users, roles, userRoles])

  const mappedData = useCallback(() => {
    table.setDataSource(() => {
      const _dataSource = users.map((self) => {
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
      return _dataSource
    })
  }, [users, roles, userRoles])

  const loadData = async () => {
    try {
      await userService.getItemsSync(
        {
          paginator: paginator,
          sorting: { column: 'id', direction: shorted ? 'asc' : 'desc' },
          filter: { field: 'id', items: [-1], status: showDeleted ? 'deleted' : 'active' },
          search: { field: 'email', term: searchText }
        },
        table.setLoading,
        (res) => {
          if (!res.success) throw new Error(define('dataLoad_failed'))
          const data = res.data as User[]
          setUsers(data)
        }
      )

      await userRoleService.getItemsSync(
        {
          paginator: {
            page: 1,
            pageSize: -1
          }
        },
        table.setLoading,
        (res) => {
          if (!res.success) throw new Error(define('dataLoad_failed'))
          const data = res.data as UserRole[]
          setUserRoles(data)
        }
      )

      await roleService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('dataLoad_failed'))
        const data = res.data as Role[]
        setRoles(data)
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleUpdate = async (record: UserTableDataType) => {
    try {
      console.log({ record, newRecord })
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
          if (!meta?.success) throw new Error(define('update_failed'))
          const dataUpdated = meta.data as User
          newItemSource = { ...dataUpdated, key: record.key, roles: record.roles }
        })
      }
      const itemsToUpdate = newRecord.roleIDs?.map((roleID) => {
        return { userID: record.id, roleID } as UserRole
      })
      if (newRecord.roleIDs && newRecord.roleIDs.length <= 0) throw new Error(`User roles cannot be set blank!`)
      if (
        isValidArray(itemsToUpdate) &&
        arrayComparator(
          newRecord.roleIDs,
          record.roles.map((item) => {
            return item.id
          })
        )
      ) {
        await userRoleService.updateItemsSync(
          { field: 'userID', id: record.id! },
          itemsToUpdate,
          table.setLoading,
          (res) => {
            if (!res?.success) throw new Error(define('update_failed'))
            const dataUpdated = res.data as UserRole[]
            newItemSource = {
              ...newItemSource,
              roles: roles.filter((item) => dataUpdated.some((self) => self.roleID === item.id))
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

  const handleDeleteForever = async (id: number) => {
    try {
      table.setLoading(true)
      await userService.deleteItemSync(id, table.setLoading, (meta) => {
        if (!meta.success) throw new Error(`${define('delete_failed')}`)
        table.handleDeleting(`${id}`)
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
    setPaginator({ page, pageSize })
  }

  const handleSortChange = async (checked: boolean) => {
    setSorted(checked)
  }

  const handleSearch = async (value: string) => {
    setSearchText(value)
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
      handleSortChange,
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
