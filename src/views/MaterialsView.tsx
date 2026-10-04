import React, { useState } from 'react';
import {
  Files,
  Upload,
  FileText,
  Image,
  Trash2,
  Download,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { StudyMaterial, Subject } from '../types';
import { StorageManager } from '../services/storage';
import { useToast } from '../context/ToastContext';

interface MaterialsViewProps {
  subjects: Subject[];
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({ subjects }) => {
  const { addToast } = useToast();
  const [materials, setMaterials] = useState<StudyMaterial[]>(() => StorageManager.getMaterials());
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);

  // Form states for manual or simulated upload
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState(subjects[0]?.name || 'Data Structures & Algorithms');
  const [newFileType, setNewFileType] = useState<'pdf' | 'document' | 'image'>('pdf');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredMaterials = materials.filter((m) => {
    const matchesSubject = filterSubject === 'all' || m.subjectName === filterSubject;
    const matchesQuery =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesQuery;
  });

  const handleDelete = (id: string) => {
    const updated = StorageManager.deleteMaterial(id);
    setMaterials(updated);
    if (selectedMaterial?.id === id) setSelectedMaterial(null);
    addToast({ type: 'info', title: 'File Removed', message: 'Material deleted from storage' });
  };

  const handleSimulateDownload = (mat: StudyMaterial) => {
    // Generate a simple text blob simulating downloading the material
    const blob = new Blob(
      [
        `VIVORA AI Study Material\nTitle: ${mat.title}\nSubject: ${mat.subjectName}\nSummary: ${
          mat.aiSummary || 'No AI summary generated yet'
        }\nExported: ${new Date().toISOString()}`,
      ],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mat.fileName.endsWith('.txt') ? mat.fileName : `${mat.fileName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'success', title: 'Download Started', message: `Downloaded ${mat.fileName}` });
  };

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsUploading(true);
    setTimeout(() => {
      const ext = newFileType === 'pdf' ? '.pdf' : newFileType === 'image' ? '.png' : '.docx';
      const cleanFileName = newTitle.toLowerCase().replace(/[^a-z0-9]/g, '_') + ext;

      const newMat: StudyMaterial = {
        id: 'mat_' + Date.now(),
        userId: 'usr_vivora_student_1',
        subjectName: newSubject,
        title: newTitle,
        description: `Uploaded resource for ${newSubject} exam preparation.`,
        fileName: cleanFileName,
        fileSizeBytes: Math.floor(Math.random() * 2000000 + 500000),
        fileType: newFileType,
        storageBucket: 'study_materials',
        tags: [newSubject, 'Exam Review'],
        isAnalyzedByAi: true,
        aiSummary: `High-yield synthesis: Focuses on core operational definitions and step-by-step algorithms in ${newSubject}.`,
        createdAt: new Date().toISOString(),
      };

      const updated = StorageManager.saveMaterial(newMat);
      setMaterials(updated);
      setIsUploading(false);
      setShowUploadModal(false);
      setNewTitle('');

      addToast({
        type: 'success',
        title: 'Material Uploaded',
        message: `${cleanFileName} safely synced to Supabase Storage`,
      });
    }, 700);
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent border border-cyan-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Supabase Storage Vault
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Study Materials & Notes
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Upload your lecture slides, textbook excerpts, and handwritten notes.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Material</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes and files..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setFilterSubject('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterSubject === 'all'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            All Subjects
          </button>
          {subjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setFilterSubject(sub.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterSubject === sub.name
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((mat) => (
          <div
            key={mat.id}
            className="p-5 rounded-2xl glass-panel relative group hover:border-cyan-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  {mat.fileType === 'pdf' ? (
                    <FileText className="w-4 h-4" />
                  ) : mat.fileType === 'image' ? (
                    <Image className="w-4 h-4" />
                  ) : (
                    <Files className="w-4 h-4" />
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSimulateDownload(mat)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Download document"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(mat.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                {mat.subjectName}
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5 mb-1 group-hover:text-cyan-300 transition-colors">
                {mat.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{mat.description}</p>

              {/* AI Summary badge */}
              {mat.aiSummary && (
                <div className="mt-3 p-2.5 rounded-xl bg-black/40 border border-white/[0.06] text-[11px] text-slate-300 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{mat.aiSummary}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
              <span>{mat.fileName}</span>
              <span>{formatFileSize(mat.fileSizeBytes)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowUploadModal(false)} />
          <div className="relative w-full max-w-md bg-[#0e111a] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 space-y-4 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-white">Upload to Supabase Storage</h3>
            <p className="text-xs text-slate-400">
              Files are securely stored in the private student bucket.
            </p>

            <form onSubmit={handleSimulateUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Graph Algorithms Final Review"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">File Format</label>
                <select
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="pdf">PDF Document (*.pdf)</option>
                  <option value="document">Word/Text Note (*.docx, *.txt)</option>
                  <option value="image">Image/Scan (*.png, *.jpg)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/25 flex items-center gap-2"
                >
                  {isUploading ? 'Uploading...' : 'Confirm Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
