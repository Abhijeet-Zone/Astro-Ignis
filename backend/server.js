import express from "express";
import { spawn } from "node:child_process";
import { calculateFatigue } from "./fatigueEngine.js";

const app = express();
const runtimeProcess = globalThis.process;
const PORT = Number(runtimeProcess?.env?.FATIGUE_API_PORT || 5000);

app.use(express.json());

const MORSE_MAP = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "!": "-.-.--",
  ":": "---...",
  ";": "-.-.-.",
  "-": "-....-",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  " ": "/",
};
const REVERSE_MORSE_MAP = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([k, v]) => [v, k])
);

const encodeMorse = (text = "") =>
  text
    .toUpperCase()
    .split("")
    .map((char) => MORSE_MAP[char] || "")
    .filter(Boolean)
    .join(" ");

const decodeMorse = (morse = "") =>
  morse
    .trim()
    .split(" ")
    .map((token) => REVERSE_MORSE_MAP[token] || "")
    .join("")
    .replaceAll("/", " ");

const analyzeMorseHeuristic = (morseCode = "") => {
  const symbols = (morseCode.match(/[.-]/g) || []).length;
  const spacers = (morseCode.match(/[ /]/g) || []).length;
  const ratio = spacers / Math.max(1, symbols);
  const confidence = Math.round(Math.max(55, Math.min(95, 92 - ratio * 12)));
  const signalQuality = Math.round(Math.max(48, Math.min(96, 94 - ratio * 18)));
  const noiseLevel = ratio < 0.35 ? "Low" : ratio < 0.7 ? "Medium" : "High";
  return { confidence, signalQuality, noiseLevel, source: "heuristic" };
};

const runPythonJson = ({ command, args = [], stdinText = "" }) =>
  new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd: runtimeProcess?.cwd?.() || ".",
      stdio: ["pipe", "pipe", "pipe"],
    });

    let out = "";
    let err = "";

    proc.stdout.on("data", (chunk) => {
      out += chunk.toString();
    });
    proc.stderr.on("data", (chunk) => {
      err += chunk.toString();
    });
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`${command} exited ${code}: ${err || "unknown error"}`));
        return;
      }
      try {
        resolve(JSON.parse(out.trim()));
      } catch (parseError) {
        reject(parseError);
      }
    });

    if (stdinText) {
      proc.stdin.write(stdinText);
    }
    proc.stdin.end();
  });

const tryPythonRunners = async ({ scriptArgs = [], stdinText = "" }) => {
  const runners = [
    { command: "python", args: scriptArgs },
    { command: "py", args: ["-3", ...scriptArgs] },
    { command: "python3", args: scriptArgs },
  ];
  let lastError;
  for (const runner of runners) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await runPythonJson({
        command: runner.command,
        args: runner.args,
        stdinText,
      });
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("No Python runtime found.");
};

const runCv2Analyzer = (morseCode) =>
  tryPythonRunners({
    scriptArgs: ["backend/morse_cv2.py", "--morse", morseCode],
  });

const runGestureRecognizer = (imageDataUrl) =>
  tryPythonRunners({
    scriptArgs: ["backend/gesture_to_morse.py", "--stdin"],
    stdinText: imageDataUrl,
  });

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "astronaut-fatigue-api" });
});

app.post("/api/calculate_fatigue", (req, res) => {
  try {
    const payload = req.body || {};
    const parsed = {
      hr: Number(payload.hr ?? 0),
      hrv: Number(payload.hrv ?? 0),
      spo2: Number(payload.spo2 ?? 0),
      sleep: Number(payload.sleep ?? 0),
      activity: Number(payload.activity ?? 0),
    };

    const result = calculateFatigue(parsed);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Failed to calculate fatigue.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.post("/api/morse/encode", (req, res) => {
  try {
    const text = String(req.body?.text ?? "");
    res.json({ morseCode: encodeMorse(text), source: "backend" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to encode morse.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.post("/api/morse/decode", (req, res) => {
  try {
    const morseCode = String(req.body?.morseCode ?? "");
    res.json({ decodedText: decodeMorse(morseCode), source: "backend" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to decode morse.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.post("/api/morse/analyze", async (req, res) => {
  const morseCode = String(req.body?.morseCode ?? "");
  try {
    const cv2Result = await runCv2Analyzer(morseCode);
    res.json({
      ...cv2Result,
      decodedText: cv2Result.decodedText || decodeMorse(morseCode),
    });
  } catch {
    const fallback = analyzeMorseHeuristic(morseCode);
    res.json({
      ...fallback,
      decodedText: decodeMorse(morseCode),
    });
  }
});

app.post("/api/morse/gesture", async (req, res) => {
  const image = String(req.body?.image ?? "");
  if (!image) {
    res.status(400).json({ error: "image is required" });
    return;
  }

  try {
    const result = await runGestureRecognizer(image);
    res.json(result);
  } catch (error) {
    res.json({
      symbol: "",
      confidence: 0,
      source: "fallback",
      error:
        error instanceof Error
          ? error.message
          : "Gesture recognition unavailable. Install OpenCV + NumPy.",
    });
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Fatigue backend running on http://localhost:${PORT}`);
  });
}

export default app;
