import { useRecoilState, useRecoilValue } from "recoil";
import useShowToast from "../hooks/useShowToast";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { Avatar, Divider, Flex, Image, SkeletonCircle, Text, useColorModeValue, Skeleton } from "@chakra-ui/react";
import React, { memo, useEffect, useState } from "react";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";



const MessageContainer = memo(() => {
  const bgColor = useColorModeValue("gray.200", "gray.dark");
  const showToast = useShowToast();

  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const { socket } = useSocket();

  useEffect(() => {
    socket.on("newMessage", (message) => {
      setMessages((preMessages) => [...preMessages, message])
    })
  
    return () => socket.off("newMessage");
  }, [socket])

  useEffect(() => {
    const getMessage = async () => {
      setLoadingMessages(true)
      setMessages([])

      try {
        const res = await fetch(`http://localhost:1000/direct/c/${selectedConversation.user_id}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error")
          return
        }

        setMessages(data.messages);

      } catch (error) {
        showToast("Error", error.message, "error")
      } finally {
        setLoadingMessages(false);
      }
    }

    getMessage()
  }, [showToast, selectedConversation.user_id]);

  return (
    <Flex
      flex='70'
      bg={bgColor}
      borderRadius={"md"}
      p={2}
      flexDirection={"column"}
    >
      {/* Message header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
        <Text display={"flex"} alignItems={"center"}>
          {selectedConversation.username} <Image src='/verified.png' w={4} h={4} ml={1} />
        </Text>
      </Flex>

      <Divider />

      <Flex flexDir={"column"} gap={4} my={4} p={2} height={"400px"} overflowY={"auto"}>
        {loadingMessages && (
          [...Array(5)].map((_, i) => (
            <Flex key={i} gap={2} alignItems={"center"} p={1} borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir={"column"} gap={2}>
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
              </Flex>
              {i % 2 === 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))
        )}

        {!loadingMessages && (
          messages.map((message) => (
            <Message key={message._id} message={message} ownMessage={currentUser.user_id.toString() === message.sender_id.toString()} />
          ))

        )}
      </Flex>

      <MessageInput setMessages={setMessages} />
    </Flex>
  );
});

export default MessageContainer;