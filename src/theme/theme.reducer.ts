export type ThemeActionType = 'HANDLE_SET_DARK_THEME' | 'HANDLE_SET_LIGHT_THEME' | 'HANDLE_TOGGLE_THEME'

export type ThemeType = 'dark' | 'light' | 'os'

export interface ThemeAction {
  type: ThemeActionType
  payload: ThemeType
}

export interface ThemeState {
  theme: 'dark' | 'light' | 'os'
}

const initState: ThemeState = {
  theme: 'light'
}

const themeReducer = (state: ThemeState = initState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    // Dark theme action
    case 'HANDLE_SET_DARK_THEME':
      return {
        ...state,
        theme: action.payload
      }
    // Light theme action
    case 'HANDLE_SET_LIGHT_THEME':
      return {
        ...state,
        theme: action.payload
      }
    // Default theme action
    default:
      return {
        ...state,
        theme: action.payload
      }
  }
}

export default themeReducer
