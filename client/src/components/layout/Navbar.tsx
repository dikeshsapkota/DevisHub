import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Terminal, Code, Users, FolderGit2, MessageSquare, Bell, Search, User as UserIcon, LogOut, Sparkles, Plus } from 'lucide-react';
import { Badge } from '../common/Badge';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, demoLogin } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Feed', path: '/feed', icon: Code },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Developers', path: '/developers', icon: Users },
    { name: 'Messages', path: '/chat', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 bg-obsidian/80 backdrop-blur-xl border-b border-cyan-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-darkViolet border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)] group-hover:border-cyan-400 transition-all duration-300">
            <Terminal className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-100 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              DEVIS<span className="text-cyan-400">HUB</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-cyan-400/70 ml-1.5 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
              v1.0.0
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xs relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search code, projects, devs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-darkNavy/80 text-sm text-slate-200 pl-9 pr-4 py-1.5 rounded-lg border border-cyan-500/20 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 placeholder:text-slate-500 font-sans transition-all"
          />
        </form>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User Status / Quick Demo Switcher / Auth Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Switcher Button */}
          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition-all"
              title="Switch demo account"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Demo Login</span>
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-darkNavy border border-purple-500/30 rounded-xl shadow-2xl p-2 z-50 backdrop-blur-xl">
                <div className="text-[11px] font-mono text-purple-300/70 px-2 py-1 uppercase tracking-wider">Select Test Account</div>
                <button
                  onClick={() => { demoLogin('alex_dev'); setShowDemoMenu(false); navigate('/feed'); }}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-purple-500/20 text-slate-200 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-cyan-300">Alex Vance</div>
                    <div className="text-[10px] text-slate-400">@alex_dev (Systems Lead)</div>
                  </div>
                </button>
                <button
                  onClick={() => { demoLogin('elena_codes'); setShowDemoMenu(false); navigate('/feed'); }}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-purple-500/20 text-slate-200 flex items-center justify-between mt-1"
                >
                  <div>
                    <div className="font-semibold text-pink-300">Elena Rostova</div>
                    <div className="text-[10px] text-slate-400">@elena_codes (UI Toolkit)</div>
                  </div>
                </button>
                <button
                  onClick={() => { demoLogin('marcus_quantum'); setShowDemoMenu(false); navigate('/feed'); }}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-purple-500/20 text-slate-200 flex items-center justify-between mt-1"
                >
                  <div>
                    <div className="font-semibold text-emerald-300">Marcus Chen</div>
                    <div className="text-[10px] text-slate-400">@marcus_quantum (Cloud Sec)</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link to="/notifications" className="p-2 text-slate-400 hover:text-cyan-300 relative rounded-lg hover:bg-white/5 transition-all">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400" />
              </Link>

              <Link to={`/profile/${user.username}`} className="flex items-center gap-2 pl-2 border-l border-white/10 group">
                <img
                  src={user.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-cyan-500/40 object-cover group-hover:border-cyan-300 transition-all"
                />
                <span className="hidden sm:inline-block text-sm font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">
                  @{user.username}
                </span>
              </Link>

              <button
                onClick={() => logout()}
                className="p-2 text-slate-400 hover:text-pink-400 rounded-lg hover:bg-white/5 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/signin"
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-semibold shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:brightness-110 transition-all"
              >
                Join DevisHub
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
