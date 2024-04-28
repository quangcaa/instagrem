import { AddIcon } from "@chakra-ui/icons";
import {
    Button,
    CloseButton,
    Flex,
    FormControl,
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
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

const MAX_CHAR = 500;
const MAX_IMAGES = 5;

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText, setPostText] = useState('');
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const imageRef = useRef(null);
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const user = useRecoilValue(userAtom);
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

        if (!selectedFiles.length) {
            showToast("Error", "Please select image(s) to upload", "error");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('caption', postText);

        for (let i = 0; i < selectedFiles.length && i < MAX_IMAGES; i++) {
            const file = selectedFiles[i];
            if (file && file.type.startsWith("image/")) {
                formData.append(`image`, file); // Assuming backend can handle multiple images
            }
        }

        // formData.append('image', selectedFiles);

        try {
            const res = await fetch(`http://localhost:1000/post/create`, {
                method: "POST",
                credentials: "include",
                body: formData
            })

            const data = await res.json();

            if (data.success) {
                // const newPost = data.post;
                // console.log(newPost);
                showToast("Success", "Post created successfully", "success");

            } else {
                showToast("Error", data.error, "error");
                return;
            }

            onClose();
            setPostText("");
            setImgUrl([]);
            setRemainingChar(MAX_CHAR);
        } catch (error) {
            console.error("Error creating post:", error);
            showToast("Error", error, "error");
        }
    };

    return (
        <>
            <Button
                position={"fixed"}
                bottom={10}
                right={5}
                bg={useColorModeValue("gray.300", "gray.dark")}
                onClick={onOpen}
                size={{ base: "sm", sm: "md" }}
            >

                <AddIcon />
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Textarea
                                placeholder='Post content goes here...'
                                onChange={handleTextChange}
                                value={postText}
                            />
                            <Text fontSize='xs' fontWeight='bold' textAlign={"right"} m={"1"} color={"gray.800"}>
                                {remainingChar}/{MAX_CHAR}
                            </Text>

                            <Input
                                type="file"
                                multiple
                                hidden
                                ref={imageRef}
                                onChange={handleImageChange}
                            />

                            <BsFillImageFill
                                style={{ marginLeft: "5px", cursor: "pointer" }}
                                size={16}
                                onClick={() => imageRef.current.click()}
                            />
                        </FormControl>

                        {imgUrl.length > 0 && ( // Display previews only if images are selected
                            <Flex mt={5} w={"full"} position={"relative"} flexWrap={"wrap"}>
                                {imgUrl.map((imageUrl, index) => ( // Loop through each image URL
                                    <Image
                                        key={index}
                                        src={imageUrl}
                                        alt={`Selected Image ${index + 1}`}
                                        mr={2}
                                        maxWidth="100%" // Ensure images don't overflow the modal width
                                        maxHeight="200px" // Set a maximum height for previews (adjust as needed)
                                        objectFit="cover" // Crop images to fit within the container
                                    /> // Add unique keys and spacing
                                ))}
                                <CloseButton
                                    onClick={() => {
                                        setImgUrl([])
                                    }}
                                    position={"absolute"}
                                    top={2}
                                    right={2}
                                    size="md"
                                />
                            </Flex>
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreatePost;