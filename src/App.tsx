import { Route, Routes } from 'react-router-dom'

import { Suspense } from 'react'
import Main from './components/layout/Main'
import LoginPage from './pages/authen/LoginPage'
import ResetPasswordPage from './pages/authen/ResetPasswordPage'
import VerifyEmailPage from './pages/authen/VerifyEmailPage'
import VerifyOTPPage from './pages/authen/VerifyOTPPage'
import { appRoutes } from './utils/route'

function App() {
  return (
    <>
      <div className='App'>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='login' element={<LoginPage />} />
            <Route path='verify-email' element={<VerifyEmailPage />} />
            <Route path='verify-otp' element={<VerifyOTPPage />} />
            <Route path='reset-password' element={<ResetPasswordPage />} />
            <Route element={<Main />}>
              {appRoutes.map((route, i) => {
                return (
                  <Route
                    id={route.key || i.toString()}
                    key={route.key}
                    path={route.path}
                    element={
                      <Suspense fallback={<div>loading...</div>}>
                        <route.component />
                      </Suspense>
                    }
                  />
                )
              })}
            </Route>
          </Routes>
        </Suspense>
      </div>
    </>
  )
}

export default App
