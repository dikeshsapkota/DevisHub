import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { GlassPanel } from '../components/common/GlassPanel';
import { Terminal, User, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const { register, error } = useAuthStore();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await register({ name, username, email, password });
      navigate('/feed');
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <GlassPanel glow="cyan" className="w-full max-w-md space-y-6 bg-darkNavy/90 border-cyan-500/30">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-darkViolet border border-cyan-500/40 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <Terminal className="w-6 h-6 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">Join DevisHub Community</h2>
          <p className="text-xs text-slate-400">Create your developer identity</p>
        </div>

        {error && (
          <div className="bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Vance"
              className="w-full bg-obsidian text-sm text-slate-200 px-3.5 py-2.5 rounded-xl border border-cyan-500/20 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">Username (Handle)</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="alex_dev"
              className="w-full bg-obsidian text-sm text-slate-200 px-3.5 py-2.5 rounded-xl border border-cyan-500/20 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@devishub.io"
              className="w-full bg-obsidian text-sm text-slate-200 px-3.5 py-2.5 rounded-xl border border-cyan-500/20 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-obsidian text-sm text-slate-200 px-3.5 py-2.5 rounded-xl border border-cyan-500/20 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:brightness-110 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/signin" className="text-cyan-400 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </GlassPanel>
    </div>
  );
};
