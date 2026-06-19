import React from 'react';
import { round } from '../utils/math.js';

const Display = ({ value }) => {
  return (
    <div className="display">
      <p>{round(value, 2)}</p>
    </div>
  );
};

export default Display;
