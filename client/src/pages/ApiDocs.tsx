import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            🔨 Hammer Automation AI
          </h1>
          <p className="text-xl text-gray-300">API Documentation</p>
        </div>

        <Card className="bg-gray-800/50 border-green-500/30 mb-6">
          <CardHeader>
            <CardTitle className="text-green-400">🌐 Base URL</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-cyan-300">https://hammer-automation-ai.up.railway.app</code>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-green-500/30 mb-6">
          <CardHeader>
            <CardTitle className="text-green-400">📋 Health Check</CardTitle>
            <CardDescription>GET /api/health</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Check server status and get active sessions count</p>
            <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
              <code className="text-green-300">
{`curl https://hammer-automation-ai.up.railway.app/api/health

Response:
{
  "activeSessions": 0,
  "version": "5.0.0",
  "status": "online"
}`}
              </code>
            </pre>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-green-500/30 mb-6">
          <CardHeader>
            <CardTitle className="text-green-400">🤖 Automation API</CardTitle>
            <CardDescription>POST /api/automation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Execute browser automation commands</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">1. Create Session</h3>
                <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                  <code className="text-green-300">
{`{
  "action": "create"
}

Response: { "success": true, "sessionId": "xxx" }`}
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">2. Navigate to URL</h3>
                <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                  <code className="text-green-300">
{`{
  "action": "navigate",
  "sessionId": "xxx",
  "url": "https://example.com"
}`}
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">3. Click at Coordinates</h3>
                <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                  <code className="text-green-300">
{`{
  "action": "click_at",
  "sessionId": "xxx",
  "x": 100,
  "y": 200
}`}
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">4. Type Text</h3>
                <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                  <code className="text-green-300">
{`{
  "action": "type_at",
  "sessionId": "xxx",
  "x": 100,
  "y": 200,
  "text": "Hello World"
}`}
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">5. Take Screenshot</h3>
                <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                  <code className="text-green-300">
{`{
  "action": "screenshot",
  "sessionId": "xxx",
  "fullPage": true
}

Response: { "success": true, "screenshot": "base64..." }`}
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">6. AI Command</h3>
                <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                  <code className="text-green-300">
{`{
  "action": "ai_create"
}

Then:
{
  "action": "ai_command",
  "sessionId": "xxx",
  "text": "Go to Google and search for AI"
}`}
                  </code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-green-500/30 mb-6">
          <CardHeader>
            <CardTitle className="text-green-400">🔴 WebSocket Live Stream</CardTitle>
            <CardDescription>wss://hammer-automation-ai.up.railway.app/api/live</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Real-time event monitoring</p>
            <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
              <code className="text-green-300">
{`const ws = new WebSocket('wss://hammer-automation-ai.up.railway.app/api/live');

ws.onmessage = (event) => {
  console.log('Live event:', JSON.parse(event.data));
};`}
              </code>
            </pre>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg font-semibold hover:from-green-600 hover:to-cyan-600 transition-all"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
