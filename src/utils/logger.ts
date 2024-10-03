export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

class Logger {
  private logs: string[] = [];

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  log(level: LogLevel, message: string) {
    const timestamp = this.getTimestamp();
    const logEntry = `[${timestamp}] ${level}: ${message}`;
    this.logs.push(logEntry);
    console.log(logEntry);
  }

  info(message: string) {
    this.log(LogLevel.INFO, message);
  }

  warn(message: string) {
    this.log(LogLevel.WARN, message);
  }

  error(message: string) {
    this.log(LogLevel.ERROR, message);
  }

  getLogs() {
    return this.logs;
  }
}

export const logger = new Logger();