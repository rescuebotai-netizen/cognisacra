import React, { useState } from 'react';
import { PlayCircle, Search, Clock, Eye, Sparkles, AlertCircle, Languages, BookOpen, Quote, HelpCircle, ChevronRight, Send, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Recording } from './types';
import { sendMessageToAI } from '../../services/geminiService';

interface RecordingsVaultProps {
  recordings: Recording[];
  userRole?: 'learner' | 'instructor' | 'institution';
  onAddRecording?: (newRec: Recording) => void;
}

export const RecordingsVault: React.FC<RecordingsVaultProps> = ({ 
  recordings, 
  userRole = 'learner',
  onAddRecording 
}) => {
  const isInstructor = userRole === 'instructor' || userRole === 'institution';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedRecord, setSelectedRecord] = useState<Recording | null>(null);

  // Instructor-only states
  const [showAddRecModal, setShowAddRecModal] = useState(false);
  const [newRecTitle, setNewRecTitle] = useState('');
  const [newRecCourse, setNewRecCourse] = useState('Data Structure & Algorithms');
  const [newRecTopics, setNewRecTopics] = useState('');

  // AI Panel states
  const [aiActiveTab, setAiActiveTab] = useState<'summary' | 'explain' | 'quiz' | 'ask'>('summary');
  const [explanationConcept, setExplanationConcept] = useState('Dynamic Programming');
  const [explanationOutput, setExplanationOutput] = useState('');
  const [isExplainingLoading, setIsExplainingLoading] = useState(false);
  
  const [customQuestion, setCustomQuestion] = useState('');
  const [customAnswer, setCustomAnswer] = useState('');
  const [isCustomLoading, setIsCustomLoading] = useState(false);

  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Subtitle Language
  const [subtitleLang, setSubtitleLang] = useState<'en' | 'es' | 'sw' | 'fr'>('en');

  const categories = ['All', 'Algorithms', 'Frontend Web', 'Database', 'Platform Design'];

  const filtered = recordings.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'All' || 
                        (activeCategory === 'Algorithms' && r.courseName.includes('Algorithms')) ||
                        (activeCategory === 'Frontend Web' && r.courseName.includes('React')) ||
                        (activeCategory === 'Database' && r.courseName.includes('PostgreSQL')) ||
                        (activeCategory === 'Platform Design' && r.courseName.includes('Platform'));
    return matchesSearch && matchesCat;
  });

  // Simulated subtitle tracks
  const subtitleTracks = {
    en: [
      { time: '0:05', text: "Today we are analyzing core optimization paradigms." },
      { time: '0:15', text: "By storing intermediate nodes in arrays, we avoid overheads." },
      { time: '0:30', text: "This reduces time complexity from exponential O(2^n) to O(n)." }
    ],
    es: [
      { time: '0:05', text: "Hoy estamos analizando paradigmas de optimización del núcleo." },
      { time: '0:15', text: "Al almacenar nodos intermedios, evitamos reprocesamientos." },
      { time: '0:30', text: "Esto reduce la complejidad de tiempo de exponencial O(2^n) a lineal O(n)." }
    ],
    sw: [
      { time: '0:05', text: "Leo tunachambua njia kuu za kuboresha ufanisi." },
      { time: '0:15', text: "Kwa kuhifadhi kumbukumbu za katikati, tunaepuka kurudia kazi." },
      { time: '0:30', text: "Hii inapunguza ugumu wa muda kutoka O(2^n) hadi O(n) pekee." }
    ],
    fr: [
      { time: '0:05', text: "Aujourd'hui, nous analysons les paradigmes d'optimisation." },
      { time: '0:15', text: "En stockant des données intermédiaires, on gagne du temps." },
      { time: '0:30', text: "Cela réduit la complexité temporelle d'exponentielle à linéaire O(n)." }
    ]
  };

  const explainConceptWithAI = async () => {
    if (!explanationConcept) return;
    setIsExplainingLoading(true);
    setExplanationOutput('');
    try {
      const prompt = `Give a high-level, clear 2-paragraph explanation of ${explanationConcept} for university students. Finish with a simple code snippet or equation. Key concepts to mention: storage caching, lookup speedups.`;
      const stream = await sendMessageToAI(prompt);
      
      let gatheredText = '';
      for await (const chunk of stream) {
        gatheredText += chunk.text;
        setExplanationOutput(gatheredText);
      }
    } catch (e) {
      console.error(e);
      setExplanationOutput("AI Assistant Explanation: Caching answers in local arrays is key. This avoids redundancy and improves scaling dynamically.");
    } finally {
      setIsExplainingLoading(false);
    }
  };

  const submitCustomQuestion = async () => {
    if (!customQuestion) return;
    setIsCustomLoading(true);
    setCustomAnswer('');
    try {
      const prompt = `You are teaching a class of students who just watched a lecture on: "${selectedRecord?.title || 'Data structure concepts'}". Answer this student question: "${customQuestion}". Keep it informative, clear, and friendly.`;
      const stream = await sendMessageToAI(prompt);
      
      let gatheredText = '';
      for await (const chunk of stream) {
        gatheredText += chunk.text;
        setCustomAnswer(gatheredText);
      }
    } catch (e) {
      console.error(e);
      setCustomAnswer("AI Guide response: Great question! When doing space and time tradeoffs, lookups usually resolve in O(1) constant time, speeding up the platform.");
    } finally {
      setIsCustomLoading(false);
    }
  };

  const quizQuestions = [
    {
      q: 'What is the primary benefit of storing intermediate nodes/problems in memory?',
      options: ['Reduces disk Space requirements', 'Bypasses unnecessary re-computations', 'Enforces strict object structures', 'Bypasses safety assertions'],
      correct: 1
    },
    {
      q: 'What represents the optimal Big-O performance of linear lookups with caching?',
      options: ['O(2^n)', 'O(n^2)', 'O(n) Linear complexity', 'O(log n)'],
      correct: 2
    }
  ];

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  return (
    <div id="recordings-vault" className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
            <PlayCircle className="text-indigo-600 w-5 h-5" />
            {isInstructor ? 'Classroom Recordings & Audience Analytics' : 'Class Minutes & Video Playbacks'}
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            {isInstructor 
              ? 'Evaluate student playtime curves, inspect quiz answer rates, and publish new lecture playbacks.' 
              : 'Netflix-style catalog of archive virtual recordings paired with smart interactive AI tutoring overlays'}
          </p>
        </div>
        
        {isInstructor && (
          <button
            id="btn-upload-recording-modal"
            onClick={() => setShowAddRecModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
          >
            Publish Playback Archive
          </button>
        )}

        {/* Search */}
        <div className="relative self-start sm:self-auto w-full sm:w-60">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search classes or tracks..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((c) => (
          <button
            id={`btn-cat-${c}`}
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-3.5 py-1 text-xs font-semibold rounded-full border transition whitespace-nowrap ${
              activeCategory === c 
                ? 'bg-slate-900 border-slate-900 text-white' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {isInstructor && (
        <div id="recordings-analytics-banner" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 bg-slate-50 border border-slate-200/60 p-4.5 rounded-2xl animate-fade-in shadow-sm">
          <div className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Audience Playtime Coverage</span>
              <span className="text-base font-black text-slate-900 mt-1 block">85.4% Completion</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">+4.2% YoY</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Quiz Pass average</span>
              <span className="text-base font-black text-slate-900 mt-1 block">1.8 / 2.0 Correct</span>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">Top Class rate</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Total Playback Views</span>
              <span className="text-base font-black text-slate-900 mt-1 block">1,842 Streams</span>
            </div>
            <span id="btn-export-streaming-report" onClick={() => {
              alert("Exporting playbacks audience analysis report to your device mailbox!");
            }} className="text-[10px] font-extrabold text-indigo-650 hover:underline cursor-pointer">
              Download Matrix
            </span>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            No recording tracks fit your query.
          </div>
        ) : (
          filtered.map((r) => (
            <div
              id={`record-card-${r.id}`}
              key={r.id}
              onClick={() => {
                setSelectedRecord(r);
                setExplanationOutput('');
                setCustomAnswer('');
                setQuizSubmitted(false);
                setQuizAnswers({});
                setQuizScore(null);
                setAiActiveTab('summary');
              }}
              className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-300 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img 
                  referrerPolicy="no-referrer"
                  src={r.thumbnail} 
                  alt={r.title}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-200" 
                />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-70 group-hover:opacity-100 transition duration-200">
                  <PlayCircle size={44} className="text-white drop-shadow-md" />
                </div>
                {/* Overlay Duration */}
                <span className="absolute bottom-2.5 right-2.5 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                  {r.duration}
                </span>
              </div>

              {/* Title Panel */}
              <div className="p-4 bg-white border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                  {r.courseName}
                </span>
                <h3 className="font-bold text-slate-950 text-sm mt-1 truncate group-hover:text-indigo-600 transition">
                  {r.title}
                </h3>
                <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {r.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={12} /> {r.views} Views
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Playback Drawer with AI Side Assist Panel */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/50 backdrop-blur-sm p-4">
            <motion.div
              id="playback-drawer"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col md:flex-row overflow-hidden border border-slate-100"
            >
              
              {/* Left Video Player Stage */}
              <div className="flex-1 bg-slate-950 flex flex-col justify-between p-4 relative">
                <div className="flex justify-between items-center text-white mb-2">
                  <span className="text-xs font-bold uppercase text-indigo-400 bg-indigo-950/40 px-2 py-1 rounded">
                    {selectedRecord.courseName}
                  </span>
                  <button 
                    id="btn-close-player"
                    onClick={() => setSelectedRecord(null)}
                    className="p-1 hover:bg-white/20 rounded-full transition text-slate-300 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Simulated Moving Video Playback Canvas screen */}
                <div className="relative flex-1 rounded-xl bg-slate-900 border border-white/5 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/30" />
                  <img 
                    referrerPolicy="no-referrer"
                    src={selectedRecord.thumbnail} 
                    alt="Current Lecture" 
                    className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-[2px]" 
                  />
                  <PlayCircle size={64} className="text-slate-400 opacity-60 mb-3 animate-pulse" />
                  <h4 className="text-base font-bold text-white max-w-sm drop-shadow">{selectedRecord.title}</h4>
                  <p className="text-xs text-indigo-200 mt-1 max-w-sm">AI Lecture Assist tools initialized. Subtitles Synced.</p>
                  
                  {/* Dynamic Subtitles Overlay */}
                  <div className="absolute bottom-4 left-6 right-6 bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-extrabold text-indigo-400 tracking-wider">Subtitles ({subtitleLang.toUpperCase()})</span>
                    <p className="text-xs text-white leading-relaxed mt-1">
                      "{subtitleTracks[subtitleLang][1].text}"
                    </p>
                  </div>
                </div>

                {/* Player Controls simulation */}
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-slate-400 text-xs px-1">
                    <span className="font-mono">14:22 / 56:10</span>
                    <div className="flex items-center gap-2">
                      <Languages size={14} />
                      <select 
                        value={subtitleLang}
                        onChange={(e: any) => setSubtitleLang(e.target.value)}
                        className="bg-slate-900 text-white text-[11px] font-bold border border-slate-700/60 rounded px-1.5 py-0.5 focus:outline-none"
                      >
                        <option value="en">English (Original)</option>
                        <option value="es">Spanish Translation</option>
                        <option value="sw">Swahili Translation</option>
                        <option value="fr">French Translation</option>
                      </select>
                    </div>
                  </div>
                  {/* Seek Bar slider */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>

              {/* Right AI Assistant Sidebar */}
              <div className="w-full md:w-96 border-l border-slate-100 flex flex-col h-full bg-slate-50">
                {/* Tabs */}
                <div className="flex border-b border-slate-200 bg-white">
                  {(['summary', 'explain', 'quiz', 'ask'] as const).map((tab) => (
                    <button
                      id={`tab-ai-${tab}`}
                      key={tab}
                      onClick={() => setAiActiveTab(tab)}
                      className={`flex-1 py-3.5 text-center text-xs font-bold border-b-2 transition ${
                        aiActiveTab === tab 
                          ? 'border-indigo-600 text-indigo-600 bg-indigo-50/10' 
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {tab === 'summary' ? 'Outline' : tab === 'explain' ? 'Insights' : tab === 'quiz' ? 'Quiz' : 'Ask AI'}
                    </button>
                  ))}
                </div>

                {/* Tab content panel */}
                <div className="flex-1 overflow-y-auto p-4">
                  {aiActiveTab === 'summary' && (
                    <div className="space-y-4">
                      <div className="bg-indigo-50/40 border border-indigo-100 text-indigo-900 rounded-xl p-3.5">
                        <span className="flex items-center gap-1.5 text-xs font-extrabold tracking-wide uppercase"><Sparkles size={14} /> AI Notes Generated</span>
                        <p className="text-xs leading-relaxed mt-1">{selectedRecord.summary}</p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1"><BookOpen size={12} /> Topics covered</h4>
                        {selectedRecord.topics.map((t, i) => (
                          <div key={i} className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
                            <span className="w-5 h-5 bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center rounded">
                              {i + 1}
                            </span>
                            <span className="text-xs font-semibold text-slate-800 leading-normal">{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {aiActiveTab === 'explain' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Enter concept to explain</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={explanationConcept}
                            onChange={(e) => setExplanationConcept(e.target.value)}
                            placeholder="e.g. Memoization, Time Complexity"
                            className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                          />
                          <button
                            id="btn-ai-explain"
                            onClick={explainConceptWithAI}
                            disabled={isExplainingLoading}
                            className="px-3 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition shrink-0 disabled:bg-slate-300"
                          >
                            Explain
                          </button>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm min-h-[150px] relative">
                        {isExplainingLoading ? (
                          <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-xs font-semibold text-slate-500">
                            Thinking...
                          </div>
                        ) : null}
                        {explanationOutput ? (
                          <div className="text-xs text-slate-700 leading-relaxed font-sans prose prose-sm whitespace-pre-line">
                            {explanationOutput}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-slate-400 text-xs">
                            <HelpCircle className="mx-auto w-8 h-8 opacity-40 mb-1.5" />
                            Specify a term and get a full explanation draft from Gemini
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {aiActiveTab === 'quiz' && (
                    <div className="space-y-4 bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-widest"><Sparkles className="text-indigo-600" size={14} /> Interactive AI Lecture Quiz</div>
                      
                      {quizSubmitted ? (
                        <div className="text-center py-6 space-y-3">
                          <div className="text-3xl font-extrabold text-indigo-600">{quizScore} / {quizQuestions.length}</div>
                          <p className="text-xs font-medium text-slate-800">Your custom generated quiz scores are validated</p>
                          <button
                            id="btn-retake-quiz"
                            onClick={() => {
                              setQuizSubmitted(false);
                              setQuizAnswers({});
                              setQuizScore(null);
                            }}
                            className="px-3.5 py-1.5 text-xs font-extrabold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition"
                          >
                            Retake Quiz
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleQuizSubmit} className="space-y-4">
                          {quizQuestions.map((q, idx) => (
                            <div key={idx} className="space-y-2">
                              <p className="text-xs font-bold text-slate-800 leading-tight">Q{idx+1}: {q.q}</p>
                              <div className="space-y-1">
                                {q.options.map((opt, oIdx) => (
                                  <label key={oIdx} className="flex items-start gap-2 p-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-lg cursor-pointer text-[11px] font-medium text-slate-700">
                                    <input
                                      type="radio"
                                      required
                                      name={`question-${idx}`}
                                      checked={quizAnswers[idx] === oIdx}
                                      onChange={() => setQuizAnswers(prev => ({ ...prev, [idx]: oIdx }))}
                                      className="mt-0.5"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                          <button
                            type="submit"
                            id="btn-submit-recorded-quiz"
                            className="w-full bg-slate-900 text-white font-extrabold text-xs py-2 rounded-lg transition hover:bg-slate-800"
                          >
                            Submit Answers
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {aiActiveTab === 'ask' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Ask the AI Instructor assistant</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={customQuestion}
                            onChange={(e) => setCustomQuestion(e.target.value)}
                            placeholder="Ask me anything about this lecture..."
                            className="w-full pl-3 pr-9 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                          />
                          <button
                            id="btn-send-custom"
                            onClick={submitCustomQuestion}
                            disabled={isCustomLoading}
                            className="absolute right-1 top-1 p-1 hover:bg-slate-100 rounded text-indigo-600 disabled:text-slate-300"
                          >
                            <Send size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm min-h-[150px] relative">
                        {isCustomLoading ? (
                          <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-xs font-semibold text-slate-500">
                            Thinking...
                          </div>
                        ) : null}
                        {customAnswer ? (
                          <div className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line pro prose-sm">
                            {customAnswer}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-slate-400 text-xs">
                            <Quote size={24} className="mx-auto text-indigo-500/20 mb-2" />
                            Ask specific, targeted timeline questions and allow Gemini to address your gaps instantenously.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload/Publish Recording modal form */}
      <AnimatePresence>
        {showAddRecModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              id="instructor-add-rec-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-100"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <PlayCircle className="text-indigo-600" size={18} />
                Publish Lecture Recording
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (onAddRecording) {
                  onAddRecording({
                    id: Math.random().toString(),
                    title: newRecTitle,
                    courseName: newRecCourse,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    duration: "45:00",
                    views: 0,
                    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
                    summary: `This is an automated summarizing outline for ${newRecTitle}. Topics discussed specify caching and memory overhead reductions.`,
                    topics: newRecTopics.split(',').map(tag => tag.trim()).filter(Boolean),
                  });
                }
                setNewRecTitle('');
                setNewRecTopics('');
                setShowAddRecModal(false);
                alert("Successfully published lecture recording playback into archives.");
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-650 uppercase mb-1">Lecture Title *</label>
                  <input
                    type="text"
                    required
                    value={newRecTitle}
                    onChange={(e) => setNewRecTitle(e.target.value)}
                    placeholder="e.g. Dynamic Programming Algorithms"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-650 uppercase mb-1">Course Track</label>
                  <select
                    value={newRecCourse}
                    onChange={(e) => setNewRecCourse(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none bg-slate-50"
                  >
                    <option value="Data Structure & Algorithms">Data Structure & Algorithms</option>
                    <option value="Advanced React & TypeScript">Advanced React & TypeScript</option>
                    <option value="Database Engineering & PostgreSQL">Database Engineering & PostgreSQL</option>
                    <option value="AI-Powered Platform Architecture">AI-Powered Platform Architecture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-655 uppercase mb-1">Topics covered (Comma separated)</label>
                  <input
                    type="text"
                    value={newRecTopics}
                    onChange={(e) => setNewRecTopics(e.target.value)}
                    placeholder="Memoization, Big-O metrics, Caching"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddRecModal(false)}
                    className="px-4 py-2 text-xs font-semibold border border-slate-250 text-slate-605 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-indigo-650 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Publish Playback
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
