import axios from 'axios';

interface AISession {
  sessionId: string;
  createdAt: Date;
}

interface AICommandResult {
  success: boolean;
  thoughts: string[];
  finalMessage: string;
  summary: string;
  error?: string;
}

const BASE_HEADERS = {
  'authority': 'gemini.browserbase.com',
  'accept-language': 'en-US,en;q=0.9',
  'cache-control': 'no-cache',
  'origin': 'https://gemini.browserbase.com',
  'pragma': 'no-cache',
  'referer': 'https://gemini.browserbase.com/',
  'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
};

class AIBrowserService {
  private sessions: Map<string, AISession> = new Map();

  async createAISession(): Promise<string | null> {
    const sessionUrl = 'https://gemini.browserbase.com/api/session';
    
    const sessionHeaders = {
      ...BASE_HEADERS,
      'accept': '*/*',
      'content-type': 'application/json'
    };

    try {
      const response = await axios.post(sessionUrl, { timezone: 'EEST' }, { headers: sessionHeaders });
      const sessionId = response.data.sessionId;
      
      if (sessionId) {
        this.sessions.set(sessionId, {
          sessionId,
          createdAt: new Date()
        });
        return sessionId;
      }
      return null;
    } catch (error) {
      console.error('AI Session Error:', error);
      return null;
    }
  }

  async executeAICommand(sessionId: string, prompt: string): Promise<AICommandResult> {
    const streamHeaders = {
      ...BASE_HEADERS,
      'accept': 'text/event-stream'
    };

    const result: AICommandResult = {
      success: false,
      thoughts: [],
      finalMessage: '',
      summary: ''
    };

    try {
      const response = await axios.get('https://gemini.browserbase.com/api/agent/stream', {
        params: { sessionId, goal: prompt },
        headers: streamHeaders,
        responseType: 'stream',
        timeout: 300000
      });

      let summaryText = '';

      return new Promise((resolve, reject) => {
        response.data.on('data', (chunk: Buffer) => {
          const lines = chunk.toString().split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data:')) {
              const jsonDataStr = line.slice(5).trim();
              try {
                const data = JSON.parse(jsonDataStr);
                
                if (data.category === 'agent') {
                  const level = data.level;
                  const message = data.message;
                  if (level === 1 && message && message.includes('💭')) {
                    const cleanMessage = message.replace('💭', '').trim();
                    result.thoughts.push(cleanMessage);
                  }
                }
                
                if (data.success === true) {
                  result.success = true;
                  result.finalMessage = data.finalMessage || '';
                }
                
                if (data.token) {
                  summaryText += data.token;
                }
              } catch (e) {
              }
            }
          }
        });

        response.data.on('end', () => {
          result.summary = summaryText;
          resolve(result);
        });

        response.data.on('error', (error: Error) => {
          result.error = error.message;
          reject(result);
        });
      });
    } catch (error: any) {
      result.error = error.message;
      return result;
    }
  }

  hasSession(sessionId: string): boolean {
    return this.sessions.has(sessionId);
  }

  getAllAISessions(): string[] {
    return Array.from(this.sessions.keys());
  }
}

export const aiBrowserService = new AIBrowserService();
