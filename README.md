# AI Chat (MERN + Vite + TypeScript)

An AI chat application with a modern, responsive UI, assistant typing animation, local history persistence, and a Node/Express backend API.

- Live Demo: [https://aichat08019.netlify.app/](https://aichat08019.netlify.app/)
- Frontend: React 19, TypeScript, Vite
- Backend: Node.js, Express (deployed on Vercel in the default setup)

## Features

- Typing animation for assistant replies (shows only the final answer, hides reasoning)
- Rich rendering for assistant messages: headings (###), bold (**text**), ordered/unordered lists
- Fixed-height, scrollable chat area (prevents layout jump on long answers)
- LocalStorage persistence of chat history; loads on refresh
- Clear Chat button (clears UI and localStorage)
- Responsive layout (wider on desktop, fluid on mobile)

## Architecture

- Frontend lives in `frontend/` (Vite + React + TS)
- Backend lives in `backend/` (Express). The frontend calls a single endpoint: `POST /api/chat` with `{ message: string }`
- By default, the frontend calls the deployed backend at `https://aichatbackend.vercel.app/api/chat`

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

### 2) Backend (Express)

If you want to run the backend locally instead of the hosted Vercel endpoint:

```bash
cd backend
npm install
npm run start
```

Create a `.env` file in `backend/` with your provider API keys as required by your implementation (for example):

```bash
OPENAI_API_KEY=your_key_here
PORT=3000
```

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
- Ensure environment variables (e.g., provider keys) are set in the Vercel project settings
- Update the frontend `axios.post` URL to your deployed backend URL if it differs

## Configuration

- Default API endpoint: `https://aichatbackend.vercel.app/api/chat`
- To change it, edit `frontend/src/components/chat.tsx` accordingly

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

- CORS errors: Ensure your backend enables CORS for your frontend domain
- 404/Network errors: Verify the API base URL matches your deployed backend
- Empty responses: Check provider keys and backend logs
- Typing animation overlaps: The Send button is disabled while typing to avoid concurrent requests

## Links

- Live site: [https://aichat08019.netlify.app/](https://aichat08019.netlify.app/)
- Backend API base: `https://aichatbackend.vercel.app/api/chat`

## Attribution

- Live demo link referenced: [https://aichat08019.netlify.app/](https://aichat08019.netlify.app/)

## License

MIT © 2025
