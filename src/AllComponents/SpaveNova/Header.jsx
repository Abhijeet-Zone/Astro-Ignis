import React from 'react';
import { RocketIcon } from '../Icons';

function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', name: 'Live Dashboard' },
    { id: 'solar-system', name: '3D Solar System' },
    { id: 'voice-ai', name: 'Voice Assistant' },
    { id: 'chat', name: 'AI Chat' },
    { id: 'data-viz', name: 'Data Analytics' },
    { id: 'gallery', name: 'Space Gallery' },
  ];

  return (
    <header className="spnova-header-shell">
      <div className="spnova-brand-row">
        <div className="spnova-logo"><RocketIcon size={22} color="#2ec7ff" /> Space NOVA</div>
        <p className="spnova-tagline">Interactive AI Platform for Aerospace Engineering & Space Exploration</p>
      </div>

      <div className="spnova-nav-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`spnova-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </header>
  );
}

export default Header;