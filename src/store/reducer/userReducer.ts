import { createReducer } from '@reduxjs/toolkit'
import { User } from '~/typing'
import { setUser } from '../actions-creator'

interface UserState {
  user?: User
}

const initialState: UserState = {
  user: {}
}

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(setUser, (state, action) => {
    state.user = action.payload
  })
})

export default userReducer
