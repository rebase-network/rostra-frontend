import React, { Suspense, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Box, useColorMode, } from "@chakra-ui/react"
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import TabHeader from '../components/TabHeader'

import TipModal from '../components/Modals/TipModal'
import Header from '../components/Header'
import Footer from '../components/Footer'

import Project from './project'
import CreateProject from './create'
import ConnectWallet from '../components/ConnectWallet'
import { globalStore } from 'rekv'


export const App = () => {
  const { colorMode } = useColorMode()
  const color = `text.${colorMode}`
  const background = `background.${colorMode}`

  const fetchData = async () => {
    globalStore.setState({
      traPrice: 0
    })
  }
  useEffect(() => {
    fetchData()

  }, [])

  return (
    <Suspense fallback={null}>
      {/* <ColorModeScript /> */}
      <Route component={GoogleAnalyticsReporter} />
      <Box bg={background} w="100%" minH="100vh" color={color}>
        <Header />
        <ConnectWallet>
          <Switch>
            <Route exact strict path="/fundings/create" component={CreateProject} />
            <Route exact strict path="/*" component={Project} />
          </Switch>
        </ConnectWallet>

        <TipModal />
      </Box>
      <Footer />
    </Suspense>
  )
}
