import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import { Tabs, TabList, Tab, useTheme } from "@chakra-ui/react";

import { appPath } from '../../constants'
type Props = {};



const TabHeader = (props: Props) => {

  const [tabIndex, setTabIndex] = useState(0)
  const theme = useTheme()
  const history = useHistory()
  const { location: { pathname } } = history

  useEffect(() => {

    const path = pathname.substr(5,)

    const activeIdx = appPath.indexOf(path)
    setTabIndex(activeIdx)

  }, [pathname])

  const handleTabsChange = (idx: number) => {
    setTabIndex(idx)
    let path = appPath[idx]
    history.push(`/app/${path}`)
  }

  const tabStyle = (idx: number) => {
    const styles = {
      color: tabIndex === idx ? 'white' : 'textSecondary',
      borderBottomColor: tabIndex === idx ? 'primary' : 'transparent',
      marginBottom: '1px',
      _selected: {
        boxShadow: `0px 2px 0px 0px ${theme.colors.primary}`,
        // borderBottomColor: 'primary'
      }
    }
    return styles
  }

  return (
    <>
      <Tabs isLazy variant='unstyled' pt='40px' pl='88px' bgColor="titleBg" index={tabIndex} onChange={handleTabsChange}>
        <TabList >
          <Tab {...tabStyle(0)}>Investment</Tab>
          <Tab {...tabStyle(1)}>Interest</Tab>
          <Tab {...tabStyle(2)}>Liquidity</Tab>
          <Tab {...tabStyle(3)}>Dashboard</Tab>
        </TabList>
      </Tabs>
    </>
  );
};

export default TabHeader