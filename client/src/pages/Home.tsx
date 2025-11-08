import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { APP_TITLE } from "@/const";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [stats, setStats] = useState({
    activeSessions: 0,
    version: "5.0.0",
    browserStatus: "✅ Online"
  });
  const [liveEvents, setLiveEvents] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setStats({
          activeSessions: data.activeSessions || 0,
          version: data.version || "5.0.0",
          browserStatus: data.browserRunning ? "✅ Online" : "❌ Offline"
        });
      })
      .catch(() => {});

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/live`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLiveEvents(prev => [data.message, ...prev.slice(0, 9)]);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-x-hidden">
      <div className="container mx-auto px-4 py-6 md:py-12 max-w-7xl">
        {/* Header Section */}
        <header className="text-center mb-8 md:mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-6xl md:text-8xl animate-bounce-slow">🔨</div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-green-400 to-cyan-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Hammer Automation AI
            </h1>
          </div>
          <p className="text-lg md:text-2xl text-green-400 mb-6 px-4">
            ⚡ Professional AI-Powered Browser Automation Service ⚡
          </p>
          
          {/* Telegram Link */}
          <a 
            href="https://t.me/developer_hammer" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg md:text-xl rounded-full hover:scale-105 transition-all shadow-lg hover:shadow-cyan-500/50"
          >
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
            </svg>
            @developer_hammer
          </a>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 px-2">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/30 rounded-xl p-4 md:p-6 text-center hover:scale-105 transition-transform shadow-lg">
            <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">{stats.activeSessions}</div>
            <div className="text-sm md:text-base text-gray-300">📊 Active Sessions</div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/30 rounded-xl p-4 md:p-6 text-center hover:scale-105 transition-transform shadow-lg">
            <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">{stats.version}</div>
            <div className="text-sm md:text-base text-gray-300">🚀 Version</div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/30 rounded-xl p-4 md:p-6 text-center hover:scale-105 transition-transform shadow-lg">
            <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2">{stats.browserStatus}</div>
            <div className="text-sm md:text-base text-gray-300">💚 Browser Status</div>
          </div>
        </div>

        {/* Features Section */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-green-400">
            🔧 AI Automation Features
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 px-2">
            {[
              { icon: "🌐", title: "Open Browser", desc: "Control browser sessions" },
              { icon: "🖱️", title: "Click At", desc: "Click coordinates" },
              { icon: "🎯", title: "Hover At", desc: "Hover elements" },
              { icon: "✍️", title: "Type Text", desc: "Type at coordinates" },
              { icon: "📜", title: "Scroll", desc: "Scroll in all directions" },
              { icon: "⏸️", title: "Wait", desc: "Pause execution" },
              { icon: "◀️", title: "Go Back", desc: "Navigate backward" },
              { icon: "▶️", title: "Go Forward", desc: "Navigate forward" },
              { icon: "🔍", title: "Search", desc: "Open search engine" },
              { icon: "🧭", title: "Navigate", desc: "Go to specific URL" },
              { icon: "⌨️", title: "Key Press", desc: "Keyboard shortcuts" },
              { icon: "🎪", title: "Drag & Drop", desc: "Drag elements" }
            ].map((feature, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/30 rounded-lg p-3 md:p-4 hover:scale-105 transition-transform shadow-lg text-center">
                <div className="text-3xl md:text-4xl mb-2">{feature.icon}</div>
                <h3 className="text-sm md:text-base font-bold text-green-400 mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-400 hidden md:block">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Live Stream Section */}
        <section className="mb-8 md:mb-12 px-2">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-green-400">
            📡 Live Stream Monitor
          </h2>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/30 rounded-xl p-4 md:p-6 shadow-lg max-h-64 md:max-h-96 overflow-y-auto">
            {liveEvents.length === 0 ? (
              <div className="text-center text-gray-400 py-6 md:py-8">
                ⏳ Waiting for live events...
              </div>
            ) : (
              <div className="space-y-2">
                {liveEvents.map((event, idx) => (
                  <div key={idx} className="text-green-400 font-mono text-xs md:text-sm p-2 bg-black/40 rounded border-l-4 border-cyan-500 animate-fade-in">
                    ▶ {event}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mb-8 px-2">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-green-400">
            🚀 Ready to Automate?
          </h2>
          <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8">
            ⚡ Use our API for full control ⚡
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="px-6 py-4 md:px-8 md:py-6 text-base md:text-xl bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg"
              onClick={() => window.location.href = '/api/docs'}
            >
              📚 API Documentation
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-gray-700 mt-8">
          <p className="text-gray-400 text-sm md:text-base mb-2">
            © 2025 Hammer Automation AI. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs md:text-sm">
            Made with ❤️ by <span className="text-green-400 font-semibold">Hammer</span>
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-gradient {
          animation: gradient 3s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
