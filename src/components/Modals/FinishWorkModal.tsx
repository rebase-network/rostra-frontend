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
        URL: Yup.string().required(),
    })

    const onSub = async (values: any, actions: any) => {
        try {
            const {
                title,
                description,
                URL
            } = values
            let tx = null
            setLoading(true)
            tx = await projectApiInstance.finishWork(
                title,
                description,
                URL
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
                    {t('finishWork')}
                </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody mt={4} pb={6}>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSub}
                    validationSchema={validationSchema}
                >
                    {({ handleSubmit, values, errors, setFieldValue }) => (
                        <Box maxWidth={'sm'} m='10px auto' as='form' onSubmit={handleSubmit as any}>
                            <InputControl label='Title' name='title' />

                            <InputControl label='Description' name='description' />

                            <InputControl label='URL' name='URL' />

                            <SubmitButton {...btnStyle} isLoading={loading} >Confirm</SubmitButton>
                        </Box>
                    )}
                </Formik>
            </ModalBody>
        </ModalContent>
    </Modal>
}

export default FinishWorkModal
