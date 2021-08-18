import { useEffect } from 'react'
// import { atom, useRecoilState, SetterOrUpdater } from 'recoil'
import Rekv from 'rekv'

const store = new Rekv({
  isOpen: false,
  status: 'success',
  tip: '',
})
// export const useTipModalState = () => {
//   const { isOpen, status, tip } = store.useState('isOpen', 'status', 'tip')
//   return { isOpen, status, tip, setState: store.setState }
// }

// export const useTipModal = () => {
//   const [{ isOpen, status, tip }, setState] = [
//     store.useState('isOpen', 'status', 'tip'),
//     store.setState,
//   ]

//   const onClose = () => {
//     store.setState({
//       isOpen: false,
//       status: '',
//       tip: '',
//     })
//   }

//   const onOpen = (tip = '', status = '') => {
//     setState({
//       isOpen: true,
//       status,
//       tip,
//     })
//   }

//   return { isOpen, status, tip, onClose, onOpen }
// }

// export const useCurrentUserAddr = ():string => {
//   const [user] = useRecoilState(currentUser)
//   if(!user.loggedIn) return ''
//   return user.addr
// }

export default store