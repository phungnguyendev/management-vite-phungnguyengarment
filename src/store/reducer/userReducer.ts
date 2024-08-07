import { createReducer } from '@reduxjs/toolkit'
import { User, UserRoleType } from '~/typing'
import { setUser, setUserRole } from '../actions-creator'

interface UserState {
  user?: User | null
  role?: UserRoleType[] | null
}

const initialState: UserState = {
  user: {},
  role: ['staff']
}

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(setUser, (state, action) => {
    state.user = action.payload
  })
  builder.addCase(setUserRole, (state, action) => {
    state.role = action.payload
  })
})

export default userReducer
