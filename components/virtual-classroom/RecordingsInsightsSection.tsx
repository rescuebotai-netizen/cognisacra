import React, { useState } from 'react';
import { PlayCircle, Download, Share2, Trash, Sparkles, FileText, FileDown, CheckCircle2 } from 'lucide-react';

interface RecordingsInsightsSectionProps {
  onToastSuccess: (msg: string) => void;
}

export const RecordingsInsightsSection: React.FC<RecordingsInsightsSectionProps> = ({ onToastSuccess }) => {
  // Mock Playbacks State
  const [recordings, setRecordings] = useState([
    { 
      id: 'rec-1', 
      title: 'AI Fundamentals & Machine Learning Models', 
      course: 'AI & Machine Learning Foundations', 
      duration: '01:43:20', 
      date: '12 June 2026', 
      size: '2.4 GB', 
      participants: 56, 
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60' 
    },
    { 
      id: 'rec-2', 
      title: 'Tree Traversals, AVL Rotations & Depth Search', 
      course: 'Data Structure & Algorithms', 
      duration: '01:05:12', 
      date: '15 June 2026', 
      size: '1.2 GB', 
      participants: 135, 
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=500&auto=format&fit=crop&q=60' 
    }
  ]);

  // Selected details state
  const [selectedRecordForAI, setSelectedRecordForAI] = useState<string | null>(null);
  const [aiMinutesContent, setAiMinutesContent] = useState<any | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently erase the playback record for: "${name}"?`)) {
      setRecordings(prev => prev.filter(r => r.id !== id));
      onToastSuccess("Playback file deleted successfully.");
    }
  };

  const triggerAIMinutes = (rec: any) => {
    setLoadingAI(true);
    setSelectedRecordForAI(rec.id);
    onToastSuccess(`Gemini AI summarizing class transcripts for: "${rec.title}"...`);

    setTimeout(() => {
      // Formulate detailed minutes
      const resultObj = {
        title: rec.title,
        instructor: 'Dr. Joseph Adebayo',
        date: rec.date,
        duration: rec.duration,
        topics: [
          'AI Foundations & Neural Networks',
          'AVL Self-Balancing trees math rotations',
          'Logarithmic search lookups & dynamic caching boundaries'
        ],
        questions: [
          { student: 'Emeka Obi', text: 'What is Reinforcement Learning and Q-values?' },
          { student: 'Sarah Mwangi', text: 'Are single rotations sufficient for double weighted AVL sub-branches?' }
        ],
        decisions: [
          'Decision 1: Use tabulation instead of recursion in mid-term portfolios.',
          'Decision 2: Sub-component caching hooks will be our main code standard for React.'
        ],
        assignments: [
          { task: 'Formulate O(log n) tree recursive rotate statements', due: '24 June 2026', status: 'Assigned' },
          { task: 'Deploy sandbox micro-container indices database', due: '28 June 2026', status: 'Assigned' }
        ]
      };

      setAiMinutesContent(resultObj);
      setLoadingAI(false);
      onToastSuccess("AI Lesson Minutes generated! Review topic structures below.");
    }, 1800);
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ color: '#E1E1E1' }}>
      
      {/* Header */}
      <div className="bg-[#2B2B2B] p-4 rounded-xl border border-slate-800 flex justify-between items-center shadow-lg">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <PlayCircle className="text-[#7B83EB]" size={18} />
            Recorded Archives Vault | Netflix-Style Grid
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">High fidelity records, offline compression, and Gemini AI summarized minutes</p>
        </div>
        <span className="text-[10px] uppercase font-bold text-[#7B83EB] bg-[#6264A7]/20 border border-[#6264A7]/30 px-3 py-1 rounded-full">
          Playback Archives
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Playback video grid cards - lg:col-span-7 */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-extrabold text-xs text-[#7B83EB] uppercase tracking-wider">Archived Lecture Broadcasts</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recordings.map((rec) => (
              <div key={rec.id} className="bg-[#2B2B2B] rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-between group">
                
                {/* Thumbnail image with playback button */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <img 
                    src={rec.thumbnail} 
                    alt={rec.title} 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={() => onToastSuccess(`Starting streaming protocol for playback: "${rec.title}"`)}
                      className="p-3 bg-indigo-650 hover:bg-[#7B83EB] text-white rounded-full shadow-lg hover:scale-110 transition duration-300"
                    >
                      <PlayCircle size={22} />
                    </button>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/75 px-1.5 py-0.5 rounded font-mono text-[9px] text-white font-heavy">
                    {rec.duration}
                  </span>
                  <span className="absolute top-2 left-2 bg-indigo-900/80 text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase font-sans">
                    {rec.course.split(' ')[0]}
                  </span>
                </div>

                {/* Content body */}
                <div className="p-3.5 space-y-3">
                  <div>
                    <h4 className="font-extrabold text-xs text-white group-hover:text-[#7B83EB] transition leading-tight">{rec.title}</h4>
                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">{rec.course}</p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-800/60 pt-2.5">
                    <span>Rec Date: {rec.date}</span>
                    <span>Filesize: {rec.size}</span>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-slate-800/40 text-[9px]">
                    <button 
                      onClick={() => onToastSuccess(`Downloading offline stream payload of size ${rec.size}`)}
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-extrabold flex items-center justify-center gap-1 transition"
                    >
                      <Download size={10} /> Get Video
                    </button>
                    <button 
                      onClick={() => triggerAIMinutes(rec)}
                      className="py-1.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-900/60 rounded-lg font-extrabold flex items-center justify-center gap-1 transition"
                    >
                      <Sparkles size={10} /> AI Minutes
                    </button>
                    <button 
                      onClick={() => handleDelete(rec.id, rec.title)}
                      className="py-1.5 bg-red-950/40 hover:bg-red-950 text-red-400 rounded-lg font-extrabold flex items-center justify-center gap-1 transition"
                    >
                      <Trash size={10} /> Delete
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* AI Minutes sheet column - lg:col-span-5 */}
        <div className="lg:col-span-5">
          <h3 className="font-extrabold text-xs text-[#7B83EB] uppercase tracking-wider mb-4">AI-Generated Minutes Summary</h3>
          
          {loadingAI ? (
            <div className="bg-[#2B2B2B] border border-slate-800 p-8 rounded-2xl text-center shadow-xl animate-pulse space-y-2">
              <Sparkles className="animate-spin text-amber-300 mx-auto" size={24} />
              <p className="text-xs font-bold text-[#7B83EB]">Gemini AI is parsing speech log intervals...</p>
              <p className="text-[10px] text-slate-400">Synthesizing topic timelines and action targets</p>
            </div>
          ) : aiMinutesContent ? (
            <div className="bg-[#2B2B2B] border border-slate-800 p-4.5 rounded-2xl shadow-xl space-y-4 text-xs animate-fade-in">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-[8px] tracking-wider uppercase font-extrabold text-[#7B83EB]">Automated Class Digest</span>
                  <h4 className="font-extrabold text-white text-xs mt-0.5">{aiMinutesContent.title}</h4>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => onToastSuccess("PDF report compiled for download.")}
                    title="Export PDF"
                    className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold text-[9px] flex items-center gap-1"
                  >
                    <FileDown size={11} /> PDF
                  </button>
                  <button 
                    onClick={() => onToastSuccess("Draft sent to instructor email.")}
                    title="Email Digest"
                    className="p-1 px-2.5 bg-indigo-900 hover:bg-indigo-850 text-indigo-200 rounded font-extrabold text-[9px]"
                  >
                    Email
                  </button>
                </div>
              </div>

              {/* Sections requested by user */}
              <div className="space-y-3.5">
                {/* Meeting info block */}
                <div className="p-2.5 bg-[#1F1F1F] rounded-xl border border-slate-800 space-y-1 my-1">
                  <h5 className="text-[9px] uppercase font-black tracking-wider text-slate-400">Meeting Information</h5>
                  <p className="text-slate-300"><span className="text-slate-500 font-bold">Class:</span> {aiMinutesContent.title}</p>
                  <p className="text-slate-300"><span className="text-slate-500 font-bold">Instructor:</span> {aiMinutesContent.instructor}</p>
                  <p className="text-slate-300"><span className="text-slate-500 font-bold">Date / Duration:</span> {aiMinutesContent.date} • {aiMinutesContent.duration}</p>
                </div>

                {/* Topics Covered */}
                <div>
                  <h5 className="text-[9px] uppercase font-black tracking-wider text-[#7B83EB] mb-1.5">Topics Covered</h5>
                  <ul className="space-y-1 list-disc pl-4 text-slate-300 text-[11px] leading-relaxed">
                    {aiMinutesContent.topics.map((item: string, i: number) => <li key={i}>{item}</li>)}
                  </ul>
                </div>

                {/* Questions Asked */}
                <div>
                  <h5 className="text-[9px] uppercase font-black tracking-wider text-amber-400 mb-1.5">Questions Raised</h5>
                  <div className="space-y-2">
                    {aiMinutesContent.questions.map((q: any, i: number) => (
                      <div key={i} className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                        <p className="font-bold text-slate-200 text-[10px]">{q.student}: <span className="font-medium text-slate-400">"{q.text}"</span></p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decisions */}
                <div>
                  <h5 className="text-[9px] uppercase font-black tracking-wider text-[#7B83EB] mb-1.5">Critical Decisions</h5>
                  <ul className="space-y-1 list-disc pl-4 text-slate-300 text-[11px] leading-relaxed">
                    {aiMinutesContent.decisions.map((dec: string, i: number) => <li key={i}>{dec}</li>)}
                  </ul>
                </div>

                {/* Assignments */}
                <div>
                  <h5 className="text-[9px] uppercase font-black tracking-wider text-emerald-400 mb-1.5">Assignments Checklist</h5>
                  <div className="space-y-1.5">
                    {aiMinutesContent.assignments.map((asg: any, i: number) => (
                      <div key={i} className="flex justify-between items-center bg-[#1F1F1F] p-2 rounded-xl border border-slate-800/60">
                        <div>
                          <p className="font-bold text-slate-300 text-[10px]">{asg.task}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Due: {asg.due}</p>
                        </div>
                        <span className="text-[8px] font-black uppercase text-emerald-400 bg-emerald-950 border border-emerald-900 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <CheckCircle2 size={9} /> {asg.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-[#2B2B2B] border border-slate-805 p-6 rounded-2xl text-center text-slate-500 shadow shadow-inner">
              <Sparkles size={22} className="opacity-30 mx-auto mb-2 text-slate-400" />
              <p className="text-xs font-bold font-sans">No summaries generated.</p>
              <p className="text-[10px] text-slate-400 mt-1">Select [AI Minutes] on any recorded lesson card to trigger analysis</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
