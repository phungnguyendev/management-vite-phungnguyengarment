import { Button, Flex, Input, Spin, Switch, Typography } from 'antd'
import { SwitchChangeEventHandler } from 'antd/es/switch'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import UserAPI from '~/api/services/UserAPI'
import useLocalStorage from '~/hooks/useLocalStorage'
import { setUserAction, setUserRoleAction } from '~/store/actions-creator'
import { User, UserRole, UserRoleType } from '~/typing'

interface ActionProps {
  onClick?: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void
  isShow?: boolean
  disabled?: boolean
}

interface Props extends React.HTMLAttributes<HTMLElement> {
  searchPlaceHolder?: string
  defaultSearchValue?: string | number | readonly string[] | undefined
  searchValue?: string | undefined
  onSearch?: (
    value: string,
    event?:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.KeyboardEvent<HTMLInputElement>
      | undefined,
    info?: {
      source?: 'clear' | 'input'
    }
  ) => void
  onLoading?: (enable: boolean) => void
  onSearchChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
  showDeleted?: boolean
  onSortChange?: SwitchChangeEventHandler
  onDeletedRecordStateChange?: SwitchChangeEventHandler
  onResetClick?: ActionProps
  onAddNewClick?: ActionProps
}

const { Search } = Input

const BaseLayout: React.FC<Props> = ({
  searchPlaceHolder,
  onSearchChange,
  searchValue,
  defaultSearchValue,
  onSearch,
  onSortChange,
  showDeleted,
  onDeletedRecordStateChange,
  onResetClick,
  onAddNewClick,
  children,
  onLoading,
  ...props
}) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [accessTokenStored] = useLocalStorage<string>('accessToken', '')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const callApi = async () => {
      try {
        onLoading?.(true)
        setLoading(true)
        if (accessTokenStored) {
          UserAPI.userRolesFromAccessToken(accessTokenStored)
            .then((meta) => {
              if (!meta?.success) throw new Error(meta?.message)

              const userRoles = meta.data as UserRole[]
              dispatch(
                setUserRoleAction(
                  userRoles.map((userRole) => {
                    return userRole.role?.role as UserRoleType
                  })
                )
              )
              dispatch(setUserAction(meta.meta as User))
            })
            .catch((error) => {
              console.error(error)
            })
        } else {
          navigate('/login')
        }
      } catch (error) {
        console.error(error)
      } finally {
        onLoading?.(false)
        setLoading(false)
      }
    }
    callApi()
  }, [])

  // useEffect(() => {
  //   if (!accessTokenStored) navigate('/login')
  // }, [accessTokenStored])

  return (
    <div {...props} className='w-full'>
      <Flex vertical gap={20} className='w-full'>
        {props.title && <Typography.Title level={2}>{props.title}</Typography.Title>}
        <Flex vertical gap={20} className='w-full'>
          {onSearch && (
            <Search
              placeholder={searchPlaceHolder ? searchPlaceHolder : 'Search...'}
              size='middle'
              enterButton
              className='w-full lg:hidden'
              name='search'
              allowClear
              value={searchValue}
              defaultValue={defaultSearchValue}
              onSearch={onSearch}
              onChange={onSearchChange}
            />
          )}
          <Flex justify='space-between' className='w-full' align='center'>
            <Flex gap={10} align='center' wrap='wrap'>
              {/* <Switch
                checkedChildren='Admin'
                unCheckedChildren='Admin'
                defaultChecked={false}
                checked={user.isAdmin}
                onChange={(val) => {
                  dispatch(setAdminAction(val))
                }}
              /> */}
              {onSortChange && (
                <Switch
                  checkedChildren='Sorted'
                  unCheckedChildren='Sorted'
                  defaultChecked={false}
                  onChange={onSortChange}
                />
              )}
              {onDeletedRecordStateChange && (
                <Switch
                  checkedChildren='Deleted'
                  unCheckedChildren='Deleted'
                  defaultChecked={showDeleted}
                  onChange={onDeletedRecordStateChange}
                />
              )}
              {onSearch && (
                <Search
                  placeholder={searchPlaceHolder ? searchPlaceHolder : 'Search...'}
                  size='middle'
                  enterButton
                  className='hidden w-[450px] lg:block'
                  name='search'
                  allowClear
                  value={searchValue}
                  defaultValue={defaultSearchValue}
                  onSearch={onSearch}
                  onChange={onSearchChange}
                />
              )}
            </Flex>
            <Flex gap={10} align='center' wrap='wrap' justify='flex-end'>
              {onResetClick?.isShow && (
                <Button onClick={onResetClick.onClick} className='flex items-center' type='default'>
                  Reset
                </Button>
              )}
              {onAddNewClick?.isShow && (
                <Button
                  onClick={onAddNewClick.onClick}
                  className='flex items-center'
                  type='primary'
                  icon={<Plus size={20} />}
                >
                  New
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
        {loading ? <Spin /> : children}
      </Flex>
    </div>
  )
}

export default BaseLayout
