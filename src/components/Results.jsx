import React from 'react';
import { Stars, Target, TriangleAlert } from 'lucide-react';

export default function Results({ requiredSkills, candidates, onAnalyze }) {
  const [ranked, setRanked] = React.useState([]);

  const analyze = () => {
    const out = candidates.map((c) => scoreCandidate(c, requiredSkills));
    out.sort((a, b) => b.score - a.score);
    setRanked(out);
    onAnalyze?.(out);
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border p-5 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Results</h2>
        <button
          onClick={analyze}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-700"
        >
          <Target size={16}/> Analyze & Rank
        </button>
      </div>

      {ranked.length === 0 ? (
        <p className="text-sm text-slate-600">Add job requirements and candidates, then run the analyzer to see rankings and missing skills.</p>
      ) : (
        <div className="space-y-3">
          {ranked.map((r, idx) => (
            <div key={r.id} className="border rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-semibold">{idx + 1}</div>
                  <div>
                    <h3 className="font-medium">{r.name}</h3>
                    <p className="text-xs text-slate-500">Match score: <strong>{Math.round(r.score * 100)}%</strong></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge label={`${r.matchedSkills.length} matched`} color="emerald" />
                  <Badge label={`${r.missingSkills.length} missing`} color="rose" />
                </div>
              </div>

              <div className="mt-3 grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Matched skills</p>
                  <div className="flex flex-wrap gap-2">
                    {r.matchedSkills.length ? r.matchedSkills.map((s) => (
                      <span key={s} className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{s}</span>
                    )) : <span className="text-xs text-slate-500">None</span>}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Missing skills</p>
                  <div className="flex flex-wrap gap-2">
                    {r.missingSkills.length ? r.missingSkills.map((s) => (
                      <span key={s} className="px-2.5 py-1 text-xs rounded-full bg-rose-50 text-rose-700 border border-rose-100 inline-flex items-center gap-1"><TriangleAlert size={12}/> {s}</span>
                    )) : <span className="text-xs text-slate-500">None 🎉</span>}
                  </div>
                </div>
              </div>

              {r.notesSnippet && (
                <p className="mt-3 text-sm text-slate-600 line-clamp-3"><span className="font-medium">Highlights:</span> {r.notesSnippet}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Badge({ label, color = 'slate' }) {
  const map = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  return <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border ${map[color]}`}>{label}</span>;
}

// Simple heuristic scorer to approximate AI matching
function scoreCandidate(candidate, requiredSkills) {
  const norm = (s) => s.toLowerCase();
  const req = Array.from(new Set(requiredSkills.map(norm)));

  // derive candidate declared skills + extract from notes
  const declared = new Set((candidate.skills || []).map(norm));
  const extracted = extractSkillsFromText(candidate.notes || '', req);
  extracted.forEach((s) => declared.add(s));

  const matched = req.filter((s) => declared.has(s));
  const missing = req.filter((s) => !declared.has(s));

  // additional soft signals: keyword density and years of experience
  const text = (candidate.notes || '').toLowerCase();
  const density = req.length ? matched.map((s) => occurrences(text, s)).reduce((a,b)=>a+b,0) / (req.length * 3) : 0; // scaled
  const years = estimateYears(text); // 0..1 scaled

  // Weighted score: 70% skills match, 20% density, 10% years
  const skillScore = req.length ? (matched.length / req.length) : 0;
  const score = clamp(0, 1, skillScore * 0.7 + density * 0.2 + years * 0.1);

  return {
    id: candidate.id,
    name: candidate.name,
    score,
    matchedSkills: matched,
    missingSkills: missing,
    notesSnippet: summarizeText(candidate.notes || ''),
  };
}

function extractSkillsFromText(text, required) {
  const t = text.toLowerCase();
  const found = new Set();
  // prioritize exact required skills
  required.forEach((s) => { if (t.includes(s)) found.add(s); });
  // also look for common related tech keywords
  const common = ['react', 'vue', 'angular', 'node', 'express', 'python', 'django', 'flask', 'fastapi', 'java', 'spring', 'kotlin', 'swift', 'go', 'rust', 'php', 'laravel', 'ruby', 'rails', 'sql', 'postgres', 'mysql', 'mongodb', 'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'terraform', 'graphql', 'rest', 'html', 'css', 'tailwind', 'typescript', 'javascript', 'pandas', 'numpy', 'pytorch', 'tensorflow'];
  common.forEach((s) => { if (t.includes(s)) found.add(s); });
  return Array.from(found);
}

function occurrences(text, phrase) {
  if (!phrase) return 0;
  const rx = new RegExp(phrase.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
  return (text.match(rx) || []).length;
}

function estimateYears(text) {
  // crude: look for patterns like "X years"  and cap at 10
  const rx = /(\d+)\s+years?/g;
  let m, max = 0;
  while ((m = rx.exec(text))) {
    const n = parseInt(m[1], 10);
    if (!Number.isNaN(n)) max = Math.max(max, n);
  }
  return Math.min(1, max / 10);
}

function clamp(min, max, v) { return Math.max(min, Math.min(max, v)); }

function summarizeText(text) {
  const t = text.trim().replace(/\s+/g, ' ');
  return t.split(' ').slice(0, 40).join(' ');
}
