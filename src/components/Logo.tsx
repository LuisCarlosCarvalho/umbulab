import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  textColor?: string;
  iconSize?: number;
  variant?: 'light' | 'dark' | 'icon';
}

export function Logo({ 
  className = '', 
  showText = true, 
  textColor = 'text-neutral-900', 
  iconSize = 36,
  variant
}: LogoProps) {
  // Check if we are on a dark background based on text color class
  const isDarkBg = textColor.includes('text-white') || textColor.includes('text-neutral-100') || textColor.includes('text-neutral-400');
  
  if (!showText || variant === 'icon') {
    return (
      <img
        src="https://i.imgur.com/u9a6dfQ.png"
        alt="UmbuLab Icon"
        style={{ width: iconSize, height: iconSize }}
        className={`object-contain transition-transform duration-500 hover:rotate-12 cursor-pointer ${className}`}
      />
    );
  }

  // Selected logo URL based on variant or background light/dark context
  const selectedLogoUrl = variant === 'light'
    ? 'https://i.imgur.com/iDzNCWJ.png'
    : variant === 'dark'
    ? 'https://i.imgur.com/OX24qjP.png'
    : isDarkBg
    ? 'https://i.imgur.com/OX24qjP.png'
    : 'https://i.imgur.com/iDzNCWJ.png';

  // The full logo images already include the icon + "UmbuLab" text.
  // We scale the height of the image based on iconSize (e.g. 36px in navbar or 80px in maintenance).
  // The width adjusts automatically to maintain the correct aspect ratio.
  const logoHeight = iconSize;
  
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={selectedLogoUrl}
        alt="UmbuLab Logo"
        style={{ height: logoHeight }}
        className="object-contain max-w-full"
      />
    </div>
  );
}
