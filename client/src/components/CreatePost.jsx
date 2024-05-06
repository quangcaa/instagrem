import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewingImg";
import { IoCreateOutline } from "react-icons/io5";
import { FaImages } from "react-icons/fa";
import { useRecoilState } from "recoil";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";

const MAX_CHAR = 500;
const MAX_IMAGES = 5;

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [postText, setPostText] = useState("");
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const [posts, setPosts] = useRecoilState(postsAtom);

  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);

  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);

  const handleTextChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    setLoading[true];
    const selectedFiles = imageRef.current.files;

    // if (!selectedFiles.length) {
    //   showToast("Error", "Please select image(s) to upload", "error");
    //   setLoading(false);
    //   return;
    // }

    const formData = new FormData();
    formData.append("caption", postText);

    for (let i = 0; i < selectedFiles.length && i < MAX_IMAGES; i++) {
      const file = selectedFiles[i];
      if (file && file.type.startsWith("image/")) {
        formData.append(`image`, file); // Assuming backend can handle multiple images
      }
    }

    // formData.append('image', selectedFiles);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:1000/post/create`, {
        method: "POST",
        credentials: "include",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        showToast("Success", "Post created successfully", "success");
        // if (username === user?.username) {
        //   setPosts([data.post, ...posts]);
        // }
      } else {
        showToast("Error", data.error, "error");
        return;
      }

      const res2 = await fetch(`http://localhost:1000/post/${data.post._id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data2 = await res2.json();

      if (data2.error) {
        showToast("Error", data2.error, "error");
        return;
      }

      setPosts([data2.post, ...posts]);

      //   if (username === user.username) {
      //     setPosts([data.post, ...posts]);
      //   }
      onClose();
      setPostText("");
      setImgUrl([]);
      setRemainingChar(MAX_CHAR);
    } catch (error) {
      console.error("Error creating post:", error);
      showToast("Error", error, "error");
    }
  };

  const handleImageRemove = (index) => {
    const updatedImages = [...imgUrl];
    updatedImages.splice(index, 1);
    setImgUrl(updatedImages);
  };

  // const handleImageSelect = (e) => {
  //   const selectedFiles = e.target.files;

  //   // Check for exceeding maximum image limit
  //   if (selectedFiles.length + imgUrl.length > MAX_IMAGES) {
  //     showToast(
  //       "Error",
  //       `You can only select up to ${MAX_IMAGES} images`,
  //       "error"
  //     );
  //     return;
  //   }

  //   const validImages = [];
  //   for (let i = 0; i < selectedFiles.length; i++) {
  //     const file = selectedFiles[i];
  //     if (file && file.type.startsWith("image/")) {
  //       validImages.push(URL.createObjectURL(file));
  //     }
  //   }

  //   setImgUrl([...imgUrl, ...validImages]);
  // };

  return (
    <>
      <IconButton
        size={"sm"}
        icon={<IoCreateOutline size={30} />}
        onClick={onOpen}
        bg="transparent !important"
        _hover={{ bg: "transparent !important" }}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={1}>
            <FormControl>

              <Textarea
                placeholder="Write a caption..."
                onChange={handleTextChange}
                value={postText}
              />

              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>
              <FaImages
                style={{ cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()}
              />

              <Input
                type="file"
                multiple
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />


            </FormControl>

            {imgUrl.length > 0 && ( // Display previews only if images are selected
              <Flex mt={5} w={"full"} position={"relative"} flexWrap={"wrap"}>
                {imgUrl.map(
                  (
                    imageUrl,
                    index // Loop through each image URL
                  ) => (
                    <div key={index} style={{ position: "relative" }}> {/* New container */}
                      <Image
                        src={imageUrl}
                        alt={`Selected Image ${index + 1}`}
                        mr={2}
                        maxWidth="100%"
                        maxHeight="200px"
                        objectFit="cover"
                      />
                      <CloseButton
                        onClick={() => handleImageRemove(index)}
                        style={{ position: "absolute", top: 5, right: 5 }} // Positioned within container
                      />
                    </div>
                  )
                )}
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleCreatePost}
              isLoading={loading}
            >
              Share
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
