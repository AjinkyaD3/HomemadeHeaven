import React from 'react';

interface AvatarProps {
  className?: string;
  src?: string;
  alt?: string;
  fallback?: string;
}

const Avatar: React.FC<AvatarProps> = ({ className = '', src, alt, fallback }) => {
  return (
    <div className={`relative w-10 h-10 rounded-full overflow-hidden ${className}`}>
      {src ? (
        <img 
          src={src} 
          alt={alt || 'Avatar'} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600">
          {fallback || '?'}
        </div>
      )}
    </div>
  );
};

interface AvatarImageProps {
  className?: string;
  src?: string;
  alt?: string;
}

const AvatarImage: React.FC<AvatarImageProps> = ({ className = '', src, alt }) => {
  if (!src) return null;
  return (
    <img 
      src={src} 
      alt={alt || 'Avatar'} 
      className={`aspect-square h-full w-full ${className}`}
    />
  );
};

interface AvatarFallbackProps {
  children: React.ReactNode;
  className?: string;
}

const AvatarFallback: React.FC<AvatarFallbackProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600 ${className}`}
    >
      {children}
    </div>
  );
};

export { Avatar, AvatarImage, AvatarFallback };
