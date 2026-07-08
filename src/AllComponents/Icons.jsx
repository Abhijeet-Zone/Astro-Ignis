// src/AllComponents/Icons.jsx
// Centralized SVG icon library for Astro-Ignis — replaces all emoji usage
import React from 'react';

// ── Utility wrapper ────────────────────────────────────────────────
const Ic = ({ children, size = 24, color = 'currentColor', className = '', style = {}, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    {...rest}
  >
    {children}
  </svg>
);

// ── Rocket ─────────────────────────────────────────────────────────
export const RocketIcon = (props) => (
  <Ic {...props}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" fill="rgba(255,107,53,0.2)" stroke={props.color || '#ff6b35'} />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" stroke={props.color || '#ff6b35'} />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" stroke={props.color || '#ff6b35'} />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" stroke={props.color || '#ff6b35'} />
  </Ic>
);

// ── Brain / Psychological ──────────────────────────────────────────
export const BrainIcon = (props) => (
  <Ic {...props}>
    <path d="M9.5 2a3.5 3.5 0 0 0-3 5.14A3.5 3.5 0 0 0 5 14.5 3.5 3.5 0 0 0 8.5 18h.5v4h6v-4h.5a3.5 3.5 0 0 0 3.5-3.5 3.5 3.5 0 0 0-1.5-7.36A3.5 3.5 0 0 0 14.5 2z" stroke={props.color || '#00d4ff'} fill="rgba(0,212,255,0.1)" />
    <path d="M12 2v20" stroke={props.color || '#00d4ff'} strokeDasharray="2 2" opacity="0.5" />
  </Ic>
);

// ── Satellite / Communication ──────────────────────────────────────
export const SatelliteIcon = (props) => (
  <Ic {...props}>
    <path d="M13 7L9 3 5 7l4 4" stroke={props.color || '#22d3ee'} />
    <path d="M17 11l4-4-4-4-4 4" stroke={props.color || '#22d3ee'} />
    <path d="M8 12l4 4 6-6" stroke={props.color || '#22d3ee'} />
    <path d="M2 22l6-6" stroke={props.color || '#22d3ee'} />
    <circle cx="2" cy="22" r="1" fill={props.color || '#22d3ee'} stroke="none" />
  </Ic>
);

// ── Stethoscope / Health ───────────────────────────────────────────
export const StethoscopeIcon = (props) => (
  <Ic {...props}>
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" stroke={props.color || '#f87171'} />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" stroke={props.color || '#f87171'} />
    <circle cx="20" cy="10" r="2" stroke={props.color || '#f87171'} fill="rgba(248,113,113,0.15)" />
  </Ic>
);

// ── Eye / Scanner ─────────────────────────────────────────────
export const EyeIcon = (props) => (
  <Ic {...props}>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke={props.color || '#60a5fa'} />
    <circle cx="12" cy="12" r="3" stroke={props.color || '#60a5fa'} fill="rgba(96,165,250,0.12)" />
  </Ic>
);

// ── Astronaut ─────────────────────────────────────────────────────
export const AstronautIcon = (props) => (
  <Ic {...props}>
    <circle cx="12" cy="8" r="5" stroke={props.color || '#a5f3fc'} fill="rgba(165,243,252,0.08)" />
    <path d="M12 3a2.5 2.5 0 0 1 2.5 2.5V8a2.5 2.5 0 0 1-5 0V5.5A2.5 2.5 0 0 1 12 3z" stroke={props.color || '#a5f3fc'} fill="rgba(165,243,252,0.12)" />
    <path d="M5 21v-2a7 7 0 0 1 14 0v2" stroke={props.color || '#a5f3fc'} />
    <rect x="7" y="13" width="10" height="5" rx="2" stroke={props.color || '#a5f3fc'} fill="rgba(165,243,252,0.06)" />
  </Ic>
);

// ── Sleep / Fatigue / ZZZ ─────────────────────────────────────────
export const SleepIcon = (props) => (
  <Ic {...props}>
    <path d="M2 4h6l-6 6h6" stroke={props.color || '#fbbf24'} />
    <path d="M14 8h4l-4 4h4" stroke={props.color || '#fbbf24'} />
    <path d="M17 2h3l-3 3h3" stroke={props.color || '#fbbf24'} opacity="0.6" />
  </Ic>
);

// ── Equipment / Wrench ────────────────────────────────────────────
export const EquipmentIcon = (props) => (
  <Ic {...props}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke={props.color || '#fb923c'} fill="rgba(251,146,60,0.08)" />
  </Ic>
);

// ── Space Station / ISS ───────────────────────────────────────────
export const SpaceStationIcon = (props) => (
  <Ic {...props}>
    <rect x="8" y="9" width="8" height="6" rx="1" stroke={props.color || '#67e8f9'} fill="rgba(103,232,249,0.08)" />
    <line x1="2" y1="12" x2="8" y2="12" stroke={props.color || '#67e8f9'} />
    <line x1="16" y1="12" x2="22" y2="12" stroke={props.color || '#67e8f9'} />
    <rect x="1" y="10" width="3" height="4" rx="0.5" stroke={props.color || '#67e8f9'} fill="rgba(103,232,249,0.1)" />
    <rect x="20" y="10" width="3" height="4" rx="0.5" stroke={props.color || '#67e8f9'} fill="rgba(103,232,249,0.1)" />
    <line x1="12" y1="6" x2="12" y2="9" stroke={props.color || '#67e8f9'} />
    <line x1="12" y1="15" x2="12" y2="18" stroke={props.color || '#67e8f9'} />
  </Ic>
);

// ── Sun / Solar ──────────────────────────────────────────────────
export const SunIcon = (props) => (
  <Ic {...props}>
    <circle cx="12" cy="12" r="4" stroke={props.color || '#fbbf24'} fill="rgba(251,191,36,0.15)" />
    <line x1="12" y1="2" x2="12" y2="4" stroke={props.color || '#fbbf24'} />
    <line x1="12" y1="20" x2="12" y2="22" stroke={props.color || '#fbbf24'} />
    <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" stroke={props.color || '#fbbf24'} />
    <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" stroke={props.color || '#fbbf24'} />
    <line x1="2" y1="12" x2="4" y2="12" stroke={props.color || '#fbbf24'} />
    <line x1="20" y1="12" x2="22" y2="12" stroke={props.color || '#fbbf24'} />
    <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" stroke={props.color || '#fbbf24'} />
    <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" stroke={props.color || '#fbbf24'} />
  </Ic>
);

// ── Globe / Earth ─────────────────────────────────────────────────
export const GlobeIcon = (props) => (
  <Ic {...props}>
    <circle cx="12" cy="12" r="10" stroke={props.color || '#34d399'} fill="rgba(52,211,153,0.08)" />
    <line x1="2" y1="12" x2="22" y2="12" stroke={props.color || '#34d399'} />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={props.color || '#34d399'} />
  </Ic>
);

// ── Clock ─────────────────────────────────────────────────────────
export const ClockIcon = (props) => (
  <Ic {...props}>
    <circle cx="12" cy="12" r="10" stroke={props.color || '#a78bfa'} fill="rgba(167,139,250,0.08)" />
    <polyline points="12 6 12 12 16 14" stroke={props.color || '#a78bfa'} />
  </Ic>
);

// ── Chart / Bar Chart ─────────────────────────────────────────────
export const ChartIcon = (props) => (
  <Ic {...props}>
    <line x1="18" y1="20" x2="18" y2="10" stroke={props.color || '#60a5fa'} />
    <line x1="12" y1="20" x2="12" y2="4" stroke={props.color || '#60a5fa'} />
    <line x1="6" y1="20" x2="6" y2="14" stroke={props.color || '#60a5fa'} />
    <line x1="2" y1="20" x2="22" y2="20" stroke={props.color || '#60a5fa'} opacity="0.4" />
  </Ic>
);

// ── Clipboard / Reports ───────────────────────────────────────────
export const ClipboardIcon = (props) => (
  <Ic {...props}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke={props.color || '#94a3b8'} />
    <rect x="8" y="2" width="8" height="4" rx="1" stroke={props.color || '#94a3b8'} fill="rgba(148,163,184,0.1)" />
    <line x1="9" y1="12" x2="15" y2="12" stroke={props.color || '#94a3b8'} />
    <line x1="9" y1="16" x2="15" y2="16" stroke={props.color || '#94a3b8'} />
  </Ic>
);

// ── Check Circle ──────────────────────────────────────────────────
export const CheckCircleIcon = (props) => (
  <Ic {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke={props.color || '#22c55e'} />
    <polyline points="22 4 12 14.01 9 11.01" stroke={props.color || '#22c55e'} />
  </Ic>
);

// ── Warning Triangle ──────────────────────────────────────────────
export const WarningIcon = (props) => (
  <Ic {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={props.color || '#f59e0b'} fill="rgba(245,158,11,0.08)" />
    <line x1="12" y1="9" x2="12" y2="13" stroke={props.color || '#f59e0b'} />
    <circle cx="12" cy="16" r="0.5" fill={props.color || '#f59e0b'} stroke="none" />
  </Ic>
);

// ── Alert / Siren ─────────────────────────────────────────────────
export const AlertIcon = (props) => (
  <Ic {...props}>
    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke={props.color || '#ef4444'} fill="rgba(239,68,68,0.1)" />
    <path d="M2 17l10 5 10-5" stroke={props.color || '#ef4444'} />
    <path d="M2 12l10 5 10-5" stroke={props.color || '#ef4444'} />
  </Ic>
);

// ── Lightbulb / Idea ──────────────────────────────────────────────
export const LightbulbIcon = (props) => (
  <Ic {...props}>
    <path d="M9 18h6" stroke={props.color || '#fbbf24'} />
    <path d="M10 22h4" stroke={props.color || '#fbbf24'} />
    <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" stroke={props.color || '#fbbf24'} fill="rgba(251,191,36,0.08)" />
  </Ic>
);

// ── Smile / Happy ─────────────────────────────────────────────────
export const SmileIcon = (props) => (
  <Ic {...props}>
    <circle cx="12" cy="12" r="10" stroke={props.color || '#34d399'} fill="rgba(52,211,153,0.06)" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke={props.color || '#34d399'} />
    <line x1="9" y1="9" x2="9.01" y2="9" stroke={props.color || '#34d399'} strokeWidth="2" />
    <line x1="15" y1="9" x2="15.01" y2="9" stroke={props.color || '#34d399'} strokeWidth="2" />
  </Ic>
);

// ── VR Goggles ────────────────────────────────────────────────────
export const VRGogglesIcon = (props) => (
  <Ic {...props}>
    <rect x="2" y="7" width="20" height="10" rx="3" stroke={props.color || '#8b5cf6'} fill="rgba(139,92,246,0.08)" />
    <path d="M10 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke={props.color || '#8b5cf6'} fill="rgba(139,92,246,0.15)" />
    <path d="M18 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke={props.color || '#8b5cf6'} fill="rgba(139,92,246,0.15)" />
    <path d="M10 12h4" stroke={props.color || '#8b5cf6'} />
  </Ic>
);

// ── Meditation / Lotus ────────────────────────────────────────────
export const MeditationIcon = (props) => (
  <Ic {...props}>
    <path d="M12 21C7 17 4 13 4 9a8 8 0 0 1 16 0c0 4-3 8-8 12z" stroke={props.color || '#c084fc'} fill="rgba(192,132,252,0.08)" />
    <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke={props.color || '#c084fc'} fill="rgba(192,132,252,0.12)" />
  </Ic>
);

// ── Tree / Nature ─────────────────────────────────────────────────
export const TreeIcon = (props) => (
  <Ic {...props}>
    <path d="M12 22v-6" stroke={props.color || '#34d399'} />
    <path d="M12 2l-5 8h3l-4 6h12l-4-6h3L12 2z" stroke={props.color || '#34d399'} fill="rgba(52,211,153,0.1)" />
  </Ic>
);

// ── Family / People ───────────────────────────────────────────────
export const FamilyIcon = (props) => (
  <Ic {...props}>
    <circle cx="8" cy="5" r="2" stroke={props.color || '#60a5fa'} />
    <circle cx="16" cy="5" r="2" stroke={props.color || '#60a5fa'} />
    <circle cx="12" cy="8" r="1.5" stroke={props.color || '#60a5fa'} />
    <path d="M5 21v-2a3 3 0 0 1 3-3h1" stroke={props.color || '#60a5fa'} />
    <path d="M19 21v-2a3 3 0 0 0-3-3h-1" stroke={props.color || '#60a5fa'} />
    <path d="M10 21v-3a2 2 0 0 1 4 0v3" stroke={props.color || '#60a5fa'} />
  </Ic>
);

// ── Target / Crosshair ────────────────────────────────────────────
export const TargetIcon = (props) => (
  <Ic {...props}>
    <circle cx="12" cy="12" r="10" stroke={props.color || '#f97316'} opacity="0.3" />
    <circle cx="12" cy="12" r="6" stroke={props.color || '#f97316'} opacity="0.5" />
    <circle cx="12" cy="12" r="2" stroke={props.color || '#f97316'} fill="rgba(249,115,22,0.2)" />
    <line x1="12" y1="2" x2="12" y2="6" stroke={props.color || '#f97316'} />
    <line x1="12" y1="18" x2="12" y2="22" stroke={props.color || '#f97316'} />
    <line x1="2" y1="12" x2="6" y2="12" stroke={props.color || '#f97316'} />
    <line x1="18" y1="12" x2="22" y2="12" stroke={props.color || '#f97316'} />
  </Ic>
);

// ── Galaxy / Space Gallery ────────────────────────────────────────
export const GalaxyIcon = (props) => (
  <Ic {...props}>
    <circle cx="12" cy="12" r="3" stroke={props.color || '#a78bfa'} fill="rgba(167,139,250,0.15)" />
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke={props.color || '#a78bfa'} opacity="0.5" />
    <ellipse cx="12" cy="12" rx="4" ry="10" stroke={props.color || '#a78bfa'} opacity="0.3" transform="rotate(45 12 12)" />
  </Ic>
);

// ── Robot / AI ────────────────────────────────────────────────────
export const RobotIcon = (props) => (
  <Ic {...props}>
    <rect x="5" y="8" width="14" height="10" rx="2" stroke={props.color || '#22d3ee'} fill="rgba(34,211,238,0.06)" />
    <line x1="12" y1="4" x2="12" y2="8" stroke={props.color || '#22d3ee'} />
    <circle cx="12" cy="3" r="1" fill={props.color || '#22d3ee'} stroke="none" />
    <circle cx="9" cy="13" r="1.5" stroke={props.color || '#22d3ee'} fill="rgba(34,211,238,0.15)" />
    <circle cx="15" cy="13" r="1.5" stroke={props.color || '#22d3ee'} fill="rgba(34,211,238,0.15)" />
    <path d="M2 12v2" stroke={props.color || '#22d3ee'} />
    <path d="M22 12v2" stroke={props.color || '#22d3ee'} />
    <path d="M9 16h6" stroke={props.color || '#22d3ee'} />
  </Ic>
);

// ── Flask / Lab ───────────────────────────────────────────────────
export const FlaskIcon = (props) => (
  <Ic {...props}>
    <path d="M9 3h6" stroke={props.color || '#a78bfa'} />
    <path d="M10 3v7.5L4 20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1l-6-9.5V3" stroke={props.color || '#a78bfa'} fill="rgba(167,139,250,0.06)" />
    <path d="M7 17h10" stroke={props.color || '#a78bfa'} opacity="0.4" />
  </Ic>
);

// ── Package / Box ─────────────────────────────────────────────────
export const PackageIcon = (props) => (
  <Ic {...props}>
    <path d="M16.5 9.4l-9-5.2M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke={props.color || '#67e8f9'} fill="rgba(103,232,249,0.06)" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke={props.color || '#67e8f9'} />
    <line x1="12" y1="22.08" x2="12" y2="12" stroke={props.color || '#67e8f9'} />
  </Ic>
);

// ── Cross Circle / Error ──────────────────────────────────────────
export const CrossCircleIcon = (props) => (
  <Ic {...props}>
    <circle cx="12" cy="12" r="10" stroke={props.color || '#ef4444'} fill="rgba(239,68,68,0.06)" />
    <line x1="15" y1="9" x2="9" y2="15" stroke={props.color || '#ef4444'} />
    <line x1="9" y1="9" x2="15" y2="15" stroke={props.color || '#ef4444'} />
  </Ic>
);

// ── Info Circle ───────────────────────────────────────────────────
export const InfoIcon = (props) => (
  <Ic {...props}>
    <circle cx="12" cy="12" r="10" stroke={props.color || '#3b82f6'} fill="rgba(59,130,246,0.06)" />
    <line x1="12" y1="16" x2="12" y2="12" stroke={props.color || '#3b82f6'} />
    <circle cx="12" cy="8" r="0.5" fill={props.color || '#3b82f6'} stroke="none" />
  </Ic>
);

// ── Navigation / Compass ──────────────────────────────────────────
export const CompassIcon = (props) => (
  <Ic {...props}>
    <circle cx="12" cy="12" r="10" stroke={props.color || '#22d3ee'} fill="rgba(34,211,238,0.06)" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" stroke={props.color || '#22d3ee'} fill="rgba(34,211,238,0.15)" />
  </Ic>
);

// ── Send / Arrow ──────────────────────────────────────────────────
export const SendIcon = (props) => (
  <Ic {...props}>
    <line x1="22" y1="2" x2="11" y2="13" stroke={props.color || '#60a5fa'} />
    <polygon points="22 2 15 22 11 13 2 9 22 2" stroke={props.color || '#60a5fa'} fill="rgba(96,165,250,0.08)" />
  </Ic>
);
