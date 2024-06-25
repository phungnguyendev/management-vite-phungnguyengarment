import { createAction } from '@reduxjs/toolkit'
import { User } from '~/typing'

export const setUser = createAction<User>('auth/user')
