import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { GlassPanel } from '../components/common/GlassPanel';
import { Badge } from '../components/common/Badge';
import { Terminal, Code, Users, Sparkles, FolderGit2, ArrowRight, Shield, Zap, Cpu, Star, MessageSquare } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { demoLogin, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    await demoLogin('alex_dev');
    navigate('/feed');
  };

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/feed" replace />;
  }

  return (
    <div className="min-h-screen space-y-20 py-10">
      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-200 text-xs font-mono mb-7">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>The Next Generation Social Platform for Programmers</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight mb-6">
          Where Developers <br />
          <span className="text-cyan-300">
            Build, Share and Connect.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
          Showcase your work, publish technical documentation, discover developers, and collaborate with a global community built for code.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-colors flex items-center justify-center gap-2 text-base"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handleDemoLogin}
            className="w-full sm:w-auto px-6 py-3 rounded-lg font-medium glass-panel text-slate-200 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-base"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            Try 1-Click Demo Login
          </button>
        </div>

        {/* HERO CODE TERMINAL PREVIEW */}
        <div className="mt-16 max-w-4xl mx-auto text-left">
          <GlassPanel hoverEffect={false} className="font-mono text-xs text-slate-300 bg-[#181a1e]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-slate-400 text-[11px] ml-2">devishub-network.ts — Node Engine</span>
              </div>
              <Badge variant="cyan">ONLINE</Badge>
            </div>
            <div className="space-y-1 text-slate-300">
              <p><span className="text-purple-400">import</span> &#123; <span className="text-cyan-300">DevisHubNetwork</span>, <span className="text-cyan-300">ProjectShowcase</span> &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">'@devishub/core'</span>;</p>
              <p className="text-slate-500">// Initialize neo-futuristic developer social graph</p>
              <p><span className="text-purple-400">const</span> network = <span className="text-purple-400">new</span> <span className="text-cyan-300">DevisHubNetwork</span>(&#123; region: <span className="text-emerald-300">'global'</span> &#125;);</p>
              <p>network.<span className="text-cyan-400">connectDevelopers</span>([<span className="text-emerald-300">'@alex_dev'</span>, <span className="text-emerald-300">'@elena_codes'</span>]);</p>
              <p className="text-emerald-400">✓ Real-time Socket Mesh initialized (0 latency)</p>
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="violet">CORE FEATURES</Badge>
          <h2 className="text-3xl font-extrabold text-slate-100">Engineered for Technical Creators</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Everything you need to showcase open-source projects, write live technical documentation, and network with engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <GlassPanel className="space-y-4">
            <div className="w-11 h-11 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
              <Code className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Developer Profiles & READMEs</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Build a comprehensive profile featuring Markdown README tabs, verified skill badges, repository links, and experience timelines.
            </p>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <div className="w-11 h-11 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
              <FolderGit2 className="w-5 h-5 text-cyan-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Project Documentation Portal</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Host full project pages with live Markdown rendering, API documentation tabs, installation steps, tech tags, and star counts.
            </p>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <div className="w-11 h-11 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-cyan-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Real-Time Console Messaging</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Chat directly with developers using Socket.IO socket mesh with typing indicators, online status, and code card attachments.
            </p>
          </GlassPanel>
        </div>
      </section>

      {/* COMMUNITY STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlassPanel hoverEffect={false} className="py-10 px-8 bg-[#181a1e]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-extrabold text-cyan-400 font-mono">10,000+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Active Developers</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-cyan-300 font-mono">25,000+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Open Source Repos</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-cyan-300 font-mono">500k+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Code Reactions</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">99.9%</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Socket Uptime</div>
            </div>
          </div>
        </GlassPanel>
      </section>
    </div>
  );
};
