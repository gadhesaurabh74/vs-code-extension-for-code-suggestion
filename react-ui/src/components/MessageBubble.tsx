interface Props {
  sender: 'user' | 'ai';
  content: string;
}

export default function MessageBubble({ sender, content }: Props) {
  const isUser = sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`rounded-xl px-4 py-2 max-w-[70%] text-sm shadow ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-900 rounded-bl-none'
        }`}
      >
        {content}
      </div>
    </div>
  );
}
