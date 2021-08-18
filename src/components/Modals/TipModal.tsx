import React, { } from 'react'
import {
  Modal,
  VStack,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button, Text,
  Box,
  Center
} from '@chakra-ui/react'
import { CheckIcon, WarningTwoIcon, CloseIcon, InfoOutlineIcon } from '@chakra-ui/icons'
import store from '../../stores/tipModal'
// import { useTipModalState } from '../../hooks/useModals'
import { t } from '../../i18n'


type Props = {

}

const TipModal = (props: Props) => {

  const { isOpen, status, tip = '' } = store.useState('isOpen', 'status', 'tip')

  const statusIcon = (status: string) => {
    const iconStyles = {
      boxSize: '60px',
      color: 'white',
      borderRadius: "full",
      p: 4
    }
    switch (status) {
      case 'success':
        return <CheckIcon {...iconStyles} bgColor='grass' />
      case 'info':
        return <InfoOutlineIcon {...iconStyles} color='teal.400' />
      case 'warning':
        return <WarningTwoIcon {...iconStyles} bgColor='yellow.400' />
      case 'error':
        return <CloseIcon {...iconStyles} bgColor='red.400' />
    }


  }

  const styleMap: any = {
    'success': 'grass',
    'info': 'teal',
    'error': 'red',
    'warinig': 'yeallo'
  }


  const onClose = () => {
    store.setState({
      isOpen: false,
      status
    })
    console.log('tip' + 'close')
  }
  return <Modal
    isOpen={isOpen}
    onClose={onClose}
    autoFocus={false}
    isCentered
  >
    <ModalOverlay />
    <ModalContent h='290px' w='290px'>
      <ModalCloseButton />
      <ModalBody mt={10} pb={6}>
        <VStack >
          <Center mb={4}>
            {statusIcon(status)}
          </Center>
          <Box minH='60px'>
            <Text h='30px' fontSize='16' fontWeight={500}>{tip}</Text>
          </Box>
          <Button w='100%' h='60px' colorScheme={styleMap[status]} onClick={() => onClose()}>{t('Close')}</Button>
        </VStack>
      </ModalBody>
    </ModalContent>
  </Modal>
}

export default TipModal
