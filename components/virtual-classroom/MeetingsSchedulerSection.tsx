import React, { useState } from 'react';
import { Calendar, Clock, Users, Shield, Check, PlusCircle, Sparkles, Send } from 'lucide-react';

interface MeetingsSchedulerSectionProps {
  onScheduleSuccess: (msg: string) => void;
}

export const MeetingsSchedulerSection: React.FC<MeetingsSchedulerSectionProps> = ({ onScheduleSuccess }) => {
  // Current meetings list State
  const [meetings, setMeetings] = useState([
    { id: 'm1', title: 'Data Structures: Tree Traversals & Depth Search', course: 'Data Structure & Algorithms', date: '2026-06-19', time: '10:00 AM', duration: '60 min', code: 'AIX-456-RT', status: 'Live Now' },
    { id: 'm2', title: 'State Synchronization & Dynamic Hooks', course: 'Advanced React & TypeScript', date: '2026-06-20', time: '02:00 PM', duration: '90 min', code: 'REA-789-TS', status: 'Scheduled' },
    { id: 'm3', title: 'Transactional Normalization & Indexes', course: 'Database Engineering & PostgreSQL', date: '2026-06-22', time: '11:00 AM', duration: '60 min', code: 'DB-123-SQL', status: 'Scheduled' }
  ]);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCourse, setFormCourse] = useState('Data Structure & Algorithms');
  const [formDate, setFormDate] = useState('2026-06-25');
  const [formTimeStart, setFormTimeStart] = useState('10:00');
  const [formTimeEnd, setFormTimeEnd] = useState('11:00');
  const [formTimezone, setFormTimezone] = useState('GMT+1 (Lagos)');
  const [formRecurring, setFormRecurring] = useState('none');
  const [formInvitees, setFormInvitees] = useState('');
  const [formResources, setFormResources] = useState<File | null>(null);
  const [recordingEnabled, setRecordingEnabled] = useState(true);
  const [aiNotesEnabled, setAiNotesEnabled] = useState(true);
  const [transcriptEnabled, setTranscriptEnabled] = useState(true);

  const [formPreviewMode, setFormPreviewMode] = useState(false);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) {
      alert("Please specify a class title.");
      return;
    }

    const newMeeting = {
      id: Math.random().toString(),
      title: formTitle,
      course: formCourse,
      date: formDate,
      time: formTimeStart,
      duration: '60 min',
      code: 'MT-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      status: 'Scheduled'
    };

    setMeetings(prev => [...prev, newMeeting]);
    onScheduleSuccess(`Class "${formTitle}" scheduled! Student invitations and resources sent via Teams notification system.`);
    
    // Reset Form
    setFormTitle('');
    setFormDesc('');
    setFormInvitees('');
    setFormPreviewMode(false);
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ color: '#E1E1E1' }}>
      
      {/* Header */}
      <div className="flex justify-between items-center bg-[#2B2B2B] p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-base font-black flex items-center gap-2 text-white">
            <Calendar className="text-[#7B83EB]" size={18} />
            Virtual Class Coordinator | Enterprise Layout
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Familiar Teams-inspired scheduling pane, automated invites, and Gemini summaries</p>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#7B83EB] bg-[#6264A7]/20 border border-[#6264A7]/30 px-3 py-1 rounded-full">
          Scheduler Mode
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form panel column */}
        <form onSubmit={handlePublish} className="lg:col-span-8 bg-[#2B2B2B] p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
          <h3 className="font-extrabold text-xs text-[#7B83EB] uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <PlusCircle size={14} /> Schedule New Virtual Session
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Class Session Title</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. AI Fundamentals: Neural Networks & Transformer Architectures"
                className="w-full px-3 py-2 text-xs bg-[#1F1F1F] border border-slate-700/60 rounded-xl focus:ring-1 focus:ring-[#7B83EB] focus:outline-none text-white placeholder-slate-500"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Class Description</label>
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                rows={2}
                placeholder="Brief summary of syllabus goals and dynamic coding targets..."
                className="w-full px-3 py-2 text-xs bg-[#1F1F1F] border border-slate-700/60 rounded-xl focus:ring-1 focus:ring-[#7B83EB] focus:outline-none text-white placeholder-slate-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Target Course Program</label>
              <select
                value={formCourse}
                onChange={(e) => setFormCourse(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#1F1F1F] border border-slate-700/60 rounded-xl focus:ring-1 focus:ring-[#7B83EB] text-white"
              >
                <option value="Data Structure & Algorithms">Data Structure & Algorithms</option>
                <option value="Advanced React & TypeScript">Advanced React & TypeScript</option>
                <option value="Database Engineering & PostgreSQL">Database Engineering & PostgreSQL</option>
                <option value="AI & Machine Learning Foundations">AI & Machine Learning Foundations</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Invited Students (Emails or names)</label>
              <input
                type="text"
                value={formInvitees}
                onChange={(e) => setFormInvitees(e.target.value)}
                placeholder="Emeka Obi, Sarah Mwangi, Alex Kiprop..."
                className="w-full px-3 py-2 text-xs bg-[#1F1F1F] border border-slate-700/60 rounded-xl focus:ring-1 focus:ring-[#7B83EB] text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Session Date</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#1F1F1F] border border-slate-700/60 rounded-xl focus:ring-1 focus:ring-[#7B83EB] text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-sans">Start</label>
                <input
                  type="time"
                  value={formTimeStart}
                  onChange={(e) => setFormTimeStart(e.target.value)}
                  className="w-full px-2 py-2 text-xs bg-[#1F1F1F] border border-slate-700/60 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-sans">End</label>
                <input
                  type="time"
                  value={formTimeEnd}
                  onChange={(e) => setFormTimeEnd(e.target.value)}
                  className="w-full px-2 py-2 text-xs bg-[#1F1F1F] border border-slate-700/60 rounded-xl text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Timezone</label>
              <select
                value={formTimezone}
                onChange={(e) => setFormTimezone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#1F1F1F] border border-slate-700/60 rounded-xl text-white"
              >
                <option value="GMT+1 (Lagos)">GMT+1 (Lagos)</option>
                <option value="GMT (London)">GMT (London)</option>
                <option value="EST (New York)">EST (New York)</option>
                <option value="PST (Silicon Valley)">PST (Silicon Valley)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Recurring Stream</label>
              <div className="flex bg-[#1F1F1F] p-[3px] rounded-xl border border-slate-700/50">
                {(['none', 'weekly', 'monthly'] as const).map((rec) => (
                  <button
                    key={rec}
                    type="button"
                    onClick={() => setFormRecurring(rec)}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition uppercase ${
                      formRecurring === rec ? 'bg-[#6264A7] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {rec}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Toggle Checklist Options */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Class Permissions & AI Automation</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label className="flex items-center gap-2 bg-[#1F1F1F]/60 p-2.5 rounded-xl border border-slate-800/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={recordingEnabled}
                  onChange={(e) => setRecordingEnabled(e.target.checked)}
                  className="rounded text-[#6264A7] focus:ring-[#7B83EB] bg-[#1F1F1F] border-slate-700"
                />
                <span className="text-[10px] font-bold text-slate-300">Auto Record</span>
              </label>

              <label className="flex items-center gap-2 bg-[#1F1F1F]/60 p-2.5 rounded-xl border border-slate-800/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={aiNotesEnabled}
                  onChange={(e) => setAiNotesEnabled(e.target.checked)}
                  className="rounded text-[#6264A7] focus:ring-[#7B83EB] bg-[#1F1F1F] border-slate-700"
                />
                <span className="text-[10px] font-bold text-slate-300">Gemini AI Minutes</span>
              </label>

              <label className="flex items-center gap-2 bg-[#1F1F1F]/60 p-2.5 rounded-xl border border-slate-800/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={transcriptEnabled}
                  onChange={(e) => setTranscriptEnabled(e.target.checked)}
                  className="rounded text-[#6264A7] focus:ring-[#7B83EB] bg-[#1F1F1F] border-slate-700"
                />
                <span className="text-[10px] font-bold text-slate-300">Live Transcript</span>
              </label>
            </div>
          </div>

          {/* Buttons Area */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-slate-800 gap-3">
            <button
              type="button"
              onClick={() => {
                if (!formTitle) {
                  alert("Add title first to preview schedule card.");
                  return;
                }
                setFormPreviewMode(!formPreviewMode);
              }}
              className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-black rounded-xl transition"
            >
              {formPreviewMode ? 'Close Card Preview' : 'Preview Invite Card'}
            </button>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  onScheduleSuccess("Draft meeting parameters cached locally. Ready to publish.");
                  setFormTitle('');
                  setFormDesc('');
                }}
                className="flex-1 sm:flex-none px-4 py-2 bg-slate-800/45 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-slate-400 text-xs font-bold transition"
              >
                Save Draft
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none px-5 py-2 bg-[#6264A7] hover:bg-[#7B83EB] text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 shadow"
              >
                <Send size={13} /> Publish and invite
              </button>
            </div>
          </div>
        </form>

        {/* Right upcoming meetings status column */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Card preview overlay if active */}
          {formPreviewMode && (
            <div className="p-4 bg-gradient-to-br from-[#6264A7]/20 to-slate-900 border border-[#6264A7]/60 rounded-2xl shadow-xl space-y-3 animate-fade-in">
              <div className="flex justify-between items-start">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#6264A7] text-white">
                  <Sparkles size={8} /> Dynamic Preview
                </span>
                <span className="text-[9px] text-[#7B83EB] font-mono tracking-wider font-extrabold">INVITE_TPL-A</span>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">{formTitle || 'Sample Title'}</h4>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mt-1">{formCourse}</p>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed italic">{formDesc || 'Description text placeholder...'}</p>
              </div>
              <div className="p-2.5 bg-black/30 rounded-xl space-y-1.5 text-[11px] border border-slate-800/80">
                <p className="text-slate-300"><span className="text-slate-500 font-bold">DATE:</span> {formDate}</p>
                <p className="text-slate-300"><span className="text-slate-500 font-bold">TIME:</span> {formTimeStart} - {formTimeEnd} ({formTimezone})</p>
                <p className="text-[#7B83EB] font-bold"><span className="text-slate-500 font-medium">RECURRING:</span> {formRecurring.toUpperCase()}</p>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold">Will automatically register auto-recording, AI summarization notes, and invitation broadcasts upon publication.</p>
            </div>
          )}

          <div className="bg-[#2B2B2B] p-4 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
              Upcoming Training Calendar ({meetings.length})
            </h3>

            <div className="space-y-2.5">
              {meetings.map((meet) => (
                <div key={meet.id} className="p-3 bg-[#1F1F1F] hover:bg-[#1F1F1F]/80 transition rounded-xl border border-slate-800 text-xs">
                  <div className="flex justify-between items-start gap-1">
                    <h4 className="font-extrabold text-white truncate max-w-[140px] md:max-w-xs">{meet.title}</h4>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase shrink-0 ${
                      meet.status === 'Live Now' 
                        ? 'bg-red-650 text-white animate-pulse' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {meet.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wide truncate">{meet.course}</p>
                  
                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex justify-between items-center text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock size={11} className="text-slate-500" />
                      {meet.date} • {meet.time}
                    </span>
                    <span className="font-bold text-[#7B83EB] font-mono tracking-tight bg-slate-900/50 p-1 px-2 rounded-lg border border-slate-800">
                      {meet.code}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
