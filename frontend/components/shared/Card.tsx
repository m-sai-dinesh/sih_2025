
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl shadow-lg p-6 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
