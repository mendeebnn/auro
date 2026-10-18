import React, { useState, useEffect } from 'react';

interface AuroLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  inverted?: boolean;
  customSrc?: string;
  forceSvg?: boolean;
}

export const AuroLogo: React.FC<AuroLogoProps> = ({
  className = '',
  size = 'lg',
  inverted = false,
  customSrc,
  forceSvg = false,
}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(() => {
    if (customSrc) return customSrc;
    try {
      return localStorage.getItem('auro_custom_logo') || null;
    } catch {
      return null;
    }
  });

  const [cropFit, setCropFit] = useState<'contain' | 'cover'>('contain');

  useEffect(() => {
    if (customSrc !== undefined) {
      setLogoUrl(customSrc);
      return;
    }

    const updateLogo = () => {
      try {
        const stored = localStorage.getItem('auro_custom_logo');
        const fit = localStorage.getItem('auro_logo_fit') as 'contain' | 'cover';
        setLogoUrl(stored);
        if (fit) setCropFit(fit);
      } catch (err) {
        console.warn('Failed to load logo from localStorage', err);
      }
    };

    updateLogo();
    window.addEventListener('auro_logo_updated', updateLogo);
    window.addEventListener('storage', updateLogo);
    return () => {
      window.removeEventListener('auro_logo_updated', updateLogo);
      window.removeEventListener('storage', updateLogo);
    };
  }, [customSrc]);

  // Dimension mappings calibrated for the crown proportions (400x320)
  const heightClasses = {
    sm: 'h-7 sm:h-8',
    md: 'h-9 sm:h-10',
    lg: 'h-12 sm:h-14 md:h-16', // Desktop header prominent presence
    xl: 'h-18 sm:h-22 md:h-26',
  };

  const textColor = inverted ? '#fcfbfa' : '#141312';

  // If user uploaded a custom logo image file in admin, display it
  if (logoUrl && !forceSvg) {
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        <img
          src={logoUrl}
          alt="AURO Brand Logo"
          referrerPolicy="no-referrer"
          className={`${heightClasses[size]} w-auto max-w-full ${cropFit === 'cover' ? 'object-cover' : 'object-contain'} transition-all`}
          style={{
            filter: inverted ? 'brightness(0) invert(1)' : undefined,
          }}
        />
      </div>
    );
  }

  // Exact authentic vector rendering of the user's uploaded AURO crown logo
  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 400 320"
        className={`${heightClasses[size]} w-auto transition-transform`}
        aria-label="AURO Brand Logo"
        role="img"
      >
        {/* Top Diamond (Rhombus) */}
        <polygon points="200,76 213,101 200,126 187,101" fill={textColor} />
        
        {/* Crown Geometric Ribbon Body */}
        <path
          d="M 200,238 L 76,148 L 120,275 L 200,140 L 280,275 L 324,148 Z"
          fill="none"
          stroke={textColor}
          strokeWidth="25"
          strokeLinejoin="miter"
          strokeMiterlimit="6"
          strokeLinecap="square"
        />
      </svg>
    </div>
  );
};
