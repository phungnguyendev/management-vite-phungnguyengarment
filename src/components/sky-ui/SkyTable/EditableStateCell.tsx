import {
  Button,
  Checkbox,
  CheckboxProps,
  ColorPicker,
  ColorPickerProps,
  DatePicker,
  Flex,
  Input,
  InputNumber,
  InputNumberProps,
  Select,
  Switch,
  SwitchProps,
  Table,
  Typography
} from 'antd'
import { InputProps, TextAreaProps } from 'antd/es/input'
import { SelectProps } from 'antd/es/select'
import { DatePickerProps } from 'antd/lib'
import { Eye, EyeOff } from 'lucide-react'
import { HTMLAttributes, memo, useState } from 'react'
import { InputType } from '~/typing'
import dayjs, { dateFormatter } from '~/utils/date-formatter'
import { cn, extractHexCode } from '~/utils/helpers'

export interface EditableStateCellProps extends HTMLAttributes<HTMLElement> {
  isEditing?: boolean
  dataIndex?: string
  value?: any
  setLoading?: (enable: boolean) => void
  defaultValue?: any
  onValueChange?: (value: any, option?: any) => void
  selectProps?: SelectProps
  colorPickerProps?: ColorPickerProps
  checkboxProps?: CheckboxProps
  inputNumberProps?: InputNumberProps
  textAreaProps?: TextAreaProps
  inputProps?: InputProps
  switchProps?: SwitchProps
  datePickerProps?: DatePickerProps
  inputType?: InputType
  required?: boolean
  allowClear?: boolean
  title?: string
  placeholder?: string
  disabled?: boolean
  subtitle?: string
  readonly?: boolean
  editableRender?: React.ReactNode
}

export type EditableTableProps = Parameters<typeof Table>[0]

