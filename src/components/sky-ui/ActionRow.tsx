import { Button, Flex, Popconfirm as PopConfirm } from 'antd'
import { ButtonType } from 'antd/es/button'
import { BaseButtonProps } from 'antd/es/button/button'
import React, { HTMLAttributes } from 'react'
import { cn } from '~/utils/helpers'

export interface ActionButtonProps<T extends { key?: React.Key }> extends BaseButtonProps {
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>, record?: T) => void
  isShow?: boolean | true
  title?: string
  disabled?: boolean
  type?: ButtonType
}

export interface ActionProps<T extends { key?: React.Key }> extends BaseButtonProps {
  isShow?: boolean
  disabled?: boolean
  onAdd?: ActionButtonProps<T>
  onSave?: ActionButtonProps<T>
  onEdit?: ActionButtonProps<T>
  onDelete?: ActionButtonProps<T>
  onRestore?: ActionButtonProps<T>
  onConfirmDelete?: (record: T) => void
  onConfirmRestore?: (record: T) => void
  onConfirmCancelEditing?: (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
  onConfirmCancelDeleting?: (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
  onConfirmCancelRestore?: (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
}

export interface ActionRowProps<T extends { key?: React.Key }> extends HTMLAttributes<HTMLElement> {
  isEditing?: boolean
  vertical?: boolean
  onAdd?: ActionButtonProps<T>
  onSave: ActionButtonProps<T>
  onEdit: ActionButtonProps<T>
  onDelete?: ActionButtonProps<T>
  onRestore?: ActionButtonProps<T>
  onConfirmCancelEditing?: (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
  onConfirmCancelDeleting?: (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
  onConfirmCancelRestore?: (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
  onConfirmDelete?: (e?: React.MouseEvent<HTMLElement>) => void
  onConfirmRestore?: (e?: React.MouseEvent<HTMLElement>) => void
}

const ActionRow = <T extends { key?: React.Key }>({ ...props }: ActionRowProps<T>) => {
  return (
    <Flex className={props.className}>
      <Flex align='center' justify='space-between'>
        {props.isEditing && props.onSave.isShow ? (
          <Flex className={cn('flex-col', props.className)} gap={5}>
            <Button type={props.onSave.type ? props.onSave.type : 'primary'} onClick={props.onSave.onClick}>
              Save
            </Button>
            <PopConfirm
              title={`Sure to cancel?`}
              okButtonProps={{
                size: 'middle'
              }}
              cancelButtonProps={{
                size: 'middle'
              }}
              placement='topLeft'
              onConfirm={props.onConfirmCancelEditing}
            >
              <Button type='dashed'>Cancel</Button>
            </PopConfirm>
          </Flex>
        ) : (
          <Flex gap={10} className={cn('flex-col', props.className)} justify='center'>
            {props.onAdd?.isShow && (
              <Button
                type={props.onAdd.type ? props.onAdd.type : 'primary'}
                disabled={props.onAdd.disabled}
                onClick={(e) => props.onAdd?.onClick?.(e)}
              >
                {props.onAdd.title ? props.onAdd.title : 'Add'}
              </Button>
            )}
            {props.onEdit.isShow && (
              <Button
                type={props.onEdit.type ? props.onEdit.type : 'primary'}
                disabled={props.onEdit.disabled}
                onClick={props.onEdit.onClick}
              >
                {props.onEdit.title ? props.onEdit.title : 'Edit'}
              </Button>
            )}
            {props.onDelete?.isShow && (
              <PopConfirm
                title={`Sure to ${props.onDelete.title ? props.onDelete.title : 'delete'}?`}
                onCancel={props.onConfirmCancelDeleting}
                onConfirm={props.onConfirmDelete}
              >
                <Button
                  type={props.onDelete.type ? props.onDelete.type : 'dashed'}
                  disabled={props.onDelete.disabled}
                  onClick={props.onDelete.onClick}
                >
                  {props.onDelete.title ? props.onDelete.title : 'Delete'}
                </Button>
              </PopConfirm>
            )}
            {props.onRestore?.isShow && (
              <PopConfirm
                title={`Sure to ${props.onRestore.title ? props.onRestore.title : 'restore'}?`}
                onCancel={props.onConfirmCancelRestore}
                onConfirm={props.onConfirmRestore}
              >
                <Button
                  type={props.onRestore.type ? props.onRestore.type : 'primary'}
                  disabled={props.onRestore.disabled}
                  onClick={props.onRestore.onClick}
                >
                  {props.onRestore.title ? props.onRestore.title : 'Restore'}
                </Button>
              </PopConfirm>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}

export default ActionRow
