import React, { useState, useRef } from 'react';
import { FolderOpen, UploadCloud, FileText, Share2, Trash, Eye, HelpCircle, Sparkles, CheckSquare } from 'lucide-react';

interface MaterialsSubjectVaultSectionProps {
  onToastSuccess: (msg: string) => void;
}

export const MaterialsSubjectVaultSection: React.FC<MaterialsSubjectVaultSectionProps> = ({ onToastSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [files, setFiles] = useState([
    { id: 'f1', name: 'Trees_And_AVL_Rotations_SlideDeck.pptx', size: '14.2 MB', uploadDate: 'June 18, 2026', version: 'v1.1', type: 'presentation', creator: 'Dr. Joseph Adebayo' },
    { id: 'f2', name: 'Complexity_Anatomy_Guidebook.pdf', size: '4.8 MB', uploadDate: 'June 17, 2026', version: 'v1.0', type: 'document', creator: 'Dr. Joseph Adebayo' },
    { id: 'f3', name: 'Binary_Search_Rotator_Suite.zip', size: '2.5 MB', uploadDate: 'June 15, 2026', version: 'v2.0', type: 'archive', creator: 'Emeka Obi (RA)' }
  ]);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // Preview Drawer State
  const [activePreviewFile, setActivePreviewFile] = useState<any | null>(null);

  const handleFileRef = (selectedFile: File) => {
    setIsUploading(true);
    setUploadPercent(10);
    onToastSuccess(`Uploading file "${selectedFile.name}" to subject vault...`);

    const interval = setInterval(() => {
      setUploadPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const ext = selectedFile.name.split('.').pop() || 'txt';
            const sizeString = (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB';
            const newFileItem = {
              id: 'f-' + Math.random().toString(36).substr(2, 6),
              name: selectedFile.name,
              size: sizeString,
              uploadDate: 'Today',
              version: 'v1.0',
              type: ext === 'zip' || ext === 'rar' ? 'archive' : ext === 'pptx' || ext === 'ppt' ? 'presentation' : 'document',
              creator: 'Dr. Joseph Adebayo (You)'
            };
            setFiles((existing) => [newFileItem, ...existing]);
            setIsUploading(false);
            setUploadPercent(0);
            onToastSuccess(`File "${selectedFile.name}" fully processed & cataloged in database.`);
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const handleFileSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileRef(e.target.files[0]);
    }
  };

  const triggerUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileRef(e.dataTransfer.files[0]);
    }
  };

  const deleteFileItem = (id: string, name: string) => {
    if (confirm(`Do you wish to completely delete "${name}"?`)) {
      setFiles(prev => prev.filter(f => f.id !== id));
      if (activePreviewFile?.id === id) setActivePreviewFile(null);
      onToastSuccess("File erased from subject files.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs" style={{ color: '#E1E1E1' }}>
      
      {/* Header */}
      <div className="bg-[#2B2B2B] p-4 rounded-xl border border-slate-800 flex justify-between items-center shadow-lg">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <FolderOpen className="text-[#7B83EB]" size={18} />
            Materials & Course Subject Vault
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Drag & drop files sharing, sub-version trace logs, and inline PDF readers</p>
        </div>
        <span className="text-[10px] uppercase font-bold text-[#7B83EB] bg-[#6264A7]/20 border border-[#6264A7]/30 px-3 py-1 rounded-full">
          Cloud File Manager
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Core files catalog listing column - lg:col-span-8 */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Upload Drag Drop Zone */}
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`cursor-pointer p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition duration-300 relative ${
              dragActive 
                ? 'bg-[#6264A7]/20 border-[#7B83EB]' 
                : 'bg-[#2B2B2B]/44 border-slate-700/60 hover:bg-[#2B2B2B]/75 hover:border-[#6264A7]'
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              onChange={handleFileSelectChange}
            />

            {isUploading ? (
              <div className="space-y-3 w-full max-w-xs py-2">
                <UploadCloud className="animate-bounce text-[#7B83EB] mx-auto" size={32} />
                <h4 className="font-extrabold text-white text-xs">Uploading content indices...</h4>
                {/* Progress bar container */}
                <div className="w-full bg-[#1F1F1F] rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-[#6264A7] h-1.5 transition-all duration-300" 
                    style={{ width: `${uploadPercent}%` }}
                  ></div>
                </div>
                <span className="text-[9px] text-[#7B83EB] font-bold font-mono">{uploadPercent}% Finished</span>
              </div>
            ) : (
              <div onClick={triggerUploadClick} className="space-y-2 py-4">
                <UploadCloud className="text-slate-500 mx-auto" size={32} />
                <h4 className="font-extrabold text-slate-300 text-xs">Drag & Drop Course materials here or click to browse</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Supports Slides (PPTX), PDF modules, ZIP codes (max 100MB)</p>
              </div>
            )}
          </div>

          {/* Files List Table */}
          <div className="bg-[#2B2B2B] rounded-2xl border border-slate-800 p-4 shadow-xl">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 block">
              Active Documents Catalog ({files.length})
            </h3>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase font-black tracking-wider">
                    <th className="pb-2.5">File Name</th>
                    <th className="pb-2.5">Version</th>
                    <th className="pb-2.5">Owner</th>
                    <th className="pb-2.5">Size / Date</th>
                    <th className="pb-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {files.map((file) => (
                    <tr key={file.id} className="hover:bg-[#1F1F1F]/40 transition group">
                      <td className="py-3 font-semibold text-white max-w-[200px] truncate flex items-center gap-2">
                        <FileText size={14} className={
                          file.type === 'presentation' ? 'text-amber-400' :
                          file.type === 'archive' ? 'text-indigo-400' : 'text-emerald-400'
                        } />
                        <span className="truncate">{file.name}</span>
                      </td>
                      <td className="py-3">
                        <span className="font-mono text-[10px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded font-bold text-[#7B83EB]">
                          {file.version}
                        </span>
                      </td>
                      <td className="py-3 text-slate-305">{file.creator}</td>
                      <td className="py-3">
                        <p className="font-medium text-slate-300">{file.size}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase">{file.uploadDate}</p>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex gap-1 justify-end opacity-90 group-hover:opacity-100 transition">
                          <button
                            onClick={() => setActivePreviewFile(file)}
                            className="p-1 px-2 bg-slate-800 hover:bg-[#6264A7] hover:text-white rounded transition text-[10px] font-bold flex items-center gap-1"
                            title="Preview file"
                          >
                            <Eye size={11} /> View
                          </button>
                          <button
                            onClick={() => onToastSuccess(`Broadcasting material "${file.name}" direct to Chat group payload.`)}
                            className="p-1 px-2 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 rounded transition text-[10px]"
                            title="Share with class"
                          >
                            <Share2 size={11} />
                          </button>
                          <button
                            onClick={() => deleteFileItem(file.id, file.name)}
                            className="p-1 px-2 bg-red-955 hover:bg-red-900 hover:text-white text-slate-400 rounded transition text-[10px]"
                            title="Delete File"
                          >
                            <Trash size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Preview Details drawer column - lg:col-span-4 */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-extrabold text-xs text-[#7B83EB] uppercase tracking-wider">Dynamic Inspector Shelf</h3>
          
          {activePreviewFile ? (
            <div className="bg-[#2B2B2B] border border-[#6264A7]/30 p-4.5 rounded-2xl shadow-xl space-y-4 animate-fade-in">
              <div className="flex justify-between items-start border-b border-slate-800 pb-2 flex-wrap gap-2">
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-slate-500 font-black">File Properties</span>
                  <h4 className="font-extrabold text-white text-xs mt-0.5 leading-tight">{activePreviewFile.name}</h4>
                </div>
                <button 
                  onClick={() => setActivePreviewFile(null)}
                  className="text-[9px] font-black text-slate-400 hover:text-white bg-slate-900 border border-slate-800 p-1 px-1.5 rounded-lg"
                >
                  Close X
                </button>
              </div>

              {/* PDF Document Content Reader */}
              <div className="p-3 bg-slate-900/80 rounded-xl space-y-2 border border-slate-800">
                <p className="text-[9px] text-[#7B83EB] font-mono tracking-widest font-black uppercase flex items-center gap-1">
                  <Sparkles size={11} /> Authoritative Subject Document Stream
                </p>
                <div className="text-[10.5px] text-slate-350 leading-relaxed font-sans space-y-1.5 italic">
                  <p>“...For a perfectly balanced binary search tree, rotations must execute recursively. Single left shifts settle deep right imbalances whereas double right-left rotations address cross-directional constraints.”</p>
                  <p>“...Height factor absolute boundary stays |h_left - h_right| ≤ 1. Lookup memory metrics operate at absolute linear-log height O(log_2 n).”</p>
                </div>
                <div className="pt-2.5 border-t border-slate-800 font-mono text-[9px] text-slate-500 font-bold">
                  File Signature: SHA-256_HASH_8F9C4A
                </div>
              </div>

              {/* Version History logs stack */}
              <div className="space-y-2.5">
                <h5 className="font-bold text-[9px] uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
                  Document Version Logs
                </h5>
                <div className="space-y-1.5 font-mono text-[9.5px]">
                  <div className="p-2 bg-[#1F1F1F] rounded-lg border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-300">v1.1 (Modified Rev)</p>
                      <p className="text-[8.5px] text-slate-500">June 18, 2026 by Dr. Joseph Adebayo</p>
                    </div>
                    <span className="text-[8px] bg-indigo-950 font-black text-indigo-300 px-1 py-0.5 rounded border border-indigo-900/50 uppercase">Active</span>
                  </div>

                  <div className="p-2 bg-[#1F1F1F]/50 rounded-lg flex justify-between items-center text-slate-500">
                    <div>
                      <p className="font-bold">v1.0 (Initial Draft)</p>
                      <p className="text-[8.5px]">June 10, 2026 by Emeka Obi (RA)</p>
                    </div>
                    <span className="text-[8px] bg-slate-900 px-1 py-0.5 rounded">Replaced</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-[#2B2B2B] border border-slate-800 p-6 rounded-2xl text-center text-slate-500 shadow-inner">
              <FolderOpen size={22} className="opacity-30 mx-auto mb-2 text-slate-400" />
              <p className="text-xs font-bold">File inspector idle.</p>
              <p className="text-[10px] text-slate-400 mt-1">Select [View] on any document to display its internal annotations and version logs</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
