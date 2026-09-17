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
  const isDarkBg = textColor.includes('text-zinc-900 dark:text-white') || textColor.includes('text-neutral-100') || textColor.includes('text-zinc-600 dark:text-neutral-400');
  
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

  const lightLogoUrl = 'https://i.imgur.com/iDzNCWJ.png'; // Logo with dark text for light mode
  const darkLogoUrl = 'https://i.imgur.com/OX24qjP.png'; // Logo with white text for dark mode

  // If a specific variant is forced, render only that variant
  if (variant === 'light' || variant === 'dark') {
    const url = variant === 'light' ? lightLogoUrl : darkLogoUrl;
    return (
      <div className={`flex items-center ${className}`}>
        <img
          src={url}
          alt="UmbuLab Logo"
          style={{ height: variant === 'dark' ? iconSize * 1.25 : iconSize }}
          className="object-contain max-w-full"
        />
      </div>
    );
  }

  // Otherwise, use CSS to switch between light and dark logos automatically
  return (
    <div className={`flex items-center ${className}`}>
      {/* Light mode logo (hidden in dark mode) */}
      <img
        src={lightLogoUrl}
        alt="UmbuLab Logo"
        style={{ height: iconSize }}
        className="object-contain max-w-full block dark:hidden"
      />
      {/* Dark mode logo (hidden in light mode) */}
      <img
        src={darkLogoUrl}
        alt="UmbuLab Logo"
        style={{ height: iconSize * 1.25 }}
        className="object-contain max-w-full hidden dark:block"
      />
    </div>
  );
}
