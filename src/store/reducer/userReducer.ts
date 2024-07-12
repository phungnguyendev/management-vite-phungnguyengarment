import { createReducer } from '@reduxjs/toolkit'
import { User, UserRoleType } from '~/typing'
import { setUser, setUserRole } from '../actions-creator'

interface UserState {
  user: User
  roles: UserRoleType[]
}

const initialState: UserState = {
  user: {},
  roles: []
}

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(setUser, (state, action) => {
    state.user = action.payload
  })
  builder.addCase(setUserRole, (state, action) => {
    state.roles = action.payload
  })
})

export default userReducer
