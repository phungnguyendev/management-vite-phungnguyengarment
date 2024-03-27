import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import plugin from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(relativeTime)
dayjs.extend(plugin)
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Ho_Chi_Minh')
// Set the output to "1.9.2018 18:01:36.386 GMT+02:00 (CEST)"

export type DateFormatType = 'dateOnly' | 'dateTime' | 'timeOnly' | 'iso8601'

export const dateFormatter = (
  date?: string | number | Date | dayjs.Dayjs | null | undefined,
  formatType?: DateFormatType
): string => {
  switch (formatType) {
    case 'timeOnly':
      return dayjs(date).format('HH:mm:ss')
    case 'dateTime':
      return dayjs(date).format('L - LT')
    case 'iso8601':
      return dayjs(date).format('YYYY-MM-DDTHH:mm:ss.sssZ')
    default:
      return dayjs(date).format('DD/MM/YYYY')
  }
}

export default dayjs
