import React, { useRef } from 'react';
import { Upload, FileText, Image, File, Trash2 } from 'lucide-react';

const ACCEPT = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'text/plain': 'TXT',
  'image/png': 'PNG',
  'image/jpeg': 'JPG',
};

export default function ResumeDropzone({ candidates, onAddFiles, onRemove }) {
  const inputRef = useRef(null);

  const handleFiles = async (files) => {
    const list = Array.from(files || []);
    if (!list.length) return;
    const mapped = await Promise.all(list.map(async (file) => {
      let extractedText = '';
      if (file.type === 'text/plain') {
        extractedText = await file.text();
      }
      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name.replace(/\.[^.]+$/, ''),
        file,
        notes: extractedText || '',
        skills: [],
      };
    }));
    onAddFiles(mapped);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border p-5 md:p-6">
      <h2 className="text-lg font-semibold mb-3">Resumes</h2>
      <div
        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
        onDrop={onDrop}
        className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition"
      >
        <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2">
          <Upload />
        </div>
        <p className="text-sm text-slate-700">Drag and drop resumes here, or</p>
        <button
          onClick={() => inputRef.current?.click()}
          className="mt-2 inline-flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-xl text-sm hover:bg-indigo-700"
        >Choose files</button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={Object.keys(ACCEPT).join(',')}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="text-xs text-slate-500 mt-2">Supported: PDF, DOC, DOCX, TXT, PNG, JPG</p>
      </div>

      {candidates.length > 0 && (
        <div className="mt-4 space-y-2">
          {candidates.map((c) => (
            <div key={c.id} className="flex items-center justify-between border rounded-xl p-3">
              <div className="flex items-center gap-3 min-w-0">
                <FileIcon type={c.file.type} />
                <div className="min-w-0">
                  <p className="font-medium truncate max-w-[50vw]">{c.name}</p>
                  <p className="text-xs text-slate-500 truncate">{c.file.type || 'Unknown'} • {(c.file.size/1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button onClick={() => onRemove(c.id)} className="text-slate-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function FileIcon({ type }) {
  if (type?.includes('image')) return <div className="h-9 w-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center"><Image size={18}/></div>;
  if (type === 'text/plain') return <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center"><FileText size={18}/></div>;
  if (type?.includes('pdf')) return <div className="h-9 w-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center"><File size={18}/></div>;
  return <div className="h-9 w-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center"><File size={18}/></div>;
}
