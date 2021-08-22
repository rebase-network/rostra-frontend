import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { BigNumber } from 'ethers'
import { t } from '../../i18n'
import { crowdFundingApi, projectApi } from '../../utils/api'
import store from '../../stores/account'
import { VStack, Box, Text, Divider, Heading } from '@chakra-ui/react'
import { Formik } from 'formik'
import { RadioGroupControl, NumberInputControl, InputControl, SubmitButton,PercentComplete } from 'formik-chakra-ui'
import * as Yup from 'yup'
import { toast, formatBalance } from '../../utils'
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
  const initialValues = {}
  const [loading, setLoading] = useState(false)

  const validationSchema = Yup.object({
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
      tx = await crowdFundingApiInstance.startProject(
        title,
        description,
        durationInDays * 86400,
        price,
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
      <Box width='100%' mb='25px'>
        <Heading as="h2" size="md">
          {t('createFundingTitle')}
        </Heading>
      </Box>
      <Formik
        initialValues={initialValues}
        onSubmit={onSub}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, values, errors, setFieldValue }) => (
          <Box maxWidth={'sm'} m='10px auto' as='form' onSubmit={handleSubmit as any}>
            <Heading as='h4' size='md'>
              Knowledge Info
            </Heading>

            <InputControl label='Title' name='title' />

            <InputControl label='Description' name='description' />

            <InputControl label='Days Needed to Submit The Work' name='durationInDays' />

            <Heading as='h4' size='md' mt='1rem'>
              NFT Info
            </Heading>
            <InputControl label='Price' name='price' />

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
