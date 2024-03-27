import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import RoleAPI from '~/api/services/RoleAPI'
import UserAPI from '~/api/services/UserAPI'
import UserRoleAPI from '~/api/services/UserRoleAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { RootState } from '~/store/store'
import { Role, User, UserRole } from '~/typing'
import { textComparator } from '~/utils/helpers'
import { UserNewRecordProps, UserTableDataType } from '../type'

export default function useUser(table: UseTableProps<UserTableDataType>) {
  const { setLoading, setDataSource, handleConfirmCancelEditing, handleConfirmDeleting } = table
  const currentUser = useSelector((state: RootState) => state.user)
  // Services
  const userService = useAPIService<User>(UserAPI)
  const roleService = useAPIService<Role>(RoleAPI)
  const userRoleService = useAPIService<UserRole>(UserRoleAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<UserNewRecordProps>({})

  // List
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [userRoles, setUserRoles] = useState<UserRole[]>([])

  const loadData = async () => {
    try {
      setLoading(true)
      try {
        await userService.getListItems(
          {
            ...defaultRequestBody,
            paginator: { page: userService.page, pageSize: defaultRequestBody.paginator?.pageSize }
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              setUsers(meta.data as User[])
            }
          }
        )
      } catch (error: any) {
        const resError: ResponseDataType = error
        throw resError
      }

      try {
        await userRoleService.getListItems(
          { ...defaultRequestBody, paginator: { page: 1, pageSize: -1 } },
          setLoading,
          (meta) => {
            if (!meta?.success) throw new Error(`${meta?.message}`)
            setUserRoles(meta.data as UserRole[])
          }
        )
      } catch (error: any) {
        const resError: ResponseDataType = error
        throw resError
      }

      try {
        await roleService.getListItems(
          { ...defaultRequestBody, paginator: { page: 1, pageSize: -1 } },
          setLoading,
          (meta) => {
            if (meta?.success) {
              setRoles(meta.data as Role[])
            }
          }
        )
      } catch (error: any) {
        const resError: ResponseDataType = error
        throw resError
      }
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [currentUser.user.accessToken])

  useEffect(() => {
    selfConvertDataSource(users, userRoles)
  }, [users, userRoles])

  const selfConvertDataSource = (_users: User[], _userRoles?: UserRole[]) => {
    const items = _users ? _users : users
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          key: item.id,
          userRoles: (_userRoles ? _userRoles : userRoles).filter((userRole) => userRole.userID === item.id)
        } as UserTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<UserTableDataType>) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    try {
      if (newRecord) {
        setLoading(true)
        if (
          !record.email ||
          textComparator(newRecord.email, record.email) ||
          !record.password ||
          textComparator(newRecord.password, record.password) ||
          !record.fullName ||
          textComparator(newRecord.fullName, record.fullName) ||
          !record.phone ||
          textComparator(newRecord.phone, record.phone) ||
          !record.workDescription ||
          textComparator(newRecord.workDescription, record.workDescription) ||
          !record.avatar ||
          textComparator(newRecord.avatar, record.avatar) ||
          !record.birthday ||
          textComparator(newRecord.birthday, record.birthday)
        ) {
          console.log('User progressing...')
          try {
            await userService.updateItemByPk(record.id!, { ...newRecord }, setLoading, (meta) => {
              if (!meta?.success) throw new Error('API update group failed')
            })
          } catch (error: any) {
            const resError: ResponseDataType = error
            throw resError
          }
        }
        try {
          await UserRoleAPI.updateIDsBy?.(
            { field: 'userID', key: record.id! },
            newRecord.userRoles!.map((item) => {
              return item.roleID
            }) as number[],
            currentUser.user.accessToken!
          ).then((meta) => {
            if (!meta?.success) throw new Error('API update UserRole failed')
          })
        } catch (error: any) {
          const resError: ResponseDataType = error
          throw resError
        }

        message.success('Success!')
      }
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      handleConfirmCancelEditing()
      loadData()
      setLoading(false)
    }
  }

  const handleAddNewItem = async (formAddNew: any) => {
    try {
      console.log(formAddNew)
      const userNew: User = { ...formAddNew }
      // const rolesNew: Role[] = (formAddNew.roles as number[]).map((roleID) => {
      //   return roles.find((role) => role.id === roleID) as Role
      // })
      const newRoleIDs: number[] = formAddNew.roles as number[]
      setLoading(true)
      await userService.createNewItem(
        {
          ...userNew
        },
        setLoading,
        async (meta, msg) => {
          const newUser = meta?.data as User
          console.log(newUser)
          if (!meta?.success) throw new Error(msg)
          try {
            await UserRoleAPI.updateIDsBy?.(
              { field: 'userID', key: newUser.id! },
              newRoleIDs,
              currentUser.user.accessToken ?? ''
            ).then((meta) => {
              if (!meta?.success) throw new Error(`${meta?.message}`)
            })
            message.success(msg)
          } catch (error: any) {
            const resError: ResponseDataType = error
            throw resError
          }
        }
      )
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
      setOpenModal(false)
      loadData()
    }
  }

  const handleConfirmDelete = async (
    record: TableItemWithKey<UserTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      setLoading(true)
      await userService.deleteItemByPk(record.id!, setLoading, (meta, msg) => {
        if (!meta?.success) throw new Error(`${msg}`)
        handleConfirmDeleting(record.id!)
        message.success(msg)
        onDataSuccess?.(meta)
      })
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = async (_page: number) => {
    try {
      setLoading(true)
      await userService.pageChange(
        _page,
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as User[])
          }
        },
        { field: 'fullName', term: searchText }
      )
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleResetClick = async () => {
    try {
      setLoading(true)
      setSearchText('')
      await userService.getListItems(defaultRequestBody, setLoading, (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as User[])
        }
      })
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = async (checked: boolean) => {
    try {
      setLoading(true)
      await userService.sortedListItems(
        checked ? 'asc' : 'desc',
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as User[])
          }
        },
        { field: 'fullName', term: searchText }
      )
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (value: string) => {
    try {
      setLoading(true)
      if (value.length > 0) {
        await userService.getListItems(
          {
            ...defaultRequestBody,
            search: {
              field: 'fullName',
              term: value
            }
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              selfConvertDataSource(meta?.data as User[])
            }
          }
        )
      }
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  return {
    searchText,
    setSearchText,
    openModal,
    loadData,
    newRecord,
    setNewRecord,
    setLoading,
    setOpenModal,
    setDataSource,
    userService,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    selfConvertDataSource,
    handlePageChange,
    handleSortChange,
    handleResetClick,
    handleSearch,
    userRoles,
    roles
  }
}
