import { Flex, Box, Text } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { Image } from "@chakra-ui/image";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const Post = ({ post, user_id }) => {
  const [user, setUser] = useState(null);
  const currentUser = useRecoilValue(userAtom);

  const [posts, setPosts] = useRecoilState(postsAtom);

  const showToast = useShowToast();
  const navigate = useNavigate();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const previousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? post.media_url.length - 1 : prevIndex - 1
    );
  };
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === post.media_url.length - 1 ? 0 : prevIndex + 1
    );
  };

  // fetch user data
  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:1000/user/${user_id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });

        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setUser(data.user);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUser(null);
      }
    };

    getUser();
  }, [user_id, showToast]);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:1000/post/${post._id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", "Post deleted", "success");
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!user) return null;

  return (
    <>
      {/* <Link to={`/${user.username}/post/${post._id}`}> */}
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size="md"
            name={user.username}
            src={user?.profile_image_url}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
        </Flex>

        <Flex flex={1} flexDirection={"column"}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
                {user?.username}
              </Text>
            </Flex>

            <Flex gap={4} alignItems={"center"}>
              <Text
                fontSize={"xs"}
                width={36}
                textAlign={"right"}
                color={"gray.light"}
              >
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>

              {currentUser?.user_id === user.user_id && (
                <DeleteIcon size={20} onClick={handleDeletePost} />
              )}
            </Flex>
          </Flex>

          <Text fontSize={"sm"}>{post.caption}</Text>
          {post.media_url && post.media_url.length > 1 && (
            <Flex
              position="relative"
              alignItems="center"
              justifyContent="space-between"
            >
              <Button onClick={previousImage}>
                <ChevronLeftIcon />
              </Button>
              <Link to={`/${user.username}/post/${post._id}`}>
                <Image
                  src={post.media_url[currentImageIndex]}
                  alt={`post image ${currentImageIndex + 1}`}
                />
              </Link>
              <Button onClick={nextImage}>
                <ChevronRightIcon />
              </Button>
            </Flex>
          )}
          {post.media_url && post.media_url.length === 1 && (
            <Link to={`/${user.username}/post/${post._id}`}>
              <Image src={post.media_url[0]} alt="post image" />
            </Link>
          )}

          <Flex gap={3} my={1}>
            <Actions post={post} setPosts={setPosts} />
          </Flex>
        </Flex>
      </Flex>
      {/* </Link> */}
      <hr />
    </>
  );
};

export default Post;
