import React from 'react';
interface Props {
    onSend: (input: string) => void;
    fileSuggestions: string[];
}
declare const InputBar: React.FC<Props>;
export default InputBar;
