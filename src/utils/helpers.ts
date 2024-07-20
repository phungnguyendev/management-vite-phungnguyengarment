import { Color } from 'antd/es/color-picker'
import { BaseType } from 'antd/es/typography/Base'
import { clsx, type ClassValue } from 'clsx'
import dayjs from 'dayjs'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { UserRoleType } from '~/typing'
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

export const handleFilterText = (value: React.Key | boolean, text?: string | null): boolean => {
  return textValidatorChange(text).startsWith(value as string)
}

export const handleObjectFilterText = (
  value: React.Key | boolean,
  object?: { id?: number },
  valueCompare?: string | number
): boolean => {
  return isValidObject(object) ? `${valueCompare}`.startsWith(value as string) : false
}

export const isAcceptRole = (initRoles: UserRoleType[], userRoles: UserRoleType[]): boolean => {
  return initRoles.some((role) => userRoles.includes(role)) // If true === accept
}

export const uniqueArray = <T>(duplicateArray: T[]): T[] => {
  return [...new Set(duplicateArray)]
}

export const sumArray = (numbers: number[]): number => {
  return numbers.reduce((sum, num) => sum + num, 0)
}

export const numberValidatorDisplay = (number?: number): string => {
  if (typeof number !== 'number' || isNaN(number)) {
    return '-'
  }

  return number.toLocaleString('de-DE') // Sử dụng chuẩn định dạng số của Đức
}

export const numberValidatorCalc = (number?: number): number => {
  return number ? number : 0
}

export const textValidatorDisplay = (text?: string): string => {
  return text ? text : '-'
}

export const dateValidatorDisplay = (date?: string | number | Date | dayjs.Dayjs | null | undefined): string => {
  return isValidDate(date) ? dateFormatter(date, 'dateOnly') : '--/--/----'
}

export const dateTimeValidatorDisplay = (date?: string | Date | dayjs.Dayjs): string => {
  return isValidDate(date) ? dateFormatter(date, 'dateTime') : ' --/--/----'
}

// Validator value change

export const dateValidatorChange = (date?: string | number | Date | dayjs.Dayjs | null | undefined): string => {
  return date ? dateFormatter(date, 'iso8601') : dateFormatter(Date.now(), 'iso8601')
}

export const dateTimeValidatorChange = (date?: string | number | Date | dayjs.Dayjs | null | undefined): string => {
  return date ? dateFormatter(date, 'dateTime') : dateFormatter(Date.now(), 'dateTime')
}

export const textValidatorChange = (text?: string | null): string => {
  return text ? text : ''
}

export const numberValidatorChange = (number?: number | null): number => {
  return number ?? 0
}

export const colorValidatorChange = (color?: Color | null): string => {
  return color ? color.toHexString() : '#000000'
}

// Validator initial value

export const dateValidatorInit = (date?: string | Date | dayjs.Dayjs): dayjs.Dayjs | undefined => {
  return isValidDate(date) ? dayjs(date) : undefined
}

export const booleanValidatorInit = (value?: boolean | null | undefined): boolean | undefined => {
  return isValidBoolean(value) ? value : undefined
}

export const textValidatorInit = (text?: string): string | undefined => {
  return text ? text : undefined
}

export const numberValidatorInit = (number?: number | null): number | undefined => {
  return number ? number : undefined
}

export const textComparator = (text1?: string, text2?: string): boolean => {
  return !isValidString(text1) || !isValidString(text2) || text1 !== text2
}

export const numberComparator = (number1?: number | null | undefined, number2?: number | null | undefined): boolean => {
  return !isValidNumber(number1) || !isValidNumber(number2) || number1 !== number2
}

export const booleanComparator = (
  value1?: boolean | null | undefined,
  value2?: boolean | null | undefined
): boolean => {
  return !isValidBoolean(value1) || !isValidBoolean(value2) || value1 !== value2
}

export const dateComparator = (date1?: string | Date | dayjs.Dayjs, date2?: string | Date | dayjs.Dayjs): boolean => {
  // Kiểm tra tính hợp lệ của các ngày tháng đầu vào
  if (!isValidDate(date1) || !isValidDate(date2)) true

  // Chuyển đổi các ngày tháng đầu vào sang đối tượng dayjs
  const dayjsDate1 = dayjs(date1)
  const dayjsDate2 = dayjs(date2)

  // So sánh ngày của hai ngày tháng
  return dayjsDate1.startOf('day').diff(dayjsDate2.startOf('day'), 'days') !== 0
}

export const arrayComparator = <T>(array1?: T[], array2?: T[]): boolean => {
  if (!isValidArray(array1) || !isValidArray(array2)) return true

  // Kiểm tra xem phần tử nào của array1 không có trong array2 và ngược lại
  const diff1 = array1.filter((item) => !array2.includes(item))
  const diff2 = array2.filter((item) => !array1.includes(item))

  return diff1.length > 0 || diff2.length > 0
}

export const isValidArray = <T>(arr?: T[] | null | undefined): arr is T[] => {
  return arr ? Array.isArray(arr) && arr.length > 0 : false
}

export function isValidString(value?: string | null | undefined): value is string {
  return value ? typeof value === 'string' && value.length > 0 : false
}

