import React, { useEffect } from "react";
import { Link as routerLink, useHistory } from 'react-router-dom'
import { Box, Flex, Spacer, Button, Link, Center } from "@chakra-ui/react";
import { imgs } from '../../assets'
import store from '../../stores/account'


type HeaderProps = {};

const Header = (props: HeaderProps) => {
  const history = useHistory()
  const { address } = store.useState('address')
  const { ethereum } = window

  useEffect(() => {
    ethereum.on('chainChanged', (networkId: string) => {
      store.setState({ networkId: +networkId })
      console.log(networkId, 'networkIDstring')
    })
    ethereum.on('accountsChanged', (accounts: string[]) => {
      // Time to reload your interface with accounts[0]!
      console.log(accounts, 'accounts')
      store.setState({ address: accounts[0] })
    })
  }, [ethereum])

  const getAccount = async () => {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0]
    console.log(account)
    store.setState({ address: account })
  }

  let personalButton = <Box>Please install <Link href="https://metamask.io">MetaMask</Link></Box>

  if(ethereum) {
    personalButton = (
      <Box>
        {address ?
          (<Box>
            <Button variant='outline' borderColor='primary' borderRadius="3xl" color='primary' onClick={() => history.push('/my')} >My Fundings</Button>
          </Box>
          ) :
          <Button variant='outline' borderColor='primary' borderRadius="3xl" color='primary' onClick={() => getAccount()}>Connect to wallet</Button>
        }
      </Box>
    )
  }

  return (
    <>
      <Flex h='80px' boxShadow="xl" bg="titleBg" color='white'>
        <Center minW='210px' p='4'>
          {/* <Image h="40px" src={imgs.logo} ml="88px" /> */}
          <Link as={routerLink} to="/" textDecoration="none">Rostra</Link>
        </Center>
        <Spacer />
        <Flex minW='300px'>
          <Center p='4' fontSize={14} >
            <Link ml={6} as={routerLink} to="/fundings/create">Create</Link>
            <Link ml={6} as={routerLink} to="/about">About</Link>
          </Center>

          <Center minW='200px'>
            {personalButton}
          </Center>
        </Flex>
      </Flex>
    </>
  );
};

export default Header