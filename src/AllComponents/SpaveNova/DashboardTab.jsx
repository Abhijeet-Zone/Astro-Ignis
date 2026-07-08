import React, { useState, useEffect, useRef } from 'react';
import {
  SpaceStationIcon, SunIcon, GlobeIcon, ClockIcon,
  RocketIcon, ChartIcon, CheckCircleIcon, InfoIcon
} from '../Icons';

function DashboardTab() {
  const [liveData, setLiveData] = useState({
    issLat: '51.6461°N',
    issLon: '0.0939°W',
    issAlt: '408 km',
    solarWind: '425 km/s',
    geomagnetic: 'Quiet',
    solarFlares: 'C2.1'
  });

  const [dateTime, setDateTime] = useState({
    time: '--:--:--',
    date: 'Loading...',
    utc: 'UTC: --:--:--'
  });

  const chartRef = useRef(null);

  useEffect(() => {
    const updateLiveData = () => {
      const lat = (Math.random() * 180 - 90).toFixed(4);
      const lon = (Math.random() * 360 - 180).toFixed(4);
      const geoStates = ['Quiet', 'Unsettled', 'Active', 'Minor Storm'];
      const flareTypes = ['A1.2', 'B3.4', 'C2.1', 'C5.7', 'M1.3'];

      setLiveData({
        issLat: `${Math.abs(lat)}°${lat > 0 ? 'N' : 'S'}`,
        issLon: `${Math.abs(lon)}°${lon > 0 ? 'E' : 'W'}`,
        issAlt: `${(400 + Math.random() * 20).toFixed(0)} km`,
        solarWind: `${(400 + Math.random() * 100).toFixed(0)} km/s`,
        geomagnetic: geoStates[Math.floor(Math.random() * geoStates.length)],
        solarFlares: flareTypes[Math.floor(Math.random() * flareTypes.length)],
      });
    };

    const updateDateTime = () => {
      const now = new Date();
      setDateTime({
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        utc: 'UTC: ' + now.toUTCString().split(' ')[4]
      });
    };

    updateLiveData();
    updateDateTime();

    const dataInterval = setInterval(updateLiveData, 10000);
    const timeInterval = setInterval(updateDateTime, 1000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(timeInterval);
    };
  }, []);

  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const drawChart = () => {
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(69, 183, 209, 0.3)');
        gradient.addColorStop(1, 'rgba(78, 205, 196, 0.1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = '#4ecdc4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const dataPoints = 20;
        for (let i = 0; i < dataPoints; i++) {
            const x = (i / (dataPoints - 1)) * width;
            const y = height - (Math.sin(Date.now() * 0.001 + i * 0.5) * (height / 4) + (height / 2));
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
    };

    const chartInterval = setInterval(drawChart, 100);
    return () => clearInterval(chartInterval);
  }, []);


  return (
    <div className="tab-content active spnova-dashboard">
      <div className="spnova-grid">
        <section className="spnova-card spnova-card-large">
          <h3><SpaceStationIcon size={18} color="#67e8f9" style={{ marginRight: 6 }} /> International Space Station</h3>
          <img className="spnova-hero-img" src="/image1.jpeg" alt="ISS" />
          <div className="spnova-metric-list">
            <div><span>Latitude</span><strong>{liveData.issLat}</strong></div>
            <div><span>Longitude</span><strong>{liveData.issLon}</strong></div>
            <div><span>Altitude</span><strong>{liveData.issAlt}</strong></div>
            <div><span>Speed</span><strong>27,600 km/h</strong></div>
            <div><span>Crew</span><strong><span className="status-indicator status-online"></span>7 Astronauts</strong></div>
          </div>
        </section>

        <section className="spnova-card">
          <h3><SunIcon size={18} color="#fbbf24" style={{ marginRight: 6 }} /> Solar Activity</h3>
          <div className="spnova-kpi"><span>Solar Wind</span><strong>{liveData.solarWind}</strong></div>
          <div className="spnova-kpi"><span>Geomagnetic Status</span><strong>{liveData.geomagnetic}</strong></div>
          <div className="spnova-kpi two-col">
            <div><span>Solar Flares</span><strong>{liveData.solarFlares}</strong></div>
            <div><span>Sunspot Number</span><strong>128</strong></div>
          </div>
          <img className="spnova-mini-visual" src="/image2.jpeg" alt="Solar activity" />
        </section>

        <section className="spnova-card">
          <h3><GlobeIcon size={18} color="#34d399" style={{ marginRight: 6 }} /> Space Weather</h3>
          <div className="spnova-kpi"><span>Cosmic Rays</span><strong>6,432 /hr</strong></div>
          <div className="spnova-kpi"><span>Radiation Level</span><strong>Normal</strong></div>
          <div className="spnova-kpi"><span>Aurora Activity</span><strong>Moderate</strong></div>
          <img className="spnova-mini-visual" src="/image3.jpeg" alt="Aurora activity" />
        </section>

        <section className="spnova-card">
          <h3><ClockIcon size={18} color="#a78bfa" style={{ marginRight: 6 }} /> Mission Control Time</h3>
          <div className="spnova-time">{dateTime.time}</div>
          <div className="spnova-date">{dateTime.date}</div>
          <div className="spnova-utc">{dateTime.utc}</div>
        </section>

        <section className="spnova-card">
          <h3><RocketIcon size={18} color="#ff6b35" style={{ marginRight: 6 }} /> Active Missions</h3>
          <ul className="spnova-missions">
            <li><img src="/image1.jpeg" alt="Artemis" /><span><span className="status-indicator status-online"></span>Artemis Program - Lunar Gateway</span></li>
            <li><img src="/image2.jpeg" alt="Mars" /><span><span className="status-indicator status-online"></span>Mars Perseverance Rover</span></li>
            <li><img src="/image3.jpeg" alt="JWST" /><span><span className="status-indicator status-warning"></span>James Webb Space Telescope</span></li>
            <li><img src="/image4.jpeg" alt="Parker" /><span><span className="status-indicator status-online"></span>Parker Solar Probe</span></li>
          </ul>
        </section>

        <section className="spnova-card">
          <h3><ChartIcon size={18} color="#60a5fa" style={{ marginRight: 6 }} /> Live Data Visualization</h3>
          <div className="spnova-chart-tabs">
            <span className="active">Solar Wind</span>
            <span>Radiation</span>
            <span>Cosmic Rays</span>
          </div>
          <div className="chart" style={{ height: '170px' }}>
            <canvas ref={chartRef} width="300" height="150" style={{ borderRadius: '10px' }}></canvas>
          </div>
        </section>
      </div>

      <footer className="spnova-bottom-strip">
        <div><CheckCircleIcon size={16} color="#4caf50" style={{ marginRight: 6 }} /> System Status <strong>All Systems Operational</strong></div>
        <div><RocketIcon size={16} color="#ff6b35" style={{ marginRight: 6 }} /> Active Missions <strong>4</strong></div>
        <div><ChartIcon size={16} color="#60a5fa" style={{ marginRight: 6 }} /> Data Streams <strong>128</strong></div>
        <div><InfoIcon size={16} color="#22d3ee" style={{ marginRight: 6 }} /> Uptime <strong>99.98%</strong></div>
      </footer>
    </div>
  );
}

export default DashboardTab;