import { createAction } from '@reduxjs/toolkit'
import { User, UserRoleType } from '~/typing'

export const setUserAction = createAction<User>('user/setUser')

export const setUserRoleAction = createAction<UserRoleType[]>('user/setUserRoles')

export const setUserResetPasswordAction = createAction<{ user: User; isResetPassword: boolean }>('user/isResetPassword')
