import { createReducer } from '@reduxjs/toolkit'
import { User } from '~/typing'
import { setUser } from '../actions-creator'

interface AppUser {
  user?: User
}

const initialState: AppUser = {
  user: {}
}

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(setUser, (state, action) => {
    state.user = action.payload
  })
})

export default userReducer
