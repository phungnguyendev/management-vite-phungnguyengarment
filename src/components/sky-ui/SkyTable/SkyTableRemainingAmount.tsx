import React from 'react'
import { numberValidatorDisplay } from '~/utils/helpers'
import SkyTableTypography from './SkyTableTypography'

export interface SkyTableRemainingAmountProps {
  totalAmount: number
}

const SkyTableRemainingAmount: React.FC<SkyTableRemainingAmountProps> = ({ totalAmount }) => {
  return (
    <>
      <SkyTableTypography>
        {numberValidatorDisplay(totalAmount < 0 ? totalAmount * -1 : totalAmount)}{' '}
        <span>{totalAmount < 0 && '(Dư)'}</span>
      </SkyTableTypography>
    </>
  )
}

export default SkyTableRemainingAmount
