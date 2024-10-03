import React, { useState, useEffect } from 'react'
import { fetchLogs } from '../services/logService'

const ExecutionLogs: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const updateLogs = async () => {
      try {
        const fetchedLogs = await fetchLogs()
        setLogs(fetchedLogs)
        setError(null)
      } catch (err) {
        setError(`Failed to fetch logs: ${(err as Error).message}`)
      }
    }

    updateLogs()
    const intervalId = setInterval(updateLogs, 5000) // Update logs every 5 seconds

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="mb-8 p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Execution Logs</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
        {logs.map((log, index) => (
          <div key={index} className="mb-2 font-mono text-sm">
            {log}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExecutionLogs