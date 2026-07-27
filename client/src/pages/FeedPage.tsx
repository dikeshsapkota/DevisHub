import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import { Post } from '../types';
import { GlassPanel } from '../components/common/GlassPanel';
import { Badge } from '../components/common/Badge';
import { MarkdownViewer } from '../components/common/MarkdownViewer';
import { Code, MessageSquare, Bookmark, Share2, Sparkles, Send, CheckCircle2, Rocket, Bug, ThumbsUp, Lightbulb } from 'lucide-react';

export const FeedPage: React.FC = () => {
  const { user, isAuthenticated, demoLogin } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // New post form state
  const [newContent, setNewContent] = useState('');
  const [postType, setPostType] = useState<'TEXT' | 'CODE_SNIPPET' | 'PROJECT_UPDATE' | 'QUESTION'>('TEXT');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLang, setCodeLang] = useState('typescript');
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res: any = await api.get(`/posts?filter=${filter}`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    if (!isAuthenticated) {
      await demoLogin('alex_dev');
    }

    try {
      await api.post('/posts', {
        content: newContent,
        type: postType,
        codeSnippet: postType === 'CODE_SNIPPET' ? codeSnippet : undefined,
        codeLang: postType === 'CODE_SNIPPET' ? codeLang : undefined,
      });
      setNewContent('');
      setCodeSnippet('');
      fetchPosts();
    } catch (err: any) {
      alert(err.message || 'Failed to create post');
    }
  };

  const handleReaction = async (postId: string, reactionType: string) => {
    if (!isAuthenticated) {
      await demoLogin('alex_dev');
    }
    try {
      await api.post(`/posts/${postId}/react`, { type: reactionType });
      fetchPosts();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentText[postId];
    if (!text || !text.trim()) return;

    try {
      await api.post(`/posts/${postId}/comments`, { content: text });
      setCommentText({ ...commentText, [postId]: '' });
      fetchPosts();
    } catch (err: any) {
      console.error(err);
    }
  };

  const reactionsList = [
    { type: 'SHIP_IT', label: 'Ship it!', icon: Rocket, color: 'text-emerald-400' },
    { type: 'DEBUGGED', label: 'Debugged', icon: Bug, color: 'text-cyan-400' },
    { type: 'BRILLIANT', label: 'Brilliant', icon: Sparkles, color: 'text-purple-400' },
    { type: 'USEFUL', label: 'Useful', icon: Lightbulb, color: 'text-amber-400' },
    { type: 'LIKE', label: 'Like', icon: ThumbsUp, color: 'text-blue-400' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* POST CREATION PANEL */}
      <GlassPanel glow="cyan" className="space-y-4 bg-darkNavy/80">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
            alt="User"
            className="w-10 h-10 rounded-full border border-cyan-500/40 object-cover"
          />
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">
              {user ? `Publish update as @${user.username}` : 'Join the conversation'}
            </h3>
            <p className="text-xs text-slate-400">Share code snippets, project releases, or technical questions</p>
          </div>
        </div>

        <form onSubmit={handleCreatePost} className="space-y-4">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="What are you building or debugged today? (Markdown supported)"
            rows={3}
            className="w-full bg-obsidian text-sm text-slate-200 p-3 rounded-lg border border-cyan-500/20 focus:outline-none focus:border-cyan-400"
          />

          {postType === 'CODE_SNIPPET' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-cyan-400 font-mono">
                <span>Code Block Editor</span>
                <select
                  value={codeLang}
                  onChange={(e) => setCodeLang(e.target.value)}
                  className="bg-obsidian border border-cyan-500/30 rounded px-2 py-0.5"
                >
                  <option value="typescript">TypeScript</option>
                  <option value="rust">Rust</option>
                  <option value="python">Python</option>
                  <option value="go">Go</option>
                  <option value="sql">SQL</option>
                </select>
              </div>
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="// Write code snippet here..."
                rows={4}
                className="w-full bg-obsidian font-mono text-xs text-cyan-300 p-3 rounded-lg border border-cyan-500/30 focus:outline-none"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPostType('TEXT')}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  postType === 'TEXT' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
                }`}
              >
                Text
              </button>
              <button
                type="button"
                onClick={() => setPostType('CODE_SNIPPET')}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  postType === 'CODE_SNIPPET' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400'
                }`}
              >
                Code Snippet
              </button>
              <button
                type="button"
                onClick={() => setPostType('QUESTION')}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  postType === 'QUESTION' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400'
                }`}
              >
                Question
              </button>
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:brightness-110 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Publish Post
            </button>
          </div>
        </form>
      </GlassPanel>

      {/* FEED FILTER TABS */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        {['all', 'following', 'projects'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
              filter === tab
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'all' ? 'For You' : tab}
          </button>
        ))}
      </div>

      {/* FEED POSTS LIST */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 font-mono text-xs">
          <Sparkles className="w-6 h-6 text-cyan-400 animate-spin mx-auto mb-2" />
          Loading developer feed...
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-slate-400 font-mono text-xs">
          No posts found for this filter.
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <GlassPanel key={post.id} glow="cyan" className="space-y-4">
              {/* Post Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full border border-cyan-500/30 object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-sm">{post.author.name}</span>
                      <span className="text-xs text-slate-400 font-mono">@{post.author.username}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Badge variant={post.type === 'CODE_SNIPPET' ? 'violet' : 'cyan'}>
                  {post.type}
                </Badge>
              </div>

              {/* Post Content */}
              <MarkdownViewer content={post.content} />

              {/* Code Snippet Block */}
              {post.codeSnippet && (
                <div className="bg-obsidian border border-cyan-500/30 rounded-xl p-4 font-mono text-xs text-cyan-300 overflow-x-auto">
                  <div className="text-[10px] text-slate-400 mb-2 uppercase tracking-wider">
                    {post.codeLang || 'Code Snippet'}
                  </div>
                  <pre><code>{post.codeSnippet}</code></pre>
                </div>
              )}

              {/* Reaction Bar & Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  {reactionsList.map((r) => {
                    const Icon = r.icon;
                    const isSelected = post.userReaction === r.type;
                    const count = post.reactions?.filter((x) => x.type === r.type).length || 0;
                    return (
                      <button
                        key={r.type}
                        onClick={() => handleReaction(post.id, r.type)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md border transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${r.color}`} />
                        <span>{count > 0 && count}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3 text-slate-400 font-mono">
                  <span>{post.comments?.length || 0} Comments</span>
                </div>
              </div>

              {/* Comments Section */}
              <div className="pt-2 space-y-3">
                {post.comments?.map((comment) => (
                  <div key={comment.id} className="bg-darkNavy/50 border border-white/5 rounded-lg p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">@{comment.author.username}</span>
                      <span className="text-[10px] text-slate-500">{new Date(comment.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-300">{comment.content}</p>
                  </div>
                ))}

                {/* Comment Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a technical reply..."
                    value={commentText[post.id] || ''}
                    onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                    className="flex-1 bg-obsidian text-xs text-slate-200 px-3 py-1.5 rounded-lg border border-cyan-500/20 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
};
