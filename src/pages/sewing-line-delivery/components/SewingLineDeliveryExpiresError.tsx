import React from 'react'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { expiredDate, isExpiredDate, isValidDate } from '~/utils/helpers'

interface Props {
  date1?: string | undefined | null
  date2?: string | undefined | null
}

const SewingLineDeliveryExpiresError: React.FC<Props> = ({ date1, date2 }) => {
  return (
    <>
      {isValidDate(date1) && isValidDate(date2) && (
        <SkyTableTypography type={isExpiredDate(date1, date2) ? 'danger' : undefined}>
          {isExpiredDate(date1, date2)
            ? `(Quá ${expiredDate(date1, date2)} ngày)`
            : `(Còn ${expiredDate(date1, date2)} ngày)`}
        </SkyTableTypography>
      )}
    </>
  )
}

export default SewingLineDeliveryExpiresError
