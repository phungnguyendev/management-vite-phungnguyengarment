import { createReducer } from '@reduxjs/toolkit'
import { setLoading } from '../actions-creator'

interface AppState {
  loading?: boolean
}

const initialState: AppState = {
  loading: false
}

const appReducer = createReducer(initialState, (builder) => {
  builder.addCase(setLoading, (state, action) => {
    state.loading = action.payload
  })
})

export default appReducer
