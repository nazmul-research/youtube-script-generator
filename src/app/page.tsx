'use client';

import { useState, useEffect } from 'react';
import { ScriptConcept, ApiResponse } from '@/lib/types';
import { Sparkles, Loader2, Youtube, ArrowRight, Play, Layout, Image as ImageIcon, X, FileText, Check, Copy } from 'lucide-react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [scripts, setScripts] = useState<ScriptConcept[]>([]);
  const [error, setError] = useState('');
  const [selectedScript, setSelectedScript] = useState<ScriptConcept | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCopy = async (text: string) => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

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

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Server error');
      }

      const data: ApiResponse = await res.json();
      if (data.scripts) {
        setScripts(data.scripts);
      } else {
        throw new Error('No scripts generated');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your API keys.');
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <nav className="border-b bg-white py-4 px-6 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-red-600">
            <Youtube size={28} />
            <span>TubeScript AI</span>
          </div>
          <div className="text-sm text-slate-500">v1.0</div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Generate Viral YouTube Scripts</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Analyze trends and generate scripts in seconds.</p>
        </div>

        {/* Form */}
        <div className="max-w-xl mx-auto bg-white p-6 border rounded-xl shadow-sm mb-12">
          <form onSubmit={handleGenerate} className="space-y-4">
            <input
              type="text"
              placeholder="Enter video topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              {loading ? 'Generating...' : 'Generate 3 Variations'}
            </button>
          </form>
          {error && <p className="mt-3 text-red-600 text-sm text-center font-medium">{error}</p>}
        </div>

        {/* Results */}
        {scripts.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {scripts.map((script, idx) => (
              <div key={idx} className="border rounded-xl p-6 bg-white flex flex-col hover:border-red-200 transition-colors">
                <div className="text-xs font-bold text-red-500 mb-2 uppercase">Concept {idx + 1}</div>
                <h3 className="text-lg font-bold mb-4">{script.title}</h3>
                <div className="text-sm text-slate-600 mb-6 flex-1 italic">"{script.hook.substring(0, 100)}..."</div>
                <button 
                  onClick={() => setSelectedScript(script)}
                  className="w-full py-2 bg-slate-50 border rounded-lg font-bold text-sm hover:bg-slate-100 flex items-center justify-center gap-2"
                >
                  View Script <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-bold truncate pr-4">{selectedScript.title}</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleCopy(selectedScript.fullScript)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                  title="Copy"
                >
                  {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                </button>
                <button 
                  onClick={() => setSelectedScript(null)}
                  className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto bg-slate-50 space-y-6">
              <div>
                <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-red-600"><Play size={14} /> Opening Hook</h4>
                <p className="p-4 bg-white border rounded-lg text-sm italic">"{selectedScript.hook}"</p>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-blue-600"><ImageIcon size={14} /> Thumbnail Idea</h4>
                <p className="p-4 bg-white border rounded-lg text-sm">{selectedScript.thumbnailIdea}</p>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-slate-700"><FileText size={14} /> Full Script Content</h4>
                <div className="p-4 bg-white border rounded-lg text-sm whitespace-pre-wrap leading-relaxed">
                  {selectedScript.fullScript}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
