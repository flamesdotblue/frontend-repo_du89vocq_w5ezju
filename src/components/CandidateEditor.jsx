import React from 'react';
import { BadgeCheck } from 'lucide-react';

export default function CandidateEditor({ candidates, onUpdateCandidate }) {
  if (!candidates.length) return null;

  const handleSkillAdd = (id, value) => {
    const s = normalizeSkill(value);
    if (!s) return;
    const c = candidates.find((x) => x.id === id);
    const updated = Array.from(new Set([...(c.skills || []), s]));
    onUpdateCandidate(id, { skills: updated });
  };

  const handleRemoveSkill = (id, skill) => {
    const c = candidates.find((x) => x.id === id);
    const updated = (c.skills || []).filter((s) => s !== skill);
    onUpdateCandidate(id, { skills: updated });
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border p-5 md:p-6">
      <h2 className="text-lg font-semibold mb-3">Annotate Candidates</h2>
      <p className="text-sm text-slate-600 mb-4">Optionally paste text from each resume and add any known skills. This improves ranking accuracy and missing-skill detection.</p>
      <div className="space-y-6">
        {candidates.map((c) => (
          <div key={c.id} className="border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{c.name}</h3>
                <p className="text-xs text-slate-500">Manually curated skills and notes</p>
              </div>
              {(c.skills?.length || 0) > 0 && (
                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1 text-xs">
                  <BadgeCheck size={14}/> {c.skills.length} skills
                </span>
              )}
            </div>

            <div className="mt-3 grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Resume notes / extracted text</label>
                <textarea
                  value={c.notes || ''}
                  onChange={(e) => onUpdateCandidate(c.id, { notes: e.target.value })}
                  rows={6}
                  placeholder="Paste relevant sections from the candidate's resume."
                  className="w-full rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Skills</label>
                <SkillInput
                  value=""
                  onAdd={(val) => handleSkillAdd(c.id, val)}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {(c.skills || []).map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 rounded-full px-3 py-1 text-xs">
                      {s}
                      <button className="text-slate-500 hover:text-slate-700" onClick={() => handleRemoveSkill(c.id, s)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SkillInput({ value = '', onAdd }) {
  const [v, setV] = React.useState(value);
  return (
    <div className="flex items-center gap-2">
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAdd(v); setV(''); } }}
        placeholder="Type a skill and press Enter"
        className="flex-1 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5"
      />
      <button onClick={() => { onAdd(v); setV(''); }} className="rounded-xl bg-slate-800 text-white px-3 py-2 text-sm hover:bg-black">Add</button>
    </div>
  );
}

function normalizeSkill(s) {
  return s.toLowerCase().replace(/[^a-z0-9+#.]/g, ' ').replace(/\s+/g, ' ').trim();
}
