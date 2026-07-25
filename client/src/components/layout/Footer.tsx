import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Github, Twitter, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-obsidian border-t border-cyan-500/10 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-darkViolet border border-cyan-500/30 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-100 to-cyan-300 bg-clip-text text-transparent">
                DEV<span className="text-cyan-400">HUB</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The premier social network and collaboration platform built exclusively for software engineers, systems architects, and open-source creators.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-mono text-xs text-cyan-400 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/feed" className="hover:text-cyan-300 transition-colors">Developer Feed</Link></li>
              <li><Link to="/projects" className="hover:text-cyan-300 transition-colors">Project Hub</Link></li>
              <li><Link to="/developers" className="hover:text-cyan-300 transition-colors">Discover Developers</Link></li>
              <li><Link to="/chat" className="hover:text-cyan-300 transition-colors">Console Messaging</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-mono text-xs text-cyan-400 uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-cyan-300 transition-colors">GitHub Repository</a></li>
              <li><a href="#docs" className="hover:text-cyan-300 transition-colors">API & Docs Guide</a></li>
              <li><a href="#privacy" className="hover:text-cyan-300 transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-cyan-300 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-mono text-xs text-cyan-400 uppercase tracking-wider mb-3">System Status</h4>
            <div className="bg-darkNavy border border-cyan-500/20 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                All Systems Operational
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Socket Mesh: Online (5ms)
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 DevisHub Platform. Engineered with Neo-Futurism Design System.</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" className="hover:text-slate-300 transition-colors"><Github className="w-4 h-4" /></a>
            <a href="https://twitter.com" className="hover:text-slate-300 transition-colors"><Twitter className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};
