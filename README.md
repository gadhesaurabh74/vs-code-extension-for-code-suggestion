# 💬 VS Code Gemini Chat Assistant

A Visual Studio Code extension that integrates Google's **Gemini 2.0 Flash API** to provide an AI-powered assistant inside your editor. This extension allows you to have natural language conversations, ask coding questions, and even **reference files from your current workspace using `@filename` syntax**.

---

## ✨ Key Features

- 🤖 Conversational AI inside VS Code powered by Gemini.
- 📂 Reference files like `@utils.js`, and their content will be fetched and sent to the AI.
- 🔍 Automatically loads the current workspace and available file suggestions.
- 💬 Chat interface with:
  - Smooth scrolling
  - Message alignment
  - Copy-to-clipboard support
- ⚛️ Clean UI using **React + Tailwind CSS** inside a WebView panel.
- 🔐 `.env` based Gemini API key configuration.

---

## 🧠 How It Works

When you type a question like:

```txt
What does @src/utils/helpers.ts do?
```

The extension:

1. Recognizes `@filename` using regex.
2. Searches for the file in the current workspace.
3. Reads its content (up to 4000 characters max).
4. Replaces the `@filename` in your input with the file content.
5. Sends the modified prompt to Gemini API.
6. Displays the response in the chat window.

---

## 📦 Installation Guide

### Step 1: Clone the repository

```bash
git clone https://github.com/your-username/vscode-gemini-chat.git
cd vscode-gemini-chat
```

### Step 2: Build the React frontend

```bash
cd react-ui
npm install
npm run build
cd ..
```

Make sure the compiled files from `react-ui` are copied into the `media/` directory.

### Step 3: Package and install the extension

```bash
npm install -g @vscode/vsce
vsce package
code --install-extension vscode-gemini-chat-*.vsix
```

---

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> 🔑 You can obtain the Gemini API key from: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

---

## 🧪 Usage

1. Open a project folder in VS Code.
2. Press `Ctrl+Shift+P` and run: **Chat Assistant: Open Chat**
3. Type your question or code query.
4. Use `@filename` to include file context.

### Examples:

- Explain how `@src/index.ts` works.
- Refactor `@components/Button.tsx` to a reusable component.

---

## 📁 Supported File Types

The extension currently supports referencing files with the following extensions:

```
.js, .ts, .tsx, .jsx
.py, .java, .txt, .md
```

> 📌 Other files are ignored during file suggestion and prompt building.

---

## 🛠 Project Structure

```bash
vscode-gemini-chat/
├── src/                      # Main extension code
├── media/                    # WebView UI (built from react-ui)
├── react-ui/                 # React source code for UI
├── .env                      # Your Gemini API key
├── package.json              # Extension manifest
└── README.md
```

---

## 🧩 Extension Capabilities

| Feature                        | Status       |
|-------------------------------|--------------|
| VS Code WebView Panel         | ✅ Completed  |
| Gemini 2.0 Flash integration  | ✅ Completed  |
| File content embedding        | ✅ Completed  |
| File suggestion dropdown      | ✅ Completed  |
| Copy-to-clipboard in chat     | ✅ Completed  |
| Message alignment & styling   | ✅ Completed  |


---

## 🚧 Limitations

- Gemini API usage may be limited based on your quota.
- File content is truncated at 4000 characters to prevent overload.
- Only works inside a VS Code workspace (a folder must be open).

---

## 🔒 Security

- Your API key is stored in a local `.env` file.
- No data is stored or logged outside your local environment.

---

## 🧑‍💻 Author

Made with ❤️ by **Saurabh Gadhe**

- GitHub: [github.com/gadhesaurabh74]((https://github.com/gadhesaurabh74))
- LinkedIn: [@Saurabh Gadhe]((https://www.linkedin.com/in/saurabh-gadhe-58632525b/))

---


---

## 🙌 Contributions

Pull requests, issues, and suggestions are welcome!  
If you’d like to contribute or report a bug, please open an issue or submit a PR.
