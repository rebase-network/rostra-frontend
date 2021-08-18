// import { EtherscanProvider, Web3Provider } from '@ethersproject/providers'
// import { useEffect, useState } from 'react'
// import { isMobile } from 'react-device-detect'
// import { atomFamily, selectorFamily, useRecoilState, atom } from 'recoil'
import Rekv from 'rekv'
import { getProvider } from '../utils'
import { ethers } from 'ethers'

const provider: any = getProvider()

// export const balanceState = atomFamily({
//   key: "balance::state",
//   default: selectorFamily({
//     key: "balance::default",
//     get: (address) => async () => {
//       if(!address) return null
//       return await provider.getBalance(address?.toString() || '');
//     },
//   }),
// });

export default new Rekv({
  provider: getProvider(),
  signer: null,
  address: '',
})


