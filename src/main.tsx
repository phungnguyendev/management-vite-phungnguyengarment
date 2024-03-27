import { App as AntApp, ConfigProvider } from 'antd'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import '~/styles/global.css'
import { store } from './store/store.ts'
import theme from './styles/theme.config.ts'

import 'dayjs/locale/vi'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <Router>
      <ConfigProvider theme={theme}>
        <AntApp>
          <App />
        </AntApp>
      </ConfigProvider>
    </Router>
  </Provider>
  // </React.StrictMode>
)