function EditableStateCell({
  isEditing,
  dataIndex,
  title,
  placeholder,
  allowClear,
  value,
  colorPickerProps,
  datePickerProps,
  checkboxProps,
  inputNumberProps,
  textAreaProps,
  selectProps,
  switchProps,
  inputProps,
  defaultValue,
  onValueChange,
  required,
  inputType,
  disabled,
  readonly,
  editableRender,
  ...restProps
}: EditableStateCellProps) {
  const [visible, setVisible] = useState<boolean>(false)

  const inputNode = ((): React.ReactNode => {
    switch (inputType) {
      case 'colorPicker':
        return (
          <ColorPicker
            {...colorPickerProps}
            onChange={(val, hex) => onValueChange?.(val, hex)}
            defaultFormat='hex'
            defaultValue={defaultValue ?? colorPickerProps?.defaultValue ?? ''}
            value={value ?? colorPickerProps?.value ?? ''}
            showText
            disabled={disabled}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'switch':
        return <Switch {...switchProps} />
      case 'checkbox':
        return (
          <Checkbox
            {...checkboxProps}
            required={required}
            title={title}
            name={dataIndex}
            // defaultChecked={defaultValue ?? checkboxProps?.defaultChecked ?? undefined}
            checked={value ?? checkboxProps?.value ?? defaultValue ?? checkboxProps?.defaultChecked ?? undefined}
            disabled={disabled}
            onChange={(val) => onValueChange?.(val.target.checked)}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'number':
        return (
          <InputNumber
            {...inputNumberProps}
            name={dataIndex}
            title={title}
            type='number'
            required={required}
            placeholder={placeholder}
            value={value ?? inputNumberProps?.value ?? ''}
            disabled={disabled}
            readOnly={readonly}
            onChange={(val) => onValueChange?.(val)}
            defaultValue={defaultValue ?? inputNumberProps?.defaultValue ?? ''}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'textarea':
        return (
          <Input.TextArea
            {...textAreaProps}
            title={title}
            placeholder={`${placeholder}`}
            name={dataIndex}
            value={value ?? textAreaProps?.value ?? ''}
            disabled={disabled}
            readOnly={readonly}
            required={required}
            onChange={(val) => onValueChange?.(val.target.value)}
            defaultValue={defaultValue ?? textAreaProps?.defaultValue ?? ''}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'select':
        return (
          <Select
            {...selectProps}
            title={title}
            placeholder={placeholder ?? 'Select item'}
            defaultValue={defaultValue ?? selectProps?.defaultValue}
            value={value ?? selectProps?.value}
            onChange={(val, option) => onValueChange?.(val, option)}
            disabled={disabled}
            virtual={false}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'multipleSelect':
        return (
          <Select
            {...selectProps}
            title={title}
            placeholder={placeholder ?? 'Select item'}
            mode='multiple'
            virtual={false}
            defaultValue={defaultValue ?? selectProps?.defaultValue}
            value={value ?? selectProps?.value}
            disabled={disabled}
            onChange={(val: number[], option) => onValueChange?.(val, option)}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'colorSelector':
        return (
          <Select
            {...selectProps}
            title={title}
            placeholder={placeholder}
            defaultValue={defaultValue ?? selectProps?.defaultValue}
            value={value ?? selectProps?.value}
            onChange={(val, option) => onValueChange?.(val, option)}
            disabled={disabled}
            virtual={false}
            className={cn('w-full', restProps.className)}
            optionRender={(ori, info) => {
              return (
                <>
                  <Flex justify='space-between' align='center' key={info.index}>
                    <Typography.Text>{ori.label}</Typography.Text>
                    <div
                      className='h-6 w-6 rounded-sm'
                      style={{
                        backgroundColor: `${extractHexCode(`${ori.key}`)}`
                      }}
                    />
                  </Flex>
                </>
              )
            }}
          />
        )
      case 'datepicker':
        return (
          <DatePicker
            {...datePickerProps}
            title={title}
            placeholder={placeholder ?? `Ví dụ: ${dateFormatter(Date.now())}`}
            name={dataIndex}
            required={required}
            onChange={(val) => val && onValueChange?.(val)}
            disabled={disabled}
            defaultValue={defaultValue}
            format={datePickerProps?.format ?? 'DD/MM/YYYY'}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'dateTimePicker':
        return (
          <DatePicker
            {...datePickerProps}
            title={title}
            placeholder={placeholder ?? `Ví dụ: ${dateFormatter(Date.now())}`}
            name={dataIndex}
            required={required}
            onChange={(val) => val && onValueChange?.(val)}
            disabled={disabled}
            showTime={{ defaultOpenValue: dayjs('00:00:00', 'HH:mm:ss') }}
            defaultValue={defaultValue}
            format={datePickerProps?.format ?? 'DD/MM/YYYY - HH:mm A'}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'password':
        return (
          <Input
            {...inputProps}
            required
            placeholder={placeholder ?? 'Ví dụ: Abc@@123??'}
            name={dataIndex}
            type={visible ? 'text' : 'password'}
            onChange={(event) => onValueChange?.(event.target.value)}
            defaultValue={defaultValue ?? inputProps?.defaultValue ?? ''}
            value={value ?? inputProps?.value ?? ''}
            disabled={disabled}
            readOnly={readonly}
            autoComplete='give-text'
            allowClear={allowClear}
            suffix={
              <Button onClick={() => setVisible((prev) => !prev)} type='link' className='p-2'>
                {visible ? <Eye color='var(--foreground)' size={16} /> : <EyeOff size={16} color='var(--foreground)' />}
              </Button>
            }
            className={cn('w-full', restProps.className)}
          />
        )

      case 'email':
        return (
          <Input
            {...inputProps}
            required
            title={title}
            placeholder={placeholder ?? 'Ví dụ: nguyenvana@gmail.com'}
            name={dataIndex}
            type='email'
            autoComplete='give-text'
            allowClear={allowClear}
            onChange={(event) => onValueChange?.(event.target.value)}
            defaultValue={defaultValue ?? inputProps?.defaultValue ?? ''}
            value={value ?? inputProps?.value ?? ''}
            disabled={disabled}
            readOnly={readonly}
            className={cn('w-full', restProps.className)}
          />
        )
      default:
        return (
          <Input
            {...inputProps}
            required={required}
            title={title}
            placeholder={placeholder}
            name={dataIndex}
            autoComplete='give-text'
            allowClear={allowClear}
            onChange={(event) => onValueChange?.(event.target.value)}
            defaultValue={defaultValue ?? inputProps?.defaultValue ?? ''}
            value={value ?? inputProps?.value ?? ''}
            disabled={disabled}
            readOnly={readonly}
            className={cn('w-full', restProps.className)}
          />
        )
    }
  })()

  return <>{isEditing ? editableRender ? editableRender : inputNode : <>{restProps.children}</>}</>
}

export default memo(EditableStateCell)
