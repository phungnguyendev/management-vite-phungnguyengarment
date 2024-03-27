import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { Checkbox, ColorPicker, DatePicker, Flex, Form, Input, InputNumber, Select, Table, Typography } from 'antd'
import { memo } from 'react'
import { cn } from '~/utils/helpers'
import { EditableStateCellProps } from './EditableStateCell'

export type EditableCellRequiredType = { key?: React.Key; name?: string; id?: number }

export interface EditableFormCellProps extends EditableStateCellProps {}

export type EditableTableProps = Parameters<typeof Table>[0]

function EditableFormCell({
  isEditing,
  dataIndex,
  title,
  subtitle,
  placeholder,
  allowClear,
  value,
  colorPickerProps,
  checkboxProps,
  inputNumberProps,
  textAreaProps,
  inputProps,
  selectProps,
  initialValue,
  onValueChange,
  required,
  inputType,
  readonly,
  disabled,
  ...restProps
}: EditableFormCellProps) {
  const inputNode = ((): React.ReactNode => {
    switch (inputType) {
      case 'colorpicker':
        return (
          <ColorPicker
            {...colorPickerProps}
            defaultFormat='hex'
            value={value ? value : colorPickerProps?.value}
            showText
            disabled={disabled}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'colorselector':
        return (
          <Select
            {...selectProps}
            title={title}
            placeholder={placeholder}
            virtual={false}
            disabled={disabled}
            optionRender={(ori, info) => {
              return (
                <Flex justify='space-between' align='center' key={info.index}>
                  <Typography.Text>{ori.label}</Typography.Text>
                  <div
                    className='h-6 w-6 rounded-sm'
                    style={{
                      backgroundColor: `${ori.key}`
                    }}
                  />
                </Flex>
              )
            }}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'number':
        return (
          <InputNumber
            {...inputNumberProps}
            name={dataIndex}
            title={title}
            required={required}
            placeholder={placeholder}
            value={value}
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
            checked={value}
            disabled={disabled}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'select':
        return (
          <Select
            {...selectProps}
            title={title}
            placeholder={placeholder}
            disabled={disabled}
            optionRender={
              selectProps
                ? selectProps.optionRender
                : (ori, info) => {
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
                  }
            }
            className={cn('w-full', restProps.className)}
          />
        )
      case 'textarea':
        return (
          <Input.TextArea
            {...textAreaProps}
            name={dataIndex}
            title={title}
            placeholder={`${placeholder}`}
            value={value}
            readOnly={readonly}
            required={required}
            disabled={disabled}
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
            disabled={disabled}
            value={value}
            className='w-full'
          />
        )
      case 'datepicker':
        return (
          <DatePicker
            name={dataIndex}
            title={title}
            placeholder={placeholder}
            value={value}
            required={required}
            onChange={(_val, dateString) => onValueChange?.(dateString)}
            disabled={disabled}
            format={'DD/MM/YYYY'}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'password':
        return (
          <Input.Password
            {...inputProps}
            placeholder={placeholder}
            type='password'
            title={title}
            required={required}
            readOnly={readonly}
            allowClear={allowClear}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        )
      default:
        return (
          <Input
            {...inputProps}
            title={title}
            required={required}
            placeholder={placeholder}
            name={dataIndex}
            value={value}
            autoComplete='give-text'
            allowClear={allowClear}
            disabled={disabled}
            readOnly={readonly}
            className={cn('w-full', restProps.className)}
          />
        )
    }
  })()

  return (
    <>
      {isEditing ? (
        <Form.Item
          name={dataIndex}
          className={cn('w-full', restProps.className)}
          initialValue={initialValue}
          required={required}
          label={title}
          validateTrigger='onBlur'
          style={{ margin: 0 }}
          rules={[
            {
              required: required,
              message: subtitle
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        restProps.children
      )}
    </>
  )
}

export default memo(EditableFormCell)
