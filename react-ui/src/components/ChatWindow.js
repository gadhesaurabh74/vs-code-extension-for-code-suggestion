import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy } from 'lucide-react';
const CodeBlock = ({ inline, className, children, }) => {
    const match = /language-(\w+)/.exec(className || '');
    const code = String(children).trim();
    const [copied, setCopied] = React.useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2s
        }
        catch (err) {
            alert('❌ Failed to copy');
        }
    };
    if (inline) {
        return _jsx("code", { className: "bg-gray-200 px-1 rounded", children: code });
    }
    return (_jsxs("div", { className: "relative group", children: [_jsx(SyntaxHighlighter, { language: match?.[1] || 'text', style: vscDarkPlus, PreTag: "div", customStyle: {
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    margin: 0,
                }, children: code }), _jsx("button", { onClick: handleCopy, className: "absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition", children: copied ? '✅ Copied' : (_jsxs(_Fragment, { children: [_jsx(Copy, { size: 14, className: "inline-block mr-1" }), "Copy"] })) })] }));
};
const ChatWindow = ({ messages }) => {
    return (_jsx("div", { className: "p-4 space-y-4 text-xl", children: messages.map((msg, i) => (_jsx("div", { className: `p-3 rounded-md whitespace-pre-wrap  ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'} ${msg.sender === 'user' ? 'text-right' : 'text-left'}`, children: _jsx(ReactMarkdown, { components: {
                    code: CodeBlock,
                }, children: msg.content }) }, i))) }));
};
export default ChatWindow;