// Hàm kiểm tra số hợp lệ
export function isValidNumber(value?: number | null | undefined): value is number {
  return value ? typeof value === 'number' && !isNaN(value) : false
}

// Hàm kiểm tra boolean hợp lệ
export function isValidBoolean(value?: boolean | null | undefined): value is boolean {
  return typeof value === 'boolean'
}

export function isValidDate(value?: string | number | Date | dayjs.Dayjs | null | undefined): boolean {
  return value ? dayjs(value).isValid() : false
}

// Hàm kiểm tra object hợp lệ
// eslint-disable-next-line @typescript-eslint/ban-types
export function isValidObject<T extends { id?: number }>(value?: T | null | undefined): value is T {
  return value ? typeof value === 'object' && isValidNumber(value.id) : false
}

export const extractEmailName = (email: string): string => {
  const parts = email.split('@')

  // Lấy phần username từ phần đầu tiên của mảng parts
  const username = parts[0]

  // Trả về phần username
  return username
}

export const extractHexCode = (hexCodeWithID: string): string => {
  const parts = hexCodeWithID.split('-')

  // Lấy phần username từ phần đầu tiên của mảng parts
  const username = parts[0]

  // Trả về phần username
  return username
}

/**
 * Kiểm tra date1 (gốc) và date2 có cách nhau 5 ngày hay không
 * Return true if >= 5 otherwise return false
 * @param dateOriginal Ngày gốc
 * @param dateCheck Ngày cần kiểm tra
 * @returns number
 */
export const diffDate = (
  dateOriginal?: string | undefined | null,
  dateCheck?: string | undefined | null
): number | undefined => {
  if (!isValidDate(dateOriginal) || !isValidDate(dateCheck)) return undefined
  // Kiểm tra xem date1 và date2 cách nhau ít hơn 5 ngày không
  return dayjs(dateOriginal).diff(dateCheck, 'days')
}

/**
 * Kiểm tra date1 (gốc) và date2 có cách nhau 5 ngày hay không
 * Return true if >= 5 otherwise return false
 * @param dateOriginal : Ngày gốc
 * @param dateCheck : Ngày cần kiểm tra
 * @returns boolean
 */
export const isExpiredDate = (
  dateOriginal?: string | undefined | null,
  dateCheck?: string | undefined | null
): boolean => {
  if (!isValidDate(dateOriginal) || !isValidDate(dateCheck)) return false
  const day = dayjs(dateOriginal).diff(dateCheck, 'days')
  return day < 5
}

/**
 * Hàm kiểm tra ngày dateOriginal và ngày dateCheck xem ngày dateOriginal so với dateCheck cách nhau bao nhiêu ngày
 * Return về con số đó và kiểm tra tiếp:
 * number < 0 : Số ngày dateCheck đã đi qua ngày dateOriginal
 * number > 0 : Còn số ngày còn lại đến ngày dateOriginal
 * number === : Ngày dateCheck đang là ngày dateOriginal
 * @param dateOriginal Ngày gốc
 * @param dateCheck Ngày cần kiểm tra
 * @returns 'normal' | 'success' | 'warning' | 'danger' (BaseType)
 */
export const expiriesDateType = (
  dateOriginal?: string | undefined | null,
  dateCheck?: string | undefined | null
): BaseType => {
  if (!isValidDate(dateOriginal) || !isValidDate(dateCheck)) return 'secondary'
  // Kiểm tra xem date1 và date2 cách nhau ít hơn 5 ngày không
  const day = dayjs(dateOriginal).diff(dateCheck, 'days')
  // day >= 5 : ngày dự kiến > 5 (Success)
  // day === 0 : ngày dự kiến === ngày xuất (Danger)
  // day < 0 : ngày dự kiến > ngày xuất (Danger)
  // day < 5 : ngày dự kiến cận ngày xuất (Warning)
  return day >= 5 ? 'success' : day === 0 ? 'danger' : day < 0 ? 'danger' : day < 5 ? 'warning' : 'secondary'
}

/**
 * Kiểm tra date1 (gốc) đến nay
 * Return true if >= 5 otherwise return false
 */
export const dateFromNow = (date?: string | undefined | null): number | undefined => {
  if (!isValidDate(date)) return undefined
  // Kiểm tra xem date1 và date2 cách nhau ít hơn 5 ngày không
  return dayjs(date).diff(Date.now(), 'days')
}

/**
 * Hàm tính phần trăm
 * @param totalCount Tổng số
 * @param count Số cần tính
 * @return number: số phần trăm
 */
export const percentage = (totalCount: number, count: number): number => {
  const percent = (count / totalCount) * 100
  return parseFloat(percent.toFixed(0))
}

/**
 * Hàm tính tổng các phần tử bên trong mảng
 * @param counts: Tổng số
 * @return number: Tổng số các phần tử con đã cộng lại
 */
export const sumCounts = (counts: number[]): number => {
  return counts.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
}

export function getRandomNumberInRange(start: number, end: number): number {
  return Math.floor(Math.random() * (end - start + 1)) + start
}

export function pickRandomFromArray(array: number[]): number {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}
