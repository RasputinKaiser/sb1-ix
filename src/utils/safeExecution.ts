import * as acorn from 'acorn';
import { simple } from 'acorn-walk';

export function safeExec(code: string, context: Record<string, any> = {}): any {
  // Parse the code to check for potentially harmful operations
  const ast = acorn.parse(code, { ecmaVersion: 2020 });

  // Implement checks on the AST to ensure safety
  const isSafe = checkASTSafety(ast);

  if (!isSafe) {
    throw new Error('Unsafe code detected');
  }

  // Create a safe execution environment
  const safeGlobals = {
    console: {
      log: console.log,
      error: console.error,
      warn: console.warn,
    },
    Math: Math,
    // Add other safe globals here
  };

  const safeContext = { ...safeGlobals, ...context };

  // Execute the code in a safe context
  const executor = new Function(...Object.keys(safeContext), code);
  return executor(...Object.values(safeContext));
}

function checkASTSafety(ast: any): boolean {
  let safe = true;

  simple(ast, {
    CallExpression(node: any) {
      if (['eval', 'Function', 'setTimeout', 'setInterval'].includes(node.callee.name)) {
        safe = false;
      }
    },
    MemberExpression(node: any) {
      if (node.object.name === 'window' || node.object.name === 'document') {
        safe = false;
      }
    },
    Identifier(node: any) {
      if (['process', 'global', 'require'].includes(node.name)) {
        safe = false;
      }
    },
    NewExpression(node: any) {
      if (node.callee.name === 'Function') {
        safe = false;
      }
    },
    AssignmentExpression(node: any) {
      if (node.left.type === 'MemberExpression' && 
          (node.left.object.name === 'window' || node.left.object.name === 'document')) {
        safe = false;
      }
    },
    // Add more checks for other potentially unsafe operations
  });

  return safe;
}