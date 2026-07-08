import argparse
import json
import math
import random

try:
    import cv2
    import numpy as np
except Exception:
    cv2 = None
    np = None

MORSE_MAP = {
    "A": ".-",
    "B": "-...",
    "C": "-.-.",
    "D": "-..",
    "E": ".",
    "F": "..-.",
    "G": "--.",
    "H": "....",
    "I": "..",
    "J": ".---",
    "K": "-.-",
    "L": ".-..",
    "M": "--",
    "N": "-.",
    "O": "---",
    "P": ".--.",
    "Q": "--.-",
    "R": ".-.",
    "S": "...",
    "T": "-",
    "U": "..-",
    "V": "...-",
    "W": ".--",
    "X": "-..-",
    "Y": "-.--",
    "Z": "--..",
    "0": "-----",
    "1": ".----",
    "2": "..---",
    "3": "...--",
    "4": "....-",
    "5": ".....",
    "6": "-....",
    "7": "--...",
    "8": "---..",
    "9": "----.",
    " ": "/",
}
REVERSE = {v: k for k, v in MORSE_MAP.items()}


def decode_morse(code):
    parts = code.strip().split(" ")
    out = []
    for chunk in parts:
        if chunk == "/":
            out.append(" ")
        else:
            out.append(REVERSE.get(chunk, ""))
    return "".join(out).strip()


def cv2_analyze(morse_code):
    if not cv2 or not np:
        return None

    token_units = []
    for ch in morse_code:
        if ch == ".":
            token_units.extend([1, 0])
        elif ch == "-":
            token_units.extend([1, 1, 1, 0])
        elif ch == " ":
            token_units.extend([0, 0])
        elif ch == "/":
            token_units.extend([0, 0, 0, 0])
    if not token_units:
        token_units = [0] * 20

    w = max(280, len(token_units) * 4)
    h = 120
    img = np.zeros((h, w, 3), dtype=np.uint8)
    img[:] = (5, 12, 25)

    signal = []
    for i in range(w):
        unit_idx = min(len(token_units) - 1, int(i / 4))
        amp = 26 if token_units[unit_idx] == 1 else 7
        y = int(h / 2 + math.sin(i * 0.12) * amp + random.uniform(-2, 2))
        signal.append([i, y])
    pts = np.array(signal, dtype=np.int32).reshape((-1, 1, 2))
    cv2.polylines(img, [pts], False, (255, 190, 60), 1)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (7, 7), 0)
    _, th = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    bright_ratio = float(np.count_nonzero(th)) / float(th.size)
    noise_score = min(1.0, max(0.0, 1.0 - bright_ratio * 8.0))
    confidence = int(max(55, min(99, 98 - (noise_score * 25))))
    quality = int(max(45, min(99, 96 - (noise_score * 36))))

    if noise_score < 0.28:
        noise_label = "Low"
    elif noise_score < 0.55:
        noise_label = "Medium"
    else:
        noise_label = "High"

    return {"confidence": confidence, "signalQuality": quality, "noiseLevel": noise_label}


def heuristic(morse_code):
    filled = sum(1 for c in morse_code if c in ".-")
    spaces = sum(1 for c in morse_code if c in " /")
    ratio = spaces / max(1, filled)
    confidence = int(max(55, min(95, 92 - ratio * 12)))
    quality = int(max(50, min(96, 94 - ratio * 18)))
    noise = "Low" if ratio < 0.35 else "Medium" if ratio < 0.7 else "High"
    return {"confidence": confidence, "signalQuality": quality, "noiseLevel": noise}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--morse", default="")
    args = parser.parse_args()

    decoded = decode_morse(args.morse)
    cv2_metrics = cv2_analyze(args.morse)
    metrics = cv2_metrics if cv2_metrics else heuristic(args.morse)
    source = "cv2" if cv2_metrics else "heuristic"

    print(
        json.dumps(
            {
                "decodedText": decoded,
                "confidence": metrics["confidence"],
                "signalQuality": metrics["signalQuality"],
                "noiseLevel": metrics["noiseLevel"],
                "source": source,
            }
        )
    )


if __name__ == "__main__":
    main()

