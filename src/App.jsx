import React from 'react';
import Header from './components/Header';
import JobSetup from './components/JobSetup';
import ResumeDropzone from './components/ResumeDropzone';
import CandidateEditor from './components/CandidateEditor';
import Results from './components/Results';

export default function App() {
  const [jobDescription, setJobDescription] = React.useState('');
  const [requiredSkills, setRequiredSkills] = React.useState([]);
  const [candidates, setCandidates] = React.useState([]);

  const updateJob = (patch) => {
    if (patch.jobDescription !== undefined) setJobDescription(patch.jobDescription);
    if (patch.requiredSkills !== undefined) setRequiredSkills(patch.requiredSkills);
  };

  const addFiles = (items) => {
    setCandidates((prev) => [...prev, ...items]);
  };

  const removeCandidate = (id) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCandidate = (id, patch) => {
    setCandidates((prev) => prev.map((c) => c.id === id ? { ...c, ...patch } : c));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <div className="grid lg:grid-cols-2 gap-6">
          <JobSetup
            jobDescription={jobDescription}
            requiredSkills={requiredSkills}
            onUpdate={updateJob}
          />
          <ResumeDropzone
            candidates={candidates}
            onAddFiles={addFiles}
            onRemove={removeCandidate}
          />
        </div>

        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <CandidateEditor
            candidates={candidates}
            onUpdateCandidate={updateCandidate}
          />
          <Results
            requiredSkills={requiredSkills}
            candidates={candidates}
          />
        </div>

        <footer className="text-center text-xs text-slate-500 mt-10">
          This is an AI-inspired local analyzer. For production-grade accuracy, connect to a backend parsing service (PDF/DOC/IMG OCR) and LLM ranking.
        </footer>
      </main>
    </div>
  );
}
