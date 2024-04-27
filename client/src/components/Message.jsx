import { Flex, Text, Avatar } from '@chakra-ui/react';
import React from 'react';

const Message = ({ ownMessage }) => {
  return (
    <>
      {ownMessage ? (

        <Flex gap={2} alignSelf="flex-end">
          <Text maxw="350px" bg="blue.400" p={1} borderRadius={"md"}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic, pariatur voluptates. Cum omnis architecto dolores perferendis est soluta quas. Obcaecati laborum et laudantium corporis consectetur qui amet molestiae optio quia?
          </Text>
        <Avatar src='' w="7" h={7}/>
        </Flex>
      ) : (
        
        <Flex gap={2} alignSelf="flex-end">
          <Text maxw="350px" bg="gray.400" p={1} borderRadius={"md"} color={"black"}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic, pariatur voluptates. Cum omnis architecto dolores perferendis est soluta quas. Obcaecati laborum et laudantium corporis consectetur qui amet molestiae optio quia?
          </Text>
        <Avatar src='' w="7" h={7}/>
        </Flex>
      )}
    </>
  );
};

export default Message;