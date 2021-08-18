import * as React from 'react'
import { Tooltip } from '@chakra-ui/react'
import { QuestionIcon } from '@chakra-ui/icons'

type HelpIconProps = {
    iconStyle?: any,
    tipStyle?: any,
    tip?: string,
    cb?: () => void
}

const HelpIcon = (props: HelpIconProps) => {
    const { tip, iconStyle, tipStyle } = props
    return <Tooltip hasArrow placement="top-end" bg='white' color='text' label={tip} {...tipStyle}>
        <QuestionIcon position='absolute' top='24px' right='24px' boxSize={4} color='#D9DEE1' {...iconStyle} />
    </Tooltip>

}

export default HelpIcon
