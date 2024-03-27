import { useState } from 'react'

const useLocalStorage = <T>(key: string, initialValue?: T | null) => {
  // Sử dụng useState để lấy giá trị từ local storage, nếu không có thì sử dụng giá trị khởi tạo
  const [storedValue, setStoredValue] = useState<T | null>(() => {
    try {
      // Lấy dữ liệu từ local storage bằng key
      const item = window.localStorage.getItem(key)
      // Parse dữ liệu từ JSON
      return item ? JSON.parse(item) : initialValue ?? null
    } catch (error) {
      // Nếu có lỗi, trả về giá trị khởi tạo
      console.error(error)
      return initialValue ?? null
    }
  })

  // Hàm để thiết lập giá trị mới cho local storage
  const setValue = (value?: T | null) => {
    try {
      if (value) {
        // Nếu value là một hàm, thì cập nhật giá trị mới bằng cách sử dụng hàm đó
        const valueToStore = value instanceof Function ? value(storedValue) : value
        // Lưu giá trị vào local storage
        setStoredValue(valueToStore)
        // Stringify giá trị trước khi lưu vào local storage
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } else {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Trả về cặp giá trị và hàm để thiết lập giá trị mới
  return [storedValue, setValue] as const
}

export default useLocalStorage
