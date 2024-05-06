import {
  Avatar,
  Flex,
  Text,
  Image,
  Box,
  Divider,
  Button,
  Spinner,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import React, { useEffect, useState } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username, post_id } = useParams();
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const currentPost = posts[0];
  // console.log(currentPost);

  useEffect(() => {
    const getPost = async () => {
      setPosts([]);

      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`http://localhost:1000/post/${post_id}`, {
          method: "GET",
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

        setPosts([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };

    getPost();
  }, [post_id, showToast, setPosts]);


  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:1000/post/${currentPost.post._id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }
      );
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost) return null;
  // console.log("currentPost", currentPost);

  return (
    <>
      <Flex>
        <Flex w={"full"} align={"center"} gap={3}>
          <Avatar src={user.profile_image_url} size={"md"} name="Mark Zuck" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user.username}
            </Text>
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {formatDistanceToNow(new Date(currentPost.post.createdAt))} ago
          </Text>

          {currentUser?.user_id === user.user_id && (
            <DeleteIcon
              size={20}
              cursor={"pointer"}
              onClick={handleDeletePost}
            />
          )}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost.post.caption}</Text>

      {currentPost.post.media_url && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost.post.media_url[0]} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost.post} />
      </Flex>

      <Divider my={4} />

      <>
        {currentPost.comments?.map((comment, index) => (
          <React.Fragment key={comment._id}>
            <Comment comment={comment} />
            {index !== currentPost.comments.length - 1 && <Divider my={4} />}
          </React.Fragment>
        ))}
      </>
    </>
  );
};

export default PostPage;
