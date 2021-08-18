// import { atom, useRecoilState, SetterOrUpdater } from 'recoil'
import Rekv from 'rekv'

// add recoil persistence

const store = new Rekv({ address: '', chainId: 0 })

export const useCurrentUser = () => {
  return [store.useState('address'), (address: string) => store.setState({ address })]
}

export const useCurrentNetworkId = () => {
  return [store.useState('chainId'), (chainId: number) => store.setState({ chainId })]
}

// export const useCurrentUserAddr = ():string => {
//   const [user] = useRecoilState(currentUser)
//   if(!user.loggedIn) return ''
//   return user.addr
// }
