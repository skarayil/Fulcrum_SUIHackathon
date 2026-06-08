import React from 'react';

interface FulcrumLogoProps {
  className?: string;
  size?: number;
}

export const FulcrumLogo: React.FC<FulcrumLogoProps> = ({ 
  className = "", 
  size = 50 
}) => {
  return (
    <img 
      src={`${import.meta.env.BASE_URL}logo.png`} 
      alt="Fulcrum Logo"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain', borderRadius: '20%' }}
    />
  );
};

export default FulcrumLogo;
