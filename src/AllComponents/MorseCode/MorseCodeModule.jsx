import React, { useEffect, useMemo, useRef, useState } from "react";
import { decodeMorse, encodeMorse } from "./morseUtils";
import "./MorseCodeModule.css";

const SOS = "... --- ...";

export default function MorseCodeModule() {
  const [textInput, setTextInput] = useState("HEY ROGER I HAVE A MESSAGE FOR YOU");
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [morseOutput, setMorseOutput] = useState(encodeMorse("I THINK THERE IS A PROBLEM WITH THE ENGINE"));
  const [speed, setSpeed] = useState(15);
  const [mode, setMode] = useState("Normal");
  const [channel, setChannel] = useState("Crew Channel");
  const [decodedText, setDecodedText] = useState("");
  const [aiAssist, setAiAssist] = useState(true);
  const [quality, setQuality] = useState(98);
  const [noise, setNoise] = useState("Low");
  const [confidence, setConfidence] = useState(98);
  const [analysisSource, setAnalysisSource] = useState("Pending");
  const [isCv2Processing, setIsCv2Processing] = useState(false);
  const [gestureSource, setGestureSource] = useState("Idle");
  const [gestureConfidence, setGestureConfidence] = useState(0);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isDetectingGesture, setIsDetectingGesture] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [autoRepeat, setAutoRepeat] = useState(true);
  const [intervalSec, setIntervalSec] = useState(10);
  const [logs, setLogs] = useState([]);
  const waveRef = useRef(null);
  const videoRef = useRef(null);

  const signalTokens = useMemo(
    () => morseOutput.split(" ").filter(Boolean).slice(0, 22),
    [morseOutput]
  );

  useEffect(() => {
    if (!autoTranslate) return;
    setMorseOutput(encodeMorse(textInput));
  }, [textInput, autoTranslate]);

  useEffect(() => {
    const canvas = waveRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const timer = setInterval(() => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(5,18,38,0.95)";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let i = 0; i < w; i++) {
        const y = h / 2 + Math.sin(i * 0.055 + Date.now() * 0.008) * 13 + (Math.random() - 0.5) * 4;
        if (i === 0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
      }
      ctx.stroke();
    }, 90);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let stream;
    const startCamera = async () => {
      if (!isCameraOn) return;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        pushLog("Hand gesture camera started.");
      } catch {
        setIsCameraOn(false);
        pushLog("Camera permission denied or unavailable.");
      }
    };
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCameraOn]);

  const pushLog = (line) =>
    setLogs((prev) => [`${new Date().toLocaleTimeString()} · ${line}`, ...prev].slice(0, 20));

  const handleEncode = async () => {
    try {
      const response = await fetch("/api/morse/encode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textInput }),
      });
      if (!response.ok) throw new Error("encode failed");
      const data = await response.json();
      setMorseOutput(data.morseCode || "");
      pushLog("Signal encoded via backend.");
    } catch {
      const local = encodeMorse(textInput);
      setMorseOutput(local);
      pushLog("Signal encoded using local fallback.");
    }
  };

  const handleDecode = async () => {
    try {
      const response = await fetch("/api/morse/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ morseCode: morseOutput }),
      });
      if (!response.ok) throw new Error("decode failed");
      const data = await response.json();
      setDecodedText(data.decodedText || "");
      pushLog("Decoder output generated via backend.");

      if (aiAssist) await runCv2Analysis();
    } catch {
      const local = decodeMorse(morseOutput);
      setDecodedText(local);
      pushLog("Decoder output generated using local fallback.");
    }
  };

  const runCv2Analysis = async () => {
    setIsCv2Processing(true);
    try {
      const analysis = await fetch("/api/morse/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ morseCode: morseOutput }),
      });
      if (!analysis.ok) throw new Error("analysis failed");
      const res = await analysis.json();
      setQuality(res.signalQuality ?? quality);
      setConfidence(res.confidence ?? confidence);
      setNoise(res.noiseLevel ?? noise);
      if (res.decodedText) setDecodedText(res.decodedText);
      setAnalysisSource(res.source === "cv2" ? "OpenCV (CV2)" : "Heuristic Fallback");
      pushLog(
        res.source === "cv2"
          ? "CV2 analyzer processed signal."
          : "CV2 unavailable; heuristic analyzer used."
      );
    } catch {
      setAnalysisSource("Unavailable");
      pushLog("CV2 analyzer request failed.");
    } finally {
      setIsCv2Processing(false);
    }
  };

  const appendGestureSymbol = (symbol) => {
    if (!symbol || (symbol !== "." && symbol !== "-")) return;
    const next = morseOutput ? `${morseOutput} ${symbol}` : symbol;
    setMorseOutput(next.trim());
  };

  const detectGestureSymbol = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (!video.videoWidth || !video.videoHeight) {
      pushLog("Camera frame not ready yet.");
      return;
    }

    setIsDetectingGesture(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const image = canvas.toDataURL("image/jpeg", 0.85);

      const response = await fetch("/api/morse/gesture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      if (!response.ok) throw new Error("gesture detection failed");
      const data = await response.json();
      setGestureSource(data.source === "cv2" ? "OpenCV (CV2)" : "Fallback");
      setGestureConfidence(data.confidence || 0);

      if (data.symbol === "." || data.symbol === "-") {
        appendGestureSymbol(data.symbol);
        pushLog(`Gesture recognized as "${data.symbol}" (${data.confidence || 0}%).`);
      } else {
        pushLog(data.error || data.reason || "Gesture not recognized. Try clearer hand pose.");
      }
    } catch {
      setGestureSource("Unavailable");
      pushLog("Gesture recognition request failed.");
    } finally {
      setIsDetectingGesture(false);
    }
  };

  const handleTransmit = () => {
    setIsTransmitting(true);
    pushLog(`Transmitting on ${channel}...`);
    setTimeout(() => {
      setIsTransmitting(false);
      pushLog("Transmission complete.");
    }, 1300);
  };

  const toggleSos = () => {
    setSosActive((prev) => {
      const next = !prev;
      pushLog(next ? "Emergency SOS mode activated." : "Emergency SOS mode stopped.");
      if (next) setMorseOutput(SOS);
      return next;
    });
  };

  return (
    <div className="morse-page">
      <div className="morse-shell">
        <div className="morse-header">
          <div>
            <div className="morse-title">MORSE SIGNAL ENGINE</div>
            <div className="morse-sub">Input → Encode → Visualize → Transmit → Decode → Analyze</div>
          </div>
          <span className="morse-badge">SYSTEM ONLINE</span>
        </div>

        <div className="morse-grid">
          <section className="morse-card">
            <h3>1. Signal Input & Encoder</h3>
            <div className="morse-row">
              <input
                className="morse-input"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text"
              />
              <button className="morse-btn" onClick={handleEncode}>ENCODE</button>
            </div>
            <div className="morse-row">
              <select className="morse-select" value={autoTranslate ? "auto" : "manual"} onChange={(e) => setAutoTranslate(e.target.value === "auto")}>
                <option value="auto">Auto Translate</option>
                <option value="manual">Manual</option>
              </select>
              <div className="morse-badge">Reference: Dot / Dash</div>
            </div>
            <textarea className="morse-textarea" readOnly value={morseOutput} />
            <div className="gesture-block">
              <div className="gesture-head">
                <strong>Hand Gesture Input (CV2)</strong>
                <div className="morse-sub">Source: {gestureSource} · Confidence: {gestureConfidence}%</div>
              </div>
              <div className="gesture-video-wrap">
                <video ref={videoRef} autoPlay playsInline muted className="gesture-video" />
              </div>
              <div className="morse-row">
                <button className="morse-btn" onClick={() => setIsCameraOn((prev) => !prev)}>
                  {isCameraOn ? "STOP CAMERA" : "START CAMERA"}
                </button>
                <button className="morse-btn" onClick={detectGestureSymbol} disabled={!isCameraOn || isDetectingGesture}>
                  {isDetectingGesture ? "DETECTING..." : "CAPTURE GESTURE"}
                </button>
              </div>
            </div>
          </section>

          <section className="morse-card">
            <h3>2. Real-Time Signal Visualizer</h3>
            <div className="viz-line">
              {signalTokens.map((token, i) => (
                <span key={i}>
                  {token.split("").map((ch, idx) => (ch === "." ? <span key={idx} className="dot" /> : <span key={idx} className="dash" />))}
                </span>
              ))}
            </div>
            <div className="morse-row">
              <label className="morse-sub">Speed: {speed} WPM</label>
              <input type="range" min="5" max="30" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
            </div>
            <div className="morse-row">
              <label className="morse-sub">Mode</label>
              <select className="morse-select" value={mode} onChange={(e) => setMode(e.target.value)}>
                <option>Normal</option>
                <option>Training</option>
                <option>Emergency</option>
              </select>
            </div>
            <canvas ref={waveRef} width={760} height={90} className="wave-canvas" />
          </section>

          <section className="morse-card">
            <h3>3. Transmission Panel</h3>
            <div className="morse-row">
              <select className="morse-select" value={channel} onChange={(e) => setChannel(e.target.value)}>
                <option>Crew Channel</option>
                <option>Emergency Channel</option>
                <option>Deep Space Channel</option>
              </select>
              <button className="morse-btn" onClick={handleTransmit}>{isTransmitting ? "TRANSMITTING..." : "TRANSMIT SIGNAL"}</button>
            </div>
            <div className="morse-mini-grid">
              <div className="morse-mini"><span>Signal Strength</span><strong>78%</strong></div>
              <div className="morse-mini"><span>Status</span><strong>{isTransmitting ? "In Progress" : "Ready"}</strong></div>
              <div className="morse-mini"><span>Frequency</span><strong>14.250 MHz</strong></div>
              <div className="morse-mini"><span>Latency</span><strong>23 ms</strong></div>
            </div>
          </section>

          <section className="morse-card">
            <h3>4. Decoder Module</h3>
            <textarea className="morse-textarea" value={morseOutput} onChange={(e) => setMorseOutput(e.target.value)} />
            <div className="morse-row">
              <button className="morse-btn" onClick={handleDecode}>DECODE</button>
              <label className="morse-sub">
                <input type="checkbox" checked={aiAssist} onChange={(e) => setAiAssist(e.target.checked)} /> AI Assist
              </label>
            </div>
            <div className="morse-row">
              <button className="morse-btn" onClick={runCv2Analysis} disabled={isCv2Processing}>
                {isCv2Processing ? "CV2 ANALYZING..." : "RUN CV2 ANALYSIS"}
              </button>
              <div className="morse-badge">Analyzer: {analysisSource}</div>
            </div>
            <div className="morse-mini-grid">
              <div className="morse-mini"><span>Decoded Text</span><strong>{decodedText || "---"}</strong></div>
              <div className="morse-mini"><span>Noise</span><strong>{noise}</strong></div>
              <div className="morse-mini"><span>Confidence</span><strong>{confidence}%</strong></div>
              <div className="morse-mini"><span>Signal Quality</span><strong>{quality}%</strong></div>
            </div>
          </section>

          <section className="morse-card morse-emergency">
            <h3>5. Emergency SOS Mode</h3>
            <div className="morse-row">
              <div className="morse-sos-signal">{SOS}</div>
              <button className="morse-btn red" onClick={toggleSos}>{sosActive ? "STOP SOS" : "TRIGGER SOS"}</button>
            </div>
            <div className="morse-row">
              <label className="morse-sub">
                <input type="checkbox" checked={autoRepeat} onChange={(e) => setAutoRepeat(e.target.checked)} /> Auto Repeat
              </label>
              <select className="morse-select" value={intervalSec} onChange={(e) => setIntervalSec(Number(e.target.value))}>
                <option value={5}>5 sec</option>
                <option value={10}>10 sec</option>
                <option value={15}>15 sec</option>
              </select>
            </div>
            <ul className="morse-logs">
              {logs.map((line, i) => <li key={i}>{line}</li>)}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

