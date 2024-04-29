import { Flex, Text, Avatar } from '@chakra-ui/react';
import React from 'react';

const Message = ({ ownMessage }) => {
  return (
    <>
      {ownMessage ? (

        <Flex gap={2} alignSelf="flex-end">
          <Text maxw="350px" bg="blue.400" p={1} borderRadius={"md"}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic, pariatur voluptates.
          </Text>
        <Avatar src='' w="7" h={7}/>
        </Flex>
      ) : (
        
        <Flex gap={2} >
          <Avatar src='' w="7" h={7}/>
          <Text maxw="350px" bg="gray.400" p={2} borderRadius={"md"} color={"black"}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic, pariatur voluptates. 
          </Text>
        </Flex>
      )}
    </>
  );
};

export default Message;