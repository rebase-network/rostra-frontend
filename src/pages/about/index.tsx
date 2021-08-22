import React from 'react'
import { Heading, VStack, Box, Text } from '@chakra-ui/react'

export default function About() {
  const contentHigh = document.documentElement.clientHeight - 80

  return (
    <VStack h={contentHigh} bgColor='contentBg' px='88px' pt='24px'>
      <Box width='100%' mb='25px' px='24px'>
        <Heading as="h2" size="lg" mb='1rem'>
          What is Rostra?
        </Heading>
        <Text>
          Rostra is a DAS(Decentralized Autonomous School),
          try to change the way people learn and share.
        </Text>
        <Heading as="h2" size="lg" mb='1rem' mt='1rem'>
          The problem
        </Heading>
        <Text>
          Current education is broken, we are treated as industrial commodity,
          we learn obselete knowledge,
          we pay high tuition fees that need 10 years hard work to pay back,
          we contribute less to the community and society during the work,
          even worse we can not find a job.
        </Text>

        <Heading as="h2" size="lg" mb='1rem' mt='1rem'>
          The solution
        </Heading>
        <Heading as="h3" size="md" mb='1rem' mt='1rem'>
          Learn as you go
        </Heading>
        <Text>
          You should learn by yourself,
          and learn the knowledge you want to learn,
          you should explore.
        </Text>
        <Heading as="h3" size="md" mb='1rem' mt='1rem'>
          Contribute while learn
        </Heading>
        <Text>
          You do not have to wait for the graduation to contribute,
          each time you learn, research, explore,
          you will contribute by your submitted work.
        </Text>
        <Heading as="h3" size="md" mb='1rem' mt='1rem'>
          Get paid from your contribution, early
        </Heading>
        <Text>
          Your contribution should get paid, and should get paid early,
          this is a reward you should get,
          and also a signal to know whether your direction is welcome,
          which will related to the contribution.
        </Text>
        <Heading as="h3" size="md" mb='1rem' mt='1rem'>
          Work will find you
        </Heading>
        <Text>
          People will see your work, they will find you, hire you.
        </Text>
      </Box>
    </VStack>
  )
}
