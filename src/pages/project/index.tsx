import React, { useCallback, useEffect, useState } from 'react'
import { VStack, Link, Text, SimpleGrid, Center, Button, useDisclosure } from '@chakra-ui/react'
import { BigNumber, ethers } from 'ethers'
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
  mb: 4
}

export default function ProjectList() {
  const contentHigh = document.documentElement.clientHeight - 80
  const [currentProject, setCurrentProject] = useState('')
  const [currentNftPrice, setCurrentNftPrice] = useState(BigNumber.from('0'))
  const { address, signer } = store.useState('address', 'signer')
  const [projects, setProjects] = useState([])
  const [blockTime, setBlockTime] = useState(BigNumber.from('0'))

  const modalProps = {
    ...useDisclosure()
  }

  const handleOpen = (project: string, nftPrice: BigNumber) => {
    console.log('open')
    setCurrentProject(project)
    setCurrentNftPrice(nftPrice)
    modalProps.onOpen()
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
    const [nftSoldAmount, setNftSoldAmount] = useState(BigNumber.from('0'))
    const [isWorkSubmitted, setIsWorkSubmitted] = useState(false)
    const [nftPrice, setNftPrice] = useState(BigNumber.from('0'))
    const [nftLimit, setNftLimit] = useState(BigNumber.from('0'))
    const [creator, setCreator] = useState('')
    const [workTitle, setWorkTitle] = useState('')
    const [workDescription, setWorkDescription] = useState('')
    const [workUrl, setWorkUrl] = useState('')
    const [creatorName, setCreatorName] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [timeToSubmitWork, setTimeToSubmitWork] = useState(BigNumber.from('0'))

    const fetchData = async (project: string) => {
      const projectApiInstance: any = projectApi(project, signer)
      const nftSoldAmount = await projectApiInstance.nftSoldAmount()
      const isWorkSubmitted = await projectApiInstance.isWorkSubmitted()
      const nftPrice = await projectApiInstance.nftPrice()
      const nftLimit = await projectApiInstance.nftLimit()
      const creator = await projectApiInstance.creator()
      const creatorName = await projectApiInstance.creatorName()
      const title = await projectApiInstance.title()
      const description = await projectApiInstance.description()
      const timeToSubmitWork = await projectApiInstance.timeToSubmitWork()
      const workTitle = await projectApiInstance.workTitle()
      const workDescription = await projectApiInstance.workDescription()
      const workUrl = await projectApiInstance.workUrl()

      setCreatorName(creatorName)
      setTitle(title)
      setDescription(description)
      setTimeToSubmitWork(timeToSubmitWork)
      setNftSoldAmount(nftSoldAmount)
      setIsWorkSubmitted(isWorkSubmitted)
      setNftPrice(nftPrice)
      setNftLimit(nftLimit)
      setCreator(creator)
      setWorkTitle(workTitle)
      setWorkDescription(workDescription)
      setWorkUrl(workUrl)
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

    let workInfo

    if (isWorkSubmitted) {
      workInfo = (
        <VStack>
          <Text {...valueTextStyle} mb="1">
            {/* {workTitle} */}
            <Link href={workUrl}>{workTitle}</Link>
          </Text>

          <Text>
            {workDescription}
          </Text>
        </VStack>
      )
    }

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
          NFT Sold/Total: {nftSoldAmount.toString()} / {nftLimit.toString()}
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
        {workInfo}
        {buyNFTBtn}
      </VStack>
    </Center >
  }

  const buyNFTModal = !currentNftPrice.eq(0) && <BuyNFTModal {...modalProps} project={currentProject} nftPrice={currentNftPrice} />
  const elems = projects.map((project) => {
    return <ProjectCard key={project} project={project} />
  })

  return (
    <VStack minH={contentHigh} bgColor='contentBg' p='32px'>
      {/* <Box width='100%' mb='25px'>
        <Heading as="h2" size="md">
          {t('fundingTitle')}
        </Heading>
      </Box> */}

      <SimpleGrid columns={{ sm: 1, md: 2, xl: 3 }} spacing={4} >
        {elems}
      </SimpleGrid>
      {buyNFTModal}
    </VStack>
  )
}
