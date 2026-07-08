import React, { useState } from "react";
import HealthDashboard from "./HealthDashboard.jsx";
import HealthChatbot from "./HealthChatbot.jsx";
import EyeScanner from "./EyeScanner.jsx";
import "./HealthComponent.css"
import { StethoscopeIcon, ChartIcon, RobotIcon, EyeIcon } from "../Icons";

function HealthComponent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="health-shell App w-screen min-h-screen">
      <div className="health-shell-inner w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full ">
        <header className="health-top-nav">
          <div className="health-mini-brand">
            <StethoscopeIcon size={22} />
            <span>Astronaut Health</span>
          </div>
          <nav className="nav-tabs text-white gap-x-10 ">
            <button 

              className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''} mr-10`}
              onClick={() => setActiveTab('dashboard')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ChartIcon size={14} /> Health Data</div>
            </button>
            <button 
              className={`nav-tab ${activeTab === 'chatbot' ? 'active' : ''} mr-10`}
              onClick={() => setActiveTab('chatbot')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RobotIcon size={14} /> AI Assistant</div>
            </button>
            <button 
              className={`nav-tab ${activeTab === 'eyescanner' ? 'active' : ''}`}
              onClick={() => setActiveTab('eyescanner')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><EyeIcon size={14} /> Eye Scanner</div>
            </button>
          </nav>
        </header>
        
        <main className="main-content text-white">
          {activeTab === 'dashboard' && <HealthDashboard />}
          {activeTab === 'chatbot' && <HealthChatbot />}
          {activeTab === 'eyescanner' && <EyeScanner />}
        </main>
      </div>
    </div>
  );
}

export default HealthComponent;
