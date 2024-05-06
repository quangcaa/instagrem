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

function ModalFollowers({ nameOfButton }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { username } = useParams();
  const showToast = useShowToast();
  const [followers, setFollowers] = useState([]);
  const btnRef = React.useRef(null);

  useEffect(() => {
    const getFollowers = async () => {
      try {
        const res = await fetch(
          `http://localhost:1000/user/${username}/followers`,
          { credentials: "include" }
        );
        const data = await res.json();
        console.log("Fetched data:", data); // Add this line to see what data is returned
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setFollowers(data.Follower || data.user); // Ensure data.Follower is not undefined
      } catch (error) {
        console.error(error); // Add this line to see fetch errors
      }
    };

    if (isOpen) {
      getFollowers();
    }
  }, [isOpen, username, showToast]);

  const handleOpen = () => {
    onOpen();
  };

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
            Followers
            <Divider mt={2} />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {followers ? (
              followers.map((follower) => (
                <Button
                  key={follower.user_id}
                  // bg={useColorModeValue("white", "gray.dark")}
                  w="full"
                  onClick={() => {
                    navigate(`/${follower.username}`);
                    onClose();
                  }}
                >
                  {follower.username}
                </Button>
              ))
            ) : (
              <p>No followers found.</p>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ModalFollowers;
