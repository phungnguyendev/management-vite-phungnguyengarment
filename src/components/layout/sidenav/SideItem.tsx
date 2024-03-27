import { Divider, Flex, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { SideType } from '~/utils/route'

const SideItem = (item: SideType) => {
  return (
    <>
      {item.isGroup ? (
        <Flex vertical>
          <Divider />
          <Typography.Text type='secondary'>{item.name}</Typography.Text>
        </Flex>
      ) : (
        <Link to={item.path}>
          <span>{item.name}</span>
        </Link>
      )}
    </>
  )
}

export default SideItem
