import { createAction } from '@reduxjs/toolkit'
import { User, UserRoleType } from '~/typing'

export const setUser = createAction<User>('auth/user')

export const setUserRole = createAction<UserRoleType[]>('auth/userRole')

export const setLoading = createAction<boolean>('app/loading')

export const setLanguage = createAction<'vi' | 'en'>('app/language')
