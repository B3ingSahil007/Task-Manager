import React from 'react';

const Badge = ({ color, size = '12px' }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        display: 'inline-block',
      }}
    ></div>
  );
};

export default Badge;
