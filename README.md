# Mux Upload + Playback POC

## Setup

### 1. Get your Mux API keys
Go to https://dashboard.mux.com → Settings → API Access Tokens → Create new token.
You need **Mux Video** read+write permissions.

### 2. Backend

```bash
cd mux-backend
npm install
```

Create a `.env` file:
```
MUX_TOKEN_ID=your_token_id_here
MUX_TOKEN_SECRET=your_token_secret_here
```

Run it:
```bash
npm run dev
```

### 3. Frontend (Vite React app)

```bash
cd mux-frontend
npm install
```

Run it:
```bash
npm run dev
```

Open http://localhost:5173 — click the button, pick a video, watch it process and play back.

## How it works

1. Clicking the button hits your local backend (`POST /upload`) which creates a **Mux Direct Upload** URL.
2. `<MuxUploader>` streams the file directly to Mux's servers using that URL.
3. On upload success, the frontend polls `GET /upload/:id` every 3 seconds.
4. Once Mux finishes processing, the backend returns the `playbackId`.
5. `<MuxPlayer>` renders the video using that playback ID.
