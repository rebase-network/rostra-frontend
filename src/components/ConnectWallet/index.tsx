import * as React from 'react'

import { Center, Button } from '@chakra-ui/react'
import store from '../../stores/account'
// TODO media links
type Props = {
  children: any
}

const ConnectWallet = ({ children }: Props) => {
  const { ethereum } = window

  const getAccount = async () => {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0]
    console.log(account)
    store.setState({ address: account })
  }

  const { address } = store.useState('address')
  return <>{address ? children : <Center h='75vh'>
    <Button colorScheme='grass' onClick={getAccount}>Connect</Button>
    </Center>}</>
}

export default ConnectWallet
