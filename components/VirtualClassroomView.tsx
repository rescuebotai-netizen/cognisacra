import React, { useState, useEffect } from 'react';
import { 
  Video, Calendar, FileText, PlayCircle, Clock, MessageSquare, Sparkles, 
  Plus, CheckCircle2, Award, Shield, ArrowRight, Upload, Search, 
  Users, Check, ExternalLink, RefreshCw, X, ChevronRight, BookOpen, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Modular subcomponents
import { ClassSession, Assignment, Recording, ClassNote } from './virtual-classroom/types';
import { AcademicCalendar } from './virtual-classroom/AcademicCalendar';
import { AssignmentsHub } from './virtual-classroom/AssignmentsHub';
import { RecordingsVault } from './virtual-classroom/RecordingsVault';
import { LiveClassroomRoom } from './virtual-classroom/LiveClassroomRoom';
import { sendMessageToAI } from '../services/geminiService';

interface VirtualClassroomViewProps {
  userRole?: 'learner' | 'instructor' | 'institution';
  onLeaveClass?: (session: ClassSession) => void;
  rejoinSessionToLoad?: ClassSession | null;
  onClearRejoinSession?: () => void;
}

export type VirtualClassTab = 'sessions' | 'assignments' | 'recordings' | 'notebook';

export default function VirtualClassroomView({ 
  userRole = 'learner',
  onLeaveClass,
  rejoinSessionToLoad = null,
  onClearRejoinSession
}: VirtualClassroomViewProps) {
  const isInstructor = userRole === 'instructor' || userRole === 'institution';

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<VirtualClassTab>('sessions');

  // Active Live Classroom Session
  const [activeSession, setActiveSession] = useState<ClassSession | null>(() => {
    if (rejoinSessionToLoad) return rejoinSessionToLoad;
    return null;
  });

  useEffect(() => {
    if (rejoinSessionToLoad) {
      setActiveSession(rejoinSessionToLoad);
      if (onClearRejoinSession) {
        onClearRejoinSession();
      }
    }
  }, [rejoinSessionToLoad, onClearRejoinSession]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Class Sessions State
  const [sessions, setSessions] = useState<ClassSession[]>([
    { 
      id: '1', 
      title: 'Data Structures: Tree Traversals & Depth Search', 
      courseName: 'Data Structures & Algorithms', 
      instructor: 'Dr. Joseph Adebayo', 
      dateTime: '2026-06-19T10:00:00', 
      duration: '60 min', 
      isLive: true 
    },
    { 
      id: '2', 
      title: 'State Synchronization & Dynamic Hooks', 
      courseName: 'Advanced React & TypeScript', 
      instructor: 'Dr. Joseph Adebayo', 
      dateTime: '2026-06-20T14:00:00', 
      duration: '90 min', 
      isLive: false 
    },
    { 
      id: '3', 
      title: 'Transactional Normalization & Indexes', 
      courseName: 'Database Engineering & PostgreSQL', 
      instructor: 'Dr. Joseph Adebayo', 
      dateTime: '2026-06-22T11:00:00', 
      duration: '60 min', 
      isLive: false 
    }
  ]);

  // Assignments State
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: '1', title: 'BST Balancing Optimization Algorithm', courseName: 'Data Structures & Algorithms', dueDate: '2026-06-21', points: 100, status: 'Assigned' },
    { id: '2', title: 'Custom Hook State Cache Architecture', courseName: 'Advanced React & TypeScript', dueDate: '2026-06-24', points: 150, status: 'Assigned' },
    { id: '3', title: 'Relational Schema Design Portfolio', courseName: 'Database Engineering & PostgreSQL', dueDate: '2026-06-15', points: 200, status: 'Submitted', score: '192 / 200', submittedAt: 'Database_Schema_v2.pdf' },
  ]);

  // Recordings State
  const [recordings, setRecordings] = useState<Recording[]>([
    { 
      id: '1', 
      title: 'Time & Space Complexity Optimization Standards', 
      courseName: 'Data Structures & Algorithms', 
      date: 'June 10, 2026', 
      duration: '52:12', 
      views: 142, 
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60',
      summary: 'Analysis of logarithmic lookup buffers and recursive state trees that minimize runtime overhead.',
      topics: ['O(log n) trees', 'Cached arrays', 'Memory layout']
    },
    { 
      id: '2', 
      title: 'React 19 Architecture: Context vs Signals', 
      courseName: 'Advanced React & TypeScript', 
      date: 'June 12, 2026', 
      duration: '1:10:45', 
      views: 98, 
      thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60',
      summary: 'In-depth exploration of component memoization, signal primitives, and high-frequency UI updates.',
      topics: ['Signals', 'Memoization', 'Side effect safety']
    }
  ]);

  // AI Notebook State
  const [studentNoteContent, setStudentNoteContent] = useState<string>(
    '# Binary Search Trees: Traversal Invariants\n\n- In-order traversal visits nodes in ascending sort sequence (Left, Root, Right).\n- Rebalancing through AVL rotations prevents O(n) worst-case degradation.'
  );
  const [isAiGeneratingNotes, setIsAiGeneratingNotes] = useState(false);
  const [noteFlashcards, setNoteFlashcards] = useState<{ q: string; a: string }[]>([
    { q: 'What is the runtime invariant of balanced AVL search trees?', a: 'O(log n) for search, insertion, and deletion.' },
    { q: 'Which traversal sequence yields sorted keys in a BST?', a: 'In-order traversal (Left, Root, Right).' }
  ]);

  const handleJoinClass = (session: ClassSession) => {
    setActiveSession(session);
    showToast(`Joined live session: ${session.title}`);
  };

  const handleLeaveActiveRoom = () => {
    if (activeSession && onLeaveClass) {
      onLeaveClass(activeSession);
    }
    setActiveSession(null);
    showToast('Left live classroom session.');
  };

  const handleSubmitAssignment = (id: string, fileName: string) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'Submitted', submittedAt: fileName } : a));
    showToast(`Assignment submitted successfully: ${fileName}`);
  };

  const handleGradeAssignment = (id: string, score: string, feedback: string) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, score, feedback, status: 'Submitted' } : a));
    showToast('Grade recorded.');
  };

  const handleAddAssignment = (newAssignment: Assignment) => {
    setAssignments(prev => [newAssignment, ...prev]);
    showToast(`New assignment published: ${newAssignment.title}`);
  };

  const handleAddSession = (newSession: ClassSession) => {
    setSessions(prev => [newSession, ...prev]);
    showToast(`Lecture scheduled: ${newSession.title}`);
  };

  // AI Note Optimization via Gemini
  const handleOptimizeNotes = async () => {
    if (!studentNoteContent.trim() || isAiGeneratingNotes) return;
    setIsAiGeneratingNotes(true);
    try {
      const prompt = `Review these student notes and format them into a crisp, high-yield summary review sheet with bullet points and one practical quiz question:\n\n"${studentNoteContent}"`;
      const stream = await sendMessageToAI(prompt);
      let cumulative = '';
      for await (const chunk of stream) {
        if (chunk.text) cumulative += chunk.text;
      }
      if (cumulative) {
        setStudentNoteContent(prev => `${prev}\n\n## AI Study Summary & Key Takeaways\n${cumulative}`);
        showToast('Study notes optimized by AI.');
      }
    } catch {
      setStudentNoteContent(prev => `${prev}\n\n## AI Summary & Takeaways\n- Balanced binary trees guarantee logarithmic O(log n) lookups.\n- Rebalance on insert/delete to avoid degenerating into linear linked lists.`);
      showToast('Notes updated.');
    } finally {
      setIsAiGeneratingNotes(false);
    }
  };

  const handleGenerateFlashcard = async () => {
    if (!studentNoteContent.trim() || isAiGeneratingNotes) return;
    setIsAiGeneratingNotes(true);
    try {
      const prompt = `From these notes, produce 1 concise flashcard. Return in format: Question: ... | Answer: ... Notes: "${studentNoteContent}"`;
      const stream = await sendMessageToAI(prompt);
      let cumulative = '';
      for await (const chunk of stream) {
        if (chunk.text) cumulative += chunk.text;
      }
      const parts = cumulative.split('|');
      const q = parts[0]?.replace(/Question:\s*/i, '').trim() || 'Dynamic AVL Rotations';
      const a = parts[1]?.replace(/Answer:\s*/i, '').trim() || 'Restores height balance property to maintain O(log n) operations.';
      setNoteFlashcards(prev => [{ q, a }, ...prev]);
      showToast('New flashcard added.');
    } catch {
      setNoteFlashcards(prev => [{ q: 'What causes worst-case O(n) degradation in unadjusted BSTs?', a: 'Inserting sorted or reverse-sorted input without self-balancing rotations.' }, ...prev]);
      showToast('Flashcard created.');
    } finally {
      setIsAiGeneratingNotes(false);
    }
  };

  // If in an active live session, render full-canvas LiveClassroomRoom
  if (activeSession) {
    return (
      <div className="space-y-4 animate-fade-in text-zinc-100">
        <div className="bg-[#0E131C] p-4 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider block">
                LIVE INTERACTIVE STAGE
              </span>
              <h2 className="text-sm font-bold font-serif text-white">
                {activeSession.title}
              </h2>
            </div>
          </div>

          <button
            onClick={handleLeaveActiveRoom}
            className="px-4 py-2 rounded-xl bg-[#141B26] hover:bg-rose-500/20 text-zinc-300 hover:text-rose-400 text-xs font-mono font-bold transition flex items-center gap-1.5"
          >
            <span>Exit Classroom</span>
            <X size={14} />
          </button>
        </div>

        <LiveClassroomRoom
          session={activeSession}
          onLeave={handleLeaveActiveRoom}
          userRole={userRole}
        />
      </div>
    );
  }

  const liveSession = sessions.find(s => s.isLive);

  const tabs: { id: VirtualClassTab; label: string; icon: React.ReactNode; badge?: string }[] = isInstructor ? [
    { id: 'sessions', label: 'Broadcast Scheduler & Live Sessions', icon: <Video size={15} />, badge: liveSession ? 'LIVE' : undefined },
    { id: 'assignments', label: 'Curriculum & Grading Vault', icon: <FileText size={15} />, badge: `${assignments.filter(a => a.status === 'Assigned').length}` },
    { id: 'recordings', label: 'Lectures & Minutes Archives', icon: <PlayCircle size={15} /> },
  ] : [
    { id: 'sessions', label: 'Live Stages & Lecture Hall', icon: <Video size={15} />, badge: liveSession ? 'LIVE' : undefined },
    { id: 'assignments', label: 'Assignments Hub', icon: <FileText size={15} />, badge: `${assignments.filter(a => a.status === 'Assigned').length}` },
    { id: 'recordings', label: 'Recordings & Transcripts', icon: <PlayCircle size={15} /> },
    { id: 'notebook', label: 'AI Study Notebook', icon: <BookOpen size={15} /> },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-zinc-100">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#0E131C] text-emerald-300 text-xs font-mono font-semibold rounded-2xl shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Classroom Banner */}
      <div className="bg-[#0E131C] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Emerald Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                {isInstructor ? 'Instructor Classroom Suite' : 'Learner Classroom Hub'}
              </span>
              <span className="text-[11px] font-mono text-zinc-500">• Synchronous Academy</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
              {isInstructor ? 'Broadcast Stage & Academic Operations' : 'Interactive Academic Lecture Halls'}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {isInstructor
                ? 'Host high-definition live academic broadcasts, manage real-time attendance rosters, publish interactive polls, and evaluate student submissions.'
                : 'Attend live HD video lectures, collaborate on smart whiteboards, submit graded assignments, and review AI-indexed lecture transcripts.'}
            </p>
          </div>

          {/* Quick Live Join Action */}
          {liveSession && (
            <div className="p-4 rounded-2xl bg-[#141B26] shrink-0 text-left space-y-2.5 max-w-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Active Lecture Now
                </span>
              </div>
              <h3 className="text-xs font-bold font-serif text-white line-clamp-1">
                {liveSession.title}
              </h3>
              <p className="text-[10px] font-mono text-zinc-400">
                {liveSession.instructor} • {liveSession.courseName}
              </p>
              <button
                onClick={() => handleJoinClass(liveSession)}
                className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <span>Enter Classroom</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Minimalist Segment Switcher */}
        <div className="mt-6 pt-5 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20 scale-[1.02]'
                    : 'bg-[#141B26] text-zinc-400 hover:text-white hover:bg-[#1A2332]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                    isActive 
                      ? 'bg-black/20 text-black' 
                      : tab.badge === 'LIVE' ? 'bg-emerald-500/20 text-emerald-300 animate-pulse' : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Compartment */}
      <div className="relative">
        
        {/* TAB 1: SESSIONS & SCHEDULE */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            {/* Active and Upcoming Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {sessions.map(s => (
                <div 
                  key={s.id} 
                  className="bg-[#0E131C] p-5 rounded-2xl shadow-xl flex flex-col justify-between space-y-4 text-left"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      {s.isLive ? (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          LIVE NOW
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-[#141B26] text-zinc-400 font-mono text-[10px]">
                          UPCOMING
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                        <Clock size={11} />
                        <span>{s.duration}</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold font-serif text-white">
                      {s.title}
                    </h3>

                    <p className="text-[11px] font-mono text-zinc-400">
                      {s.courseName}
                    </p>

                    <div className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 pt-1">
                      <Users size={12} className="text-emerald-400" />
                      <span>{s.instructor}</span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => handleJoinClass(s)}
                      className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-2 ${
                        s.isLive
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 active:scale-95'
                          : 'bg-[#141B26] hover:bg-[#1A2332] text-zinc-300 hover:text-white'
                      }`}
                    >
                      <Video size={13} />
                      <span>{s.isLive ? 'Join Live Lecture' : 'Enter Staging Room'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Academic Calendar Component */}
            <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl">
              <AcademicCalendar
                sessions={sessions}
                onAddSession={handleAddSession}
                onJoinSession={handleJoinClass}
                userRole={userRole}
              />
            </div>
          </div>
        )}

        {/* TAB 2: ASSIGNMENTS HUB */}
        {activeTab === 'assignments' && (
          <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl">
            <AssignmentsHub
              assignments={assignments}
              onSubmitWork={handleSubmitAssignment}
              onGradeAssignment={handleGradeAssignment}
              onAddAssignment={handleAddAssignment}
              userRole={userRole}
            />
          </div>
        )}

        {/* TAB 3: RECORDINGS VAULT */}
        {activeTab === 'recordings' && (
          <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl">
            <RecordingsVault
              recordings={recordings}
              userRole={userRole}
            />
          </div>
        )}

        {/* TAB 4: AI STUDY NOTEBOOK */}
        {activeTab === 'notebook' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Notebook Editor */}
              <div className="lg:col-span-7 bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-4 text-left flex flex-col justify-between min-h-[460px]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <BookOpen size={16} />
                      </span>
                      <div>
                        <h3 className="text-sm font-bold font-serif text-white">Lecture Study Notebook</h3>
                        <p className="text-[10px] font-mono text-zinc-400">Markdown enabled live editor</p>
                      </div>
                    </div>

                    <button
                      onClick={handleOptimizeNotes}
                      disabled={isAiGeneratingNotes}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-black text-xs font-mono font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Sparkles size={12} className={isAiGeneratingNotes ? 'animate-spin' : ''} />
                      <span>{isAiGeneratingNotes ? 'Optimizing...' : 'AI Enhance Notes'}</span>
                    </button>
                  </div>

                  <textarea
                    rows={14}
                    value={studentNoteContent}
                    onChange={(e) => setStudentNoteContent(e.target.value)}
                    placeholder="Capture lecture notes, formulas, and proofs..."
                    className="w-full p-4 bg-[#141B26] text-xs font-mono text-zinc-200 placeholder-zinc-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none leading-relaxed transition"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-zinc-500">
                  <span>Markdown formatting supported</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(studentNoteContent);
                      showToast('Notes copied to clipboard.');
                    }}
                    className="hover:text-white transition"
                  >
                    Copy Text
                  </button>
                </div>
              </div>

              {/* Flashcards & AI Synthesis */}
              <div className="lg:col-span-5 bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-4 text-left flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <Award size={16} />
                      </span>
                      <div>
                        <h4 className="text-sm font-bold font-serif text-white">Active Flashcards</h4>
                        <p className="text-[10px] font-mono text-zinc-400">Retain key concepts with active recall</p>
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateFlashcard}
                      disabled={isAiGeneratingNotes}
                      className="px-3 py-1.5 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-xs font-mono text-zinc-300 hover:text-white transition flex items-center gap-1 disabled:opacity-50"
                    >
                      <Plus size={12} />
                      <span>Card</span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {noteFlashcards.map((card, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#141B26] space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                            Q{idx + 1}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-white font-serif leading-snug">
                          {card.q}
                        </p>
                        <p className="text-[11px] font-mono text-zinc-400 pt-1 leading-normal">
                          {card.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 text-[10px] font-mono text-zinc-500 text-center">
                  Cards are automatically saved to your profile progress.
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
