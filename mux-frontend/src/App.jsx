import { useRef, useState } from "react";
// import MuxUploader from "@mux/mux-uploader-react";
import MuxPlayer from "@mux/mux-player-react";

// const BACKEND_URL = "http://localhost:3001";

// Attach Playback ID here.
// const FETCH_ID = ""

export default function App() {
  // Upload state (disabled for now)
  // const [uploadUrl, setUploadUrl] = useState(null);
  // const [uploadId, setUploadId] = useState(null);

  const [playbackId] = useState(FETCH_ID);
  const [status] = useState("ready"); // idle | uploading | processing | ready
  const pollRef = useRef(null);

  // async function handleStart() {
  //   setPlaybackId(null);
  //   setUploadId(null);
  //   setUploadUrl(null);
  //   setStatus("uploading");
  //
  //   const res = await fetch(`${BACKEND_URL}/upload`, { method: "POST" });
  //   if (!res.ok) {
  //     setStatus("idle");
  //     throw new Error(`Failed to create upload: ${res.status}`);
  //   }
  //
  //   const { uploadId: nextUploadId, uploadUrl: nextUploadUrl } = await res.json();
  //   setUploadId(nextUploadId);
  //   setUploadUrl(nextUploadUrl);
  // }
  //
  // function handleUploadSuccess() {
  //   setStatus("processing");
  //   pollRef.current = setInterval(async () => {
  //     const res = await fetch(`${BACKEND_URL}/upload/${uploadId}`);
  //     const data = await res.json();
  //
  //     if (data.status === "ready" && data.playbackId) {
  //       clearInterval(pollRef.current);
  //       pollRef.current = null;
  //       setPlaybackId(data.playbackId);
  //       setStatus("ready");
  //     }
  //   }, 3000);
  // }

  return (
    <div style={pageStyle}>
      <h1 style={{ marginTop: 0 }}>Mux Upload + Playback POC</h1>

      {/* {status === "idle" && (
        <button onClick={handleStart} style={btnStyle}>
          Select & Upload Video
        </button>
      )} */}

      {/* {uploadUrl && status === "uploading" && (
        <MuxUploader endpoint={uploadUrl} onSuccess={handleUploadSuccess} />
      )} */}

      {/* {status === "processing" && <p>Video uploaded! Processing…</p>} */}

      {status === "ready" && playbackId && (
        <div style={{ marginTop: 12 }}>
          <MuxPlayer
            playbackId={playbackId}
            style={{
              width: "100%",
              "--seek-backward-button": "none",
              "--seek-forward-button": "none",
              "--mute-button": "none",
              "--captions-button": "none",
              "--airplay-button": "none",
              "--pip-button": "none",
              "--cast-button": "none",
              "--playback-rate-button": "none",
              "--time-range": "none",
              "--time-display": "none",
              "--duration-display": "none",
              "--title-display": "none",
            }}
          />
        </div>
      )}
    </div>
  );
}

const pageStyle = {
  maxWidth: 800,
  margin: "56px auto",
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  padding: "0 20px",
};

const btnStyle = {
  padding: "12px 18px",
  fontSize: 16,
  cursor: "pointer",
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: 8,
};

