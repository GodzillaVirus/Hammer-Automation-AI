import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { WebSocketServer } from "ws";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { playwrightService } from "../playwright-service";
import { aiBrowserService } from "../ai-browser";
import { initTelegramBot } from "../telegram-bot";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app);
  app.get('/api/health', async (req, res) => {
    const stats = playwrightService.getStats();
    res.json(stats);
  });

  app.post('/api/automation', async (req, res) => {
    try {
      const { action, sessionId, url, selector, text, x, y, direction, fullPage, script } = req.body;

      switch (action) {
        case 'create':
          const newSessionId = await playwrightService.createSession();
          res.json({ success: true, sessionId: newSessionId });
          break;

        case 'navigate':
          await playwrightService.navigate(sessionId, url);
          res.json({ success: true });
          break;

        case 'click':
          await playwrightService.click(sessionId, selector);
          res.json({ success: true });
          break;

        case 'click_at':
          await playwrightService.clickAt(sessionId, x, y);
          res.json({ success: true });
          break;

        case 'hover_at':
          await playwrightService.hoverAt(sessionId, x, y);
          res.json({ success: true });
          break;

        case 'type':
          await playwrightService.type(sessionId, selector, text);
          res.json({ success: true });
          break;

        case 'type_at':
          await playwrightService.typeAt(sessionId, x, y, text);
          res.json({ success: true });
          break;

        case 'scroll':
          await playwrightService.scroll(sessionId, direction);
          res.json({ success: true });
          break;

        case 'scroll_at':
          await playwrightService.scrollAt(sessionId, x, y, direction === 'down' ? 100 : -100);
          res.json({ success: true });
          break;

        case 'wait':
          await playwrightService.wait(sessionId, 5);
          res.json({ success: true });
          break;

        case 'go_back':
          await playwrightService.goBack(sessionId);
          res.json({ success: true });
          break;

        case 'go_forward':
          await playwrightService.goForward(sessionId);
          res.json({ success: true });
          break;

        case 'search':
          await playwrightService.search(sessionId, text);
          res.json({ success: true });
          break;

        case 'key_press':
          await playwrightService.keyPress(sessionId, text);
          res.json({ success: true });
          break;

        case 'drag_drop':
          const { fromX, fromY, toX, toY } = req.body;
          await playwrightService.dragAndDrop(sessionId, fromX, fromY, toX, toY);
          res.json({ success: true });
          break;

        case 'screenshot':
          const screenshot = await playwrightService.screenshot(sessionId, fullPage);
          res.json({ success: true, screenshot });
          break;

        case 'execute':
          const result = await playwrightService.executeScript(sessionId, script);
          res.json({ success: true, result });
          break;

        case 'get_content':
          const content = await playwrightService.getContent(sessionId);
          res.json({ success: true, content });
          break;

        case 'close':
          await playwrightService.closeSession(sessionId);
          res.json({ success: true });
          break;

        case 'close_all':
          await playwrightService.cleanup();
          res.json({ success: true, message: 'All sessions closed' });
          break;

        case 'ai_create':
          const aiSessionId = await aiBrowserService.createAISession();
          res.json({ success: true, sessionId: aiSessionId });
          break;

        case 'ai_command':
          const aiResult = await aiBrowserService.executeAICommand(sessionId, text);
          res.json({ ...aiResult });
          break;

        default:
          res.status(400).json({ success: false, error: 'Unknown action' });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws: any) => {
    const eventListener = (event: any) => {
      ws.send(JSON.stringify({ message: `${event.type} - ${event.timestamp}` }));
    };

    playwrightService.addEventListener(eventListener);

    ws.on('close', () => {
      playwrightService.removeEventListener(eventListener);
    });
  });

  server.on('upgrade', (request, socket, head) => {
    if (request.url === '/api/live') {
      wss.handleUpgrade(request, socket, head, (ws: any) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    const apiUrl = process.env.API_URL || `http://localhost:${port}`;
    initTelegramBot(apiUrl);
  });
}

startServer().catch(console.error);
