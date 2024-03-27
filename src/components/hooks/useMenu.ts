import { useState } from 'react'

const useMenu = (defaultKey: string) => {
  const [keys, setKeys] = useState<string[]>([`${defaultKey}`])

  // useEffect(() => {}, [])

  return [keys, setKeys]
}

export default useMenu
