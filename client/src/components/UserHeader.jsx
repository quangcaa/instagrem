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
import ModalFollowers from "./ModalFollowers";
import ModalFollowing from "./ModalFollowing";

const UserHeader = ({ user }) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);

  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(user?.followers);
  const [followingCount, setFollowingCount] = useState(user?.following);

  const [updating, setUpdating] = useState(false);

  const showToast = useShowToast();

  // Fetch follow status (conditionally executed)
  useEffect(() => {
    if (currentUser) {
      const fetchFollowStatus = async () => {
        try {
          const token = localStorage.getItem("token");

          const res = await fetch(
            `http://localhost:1000/user/${user.username}/checkFollow`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              credentials: "include",
            }
          );
          const data = await res.json();
          setFollowing(data.isFollowing);
        } catch (error) {
          console.error("Error fetching follow status:", error);
        }
      };
      fetchFollowStatus();
    }
  }, [user, currentUser]);

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
    if (updating) return;

    try {
      // ... (follow/unfollow logic remains the same)
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:1000/user/${user.username}/follow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: "include",
        }
      );

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
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user?.full_name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user?.username}</Text>
            {/* <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              thread.next
            </Text> */}
          </Flex>
        </Box>
        <Box>
          <Avatar
            name={user?.full_name}
            src={user?.profile_image_url}
            size={{ base: "md", md: "xl" }}
          />
        </Box>
      </Flex>

      <Text>{user?.bio}</Text>

      {/* Login buttons or message based on currentUser */}

      {currentUser ? (
        currentUser.user_id !== user?.user_id ? (
          <Button
            size={"sm"}
            onClick={handleFollowUnfollow}
            isLoading={updating}
            variant="outline" colorScheme="black"
          >
            {following ? "Unfollow" : "Follow"}
          </Button>
        ) : (
          <Link as={RouterLink} to={"/update"}>
            <Button size={"sm"} variant="outline" colorScheme="black">Update Profile</Button>
          </Link>
        )
      ) : (
        <Link as={RouterLink} to={"/auth"}>
          <Button size="sm" variant="outline" colorScheme="black">Follow</Button>
        </Link>

      )}

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={5} alignItems={"center"}>
          {/* <Text color={"gray.light"}>{followerCount} followers</Text> */}
          <ModalFollowers nameOfButton={`${followerCount} followers`} />
          {/* <Text color={"gray.light"}>{followingCount} followings</Text> */}
          <ModalFollowing nameOfButton={`${followingCount} followings`} />
        </Flex>
        <Flex>
          <Menu>
            <MenuButton>
              <CgMoreO size={24} cursor={"pointer"} />
            </MenuButton>
            <Portal>
              <MenuList>
                <MenuItem onClick={copyURL}>
                  Copy link
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
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
          <Text fontWeight={"bold"}>Posts</Text>
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
