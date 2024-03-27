import { Flex } from 'antd'
import React, { memo } from 'react'
import { ItemStatusType } from '~/typing'
import { dateFormatter } from '~/utils/date-formatter'
import { cn } from '~/utils/helpers'
import EditableStateCell, { EditableStateCellProps } from './EditableStateCell'
import SkyTableTypography from './SkyTableTypography'

interface Props extends EditableStateCellProps {
  label?: string | React.ReactNode
  children?: React.ReactNode
  status?: ItemStatusType
  render?: string | React.ReactNode
}

const ListItemRow = ({ ...props }: Props) => {
  return (
    <Flex className={cn('w-full', props.className)} align='center' justify='start' gap={5}>
      {typeof props.label !== 'string' ? (
        props.label
      ) : (
        <SkyTableTypography className='w-1/2 font-semibold'>{props.label}:</SkyTableTypography>
      )}
      <EditableStateCell {...props} title={props.title ? (typeof props.label === 'string' ? props.label : '') : ''}>
        {props.children ? (
          props.children
        ) : (
          <SkyTableTypography status={props.status}>
            {props.render
              ? props.render
              : props.inputType !== 'datepicker'
                ? props.value
                : dateFormatter(props.value, 'dateOnly')}
          </SkyTableTypography>
        )}
      </EditableStateCell>
    </Flex>
  )
}

export default memo(ListItemRow)
