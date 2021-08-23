import React, { useState, useEffect } from "react"
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
  Flex,
  Center,
  Input
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { t } from '../../i18n'
import { projectApi } from '../../utils/api'
import store from '../../stores/account'
import { toast, formatBalance } from '../../utils'
import ApproveBtn from '../ApproveBtn'
import { BigNumber } from 'ethers'

type Props = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  project: string
  nftPrice: BigNumber
  cb?: () => void
}

const BuyNFTModal = (props: Props) => {
  const { address, signer } = store.useState('address', 'signer')
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState(1)
  const [buyLoading, setBuyLoading] = useState(false)
  const { isOpen, onClose, project, nftPrice } = props
  const chainId = Number(window.ethereum.chainId)
  const projectApiInstance: any = projectApi(project, signer)

  const onAmountChanged = (event: any) => {
    setAmount(event.target.value)
  }

  const handleBuy = async () => {
    setBuyLoading(true)
    const tx = await projectApiInstance.contribute(amount, { value: nftPrice.mul(amount) })
    if (!tx) {
      setBuyLoading(false)
      return
    }

    const res = await tx.wait(2)
    const toastProps: any = {
      title: 'Transaction',
      desc: '',
      status: 'success'
    }
    if (res.status === 1) {
      setLoading(false)
      toastProps.desc = t('trx.success')
    } else {
      toastProps.desc = t('trx.fail')
      toastProps.status = 'error'
      setLoading(false)
    }
    // actions.resetForm()
    setBuyLoading(false)
    toast(toastProps)
    onClose()
  }

  return <Modal
    isOpen={isOpen}
    onClose={onClose}
    autoFocus={false}
    size='lg'
    isCentered
  >
    <ModalOverlay />
    <ModalContent >
      <ModalHeader border='1px solid #F2F4F5'>
        <Text textAlign='center' fontSize='20px' fontWeight={500}>
          {t('buyNFT')}
        </Text>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody mt={4} pb={6}>
        <VStack >
          <Box minH='60px' width='100%' mb={4}>
            <Flex>
              <Input placeholder="Amount to buy" onChange={onAmountChanged} />
              <Button w='200px' isLoading={buyLoading} h='40px' ml={4} colorScheme="grass" variant="solid" onClick={() => handleBuy()}>
                {t('buy')}
              </Button>
              {/* </ApproveBtn> */}
            </Flex>
          </Box>
          {/* <Button w='100%' h='60px' colorScheme={styleMap[status]} onClick={() => onClose()}>{t('Close')}</Button> */}
        </VStack>
      </ModalBody>
    </ModalContent>
  </Modal>
}

export default BuyNFTModal
