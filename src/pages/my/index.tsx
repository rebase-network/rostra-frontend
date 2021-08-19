import React, { useCallback, useEffect, useState } from 'react'
import { VStack, Box, Text, SimpleGrid, Center, Button, useDisclosure } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import BuyNFTModal from '../../components/Modals/BuyNFTModal'
import { formatBalance } from '../../utils'
import { t } from '../../i18n'
import { crowdFundingApi, projectApi } from '../../utils/api'
import store from '../../stores/account'

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

export default function MyProjectList() {
  const contentHigh = document.documentElement.clientHeight - 80 - 81 - 97
  const [currentProject, setCurrentProject] = useState('')
  const [currentNftPrice, setCurrentNftPrice] = useState(0)
  const { address, signer } = store.useState('address', 'signer')
  const [projects, setProjects] = useState([])
  const [blockTime, setBlockTime] = useState(BigNumber.from('0'))
  const [nftPrices, setNftPrices] = useState({} as any)

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
    const [contribution, setContribution] = useState(BigNumber.from('0'))
    const [userNftAmount, setUserNftAmount] = useState(BigNumber.from('0'))
    const fetchData = async (project: string) => {
      const projectApiInstance: any = projectApi(project, signer)
      const basicInfo = await projectApiInstance.getBasicInfo()
      const currentBalance = await projectApiInstance.currentBalance()
      const nftSoldAmount = await projectApiInstance.nftSoldAmount()
      const isWorkSubmitted = await projectApiInstance.isWorkSubmitted()
      const nftPrice = await projectApiInstance.nftPrice()
      const nftLimit = await projectApiInstance.nftLimit()
      const contribution = await projectApiInstance.contributions(address)
      const userNftAmount = await projectApiInstance.nftAmounts(address)

      setCurrentBalance(currentBalance)
      setNftSoldAmount(nftSoldAmount)
      setIsWorkSubmitted(isWorkSubmitted)
      setNftPrice(nftPrice.toNumber())
      // setNftPrices({ ...nftPrices, [project]: nftPrice })
      setNftLimit(nftLimit)
      setBasicInfo(basicInfo)
      setContribution(contribution)
      setUserNftAmount(userNftAmount)
    }

    useEffect(() => {
      fetchData(project)
    }, [project])

    if (contribution.eq(0)) return null;

    const getDeadline = (interval: number) => new Date(+ new Date() + interval * 1000).toLocaleDateString()


    return <Center minW='392px' background='white'>
      <VStack p={8} >
        <Text {...valueTextStyle}>
          {basicInfo.title}
        </Text>

        {/* <Text {...descTextStyle}>
          {basicInfo.description}
        </Text> */}

        <Text {...descTextStyle}>
          NFT Bought/Total: {userNftAmount.toString()} / {nftLimit.toString()}
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

        <Button
          fontWeight={500} fontSize={16} h='60px' w='280px' colorScheme='grass'
          onClick={() => { handleOpen(project, nftPrice) }}>
            {t('buyNFT')}
        </Button>
      </VStack>
    </Center >
  }

  const buyNFTModal = currentNftPrice && <BuyNFTModal {...liqModalProps} project={currentProject} nftPrice={currentNftPrice} />
  const elems = projects.map((project) => {
    return <ProjectCard key={project} project={project} />
  })

  return (
    <VStack h={contentHigh} bgColor='contentBg' px='88px' pt='24px'>
      <Box width='100%' mb='25px' px='24px'>
        <Text fontSize={34} fontWeight={600} color='textHead'>
          {t('myFundingsTitle')}
        </Text>
      </Box>

      <SimpleGrid columns={3} spacing={4} >
        {elems}
      </SimpleGrid>
      {buyNFTModal}
    </VStack>
  )
}
