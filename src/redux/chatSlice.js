import { createSlice } from '@reduxjs/toolkit';

let nextId = 1;

const initialState = {
  messages: [],
  isTyping: false,
  activeChat: null, // bookingId
};

const DRIVER_REPLIES = [
  'I\'m on my way! 🚗',
  'Will be there in 5 minutes',
  'Got it, thank you!',
  'No problem at all 👍',
  'I\'m at the pickup point now',
  'Traffic is clear, arriving soon',
  'Please share exact location pin',
  'Sure, I\'ll wait for you',
];

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    startChat(state, action) {
      state.activeChat = action.payload;
      state.messages = [];
      state.messages.push({
        id: nextId++,
        text: 'Namaste! I\'m your driver. I\'ll be picking you up shortly. 🙏',
        sender: 'driver',
        timestamp: new Date().toISOString(),
      });
    },
    sendMessage(state, action) {
      state.messages.push({
        id: nextId++,
        text: action.payload,
        sender: 'user',
        timestamp: new Date().toISOString(),
      });
      state.isTyping = true;
    },
    receiveDriverReply(state) {
      const reply = DRIVER_REPLIES[Math.floor(Math.random() * DRIVER_REPLIES.length)];
      state.messages.push({
        id: nextId++,
        text: reply,
        sender: 'driver',
        timestamp: new Date().toISOString(),
      });
      state.isTyping = false;
    },
    setTyping(state, action) {
      state.isTyping = action.payload;
    },
    clearChat(state) {
      state.messages = [];
      state.activeChat = null;
      state.isTyping = false;
    },
  },
});

export const { startChat, sendMessage, receiveDriverReply, setTyping, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
