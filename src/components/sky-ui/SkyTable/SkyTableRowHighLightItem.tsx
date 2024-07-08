import React from 'react'
import { cn } from '~/utils/helpers'
import SkyTableTypography, { SkyTableTypographyProps } from './SkyTableTypography'

interface Props extends SkyTableTypographyProps {
  background?: boolean
  index?: number
}

const SkyTableRowHighLightItem: React.FC<Props> = ({ title, background, ...props }) => {
  return (
    <SkyTableTypography
      {...props}
      className={cn('my-[2px] h-6 rounded-sm bg-opacity-[0.06] py-1', {
        'bg-black px-2': background
      })}
    >
      {props.children ?? title}
    </SkyTableTypography>
  )
}

export default SkyTableRowHighLightItem
