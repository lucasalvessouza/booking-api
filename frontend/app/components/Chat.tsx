import { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import AssistantIcon from '@mui/icons-material/Assistant';
import CloseIcon from '@mui/icons-material/Close';
import { prompt } from '@/lib/api'

type Message = {
  text: string;
  sender: 'user' | 'bot';
}

interface ChatDialogProps {
  readonly onUpdate: () => void;
}

export default function ChatDialog({ onUpdate }: ChatDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLUListElement>(null);
  const defaultText = `
   <span style='font-weight: bold'> Welcome! 🌱 How can I assist you today? </span>
   <br>You can try these commands:
   <br>👉 "I want to book a gardener for tomorrow"
   <br>👉 "What is my booking ID?"
   <br>👉 "What is my next booking?"
   <br>👉 "What is the details of booking 123?"
   <br>👉 "Cancel booking 123"
   Feel free to type your request!
  `
  const defaultMessage: Message = {
    text: defaultText,
    sender: 'bot'
  }
  const [messages, setMessages] = useState<Message[]>([defaultMessage]);

  useEffect(() => {
   if (listRef.current) {
     listRef.current.scrollTop = listRef.current.scrollHeight;
   }
 }, [messages]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSend = async () => {
    if (input.trim()) {
      setMessages(previous => [...previous, { text: input, sender: 'user' }]);
      setInput('');
      if (input.toLowerCase().includes('thanks') || input.toLowerCase().includes('bye')) {
        setMessages(previous => [...previous, { text: 'You are welcome! 🌱', sender: 'bot' }]);
        return;
      }
      try {
        const response = await prompt(input);
        if (!response.message) {
         setMessages(previous => [...previous, { text: defaultText, sender: 'bot' }]);
        }
        setMessages(previous => [...previous, { text: response.message, sender: 'bot' }]);
        onUpdate();
      } catch {
        setMessages(previous => [...previous, { text: defaultText, sender: 'bot' }]);
      }
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        color="primary"
        variant="outlined"
        aria-label="open chat"
        startIcon={<AssistantIcon />} sx={{ width: { xs: '100%', md: 'auto' } }}
      >
        Ask the Assistant
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" fullScreen={isMobile}>
        <Box display="flex" justifyContent="space-between" flexDirection='row'>
         <DialogTitle>Chat</DialogTitle>
         <IconButton sx={{ mr: 2 }} onClick={handleClose}>
           <CloseIcon />
         </IconButton>
        </Box>
        <DialogContent dividers>
          <List ref={listRef} sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <ListItem key={index} alignItems="flex-start">
                <ListItemText
                  // primary={msg.text}
                  primary={
                   <Typography
                     component="span"
                     dangerouslySetInnerHTML={{ __html: msg.text }}
                   />
                  }
                  secondary={msg.sender === 'user' ? 'You' : 'Bot'}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} variant="contained">Send</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
