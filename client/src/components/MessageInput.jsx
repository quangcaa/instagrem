import React from 'react';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { IoSendSharp } from 'react-icons/io5';

const MessageInput = () => {
  const [message, setMessage] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message) {
      // Gửi tin nhắn
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup>
        <Input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Nhập tin nhắn"
        />
        <InputRightElement>
          <IoSendSharp color="green.500" />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;