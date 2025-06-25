import React from 'react';
import type { Message } from '../types';
interface ChatWindowProps {
    messages: Message[];
}
declare const ChatWindow: React.FC<ChatWindowProps>;
export default ChatWindow;
