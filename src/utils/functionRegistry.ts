import { logger } from './logger';

interface FunctionMetadata {
  imports?: string[];
  dependencies?: string[];
  keyDependencies?: string[];
  metadata?: Record<string, any>;
}

interface RegisteredFunction {
  function: Function;
  metadata: FunctionMetadata;
}

class FunctionRegistry {
  private registry: Map<string, RegisteredFunction> = new Map();

  register(name: string, func: Function, metadata: FunctionMetadata = {}) {
    if (this.registry.has(name)) {
      throw new Error(`Function "${name}" already exists in the registry`);
    }
    this.registry.set(name, { function: func, metadata });
    logger.info(`Function "${name}" registered successfully`);
  }

  get(name: string): RegisteredFunction | undefined {
    return this.registry.get(name);
  }

  execute(name: string, ...args: any[]): any {
    const registeredFunc = this.registry.get(name);
    if (!registeredFunc) {
      const error = `Function "${name}" not found in registry`;
      logger.error(error);
      throw new Error(error);
    }
    try {
      logger.info(`Executing function "${name}"`);
      const result = registeredFunc.function(...args);
      logger.info(`Function "${name}" executed successfully`);
      return result;
    } catch (error) {
      logger.error(`Error executing function "${name}": ${error}`);
      throw error;
    }
  }

  list(): string[] {
    return Array.from(this.registry.keys());
  }
}

export const functionRegistry = new FunctionRegistry();

export function registerFunction(metadata: FunctionMetadata = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    functionRegistry.register(propertyKey, descriptor.value, metadata);
    return descriptor;
  };
}