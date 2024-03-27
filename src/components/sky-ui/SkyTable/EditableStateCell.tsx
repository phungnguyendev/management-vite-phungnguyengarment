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
  Table,
  Typography
} from 'antd'
import { InputProps, TextAreaProps } from 'antd/es/input'
import { SelectProps } from 'antd/es/select'
import { DatePickerProps } from 'antd/lib'
import { Eye, EyeOff } from 'lucide-react'
import { HTMLAttributes, memo, useState } from 'react'
import { InputType } from '~/typing'
import { cn } from '~/utils/helpers'

export interface EditableStateCellProps extends HTMLAttributes<HTMLElement> {
  isEditing: boolean
  dataIndex?: string
  value?: any
  setLoading?: (enable: boolean) => void
  initialValue?: any
  onValueChange?: (value: any, option?: any) => void
  selectProps?: SelectProps
  colorPickerProps?: ColorPickerProps
  checkboxProps?: CheckboxProps
  inputNumberProps?: InputNumberProps
  textAreaProps?: TextAreaProps
  inputProps?: InputProps
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
  inputProps,
  initialValue,
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
      case 'colorpicker':
        return (
          <ColorPicker
            {...colorPickerProps}
            onChange={(val, hex) => onValueChange?.(val, hex)}
            defaultFormat='hex'
            defaultValue={initialValue ?? colorPickerProps?.defaultValue ?? ''}
            value={value ?? colorPickerProps?.value ?? ''}
            showText
            disabled={disabled}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'checkbox':
        return (
          <Checkbox
            {...checkboxProps}
            required={required}
            title={title}
            name={dataIndex}
            // defaultChecked={initialValue ?? checkboxProps?.defaultChecked ?? undefined}
            checked={value ?? checkboxProps?.value ?? initialValue ?? checkboxProps?.defaultChecked ?? undefined}
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
            defaultValue={initialValue ?? inputNumberProps?.defaultValue ?? ''}
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
            defaultValue={initialValue ?? textAreaProps?.defaultValue ?? ''}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'select':
        return (
          <Select
            {...selectProps}
            title={title}
            placeholder={placeholder}
            defaultValue={initialValue ?? selectProps?.defaultValue}
            // value={value ?? selectProps?.value ?? ''}
            onChange={(val, option) => onValueChange?.(val, option)}
            disabled={disabled}
            virtual={false}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'multipleselect':
        return (
          <Select
            {...selectProps}
            title={title}
            placeholder={placeholder}
            mode='multiple'
            virtual={false}
            defaultValue={initialValue ?? selectProps?.defaultValue}
            // value={value ?? selectProps?.value ?? ''}
            disabled={disabled}
            onChange={(val: number[], option) => onValueChange?.(val, option)}
            className='w-full'
          />
        )
      case 'colorselector':
        return (
          <Select
            {...selectProps}
            title={title}
            placeholder={placeholder}
            defaultValue={initialValue ?? selectProps?.defaultValue ?? ''}
            // value={value ?? selectProps?.value ?? ''}
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
                        backgroundColor: `${ori.key}`
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
            placeholder={placeholder}
            name={dataIndex}
            required={required}
            onChange={(val) => onValueChange?.(val)}
            disabled={disabled}
            value={value}
            defaultValue={initialValue}
            format={datePickerProps?.format ?? 'DD/MM/YYYY'}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'password':
        return (
          <Input
            {...inputProps}
            required
            placeholder={placeholder ?? 'Enter password'}
            name={dataIndex}
            type={visible ? 'text' : 'password'}
            onChange={(event) => onValueChange?.(event.target.value)}
            defaultValue={initialValue ?? inputProps?.defaultValue ?? ''}
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
            placeholder={placeholder}
            name={dataIndex}
            type='email'
            autoComplete='give-text'
            allowClear={allowClear}
            onChange={(event) => onValueChange?.(event.target.value)}
            defaultValue={initialValue ?? inputProps?.defaultValue ?? ''}
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
            defaultValue={initialValue ?? inputProps?.defaultValue ?? ''}
            value={value ?? inputProps?.value ?? ''}
            disabled={disabled}
            readOnly={readonly}
            className={cn('w-full', restProps.className)}
          />
        )
    }
  })()

  return <>{isEditing ? (editableRender ? editableRender : inputNode) : restProps.children}</>
}

export default memo(EditableStateCell)
