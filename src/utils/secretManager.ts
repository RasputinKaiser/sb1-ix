export function getSecret(key: string): string | undefined {
  // In a browser environment, we can't access process.env
  // So we'll use the import.meta.env object provided by Vite
  return import.meta.env[key] as string | undefined;
}

export function setSecret(key: string, value: string): void {
  if (import.meta.env.DEV) {
    console.warn('Setting environment variables at runtime is not supported in Vite. Use .env files instead.');
  }
  // In a production environment, this function would typically interact with a secure secret management system
}