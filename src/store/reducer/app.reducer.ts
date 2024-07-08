import { createReducer } from '@reduxjs/toolkit'
import { setLanguage, setLoading } from '../actions-creator'

interface AppState {
  loading: boolean
  language?: 'vi' | 'en'
}

const initialState: AppState = {
  loading: false,
  language: 'en'
}

const appReducer = createReducer(initialState, (builder) => {
  builder.addCase(setLoading, (state, action) => {
    state.loading = action.payload
  })
  builder.addCase(setLanguage, (state, action) => {
    state.language = action.payload
  })
})

export default appReducer
