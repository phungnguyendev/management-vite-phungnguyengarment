import type { ModalProps } from 'antd'
import { Flex, Modal, Typography } from 'antd'
import React from 'react'
import { cn } from '~/utils/helpers'

export interface SkyModalProps extends ModalProps {
  setOpenModal: (enable: boolean) => void
}

const SkyModal: React.FC<SkyModalProps> = ({ setOpenModal, ...props }) => {
  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    props.onCancel?.(e)
    setOpenModal(false)
  }

  return (
    <Modal
      {...props}
      title={
        typeof props.title === 'string' ? (
          <Typography.Title className='pb-5' level={2}>
            {props.title}
          </Typography.Title>
        ) : (
          props.title
        )
      }
      onCancel={handleCancel}
      centered
      width={props.width ?? 1200}
      className={cn('z-10 w-full', props.className)}
    >
      <Flex vertical gap={20}>
        {props.children}
      </Flex>
    </Modal>
  )
}

export default SkyModal
