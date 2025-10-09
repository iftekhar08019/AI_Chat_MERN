# AI Chat (MERN + Vite + TypeScript)

An AI chat application with a modern, responsive UI, assistant typing animation, local history persistence, and a Node/Express backend API powered by **Groq**.

- Live Demo: [https://aichat08019.netlify.app/](https://aichat08019.netlify.app/)
- Frontend: React 19, TypeScript, Vite
- Backend: Node.js, Express with Groq API (deployed on Vercel in the default setup)
- AI Provider: [Groq](https://console.groq.com/) - Ultra-fast LLM inference

## Features

- ⚡ **Ultra-fast responses** powered by Groq's LPU inference engine
- 🎨 Typing animation for assistant replies (shows only the final answer, hides reasoning)
- 📝 Rich rendering for assistant messages: headings (###), bold (**text**), ordered/unordered lists
- 📏 Fixed-height, scrollable chat area (prevents layout jump on long answers)
- 💾 LocalStorage persistence of chat history; loads on refresh
- 🗑️ Clear Chat button (clears UI and localStorage)
- 📱 Responsive layout (wider on desktop, fluid on mobile)

### Why Groq?

Groq provides lightning-fast LLM inference with their custom Language Processing Units (LPUs):
- **10x faster** than traditional cloud GPU inference
- Low latency responses (often < 1 second)
- Cost-effective API pricing
- Support for popular open-source models (Llama, Mixtral, Gemma)

## Architecture

- Frontend lives in `frontend/` (Vite + React + TS)
- Backend lives in `backend/` (Express). The frontend calls a single endpoint: `POST /api/chat` with `{ message: string }`
- By default, the frontend calls the deployed backend at `https://aichatbackend.vercel.app/api/chat`

### Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite for build tooling
- Axios for HTTP requests
- CSS-in-JS (inline styles)

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- CORS & Body Parser middleware
- dotenv for environment variables

**AI API:**
- **Groq** (`groq-sdk`) - Ultra-fast LLM inference engine
  - Model: `llama-3.3-70b-versatile` (default)
  - Custom LPU (Language Processing Unit) architecture
  - 10x faster than traditional GPU inference
  - Sub-second response times

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### 1) Frontend (Vite + React + TS)

```bash
cd frontend
npm install
npm run dev
```

This starts the app at `http://localhost:5173` by default.

### 2) Backend (Express + Groq)

If you want to run the backend locally instead of the hosted Vercel endpoint:

```bash
cd backend
npm install
npm run start
```

Create a `.env` file in `backend/` with your Groq API key:

```bash
GROQ_API_KEY=your_groq_api_key_here
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

**Get your Groq API key:**
1. Visit [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign up or log in
3. Create a new API key
4. Copy it to your `.env` file

Then update the frontend API URL in `frontend/src/components/chat.tsx` if needed (the code is currently set to the deployed backend):

```ts
await axios.post('https://aichatbackend.vercel.app/api/chat', { message: userText });
// Change to local if desired:
// await axios.post('http://localhost:3000/api/chat', { message: userText });
```

## Project Scripts

### Frontend

- `npm run dev` – Start Vite dev server
- `npm run build` – Type-check and build production bundle
- `npm run preview` – Preview the production build
- `npm run lint` – Lint the codebase

### Backend

- `npm start` or `npm run start` – Start the Express server

## UI/UX Highlights

- Desktop-optimized width (980px), fluid down to small screens
- Conversation panel uses `max-height: 60vh` with `overflow: auto`
- Polished chat bubbles, gradient accents, subtle shadows
- Send disabled while assistant is typing

## Deployment

### Frontend (Netlify, Vercel, etc.)

- Build command: `npm run build`
- Publish directory: `frontend/dist`

If deploying with Netlify, point the site to the `frontend/` directory and set the above build/publish settings.

### Backend (Vercel)

- Deploy the `backend/` as a Serverless function or Node app
- **Important:** Add environment variables in Vercel project settings:
  - `GROQ_API_KEY` - Your Groq API key from [console.groq.com/keys](https://console.groq.com/keys)
  - `MONGO_URI` - Your MongoDB connection string
- Update the frontend `axios.post` URL to your deployed backend URL if it differs
- The backend includes a `vercel.json` configuration for serverless deployment

## Configuration

### API Endpoint
- Default API endpoint: `https://aichatbackend.vercel.app/api/chat`
- To change it, edit `frontend/src/components/chat.tsx` accordingly

### Groq Models

The backend uses Groq for ultra-fast LLM inference. You can change the model in `backend/routes/chat.js`:

**Available Models:**
- `llama-3.3-70b-versatile` ⚡ (default) - Fast & powerful, great for most use cases
- `llama-3.1-8b-instant` 🚀 - Ultra-fast responses, lightweight
- `mixtral-8x7b-32768` 📚 - Best for longer contexts (32K tokens)
- `gemma2-9b-it` ⚖️ - Balanced performance and speed

To change the model, edit line 15 in `backend/routes/chat.js`:

```js
model: 'llama-3.3-70b-versatile', // Change to your preferred model
```

**Model Parameters:**
- `temperature`: 0.7 (controls randomness, 0-2)
- `max_tokens`: 1024 (maximum response length)

Adjust these in `backend/routes/chat.js` to customize behavior.

## Folder Structure

```
AI_Chat_MERN/
  backend/
    routes/
    models/
    server.js
    package.json
  frontend/
    src/
      components/
        chat.tsx
      App.tsx
      main.tsx
    vite.config.ts
    package.json
```

## Troubleshooting

### Common Issues

- **500 Server Error**: Check if `GROQ_API_KEY` is set correctly in `.env` file
- **CORS errors**: Ensure your backend enables CORS for your frontend domain
- **404/Network errors**: Verify the API base URL matches your deployed backend
- **Empty responses**: Check Groq API key validity and backend logs
- **Typing animation overlaps**: The Send button is disabled while typing to avoid concurrent requests
- **"API key not found"**: Make sure your `.env` file is in the `backend/` directory and the server has been restarted

### Testing Groq Connection

To verify your Groq API key is working:

```bash
cd backend
node -e "require('dotenv').config(); console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Found ✓' : 'Missing ✗')"
```

### Backend Logs

Check backend console for detailed error messages when requests fail.

## Links

### Demo & API
- Live site: [https://aichat08019.netlify.app/](https://aichat08019.netlify.app/)
- Backend API base: `https://aichatbackend.vercel.app/api/chat`

### Groq Resources
- Groq Console: [https://console.groq.com/](https://console.groq.com/)
- Get API Keys: [https://console.groq.com/keys](https://console.groq.com/keys)
- Groq Documentation: [https://console.groq.com/docs](https://console.groq.com/docs)
- Available Models: [https://console.groq.com/docs/models](https://console.groq.com/docs/models)

## Attribution

- Live demo link referenced: [https://aichat08019.netlify.app/](https://aichat08019.netlify.app/)

## License

MIT © 2025
