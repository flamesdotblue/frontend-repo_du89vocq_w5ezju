import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function JobSetup({ jobDescription, requiredSkills, onUpdate }) {
  const [skillInput, setSkillInput] = useState('');

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s) return;
    const updated = Array.from(new Set([...requiredSkills, normalizeSkill(s)]));
    onUpdate({ requiredSkills: updated });
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    const updated = requiredSkills.filter((s) => s !== skill);
    onUpdate({ requiredSkills: updated });
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border p-5 md:p-6">
      <h2 className="text-lg font-semibold mb-3">Job Requirements</h2>
      <label className="block text-sm font-medium text-slate-700 mb-2">Job description</label>
      <textarea
        value={jobDescription}
        onChange={(e) => onUpdate({ jobDescription: e.target.value })}
        placeholder="Paste the role summary, responsibilities, and desired qualifications."
        rows={5}
        className="w-full rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3"
      />

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Required skills</label>
        <div className="flex items-center gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
            placeholder="e.g. React, Python, SQL"
            className="flex-1 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5"
          />
          <button
            onClick={addSkill}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-700"
          >
            <Plus size={16}/> Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {requiredSkills.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full px-3 py-1 text-xs">
              {s}
              <button aria-label={`remove ${s}`} onClick={() => removeSkill(s)} className="text-indigo-500 hover:text-indigo-700"><X size={14}/></button>
            </span>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-3">Tip: Add skills you care about most. The ranking engine prioritizes exact skill matches and related keywords.</p>
    </section>
  );
}

function normalizeSkill(s) {
  return s.toLowerCase().replace(/[^a-z0-9+#.]/g, ' ').replace(/\s+/g, ' ').trim();
}
