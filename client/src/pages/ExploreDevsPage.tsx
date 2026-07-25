import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { User } from '../types';
import { GlassPanel } from '../components/common/GlassPanel';
import { Badge } from '../components/common/Badge';
import { Users, Search, MapPin, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';

export const ExploreDevsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res: any = await api.get(`/search?q=${query}`);
        setUsers(res.data.users || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Badge variant="cyan">DEVELOPER DIRECTORY</Badge>
        <h1 className="text-3xl font-extrabold text-slate-100 mt-2">Connect with Engineers worldwide</h1>
        <p className="text-sm text-slate-400">Discover software architects, UI/UX designers, and open-source contributors</p>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by name, handle, role, location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-darkNavy text-sm text-slate-200 pl-9 pr-4 py-2.5 rounded-xl border border-cyan-500/20 focus:outline-none focus:border-cyan-400"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 font-mono text-xs">
          <Sparkles className="w-6 h-6 text-cyan-400 animate-spin mx-auto mb-2" />
          Loading developers...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((dev) => (
            <GlassPanel key={dev.id} glow="cyan" className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={dev.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                  alt={dev.name}
                  className="w-12 h-12 rounded-full border border-cyan-500/40 object-cover shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-100 text-sm">{dev.name}</span>
                    {dev.isVerified && <ShieldCheck className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">@{dev.username}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2">
                {dev.profile?.headline || 'Software Engineer at DevisHub Network'}
              </p>

              {dev.profile?.location && (
                <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{dev.profile.location}</span>
                </div>
              )}

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <Badge variant={dev.status === 'ONLINE' ? 'lime' : 'outline'}>
                  {dev.status}
                </Badge>

                <Link
                  to={`/profile/${dev.username}`}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all"
                >
                  View Profile →
                </Link>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
};
