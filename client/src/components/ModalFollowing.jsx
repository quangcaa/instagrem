import React, { useEffect, useState } from "react";
import {
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";

function ModalFollowing({ nameOfButton }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const showToast = useShowToast();
  const { username } = useParams();
  const [following, setFollowing] = useState([]);
  const btnRef = React.useRef(null);

  useEffect(() => {
    const getFollowing = async () => {
      try {
        const res = await fetch(
          `http://localhost:1000/user/${username}/following`,
          { credentials: "include" }
        );
        const data = await res.json();
        // console.log("Fetched data:", data); // Add this line to see what data is returned
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setFollowing(data.Following); // Ensure data.Follower is not undefined
      } catch (error) {
        console.error(error); // Add this line to see fetch errors
      }
    };
    if (isOpen) {
      getFollowing();
    }
  }, [isOpen, username, showToast]);

  const handleOpen = () => {
    onOpen();
  };

  // console.log("Followers:", followers); // Add this line to see the state of followers

  return (
    <>
      <Link color={"gray.light"} ref={btnRef} onClick={handleOpen}>
        {nameOfButton}
      </Link>

      <Modal
        onClose={onClose}
        finalFocusRef={btnRef}
        isOpen={isOpen}
        scrollBehavior="inside"
        size="xs"
      >
        <ModalOverlay />
        <ModalContent bg={useColorModeValue("white", "gray.dark")}>
          <ModalHeader>
            Following
            <Divider mt={2} />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {following ? (
              following.map((followin) => (
                <Button
                  key={followin.user_id}
                  bg={useColorModeValue("white", "gray.dark")}
                  w="full"
                  onClick={() => {
                    navigate(`/${followin.username}`);
                    onClose();
                  }}
                >
                  {followin.username}
                </Button>
              ))
            ) : (
              <p>No following found.</p>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ModalFollowing;
