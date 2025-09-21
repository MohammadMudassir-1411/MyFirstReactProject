// src/components/ui/card.js

import React from 'react';
import './card.css'; // Optional for styles (see below)

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white shadow rounded p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`p-2 ${className}`}>
      {children}
    </div>
  );
};
