const MORSE_MAP = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..",
  0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-",
  5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--",
  ":": "---...", ";": "-.-.-.", "-": "-....-", "/": "-..-.",
  "(": "-.--.", ")": "-.--.-", " ": "/",
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

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Determine the operation from the URL path
  // URL will be like /api/morse/encode, /api/morse/decode, /api/morse/analyze
  const url = new URL(req.url, `http://${req.headers.host}`);
  const segments = url.pathname.split("/").filter(Boolean);
  // segments: ["api", "morse", "<action>"]
  const action = segments[2] || "";

  try {
    switch (action) {
      case "encode": {
        const text = String(req.body?.text ?? "");
        return res.json({ morseCode: encodeMorse(text), source: "backend" });
      }
      case "decode": {
        const morseCode = String(req.body?.morseCode ?? "");
        return res.json({ decodedText: decodeMorse(morseCode), source: "backend" });
      }
      case "analyze": {
        const morseCode = String(req.body?.morseCode ?? "");
        const fallback = analyzeMorseHeuristic(morseCode);
        return res.json({
          ...fallback,
          decodedText: decodeMorse(morseCode),
        });
      }
      case "gesture": {
        // Gesture recognition requires Python/OpenCV which isn't available on Vercel
        return res.json({
          symbol: "",
          confidence: 0,
          source: "fallback",
          error: "Gesture recognition is not available in serverless deployment.",
        });
      }
      default:
        return res.status(404).json({ error: `Unknown morse action: ${action}` });
    }
  } catch (error) {
    res.status(500).json({
      error: "Morse operation failed.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
