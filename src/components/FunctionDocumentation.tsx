import React from 'react';
import { getAllFunctionDocs } from '../utils/functionPacks';

const FunctionDocumentation: React.FC = () => {
  const functionDocs = getAllFunctionDocs();

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Function Documentation</h2>
      <div className="space-y-4">
        {Object.entries(functionDocs).map(([name, doc]) => (
          <div key={name} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{name}</h3>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
              <code>{doc}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunctionDocumentation;