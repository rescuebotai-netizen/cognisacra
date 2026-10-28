import React, { useState } from 'react';
import { Search, Clock, Copy, Download, Radio, Sparkles } from 'lucide-react';

interface TranscriptsInsightsSectionProps {
  onToastSuccess: (msg: string) => void;
}

export const TranscriptsInsightsSection: React.FC<TranscriptsInsightsSectionProps> = ({ onToastSuccess }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const originalTimeline = [
    { id: 't1', time: '00:01', speaker: 'Dr. Joseph Adebayo (Instructor)', text: 'Welcome everyone! Today we are introducing AI fundamentals and matching them against tree balancing structures.' },
    { id: 't2', time: '00:32', speaker: 'Emeka Obi (Learner)', text: 'Can you explain why balance weight factors of -2 and +1 trigger right-left rotations instead of simple single shifts?' },
    { id: 't3', time: '01:15', speaker: 'Dr. Joseph Adebayo (Instructor)', text: 'Excellent query! An AVL tree requires double rotations (Left-Right or Right-Left) when parent nodes and child nodes possess opposing weight directions.' },
    { id: 't4', time: '02:04', speaker: 'Sarah Mwangi (Learner)', text: 'Ah, so the left rotation balances the child subclass, and the right rotation settles the ancestor node!' },
    { id: 't5', time: '02:45', speaker: 'Dr. Joseph Adebayo (Instructor)', text: 'Precisely, Sarah! This achieves absolute balance factor margins and keeps search lookups consistently at log(n) height constraints.' },
    { id: 't6', time: '03:10', speaker: 'Alex Kiprop (Learner)', text: 'Wow, dynamic memoization caches could save a dramatic amount of CPU cycles as well!' },
    { id: 't7', time: '03:54', speaker: 'Dr. Joseph Adebayo (Instructor)', text: 'Absolutely correct, Alex. Wrapping compound indexes inside memory filters decreases lookups to constant O(1).' }
  ];

  const filteredTimeline = originalTimeline.filter(item => 
    item.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.speaker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyTranscriptToClipboard = () => {
    const formatted = originalTimeline.map(item => `[${item.time}] ${item.speaker}: ${item.text}`).join('\n');
    navigator.clipboard.writeText(formatted);
    onToastSuccess("Full transcript copied to system clipboard!");
  };

  const downloadTranscriptFile = () => {
    const formatted = originalTimeline.map(item => `[${item.time}] ${item.speaker}: ${item.text}`).join('\n');
    const blob = new Blob([formatted], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "lecture_transcript_log.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onToastSuccess("Transcript .txt log file downloaded!");
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs" style={{ color: '#E1E1E1' }}>
      
      {/* Header */}
      <div className="bg-[#2B2B2B] p-4 rounded-xl border border-slate-800 flex justify-between items-center shadow-lg">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Radio className="text-[#7B83EB] animate-pulse" size={18} />
            Live Speech Transcript Viewer | Dynamic Stream
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Real-time synchronized text generation, search filters, and audio timestamp indexing</p>
        </div>
        <span className="text-[10px] uppercase font-bold text-[#7B83EB] bg-[#6264A7]/20 border border-[#6264A7]/30 px-3 py-1 rounded-full">
          Live Timeline
        </span>
      </div>

      <div className="bg-[#2B2B2B] border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        
        {/* Search and control bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-[#1F1F1F] p-3 rounded-xl border border-slate-800">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transcript dialog logs..."
              className="w-full bg-[#1A1A1A] border border-slate-800 py-1.5 pl-9 pr-3 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#7B83EB] placeholder-slate-500"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={copyTranscriptToClipboard}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition text-[11px] font-bold border border-slate-750"
            >
              <Copy size={12} /> Copy Text
            </button>
            <button
              onClick={downloadTranscriptFile}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-950 hover:bg-indigo-900 border border-indigo-900/40 text-indigo-300 rounded-xl transition text-[11px] font-bold"
            >
              <Download size={12} /> Save Text Log
            </button>
          </div>
        </div>

        {/* Timeline Log Grid */}
        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 no-scrollbar">
          {filteredTimeline.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              No dialogues match your phrase query search. Keep trying!
            </div>
          ) : (
            filteredTimeline.map((item) => (
              <div 
                key={item.id} 
                className="flex gap-4 p-3 bg-[#1F1F1F] hover:bg-[#1F1F1F]/70 border border-slate-800/80 rounded-2xl transition group relative shadow-inner"
              >
                {/* Timestamp clickable badge */}
                <button
                  onClick={() => onToastSuccess(`Simulating log playback sync: Jumping playhead to minute ${item.time}`)}
                  className="h-8 px-2.5 bg-[#2B2B2B] hover:bg-[#6264A7] hover:text-white rounded-lg text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1 transition self-start shadow border border-slate-750 font-bold shrink-0"
                  title="Jump to Timestamp"
                >
                  <Clock size={11} className="text-[#7B83EB] group-hover:text-white" />
                  {item.time}
                </button>

                {/* Dialog detail */}
                <div className="space-y-1">
                  <h4 className="font-extrabold text-[11px] text-[#7B83EB] tracking-wide">{item.speaker}</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed leading-normal">{item.text}</p>
                </div>

                {/* Tiny Floating Anchor overlay indicator */}
                <span className="absolute top-2 right-3 opacity-0 group-hover:opacity-100 transition text-[9px] text-slate-500 uppercase font-black tracking-widest font-mono">
                  Sync playhead
                </span>

              </div>
            ))
          )}
        </div>

        {/* Dynamic speech caption summary footer */}
        <div className="p-3 bg-gradient-to-r from-slate-900 to-[#6264A7]/10 rounded-xl border border-slate-800 max-w-2xl mx-auto text-center">
          <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
            <Sparkles size={12} className="text-amber-400 animate-pulse" />
            Live transcript utilizes neural phoneme recognition. Average accuracy score: <span className="text-[#7B83EB] font-black">99.4%</span>
          </p>
        </div>

      </div>

    </div>
  );
};
