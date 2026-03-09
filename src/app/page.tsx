'use client';

import { useState, useEffect } from 'react';
import { ScriptConcept, ApiResponse } from '@/lib/types';
import { Sparkles, Loader2, Youtube, ArrowRight, Play, Layout, Image as ImageIcon, X, FileText } from 'lucide-react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [scripts, setScripts] = useState<ScriptConcept[]>([]);
  const [error, setError] = useState('');
  const [selectedScript, setSelectedScript] = useState<ScriptConcept | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError('');
    setScripts([]);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      const data: ApiResponse = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.scripts) setScripts(data.scripts);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      {/* Header */}
      <nav className="border-b bg-white py-4 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-red-600">
            <Youtube size={28} />
            <span>TubeScript AI</span>
          </div>
          <div className="text-sm font-medium text-slate-500">SaaS MVP v1.0</div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-400">
            Generate Viral YouTube Scripts
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our AI analyzes YouTube trends to generate data-driven hooks, titles, and 5-minute scripts optimized for retention.
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100 mb-16">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label htmlFor="topic" className="block text-sm font-semibold text-slate-700 mb-2">
                What is your video topic?
              </label>
              <input
                id="topic"
                type="text"
                placeholder="e.g., How to cook the perfect steak, React for Beginners..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-red-200"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Analyzing YouTube Trends...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate 3 Script Variations
                </>
              )}
            </button>
          </form>
          {error && <p className="mt-4 text-red-500 text-sm text-center font-medium">⚠️ {error}</p>}
        </div>

        {/* Results Section */}
        {scripts.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {scripts.map((script, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-100 flex flex-col hover:scale-[1.02] transition-transform">
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-wider mb-3">
                    <Layout size={14} />
                    Concept {idx + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-4 line-clamp-2 leading-tight">
                    {script.title}
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                        <Play size={14} className="text-red-600" />
                        The Hook
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed italic bg-slate-50 p-3 rounded-lg border-l-4 border-red-500">
                        "{script.hook}"
                      </p>
                    </div>

                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                        <ImageIcon size={14} className="text-blue-500" />
                        Thumbnail Idea
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {script.thumbnailIdea}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100">
                  <button 
                    onClick={() => setSelectedScript(script)}
                    className="w-full bg-white hover:bg-slate-100 text-slate-800 font-bold py-3 rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    View Full 5-Min Script
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Script Modal */}
      {isMounted && selectedScript && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg text-red-600">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold line-clamp-1">{selectedScript.title}</h2>
                  <p className="text-sm text-slate-500 font-medium">Full Video Script Outline</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedScript(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              <div className="prose prose-slate max-w-none">
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-6 bg-red-600 rounded-full"></span>
                    Script Content
                  </h3>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedScript.fullScript}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                    <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                      <Play size={16} />
                      Opening Hook
                    </h4>
                    <p className="text-red-900/80 italic">"{selectedScript.hook}"</p>
                  </div>
                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                    <h4 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                      <ImageIcon size={16} />
                      Thumbnail Concept
                    </h4>
                    <p className="text-blue-900/80">{selectedScript.thumbnailIdea}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedScript(null)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all"
              >
                Close Script
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
