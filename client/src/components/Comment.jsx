import { Flex, Avatar, Text, Divider } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";

const Comment = ({ comment }) => {
  const [user, setUser] = useState(null);
  const [liked, setLiked] = useState(comment.likes_count);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:1000/user/${comment.user_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await res.json();

        if (data.error) {
          console.error(data.error);
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [comment.user_id]);

  return (
    <>
      {user && (
        <Flex gap={4} py={2} my={2} w={"full"}>
          <Avatar src={user.profile_image_url} mt={2} size={"sm"} />
          <Flex gap={1} w={"full"} flexDirection={"column"}>
            <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                {user.username}
              </Text>
              <Flex gap={2} alignItems={"center"}>
                <Text fontSize={"xs"} color={"gray.light"}>
                  {formatDistanceToNow(new Date(comment.createdAt))} ago
                </Text>
              </Flex>
            </Flex>
            <Text>{comment.comment}</Text>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default Comment;
