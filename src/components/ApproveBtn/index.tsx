import React, { useState, useEffect } from 'react'
import { Box, Button } from '@chakra-ui/react'

import { useCurrentUser, useCurrentNetworkId } from '../../hooks/useCurrentAccount'
import { toast } from '../../utils'
import { ToastProps } from '../../constants'
import { tokenApi } from '../../utils/api'
import { t } from '../../i18n'

import store from '../../stores/account'
type Props = {
  token?: string,
  contractAddr: string,
  children: React.ReactNode,
  contract?: string,
  tokenName?: string,
  btnStyle?: any,
  approveMethod?: boolean
}

const ApproveBtn = ({ token, children, btnStyle, contractAddr, tokenName, approveMethod = false, ...rest }: Props) => {
  const { address, signer } = store.useState('address', 'signer')
  const [loading, setLoading] = useState(false)
  // get token address and token approve\
  const [approved, setApprove] = useState(false)
  const tokenContract = tokenApi(token)

  useEffect(() => {
    const getAllowance = async () => {
      const res = await tokenContract.allowance(address, contractAddr)
      // console.log(res.toString())
      if (res.toString() == 0) {
        setApprove(false)
      } else {
        setApprove(true)
      }
    }
    getAllowance()
  }, [address, contractAddr, token])

  if (!token) {
    return <>{children}</>
  }


  const handleApprove = async () => {
    const tx = await tokenContract[approveMethod ? 'approveToInvest' : 'approve'](contractAddr, signer)
    if (!tx) {
      return
    }
    setLoading(true)
    const res = await tx.wait(2)
    const toastProps: ToastProps = {
      title: 'Transaction',
      desc: '',
      status: 'success'
    }
    if (res.status === 1) {
      setApprove(true)
      setLoading(false)
      toastProps.desc = t('approve.success')
    } else {
      toastProps.desc = t('trx.fail')
      toastProps.status = 'error'
      setLoading(false)
    }

    toast(toastProps)

  }
  const tokenText = tokenName ? tokenName : (token.toUpperCase())
  const btnText = t('approve') + ' ' + tokenText
  return <>
    {approved ? children : <Button isLoading={loading} loadingText={t('Approving')} onClick={handleApprove} {...rest}>
      {btnText}
    </Button>}
  </>
}


export default ApproveBtn
