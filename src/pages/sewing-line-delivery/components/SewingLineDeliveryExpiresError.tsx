import React from 'react'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { expiredDate } from '~/utils/helpers'

interface Props {
  date1?: string | undefined | null
  date2?: string | undefined | null
}

const SewingLineDeliveryExpiresError: React.FC<Props> = ({ date1, date2 }) => {
  const expiresDateNumber = expiredDate(date1, date2) ?? 0

  const content = (): string => {
    if (expiresDateNumber >= 0) {
      return `(Còn ${expiresDateNumber} ngày)`
    } else {
      return `(Quá ${expiresDateNumber * -1} ngày)`
    }
  }

  return (
    <>
      <SkyTableTypography type={expiresDateNumber >= 5 ? 'success' : 'danger'}>{content()}</SkyTableTypography>
    </>
  )
}

export default SewingLineDeliveryExpiresError
