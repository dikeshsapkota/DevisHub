import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { GlassPanel } from '../components/common/GlassPanel';
import { Terminal, Github, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

export const SignInPage: React.FC = () => {
  const { login, demoLogin, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login({ email, password });
      navigate('/feed');
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <GlassPanel hoverEffect={false} className="w-full max-w-md space-y-6 bg-[#181a1e]">
        <div className="text-center space-y-2">
          <div className="w-11 h-11 rounded-lg bg-cyan-400 text-slate-950 flex items-center justify-center mx-auto">
            <Terminal className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">Welcome back to DevisHub</h2>
          <p className="text-xs text-slate-400">Authenticate your developer session</p>
        </div>

        {error && (
          <div className="bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@devishub.io"
                className="w-full bg-[#111318] text-sm text-slate-200 pl-9 pr-4 py-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#111318] text-sm text-slate-200 pl-9 pr-4 py-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 flex items-center justify-center gap-2 text-sm transition-colors"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative border-t border-white/10 pt-4 text-center">
          <button
            onClick={() => { demoLogin('alex_dev'); navigate('/feed'); }}
            className="w-full py-2.5 rounded-lg text-xs font-mono bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            1-Click Demo Login (@alex_dev)
          </button>
        </div>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-cyan-400 font-semibold hover:underline">
            Create DevisHub Account
          </Link>
        </p>
      </GlassPanel>
    </div>
  );
};
