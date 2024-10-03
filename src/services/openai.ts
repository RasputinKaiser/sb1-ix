import { getSecret } from '../utils/secretManager'
import { cacheResponse, getCachedResponse } from '../utils/aiCache'

const apiKey = getSecret('VITE_OPENAI_API_KEY')

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class MockOpenAI {
  async createChatCompletion(options: { messages: OpenAIMessage[] }): Promise<OpenAIResponse> {
    console.log('Using mock OpenAI service')
    return {
      choices: [
        {
          message: {
            content: `Mock response for: ${options.messages[options.messages.length - 1].content}`
          }
        }
      ]
    }
  }
}

const openai = apiKey ? new MockOpenAI() : new MockOpenAI()

export async function generateText(prompt: string, systemPrompt: string = ''): Promise<string> {
  const cacheKey = `${systemPrompt}|${prompt}`;
  const cachedResponse = getCachedResponse(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const messages: OpenAIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ].filter(msg => msg.content !== '');

    const response = await openai.createChatCompletion({
      messages,
    })

    const generatedText = response.choices[0].message.content || '';
    cacheResponse(cacheKey, generatedText);
    return generatedText;
  } catch (error) {
    console.error('Error generating text:', error)
    throw error
  }
}