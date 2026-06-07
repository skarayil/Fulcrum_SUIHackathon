import React from 'react';

interface FulcrumLogoProps {
  className?: string;
  size?: number;
}

export const FulcrumLogo: React.FC<FulcrumLogoProps> = ({ 
  className = "", 
  size = 32 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 80 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main horizontal bar */}
      <rect x="12" y="32" width="56" height="10" rx="5" fill="url(#mainGradient)" />
      
      {/* Left pointed end - top */}
      <path
        d="M12 32 L24 32 L18 18 Z"
        fill="url(#sideGradient)"
      />
      {/* Left pointed end - bottom */}
      <path
        d="M12 42 L24 42 L18 56 Z"
        fill="url(#sideGradient)"
      />
      
      {/* Right pointed end - top */}
      <path
        d="M68 32 L56 32 L62 18 Z"
        fill="url(#sideGradient)"
      />
      {/* Right pointed end - bottom */}
      <path
        d="M68 42 L56 42 L62 56 Z"
        fill="url(#sideGradient)"
      />
      
      {/* Center fulcrum triangle pointing down */}
      <path
        d="M40 42 L32 62 L48 62 Z"
        fill="url(#centerGradient)"
      />
      
      {/* Highlight on top of bar */}
      <rect x="16" y="33" width="48" height="3" fill="url(#highlightGradient)" opacity="0.6" rx="1.5" />
      
      <defs>
        <linearGradient id="mainGradient" x1="0" y1="0" x2="80" y2="0">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="sideGradient" x1="0" y1="0" x2="80" y2="0">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="centerGradient" x1="32" y1="42" x2="48" y2="62">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="highlightGradient" x1="0" y1="0" x2="80" y2="0">
          <stop offset="0%" stopColor="#bfdbfe" />
          <stop offset="50%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#bfdbfe" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default FulcrumLogo;
