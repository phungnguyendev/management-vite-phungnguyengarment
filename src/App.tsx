import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Main from './components/layout/Main'
import routes from './config/route.config'
import LoginPage from './pages/auth/LoginPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/reset-password' element={<ResetPasswordPage />} />
      <Route element={<Main />}>
        {routes.map((route) => {
          return (
            <Route
              id={route.key}
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
  )
}

export default App
