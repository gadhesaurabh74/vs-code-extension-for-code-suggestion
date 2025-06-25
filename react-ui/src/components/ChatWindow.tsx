import React from 'react';
import type { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
}

const CodeBlock = ({
  inline,
  className,
  children,
}: {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}) => {
  const match = /language-(\w+)/.exec(className || '');
  const code = String(children).trim();

  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (err) {
      alert('❌ Failed to copy');
    }
  };

  if (inline) {
    return <code className="bg-gray-200 px-1 rounded">{code}</code>;
  }

  return (
    <div className="relative group">
      <SyntaxHighlighter
        language={match?.[1] || 'text'}
        style={vscDarkPlus}
        PreTag="div"
        customStyle={{
          padding: '1rem',
          borderRadius: '0.5rem',
          fontSize: '0.9rem',
          margin: 0,
        }}
      >
        {code}
      </SyntaxHighlighter>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition"
      >
        {copied ? '✅ Copied' : (
          <>
            <Copy size={14} className="inline-block mr-1" />
            Copy
          </>
        )}
      </button>
    </div>
  );
};

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <div className="p-4 space-y-4 text-xl">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`p-3 rounded-md whitespace-pre-wrap  ${
            msg.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'
            
          } ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
        >
          <ReactMarkdown
            components={{
              code: CodeBlock,
            }}
          >
            {msg.content}
          </ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
