// import { atom, useRecoilState, SetterOrUpdater } from 'recoil'
import Rekv from 'rekv'
import { getProvider, getSigner } from '../utils'

interface InitState {
  address: string
  networkId?: number
  provider: any
  signer: any
}

const initState: InitState = {
  address: '',
  networkId: 0,
  provider: getProvider,
  signer: { address: '' },
}
const store = new Rekv(initState)

store.delegate = {
  beforeUpdate: ({ state }) => {
    const { address } = state
    return { ...state, signer: address ? getSigner(address): null }
  },
  afterUpdate: ({ state }) => {
    console.log(state)
    return state
  },
}
export default store
