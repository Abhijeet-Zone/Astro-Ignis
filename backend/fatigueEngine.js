const clamp = (num, min, max) => Math.max(min, Math.min(max, num));

export function calculateFatigue({ hr, hrv, spo2, sleep, activity }) {
  const safeHr = Number.isFinite(hr) ? hr : 0;
  const safeHrv = Number.isFinite(hrv) ? hrv : 0;
  const safeSpo2 = Number.isFinite(spo2) ? spo2 : 0;
  const safeSleep = Number.isFinite(sleep) ? sleep : 0;
  const safeActivity = Number.isFinite(activity) ? activity : 0;

  const hrRisk = clamp(Math.abs(safeHr - 72) * 1.6, 0, 100);
  const hrvRisk = clamp((60 - safeHrv) * 2.2, 0, 100);
  const spo2Risk = clamp((98 - safeSpo2) * 12, 0, 100);
  const sleepRisk = clamp((7.5 - safeSleep) * 14, 0, 100);
  const activityRisk = clamp((safeActivity - 4) * 12, 0, 100);

  const fatigueScore = Math.round(
    clamp(
      hrRisk * 0.2 + hrvRisk * 0.25 + spo2Risk * 0.2 + sleepRisk * 0.2 + activityRisk * 0.15,
      0,
      100
    )
  );

  let fatigueState = "Low";
  if (fatigueScore >= 75) fatigueState = "Critical";
  else if (fatigueScore >= 55) fatigueState = "High";
  else if (fatigueScore >= 35) fatigueState = "Moderate";

  const alerts = [];
  if (safeHr > 95 || safeHr < 52) {
    alerts.push({
      level: safeHr > 110 || safeHr < 45 ? "red" : "amber",
      metric: "Heart Rate",
      message: "Heart rate is outside the expected range for mission operations.",
    });
  }
  if (safeHrv < 40) {
    alerts.push({
      level: safeHrv < 30 ? "red" : "amber",
      metric: "HRV",
      message: "Low heart-rate variability suggests elevated physiological stress.",
    });
  }
  if (safeSpo2 < 95) {
    alerts.push({
      level: safeSpo2 < 92 ? "red" : "amber",
      metric: "SpO2",
      message: "Blood oxygen is below optimal mission threshold.",
    });
  }
  if (safeSleep < 6) {
    alerts.push({
      level: safeSleep < 4.5 ? "red" : "amber",
      metric: "Sleep",
      message: "Insufficient sleep duration can significantly raise fatigue risk.",
    });
  }
  if (safeActivity > 8) {
    alerts.push({
      level: safeActivity > 9 ? "red" : "amber",
      metric: "Activity",
      message: "High workload intensity detected. Consider recovery interval.",
    });
  }

  return {
    fatigueScore,
    fatigueState,
    alerts,
    source: "backend",
  };
}
