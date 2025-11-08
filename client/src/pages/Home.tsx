import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_TITLE } from "@/const";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [stats, setStats] = useState({
    activeSessions: 0,
    version: "5.0.0",
    browserStatus: "✅ 𝙊𝙣𝙡𝙞𝙣𝙚"
  });
  const [liveEvents, setLiveEvents] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setStats({
          activeSessions: data.activeSessions || 0,
          version: data.version || "5.0.0",
          browserStatus: data.browserRunning ? "✅ 𝙊𝙣𝙡𝙞𝙣𝙚" : "❌ 𝙊𝙛𝙛𝙡𝙞𝙣𝙚"
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
    <div className="min-h-screen bg-black text-green-400 overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90 animate-gradient-slow -z-10"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="text-center py-12 border-b-2 border-green-500 mb-12">
          <div className="text-9xl mb-6 animate-pulse-slow">🔨</div>
          <h1 className="text-6xl font-bold mb-4 animate-glow-rgb bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            {APP_TITLE}
          </h1>
          <p className="text-2xl text-cyan-400 glow-text mb-6">
            ⚡ 𝙋𝙧𝙤𝙛𝙚𝙨𝙨𝙞𝙤𝙣𝙖𝙡 𝘼𝙄-𝙋𝙤𝙬𝙚𝙧𝙚𝙙 𝘽𝙧𝙤𝙬𝙨𝙚𝙧 𝘼𝙪𝙩𝙤𝙢𝙖𝙩𝙞𝙤𝙣 𝙎𝙚𝙧𝙫𝙞𝙘𝙚 ⚡
          </p>
          <a 
            href="https://t.me/developer_hammer" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold text-xl rounded-full hover:scale-110 transition-transform shadow-[0_0_30px_rgba(0,255,0,0.5)] hover:shadow-[0_0_50px_rgba(0,255,0,0.8)]"
          >
            📱 @𝙙𝙚𝙫𝙚𝙡𝙤𝙥𝙚𝙧_𝙝𝙖𝙢𝙢𝙚𝙧
          </a>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="stat-card bg-black/40 border-2 border-green-500 rounded-2xl p-8 text-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:shadow-[0_0_40px_rgba(0,255,0,0.5)]">
            <div className="text-5xl font-bold text-green-400 glow-text mb-2">{stats.activeSessions}</div>
            <div className="text-lg text-cyan-400">📊 𝘼𝙘𝙩𝙞𝙫𝙚 𝙎𝙚𝙨𝙨𝙞𝙤𝙣𝙨</div>
          </div>
          <div className="stat-card bg-black/40 border-2 border-green-500 rounded-2xl p-8 text-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:shadow-[0_0_40px_rgba(0,255,0,0.5)]">
            <div className="text-5xl font-bold text-green-400 glow-text mb-2">{stats.version}</div>
            <div className="text-lg text-cyan-400">🚀 𝙑𝙚𝙧𝙨𝙞𝙤𝙣</div>
          </div>
          <div className="stat-card bg-black/40 border-2 border-green-500 rounded-2xl p-8 text-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:shadow-[0_0_40px_rgba(0,255,0,0.5)]">
            <div className="text-3xl font-bold text-green-400 glow-text mb-2">{stats.browserStatus}</div>
            <div className="text-lg text-cyan-400">💚 𝘽𝙧𝙤𝙬𝙨𝙚𝙧 𝙎𝙩𝙖𝙩𝙪𝙨</div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-4xl font-bold text-center mb-8 text-green-400 glow-text">
            🔧 𝘼𝙄 𝘼𝙪𝙩𝙤𝙢𝙖𝙩𝙞𝙤𝙣 𝙁𝙚𝙖𝙩𝙪𝙧𝙚𝙨
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🌐", title: "𝙊𝙥𝙚𝙣 𝙒𝙚𝙗 𝘽𝙧𝙤𝙬𝙨𝙚𝙧", desc: "𝙊𝙥𝙚𝙣 𝙖𝙣𝙙 𝙘𝙤𝙣𝙩𝙧𝙤𝙡 𝙗𝙧𝙤𝙬𝙨𝙚𝙧 𝙨𝙚𝙨𝙨𝙞𝙤𝙣𝙨" },
              { icon: "🖱️", title: "𝘾𝙡𝙞𝙘𝙠 𝘼𝙩", desc: "𝘾𝙡𝙞𝙘𝙠 𝙤𝙣 𝙨𝙥𝙚𝙘𝙞𝙛𝙞𝙘 𝙘𝙤𝙤𝙧𝙙𝙞𝙣𝙖𝙩𝙚𝙨" },
              { icon: "🎯", title: "𝙃𝙤𝙫𝙚𝙧 𝘼𝙩", desc: "𝙃𝙤𝙫𝙚𝙧 𝙤𝙫𝙚𝙧 𝙚𝙡𝙚𝙢𝙚𝙣𝙩𝙨" },
              { icon: "✍️", title: "𝙏𝙮𝙥𝙚 𝙏𝙚𝙭𝙩 𝘼𝙩", desc: "𝙏𝙮𝙥𝙚 𝙩𝙚𝙭𝙩 𝙖𝙩 𝙘𝙤𝙤𝙧𝙙𝙞𝙣𝙖𝙩𝙚𝙨" },
              { icon: "📜", title: "𝙎𝙘𝙧𝙤𝙡𝙡 𝘿𝙤𝙘𝙪𝙢𝙚𝙣𝙩", desc: "𝙎𝙘𝙧𝙤𝙡𝙡 𝙞𝙣 𝙖𝙡𝙡 𝙙𝙞𝙧𝙚𝙘𝙩𝙞𝙤𝙣𝙨" },
              { icon: "⏸️", title: "𝙒𝙖𝙞𝙩 5 𝙎𝙚𝙘𝙤𝙣𝙙𝙨", desc: "𝙋𝙖𝙪𝙨𝙚 𝙚𝙭𝙚𝙘𝙪𝙩𝙞𝙤𝙣" },
              { icon: "◀️", title: "𝙂𝙤 𝘽𝙖𝙘𝙠", desc: "𝙉𝙖𝙫𝙞𝙜𝙖𝙩𝙚 𝙗𝙖𝙘𝙠𝙬𝙖𝙧𝙙" },
              { icon: "▶️", title: "𝙂𝙤 𝙁𝙤𝙧𝙬𝙖𝙧𝙙", desc: "𝙉𝙖𝙫𝙞𝙜𝙖𝙩𝙚 𝙛𝙤𝙧𝙬𝙖𝙧𝙙" },
              { icon: "🔍", title: "𝙎𝙚𝙖𝙧𝙘𝙝", desc: "𝙊𝙥𝙚𝙣 𝙨𝙚𝙖𝙧𝙘𝙝 𝙚𝙣𝙜𝙞𝙣𝙚" },
              { icon: "🧭", title: "𝙉𝙖𝙫𝙞𝙜𝙖𝙩𝙚", desc: "𝙂𝙤 𝙩𝙤 𝙨𝙥𝙚𝙘𝙞𝙛𝙞𝙘 𝙐𝙍𝙇" },
              { icon: "⌨️", title: "𝙆𝙚𝙮 𝘾𝙤𝙢𝙗𝙞𝙣𝙖𝙩𝙞𝙤𝙣", desc: "𝙋𝙧𝙚𝙨𝙨 𝙠𝙚𝙮𝙗𝙤𝙖𝙧𝙙 𝙨𝙝𝙤𝙧𝙩𝙘𝙪𝙩𝙨" },
              { icon: "🎪", title: "𝘿𝙧𝙖𝙜 & 𝘿𝙧𝙤𝙥", desc: "𝘿𝙧𝙖𝙜 𝙚𝙡𝙚𝙢𝙚𝙣𝙩𝙨 𝙖𝙧𝙤𝙪𝙣𝙙" }
            ].map((feature, idx) => (
              <div key={idx} className="bg-black/40 border-2 border-green-500 rounded-xl p-6 hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,255,0,0.2)] hover:shadow-[0_0_30px_rgba(0,255,0,0.4)]">
                <div className="text-5xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-bold text-green-400 mb-2">{feature.title}</h3>
                <p className="text-cyan-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-4xl font-bold text-center mb-8 text-green-400 glow-text">
            📡 𝙇𝙞𝙫𝙚 𝙎𝙩𝙧𝙚𝙖𝙢 𝙈𝙤𝙣𝙞𝙩𝙤𝙧
          </h2>
          <div className="bg-black/60 border-2 border-green-500 rounded-xl p-6 shadow-[0_0_30px_rgba(0,255,0,0.3)] max-h-96 overflow-y-auto">
            {liveEvents.length === 0 ? (
              <div className="text-center text-cyan-400 py-8">
                ⏳ 𝙒𝙖𝙞𝙩𝙞𝙣𝙜 𝙛𝙤𝙧 𝙡𝙞𝙫𝙚 𝙚𝙫𝙚𝙣𝙩𝙨...
              </div>
            ) : (
              <div className="space-y-2">
                {liveEvents.map((event, idx) => (
                  <div key={idx} className="text-green-400 font-mono text-sm p-2 bg-black/40 rounded border-l-4 border-cyan-500 animate-fade-in">
                    ▶ {event}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-4xl font-bold mb-6 text-green-400 glow-text">
            🚀 𝙍𝙚𝙖𝙙𝙮 𝙩𝙤 𝘼𝙪𝙩𝙤𝙢𝙖𝙩𝙚?
          </h2>
          <p className="text-xl text-cyan-400 mb-8">
            ⚡ 𝙐𝙨𝙚 𝙤𝙪𝙧 𝘼𝙋𝙄 𝙤𝙧 𝙏𝙚𝙡𝙚𝙜𝙧𝙖𝙢 𝘽𝙤𝙩 𝙛𝙤𝙧 𝙛𝙪𝙡𝙡 𝙘𝙤𝙣𝙩𝙧𝙤𝙡 ⚡
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="px-8 py-6 text-xl bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold rounded-full hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,255,0,0.5)]"
              onClick={() => window.location.href = '/api/docs'}
            >
              📚 𝘼𝙋𝙄 𝘿𝙤𝙘𝙪𝙢𝙚𝙣𝙩𝙖𝙩𝙞𝙤𝙣
            </Button>
            <Button 
              className="px-8 py-6 text-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold rounded-full hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,255,255,0.5)]"
              onClick={() => window.open('https://t.me/developer_hammer', '_blank')}
            >
              💬 𝙏𝙚𝙡𝙚𝙜𝙧𝙖𝙢 𝘽𝙤𝙩
            </Button>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-slow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-gradient {
          animation: gradient 3s linear infinite;
        }
        
        .animate-gradient-slow {
          animation: gradient-slow 15s ease infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .glow-text {
          text-shadow: 0 0 10px rgba(0, 255, 0, 0.8), 0 0 20px rgba(0, 255, 0, 0.6), 0 0 30px rgba(0, 255, 0, 0.4);
        }
      `}</style>
    </div>
  );
}
