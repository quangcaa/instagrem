import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import { Link } from "react-router-dom";

export default function UpdateProfilePage() {
  const showToast = useShowToast();
  const [user, setUser] = useRecoilState(userAtom);
  const fileRef = useRef(null);
  const [inputs, setInputs] = useState({
    full_name: user.full_name,
    username: user.username,
    email: user.email,
    bio: user.bio,
  });
  if (!inputs.full_name) {
    inputs.full_name = "";
  }
  if (!inputs.bio) {
    inputs.bio = "";
  }

  const { handleImageChange, imgUrl } = usePreviewImg();
  const handleChangeAvatar = async () => {
    const file = fileRef.current.files[0];
    if (!file) {
      showToast("Error", "No file selected", "error");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("http://localhost:1000/account/avatar", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      console.log(data);
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", data.message, "success");
      setUser({ ...user, profile_image_url: imgUrl });
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...user,
          profile_image_url: imgUrl,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmitInfo = async () => {
    try {
      const res = await fetch("http://localhost:1000/account/edit", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      // console.log(data);

      showToast("Success", data.message, "success");
      setUser({
        ...inputs,
        profile_image_url: user.profile_image_url,
        user_id: user.user_id,
      });
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...inputs,
          profile_image_url: user.profile_image_url,
          user_id: user.user_id,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex align={"center"} justify={"center"} my={6}>
      <Stack
        spacing={4}
        w={"full"}
        maxW={"lg"}
        bg={useColorModeValue("white", "gray.dark")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          User Profile Edit
        </Heading>
        <FormControl>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar
                size="xl"
                boxShadow={"md"}
                src={imgUrl || user.profile_image_url}
              />
            </Center>
            <Center w="full">
              <Stack spacing={6} direction={["column", "row"]}>
                <Button w="full" onClick={handleChangeAvatar}>
                  {" "}
                  Change Avatar
                </Button>
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Choose Avatar
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />

                {/* <Button w="full">Delete Avatar</Button> */}
              </Stack>
            </Center>
          </Stack>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Full name</FormLabel>
          <Input
            placeholder="Your full name"
            value={inputs.full_name}
            onChange={(e) =>
              setInputs({ ...inputs, full_name: e.target.value })
            }
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            placeholder="UserName"
            value={inputs.username}
            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="your-email@example.com"
            value={inputs.email}
            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            _placeholder={{ color: "gray.500" }}
            type="email"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Bio</FormLabel>
          <Input
            placeholder="Your bio."
            value={inputs.bio}
            onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
            _placeholder={{ color: "gray.500" }}
            type="email"
          />
        </FormControl>
        <Link to={"/update/changepassword"}>
          <Button w="full">Change password</Button>
        </Link>
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
          >
            Cancel
          </Button>
          <Button
            bg={"green.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "green.500",
            }}
            onClick={handleSubmitInfo}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
