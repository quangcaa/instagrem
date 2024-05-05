import { Box, Flex, Text } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { Input, Button } from "@chakra-ui/react";
import { SkeletonCircle, Skeleton } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi"
import MessageContainer from "../components/MessageContainer";
import React, { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";


const ChatPage = () => {
    const showToast = useShowToast();
    const [loadingConversation, setLoadingConversation] = useState(true);
    const [conversations, setConversations] = useRecoilState(conversationsAtom);
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
    const [searchText, setSeachText] = useState("");
    const [searchingUser, setSearchingUser] = useState(false);
    const currentUser = useRecoilValue(userAtom);
    const { socket, onlineUsers } = useSocket();

    //console.log("onlineUsers:", onlineUsers);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const getConversations = async () => {
            try {
                const res = await fetch("http://localhost:1000/direct/inbox", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                console.log(data);

                setConversations(data);

            } catch (error) {
                showToast("Error", error.message, "error")
            } finally {
                setLoadingConversation(false);
            }
        }

        getConversations()
    }, [showToast, setConversations])

    const handleConversationSearch = async (e) => {
        e.preventDefault();
        setSearchingUser(true);
        
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:1000/search/${searchText}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const searchUser = await res.json();

            if (searchUser.error) {
                showToast("Error", searchUser.error, "error")
                return
            }
            console.log(searchUser);

            const searchUserArray = Object.values(searchUser);
            // console.log(searchUserArray[1][0]);
            const choseUser = searchUserArray[1][0];

            // If user is already in conversation with searched user
            const conversationAlreadyExists = conversations.find(
                (conversation) => conversation.participants[0].user_id.toString() === searchUser.user_id.toString()
            );
            if (conversationAlreadyExists) {
                setSelectedConversation({
                    _id: conversations.find(conversation => conversation.user.user_id.toString() === choseUser.searchList.user_id.toString())._id,
                    user_id: choseUser.user_id,
                    username: choseUser.username,
                    userProfilePic: choseUser.profile_image_url
                })
            }

            const mockConversation = {
                lastMessage: {
                    text: "",
                    sender: ""
                },
                _id: Date.now(),
                participants: [
                    {
                        user_id: searchUser.user_id,
                        username: searchUser.username,
                        userProfilePic: searchUser.profile_image_url
                    }
                ]
            }
            setConversations((prevConvs) => [...prevConvs, mockConversation]);

        } catch (error) {
            showToast("Error", error.message, "error")
        } finally {
            setSearchingUser(false);
        }
    }



    return (

        <Box position={"absolute"} left={"50%"} w={{
            base: "100%",
            md: "80%",
            ld: "750px"
        }}
            p={4}
            transform={"translateX(-50%)"} >
            <Flex gap={4} flexDirection={{
                base: "column",
                md: "row",
            }}
                maxW={{
                    sm: "400px",
                    md: "full",
                }}
                mx={"auto"}
            >
                <Flex flex={30} gap={2} flexDirection={"column"} maxW={{
                    sm: "250px",
                    md: "full",
                }}
                    mx={"auto"}
                >
                    <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
                        Your Conversation
                    </Text>
                    <form onSubmit={handleConversationSearch}>
                        <Flex alignItems={"center"} gap={2}>
                            <Input placeholder="Search user" onChange={(e) => setSeachText(e.target.value)} />
                            <Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}>
                                <SearchIcon />
                            </Button>
                        </Flex>
                    </form>

                    {loadingConversation &&
                        [0, 1, 2, 3, 4, 5].map((_, i) => (
                            <Flex key={i} gap={4} alignItems={"center"} p={1} borderRadius={"md"}>
                                <Box>
                                    <SkeletonCircle size={"10"} />
                                </Box>
                                <Flex w={"full"} flexDirection={"column"} gap={3}>
                                    <Skeleton h={"10px"} w={"80px"} />
                                    <Skeleton h={"8px"} w={"90%"} />
                                </Flex>
                            </Flex>
                        ))
                    }

                    {!loadingConversation && (
                        conversations.map((conversation) => (
                            // Kiểm tra xem conversation có tồn tại và có thuộc tính _id không
                            // conversation && conversation.conversation && conversation.conversation._id &&
                            <Conversation
                                key={conversation.conversation._id}
                                isOnline={onlineUsers.includes(conversation.conversation.participants[0].user_id)}
                                conversation={conversation.conversation}
                                user={conversation.user}
                                lastMessage={conversation.lastMessage}
                                
                            />
                            
                        ))
                    )}
                </Flex>

                {!selectedConversation._id && (
                    <Flex flex={70} borderRadius={"md"} p={2} flexDir={"column"} alignItems={"center"} justifyContent={"center"} height={"400px"}>
                        <GiConversation size={100} />
                        <Text size={20}>Select Conversation</Text>
                    </Flex>
                )}

                {selectedConversation._id && <MessageContainer />}
            </Flex>
        </Box>
    );
};
export default ChatPage;