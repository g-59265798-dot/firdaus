import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const SKBatandokLogo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const [useBackup, setUseBackup] = useState(false);
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const primarySrc = '/assets/aistudio/logoo_17fc1615.jpg';
  const backupSrc = '/assets/aistudio/Paste_November_09__2026_-_5_31PM_acb82867';

  const handleError = () => {
    if (!useBackup) {
      setUseBackup(true);
    } else {
      setImageError(true);
    }
  };

  if (imageError) {
    return (
      <div
        className={`${sizeClasses[size]} ${className} rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold shadow-md border-2 border-yellow-400`}
        title="SK Batandok Beaufort"
      >
        <span className="text-[10px] text-center font-mono leading-tight">SKB</span>
      </div>
    );
  }

  return (
    <img
      src={useBackup ? backupSrc : primarySrc}
      alt="Lencana SK Batandok Beaufort (SPAM-Batandok)"
      className={`${sizeClasses[size]} ${className} object-contain rounded-md bg-white p-0.5 shadow-xs`}
      onError={handleError}
    />
  );
};
