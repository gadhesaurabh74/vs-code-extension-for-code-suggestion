

import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App';
 // ✅ Import your real App component

// Optional: Still expose vscode API globally if needed
//const vscode = acquireVsCodeApi();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
);
