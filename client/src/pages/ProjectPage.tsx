import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Project, ProjectDocument } from '../types';
import { GlassPanel } from '../components/common/GlassPanel';
import { Badge } from '../components/common/Badge';
import { MarkdownViewer } from '../components/common/MarkdownViewer';
import { Star, Bookmark, ExternalLink, Github, FileText, Code, Users, Eye, Sparkles, BookOpen } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const ProjectPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated, demoLogin } = useAuthStore();
  const [project, setProject] = useState<Project | null>(null);
  const [activeDoc, setActiveDoc] = useState<ProjectDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [starred, setStarred] = useState(false);
  const [starsCount, setStarsCount] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res: any = await api.get(`/projects/${slug}`);
        setProject(res.data);
        setStarred(res.data.isStarred || false);
        setStarsCount(res.data.starsCount || 0);

        if (res.data.documents && res.data.documents.length > 0) {
          setActiveDoc(res.data.documents[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  const handleStarToggle = async () => {
    if (!isAuthenticated) {
      await demoLogin('alex_dev');
    }
    if (!project) return;

    try {
      const res: any = await api.post(`/projects/${project.id}/star`);
      setStarred(res.data.starred);
      setStarsCount((prev) => (res.data.starred ? prev + 1 : prev - 1));
    } catch (err: any) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-24 text-slate-400 font-mono text-xs">
        <Sparkles className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
        Loading project documentation...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-100">Project Not Found</h2>
        <Link to="/projects" className="text-cyan-400 text-sm hover:underline mt-4 inline-block">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER HERO */}
      <GlassPanel glow="cyan" className="space-y-6 bg-darkNavy/90">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={project.logoUrl || 'https://api.dicebear.com/7.x/identicon/svg?seed=project'}
              alt={project.name}
              className="w-16 h-16 rounded-2xl border border-cyan-500/40 object-cover shadow-[0_0_20px_rgba(0,240,255,0.2)]"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{project.name}</h1>
                <Badge variant="lime">{project.status}</Badge>
              </div>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">{project.shortDescription}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleStarToggle}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold font-mono border flex items-center justify-center gap-2 transition-all ${
                starred
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:border-amber-500/40'
              }`}
            >
              <Star className={`w-4 h-4 ${starred ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{starred ? 'Starred' : 'Star'} ({starsCount})</span>
            </button>

            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-darkViolet border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                Repository
              </a>
            )}

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Tech Badges & Owner */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">Maintained by</span>
            <Link to={`/profile/${project.owner.username}`} className="flex items-center gap-1.5 text-cyan-300 font-semibold hover:underline">
              <img
                src={project.owner.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                alt={project.owner.name}
                className="w-5 h-5 rounded-full border border-cyan-500/40"
              />
              @{project.owner.username}
            </Link>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {project.technologies?.map((tech) => (
              <Badge key={tech.id} variant="cyan" size="sm">
                {tech.name}
              </Badge>
            ))}
          </div>
        </div>
      </GlassPanel>

      {/* DOCUMENTATION PORTAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-4">
          <GlassPanel glow="violet" className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-300 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-purple-400" />
              Documentation Tabs
            </div>

            <div className="space-y-1">
              {project.documents?.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setActiveDoc(doc)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all ${
                    activeDoc?.id === doc.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  {doc.title}
                </button>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Markdown Content Area */}
        <div className="lg:col-span-3">
          <GlassPanel glow="cyan" className="p-8 bg-darkNavy/90 min-h-[500px]">
            {activeDoc ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h2 className="text-xl font-bold text-slate-100 font-mono">{activeDoc.title}</h2>
                  <span className="text-[11px] font-mono text-slate-400">
                    Updated {new Date(activeDoc.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <MarkdownViewer content={activeDoc.content} />
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 font-mono text-xs">
                No documentation available for this project.
              </div>
            )}
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
