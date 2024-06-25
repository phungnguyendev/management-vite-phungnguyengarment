import { configureStore } from '@reduxjs/toolkit'
import userReducer from '~/store/reducer/userReducer'
import appReducer from './reducer/app.reducer'

export const store = configureStore({
  reducer: { user: userReducer, app: appReducer }
})

// Lấy RootState và AppDispatch từ store chung
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
