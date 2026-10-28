import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Layers, BookOpen, Film, Image as ImageIcon, Video, HelpCircle, 
  Settings, Award, Users, BarChart3, ChevronRight, Play, Plus, Check, 
  Sliders, RefreshCw, Send, ArrowRight, Save, Trash2, MessageSquare, 
  Star, Zap, Network, Flame, Compass, Radio, Download, Globe, Laptop, 
  Clock, Target, Cpu, FileText, CheckCircle2, AlertTriangle, AlertCircle, 
  Calendar, Trophy, Briefcase, Volume2, Mic, Square, Paperclip, Upload, 
  Info, Lock, BookMarked, Eye, ChevronLeft, ChevronDown, CheckCircle,
  Copy, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sendMessageToTutor } from '../services/geminiService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AITutorViewProps {
  initialTab?: string;
  onTabChange?: (tab: string) => void;
  userRole?: string;
}

export const AITutorView: React.FC<AITutorViewProps> = ({ initialTab, onTabChange, userRole }) => {
  // Navigation Tabs for AI Tutor Workspace
  const [activeTabInternal, setActiveTabInternal] = useState<string>('ask-tutor');
  
  const activeTab = initialTab || activeTabInternal;
  const setActiveTab = (tab: string) => {
    setActiveTabInternal(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };
  
  // Theme and Accessibility states
  const [dyslexiaMode, setDyslexiaMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Gamification & Progress state
  const [xp, setXp] = useState<number>(3750);
  const [streak, setStreak] = useState<number>(45);
  const [level, setLevel] = useState<number>(14);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  // Mentor Personality Engine State
  const [currentPersonality, setCurrentPersonality] = useState<string>('academic');
  const personalities: Record<string, { name: string; role: string; desc: string; greeting: string; icon: any }> = {
    academic: {
      name: 'Prof. Isabella Al-Fara',
      role: 'Academic Mentor & Professor',
      desc: 'Structured, rigorous intellectual training emphasizing critical analysis and academic precision.',
      greeting: 'Greetings, scholar. I have assessed your recent progress in cognitive epistemology. What concept or problem can we dissect together today?',
      icon: <Award size={16} />
    },
    executive: {
      name: 'Chief David Mensah',
      role: 'Enterprise Executive Coach',
      desc: 'Action-oriented, practical frameworks focusing on strategy implementation & business ROI.',
      greeting: 'Welcome back! Let’s waste no time. What strategy models can we stress-test or build today to hit our milestone targets?',
      icon: <Target size={16} />
    },
    spiritual: {
      name: 'Father Gregory',
      role: 'Spiritual Guide & Chaplain',
      desc: 'Contemplative, faith-centered wisdom integrating ancient sacred histories with ethical reasoning.',
      greeting: 'Peace be with you. In our pursuit of scientific understanding, let’s take a breath to reflect on ethics, purpose, and the soul.',
      icon: <Compass size={16} />
    },
    research: {
      name: 'Dr. Linus Vance',
      role: 'Peer Review Supervisor',
      desc: 'Methodical researcher pointing out citations, proof of claims, and validating academic papers.',
      greeting: 'Ready to write? Let’s check our research references. I have loaded peer-reviewed journals aligned with your topic.',
      icon: <BookMarked size={16} />
    },
    companion: {
      name: 'Sam',
      role: 'Conversational Study Companion',
      desc: 'Relaxed, supportive helper creating simple diagrams, quizzes, and motivating checklists.',
      greeting: 'Hey! Good to see you. Don’t stress too much about testing today; we’ve got this! What topic should we sketch together?',
      icon: <Users size={16} />
    }
  };

  // Chat message thread
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 'm-init', 
      sender: 'ai', 
      text: personalities.academic.greeting,
      timestamp: '14:45'
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Socratic homework helper state
  const [uploadedFile, setUploadedFile] = useState<{name: string, size: string} | null>(null);
  const [socraticHintStep, setSocraticHintStep] = useState<number>(0);
  
  // Mock Exam Interactive State
  const [mockSelectedAnswers, setMockSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedExam, setSubmittedExam] = useState<boolean>(false);

  const mockQuestions = [
    {
      id: 1,
      q: "Under NQF Level 8 standards, how are micro-credentials structured for cross-border alignment?",
      options: [
        "Fixed 120 credit hour cycles only without modular recognition",
        "Stackable competence units verifiable via cryptographic proof of assessment",
        "Informal peer badges with no accredited ledger validation",
        "Government-only paper notarizations"
      ],
      correct: 1,
      explanation: "NQF Level 8 mandates stackable, sovereign-verifiable micro-credentials with defined cognitive taxonomy outcomes."
    },
    {
      id: 2,
      q: "In asynchronous distributed consensus, what problem does Paxos/Raft primarily solve?",
      options: [
        "Increasing cryptographic hash collision difficulty",
        "Replicating deterministic state machines across unreliable networks despite node dropouts",
        "Compressing video streams in real-time edge nodes",
        "Managing client-side CSS stylesheets"
      ],
      correct: 1,
      explanation: "Consensus protocols coordinate identical state transitions across a cluster of nodes subject to network delay and partition."
    },
    {
      id: 3,
      q: "How does the Socratic method accelerate conceptual retention compared to passive reading?",
      options: [
        "It forces memory memorization of literal keywords",
        "It stimulates metacognitive dissonance and prompts the student to synthesize hypotheses",
        "It reduces the total number of study hours required to zero",
        "It avoids all peer review evaluations"
      ],
      correct: 1,
      explanation: "Active generation and counter-questioning engage deep associative pathways in cognitive schema formation."
    }
  ];

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const addXp = (amount: number, reason: string) => {
    setXp(prev => {
      const next = prev + amount;
      if (Math.floor(next / 1000) > Math.floor(prev / 1000)) {
        setLevel(l => l + 1);
        setRecentNotification(`Level Up! You reached Level ${level + 1} (+${amount} XP)`);
      } else {
        setRecentNotification(`+${amount} XP: ${reason}`);
      }
      setTimeout(() => setRecentNotification(null), 3000);
      return next;
    });
  };

  const handlePersonalityChange = (key: string) => {
    setCurrentPersonality(key);
    const p = personalities[key];
    setMessages(prev => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        sender: 'ai',
        text: `Switched mentor mode to ${p.name} (${p.role}). ${p.greeting}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    addXp(15, `Consulted ${p.name}`);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userText = chatInput.trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [
      ...prev,
      { id: `u-${Date.now()}`, sender: 'user', text: userText, timestamp }
    ]);
    setChatInput('');
    setIsLoading(true);
    addXp(20, 'Socratic Query Prompted');

    try {
      const activeMentor = personalities[currentPersonality];
      const contextualPrompt = `[Mentor persona: ${activeMentor.name}, ${activeMentor.role}. Teaching approach: ${activeMentor.desc}]\n\nLearner question: ${userText}\n\nRespond as this mentor in an engaging, supportive, Socratic manner. Be concise, clear, and ask a thought-provoking follow-up question to test their understanding.`;
      
      const response = await sendMessageToTutor(contextualPrompt);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: response || 'I have reflected on your premise. How might this apply to edge constraints in real-world scenarios?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      addXp(10, 'Response digested');
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: 'Let us consider this step by step. What fundamental constraints govern the problem you are looking to address?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceListen = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setRecentNotification('Speech Recognition not supported in this browser environment');
      setTimeout(() => setRecentNotification(null), 3000);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript);
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setRecentNotification('Copied message to clipboard');
    setTimeout(() => setRecentNotification(null), 2500);
  };

  const handleSelectAnswer = (qId: number, optIdx: number) => {
    if (submittedExam) return;
    setMockSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleGradeExam = () => {
    setSubmittedExam(true);
    let correctCount = 0;
    mockQuestions.forEach(q => {
      if (mockSelectedAnswers[q.id] === q.correct) correctCount++;
    });
    addXp(correctCount * 30, `Completed diagnostic test (${correctCount}/${mockQuestions.length} correct)`);
  };

  return (
    <div className={`w-full space-y-4 animate-fade-in pb-12 text-zinc-100 ${dyslexiaMode ? 'font-mono' : ''}`}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {recentNotification && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#141B26] text-emerald-400 font-mono text-xs shadow-2xl flex items-center gap-2"
          >
            <Sparkles size={14} />
            <span>{recentNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================
          TOP HERO HUD (COGNISACRA AI TUTOR)
         ============================================================ */}
      <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-4 text-left">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                CogniSacra Socratic Engine v3.5
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
              Personalized Cognitive AI Tutor
            </h1>
            <p className="text-xs font-sans text-zinc-300 max-w-2xl leading-relaxed">
              Adaptive dialogue engine grounding critical inquiries, active recall diagnostics, and accredited curriculum synthesis.
            </p>
          </div>

          {/* Gamification & Accessibility HUD */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Level & XP */}
            <div className="px-3 py-2 rounded-xl bg-[#141B26] flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                L{level}
              </div>
              <div className="text-xs font-mono">
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>LEVEL {level}</span>
                  <span className="text-emerald-400 font-bold">{xp} XP</span>
                </div>
                <div className="w-24 bg-[#0E131C] h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${(xp % 1000) / 10}%` }} />
                </div>
              </div>
            </div>

            {/* Streak */}
            <div className="px-3 py-2 rounded-xl bg-[#141B26] flex items-center gap-2 text-xs font-mono">
              <Flame size={16} className="text-amber-400 fill-amber-400" />
              <div>
                <span className="text-[10px] text-zinc-400 block">STREAK</span>
                <span className="text-white font-bold">{streak} Days</span>
              </div>
            </div>

            {/* Accessibility toggle */}
            <button
              onClick={() => setDyslexiaMode(!dyslexiaMode)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold transition cursor-pointer ${
                dyslexiaMode ? 'bg-emerald-500 text-black' : 'bg-[#141B26] text-zinc-400 hover:text-white'
              }`}
              title="Toggle Dyslexia-friendly typography"
            >
              Abc Font
            </button>
          </div>
        </div>

        {/* Workspace Mode Switcher (Sleek Horizontal Segment Switcher) */}
        <div className="pt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-zinc-800/40">
          {[
            { id: 'ask-tutor', label: 'CogniSacra Chat Tutor', icon: <MessageSquare size={13} /> },
            { id: 'homework-help', label: 'Homework Socratic Helper', icon: <Upload size={13} /> },
            { id: 'exam-prep', label: 'Exam Readiness Cockpit', icon: <Award size={13} /> },
            { id: 'knowledge-map', label: 'Neural Knowledge Graph', icon: <Network size={13} /> },
            { id: 'analytics', label: 'Learning Analytics', icon: <BarChart3 size={13} /> }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition shrink-0 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'bg-[#141B26] text-zinc-400 hover:text-white hover:bg-[#182130]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================
          TAB 1: COGNISACRA CHAT TUTOR (SOCRATIC CHAT & MENTOR ENGINE)
         ============================================================ */}
      {activeTab === 'ask-tutor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-left">
          
          {/* Left Column (4 COLS): Active Mentor Selection */}
          <div className="lg:col-span-4 bg-[#0E131C] p-5 rounded-2xl shadow-xl space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                Select Mentor Persona
              </span>
              <p className="text-xs font-sans text-zinc-400 pt-0.5">
                Each persona customizes reasoning style and critique depth.
              </p>
            </div>

            <div className="space-y-2">
              {Object.entries(personalities).map(([key, p]) => {
                const isSelected = currentPersonality === key;
                return (
                  <div
                    key={key}
                    onClick={() => handlePersonalityChange(key)}
                    className={`p-3 rounded-xl transition cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-emerald-500/15 text-white'
                        : 'bg-[#141B26] text-zinc-300 hover:bg-[#182130]'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-emerald-500 text-black' : 'bg-[#0E131C] text-emerald-400'}`}>
                      {p.icon}
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold font-serif text-white">{p.name}</h4>
                        {isSelected && <span className="text-[9px] font-mono text-emerald-400 font-bold">ACTIVE</span>}
                      </div>
                      <p className="text-[10px] font-mono text-emerald-400/90">{p.role}</p>
                      <p className="text-[11px] font-sans text-zinc-400 line-clamp-2 pt-0.5 leading-snug">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-[#141B26] text-xs font-mono text-zinc-400 space-y-1">
              <span className="text-[10px] uppercase text-zinc-500 block">Socratic Policy</span>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                The AI will not simply give answers; it provides conceptual scaffolding to build sovereign intellectual mastery.
              </p>
            </div>
          </div>

          {/* Right Column (8 COLS): Socratic Chat Canvas */}
          <div className="lg:col-span-8 bg-[#0E131C] rounded-2xl shadow-xl p-5 flex flex-col h-[600px] justify-between relative">
            
            {/* Top Chat Info Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                  {personalities[currentPersonality].icon}
                </div>
                <div>
                  <h3 className="text-xs font-bold font-serif text-white">
                    {personalities[currentPersonality].name}
                  </h3>
                  <p className="text-[10px] font-mono text-emerald-400">
                    Socratic Mode · Ready for Inquiry
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMessages([{ id: 'init', sender: 'ai', text: personalities[currentPersonality].greeting, timestamp: 'Now' }])}
                className="p-1.5 rounded-lg bg-[#141B26] hover:bg-[#1A2332] text-zinc-400 hover:text-white transition cursor-pointer text-xs font-mono flex items-center gap-1"
                title="Reset conversation"
              >
                <RotateCcw size={12} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>

            {/* Chat Thread */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-3.5 my-3 pr-2 no-scrollbar text-xs">
              {messages.map(m => {
                const isUser = m.sender === 'user';
                return (
                  <div key={m.id} className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles size={13} />
                      </div>
                    )}

                    <div className={`max-w-[80%] rounded-2xl p-3.5 space-y-1 relative group ${
                      isUser 
                        ? 'bg-emerald-600 text-white rounded-br-none' 
                        : 'bg-[#141B26] text-zinc-200 rounded-bl-none'
                    }`}>
                      <p className="leading-relaxed font-sans text-xs whitespace-pre-wrap">{m.text}</p>
                      <div className="flex items-center justify-between pt-1 text-[9px] font-mono opacity-60">
                        <span>{m.timestamp}</span>
                        {!isUser && (
                          <button 
                            onClick={() => copyToClipboard(m.text)}
                            className="opacity-0 group-hover:opacity-100 transition p-1 hover:text-emerald-300"
                            title="Copy text"
                          >
                            <Copy size={11} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#141B26] text-emerald-400 text-xs font-mono animate-pulse w-fit">
                  <RefreshCw size={13} className="animate-spin" />
                  <span>Synthesizing cognitive framework...</span>
                </div>
              )}
            </div>

            {/* Quick Prompt Chips */}
            <div className="pt-2 pb-1 flex flex-wrap gap-1.5 overflow-x-auto no-scrollbar">
              {[
                "Deconstruct Byzantine fault tolerance",
                "Explain NQF Level 8 accreditation requirements",
                "Stress-test my curriculum design",
                "Help me formulate Socratic proof"
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setChatInput(p)}
                  className="px-2.5 py-1 rounded-lg bg-[#141B26] hover:bg-[#1A2332] text-[10px] font-mono text-zinc-400 hover:text-emerald-300 transition shrink-0"
                >
                  💡 {p}
                </button>
              ))}
            </div>

            {/* Chat Input Dock */}
            <form onSubmit={handleSendMessage} className="pt-2 relative flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Ask ${personalities[currentPersonality].name} a question...`}
                className="w-full px-4 py-3 bg-[#141B26] text-xs font-mono text-white placeholder-zinc-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition pr-28"
                disabled={isLoading}
              />

              <div className="absolute right-2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleVoiceListen}
                  className={`p-2 rounded-lg transition ${
                    isListening 
                      ? 'bg-rose-500 text-white animate-pulse' 
                      : 'bg-[#0E131C] text-zinc-400 hover:text-white'
                  }`}
                  title="Voice dictation"
                >
                  <Mic size={14} />
                </button>

                <button
                  type="submit"
                  disabled={!chatInput.trim() || isLoading}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                >
                  <span>Ask</span>
                  <Send size={12} />
                </button>
              </div>
            </form>

          </div>

        </div>
      )}

      {/* ============================================================
          TAB 2: HOMEWORK HELPER (SOCRATIC ASSIGNMENT EXPLORATION)
         ============================================================ */}
      {activeTab === 'homework-help' && (
        <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-5 text-left">
          <div className="space-y-1">
            <h2 className="text-base font-bold font-serif text-white">
              Socratic Assignment Discovery Guide
            </h2>
            <p className="text-xs font-mono text-emerald-400">
              Grounded Socratic discovery: Upload your problem statement or draft to receive guided conceptual questions without direct solution leakage.
            </p>
          </div>

          {/* Upload Dropzone */}
          <div 
            onClick={() => {
              setUploadedFile({ name: 'Distributed_Systems_Midterm_Draft.pdf', size: '2.4 MB' });
              setSocraticHintStep(1);
              addXp(30, 'Document uploaded for Socratic analysis');
            }}
            className="p-8 rounded-2xl bg-[#141B26] hover:bg-[#182130] text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2 group"
          >
            <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
              <Upload size={24} />
            </div>
            <div>
              <p className="text-xs font-bold font-mono text-white">
                Drag & Drop assignment sheet, research draft, or problem statement
              </p>
              <p className="text-[10px] font-mono text-zinc-500 mt-1">
                Supports PDF, DOCX, Code files, PNG up to 25MB (Click to simulate instant upload)
              </p>
            </div>
          </div>

          {/* Active Socratic Steps */}
          {uploadedFile && (
            <div className="p-5 rounded-xl bg-[#141B26] space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/40 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <FileText className="text-emerald-400" size={16} />
                  <span className="font-bold text-white">{uploadedFile.name} ({uploadedFile.size})</span>
                </div>
                <button 
                  onClick={() => { setUploadedFile(null); setSocraticHintStep(0); }}
                  className="text-zinc-500 hover:text-rose-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Multi-step progression */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                  AI Socratic Discovery Path
                </span>

                {socraticHintStep >= 1 && (
                  <div className="p-4 rounded-xl bg-[#0E131C] text-xs font-sans space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs">
                      <CheckCircle2 size={14} />
                      <span>Step 1: Identifying Core Axioms & Invariants</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">
                      In your draft on consensus latency, what is your chosen upper bound for message propagation delay? If message delivery cannot be guaranteed, does the FLP Impossibility Result prevent synchronous termination?
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                      <button 
                        onClick={() => { setSocraticHintStep(2); addXp(20, 'Addressed step 1 invariant'); }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-bold"
                      >
                        "We assume partial synchrony with $\Delta$ timeout bounds"
                      </button>
                      <button 
                        onClick={() => { setSocraticHintStep(2); addXp(20, 'Explored asynchronous model'); }}
                        className="px-3 py-1.5 rounded-lg bg-[#141B26] text-zinc-300 hover:text-white"
                      >
                        "We employ randomized consensus to bypass FLP"
                      </button>
                    </div>
                  </div>
                )}

                {socraticHintStep >= 2 && (
                  <div className="p-4 rounded-xl bg-[#0E131C] text-xs font-sans space-y-2 animate-fade-in">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs">
                      <CheckCircle2 size={14} />
                      <span>Step 2: Stress-Testing Boundary Conditions</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">
                      Precisely formulated! Under partial synchrony, what happens during the periods of instability before Global Stabilization Time (GST)?
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                      <button 
                        onClick={() => { setSocraticHintStep(3); addXp(30, 'Completed Socratic formulation cycle'); }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-bold"
                      >
                        "Safety is never violated; only liveness is delayed"
                      </button>
                    </div>
                  </div>
                )}

                {socraticHintStep >= 3 && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-300 text-xs font-sans space-y-2 animate-fade-in">
                    <div className="flex items-center gap-2 font-mono font-bold text-xs">
                      <Sparkles size={14} className="text-emerald-400" />
                      <span>Discovery Verified: Socratic Reasoning Validated</span>
                    </div>
                    <p className="text-zinc-200 leading-relaxed">
                      Magnificent synthesis! You have derived the foundational proof that Raft/Paxos maintain invariant safety regardless of delay. You are ready to document this section in your academic submission.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          TAB 3: EXAM READINESS COCKPIT
         ============================================================ */}
      {activeTab === 'exam-prep' && (
        <div className="space-y-4 text-left">
          
          {/* Readiness gauge card */}
          <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                Predictive Performance Model
              </span>
              <h2 className="text-lg font-bold font-serif text-white">
                Exam Readiness Forecast: Grade A (89% Confidence)
              </h2>
              <p className="text-xs font-sans text-zinc-300 max-w-xl leading-relaxed">
                Aggregated mastery scores across quizzes, Socratic sessions, and lab benchmarks indicate strong alignment with NQF Level 8 standards.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-[#141B26] flex items-center justify-center font-mono font-bold text-xl text-emerald-400 shrink-0">
                89%
              </div>
            </div>
          </div>

          {/* Interactive Diagnostic Practice Exam */}
          <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-serif text-white">Active Diagnostic Mock Exam</h3>
                <p className="text-xs font-mono text-zinc-400">Answer the questions below to stress-test your knowledge retention</p>
              </div>
              <button 
                onClick={handleGradeExam}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition cursor-pointer"
              >
                {submittedExam ? 'Recalculate Score' : 'Submit & Grade Exam'}
              </button>
            </div>

            <div className="space-y-4">
              {mockQuestions.map((q, idx) => {
                const selected = mockSelectedAnswers[q.id];
                const isCorrect = submittedExam && selected === q.correct;
                const isWrong = submittedExam && selected !== undefined && selected !== q.correct;

                return (
                  <div key={q.id} className="p-4 rounded-xl bg-[#141B26] space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">{idx + 1}.</span>
                      <h4 className="text-xs font-bold font-serif text-white">{q.q}</h4>
                    </div>

                    <div className="space-y-1.5 pl-4">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selected === optIdx;
                        let optionStyle = 'bg-[#0E131C] text-zinc-300 hover:bg-[#121824]';

                        if (submittedExam) {
                          if (optIdx === q.correct) {
                            optionStyle = 'bg-emerald-500/20 text-emerald-300 font-bold';
                          } else if (isChosen && optIdx !== q.correct) {
                            optionStyle = 'bg-rose-500/20 text-rose-300';
                          }
                        } else if (isChosen) {
                          optionStyle = 'bg-emerald-500/20 text-emerald-300 font-bold';
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectAnswer(q.id, optIdx)}
                            className={`p-2.5 rounded-lg text-xs font-mono cursor-pointer transition flex items-center gap-2 ${optionStyle}`}
                          >
                            <span className="w-4 h-4 rounded-full bg-[#141B26] flex items-center justify-center text-[10px] shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {submittedExam && (
                      <div className={`p-3 rounded-lg text-xs font-mono pl-4 ${isCorrect ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>
                        <div className="font-bold flex items-center gap-1.5">
                          {isCorrect ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                          <span>{isCorrect ? 'Correct!' : 'Review Concept:'}</span>
                        </div>
                        <p className="pt-0.5 text-[11px] text-zinc-300">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================
          TAB 4: NEURAL KNOWLEDGE GRAPH
         ============================================================ */}
      {activeTab === 'knowledge-map' && (
        <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-5 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-serif text-white">Skills & Concept Knowledge Graph</h2>
              <p className="text-xs font-mono text-zinc-400">Interactive topological tree of your cognitive competencies</p>
            </div>
            <Network size={18} className="text-emerald-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[
              { title: 'Distributed Systems Invariants', mastery: 94, status: 'Mastered', desc: 'Consensus protocols, Byzantine models, and partition tolerance.' },
              { title: 'Cryptographic Sovereign Ledgers', mastery: 88, status: 'Advanced', desc: 'Proof of validation, zero-knowledge proofs, and hash graphs.' },
              { title: 'PostgreSQL Relational Topology', mastery: 92, status: 'Mastered', desc: 'ACID guarantees, indexing strategies, and connection pooling.' },
              { title: 'Cognitive Schema Architecture', mastery: 78, status: 'Progressing', desc: 'Socratic inquiry pathways and spaced repetition optimization.' },
              { title: 'NQF Level 8 Alignment', mastery: 85, status: 'Advanced', desc: 'Continental accreditation taxonomies and competency credits.' },
              { title: 'Neural Attention Mechanisms', mastery: 72, status: 'In Review', desc: 'Transformer self-attention mathematics and KV cache optimization.' }
            ].map(node => (
              <div key={node.title} className="p-4 rounded-xl bg-[#141B26] space-y-2 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-emerald-400 font-bold uppercase">{node.status}</span>
                    <span className="text-white font-bold">{node.mastery}%</span>
                  </div>
                  <h3 className="text-xs font-bold font-serif text-white">{node.title}</h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-2">{node.desc}</p>
                </div>

                <div className="w-full bg-[#0E131C] h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${node.mastery}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 5: LEARNING ANALYTICS
         ============================================================ */}
      {activeTab === 'analytics' && (
        <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-5 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-serif text-white">Cognitive Analytics & Retention Velocity</h2>
              <p className="text-xs font-mono text-zinc-400">Quantitative metrics based on active Socratic retrieval sessions</p>
            </div>
            <BarChart3 size={18} className="text-emerald-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl bg-[#141B26] space-y-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Retention Velocity</span>
              <div className="text-xl font-bold font-mono text-emerald-400">96.4%</div>
              <p className="text-[10px] font-mono text-zinc-500">+4.2% this cycle</p>
            </div>

            <div className="p-4 rounded-xl bg-[#141B26] space-y-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Study Cockpit Hours</span>
              <div className="text-xl font-bold font-mono text-white">128.5 hrs</div>
              <p className="text-[10px] font-mono text-zinc-500">Accredited time verified</p>
            </div>

            <div className="p-4 rounded-xl bg-[#141B26] space-y-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Socratic Queries</span>
              <div className="text-xl font-bold font-mono text-emerald-400">412</div>
              <p className="text-[10px] font-mono text-zinc-500">Inquiry-driven exchanges</p>
            </div>

            <div className="p-4 rounded-xl bg-[#141B26] space-y-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Mastery Milestones</span>
              <div className="text-xl font-bold font-mono text-white">18 Badges</div>
              <p className="text-[10px] font-mono text-zinc-500">Cryptographically sealed</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AITutorView;
