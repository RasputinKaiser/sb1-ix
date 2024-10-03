import { v4 as uuidv4 } from 'uuid';
import { safeExec } from '../utils/safeExecution';
import { fileSystem } from '../utils/fileSystem';
import { permissionSystem } from '../utils/permissionSystem';
import { generateText } from '../services/openai';
import { cacheResponse, getCachedResponse } from '../utils/aiCache';

interface AgentMessage {
  type: string;
  content: any;
}

class Agent {
  id: string;
  name: string;
  log: string[];

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
    this.log = [];
  }

  think(message: string) {
    const thought = `${this.name} thinks: ${message}`;
    this.log.push(thought);
    console.log(thought);
  }

  sendMessage(recipient: Agent, message: AgentMessage) {
    recipient.receiveMessage(this, message);
  }

  receiveMessage(sender: Agent, message: AgentMessage) {
    this.think(`Received message from ${sender.name}: ${JSON.stringify(message)}`);
  }
}

class UIAgent extends Agent {
  constructor() {
    super('UI Agent');
  }

  async processUserInput(input: string) {
    this.think(`Received user input: ${input}`);
    plannerAgent.receiveMessage(this, { type: 'USER_INPUT', content: input });
  }

  displayOutput(output: string) {
    console.log(`Output: ${output}`);
  }
}

class PlannerAgent extends Agent {
  constructor() {
    super('Planner Agent');
  }

  async receiveMessage(sender: Agent, message: AgentMessage) {
    super.receiveMessage(sender, message);
    if (message.type === 'USER_INPUT') {
      const tasks = await this.planTasks(message.content);
      this.sendMessage(coderAgent, { type: 'TASKS', content: tasks });
    }
  }

  async planTasks(userInput: string): Promise<string[]> {
    this.think(`Planning tasks for input: '${userInput}'`);
    const systemPrompt = "You are a task planner. Break down the user's request into a list of specific tasks.";
    const prompt = `User request: ${userInput}\n\nBreak this request down into a list of specific tasks:`;
    const response = await generateText(prompt, systemPrompt);
    const tasks = response.split('\n').filter(task => task.trim() !== '');
    this.think(`Planned tasks: ${JSON.stringify(tasks)}`);
    return tasks;
  }
}

class CoderAgent extends Agent {
  constructor() {
    super('Coder Agent');
  }

  async receiveMessage(sender: Agent, message: AgentMessage) {
    super.receiveMessage(sender, message);
    if (message.type === 'TASKS') {
      const code = await this.writeCode(message.content);
      this.sendMessage(reviewerAgent, { type: 'CODE', content: code });
    }
  }

  async writeCode(tasks: string[]): Promise<string> {
    this.think(`Writing code for tasks: ${JSON.stringify(tasks)}`);
    const systemPrompt = "You are a JavaScript programmer. Write code to accomplish the given tasks using the provided file system and permission system APIs.";
    const prompt = `Tasks:\n${tasks.join('\n')}\n\nWrite JavaScript code to accomplish these tasks:`;
    const code = await generateText(prompt, systemPrompt);
    this.think(`Generated code:\n${code}`);
    return code;
  }
}

class ReviewerAgent extends Agent {
  constructor() {
    super('Reviewer Agent');
  }

  async receiveMessage(sender: Agent, message: AgentMessage) {
    super.receiveMessage(sender, message);
    if (message.type === 'CODE') {
      const approved = await this.reviewCode(message.content);
      if (approved) {
        this.sendMessage(executorAgent, { type: 'APPROVED_CODE', content: message.content });
      } else {
        this.sendMessage(coderAgent, { type: 'CODE_REVIEW_FEEDBACK', content: 'Code requires modifications.' });
      }
    }
  }

  async reviewCode(code: string): Promise<boolean> {
    this.think("Reviewing code for correctness and security.");
    const systemPrompt = "You are a code reviewer. Analyze the given JavaScript code for correctness, security, and adherence to best practices.";
    const prompt = `Review the following code:\n\n${code}\n\nIs this code correct, secure, and following best practices? Respond with 'APPROVED' if it's good, or explain the issues if not.`;
    const review = await generateText(prompt, systemPrompt);
    const approved = review.trim().toUpperCase() === 'APPROVED';
    this.think(`Code review result: ${approved ? 'Approved' : 'Needs modifications'}`);
    return approved;
  }
}

class ExecutorAgent extends Agent {
  constructor() {
    super('Executor Agent');
  }

  async receiveMessage(sender: Agent, message: AgentMessage) {
    super.receiveMessage(sender, message);
    if (message.type === 'APPROVED_CODE') {
      const result = await this.executeCode(message.content);
      uiAgent.displayOutput(result);
    }
  }

  private async executeCode(code: string): Promise<string> {
    try {
      this.think(`Executing code:\n${code}`);
      const result = await safeExec(code, { fileSystem, permissionSystem });
      this.think(`Code executed successfully. Result: ${result}`);
      return result;
    } catch (error) {
      this.think(`Error during code execution: ${error.message}`);
      return this.handleExecutionError(error);
    }
  }

  private async handleExecutionError(error: Error): Promise<string> {
    this.think("Attempting to recover from execution error.");
    const systemPrompt = "You are an AI assistant specialized in debugging JavaScript code for file system operations. Your task is to analyze the error and suggest a fix.";
    const prompt = `The following code resulted in an error:
    ${error.message}
    
    Please suggest a fix for this error, considering the context of file system operations and permission checks.`;
    
    const suggestion = await generateText(prompt, systemPrompt);
    this.think(`Error recovery suggestion: ${suggestion}`);
    return `Execution failed. Error: ${error.message}\n\nSuggested fix: ${suggestion}`;
  }
}

const uiAgent = new UIAgent();
const plannerAgent = new PlannerAgent();
const coderAgent = new CoderAgent();
const reviewerAgent = new ReviewerAgent();
const executorAgent = new ExecutorAgent();

export {
  Agent,
  UIAgent,
  PlannerAgent,
  CoderAgent,
  ReviewerAgent,
  ExecutorAgent,
  uiAgent,
  plannerAgent,
  coderAgent,
  reviewerAgent,
  executorAgent
};