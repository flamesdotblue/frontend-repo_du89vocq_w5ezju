import React from 'react';
import { Rocket, FileSearch, Users } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center"><Rocket size={20} /></div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Smart ATS</h1>
            <p className="text-xs text-slate-500 -mt-0.5">AI-inspired resume screening</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-slate-600">
          <span className="inline-flex items-center gap-2 text-sm"><FileSearch size={16}/> Parse</span>
          <span className="inline-flex items-center gap-2 text-sm"><Users size={16}/> Rank</span>
        </div>
      </div>
    </header>
  );
}
