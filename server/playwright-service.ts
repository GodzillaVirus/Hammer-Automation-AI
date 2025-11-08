import { chromium, Browser, BrowserContext, Page } from 'playwright';

interface Session {
  id: string;
  browser: Browser;
  context: BrowserContext;
  page: Page;
  createdAt: Date;
  lastActivity: Date;
}

class PlaywrightService {
  private sessions: Map<string, Session> = new Map();
  private eventListeners: Set<(event: any) => void> = new Set();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up inactive sessions every 10 seconds
    this.cleanupInterval = setInterval(() => {
      this.cleanupInactiveSessions();
    }, 10 * 1000);
  }

  private async cleanupInactiveSessions(): Promise<void> {
    const now = new Date();
    const maxInactiveTime = 30 * 1000; // 30 seconds

    for (const [sessionId, session] of this.sessions.entries()) {
      const inactiveTime = now.getTime() - session.lastActivity.getTime();
      if (inactiveTime > maxInactiveTime) {
        console.log(`Cleaning up inactive session: ${sessionId}`);
        await this.closeSession(sessionId);
      }
    }
  }

  async createSession(): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled'
      ]
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();
    
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
      (window as any).chrome = { runtime: {} };
    });

    this.sessions.set(sessionId, {
      id: sessionId,
      browser,
      context,
      page,
      createdAt: new Date(),
      lastActivity: new Date()
    });

    this.broadcastEvent({ type: 'session_created', sessionId, timestamp: new Date().toISOString() });
    return sessionId;
  }

  async navigate(sessionId: string, url: string): Promise<void> {
    const session = this.getSession(sessionId);
    await session.page.goto(url, { waitUntil: 'domcontentloaded' });
    this.broadcastEvent({ type: 'navigate', sessionId, url, timestamp: new Date().toISOString() });
  }

  async click(sessionId: string, selector: string): Promise<void> {
    const session = this.getSession(sessionId);
    await session.page.click(selector);
    this.broadcastEvent({ type: 'click', sessionId, selector, timestamp: new Date().toISOString() });
  }

  async clickAt(sessionId: string, x: number, y: number): Promise<void> {
    const session = this.getSession(sessionId);
    await session.page.mouse.click(x, y);
    this.broadcastEvent({ type: 'click_at', sessionId, x, y, timestamp: new Date().toISOString() });
  }

  async hoverAt(sessionId: string, x: number, y: number): Promise<void> {
    const session = this.getSession(sessionId);
    await session.page.mouse.move(x, y);
    this.broadcastEvent({ type: 'hover_at', sessionId, x, y, timestamp: new Date().toISOString() });
  }

  async type(sessionId: string, selector: string, text: string): Promise<void> {
    const session = this.getSession(sessionId);
    await session.page.fill(selector, text);
    this.broadcastEvent({ type: 'type', sessionId, selector, timestamp: new Date().toISOString() });
  }

  async typeAt(sessionId: string, x: number, y: number, text: string): Promise<void> {
    const session = this.getSession(sessionId);
    await session.page.mouse.click(x, y);
    await session.page.keyboard.type(text);
    this.broadcastEvent({ type: 'type_at', sessionId, x, y, timestamp: new Date().toISOString() });
  }

  async scroll(sessionId: string, direction: 'up' | 'down' | 'left' | 'right'): Promise<void> {
    const session = this.getSession(sessionId);
    const scrollAmount = 500;
    
    switch (direction) {
      case 'down':
        await session.page.evaluate((amount) => window.scrollBy(0, amount), scrollAmount);
        break;
      case 'up':
        await session.page.evaluate((amount) => window.scrollBy(0, -amount), scrollAmount);
        break;
      case 'right':
        await session.page.evaluate((amount) => window.scrollBy(amount, 0), scrollAmount);
        break;
      case 'left':
        await session.page.evaluate((amount) => window.scrollBy(-amount, 0), scrollAmount);
        break;
    }
    
    this.broadcastEvent({ type: 'scroll', sessionId, direction, timestamp: new Date().toISOString() });
  }

  async scrollAt(sessionId: string, x: number, y: number, deltaY: number): Promise<void> {
    const session = this.getSession(sessionId);
    await session.page.mouse.move(x, y);
    await session.page.mouse.wheel(0, deltaY);
    this.broadcastEvent({ type: 'scroll_at', sessionId, x, y, deltaY, timestamp: new Date().toISOString() });
  }

  async wait(sessionId: string, seconds: number = 5): Promise<void> {
    const session = this.getSession(sessionId);
    await session.page.waitForTimeout(seconds * 1000);
    this.broadcastEvent({ type: 'wait', sessionId, seconds, timestamp: new Date().toISOString() });
  }

  async goBack(sessionId: string): Promise<void> {
    const session = this.getSession(sessionId);
    await session.page.goBack();
    this.broadcastEvent({ type: 'go_back', sessionId, timestamp: new Date().toISOString() });
  }

  async goForward(sessionId: string): Promise<void> {
    const session = this.getSession(sessionId);
    await session.page.goForward();
    this.broadcastEvent({ type: 'go_forward', sessionId, timestamp: new Date().toISOString() });
  }

  async search(sessionId: string, query: string): Promise<void> {
    const session = this.getSession(sessionId);
    await session.page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
    this.broadcastEvent({ type: 'search', sessionId, query, timestamp: new Date().toISOString() });
  }

  async keyPress(sessionId: string, key: string): Promise<void> {
    const session = this.getSession(sessionId);
    await session.page.keyboard.press(key);
    this.broadcastEvent({ type: 'key_press', sessionId, key, timestamp: new Date().toISOString() });
  }

  async dragAndDrop(sessionId: string, fromX: number, fromY: number, toX: number, toY: number): Promise<void> {
    const session = this.getSession(sessionId);
    await session.page.mouse.move(fromX, fromY);
    await session.page.mouse.down();
    await session.page.mouse.move(toX, toY);
    await session.page.mouse.up();
    this.broadcastEvent({ type: 'drag_drop', sessionId, fromX, fromY, toX, toY, timestamp: new Date().toISOString() });
  }

  async screenshot(sessionId: string, fullPage: boolean = false): Promise<string> {
    const session = this.getSession(sessionId);
    const buffer = await session.page.screenshot({ fullPage });
    const base64 = buffer.toString('base64');
    this.broadcastEvent({ type: 'screenshot', sessionId, timestamp: new Date().toISOString() });
    return base64;
  }

  async executeScript(sessionId: string, script: string): Promise<any> {
    const session = this.getSession(sessionId);
    const result = await session.page.evaluate(script);
    this.broadcastEvent({ type: 'execute_script', sessionId, timestamp: new Date().toISOString() });
    return result;
  }

  async getContent(sessionId: string): Promise<string> {
    const session = this.getSession(sessionId);
    const content = await session.page.content();
    this.broadcastEvent({ type: 'get_content', sessionId, timestamp: new Date().toISOString() });
    return content;
  }

  async closeSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      await session.context.close();
      await session.browser.close();
      this.sessions.delete(sessionId);
      this.broadcastEvent({ type: 'session_closed', sessionId, timestamp: new Date().toISOString() });
    }
  }

  getSession(sessionId: string): Session {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    // Update last activity time
    session.lastActivity = new Date();
    return session;
  }

  getAllSessions(): string[] {
    return Array.from(this.sessions.keys());
  }

  getStats() {
    return {
      activeSessions: this.sessions.size,
      version: '5.0.0',
      browserRunning: true
    };
  }

  addEventListener(listener: (event: any) => void): void {
    this.eventListeners.add(listener);
  }

  removeEventListener(listener: (event: any) => void): void {
    this.eventListeners.delete(listener);
  }

  private broadcastEvent(event: any): void {
    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error broadcasting event:', error);
      }
    });
  }

  async cleanup(): Promise<void> {
    const sessionIds = Array.from(this.sessions.keys());
    for (const sessionId of sessionIds) {
      await this.closeSession(sessionId);
    }
  }
}

export const playwrightService = new PlaywrightService();
