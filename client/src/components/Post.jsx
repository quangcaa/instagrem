import { Flex, Box, Text } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { Link } from "react-router-dom";
import { Image } from "@chakra-ui/image";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";


const Post = ({ post, user_id }) => {
    const [liked, setLiked] = useState(false);
    const showToast = useShowToast();

    // fetch user data
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`http://localhost:1000/user/${user_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                const data = await res.json();

                console.log(data);

                if(data.error) {
                    showToast("Error", data.error, "error")
                    return
                }
            } catch (error) {
                showToast("Error", error.message, "error")
            }
        }
        
        getUser()
    }, [user_id, showToast])

    return (
        <Link to={"/mark/post/1"}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar size="md" name="Mark Zuck" src="/zuck-avatar.png" />
                    <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        <Avatar
                            size="xs"
                            name="John Park"
                            src=""
                            position={"absolute"}
                            top={"0px"}
                            left="15px"
                            padding={"2px"}
                        />
                        <Avatar
                            size="xs"
                            name="John Park"
                            src=""
                            position={"absolute"}
                            bottom={"0px"}
                            right="-5px"
                            padding={"2px"}
                        />
                        <Avatar
                            size="xs"
                            name="John Park"
                            src=""
                            position={"absolute"}
                            bottom={"0px"}
                            left="4px"
                            padding={"2px"}
                        />
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text fontSize={"sm"} fontWeight={"bold"}>
                                markzuck
                            </Text>
                            <Image src="/verified.png" w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                            <Text fontSize={"sm"} color={"gray.light"}>
                                1d
                            </Text>
                            <BsThreeDots />
                        </Flex>
                    </Flex>

                    <Text fontSize={"sm"}>{post.caption}</Text>
                    {post.media_url && (
                        <Box
                            borderRadius={6}
                            overflow={"hidden"}
                            border={"1px solid"}
                            borderColor={"gray.light"}
                        >
                            <Image src={post.media_url} w={"full"} />
                        </Box>
                    )}

                    <Flex gap={3} my={1}>
                        <Actions liked={liked} setLiked={setLiked} />
                    </Flex>
                    <Flex gap={2} alignItems={"center"}>
                        <Text color={"gray.light"} fontSize={"small"}>
                            {post.comments_count} replies
                        </Text>
                        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                        <Text color={"gray.light"} fontSize={"small"}>
                            {post.likes_count} likes
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    );
};

export default Post;
