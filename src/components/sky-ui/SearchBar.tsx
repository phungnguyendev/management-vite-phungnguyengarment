import { Input } from 'antd'
import { SearchProps } from 'antd/es/input'
import React, { useState } from 'react'

const { Search } = Input

const SearchBar: React.FC<SearchProps> = ({ ...props }) => {
  const [searchText, setSearchText] = useState<string>('')

  return (
    <>
      <Search
        {...props}
        placeholder={props.placeholder ?? 'Search...'}
        size='large'
        enterButton
        name='search'
        allowClear
        value={props.value ?? searchText}
        onChange={(e) => {
          props.onChange?.(e)
          setSearchText(e.target.value)
        }}
      />
    </>
  )
}

export default SearchBar
