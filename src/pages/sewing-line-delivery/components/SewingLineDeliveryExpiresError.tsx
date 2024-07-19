import React from 'react'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { diffDate, expiriesDateType } from '~/utils/helpers'

interface Props {
  wrapperBefore?: string
  wrapperAfter?: string
  dateOutputFCR?: string | undefined | null
  dateToCheck?: string | undefined | null
}

const SewingLineDeliveryExpiresError: React.FC<Props> = ({
  dateOutputFCR,
  dateToCheck,
  wrapperBefore,
  wrapperAfter
}) => {
  const expiresDateNumber = diffDate(dateOutputFCR, dateToCheck) ?? 0

  const content = (): string => {
    if (expiresDateNumber >= 0) {
      return `${wrapperBefore ?? '('}Còn ${expiresDateNumber} ngày${wrapperAfter ?? ')'}`
    } else {
      return `${wrapperBefore ?? '('}Quá ${expiresDateNumber * -1} ngày${wrapperAfter ?? ')'}`
    }
  }

  return (
    <>
      <SkyTableTypography type={expiriesDateType(dateOutputFCR, dateToCheck)}>{content()}</SkyTableTypography>
    </>
  )
}

export default SewingLineDeliveryExpiresError
