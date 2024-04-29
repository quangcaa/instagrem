import { Box, VStack, Flex, Text, Link } from "@chakra-ui/layout";
import { Avatar, useToast, Button } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";

const UserHeader = ({ user }) => {

  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);

  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(user.follower_count);
  const [updating, setUpdating] = useState(false);

  const showToast = useShowToast();

  const fetchFollowStatus = async () => {
    try {
      const res = await fetch(`http://localhost:1000/user/${user.username}/checkFollow`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json(); // Extract JSON data
      setFollowing(data.isFollowing);
    } catch (error) {
      console.error('Error fetching follow status:', error);
    }
  };

  useEffect(() => {
    fetchFollowStatus(); // Fetch follow status when component mounts
  }, [user])

  console.log(following)

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: "Success.",
        status: "success",
        description: "Profile link copied.",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast("Error", "You need to login to follow a user", "error");
      return;
    }
    setUpdating(true);

    try {
      const res = await fetch(`http://localhost:1000/user/${user.username}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      if (following) {
        showToast("Success", `Unfollowed ${user.username}`, "success");
        setFollowerCount(followerCount - 1);
      } else {
        showToast("Success", `Followed ${user.username}`, "success");
        setFollowerCount(followerCount + 1);
      }

      setFollowing(!following);

      console.log(data);

    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setUpdating(false);
    }
  }

  return (

    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user?.full_name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user?.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              thread.next
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            name={user?.full_name}
            src={user?.profile_image_url}
            size={{
              base: "md",
              md: "xl",
            }}
          />
        </Box>
      </Flex>

      <Text>{user?.bio}</Text>

      {currentUser.user_id === user.user_id && (
        <Link as={RouterLink} to={"/update"}>
          <Button size={"sm"}> Update Profile </Button>
        </Link>
      )}
      {currentUser.user_id !== user?.user_id && (
        <Button size={"sm"} onClick={handleFollowUnfollow}
          isLoading={updating}
        >
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{followerCount} followers</Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Thread</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1.5px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>

  );
};

export default UserHeader;
