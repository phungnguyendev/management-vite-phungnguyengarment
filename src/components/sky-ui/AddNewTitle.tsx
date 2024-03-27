import { ModalProps, Typography } from 'antd'

interface Props extends ModalProps {
  title: string
}

const AddNewTitle = ({ ...props }: Props) => {
  return <Typography.Title level={2}>{props.title}</Typography.Title>
}

export default AddNewTitle
