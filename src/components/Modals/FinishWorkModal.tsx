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
    Input,
    Divider, Heading
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { t } from '../../i18n'
import store from '../../stores/account'
import { toast, formatBalance } from '../../utils'
import { Formik } from 'formik'
import { RadioGroupControl, NumberInputControl, InputControl, SubmitButton, PercentComplete } from 'formik-chakra-ui'
import * as Yup from 'yup'
import { crowdFundingApi, projectApi } from '../../utils/api'
import { ToastProps } from '../../constants'
import { useHistory } from 'react-router-dom'

type Props = {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
    project: string
    cb?: () => void
}

type handlerLPRewardProps = {
    amount: number
    method: string
}

const btnStyle = {
    width: '200px',
    ml: 4,
    h: '40px',
    colorScheme: 'grass',
    fontSize: '10px'
}

const FinishWorkModal = (props: Props) => {
    const { address, signer } = store.useState('address', 'signer')
    const [loading, setLoading] = useState(false)
    const [amount, setAmount] = useState(1)
    const [buyLoading, setBuyLoading] = useState(false)
    const { isOpen, onClose, project } = props
    const chainId = Number(window.ethereum.chainId)
    const projectApiInstance: any = projectApi(project, signer)
    const crowdFundingApiInstance: any = crowdFundingApi(signer)
    const history = useHistory()

    const initialValues = {}

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
        } catch (error) {
            console.log(error)
        }
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
                <VStack bgColor='contentBg' px='88px' pt='24px'>
                    <Box width='100%' mb='25px'>
                        <Text fontSize={34} fontWeight={600} color='textHead'>
                            {t('createFundingTitle')}
                        </Text>
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

                                <Divider />

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
            </ModalBody>
        </ModalContent>
    </Modal>
}

export default FinishWorkModal
