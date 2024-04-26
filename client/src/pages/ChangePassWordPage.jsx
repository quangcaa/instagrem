import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

export default function ChangePassWordPage() {
  const showToast = useShowToast();
  const [inputs, setInputs] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const handleChangePass = async () => {
    // console.log(inputs);
    try {
      const res = await fetch("http://localhost:1000/auth/changePassword", {
        method: "PATCH",
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
      if (data.message) {
        showToast("Success", data.message, "success");
        return;
      }
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Flex align={"center"} justify={"center"}>
      <Stack
        spacing={8}
        w={"full"}
        maxW={"lg"}
        bg={useColorModeValue("white", "gray.dark")}
        rounded={"xl"}
        boxShadow={"lg"}
        py={12}
        px={6}
        mx={"auto"}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
          Change your password
        </Heading>
        <FormControl isRequired>
          <FormLabel>Old Password</FormLabel>
          <Input
            type="password"
            onChange={(e) =>
              setInputs((inputs) => ({
                ...inputs,
                oldPassword: e.target.value,
              }))
            }
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            onChange={(e) =>
              setInputs((inputs) => ({
                ...inputs,
                newPassword: e.target.value,
              }))
            }
          />
        </FormControl>
        <Stack spacing={6}>
          <Button
            bg={"blue.400"}
            color={"white"}
            _hover={{
              bg: "blue.500",
            }}
            onClick={handleChangePass}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
