import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { BigNumber, ethers } from 'ethers'
import { t } from '../../i18n'
import { crowdFundingApi } from '../../utils/api'
import store from '../../stores/account'
import { VStack, Box, Text, Divider, Heading } from '@chakra-ui/react'
import { Formik } from 'formik'
import { InputControl, SubmitButton } from 'formik-chakra-ui'
import * as Yup from 'yup'
import { toast } from '../../utils'
import { ToastProps } from '../../constants'

type ConvertProps = {
  isOpen: boolean
  type: string
  onOpen: () => void
  onClose: () => void
  cb?: () => void
}


export default function CreateProject(props: ConvertProps) {
  const contentHigh = document.documentElement.clientHeight - 80
  const history = useHistory()
  const { signer } = store.useState('address', 'signer')
  const crowdFundingApiInstance: any = crowdFundingApi(signer)

  const { onClose, cb = () => { } } = props
  const initialValues = {
    creatorName: '',
    title: '',
    description: '',
    durationInDays: '',
    price: '',
    limit: '',
    name: '',
    symbol: '',
    baseTokenURI: 'https://rostra.xyz/nft-metadata?id='
  }
  const [loading, setLoading] = useState(false)

  const validationSchema = Yup.object({
    creatorName: Yup.string().required(),
    title: Yup.string().required(),
    description: Yup.string().required(),
    durationInDays: Yup.number().required().positive(),
    price: Yup.number().required().positive(),
    limit: Yup.number().required().positive(),
    name: Yup.string().required(),
    symbol: Yup.string().required(),
    baseTokenURI: Yup.string().required(),
  })

  const onSub = async (values: any, actions: any) => {
    try {
      const {
        creatorName,
        title,
        description,
        durationInDays,
        price,
        limit,
        name,
        symbol,
        baseTokenURI
      } = values
      let tx = null
      setLoading(true)
      console.log('price: ', ethers.utils.parseEther(price))
      tx = await crowdFundingApiInstance.startProject(
        creatorName,
        title,
        description,
        durationInDays * 86400,
        ethers.utils.parseEther(price),
        limit,
        name,
        symbol,
        baseTokenURI
      )
      const res = await tx.wait(2)
      const toastProps: ToastProps = {
        title: 'Transaction',
        desc: '',
        status: 'success'
      }
      if (res.status === 1) {
        setLoading(false)
        toastProps.desc = t('trx.success')
        history.push('/')
      } else {
        toastProps.desc = t('trx.fail')
        toastProps.status = 'error'
        setLoading(false)
      }
      actions.resetForm()
      toast(toastProps)
      onClose()
      cb()
    } catch (error) {
      console.log(error)
    }
  }

  const btnStyle = {
    mt: '20px',
    width: '100%',
    h: '60px',
    colorScheme: 'grass',
  }

  return (
    <VStack minH={contentHigh} bgColor='contentBg' p='32px'>
      {/* <Box width='100%' mb='25px'>
        <Heading as="h2" size="md">
          {t('createFundingTitle')}
        </Heading>
      </Box> */}
      <Formik
        initialValues={initialValues}
        onSubmit={onSub}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, values, errors, setFieldValue }) => (
          <Box
            borderWidth="1px"
            rounded="lg"
            w={600}
            p={6}
            as="form"
            onSubmit={handleSubmit as any}
          >
            <Heading as='h4' size='md'>
              Knowledge Info
            </Heading>

            <InputControl label='Your Name' name='creatorName' />

            <InputControl label='Title' name='title' />

            <InputControl label='Description' name='description' />

            <InputControl label='Days Needed to Submit The Work' name='durationInDays' />

            <Heading as='h4' size='md' mt='1rem'>
              NFT Info
            </Heading>
            <InputControl label='Price(Matic)' name='price' />

            <InputControl label='Total Supply' name='limit' />

            <InputControl label='Name' name='name' />

            <InputControl label='Symbol' name='symbol' />

            <InputControl label='Token URI' name='baseTokenURI' />

            <SubmitButton {...btnStyle} isLoading={loading} >Confirm</SubmitButton>
          </Box>
        )}
      </Formik>

    </VStack>
  )
}
