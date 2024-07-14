import { Button, Flex, Popconfirm as PopConfirm } from 'antd'
import { ButtonType } from 'antd/es/button'
import React, { HTMLAttributes } from 'react'
import { cn } from '~/utils/helpers'

export interface ActionRowButtonProps {
  isShow?: boolean | true
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  title?: string
  disabled?: boolean
  type?: ButtonType
}

export interface ActionRowPopConfirmProps {
  isShow?: boolean | true
  title?: string
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export interface SkyTableActionRowProps<T extends { key: string }> extends HTMLAttributes<HTMLElement> {
  record: T
  addingKey?: string
  editingKey: string
  deletingKey: string
  buttonAdd?: ActionRowButtonProps
  buttonSave?: ActionRowButtonProps
  buttonEdit?: ActionRowButtonProps
  buttonDelete?: ActionRowButtonProps
  buttonDeleteForever?: ActionRowButtonProps
  buttonRestore?: ActionRowButtonProps
  onConfirmDelete?: (e?: React.MouseEvent<HTMLElement>) => void
  onConfirmRestore?: (e?: React.MouseEvent<HTMLElement>) => void
  onConfirmDeleteForever?: (e?: React.MouseEvent<HTMLElement>) => void
  onConfirmCancelEditing?: (e?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
  onCancelAdding?: (e?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
  onConfirmCancelDeleting?: (e?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
  onConfirmCancelRestore?: (e?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
  onConfirmCancelDeleteForever?: (e?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
}

const SkyTableActionRow = <T extends { key: string }>({ record, ...props }: SkyTableActionRowProps<T>) => {
  const isEditing = props.editingKey === record.key

  const isShowButton = (option?: ActionRowButtonProps): option is ActionRowButtonProps => {
    return option ? option.isShow ?? true : false
  }

  const isDisableButton = (option?: ActionRowButtonProps): boolean => {
    return option ? option.disabled ?? isEditing : false
  }

  return (
    <>
      <Flex className={props.className}>
        <Flex align='center' justify='space-between'>
          {isEditing && isShowButton(props.buttonSave) ? (
            <Flex className={cn('flex-col', props.className)} gap={5}>
              <Button
                type={props.buttonSave?.type ?? 'primary'}
                onClick={props.buttonSave?.onClick}
                disabled={props.buttonSave.disabled ?? false}
              >
                Save
              </Button>
              <PopConfirm title={`Sure to cancel?`} placement='topLeft' onConfirm={props.onConfirmCancelEditing}>
                <Button type='dashed'>Cancel</Button>
              </PopConfirm>
            </Flex>
          ) : (
            <Flex gap={10} className={cn('flex-col', props.className)} justify='center'>
              {isShowButton(props.buttonAdd) && (
                <Button
                  type={props.buttonAdd.type ?? 'primary'}
                  onClick={props.buttonAdd.onClick}
                  disabled={props.buttonAdd.disabled ?? isDisableButton(props.buttonAdd)}
                >
                  {props.buttonAdd.title ?? 'Add'}
                </Button>
              )}
              {isShowButton(props.buttonEdit) && (
                <Button
                  type={props.buttonEdit.type ?? 'primary'}
                  disabled={props.buttonEdit.disabled ?? (props.editingKey !== '' && record.key !== props.editingKey)}
                  onClick={props.buttonEdit.onClick}
                >
                  {props.buttonEdit.title ?? 'Edit'}
                </Button>
              )}
              {isShowButton(props.buttonDelete) && (
                <PopConfirm
                  title={`Sure to ${props.buttonDelete.title ?? 'delete'}?`}
                  onCancel={props.onConfirmCancelDeleting}
                  onConfirm={props.onConfirmDelete}
                >
                  <Button
                    type={props.buttonDelete.type ?? 'dashed'}
                    disabled={
                      props.buttonDelete.disabled ?? (props.editingKey !== '' && record.key !== props.editingKey)
                    }
                    onClick={props.buttonDelete.onClick}
                  >
                    {props.buttonDelete.title ?? 'Delete'}
                  </Button>
                </PopConfirm>
              )}
              {isShowButton(props.buttonRestore) && (
                <PopConfirm
                  title={`Sure to ${props.buttonRestore.title ?? 'restore'}?`}
                  onCancel={props.onConfirmCancelRestore}
                  onConfirm={props.onConfirmRestore}
                >
                  <Button
                    type={props.buttonRestore.type ?? 'primary'}
                    disabled={props.buttonRestore.disabled ?? isDisableButton(props.buttonRestore)}
                    onClick={props.buttonRestore.onClick}
                  >
                    {props.buttonRestore.title ?? 'Restore'}
                  </Button>
                </PopConfirm>
              )}
              {isShowButton(props.buttonDeleteForever) && (
                <PopConfirm
                  title={`Sure to ${props.buttonDeleteForever.title ?? 'delete forever'}?`}
                  onCancel={props.onConfirmCancelDeleteForever}
                  onConfirm={props.onConfirmDeleteForever}
                >
                  <Button
                    type={props.buttonDeleteForever.type ?? 'dashed'}
                    disabled={props.buttonDeleteForever.disabled ?? isDisableButton(props.buttonDeleteForever)}
                    onClick={props.buttonDeleteForever.onClick}
                  >
                    {props.buttonDeleteForever.title ?? 'Delete forever'}
                  </Button>
                </PopConfirm>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  )
}

export default SkyTableActionRow
