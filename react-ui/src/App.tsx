// src/App.tsx
import { useEffect, useState } from 'react';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';

interface Message {
  sender: 'user' | 'ai';
  content: string;
}

declare const acquireVsCodeApi: any;
const vscode = acquireVsCodeApi();

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', content: '👋 Hi! How can I assist you today?' },
  ]);
  const [fileSuggestions, setFileSuggestions] = useState<string[]>([]);

  const handleSend = (userInput: string) => {
    const newMessages: Message[] = [
      ...messages,
      { sender: 'user', content: userInput },
      { sender: 'ai', content: '⏳ Thinking...' },
    ];
    setMessages(newMessages);
    vscode.postMessage({ command: 'sendPrompt', text: userInput });
  };

  useEffect(() => {
    window.addEventListener('message', (event) => {
      const msg = event.data;
      if (msg.type === 'botReply') {
        setMessages((prev) => {
          const updated = [...prev];
          const idx = updated.findLastIndex((m) => m.sender === 'ai');
          if (idx !== -1) updated[idx].content = msg.text;
          return [...updated];
        });
      } else if (msg.type === 'fileList') {
        setFileSuggestions(msg.files || []);
      }
    });

    // Request file list on mount
    vscode.postMessage({ command: 'requestFileList' });
  }, []);

  return (
    <div className="flex flex-col h-[95vh] text-black">
      <div className="flex-1 overflow-auto">
        <ChatWindow messages={messages} />
      </div>
      <InputBar onSend={handleSend} fileSuggestions={fileSuggestions} />
    </div>
  );
}
