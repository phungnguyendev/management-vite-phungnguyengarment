import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
//tiếng việt
import 'dayjs/locale/vi'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc' // dependent on utc plugin

dayjs.extend(localizedFormat)
dayjs.locale('vi') // use locale globally
//timezone
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault(dayjs.tz.guess())
// Set the output to "1.9.2018 18:01:36.386 GMT+02:00 (CEST)"

export type DateFormatType = 'dateOnly' | 'dateTime' | 'timeOnly' | 'iso8601'

export const dateFormatter = (
  date?: string | number | Date | dayjs.Dayjs | undefined,
  formatType?: DateFormatType
): string => {
  switch (formatType) {
    case 'timeOnly':
      return dayjs(date).format('HH:mm:ss')
    case 'dateTime':
      return dayjs(date).format('DD/MM/YYYY hh:mm A')
    case 'iso8601':
      return dayjs(date).format('YYYY-MM-DDTHH:mm:ss.sssZ')
    default:
      return dayjs(date).format('DD/MM/YYYY')
  }
}

export default dayjs
