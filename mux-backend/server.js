// server.js
import express from "express";
import cors from "cors";
import Mux from "@mux/mux-node";

const app = express();
app.use(cors());
app.use(express.json());

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

function assertEnv(res) {
  if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
    res.status(500).json({
      error:
        "Missing MUX_TOKEN_ID or MUX_TOKEN_SECRET. Create mux-backend/.env (or use .env.example).",
    });
    return false;
  }
  return true;
}

// Creates a direct upload URL and returns it + the asset ID
app.post("/upload", async (req, res) => {
  if (!assertEnv(res)) return;
  try {
    const upload = await mux.video.uploads.create({
      cors_origin: "http://localhost:5173", // Vite default port
      new_asset_settings: { playback_policy: ["public"] },
    });
    res.json({ uploadId: upload.id, uploadUrl: upload.url });
  } catch (err) {
    res.status(500).json({ error: err?.message ?? "Failed to create upload" });
  }
});

// Poll this to check if the asset is ready and get the playback ID
app.get("/upload/:uploadId", async (req, res) => {
  if (!assertEnv(res)) return;
  try {
    const upload = await mux.video.uploads.retrieve(req.params.uploadId);
    if (!upload.asset_id) return res.json({ status: "waiting" });

    const asset = await mux.video.assets.retrieve(upload.asset_id);
    const playbackId = asset.playback_ids?.[0]?.id;
    res.json({ status: asset.status, playbackId });
  } catch (err) {
    res.status(500).json({ error: err?.message ?? "Failed to check upload" });
  }
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
