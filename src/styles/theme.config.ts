import { ThemeConfig } from 'antd'

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#ff6b00'
  },
  components: {
    Layout: {
      siderBg: '#ffffff',
      headerBg: 'var(--background)'
    },
    Button: {
      defaultColor: '#000000',
      textHoverBg: '#ffffff'
    }
  }
}

export default theme
