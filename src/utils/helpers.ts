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

export const numberValidatorDisplay = (number?: number | null): string => {
  return number ? `${number}` : '-'
}

export const numberValidatorCalc = (number?: number | null): number => {
  return number ? number : 0
}

export const textValidatorDisplay = (text?: string | null): string => {
  return text ? text : '-'
}

export const dateValidatorDisplay = (date?: string | number | Date | dayjs.Dayjs | null | undefined): string => {
  return date ? dateFormatter(date, 'dateOnly') : '--/--/----'
}

export const dateTimeValidatorDisplay = (date?: string | number | Date | dayjs.Dayjs | null | undefined): string => {
  return date ? dateFormatter(date, 'dateTime') : '--/--/----'
}

// Validator value change

export const dateValidatorChange = (date?: string | number | dayjs.Dayjs | Date | null | undefined): string | null => {
  return date ? dateFormatter(date, 'iso8601') : null
}

export const textValidatorChange = (text: string): string => {
  return text ?? ''
}

export const numberValidatorChange = (number: number): number => {
  return number ? (number > 0 ? number : 0) : 0
}

// Validator initial value

export const dateValidatorInit = (
  date?: string | number | Date | dayjs.Dayjs | null | undefined
): dayjs.Dayjs | undefined => {
  return date ? dayjs(date) : undefined
}

export const textValidatorInit = (text?: string | null): string | undefined => {
  return text ? text : undefined
}

export const numberValidatorInit = (number?: number | null): number | undefined => {
  return number ? number : undefined
}

// Validator

export const dateValidator = (date?: string | number | Date | dayjs.Dayjs | null | undefined): boolean => {
  return date ? dayjs(date).isValid() : false
}

export const dateComparator = (
  date1?: string | number | Date | dayjs.Dayjs | null | undefined,
  date2?: string | number | Date | dayjs.Dayjs | null | undefined
): boolean => {
  // Kiểm tra tính hợp lệ của các ngày tháng đầu vào
  if (!date1 || !date2 || !dayjs(date1).isValid() || !dayjs(date2).isValid()) {
    return false
  }

  // So sánh ngày của hai ngày tháng
  return dayjs(date1).startOf('day').diff(dayjs(date2).startOf('day'), 'days') !== 0
}

export const textValidator = (text?: string | null): boolean => {
  return text ? text !== '' : false
}

export const textComparator = (text1?: string | null, text2?: string | null): boolean => {
  return text1 && text2 ? text1 !== text2 : false
}

export const numberValidator = (number?: number | null | undefined): number | undefined => {
  return number ? number : undefined
}

export const numberComparator = (number1?: number | null, number2?: number | null): boolean => {
  return number1 && number2 ? number1 !== number2 : false
}

export const arrayValidator = (array?: any | null): boolean => {
  return array ? array.length > 0 : false
}

export const extractEmailName = (email: string): string => {
  const parts = email.split('@')

  // Lấy phần username từ phần đầu tiên của mảng parts
  const username = parts[0]

  // Trả về phần username
  return username
}
