import { createReducer } from '@reduxjs/toolkit'
import { User, UserRoleType } from '~/typing'
import { setUserAction, setUserResetPasswordAction, setUserRoleAction } from '../actions-creator'

interface AppUser {
  user: User
  userRoles: UserRoleType[]
  userTemp: { user: User; isResetPassword: boolean }
}

const initialState: AppUser = {
  user: {},
  userRoles: [],
  userTemp: { user: {}, isResetPassword: false }
}

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(setUserAction, (state, action) => {
    state.user = action.payload
  })
  builder.addCase(setUserRoleAction, (state, action) => {
    state.userRoles = action.payload
  })
  builder.addCase(setUserResetPasswordAction, (state, action) => {
    state.userTemp = action.payload
  })
})

export default userReducer
