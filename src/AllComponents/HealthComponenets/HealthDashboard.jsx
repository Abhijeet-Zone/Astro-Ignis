import React from "react";
import healthData from "./health.js";
import "./HealthDashboard.css";
import { 
  RocketIcon, 
  TargetIcon, 
  FlaskIcon, 
  AstronautIcon,
  CheckCircleIcon
} from "../Icons";

// Let's create some inline SVG icons for the specific health problem icons shown in the UI
const MuscleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d946ef" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.933 13.067C11.933 13.067 12 16 14 16C16 16 16 13 16 13C16 11 14 9 12 9C10 9 8 11 8 13C8 13 8 16 10 16C12 16 12.067 13.067 12.067 13.067Z"/><path d="M12 9C12 9 10.5 4.5 14.5 3C14.5 3 17.5 5 16 9"/><path d="M12 9C12 9 13.5 4.5 9.5 3C9.5 3 6.5 5 8 9"/></svg>
);

const BoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 15l2 2a2.828 2.828 0 1 0-4-4l-2-2"/><path d="M9 9L7 7a2.828 2.828 0 1 0 4 4l2 2"/><path d="M14 10l-4 4"/></svg>
);

const FluidIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);

const ShieldHealthIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>
);

const RadiationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"/><path d="M12 7V2"/><path d="M12 22v-5"/><path d="M7.67 9.5l-4.33-2.5"/><path d="M20.66 17l-4.33-2.5"/><path d="M16.33 9.5l4.33-2.5"/><path d="M3.34 17l4.33-2.5"/></svg>
);

const CellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="4" y1="12" x2="20" y2="12"/></svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/><path d="M16 4h2M17 3v2"/></svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
);


function HealthDashboard() {
  // Mapping problem text to specific icons for the table
  const getProblemIcon = (problemText) => {
    if (problemText.includes("Muscle")) return <div className="icon-wrap muscle-icon"><MuscleIcon /></div>;
    if (problemText.includes("Bone")) return <div className="icon-wrap bone-icon"><BoneIcon /></div>;
    if (problemText.includes("Fluids")) return <div className="icon-wrap fluid-icon"><FluidIcon /></div>;
    if (problemText.includes("Vision")) return <div className="icon-wrap eye-icon"><EyeIcon /></div>;
    if (problemText.includes("Immune")) return <div className="icon-wrap shield-icon"><ShieldHealthIcon /></div>;
    if (problemText.includes("Radiation")) return <div className="icon-wrap radiation-icon"><RadiationIcon /></div>;
    if (problemText.includes("Motion Sickness")) return <div className="icon-wrap cell-icon"><CellIcon /></div>;
    if (problemText.includes("Sleep")) return <div className="icon-wrap moon-icon"><MoonIcon /></div>;
    return <div className="icon-wrap default-icon"><TargetIcon color="#cbd5e1" /></div>;
  };

  // Extract clean status text
  const renderStatusPill = (statusText) => {
    const isResearch = statusText.toLowerCase().includes("research");
    return (
      <div className={`status-pill ${isResearch ? 'status-research' : 'status-active'}`}>
        <span className="status-indicator-icon">{isResearch ? <FlaskIcon size={14} /> : <CheckCircleIcon size={14} />}</span>
        {isResearch ? "Research" : "Active"}
      </div>
    );
  };

  return (
    <div className="health-dashboard-wrapper">
      {/* Hero Section */}
      <div className="health-hero">
        <div className="health-hero-content">
          <div className="hero-text-area">
            <h1>Astronaut <span className="text-highlight">Health</span></h1>
            <p>Advanced health monitoring & AI-powered solutions<br/>for peak astronaut performance.</p>
          </div>
        </div>
        <div className="hero-bg-overlay"></div>
      </div>

      {/* Main Content Area */}
      <div className="health-main-panel">
        <div className="panel-header">
          <div className="panel-title">
            <RocketIcon size={22} color="#60a5fa" />
            <h2>Astronaut Health & Solutions</h2>
          </div>
          
          <div className="panel-actions">
            <div className="search-bar">
              <SearchIcon />
              <input type="text" placeholder="Search problem or solution..." />
            </div>
            <button className="filter-btn">
              <FilterIcon />
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="health-table">
            <thead>
              <tr>
                <th>
                  <div className="th-content">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    Health Problem
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                    Health Solution
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Status
                  </div>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {healthData.map((item, index) => (
                <tr key={index}>
                  <td className="problem-cell">
                    {getProblemIcon(item.problem)}
                    <span className="problem-text">{item.problem}</span>
                  </td>
                  <td className="solution-cell">{item.aiSolution}</td>
                  <td className="status-cell">
                    {renderStatusPill(item.status)}
                  </td>
                  <td className="action-cell">
                    <button className="row-action-btn">
                      <ChevronRightIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Summary Bar */}
        <div className="summary-bar">
          <div className="summary-card active-control">
            <div className="summary-icon">
              <ShieldHealthIcon />
            </div>
            <div className="summary-number">4</div>
            <div className="summary-text">
              <div className="sum-title">Active</div>
              <div className="sum-sub">Under Control</div>
            </div>
          </div>
          
          <div className="summary-card research-progress">
            <div className="summary-icon">
              <FlaskIcon size={24} color="#f59e0b" />
            </div>
            <div className="summary-number">4</div>
            <div className="summary-text">
              <div className="sum-title">Research</div>
              <div className="sum-sub">In Progress</div>
            </div>
          </div>
          
          <div className="summary-card total-issues">
            <div className="summary-icon" style={{color: '#60a5fa'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <div className="summary-number" style={{color: '#60a5fa'}}>8</div>
            <div className="summary-text">
              <div className="sum-title">Total Issues</div>
              <div className="sum-sub">Monitored</div>
            </div>
          </div>
          
          <div className="summary-card mission-focus">
            <div className="summary-icon">
              <AstronautIcon size={24} color="#a855f7" />
            </div>
            <div className="summary-number" style={{color: '#a855f7'}}>100<span className="percent">%</span></div>
            <div className="summary-text">
              <div className="sum-title">Mission</div>
              <div className="sum-sub">Health Focus</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthDashboard;