import { logger } from '../utils/logger'

// This is a mock implementation. Replace with actual API calls in a real backend.
export async function fetchLogs(): Promise<string[]> {
  // Simulating an API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // For now, we're just returning the logs from the logger
  // In a real implementation, this would fetch logs from a backend API
  return logger.getLogs()
}

export async function addLog(message: string, level: 'info' | 'warn' | 'error'): Promise<void> {
  // Simulating an API call
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // Add the log to the logger
  switch (level) {
    case 'info':
      logger.info(message)
      break
    case 'warn':
      logger.warn(message)
      break
    case 'error':
      logger.error(message)
      break
  }
}