import { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import Main from './components/layout/Main'
import routes from './config/route.config'
import LoginPage from './pages/auth/LoginPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import { RootState } from './store/store'

function App() {
  const currentUser = useSelector((state: RootState) => state.user)

  return (
    <>
      <div className='App'>
        <Routes>
          <Route path='login' element={<LoginPage />} />
          <Route path='reset-password' element={<ResetPasswordPage />} />
          <Route element={<Main />}>
            {routes
              .filter((item) => (currentUser.role.includes('admin') ? true : currentUser.role.includes(item.role)))
              .map((route) => {
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
      </div>
    </>
  )
}

export default App
