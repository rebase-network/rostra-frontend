import * as React from "react";

import { Flex, Link, Text, Image, HStack, Center } from "@chakra-ui/react";
import { imgs } from '../../assets'
// TODO media links
type FooterProps = {};

const Footer = (props: FooterProps) => {
  return (
    <Flex w='100%' h='97px' bgColor="black" color='white'>
      <Center pl="32px">
        <Text>
          © 2021 Rostra.xyz
      </Text>
      </Center>
      <Center pl="32px">
        <Text>
          Donate: 0x8D07CFb29762A7561f004D042DDd47648640B23f
      </Text>
      </Center>

      <Center>
        <HStack minW='330px' p={8} w="120px" spacing="20px">
          <Link href={"https://github.com/rebase-network/rostra-contracts"} target="_blank">
            <Image h="20px" src={imgs.github} />
          </Link>
          <Link href={"https://discord.gg/c6BfH8JQn6"} target="_blank">
            <Image h="20px" src={imgs.discord} />
          </Link>
        </HStack>
      </Center>

    </Flex>
  );
};

export default Footer