import React, { useState } from 'react';
import { functionRegistry } from '../utils/functionRegistry';
import { logger } from '../utils/logger';

const FunctionExecutor: React.FC = () => {
  const [functionName, setFunctionName] = useState('');
  const [args, setArgs] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const parseArguments = (argsString: string): any[] => {
    try {
      // Use Function constructor to create a safe evaluation environment
      const parseFunc = new Function(`return [${argsString}]`);
      return parseFunc();
    } catch (err) {
      throw new Error(`Invalid argument format: ${(err as Error).message}`);
    }
  };

  const handleExecute = async () => {
    setError(null);
    setResult(null);

    if (!functionName) {
      setError("Please enter a function name.");
      return;
    }

    try {
      const parsedArgs = parseArguments(args);
      const output = await functionRegistry.execute(functionName, ...parsedArgs);
      setResult(output);
      logger.info(`Function "${functionName}" executed successfully with result: ${JSON.stringify(output)}`);
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      logger.error(`Error executing function "${functionName}": ${errorMessage}`);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Function Executor</h2>
      <div className="mb-4">
        <input
          type="text"
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value)}
          placeholder="Function name"
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          value={args}
          onChange={(e) => setArgs(e.target.value)}
          placeholder="Arguments (comma-separated, use proper JSON for objects and arrays)"
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleExecute}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Execute
        </button>
      </div>
      {error && <div className="mt-4 text-red-500">{error}</div>}
      {result !== null && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Result:</h3>
          <pre className="bg-gray-100 p-2 rounded mt-2">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FunctionExecutor;