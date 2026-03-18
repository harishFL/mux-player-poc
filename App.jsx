// src/App.jsx
import { useState, useRef } from "react";
import MuxUploader from "@mux/mux-uploader-react";
import MuxPlayer from "@mux/mux-player-react";

export default function App() {
  const [uploadUrl, setUploadUrl] = useState(null);
  const [uploadId, setUploadId] = useState(null);
  const [playbackId, setPlaybackId] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | processing | ready
  const pollRef = useRef(null);

  async function handleStart() {
    setStatus("uploading");
    const res = await fetch("http://localhost:3001/upload", { method: "POST" });
    const { uploadId, uploadUrl } = await res.json();
    setUploadId(uploadId);
    setUploadUrl(uploadUrl);
  }

  function handleUploadSuccess() {
    setStatus("processing");
    // Poll every 3s until the asset is ready
    pollRef.current = setInterval(async () => {
      const res = await fetch(`http://localhost:3001/upload/${uploadId}`);
      const data = await res.json();
      if (data.status === "ready" && data.playbackId) {
        clearInterval(pollRef.current);
        setPlaybackId(data.playbackId);
        setStatus("ready");
      }
    }, 3000);
  }

  return (
    <div style={{ maxWidth: 700, margin: "60px auto", fontFamily: "sans-serif", padding: "0 20px" }}>
      <h1>Mux Upload + Playback POC</h1>

      {status === "idle" && (
        <button onClick={handleStart} style={btnStyle}>
          Select & Upload Video
        </button>
      )}

      {uploadUrl && status === "uploading" && (
        <MuxUploader
          endpoint={uploadUrl}
          onSuccess={handleUploadSuccess}
        />
      )}

      {status === "processing" && (
        <p>⏳ Video uploaded! Processing… this usually takes under a minute.</p>
      )}

      {status === "ready" && playbackId && (
        <>
          <p>✅ Ready to play!</p>
          <MuxPlayer
            playbackId={playbackId}
            metadata={{ video_title: "My Uploaded Video" }}
            style={{ width: "100%" }}
          />
        </>
      )}
    </div>
  );
}

const btnStyle = {
  padding: "12px 24px",
  fontSize: 16,
  cursor: "pointer",
  background: "#000",
  color: "#fff",
  border: "none",
  borderRadius: 6,
};
