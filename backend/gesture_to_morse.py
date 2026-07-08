import argparse
import base64
import json

try:
    import cv2
    import numpy as np
except Exception:
    cv2 = None
    np = None


def decode_image(data_url):
    if "," in data_url:
        data_url = data_url.split(",", 1)[1]
    raw = base64.b64decode(data_url)
    arr = np.frombuffer(raw, dtype=np.uint8)
    return cv2.imdecode(arr, cv2.IMREAD_COLOR)


def classify_by_contour_area(frame):
    """Fallback classifier when finger extraction is unstable."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (9, 9), 0)
    _, th = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    contours, _ = cv2.findContours(th, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return {"symbol": "", "confidence": 0, "reason": "No contour detected"}

    largest = max(contours, key=cv2.contourArea)
    area = cv2.contourArea(largest)
    frame_area = frame.shape[0] * frame.shape[1]
    ratio = area / max(1.0, frame_area)
    if ratio < 0.04:
        symbol = "."
        confidence = int(min(99, max(65, 74 + (0.04 - ratio) * 300)))
    else:
        symbol = "-"
        confidence = int(min(99, max(65, 74 + (ratio - 0.04) * 250)))
    return {"symbol": symbol, "confidence": confidence, "reason": f"Fallback area ratio={ratio:.4f}"}


def classify_gesture_dot_dash(frame):
    """
    Primary classifier:
    - 1 finger => dot
    - 2 or more fingers => dash
    Uses skin mask + convex hull defects.
    """
    h, w = frame.shape[:2]
    roi = frame[int(h * 0.12) : int(h * 0.9), int(w * 0.12) : int(w * 0.9)]
    if roi.size == 0:
        return {"symbol": "", "confidence": 0, "reason": "Invalid ROI"}

    hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
    # Broad skin range for varied lighting/tones.
    lower = np.array([0, 25, 40], dtype=np.uint8)
    upper = np.array([25, 210, 255], dtype=np.uint8)
    mask = cv2.inRange(hsv, lower, upper)
    mask = cv2.GaussianBlur(mask, (7, 7), 0)
    kernel = np.ones((3, 3), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=2)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return classify_by_contour_area(frame)

    hand_contour = max(contours, key=cv2.contourArea)
    area = cv2.contourArea(hand_contour)
    if area < 1800:
        return classify_by_contour_area(frame)

    hull_indices = cv2.convexHull(hand_contour, returnPoints=False)
    if hull_indices is None or len(hull_indices) < 4:
        return classify_by_contour_area(frame)

    defects = cv2.convexityDefects(hand_contour, hull_indices)
    if defects is None:
        return classify_by_contour_area(frame)

    finger_gaps = 0
    for i in range(defects.shape[0]):
        s, e, f, depth = defects[i, 0]
        start = hand_contour[s][0]
        end = hand_contour[e][0]
        far = hand_contour[f][0]

        a = np.linalg.norm(end - start)
        b = np.linalg.norm(far - start)
        c = np.linalg.norm(end - far)
        if b == 0 or c == 0:
            continue

        cos_val = (b * b + c * c - a * a) / (2 * b * c)
        cos_val = max(-1.0, min(1.0, cos_val))
        angle = np.degrees(np.arccos(cos_val))

        # Typical finger valley: sharp angle and deep enough defect.
        if angle < 80 and depth > 900:
            finger_gaps += 1

    fingers = min(5, finger_gaps + 1)
    if fingers <= 1:
        symbol = "."
        confidence = 78 + min(18, int(area / 12000))
    else:
        symbol = "-"
        confidence = 80 + min(17, fingers * 4)

    return {
        "symbol": symbol,
        "confidence": int(min(99, max(68, confidence))),
        "reason": f"FingerCount={fingers} (gaps={finger_gaps})",
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", default="")
    parser.add_argument("--stdin", action="store_true")
    args = parser.parse_args()

    if not cv2 or not np:
        print(
            json.dumps(
                {
                    "symbol": "",
                    "confidence": 0,
                    "source": "fallback",
                    "error": "opencv-python or numpy unavailable",
                }
            )
        )
        return

    try:
        image_data = args.image
        if args.stdin:
            image_data = input().strip()
        frame = decode_image(image_data)
        if frame is None:
            raise ValueError("Invalid image data")
        result = classify_gesture_dot_dash(frame)
        result["source"] = "cv2"
        print(json.dumps(result))
    except Exception as ex:
        print(
            json.dumps(
                {
                    "symbol": "",
                    "confidence": 0,
                    "source": "cv2",
                    "error": str(ex),
                }
            )
        )


if __name__ == "__main__":
    main()

