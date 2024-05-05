import React, { useState } from 'react';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { IoSendSharp } from 'react-icons/io5';
import useShowToast from '../hooks/useShowToast';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom';

const token = localStorage.getItem('token');

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState('');
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom)

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!messageText) return

    try {
      const res = await fetch(`http://localhost:1000/direct/u/${selectedConversation.user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ text: messageText }),
      });

      const data = await res.json();

      if (data.error) {
        showToast('Error', data.error, 'error');
        return;
      }

      console.log(data)

      setMessages((messages) => [...messages, data.message]);

      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                createdAt: data.createdAt,
                sender_id: data.sender_id
              }
            }
          }
          return conversation
        })
        return updatedConversations
      })

      setMessageText('');
    } catch (error) {
      showToast('Error', error.message, 'error');
    }

  };

  return (
    <form onSubmit={handleSendMessage}>
      <InputGroup>
        <Input
          type="text"
          onChange={(event) => setMessageText(event.target.value)}
          value={messageText}
          placeholder="Type a message"
        />
        <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
          <IoSendSharp color="green.500" />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;