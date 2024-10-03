import React from 'react'
import FunctionExecutor from './FunctionExecutor'
import FunctionManager from './FunctionManager'
import ExecutionLogs from './ExecutionLogs'
import AIFunctionGenerator from './AIFunctionGenerator'
import AgentInteraction from './AgentInteraction'

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">BabyAGI Functionz Improved Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <AgentInteraction />
          <FunctionManager />
          <AIFunctionGenerator />
        </div>
        <div className="space-y-8">
          <FunctionExecutor />
          <ExecutionLogs />
        </div>
      </div>
    </div>
  )
}

export default Dashboard