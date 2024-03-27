import { Flex, Input, List, Typography } from 'antd'
import { useSelector } from 'react-redux'
import { RootState } from '~/store/store'
import { ItemStatusType } from '~/typing'
import { dateFormatter } from '~/utils/date-formatter'
import ActionRow, { ActionProps } from '../ActionRow'
import EditableStateCell, { EditableStateCellProps } from '../SkyTable/EditableStateCell'
import SkyTableTypography from '../SkyTable/SkyTableTypography'

export interface SkyListItemProps<
  T extends { key?: React.Key; status?: ItemStatusType | null; createdAt?: string; updatedAt?: string }
> extends EditableStateCellProps {
  record: T
  label?: string | null
  labelEditing?: boolean
  isShowDeleted?: boolean
  actions?: ActionProps<T>
  children?: React.ReactNode
}

const SkyListItem = <
  T extends { key?: React.Key; status?: ItemStatusType | null; createdAt?: string; updatedAt?: string }
>({
  record,
  label,
  labelEditing,
  isShowDeleted,
  actions,
  children,
  ...props
}: SkyListItemProps<T>) => {
  const currentUser = useSelector((state: RootState) => state.user)

  return (
    <List.Item className='mb-5 rounded-sm bg-white'>
      <Flex vertical className='w-full' gap={10}>
        <Flex align='center' justify='space-between' gap={10}>
          <Flex>
            <EditableStateCell
              {...props}
              isEditing={(labelEditing && props.isEditing && currentUser.userRoles.includes('admin')) ?? false}
            >
              <SkyTableTypography className='text-lg font-semibold' status={record.status}>
                {label}
              </SkyTableTypography>
            </EditableStateCell>
          </Flex>

          <ActionRow
            className='flex-row'
            isEditing={props.isEditing}
            onAdd={{
              onClick: (e) => actions?.onAdd?.onClick?.(e, record),
              disabled: actions?.onAdd?.disabled ?? props.isEditing,
              isShow: actions?.onAdd ? actions.onAdd.isShow ?? true : false
            }}
            onSave={{
              onClick: (e) => actions?.onSave?.onClick?.(e, record),
              disabled: actions?.onSave?.disabled ?? props.isEditing,
              isShow: actions?.onSave ? actions.onSave.isShow ?? true : false
            }}
            onEdit={{
              onClick: (e) => actions?.onEdit?.onClick?.(e, record),
              disabled: actions?.onEdit?.disabled ?? props.isEditing,
              isShow: actions?.onEdit ? actions.onEdit.isShow ?? true : false
            }}
            onDelete={{
              onClick: (e) => actions?.onDelete?.onClick?.(e, record),
              disabled: actions?.onDelete?.disabled ?? props.isEditing,
              isShow: actions?.onDelete ? actions.onDelete.isShow ?? true : false
            }}
            onConfirmCancelEditing={actions?.onConfirmCancelEditing}
            onConfirmCancelDeleting={actions?.onConfirmCancelDeleting}
            onConfirmDelete={() => actions?.onConfirmDelete?.(record)}
          />
        </Flex>
        {children}
        {currentUser.userRoles.includes('admin') && isShowDeleted && (
          <Flex vertical gap={10}>
            <Flex className='w-full' align='center' justify='start' gap={5}>
              <Typography.Text type='secondary' className='w-40 font-medium'>
                Created at
              </Typography.Text>
              <Input
                name='createdAt'
                className='w-full'
                defaultValue={record?.createdAt && dateFormatter(record.createdAt, 'dateOnly')}
                readOnly
              />
            </Flex>
            <Flex className='w-full' align='center' justify='start' gap={5}>
              <Typography.Text type='secondary' className='w-40 font-medium'>
                Updated at
              </Typography.Text>
              <Input
                name='createdAt'
                className='w-full'
                defaultValue={record?.updatedAt && dateFormatter(record.updatedAt, 'dateOnly')}
                readOnly
              />
            </Flex>
          </Flex>
        )}
      </Flex>
    </List.Item>
  )
}

export default SkyListItem
