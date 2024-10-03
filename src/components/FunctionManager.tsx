import React, { useState } from 'react'
import { functionRegistry } from '../utils/functionRegistry'
import { safeExec } from '../utils/safeExecution'

const FunctionManager: React.FC = () => {
  const [newFunction, setNewFunction] = useState('')
  const [functionName, setFunctionName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleAddFunction = () => {
    setError(null)
    setSuccess(null)

    if (!functionName.trim()) {
      setError('Please enter a function name.')
      return
    }

    if (!newFunction.trim()) {
      setError('Please enter the function code.')
      return
    }

    try {
      const func = safeExec(`return ${newFunction}`)
      if (typeof func !== 'function') {
        throw new Error('Invalid function definition')
      }
      functionRegistry.register(functionName, func)
      setSuccess(`Function "${functionName}" added successfully!`)
      setNewFunction('')
      setFunctionName('')
    } catch (err) {
      setError(`Error adding function: ${(err as Error).message}`)
    }
  }

  return (
    <div className="mb-8 p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Function Management</h2>
      <div className="mb-4">
        <input
          type="text"
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value)}
          placeholder="Function name"
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          value={newFunction}
          onChange={(e) => setNewFunction(e.target.value)}
          placeholder="Function code"
          className="w-full p-2 border rounded mb-2"
          rows={5}
        />
        <button
          onClick={handleAddFunction}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Function
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
      <div>
        <h3 className="text-xl font-semibold mb-2">Registered Functions:</h3>
        <ul className="list-disc pl-5">
          {functionRegistry.list().map((funcName) => (
            <li key={funcName}>{funcName}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default FunctionManager