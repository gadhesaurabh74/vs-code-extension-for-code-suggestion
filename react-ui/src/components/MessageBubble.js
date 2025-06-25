import { jsx as _jsx } from "react/jsx-runtime";
export default function MessageBubble({ sender, content }) {
    const isUser = sender === 'user';
    return (_jsx("div", { className: `flex ${isUser ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `rounded-xl px-4 py-2 max-w-[70%] text-sm shadow ${isUser
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-900 rounded-bl-none'}`, children: content }) }));
}
