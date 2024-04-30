import { Flex, Text, Avatar } from '@chakra-ui/react';
import React from 'react';
import { selectedConversationAtom } from '../atoms/messagesAtom';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

const Message = ({ ownMessage, message }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom)

  return (
    <>
      {ownMessage ? (

        <Flex gap={2} alignSelf="flex-end">
          <Text maxw="350px" bg="blue.400" p={1} borderRadius={"md"}>
            {message.text}
          </Text>
          <Avatar src={user.profile_image_url} w="7" h={7} />
        </Flex>
      ) : (

        <Flex gap={2} >
          <Avatar src={selectedConversation.userProfilePic} w="7" h={7} />
          <Text maxw="350px" bg="gray.400" p={2} borderRadius={"md"} color={"black"}>
            {message.text}
          </Text>
        </Flex>
      )}
    </>
  );
};

export default Message;