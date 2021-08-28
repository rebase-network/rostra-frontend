import { SerializableParam } from 'recoil'
import {
  getContract,
  convertAmount,
} from '../utils'
import { ethers } from 'ethers'
import deployedContracts from '../constants/deployedContracts'
import pairABI from '../abis/Project.json'
import jtTokenAbi from '../abis/Project.json'
import stTokenAbi from '../abis/Project.json'
import MainContract from '../abis/Project.json'
import UniPoolContract from '../abis/Project.json'
import StakePollContract from '../abis/Project.json'
import CrowdFundingContract from '../abis/CrowdFunding.json'
import ProjectContract from '../abis/Project.json'


export const crowdFundingApi = (signer: any) => {
  const address = deployedContracts.CrowdFunding
  const contract = getContract(address, CrowdFundingContract.abi)
  const contractWithSigner = contract.connect(signer)

  const getAllProjects = async () => {
    return await contract.getAllProjects()
  }

  return {
    ...contractWithSigner,
    getAllProjects
  }
}


export const projectApi = (address: string, signer: any) => {
  const contract = getContract(address, ProjectContract.abi)
  const contractWithSigner = contract.connect(signer)

  const getBasicInfo = async () => {
    return {
      title: await contract.title(),
      description: await contract.description(),
      timeToSubmitWork: await contract.timeToSubmitWork(),
    }
  }

  return {
    ...contractWithSigner,
    getBasicInfo
  }
}


export const tokenApi = (name = '') => {
  // const { signer } = store.useState('signer')
  name = name.toUpperCase()
  const tokenAddr = '0x0ed5B8775ca854a04B81C2CaAaB971Bfb7e18Ba8' // getTokenContract(name)
  const contract = getContract(tokenAddr, name === 'senior' ? stTokenAbi.abi : jtTokenAbi.abi)
  // const contractWithSigner = contract.connect(signer);

  const getBalance = async (address: string) => {
    return await contract.balanceOf(address)
  }

  const approve = async (
    contractAddr: string,
    signer: any,
    amount = '1000000000000000000000000000',
  ) => {
    const contractWithSigner = contract.connect(signer)
    return await contractWithSigner.approve(contractAddr, amount)
  }

  const allowance = async (address: string, contractAddr: string) => {
    return await contract.allowance(address, contractAddr)
  }

  const totalSupply = async () => {
    return await contract.totalSupply()
  }

  // approve to vault
  const approveToInvest = async (
    address: string,
    signer: any,
    amount = '1000000000000000000000000000',
  ) => {
    const contractWithSigner = contract.connect(signer)
    return await contractWithSigner.approveToInvest(amount, address)
  }

  const mint = async (amount: number, signer: any) => {
    const contractWithSigner = contract.connect(signer)

    return await contractWithSigner.mint(signer._address, convertAmount(amount))
  }

  const burn = async (amount: number, signer: any) => {
    const contractWithSigner = contract.connect(signer)

    return await contractWithSigner.burn(convertAmount(amount))
  }

  return { ...contract, getBalance, allowance, approve, approveToInvest, mint, burn, totalSupply }
}
