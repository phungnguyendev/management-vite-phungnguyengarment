import { Color } from 'antd/es/color-picker'
import { clsx, type ClassValue } from 'clsx'
import dayjs from 'dayjs'
import { twMerge } from 'tailwind-merge'
import { dateFormatter } from './date-formatter'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const breakpoint = {
  /**
   * <
   */
  xs: 576,
  /**
   * >=
   */
  sm: 576,
  /**
   * >=
   */
  md: 768,
  /**
   * >=
   */
  lg: 992,
  /**
   * >=
   */
  xl: 1200,
  /**
   * >=
   */
  xxl: 1600
}

export const numberValidatorDisplay = (number?: number): string => {
  return number ? `${number}` : '-'
}

export const numberValidatorCalc = (number?: number): number => {
  return number ? number : 0
}

export const textValidatorDisplay = (text?: string): string => {
  return text ? text : '-'
}

export const dateValidatorDisplay = (date?: string | Date | dayjs.Dayjs): string => {
  return isValidDate(date) ? dateFormatter(date, 'dateOnly') : '--/--/----'
}

export const dateTimeValidatorDisplay = (date?: string | Date | dayjs.Dayjs): string => {
  return date ? dateFormatter(date, 'dateTime') : ' --/--/----'
}

// Validator value change

export const dateValidatorChange = (date?: string | dayjs.Dayjs | Date): string => {
  return date ? dateFormatter(date, 'iso8601') : dateFormatter(Date.now(), 'iso8601')
}

export const textValidatorChange = (text?: string | null): string => {
  return text ? text.trim() : ''
}

export const numberValidatorChange = (number?: number | null): number => {
  return number ?? 0
}

export const colorValidatorChange = (color?: Color | null): string => {
  return color ? color.toHexString() : '#000000'
}

// Validator initial value

export const dateValidatorInit = (date?: string | Date | dayjs.Dayjs): dayjs.Dayjs | undefined => {
  return date ? (isValidDate(date) ? dayjs(date) : dayjs(Date.now())) : dayjs(Date.now())
}

export const textValidatorInit = (text?: string): string | undefined => {
  return text ? text : undefined
}

export const numberValidatorInit = (number?: number): number | undefined => {
  return number ? number : undefined
}

// Validator

export const dateValidator = (date?: string | Date | dayjs.Dayjs): boolean => {
  return date ? dayjs(date).isValid() : false
}

export const textValidator = (text?: string): boolean => {
  return text ? text !== '' : false
}

export const textComparator = (text1?: string, text2?: string): boolean => {
  return isValidString(text1) && isValidString(text2) ? text1 !== text2 : false
}

export const numberValidator = (number?: number | undefined): number | undefined => {
  return number ? number : undefined
}

export const numberComparator = (number1?: number, number2?: number): boolean => {
  return number1 && number2 ? number1 !== number2 : false
}

export const dateComparator = (date1?: string | Date | dayjs.Dayjs, date2?: string | Date | dayjs.Dayjs): boolean => {
  // Chuyển đổi các ngày tháng đầu vào sang đối tượng dayjs
  const dayjsDate1 = dayjs(date1)
  const dayjsDate2 = dayjs(date2)

  // Kiểm tra tính hợp lệ của các ngày tháng đầu vào
  if (!isValidDate(date1) || !isValidDate(date2)) {
    return false
  }

  // So sánh ngày của hai ngày tháng
  return dayjsDate1.startOf('day').diff(dayjsDate2.startOf('day'), 'days') !== 0
}

export const arrayComparator = <T>(array1?: T[], array2?: T[]): boolean => {
  if (!isValidArray(array1) || !isValidArray(array2)) return false

  // Kiểm tra xem phần tử nào của array1 không có trong array2 và ngược lại
  const diff1 = array1.filter((item) => !array2.includes(item))
  const diff2 = array2.filter((item) => !array1.includes(item))

  // Trả về true nếu có bất kỳ sự khác biệt nào
  return diff1.length > 0 || diff2.length > 0
}

export const isValidArray = <T>(arr?: T[] | null): arr is T[] => {
  return Array.isArray(arr) && arr.length > 0
}

export function isValidString(value?: string | null): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

// Hàm kiểm tra số hợp lệ
export function isValidNumber(value?: number | null): value is number {
  return typeof value === 'number' && !isNaN(value)
}

// Hàm kiểm tra boolean hợp lệ
export function isValidBoolean(value?: boolean | null): value is boolean {
  return typeof value === 'boolean'
}

export function isValidDate(value?: string | Date | dayjs.Dayjs): boolean {
  if (!value) {
    return false
  }
  return dayjs(value).isValid()
}

// Hàm kiểm tra object hợp lệ
export function isValidObject<T>(value?: T | null): value is T {
  return typeof value === 'object' && value !== null
}

export const extractEmailName = (email: string): string => {
  const parts = email.split('@')

  // Lấy phần username từ phần đầu tiên của mảng parts
  const username = parts[0]

  // Trả về phần username
  return username
}
