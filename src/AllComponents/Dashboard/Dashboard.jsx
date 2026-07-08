import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import astronautAvatar from './astronaut_avatar.png';
import exploisGlobe from './explois_globe.png';
import satelliteDish from './satellite_dish.png';
import recycleIcon from './recycle_icon.png';
import neuralBrain from './neural_brain-.png';
import './Dashboard.css';

// Reusable component for the mini bar charts
const MiniChart = ({ barCount = 15, color = "#00d4ff", delayOffset = 0 }) => (
  <div className="mini-chart-bars">
    {Array.from({ length: barCount }).map((_, i) => (
      <div
        key={i}
        className="chart-bar-line"
        style={{
          height: `${Math.random() * 80 + 20}%`,
          backgroundColor: color,
          animationDelay: `${(i * 0.1) + delayOffset}s`,
        }}
      />
    ))}
  </div>
);

// Progressively increasing bar chart (like in MED and ERR)
const AscendingChart = ({ barCount = 20, color = "#00d4ff" }) => (
  <div className="ascending-chart">
    {Array.from({ length: barCount }).map((_, i) => (
      <div
        key={i}
        className="asc-bar"
        style={{
          height: `${((i + 1) / barCount) * 100}%`,
          backgroundColor: color,
        }}
      />
    ))}
  </div>
);

// The 3D blocks for STUDY ANALYSIS
const AnalysisBlock = ({ number, label, colorClass }) => (
  <div className="analysis-block">
    <div className={`cube ${colorClass}`}>
      <div className="cube-face front">{number}</div>
      <div className="cube-face top"></div>
      <div className="cube-face right"></div>
    </div>
    <div className="cube-label">{label}</div>
  </div>
);

// Morse code dot/dash
const MorseCodeDisplay = ({ onReplay, trigger }) => {
  const sosPattern = [1, 1, 1, 0, 2, 2, 2, 0, 1, 1, 1]; // 1: dot, 2: dash, 0: space

  return (
    <div className="morse-container">
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-cyan-400 mb-1" style={{ textShadow: '0 0 10px #22d3ee' }}>256<span className="text-sm">Hz</span></div>
        <div className="text-[10px] text-cyan-200 tracking-[0.2em]">EMERGENCY SIGNAL</div>
      </div>
      
      <div className="flex justify-center gap-2 mb-6">
        {sosPattern.map((signal, index) => {
          if (signal === 0) return <div key={`${trigger}-${index}`} className="w-2" />;
          return (
            <div
              key={`${trigger}-${index}`}
              className={`bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee] ${signal === 1 ? 'w-2 h-2' : 'w-6 h-2'}`}
              style={{ animation: `blink 0.5s ease-in-out ${index * 0.3}s` }}
            />
          );
        })}
      </div>
      
      <button onClick={onReplay} className="morse-btn">
        REPLAY SOS
      </button>
    </div>
  );
};


