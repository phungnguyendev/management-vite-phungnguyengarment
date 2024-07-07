import { ColorPicker, ColorPickerProps } from 'antd'
import React from 'react'

const SkyTableColorPicker: React.FC<ColorPickerProps> = ({ ...props }) => {
  return (
    <>
      <ColorPicker {...props} size='middle' format='hex' />
    </>
  )
}

export default SkyTableColorPicker
