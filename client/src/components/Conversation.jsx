import { Avatar, Flex, AvatarBadge, WrapItem, useColorModeValue, Image, useColorMode } from '@chakra-ui/react';
import { Stack, Text } from "@chakra-ui/react";
import { color } from 'framer-motion';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { BsCheck2All } from 'react-icons/bs';
import { selectedConversationAtom } from '../atoms/messagesAtom';


const Conversation = ({ conversation, user, lastMessage, isOnline }) => {
  const currentUser = useRecoilValue(userAtom)
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
  //const lastMessage = conversation.lastMessage;
	
  const colorMode = useColorMode()

  console.log("selectedConverstion", selectedConversation);
  console.log("Is Online:", isOnline);
  //console.log("key:", key);
  // console.log("conversation:", conversation);
  // console.log("user:", user);
  // console.log("lastMessage:", lastMessage);
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
      onClick={() => {
        if (conversation) {
          setSelectedConversation({
              _id: conversation._id,
              user_id: user.user_id,
              username: user.username,
              userProfilePic: user.profile_image_url
          })
      }
      }}
      bg={selectedConversation && selectedConversation._id === conversation._id ? (colorMode === 'light' ? 'gray.600' : 'gray.dark') : ""}

      borderRadius={"md"}
    >
      <WrapItem>
        <Avatar size={{
          base: "xs",
          sm: "sm",
          md: "md",
        }} src={user.profile_image_url} >
          {isOnline ? <AvatarBadge boxSize={"1em"} bg={"green.500"} /> : ""}
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
          {user.username} <Image src='/verified.png' w={4} h={4} ml={1} />
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          {currentUser.user_id.toString() === lastMessage.sender_id.toString() ? <BsCheck2All size={16} /> : ""}
          {lastMessage.text.length > 18 ? lastMessage.text.slice(0, 18) + "..." : lastMessage.text}
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;