function Dashboard() {
  const navigate = useNavigate();
  const [morseTrigger, setMorseTrigger] = useState(0);
  const [time, setTime] = useState(new Date());

  const replayMorse = useCallback(() => {
    setMorseTrigger(count => count + 1);
  }, []);

  useEffect(() => {
    const interval = setInterval(replayMorse, 8000);
    return () => clearInterval(interval);
  }, [replayMorse]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dashboard-root">
      {/* Background Video / Image */}
      <div className="video-background">
        <video autoPlay muted loop playsInline>
          <source src="/dash.mp4" type="video/mp4" />
        </video>
        <div className="bg-overlay"></div>
      </div>

      {/* Header Area exactly mimicking the image */}
      <header className="top-dashboard-header">
        
        {/* Left: Astronaut Status */}
        <div className="header-left">
          <div className="astronaut-avatar">
            <img src={astronautAvatar} alt="Astronaut" className="w-full h-full object-cover" />
          </div>
          <div className="header-status-info">
            <div className="flex items-center gap-2 mb-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <div className="text-[10px] text-cyan-200 tracking-widest uppercase">Astronaut Status</div>
            </div>
            <div className="text-sm font-bold text-white tracking-wider mb-2">ASTRONAUT FATIGUE</div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-cyan-400">Pulse</span>
              <span className="text-cyan-300 font-bold">72 bpm</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-cyan-400">Fatigue</span>
              <span className="text-yellow-400 font-bold">Moderate</span>
            </div>
          </div>
        </div>

        {/* Center: Title & Ticker */}
        <div className="header-center">
          <h1 className="main-logo-text">ASTRO-IGNIS</h1>
          <div className="telemetry-ticker">
            <div className="tick-item">
              <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]"></div>
              <span>Live Telemetry</span>
            </div>
            <div className="tick-item opacity-60">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span>Uptime 99.98%</span>
            </div>
            <div className="tick-item opacity-60">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Latency 23ms</span>
            </div>
          </div>
        </div>

        {/* Right: Clock & Engine Status */}
        <div className="header-right">
          <div className="clock-panel">
            <div className="time">{time.toLocaleTimeString('en-US', { hour12: false })}</div>
            <div className="date">May 26, 2025</div>
          </div>
          <div className="engine-status">
            <div className="text-[10px] text-cyan-200 mb-1 tracking-widest uppercase">Quantum Engine</div>
            <div className="text-xs text-green-400 font-bold tracking-widest shadow-[0_0_10px_#4ade80]">ONLINE</div>
          </div>
        </div>

      </header>

      {/* Main Grid exactly matching the image layout */}
      <div className="main-dashboard-grid">
        
        {/* ROW 1: EXP, MED, SIG */}
        <div className="dash-card" onClick={() => navigate("/Astrofategue")}>
          <div className="card-top">
            <h2 className="card-title">ASTRO EXPLOIS</h2>
            <span className="card-chip">EXP</span>
          </div>
          <div className="card-body">
            <div className="explois-visual">
              <div className="wireframe-globe">
                <img src={exploisGlobe} alt="Globe" className="w-full h-full object-cover" />
              </div>
              <div className="bar-grid-3d">
                 <div className="bar-3d" style={{height: '30%'}}></div>
                 <div className="bar-3d" style={{height: '50%'}}></div>
                 <div className="bar-3d" style={{height: '80%'}}></div>
                 <div className="bar-3d" style={{height: '60%'}}></div>
                 <div className="bar-3d" style={{height: '40%'}}></div>
                 <div className="bar-3d" style={{height: '55%'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="dash-card" onClick={() => navigate("/health")}>
          <div className="card-top">
            <h2 className="card-title">HEALTH ISSUE</h2>
            <span className="card-chip">MED</span>
          </div>
          <div className="card-body flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="med-icon-ring">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>
              </div>
              <div className="med-stats text-right">
                <div className="flex justify-end gap-3 text-xs mb-2">
                  <span className="text-cyan-100">SpO₂</span>
                  <span className="text-red-400 font-bold">94%</span>
                </div>
                <div className="flex justify-end gap-3 text-xs">
                  <span className="text-cyan-100">Temp</span>
                  <span className="text-yellow-400 font-bold">37.8°C</span>
                </div>
              </div>
            </div>
            <AscendingChart barCount={24} color="#00d4ff" />
          </div>
        </div>

        <div className="dash-card" onClick={() => navigate("/morse")}>
          <div className="card-top">
            <h2 className="card-title">MORSE CODE</h2>
            <span className="card-chip">SIG</span>
          </div>
          <div className="card-body flex items-center justify-center">
            <MorseCodeDisplay onReplay={replayMorse} trigger={morseTrigger} />
          </div>
        </div>

        {/* ROW 2: ANA, NEU, ERR */}
        <div className="dash-card" onClick={() => navigate("/spavenova")}>
          <div className="card-top">
            <h2 className="card-title">STUDY ANALYSIS SPACE MONO</h2>
            <span className="card-chip">ANA</span>
          </div>
          <div className="card-body flex items-center justify-center gap-4">
             <AnalysisBlock number="2847" label="DATA" colorClass="cube-blue" />
             <AnalysisBlock number="1204" label="VALID" colorClass="cube-green" />
             <AnalysisBlock number="643" label="QUEUE" colorClass="cube-yellow" />
             <AnalysisBlock number="12" label="ERROR" colorClass="cube-red" />
          </div>
        </div>

        <div className="dash-card">
          <div className="card-top">
            <h2 className="card-title">NEURAL ACTIVITY MONITOR</h2>
            <span className="card-chip">NEU</span>
          </div>
          <div className="card-body flex items-center justify-center relative overflow-hidden p-0">
            <img src={neuralBrain} alt="Neural" className="neural-brain-img" />
            <div className="neural-grid-overlay"></div>
          </div>
        </div>

        <div className="dash-card" onClick={() => navigate("/equipment")}>
          <div className="card-top">
            <h2 className="card-title">EQUIPMENT MALFUNCTION</h2>
            <span className="card-chip">ERR</span>
          </div>
          <div className="card-body flex flex-col items-center">
             <div className="hardware-buttons flex gap-4 mb-4">
                <div className="hw-btn hw-green"><div className="light"></div></div>
                <div className="hw-btn hw-red"><div className="light"></div></div>
                <div className="hw-btn hw-green"><div className="light"></div></div>
             </div>
             <div className="text-[10px] text-red-500 font-bold tracking-widest mb-1 shadow-[0_0_10px_#ef4444]">ACTUATOR FAULT</div>
             <div className="text-[10px] text-cyan-200 tracking-widest mb-4">ACKNOWLEDGE</div>
             <div className="w-full px-4"><AscendingChart barCount={18} color="#0088ff" /></div>
          </div>
        </div>

        {/* ROW 3: PSY, COM, COM (Food) */}
        <div className="dash-card" onClick={() => navigate("/physico")}>
          <div className="card-top">
            <h2 className="card-title">PSYCHOLOGICAL</h2>
            <span className="card-chip">PSY</span>
          </div>
          <div className="card-body flex items-center justify-between px-2">
             <div className="psy-gauge relative flex items-center justify-center">
                <svg className="gauge-svg" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#0a1930" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#00d4ff" strokeWidth="8" strokeDasharray="180 250" strokeLinecap="round" />
                </svg>
                <div className="absolute text-center">
                   <div className="text-2xl font-bold text-white">225K</div>
                </div>
             </div>
             <div className="flex flex-col items-center">
                <div className="text-[10px] text-cyan-200 tracking-wider mb-1">STRESS INDEX</div>
                <div className="text-sm text-green-400 font-bold">25.3 AVG</div>
                <div className="w-24 mt-2 h-10 overflow-hidden relative">
                   <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full opacity-50">
                     <polyline fill="none" stroke="#00d4ff" strokeWidth="2" points="0,30 20,20 40,35 60,10 80,25 100,5"/>
                   </svg>
                </div>
             </div>
          </div>
        </div>

        <div className="dash-card" onClick={() => navigate("/communication")}>
          <div className="card-top">
            <h2 className="card-title">COMMUNICATION</h2>
            <span className="card-chip">COM</span>
          </div>
          <div className="card-body flex flex-col items-center justify-center pb-2">
             <div className="dish-icon-3d relative w-20 h-20 mb-4 rounded-full overflow-hidden border-2 border-cyan-500/30 shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                <img src={satelliteDish} alt="Satellite" className="w-full h-full object-cover" />
             </div>
             <div className="text-[11px] text-green-400 font-bold tracking-widest shadow-[0_0_10px_#4ade80] mb-1">SIGNAL STRONG</div>
             <div className="text-[10px] text-cyan-200">89% Quality</div>
          </div>
        </div>

        <div className="dash-card" onClick={() => navigate("/FoodStorage")}>
          <div className="card-top">
            <h2 className="card-title">FOOD & WASTE MANAGEMENT</h2>
            <span className="card-chip">COM</span>
          </div>
          <div className="card-body flex flex-col items-center justify-center pb-2">
             <div className="recycle-icon-3d relative w-20 h-20 mb-4 rounded-full overflow-hidden border-2 border-cyan-500/30 shadow-[0_10px_20px_rgba(0,0,0,0.8)] flex items-center justify-center">
                <img src={recycleIcon} alt="Recycle" className="w-full h-full object-cover" />
             </div>
             <div className="text-[11px] text-green-400 font-bold tracking-widest shadow-[0_0_10px_#4ade80] mb-1">SYSTEM ONLINE</div>
             <div className="text-[10px] text-cyan-200">89% Quality</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;