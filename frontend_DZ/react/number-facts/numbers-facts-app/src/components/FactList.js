import React from 'react';

const FactList = ({ facts }) => (
  <ul className="space-y-2">
    {facts.map((fact, index) => (
      <li key={index} className="p-2 bg-gray-100 rounded">{fact}</li>
    ))}
  </ul>
);

export default FactList;