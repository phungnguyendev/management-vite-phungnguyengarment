import React from 'react'
import SkyTableTypography, { SkyTableTypographyProps } from './SkyTableTypography'

interface Props extends SkyTableTypographyProps {}

const SkyTableErrorItem: React.FC<Props> = ({ ...props }) => {
  return (
    <SkyTableTypography {...props} className='text-error'>
      {props.children ?? props.title}
    </SkyTableTypography>
  )
}

export default SkyTableErrorItem
