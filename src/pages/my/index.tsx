import React, { useCallback, useEffect, useState } from 'react'
import { VStack, Box, Text, SimpleGrid, Center, Button, useDisclosure } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import BuyNFTModal from '../../components/Modals/BuyNFTModal'
import FinishWorkModal from '../../components/Modals/FinishWorkModal'
import { t } from '../../i18n'
import { crowdFundingApi, projectApi } from '../../utils/api'
import { getDeadline } from '../../utils'
import store from '../../stores/account'
import { ethers } from 'ethers'

const descTextStyle = {
  color: 'textDesc',
  fontSize: '14px',
  fontWeight: 400
}

const valueTextStyle = {
  color: 'textHead',
  fontSize: '18px',
  fontWeight: 600,
  mb: 4
}

export default function MyProjectList() {
  const [currentProject, setCurrentProject] = useState('')
  const [currentNftPrice, setCurrentNftPrice] = useState(BigNumber.from('0'))
  const { address, signer } = store.useState('address', 'signer')
  const [projects, setProjects] = useState([])
  const [blockTime, setBlockTime] = useState(BigNumber.from('0'))

  const modalProps = {
    ...useDisclosure()
  }

  const handleOpen = (project: string, nftPrice: BigNumber) => {
    setCurrentProject(project)
    setCurrentNftPrice(nftPrice)
    modalProps.onOpen()
  }

  const finishWorkModalProps = {
    ...useDisclosure()
  }

  const handleOpenFinishWork = (project: string) => {
    setCurrentProject(project)
    finishWorkModalProps.onOpen()
  }

  const fetchProjects = async () => {
    const crowdFundingApiInstance: any = crowdFundingApi(signer)
    const projects = await crowdFundingApiInstance.returnAllProjects()
    const blockTime = await crowdFundingApiInstance.getCurrentTime()
    setProjects(projects)
    setBlockTime(blockTime)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const ProjectCard = ({ project }: any) => {
    const [isWorkSubmitted, setIsWorkSubmitted] = useState(false)
    const [nftPrice, setNftPrice] = useState(BigNumber.from('0'))
    const [nftLimit, setNftLimit] = useState(BigNumber.from('0'))
    const [contribution, setContribution] = useState(BigNumber.from('0'))
    const [userNftAmount, setUserNftAmount] = useState(BigNumber.from('0'))
    const [creator, setCreator] = useState('')
    const [creatorName, setCreatorName] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [timeToSubmitWork, setTimeToSubmitWork] = useState(BigNumber.from('0'))

    const projectApiInstance: any = projectApi(project, signer)

    const fetchData = async () => {
      const isWorkSubmitted = await projectApiInstance.isWorkSubmitted()
      const nftPrice = await projectApiInstance.nftPrice()
      const nftLimit = await projectApiInstance.nftLimit()
      const contribution = await projectApiInstance.contributions(address)
      const userNftAmount = await projectApiInstance.nftAmounts(address)
      const creator = await projectApiInstance.creator()
      const creatorName = await projectApiInstance.creatorName()
      const title = await projectApiInstance.title()
      const description = await projectApiInstance.description()
      const timeToSubmitWork = await projectApiInstance.timeToSubmitWork()

      setCreatorName(creatorName)
      setTitle(title)
      setDescription(description)
      setTimeToSubmitWork(timeToSubmitWork)
      setIsWorkSubmitted(isWorkSubmitted)
      setNftPrice(nftPrice)
      setNftLimit(nftLimit)
      setContribution(contribution)
      setUserNftAmount(userNftAmount)
      setCreator(creator)
    }

    useEffect(() => {
      fetchData()
    }, [])

    const isCreator = (creator.toLowerCase() === address.toLowerCase())
    if (contribution.eq(0) && !isCreator) return null;

    const buyNFTBtn = !isCreator && (
      <Button
        fontWeight={500} fontSize={16} h='40px' w='280px' colorScheme='grass'
        onClick={() => { handleOpen(project, nftPrice) }}>
        {t('buyNFT')}
      </Button>
    )
    const finishWorkBtn = isCreator && (
      <Button
        fontWeight={500} fontSize={16} h='40px' w='280px' colorScheme='grass'
        onClick={() => { handleOpenFinishWork(project) }}>
        {t('finishWork')}
      </Button>
    )
    const withdrawBtn = isCreator && (
      <Button
        fontWeight={500} fontSize={16} h='40px' w='280px' colorScheme='grass'
        onClick={() => { projectApiInstance.withdraw() }}>
        {t('withdraw')}
      </Button>
    )

    return <Center minW='392px' background='white'>
      <VStack p={8} >
        <Text {...valueTextStyle}>
          {title}
        </Text>

        <Text {...descTextStyle}>
          {creatorName}
        </Text>

        <Text {...descTextStyle}>
          {description}
        </Text>

        <Text {...descTextStyle}>
          NFT Bought/Total: {userNftAmount.toString()} / {nftLimit.toString()}
        </Text>

        <Text {...descTextStyle}>
          NFT Price: {ethers.utils.formatEther(nftPrice)}
        </Text>

        <Text {...descTextStyle}>
          Deadline: {getDeadline(timeToSubmitWork.toNumber() - blockTime.toNumber())}
        </Text>

        <Text {...descTextStyle}>
          Work Submitted: {isWorkSubmitted ? 'Yes' : 'No'}
        </Text>

        {buyNFTBtn}

        {finishWorkBtn}

        {withdrawBtn}
      </VStack>
    </Center >
  }

  const buyNFTModal = !currentNftPrice.eq(0) && <BuyNFTModal {...modalProps} project={currentProject} nftPrice={currentNftPrice} />
  const finishWorkModal = currentProject && <FinishWorkModal {...finishWorkModalProps} project={currentProject} />
  const elems = projects.map((project) => {
    return <ProjectCard key={project} project={project} />
  })

  const contentHigh = document.documentElement.clientHeight - 80

  return (
    <VStack minH={contentHigh} bgColor='contentBg' p='32px'>
      {/* <Box width='100%' mb='25px' px='24px'>
        <Text fontSize={34} fontWeight={600} color='textHead'>
          {t('myFundingsTitle')}
        </Text>
      </Box> */}

      <SimpleGrid columns={3} spacing={4} >
        {elems}
      </SimpleGrid>
      {finishWorkModal}
      {buyNFTModal}
    </VStack>
  )
}
