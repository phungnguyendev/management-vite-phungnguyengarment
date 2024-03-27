import { Flex } from 'antd'
import React from 'react'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ShowDeleted: React.FC<Props> = ({ ...props }) => {
  return (
    <Flex {...props} className=''>
      Date creation
    </Flex>
  )
}

export default ShowDeleted
