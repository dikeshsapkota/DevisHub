import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Project } from '../types';
import { GlassPanel } from '../components/common/GlassPanel';
import { Badge } from '../components/common/Badge';
import { FolderGit2, Star, Eye, Plus, Search, Sparkles, ExternalLink } from 'lucide-react';

export const ExploreProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [techFilter, setTechFilter] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res: any = await api.get(`/projects?search=${searchTerm}&tech=${techFilter}`);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [searchTerm, techFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="cyan">PROJECT SHOWCASE</Badge>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-2">Discover Open Source Repositories</h1>
          <p className="text-sm text-slate-400">Explore software architecture, documentation, and live developer demos</p>
        </div>

        <Link
          to="/projects/new"
          className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:brightness-110 flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Create Project Page
        </Link>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search project name, technology, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-darkNavy text-sm text-slate-200 pl-9 pr-4 py-2.5 rounded-xl border border-cyan-500/20 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2">
          {['', 'Rust', 'TypeScript', 'React', 'Node.js'].map((tech) => (
            <button
              key={tech}
              onClick={() => setTechFilter(tech)}
              className={`px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                techFilter === tech
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-darkNavy text-slate-400 border border-white/10 hover:text-slate-200'
              }`}
            >
              {tech || 'All Tech'}
            </button>
          ))}
        </div>
      </div>

      {/* PROJECT CARDS GRID */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 font-mono text-xs">
          <Sparkles className="w-6 h-6 text-cyan-400 animate-spin mx-auto mb-2" />
          Loading open source projects...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <GlassPanel key={project.id} glow="cyan" className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={project.logoUrl || 'https://api.dicebear.com/7.x/identicon/svg?seed=project'}
                      alt={project.name}
                      className="w-8 h-8 rounded-lg border border-cyan-500/30 object-cover"
                    />
                    <Link to={`/projects/${project.slug}`} className="font-bold text-slate-100 text-base hover:text-cyan-300 transition-colors">
                      {project.name}
                    </Link>
                  </div>
                  <Badge variant="lime">{project.status}</Badge>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {project.shortDescription}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.technologies?.map((tech) => (
                    <Badge key={tech.id} variant="outline" size="sm">
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <img
                    src={project.owner.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                    alt={project.owner.name}
                    className="w-5 h-5 rounded-full border border-cyan-500/40"
                  />
                  <span>@{project.owner.username}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400/20" />
                    {project._count?.stars || project.stars?.length || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    {project.viewCount}
                  </span>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
};
