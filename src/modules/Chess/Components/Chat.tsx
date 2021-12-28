import React, { useState, useEffect, useContext } from 'react';
import { Box, Paper, PaperProps, TextField, Button } from '@mui/material';
import { SocketContext } from '@common';
import { Message } from './Message';

interface MessageType {
  role: 'White' | 'Black' | 'Spectator';
  username: string;
  message: string;
}

export const Chat = () => {
  const { socket } = useContext(SocketContext);

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [text, setText] = useState('');
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => setText(event.target.value);
  const onEnter = (event: React.KeyboardEvent) => event.key === 'Enter' && sendMessage();
  const onClick = (_event: React.MouseEvent) => sendMessage();

  const sendMessage = () => {
    setText('');

    if (!socket || !text) return;
    socket.emit('chat:message', text);
  };

  useEffect(() => {
    setMessages([]);
  }, []);

  const containerStyles: PaperProps['sx'] = {
    p: 1,
    flex: '1 1 auto',
    minHeight: '0px',
    overflowY: 'scroll',
    backgroundColor: '#333333',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  };

  const textBoxStyles: PaperProps['sx'] = {
    p: 1,
    flexShrink: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  };

  // @TODO LATER - Redesign Message Bubble
  return (
    <Box sx={{ maxHeight: '85vh', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={containerStyles}>
        {messages.map(({ username, message, role }) => (
          <Message key={role} username={username} message={message} role={role} />
        ))}
      </Paper>
      <Paper sx={textBoxStyles}>
        <TextField
          fullWidth
          value={text}
          onChange={onChange}
          onKeyDown={onEnter}
          InputProps={{
            endAdornment: (
              <Button size="large" color="secondary" sx={{ ml: 1 }} onClick={onClick}>
                Send
              </Button>
            ),
          }}
        />
      </Paper>
    </Box>
  );
};
