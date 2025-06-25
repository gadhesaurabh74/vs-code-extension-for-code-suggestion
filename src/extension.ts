import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) {
  console.warn('⚠️ GEMINI_API_KEY not set. Make sure your .env file is correct.');
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('vscode-chat-ai.openChat', () => {
    const panel = vscode.window.createWebviewPanel(
      'chatAssistant',
      'Chat Assistant',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')],
      }
    );

    panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);

    panel.webview.onDidReceiveMessage(async (message) => {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        panel.webview.postMessage({ type: 'botReply', text: '❌ No folder is open in VS Code.' });
        return;
      }

      if (message.command === 'requestFileList') {
        const files = await vscode.workspace.findFiles('**/*.{js,ts,tsx,jsx,py,java,txt,md}', '**/node_modules/**');
        const fileNames = files.map(uri => vscode.workspace.asRelativePath(uri));
        panel.webview.postMessage({ type: 'fileList', files: fileNames });
        return;
      }

      if (message.command === 'getFileContent' && message.filename) {
        const fullPath = path.join(workspaceFolder.uri.fsPath, message.filename);
        try {
          const contentBytes = await vscode.workspace.fs.readFile(vscode.Uri.file(fullPath));
          const content = Buffer.from(contentBytes).toString('utf8');
          panel.webview.postMessage({ type: 'fileContent', filename: message.filename, content });
        } catch (e) {
          panel.webview.postMessage({ type: 'fileContent', filename: message.filename, content: '❌ Error reading file.' });
        }
        return;
      }

      if (message.command === 'sendPrompt') {
        let userInput = message.text;

        // Match all "@filename" mentions (supporting symbols like #, -, /, \)
        const fileMentionRegex = /@([^\s]+)/g;
        const matches = [...userInput.matchAll(fileMentionRegex)];

        for (const match of matches) {
          const fullMatch = match[0]; // @#project_02.py
          const rawFileName = match[1]; // #project_02.py
          const cleanedFileName = rawFileName.replace(/^#/, ''); // remove # if present
          const filePath = path.join(workspaceFolder.uri.fsPath, cleanedFileName);

          try {
            const contentBytes = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
            let fileContent = Buffer.from(contentBytes).toString('utf8');

            if (fileContent.length > 4000) {
              fileContent = fileContent.slice(0, 4000) + '\n// ... (truncated)';
            }

            const codeBlock = `\n\n📄 Content of "${cleanedFileName}":\n\`\`\`\n${fileContent}\n\`\`\``;
            userInput = userInput.replace(fullMatch, codeBlock);

          } catch (e) {
            userInput = userInput.replace(fullMatch, `⚠️ Could not read file: ${cleanedFileName}`);
          }
        }

        const promptText = `You are a helpful coding assistant. Use any inline file content to help answer the question:\n\n${userInput}`;
        console.log('📤 Final prompt to Gemini:\n', promptText.slice(0, 1000));

        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }],
              }),
            }
          );

          const data = await response.json() as any;
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '⚠️ No reply from Gemini.';
          panel.webview.postMessage({ type: 'botReply', text: reply });

        } catch (err: any) {
          console.error('❌ Gemini API Error:', err);
          panel.webview.postMessage({
            type: 'botReply',
            text: '❌ Error talking to Gemini: ' + err.message,
          });
        }
      }
    });
  });

  context.subscriptions.push(disposable);
}

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const mediaPath = vscode.Uri.joinPath(extensionUri, 'media');
  const indexPath = vscode.Uri.joinPath(mediaPath, 'index.html');
  let html = fs.readFileSync(indexPath.fsPath, 'utf8');

  html = html.replace(/"\/assets\/(.*?)"/g, (_, asset) => {
    const assetUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaPath, 'assets', asset));
    return `"${assetUri}"`;
  });

  return html;
}
