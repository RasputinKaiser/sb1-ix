import { generateText } from './openai';

export async function generateFunctionCode(prompt: string): Promise<string> {
  try {
    const response = await generateText(`Generate a JavaScript function based on the following prompt:\n\n${prompt}\n\nProvide only the function code without any explanation.`);
    return response.trim();
  } catch (error) {
    console.error('Error generating function code:', error);
    throw error;
  }
}

export async function executeDynamicFunction(functionCode: string, args: any[]): Promise<any> {
  try {
    // Use Function constructor to create a new function from the generated code
    const dynamicFunction = new Function(`return ${functionCode}`)();
    
    // Execute the function with the provided arguments
    return dynamicFunction(...args);
  } catch (error) {
    console.error('Error executing dynamic function:', error);
    throw error;
  }
}