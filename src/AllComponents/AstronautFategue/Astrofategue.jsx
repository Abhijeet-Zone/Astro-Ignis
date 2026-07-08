import React, { useState } from 'react';

import Background from './Background';
import Header from './Header';
import InputsPanel from './InputsPanel';
import GaugePanel from './GaugePanel';
import AlertsPanel from './AlertsPanel';
import "./Astrofate.css"

function Astrofategue() {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    hr: '',
    hrv: '',
    spo2: '',
    sleep: '',
    activity: '5',
  });
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- CONFIGURATION ---
  const API_URL = '/api/calculate_fatigue';

  const buildLocalFatigueResult = ({ hr, hrv, spo2, sleep, activity }) => {
    const clamp = (num, min, max) => Math.max(min, Math.min(max, num));

    // Score each metric on a 0..100 fatigue-risk scale (higher = more fatigue).
    const hrRisk = clamp(Math.abs(hr - 72) * 1.6, 0, 100);
    const hrvRisk = clamp((60 - hrv) * 2.2, 0, 100);
    const spo2Risk = clamp((98 - spo2) * 12, 0, 100);
    const sleepRisk = clamp((7.5 - sleep) * 14, 0, 100);
    const activityRisk = clamp((activity - 4) * 12, 0, 100);

    const fatigueScore = Math.round(
      clamp(
        hrRisk * 0.2 +
          hrvRisk * 0.25 +
          spo2Risk * 0.2 +
          sleepRisk * 0.2 +
          activityRisk * 0.15,
        0,
        100
      )
    );

    let fatigueState = 'Low';
    if (fatigueScore >= 75) fatigueState = 'Critical';
    else if (fatigueScore >= 55) fatigueState = 'High';
    else if (fatigueScore >= 35) fatigueState = 'Moderate';

    const alerts = [];
    if (hr > 95 || hr < 52) {
      alerts.push({
        level: hr > 110 || hr < 45 ? 'red' : 'amber',
        metric: 'Heart Rate',
        message: 'Heart rate is outside the expected range for mission operations.',
      });
    }
    if (hrv < 40) {
      alerts.push({
        level: hrv < 30 ? 'red' : 'amber',
        metric: 'HRV',
        message: 'Low heart-rate variability suggests elevated physiological stress.',
      });
    }
    if (spo2 < 95) {
      alerts.push({
        level: spo2 < 92 ? 'red' : 'amber',
        metric: 'SpO2',
        message: 'Blood oxygen is below optimal mission threshold.',
      });
    }
    if (sleep < 6) {
      alerts.push({
        level: sleep < 4.5 ? 'red' : 'amber',
        metric: 'Sleep',
        message: 'Insufficient sleep duration can significantly raise fatigue risk.',
      });
    }
    if (activity > 8) {
      alerts.push({
        level: activity > 9 ? 'red' : 'amber',
        metric: 'Activity',
        message: 'High workload intensity detected. Consider recovery interval.',
      });
    }

    return {
      fatigueScore,
      fatigueState,
      alerts,
      source: 'onboard',
    };
  };

  // --- EVENT HANDLERS & LOGIC ---

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const processFatigueData = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setApiData(null);

    const payload = {
      hr: parseInt(formData.hr) || 0,
      hrv: parseInt(formData.hrv) || 0,
      spo2: parseInt(formData.spo2) || 0,
      sleep: parseFloat(formData.sleep) || 0,
      activity: parseInt(formData.activity) || 0,
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setApiData({
        fatigueScore: Number.isFinite(data?.fatigueScore) ? data.fatigueScore : 0,
        fatigueState: data?.fatigueState || 'Low',
        alerts: Array.isArray(data?.alerts) ? data.alerts : [],
        source: data?.source || 'backend',
      });
    } catch (err) {
      // If backend is unavailable, use local onboard model so UI stays fully functional.
      const fallback = buildLocalFatigueResult(payload);
      setApiData(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const fillWithDemoData = () => {
    setFormData({
      hr: '88',
      hrv: '32',
      spo2: '97',
      sleep: '5.5',
      activity: '8',
    });
  };

  const fillWithRandomData = () => {
    const rand = (min, max, decimals = 0) => (Math.random() * (max - min) + min).toFixed(decimals);
    setFormData({
      hr: rand(55, 110),
      hrv: rand(25, 90),
      spo2: rand(94, 100),
      sleep: rand(4.0, 8.5, 1),
      activity: rand(1, 10),
    });
  };

  return (
    <>
      <Background />
      <div className="relative z-10 min-h-screen flex flex-col fatigue-shell">
        <Header onDemo={fillWithDemoData} onRandomize={fillWithRandomData} />
        <main className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6 px-6 lg:px-10 py-6">
          <InputsPanel
            formData={formData}
            apiData={apiData}
            isLoading={isLoading}
            handleInputChange={handleInputChange}
            processFatigueData={processFatigueData}
          />
          <GaugePanel
            formData={formData}
            apiData={apiData}
          />
          <AlertsPanel
            apiData={apiData}
          />
        </main>
      </div>
    </>
  );
}

export default Astrofategue;