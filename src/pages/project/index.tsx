import React, { useCallback, useEffect, useState } from 'react'
import { Heading, VStack, Box, Text, SimpleGrid, Center, Button, useDisclosure } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import BuyNFTModal from '../../components/Modals/BuyNFTModal'
import { t } from '../../i18n'
import { crowdFundingApi, projectApi } from '../../utils/api'
import store from '../../stores/account'
import { getDeadline } from '../../utils'

const descTextStyle = {
  color: 'textDesc',
  fontSize: '14px',
  fontWeight: 400
}

const valueTextStyle = {
  color: 'textHead',
  fontSize: '18px',
  fontWeight: 600,
  mb: 12
}

export default function ProjectList() {
  const contentHigh = document.documentElement.clientHeight - 80
  const [currentProject, setCurrentProject] = useState('')
  const [currentNftPrice, setCurrentNftPrice] = useState(0)
  const { address, signer } = store.useState('address', 'signer')
  const [projects, setProjects] = useState([])
  const [blockTime, setBlockTime] = useState(BigNumber.from('0'))

  const liqModalProps = {
    ...useDisclosure()
  }

  const handleOpen = (project: string, nftPrice: number) => {
    console.log('open')
    setCurrentProject(project)
    setCurrentNftPrice(nftPrice)
    liqModalProps.onOpen()
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
    const [basicInfo, setBasicInfo] = useState({
      title: '',
      description: '',
      timeToSubmitWork: BigNumber.from('0')
    })
    const [currentBalance, setCurrentBalance] = useState(BigNumber.from('0'))
    const [nftSoldAmount, setNftSoldAmount] = useState(BigNumber.from('0'))
    const [isWorkSubmitted, setIsWorkSubmitted] = useState(false)
    const [nftPrice, setNftPrice] = useState(0)
    const [nftLimit, setNftLimit] = useState(BigNumber.from('0'))
    const [creator, setCreator] = useState('')

    const fetchData = async (project: string) => {
      const projectApiInstance: any = projectApi(project, signer)
      const basicInfo = await projectApiInstance.getBasicInfo()
      const currentBalance = await projectApiInstance.currentBalance()
      const nftSoldAmount = await projectApiInstance.nftSoldAmount()
      const isWorkSubmitted = await projectApiInstance.isWorkSubmitted()
      const nftPrice = await projectApiInstance.nftPrice()
      const nftLimit = await projectApiInstance.nftLimit()
      const creator = await projectApiInstance.creator()

      setCurrentBalance(currentBalance)
      setNftSoldAmount(nftSoldAmount)
      setIsWorkSubmitted(isWorkSubmitted)
      setNftPrice(nftPrice.toNumber())
      setNftLimit(nftLimit)
      setBasicInfo(basicInfo)
      setCreator(creator)
    }

    useEffect(() => {
      fetchData(project)
    }, [project])

    const isCreator = (creator.toLowerCase() === address.toLowerCase())
    const buyNFTBtn = (
      <Button
        fontWeight={500} fontSize={16} h='40px' w='280px' colorScheme='grass'
        disabled={isCreator}
        onClick={() => { handleOpen(project, nftPrice) }}>
        {t('buyNFT')}
      </Button>
    )

    return <Center minW='392px' background='white'>
      <VStack p={8} >
        <Text {...valueTextStyle}>
          {basicInfo.title}
        </Text>

        <Text {...descTextStyle}>
          {basicInfo.description}
        </Text>

        <Text {...descTextStyle}>
          NFT Sold/Total: {nftSoldAmount.toString()} / {nftLimit.toString()}
        </Text>

        <Text {...descTextStyle}>
          NFT Price: {nftPrice}
        </Text>

        <Text {...descTextStyle}>
          Deadline: {getDeadline(basicInfo.timeToSubmitWork.toNumber() - blockTime.toNumber())}
        </Text>

        <Text {...descTextStyle}>
          Work Submitted: {isWorkSubmitted ? 'Yes' : 'No'}
        </Text>

        {buyNFTBtn}
      </VStack>
    </Center >
  }

  const buyNFTModal = currentNftPrice && <BuyNFTModal {...liqModalProps} project={currentProject} nftPrice={currentNftPrice} />
  const elems = projects.map((project) => {
    return <ProjectCard key={project} project={project} />
  })

  return (
    <VStack minH={contentHigh} bgColor='contentBg' pt='24px'>
      <Box width='100%' mb='25px' px='32px'>
        <Heading as="h2">
          {t('fundingTitle')}
        </Heading>
      </Box>

      <SimpleGrid columns={3} spacing={4} >
        {elems}
      </SimpleGrid>
      {buyNFTModal}
    </VStack>
  )
}
