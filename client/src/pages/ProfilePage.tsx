import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { User } from '../types';
import { GlassPanel } from '../components/common/GlassPanel';
import { Badge } from '../components/common/Badge';
import { MarkdownViewer } from '../components/common/MarkdownViewer';
import { MapPin, Calendar, Globe, Github, Linkedin, Briefcase, Code, FolderGit2, UserPlus, MessageSquare, Edit3, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, isAuthenticated, demoLogin } = useAuthStore();
  const [profileUser, setProfileUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'readme' | 'projects' | 'posts'>('overview');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res: any = await api.get(`/profiles/${username}`);
        setProfileUser(res.data);
        setIsFollowing(res.data.isFollowing || false);
        setFollowersCount(res.data.followersCount || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      await demoLogin('alex_dev');
    }
    if (!profileUser) return;

    try {
      const res: any = await api.post(`/follows/${profileUser.id}`);
      setIsFollowing(res.data.isFollowing);
      setFollowersCount((prev) => (res.data.isFollowing ? prev + 1 : prev - 1));
    } catch (err: any) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-24 text-slate-400 font-mono text-xs">
        <Sparkles className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
        Loading developer profile...
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-100">Developer Profile Not Found</h2>
        <Link to="/developers" className="text-cyan-400 text-sm hover:underline mt-4 inline-block">
          ← Back to Developers
        </Link>
      </div>
    );
  }

  const isSelf = currentUser?.username === profileUser.username;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* COVER & HEADER CARD */}
      <GlassPanel glow="cyan" className="p-0 overflow-hidden bg-darkNavy/90 border-cyan-500/30">
        {/* Cover Image Banner */}
        <div
          className="h-48 sm:h-64 w-full bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${profileUser.coverImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-darkNavy via-darkNavy/40 to-transparent" />
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 relative -mt-16 sm:-mt-20 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <img
                src={profileUser.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                alt={profileUser.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-obsidian object-cover shadow-[0_0_25px_rgba(0,240,255,0.3)] bg-obsidian"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{profileUser.name}</h1>
                <p className="text-sm font-mono text-cyan-400">@{profileUser.username}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!isSelf ? (
                <>
                  <button
                    onClick={handleFollowToggle}
                    className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                      isFollowing
                        ? 'bg-white/10 text-slate-200 border border-white/20'
                        : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:brightness-110'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    {isFollowing ? 'Following' : 'Follow Developer'}
                  </button>
                  <Link
                    to={`/chat?user=${profileUser.id}`}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-darkViolet border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => alert('Profile editing modal')}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Headline & Bio */}
          <p className="text-sm text-slate-200 font-medium">{profileUser.profile?.headline}</p>
          <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">{profileUser.profile?.bio}</p>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-white/10 text-xs font-mono text-slate-400">
            {profileUser.profile?.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                {profileUser.profile.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-400" />
              Joined {new Date(profileUser.createdAt).toLocaleDateString()}
            </span>
            <span className="text-slate-300">
              <strong className="text-cyan-400 font-extrabold">{followersCount}</strong> Followers
            </span>
            <span className="text-slate-300">
              <strong className="text-purple-400 font-extrabold">{profileUser.followingCount || 0}</strong> Following
            </span>
          </div>
        </div>
      </GlassPanel>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'readme', label: 'Profile README.md' },
          { key: 'projects', label: `Projects (${profileUser.projects?.length || 0})` },
          { key: 'posts', label: `Posts (${profileUser.posts?.length || 0})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              activeTab === tab.key
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Skills */}
            <GlassPanel glow="cyan" className="space-y-3">
              <h3 className="font-mono text-xs text-cyan-400 uppercase tracking-wider">Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profileUser.profile?.skills?.map((s: any) => (
                  <Badge key={s.id} variant="cyan">
                    {s.skill?.name || 'TypeScript'}
                  </Badge>
                ))}
              </div>
            </GlassPanel>

            {/* Experience */}
            <GlassPanel glow="violet" className="space-y-4">
              <h3 className="font-mono text-xs text-purple-400 uppercase tracking-wider">Experience & History</h3>
              {profileUser.profile?.experiences?.length > 0 ? (
                profileUser.profile.experiences.map((exp: any) => (
                  <div key={exp.id} className="border-l-2 border-purple-500/40 pl-4 py-1 space-y-1">
                    <h4 className="font-bold text-slate-100 text-sm">{exp.role}</h4>
                    <p className="text-xs text-purple-300 font-mono">{exp.company}</p>
                    <p className="text-xs text-slate-400">{exp.description}</p>
                  </div>
                ))
              ) : (
                <div className="border-l-2 border-purple-500/40 pl-4 py-1 space-y-1">
                  <h4 className="font-bold text-slate-100 text-sm">Principal Systems Engineer</h4>
                  <p className="text-xs text-purple-300 font-mono">CyberTech Systems</p>
                  <p className="text-xs text-slate-400">Architected distributed key-value engine and high throughput Rust microservices.</p>
                </div>
              )}
            </GlassPanel>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <GlassPanel glow="cyan" className="space-y-3">
              <h3 className="font-mono text-xs text-cyan-400 uppercase tracking-wider">Status & Availability</h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status</span>
                  <Badge variant="lime">{profileUser.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Collaboration</span>
                  <span className="text-emerald-400">Open for projects</span>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      )}

      {activeTab === 'readme' && (
        <GlassPanel glow="cyan" className="p-8 bg-darkNavy/90 min-h-[400px]">
          <MarkdownViewer
            content={
              profileUser.profile?.readmeMarkdown ||
              `# ${profileUser.name} 👋\n\nSoftware Engineer building high performance applications.`
            }
          />
        </GlassPanel>
      )}

      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profileUser.projects?.map((proj: any) => (
            <GlassPanel key={proj.id} glow="cyan" className="space-y-3">
              <Link to={`/projects/${proj.slug}`} className="font-bold text-slate-100 text-lg hover:text-cyan-300">
                {proj.name}
              </Link>
              <p className="text-xs text-slate-300">{proj.shortDescription}</p>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
};
