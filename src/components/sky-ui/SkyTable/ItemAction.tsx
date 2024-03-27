import { Button, Flex, Popconfirm } from 'antd'
import React, { HTMLAttributes } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '~/store/store'

interface Props extends HTMLAttributes<HTMLElement> {
  isEditing: boolean
  editingKey: React.Key
  onSaveClick?: React.MouseEventHandler<HTMLElement> | undefined
  onClickStartEditing?: React.MouseEventHandler<HTMLElement> | undefined
  onConfirmCancelEditing?: (e?: React.MouseEvent<HTMLElement>) => void
  onConfirmCancelDeleting?: (e?: React.MouseEvent<HTMLElement>) => void
  onConfirmDelete?: (e?: React.MouseEvent<HTMLElement>) => void
  onStartDeleting?: (e?: React.MouseEvent<HTMLElement>) => void
}

const ItemAction: React.FC<Props> = ({
  isEditing,
  editingKey,
  onSaveClick,
  onClickStartEditing,
  onConfirmCancelEditing,
  onConfirmCancelDeleting,
  onConfirmDelete,
  onStartDeleting,
  ...props
}) => {
  const user = useSelector((state: RootState) => state.user)

  return (
    <Flex {...props} className=''>
      <Flex align='center' justify='space-between'>
        {isEditing ? (
          <Flex gap={5}>
            <Button type='primary' onClick={onSaveClick}>
              Save
            </Button>
            <Popconfirm
              title={`Sure to cancel?`}
              okButtonProps={{
                size: 'middle'
              }}
              cancelButtonProps={{
                size: 'middle'
              }}
              placement='topLeft'
              onConfirm={onConfirmCancelEditing}
            >
              <Button type='dashed'>Cancel</Button>
            </Popconfirm>
          </Flex>
        ) : (
          <Flex gap={10}>
            {user.userRoles.includes('admin') && (
              <Button type='dashed' disabled={editingKey !== ''} onClick={onClickStartEditing}>
                Edit
              </Button>
            )}
            {user.userRoles.includes('admin') && (
              <Popconfirm title={`Sure to delete?`} onCancel={onConfirmCancelDeleting} onConfirm={onConfirmDelete}>
                <Button type='dashed' disabled={editingKey !== ''} onClick={onStartDeleting}>
                  Delete
                </Button>
              </Popconfirm>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}

export default ItemAction
