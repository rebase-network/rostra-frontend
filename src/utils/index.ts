import invariant from 'tiny-invariant'
import warning from 'tiny-warning'
import { ethers } from 'ethers'
import i18next from 'i18next'
import Big from 'big.js'

import { Contract } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import JSBI from 'jsbi'
import { createStandaloneToast } from '@chakra-ui/react'


import { ChainId, BigintIsh, CROWD_FUNDING_ADDRESSES, ToastProps } from '../constants'

// init provide with metamask
const provider = new ethers.providers.Web3Provider(window.ethereum)

const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.',
  97: 'bsctestnet',
}

export function getEtherscanLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block',
): string {
  const prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function parseBigintIsh(bigintIsh: BigintIsh): JSBI {
  return bigintIsh instanceof JSBI
    ? bigintIsh
    : typeof bigintIsh === 'bigint'
    ? JSBI.BigInt(bigintIsh.toString())
    : JSBI.BigInt(bigintIsh)
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// account is optional
export function getProvider(): Web3Provider {
  return provider
}

// account is not optional
export function getSigner(account?: string): JsonRpcSigner {
  return getProvider().getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(account) : provider
}

// account is optional
export function getContract(address: string, ABI: any, account?: string) {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  // return new Contract(address, ABI, getProviderOrSigner(account) as any)
  return new ethers.Contract(address, ABI, getProviderOrSigner(account))
}

// account is optional
// export function getRouterContract(_: number, library: Web3Provider, account?: string): Contract {
//   return getContract(ROUTER_ADDRESS, IUniswapV2Router02ABI, library, account)
// }

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

// export function validateSolidityTypeInstance(value: JSBI, solidityType: SolidityType): void {
//   invariant(JSBI.greaterThanOrEqual(value, ZERO), `${value} is not a ${solidityType}.`)
//   invariant(JSBI.lessThanOrEqual(value, SOLIDITY_TYPE_MAXIMA[solidityType]), `${value} is not a ${solidityType}.`)
// }

// warns if addresses are not checksummed
export function validateAndParseAddress(address: string): string {
  try {
    const checksummedAddress = getAddress(address)
    warning(address === checksummedAddress, `${address} is not checksummed.`)
    return checksummedAddress
  } catch (error) {
    invariant(false, `${address} is not a valid address.`)
  }
}

// export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
//   if (currency === ETHER) return true
//   return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address])
// }

// export function getOneSplitContract(_: number, library: Web3Provider, account?: string): Contract {
//   return getContract(ONE_SPLIT_ADRESS, IOneSplitABI, library, account)
// }

const toastStandalone = createStandaloneToast()
export const toast = ({
  title = '',
  desc = '',
  status = 'success',
  duration = 9000,
  isClosable = true,
}: ToastProps) => {
  toastStandalone({
    position: 'bottom-right',
    title,
    description: desc,
    status,
    duration,
    isClosable,
  })
}

export const getCrowdFundingAddress = () => {
  const networkId = +window.ethereum.chainId
  return CROWD_FUNDING_ADDRESSES[networkId]
}


export const formatBalance = (amount = '0', decimal = 18) => {
  const num = new Big(amount).div(Math.pow(10, decimal))
  return num.toFixed(2)
}

export const convertAmount = (amount = 0, decimal = 18, type='string') => {
  const num = new Big(amount).mul(Math.pow(10, decimal))
  if(type==='string') {
    return num.toFixed()
  }
  return num.toNumber()
}
