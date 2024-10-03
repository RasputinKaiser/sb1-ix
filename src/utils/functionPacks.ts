import { logger } from './logger';
import { functionRegistry, RegisteredFunction } from './functionRegistry';

export interface FunctionPack {
  name: string;
  functions: Record<string, Function>;
  description?: string;
}

export function loadFunctionPack(pack: FunctionPack) {
  logger.info(`Loading function pack: ${pack.name}`);
  Object.entries(pack.functions).forEach(([name, func]) => {
    functionRegistry.register(name, func, { metadata: { pack: pack.name } });
  });
  logger.info(`Function pack ${pack.name} loaded successfully`);
}

export function loadAllFunctionPacks(packs: FunctionPack[]) {
  packs.forEach(loadFunctionPack);
}

export function getFunctionDocumentation(func: Function): string {
  return func.toString();
}

export function getAllFunctionDocs(): Record<string, string> {
  const docs: Record<string, string> = {};
  functionRegistry.list().forEach(name => {
    const func = functionRegistry.get(name);
    if (func) {
      docs[name] = getFunctionDocumentation(func.function);
    }
  });
  return docs;
}