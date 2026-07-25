import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { GlassPanel } from '../components/common/GlassPanel';
import { Badge } from '../components/common/Badge';
import { FolderGit2, Sparkles, Send, FileText } from 'lucide-react';

export const CreateProjectPage: React.FC = () => {
  const { isAuthenticated, demoLogin } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [techInput, setTechInput] = useState('TypeScript, React, Node.js');
  const [readmeContent, setReadmeContent] = useState('# Project Overview\n\nWrite project overview and installation instructions here.');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      await demoLogin('alex_dev');
    }

    try {
      setLoading(true);
      const technologies = techInput.split(',').map((t) => t.trim()).filter(Boolean);
      const res: any = await api.post('/projects', {
        name,
        shortDescription,
        repoUrl: repoUrl || undefined,
        demoUrl: demoUrl || undefined,
        technologies,
        readmeContent,
      });

      navigate(`/projects/${res.data.slug}`);
    } catch (err: any) {
      alert(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <Badge variant="cyan">NEW PROJECT PAGE</Badge>
        <h1 className="text-3xl font-extrabold text-slate-100 mt-2">Publish Project & Documentation</h1>
        <p className="text-sm text-slate-400">Host technical documentation, repository links, and tech tags</p>
      </div>

      <GlassPanel glow="cyan" className="space-y-6 bg-darkNavy/90 border-cyan-500/30">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">Project Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. HyperDB Engine"
              className="w-full bg-obsidian text-sm text-slate-200 px-4 py-2.5 rounded-xl border border-cyan-500/20 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">Short Description *</label>
            <textarea
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              rows={2}
              placeholder="Brief summary for project cards..."
              className="w-full bg-obsidian text-sm text-slate-200 px-4 py-2.5 rounded-xl border border-cyan-500/20 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">GitHub Repository URL</label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/user/repo"
                className="w-full bg-obsidian text-sm text-slate-200 px-4 py-2.5 rounded-xl border border-cyan-500/20 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">Live Demo URL</label>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://demo.devishub.io"
                className="w-full bg-obsidian text-sm text-slate-200 px-4 py-2.5 rounded-xl border border-cyan-500/20 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">Technologies (Comma separated)</label>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="Rust, TypeScript, React, Docker"
              className="w-full bg-obsidian text-sm text-slate-200 px-4 py-2.5 rounded-xl border border-cyan-500/20 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">README Documentation (Markdown)</label>
            <textarea
              value={readmeContent}
              onChange={(e) => setReadmeContent(e.target.value)}
              rows={8}
              className="w-full bg-obsidian font-mono text-xs text-cyan-300 p-4 rounded-xl border border-cyan-500/30 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:brightness-110 flex items-center justify-center gap-2 text-sm"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Publishing Project...' : 'Publish Project Documentation'}
          </button>
        </form>
      </GlassPanel>
    </div>
  );
};
