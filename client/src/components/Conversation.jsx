import { Avatar, Flex,AvatarBadge, WrapItem, useColorModeValue, Image } from '@chakra-ui/react';
import { Stack, Text } from "@chakra-ui/react";
import { color } from 'framer-motion';
import React from 'react';

const Conversation = () => {
  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={"1"}
      _hover={{
        cursor: 'pointer',
        bg: useColorModeValue('gray.600', 'gray.dark'),
        color: 'white',
      }}
      borderRadius={"md"}
    >
      <WrapItem>
        <Avatar size={{
            base: "xs",
            sm: "sm",
            md: "md",
        }} src="https://bit.ly/borken-link" >
          <AvatarBadge boxSize={"1em"} bg={"green.500"}/>
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
            johnyDang <Image src='/verfied.png' w={4} h={4} ml={1} />
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
            Hello ....
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;