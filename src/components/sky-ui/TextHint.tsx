import { Button, Flex } from 'antd'
import { Eye, EyeOff } from 'lucide-react'
import { FC, HTMLAttributes, useState } from 'react'
import { textValidatorDisplay } from '~/utils/helpers'
import { replaceTextWithAsterisks } from '~/utils/text'
import SkyTableTypography from './SkyTable/SkyTableTypography'

interface Props extends HTMLAttributes<HTMLElement> {}

const TextHint: FC<Props> = ({ ...props }) => {
  const [visible, setVisible] = useState<boolean>(false)

  return (
    <Flex {...props}>
      <SkyTableTypography status={'active'} className='w-4/5'>
        {visible ? textValidatorDisplay(props.title) : replaceTextWithAsterisks(textValidatorDisplay(props.title), '*')}
      </SkyTableTypography>
      <Button onClick={() => setVisible((prev) => !prev)} type='link' className='w-1/5 p-2'>
        {visible ? <Eye color='var(--foreground)' size={16} /> : <EyeOff size={16} color='var(--foreground)' />}
      </Button>
    </Flex>
  )
}

export default TextHint
