import { Flex, Box, Text } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { Image } from "@chakra-ui/image";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';


const Post = ({ post, user_id }) => {
    const [liked, setLiked] = useState(false);
    const [user, setUser] = useState(null);
    const showToast = useShowToast();

    const navigate = useNavigate();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const previousImage = () => {
        setCurrentImageIndex((prevIndex) => prevIndex === 0 ? post.images.length - 1 : prevIndex - 1);
    };

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => prevIndex === post.images.length - 1 ? 0 : prevIndex + 1);
    };

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

                console.log(data.user);

                if (data.error) {
                    showToast("Error", data.error, "error")
                    return
                }

                setUser(data.user)
            } catch (error) {
                showToast("Error", error.message, "error")
                setUser(null)
            }
        }

        getUser()
    }, [user_id, showToast])

    if (!user) return null;
    return (
        <>
            <Link to={`/@${user.username}/post/${post._id}`}>
                <Flex gap={3} mb={4} py={5}>
                    <Flex flexDirection={"column"} alignItems={"center"}>
                        <Avatar size="md" name={user.username} src={user?.profile_image_url}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(`/${user.username}`)
                            }}
                        />
                    </Flex>
                    <Flex flex={1} flexDirection={"column"} gap={2}>
                        <Flex justifyContent={"space-between"} w={"full"}>
                            <Flex w={"full"} alignItems={"center"}>
                                <Text fontSize={"sm"} fontWeight={"bold"}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate(`/${user.username}`)
                                    }}
                                >
                                    {user?.username}
                                </Text>
                                <Image src="/verified.png" w={4} h={4} ml={1} />
                            </Flex>
                            <Flex gap={4} alignItems={"center"}>
                                <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
                                    {formatDistanceToNow(new Date(post.createdAt))} ago
                                </Text>
                            </Flex>
                        </Flex>

                        <Text fontSize={"sm"}>{post.caption}</Text>
                        {/* {post.media_url && (
                            <Box
                                borderRadius={6}
                                overflow={"hidden"}
                                border={"1px solid"}
                                borderColor={"gray.light"}
                            >
                                <Image src={post.media_url} w={"full"} />
                            </Box>
                        )} */}

                        {/* {post.media_url && post.media_url.map((img, index) => (
                            <Image key={index} src={img} alt={`post image ${index + 1}`} />
                        ))} */}

                        {post.media_url && post.media_url.length > 1 && (
                            <Flex position="relative" alignItems="center" justifyContent="space-between">
                                <Button onClick={previousImage}>
                                    <ChevronLeftIcon />
                                </Button>
                                <Image src={post.media_url[currentImageIndex]} alt={`post image ${currentImageIndex + 1}`} />
                                <Button onClick={nextImage}>
                                    <ChevronRightIcon />
                                </Button>
                            </Flex>
                        )}

                        {post.media_url && post.media_url.length === 1 && (
                            <Image src={post.media_url[0]} alt="post image" />
                        )}

                        <Flex gap={3} my={1}>
                            <Actions liked={liked} setLiked={setLiked} />
                        </Flex>
                        <Flex gap={2} alignItems={"center"}>
                            <Text color={"gray.light"} fontSize={"small"}>
                                {post.likes_count} likes
                            </Text>
                            <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                            <Text color={"gray.light"} fontSize={"small"}>
                                {post.comments_count} replies
                            </Text>

                        </Flex>
                    </Flex>
                </Flex>
            </Link>
            <hr />
        </>
    );
};

export default Post;
