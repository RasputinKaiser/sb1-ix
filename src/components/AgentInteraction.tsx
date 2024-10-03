import React, { useState, useEffect } from 'react';
import { uiAgent } from '../agents/agentFramework';

const AgentInteraction: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [output, setOutput] = useState('');
  const [agentLogs, setAgentLogs] = useState<{ [key: string]: string[] }>({});
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [showThoughtProcesses, setShowThoughtProcesses] = useState(false);
  const [executionSteps, setExecutionSteps] = useState<string[]>([]);

  useEffect(() => {
    const originalConsoleLog = console.log;
    console.log = (message: string) => {
      originalConsoleLog(message);
      if (message.includes('thinks:')) {
        const [agentName, thought] = message.split(' thinks: ');
        setAgentLogs(prevLogs => ({
          ...prevLogs,
          [agentName]: [...(prevLogs[agentName] || []), thought]
        }));
        setExecutionSteps(prevSteps => [...prevSteps, message]);
      } else if (message.startsWith('Output:')) {
        setOutput(message.slice(8));
      }
    };

    return () => {
      console.log = originalConsoleLog;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOutput('Processing...');
    setAgentLogs({ 'User Input': [`User Input: ${userInput}`] });
    setExecutionSteps([`User Input: ${userInput}`]);
    uiAgent.processUserInput(userInput);
    setUserInput('');
  };

  const toggleThoughtProcesses = () => {
    setShowThoughtProcesses(!showThoughtProcesses);
  };

  const handleAgentSelect = (agentName: string) => {
    setSelectedAgent(agentName === selectedAgent ? null : agentName);
  };

  return (
    <div className="mb-8 p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Agent Interaction</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter a command (e.g., 'List files in /home/project')"
          className="w-full p-2 border rounded mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
      {output && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Output:</h3>
          <p className="bg-gray-100 p-2 rounded mt-2">{output}</p>
        </div>
      )}
      <div className="mt-4">
        <button
          onClick={toggleThoughtProcesses}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {showThoughtProcesses ? 'Hide' : 'Show'} Agents' Thought Processes
        </button>
      </div>
      {showThoughtProcesses && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Execution Steps:</h3>
          <div className="bg-gray-100 p-2 rounded mt-2 max-h-60 overflow-y-auto">
            {executionSteps.map((step, index) => (
              <p key={index} className="mb-1">{step}</p>
            ))}
          </div>
          <h3 className="text-xl font-semibold mt-4">Agent Logs:</h3>
          <div className="flex flex-wrap mt-2">
            {Object.keys(agentLogs).map((agentName) => (
              <button
                key={agentName}
                onClick={() => handleAgentSelect(agentName)}
                className={`mr-2 mb-2 px-3 py-1 rounded ${
                  selectedAgent === agentName ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                {agentName}
              </button>
            ))}
          </div>
          <div className="bg-gray-100 p-2 rounded mt-2 max-h-60 overflow-y-auto">
            {selectedAgent
              ? agentLogs[selectedAgent]?.map((log, index) => (
                  <p key={index} className="mb-1">{log}</p>
                ))
              : Object.entries(agentLogs).map(([agentName, logs]) => (
                  <div key={agentName}>
                    <h4 className="font-semibold mt-2">{agentName}</h4>
                    {logs.map((log, index) => (
                      <p key={index} className="mb-1">{log}</p>
                    ))}
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentInteraction;