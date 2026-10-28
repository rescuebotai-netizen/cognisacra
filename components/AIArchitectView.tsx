import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Layers, BookOpen, Film, Image as ImageIcon, Video, HelpCircle, 
  Settings, Award, Users, ShieldAlert, BarChart3, ChevronRight, Play, 
  Plus, Check, Sliders, RefreshCw, Send, ArrowRight, Save, Trash2, 
  MessageSquare, Star, Zap, Network, Flame, Compass, Radio, Download, 
  Globe, Laptop, Clock, Target, Cpu, FileText, CheckCircle2, AlertTriangle, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIArchitectViewProps {
  userRole: string;
}

// Mock Data
const SUGGESTED_OUTCOMES = [
  "Synthesize core deep learning heuristics configuration constraints.",
  "Evaluate and test distributed transformer training protocols.",
  "Architect ethical deployment guardrails for under-resourced markets.",
  "Formulate production pipeline automation for edge-computing frameworks."
];

const INITIAL_MODULES = [
  {
    id: 'm1',
    title: 'Module 1: AI & LLM Systems Design Heuristics',
    lessons: [
      { id: 'l1-1', title: 'Lesson 1.1: Foundations of Multi-Modal Context Windows', type: 'text' },
      { id: 'l1-2', title: 'Lesson 1.2: Fine-Tuning Protocols & Low-Rank Adaptation (LoRA)', type: 'video' },
      { id: 'l1-3', title: 'Lesson 1.3: Tokenization Alignment & Underrepresented Alphabets', type: 'slides' }
    ],
    quiz: { id: 'q1', title: 'Module 1 Assessment: Deep Context Architectures' }
  },
  {
    id: 'm2',
    title: 'Module 2: Edge Deployments & Machine Learning foundations',
    lessons: [
      { id: 'l2-1', title: 'Lesson 2.1: Model Quantization & Integer Direct-Inference', type: 'text' },
      { id: 'l2-2', title: 'Lesson 2.2: Dynamic Sharding Across African Multi-Cluster Pipelines', type: 'video' }
    ],
    quiz: { id: 'q2', title: 'Module 2 Assignment: Edge Quantization & Inference Lab' }
  }
];

export const AIArchitectView: React.FC<AIArchitectViewProps> = ({ userRole }) => {
  // Navigation Tabs for active journeys
  const [activeStep, setActiveStep] = useState<string>('dashboard');
  
  // Vision Builder Settings State
  const [vision, setVision] = useState({
    title: 'AI & Machine Learning Certification for African Entrepreneurs',
    category: 'Computer Science & Business Technology',
    audience: 'Fintech Startup Founders, Agritech Engineers, and Product Architects',
    level: 'Advanced',
    duration: '12 Weeks',
    language: 'English',
    industry: 'Technology, Agriculture & Mobile Financial Services',
    country: 'Pan-African (Nigeria, Kenya, South Africa, Rwanda)',
    accreditation: 'NQF Level 8 Alignment (SAQA, SETA Standards)',
    prompt: 'Create a highly practical 12-week AI and ML certification program designed to build enterprise-grade reasoning models for high-latency mobile payment networks and local supply engines.'
  });

  // Curriculum Builder Local State
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [draggedLessonId, setDraggedLessonId] = useState<string | null>(null);
  const [gptPrompt, setGptPrompt] = useState<string>('');
  const [isCopilotGenerating, setIsCopilotGenerating] = useState(false);
  const [chatLog, setChatLog] = useState<Array<{role: 'user' | 'assistant', text: string}>>([
    { role: 'assistant', text: 'Salutations. I am the CogniSacra Architect AI engine. I’ve initialized our SAQA-aligned Knowledge Map. Ask me to generate modules, design assignments, or align outcomes in real-time.' }
  ]);
  const [newModuleName, setNewModuleName] = useState('');

  // Generation Simulation state
  const [genState, setGenState] = useState<'idle' | 'generating' | 'completed'>('idle');
  const [genProgress, setGenProgress] = useState(0);
  const [genLog, setGenLog] = useState<string[]>([]);

  // Knowledge Graph nodes selection state
  const [selectedNode, setSelectedNode] = useState<string>('ai-fundamentals');

  // Interactive Lesson Builder blocks list
  const [lessonBlocks, setLessonBlocks] = useState<Array<{id: string, type: string, content: string}>>([
    { id: 'b1', type: 'heading', content: 'Cognitive Offloading & Multi-Tier Model Quantization' },
    { id: 'b2', type: 'text', content: 'In high-latency networks common in remote municipal sectors, model weight sizes degrade application response rates. We implement a multi-tier quantization paradigm using FP8 gradients during local fallback cache iterations...' },
    { id: 'b3', type: 'slides', content: 'Slides: Core Quantization Mechanics for Low Bandwidth' },
    { id: 'b4', type: 'quiz', content: 'Quiz Block: Test knowledge on model layer weight extraction' }
  ]);
  const [blockInput, setBlockInput] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState<'text' | 'video' | 'audio' | 'slides' | 'quiz'>('text');

  // Multimedia Studio States
  const [mmTab, setMmTab] = useState<'avatar' | 'audio' | 'image' | 'slides'>('avatar');
  const [avatarScript, setAvatarScript] = useState('Welcome to Lecture 1.1! Today we are configuring a secure low-rank adaptation matrix target directly inside of localized web-browser frames.');
  const [isGeneratingMM, setIsGeneratingMM] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // Student Simulator Persona Selector
  const [selectedStudent, setSelectedStudent] = useState<'beginner' | 'average' | 'striving' | 'expert'>('beginner');
  const [simQuestion, setSimQuestion] = useState('What does the low-rank adaptation step actually do? Can you simplify?');
  const [simAnswer, setSimAnswer] = useState('Lacks foundational matrix arithmetic models. Will experience severe drop-off risk (D+) around Week 3 when we mathematically decompose Singular Value Decompositions. Recommended remedial quiz trigger.');

  // Simulation parameters for student triggers
  const studentProfiles = {
    beginner: {
      labels: 'Beginner Student (No coding fallback)',
      risk: 'High Drop-Off Risk (85% forecast if unmediated)',
      gaps: 'Basic matrix Multiplication, Python CLI paradigms',
      hotspots: 'Module 1 Lesson 1.2, Module 2 Quantization',
      predictedQ: 'Why is vector scaling mathematically required during bias loading?'
    },
    average: {
      labels: 'Average Student (Self-taught scripting)',
      risk: 'Medium Drop-Off Risk (30% forecast if unmediated)',
      gaps: 'Probability and linear algebra mechanics',
      hotspots: 'Module 1 Quiz, Module 2 Database Sharding',
      predictedQ: 'How do the local gradients synchronize back to the centralized cloud DB without stalling user responses?'
    },
    striving: {
      labels: 'Struggling Student (Low bandwidth latency)',
      risk: 'Critical Drop-Off Risk (92% connectivity bottlenecks)',
      gaps: 'Offline lesson synchronization packets',
      hotspots: 'Video streaming buffers in Module 1 Lesson 1.2',
      predictedQ: 'Can I perform the local inference tasks entirely via SMS text buffers or compressed WhatsApp payloads?'
    },
    expert: {
      labels: 'Expert Student (Systems Developer)',
      risk: 'Very Low Drop-Off Risk (under 2% forecast)',
      gaps: 'Advanced edge-level hardware quantization guides',
      hotspots: 'None. Seeks advanced sandbox research papers',
      predictedQ: 'Where is the custom kernel source code located for the specialized GPU caching pipeline?'
    }
  };

  // Co-Instructor Comments list
  const [comments, setComments] = useState([
    { id: 'c1', author: 'Dr. Mariam Cole (Reviewer)', text: 'The accreditation mapping for SETA requires at least 4 hours of dedicated practical assessment on edge sharding. Let’s add a practical laboratory block to Module 2.', date: 'Joined 2hr ago', approved: false },
    { id: 'c2', author: 'Prof. Joseph Adebayo (Lead)', text: 'This curriculum matches the NQF requirements perfectly. Let’s publish as a private package first.', date: 'Joined 1hr ago', approved: true }
  ]);
  const [commentInput, setCommentInput] = useState('');

  // Global Toast and Generation State simulation
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Simulate curriculum generation cycle
  const handleStartSmartGeneration = () => {
    if (!vision.title) {
      showToast('❌ Please specify a Learning Program Title first.');
      return;
    }
    setGenState('generating');
    setGenProgress(5);
    setGenLog(['CogniSacra Intelligence Engine initializing...', 'Parsing accreditation target: Pan-African NQF Standard Layer']);
  };

  useEffect(() => {
    if (genState === 'generating') {
      const interval = setInterval(() => {
        setGenProgress(prev => {
          const next = prev + 15;
          if (next >= 100) {
            clearInterval(interval);
            setGenState('completed');
            showToast('🎉 World-Class Curriculum Blueprints mapped & loaded!');
            return 100;
          }
          
          // Log messages based on progress
          if (next === 20) setGenLog(prev => [...prev, '✓ Formulated Program Structure & Prerequisites.']);
          if (next === 50) setGenLog(prev => [...prev, '✓ Mapped Knowledge Graph Nodes & Vector Clustered Networks.']);
          if (next === 65) setGenLog(prev => [...prev, '✓ Generated lesson objectives linked to Bloom\'s Taxonomy (NQF level 8).']);
          if (next === 85) setGenLog(prev => [...prev, '✓ Pre-computed Assessment plans, Rubric guidelines & Student questions.']);
          return next;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [genState]);

  // AI Copilot response simulation
  const handleSendCopilotPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gptPrompt.trim()) return;

    const userMessage = { role: 'user' as const, text: gptPrompt };
    setChatLog(prev => [...prev, userMessage]);
    setGptPrompt('');
    setIsCopilotGenerating(true);

    setTimeout(() => {
      let reply = "I analyzed your request. I recommend adding a Case Study focusing on low-bandwidth payment pipelines using sub-tokens. Should we append this to Module 2?";
      if (userMessage.text.toLowerCase().includes('quiz')) {
        reply = "✓ Formulated NQF Aligned Quiz: 5 questions covering Quantization layers and matrix mathematics, calibrated to Bloom’s Analyze level.";
      } else if (userMessage.text.toLowerCase().includes('module') || userMessage.text.toLowerCase().includes('lesson')) {
        reply = "✓ Successfully generated 3 extra lesson scopes covering real-time localized caches with integrated code challenges.";
      }
      setChatLog(prev => [...prev, { role: 'assistant', text: reply }]);
      setIsCopilotGenerating(false);
      showToast('✓ AI Assistant updated workspace blueprint');
    }, 1200);
  };

  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleName.trim()) return;
    const newM = {
      id: `m-${Date.now()}`,
      title: newModuleName,
      lessons: [
        { id: `l-${Date.now()}-1`, title: 'Lesson: Dynamic Local Context Adaptation', type: 'text' }
      ],
      quiz: { id: `q-${Date.now()}`, title: 'Module Quiz: Assessment Protocol' }
    };
    setModules([...modules, newM]);
    setNewModuleName('');
    showToast('✓ Custom Module Appended to Canvas');
  };

  // Add block to lesson
  const handleAddLessonBlock = () => {
    if (!blockInput.trim()) return;
    const block = {
      id: `block-${Date.now()}`,
      type: selectedMediaType,
      content: blockInput
    };
    setLessonBlocks([...lessonBlocks, block]);
    setBlockInput('');
    showToast('✓ Content layout block inserted');
  };

  // Run Multimedia Generation
  const handleGenerateMultimedia = () => {
    setIsGeneratingMM(true);
    showToast('🎬 Streaming render instructions to CogniSacra AI Media Server...');
    setTimeout(() => {
      setIsGeneratingMM(false);
      if (mmTab === 'avatar') {
        setGeneratedVideoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
      } else if (mmTab === 'audio') {
        setGeneratedAudioUrl('Generated Narration Node (Slightly warm accent, optimized sound signature, 128kbps)');
      } else if (mmTab === 'image') {
        setGeneratedImageUrl('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80');
      }
      showToast('✓ Media rendering complete and saved in library.');
    }, 1500);
  };

  useEffect(() => {
    const activePersona = studentProfiles[selectedStudent];
    setSimAnswer(`${activePersona.labels} has ${activePersona.risk}. Primary Knowledge Gaps are detected in: ${activePersona.gaps}. Target drop-off hotspot is: ${activePersona.hotspots}. Recommended recovery: trigger remedial pathways.`);
  }, [selectedStudent]);

  return (
    <div className="bg-[#0B1020] text-gray-100 min-h-screen rounded-3xl p-6 font-sans relative border border-slate-800 shadow-2xl overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-950/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header & Title bar */}
      <div className="relative border-b border-slate-800 pb-5 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-purple-500/20 flex items-center gap-1.5">
              <Star size={11} className="text-yellow-400 fill-yellow-400 animate-pulse" />
              CogniSacra Instructor Platform
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-extrabold uppercase px-2 py-1 rounded-full border border-emerald-500/20">
              LXOS Engine v4.2
            </span>
          </div>
          <h1 className="text-3xl font-black mt-2 uppercase tracking-tight text-white font-serif bg-gradient-to-r from-white via-indigo-200 to-purple-400 bg-clip-text text-transparent">
            AI Architect Workstation
          </h1>
          <p className="text-xs text-slate-450 uppercase tracking-widest font-bold font-mono mt-1 text-slate-400">
            End-to-End Curriculum Design, Multimedia Production & Quality Assurance
          </p>
        </div>

        {/* Global Save & Deploy controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => showToast('✓ Blueprint saved locally as workspace Draft.')}
            className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-850 flex items-center gap-1.5 transition active:scale-95"
          >
            <Save size={13} />
            <span>Save Workspace Draft</span>
          </button>
          <button 
            onClick={() => {
              setActiveStep('publishing');
              showToast('Navigated to Publishing Command Center Dashboard.');
            }}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-purple-900/30 transition active:scale-95 text-white"
          >
            <Zap size={13} className="text-yellow-300 animate-bounce" />
            <span>Publish Program</span>
          </button>
        </div>
      </div>

      {/* Floating alert/toasts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-8 right-8 z-50 bg-[#141b30] text-gray-100 border border-purple-500/30 font-bold text-xs px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5"
          >
            <Sparkles size={14} className="text-yellow-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Modular Navigation User Journey Map */}
        <div className="lg:col-span-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-3 shadow-sm backdrop-blur-md">
          <h2 className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest pl-2 mb-2 font-mono">
            AI Architect Suite Journeys
          </h2>
          
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: '0. Entry Dashboard', icon: <Radio size={14} /> },
              { id: 'vision', label: '1. Vision Builder', icon: <Compass size={14} /> },
              { id: 'curriculum', label: '2. Curriculum Workspace', icon: <Layers size={14} /> },
              { id: 'graph', label: '3. Knowledge Graph Map', icon: <Network size={14} /> },
              { id: 'builder', label: '4. Block Lesson Builder', icon: <BookOpen size={14} /> },
              { id: 'multimedia', label: '5. Multimedia Studio', icon: <Film size={14} /> },
              { id: 'assessments', label: '6. Assessment Architect', icon: <HelpCircle size={14} /> },
              { id: 'path', label: '7. Learning Path Planner', icon: <Sliders size={14} /> },
              { id: 'tutor', label: '8. AI Tutor Simulator', icon: <Cpu size={14} /> },
              { id: 'compliance', label: '9. Accreditation & QA Review', icon: <Award size={14} /> },
              { id: 'collaboration', label: '10. Collaboration Hub', icon: <Users size={14} /> },
              { id: 'publishing', label: '11. Publishing & SCORM', icon: <Laptop size={14} /> },
              { id: 'analytics', label: '12. Predictive Insights', icon: <BarChart3 size={14} /> },
            ].map(step => {
              const isActive = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-900/50 to-indigo-900/40 text-purple-300 border-l-4 border-purple-500 shadow-inner' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={isActive ? 'text-purple-400' : 'text-slate-500'}>{step.icon}</span>
                    <span className="truncate">{step.label}</span>
                  </div>
                  {isActive && <ChevronRight size={12} className="text-purple-400" />}
                </button>
              );
            })}
          </nav>

          <div className="h-px bg-slate-800/80 my-4"></div>

          {/* Quick Metrics */}
          <div className="p-3 bg-indigo-950/20 rounded-xl border border-indigo-900/30 text-left">
            <span className="text-[10px] text-slate-500 font-extrabold block uppercase tracking-wider font-mono">Accreditation Alignment</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-black text-emerald-400">SAQA NQF Level 8</span>
              <span className="bg-emerald-500/25 h-2 w-2 rounded-full animate-ping"></span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Estimated study credits mapped: 120 credits. All exit levels matched automatically.
            </p>
          </div>
        </div>

        {/* Right Side: Step Contents */}
        <div className="lg:col-span-9 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* STEP 0: ENTRY DASHBOARD */}
            {activeStep === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#12162e] via-[#0d1020] to-[#14122d] border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center justify-center space-y-6">
                  <div className="absolute right-0 top-0 w-80 h-80 bg-purple-700/10 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-2xl animate-pulse">
                    <Sparkles className="text-purple-400 text-3xl" size={32} />
                  </div>
                  
                  <div className="space-y-2 max-w-2xl">
                    <h2 className="text-3xl font-black font-serif uppercase tracking-tight text-white">
                      Build World-Class Learning Experiences
                    </h2>
                    <p className="text-sm text-slate-400 text-slate-300">
                      Instantly transform high-level vision criteria into a verified, SAQA-accredited program layout. Author curriculum blueprints, generate slide structures, evaluate competency rubrics and publish complete assets with AI.
                    </p>
                  </div>

                  <div className="w-full max-w-xl p-5 bg-[#090c18]/80 border border-slate-800 rounded-2xl flex flex-col items-start space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">What would you like to create today?</span>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full">
                      {[
                        'Course', 'Masterclass', 'Training Program', 'Coaching Program', 
                        'Certification', 'Bootcamp', 'University Module', 'Corporate Training', 
                        'Workshop Series', 'Membership Program'
                      ].map(option => (
                        <button
                          key={option}
                          onClick={() => {
                            setVision({...vision, title: `${option} in Distributed AI Systems`});
                            setActiveStep('vision');
                            showToast(`Selected "${option}" experience format!`);
                          }}
                          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition text-center truncate"
                        >
                          ○ {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveStep('vision')}
                    className="flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-black rounded-xl uppercase tracking-wider active:scale-95 transition text-white shadow-lg"
                  >
                    <span>Create New Learning Experience</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* Quick Actions Panel */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1 font-mono">
                    Direct Launch Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { title: 'Generate Curriculum', desc: 'Auto-construct complete lesson trees', step: 'vision' },
                      { title: 'Import Existing Content', desc: 'Sync PDFs, slide files & videos', step: 'builder' },
                      { title: 'Clone Existing Course', desc: 'Duplicate workspace blueprint', step: 'curriculum' },
                      { title: 'Create Learning Path', desc: 'Design branching adaptive routes', step: 'path' },
                      { title: 'Build Certification Program', desc: 'Establish corporate/SETA badges', step: 'compliance' },
                      { title: 'Generate Assessments', desc: 'Bloom Taxonomy question bank drafts', step: 'assessments' },
                    ].map(action => (
                      <button
                        key={action.title}
                        onClick={() => {
                          setActiveStep(action.step);
                          showToast(`Initiating quick launch: ${action.title}`);
                        }}
                        className="bg-[#0f1326] border border-slate-800 hover:border-purple-500/50 rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 space-y-1.5"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-black text-purple-300">
                          <Plus size={14} />
                          <span>{action.title}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {action.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 1: VISION BUILDER */}
            {activeStep === 'vision' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6"
              >
                {/* Form fields inputs */}
                <div className="md:col-span-7 bg-[#0c0f1e] border border-slate-800 rounded-3xl p-6 space-y-4 text-left">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Compass className="text-purple-400" size={18} />
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">Learning Vision Form Builder</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase font-mono tracking-wider">Program Title</label>
                      <input 
                        type="text" 
                        value={vision.title} 
                        onChange={(e) => setVision({...vision, title: e.target.value})}
                        className="w-full bg-[#070914] border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-gray-200 focus:outline-none focus:border-purple-500"
                        placeholder="e.g. Masterclass in Automated Heuristics"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-extrabold uppercase font-mono tracking-wider">Category</label>
                        <input 
                          type="text" 
                          value={vision.category}
                          onChange={(e) => setVision({...vision, category: e.target.value})}
                          className="w-full bg-[#070914] border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-gray-200 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-extrabold uppercase font-mono tracking-wider">Target Audience</label>
                        <input 
                          type="text" 
                          value={vision.audience}
                          onChange={(e) => setVision({...vision, audience: e.target.value})}
                          className="w-full bg-[#070914] border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-gray-200 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-extrabold uppercase font-mono tracking-wider">Learning Level</label>
                        <select
                          value={vision.level}
                          onChange={(e) => setVision({...vision, level: e.target.value})}
                          className="w-full bg-[#070914] border border-slate-800 rounded-xl p-2 text-xs font-bold text-gray-200 focus:outline-none"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced (Postgrad Heuristics)</option>
                          <option value="Expert">Expert Board level</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-extrabold uppercase font-mono tracking-wider">Duration</label>
                        <input 
                          type="text" 
                          value={vision.duration}
                          onChange={(e) => setVision({...vision, duration: e.target.value})}
                          className="w-full bg-[#070914] border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-gray-200 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-extrabold uppercase font-mono tracking-wider">Industry Sector</label>
                        <input 
                          type="text" 
                          value={vision.industry}
                          onChange={(e) => setVision({...vision, industry: e.target.value})}
                          className="w-full bg-[#070914] border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-gray-200 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-extrabold uppercase font-mono tracking-wider">Country Focus</label>
                        <input 
                          type="text" 
                          value={vision.country}
                          onChange={(e) => setVision({...vision, country: e.target.value})}
                          className="w-full bg-[#070914] border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-gray-200 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase font-mono tracking-wider">Accreditation Requirements</label>
                      <input 
                        type="text" 
                        value={vision.accreditation}
                        onChange={(e) => setVision({...vision, accreditation: e.target.value})}
                        className="w-full bg-[#070914] border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-gray-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="space-y-1.5 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                      <label className="text-[10px] text-purple-400 font-extrabold uppercase font-mono tracking-wider block">Describe your learning program (AI Prompt Box)</label>
                      <textarea 
                        rows={3}
                        value={vision.prompt}
                        onChange={(e) => setVision({...vision, prompt: e.target.value})}
                        className="w-full bg-[#05060b] border border-slate-800 rounded-xl p-3 text-xs text-gray-300 focus:outline-none focus:border-purple-500"
                      />
                      <p className="text-[9px] text-slate-500 italic mt-1">
                        Africa entrepreneurial focus prompts: "Create a 12-week AI and Machine Learning Certification Program for African Entrepreneurs."
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleStartSmartGeneration}
                        className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-purple-900/10 flex items-center justify-center gap-1.5"
                      >
                        <Sparkles size={14} className="animate-spin" />
                        <span>Inject & Auto-Generate Curriculum</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Left Side: Dynamic Suggestions Panel */}
                <div className="md:col-span-5 space-y-4">
                  <div className="bg-[#10142c] border border-slate-800/80 rounded-3xl p-5 space-y-4 text-left shadow-lg">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5 border-b border-slate-800 pb-3">
                      <Zap size={14} className="text-amber-400" />
                      Suggested Learning Outcomes
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Aligned with NQF compliance matrix criteria:
                    </p>
                    <ul className="space-y-2">
                      {SUGGESTED_OUTCOMES.map((outcome, idx) => (
                        <li key={idx} className="flex gap-2 p-2.5 bg-slate-900/80 border border-slate-850 rounded-xl text-xs text-slate-300 leading-normal">
                          <Check size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Generation State Simulator Card */}
                  {genState !== 'idle' && (
                    <div className="bg-[#0b0e1b] border border-purple-500/20 rounded-3xl p-5 text-left space-y-3 shadow-2xl animate-fade-in relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-purple-400 font-extrabold uppercase font-mono tracking-wider block">
                          Curriculum Generation Thread
                        </span>
                        <span className="text-xs font-black text-gray-200">{genProgress}%</span>
                      </div>

                      {/* Progress line */}
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${genProgress}%` }}
                        ></div>
                      </div>

                      {/* Logs feed */}
                      <div className="bg-[#04060d] border border-slate-850 rounded-xl p-3 h-32 overflow-y-auto font-mono text-[9.5px] text-slate-400 select-none space-y-1">
                        {genLog.map((log, index) => (
                          <div key={index} className="text-slate-300">
                            {log}
                          </div>
                        ))}
                        {genState === 'generating' && (
                          <div className="flex items-center gap-1.5 text-purple-400 pt-1">
                            <span className="inline-block animate-ping rounded-full h-1.5 w-1.5 bg-purple-400"></span>
                            <span>Assembling sharded knowledge clusters...</span>
                          </div>
                        )}
                        {genState === 'completed' && (
                          <div className="text-emerald-400 font-bold mt-2">
                            ✓ Generation Complete. Blueprint synchronized below.
                          </div>
                        )}
                      </div>

                      {genState === 'completed' && (
                        <button
                          onClick={() => {
                            setActiveStep('curriculum');
                            showToast('Curriculum canvas workspace initialized!');
                          }}
                          className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-[11px] font-black uppercase tracking-wider text-white transition flex items-center justify-center gap-1.5"
                        >
                          <span>Open Visual Curriculum Canvas</span>
                          <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 2: CURRICULUM ARCHITECT CANVAS */}
            {activeStep === 'curriculum' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* Left Mini Sidebar: Structure summary */}
                <div className="lg:col-span-3 bg-slate-950/40 border border-slate-850 rounded-2xl p-4 text-left space-y-4">
                  <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-widest font-mono">Blueprint Structure</h4>
                  
                  <div className="space-y-1">
                    {modules.map((m, idx) => (
                      <div key={m.id} className="p-2.5 bg-slate-900 border border-slate-850 rounded-xl space-y-1 text-xs font-semibold text-slate-200">
                        <span className="text-[10px] text-purple-400 block font-mono">Module {idx+1}</span>
                        <p className="truncate block">{m.title}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleCreateModule} className="pt-2 border-t border-slate-850 space-y-2">
                    <input 
                      type="text"
                      placeholder="Add New Module Title..."
                      value={newModuleName}
                      onChange={(e) => setNewModuleName(e.target.value)}
                      className="w-full bg-[#080b16] border border-slate-850 rounded-xl p-2 text-[11px] text-gray-200 focus:outline-none focus:border-purple-500 font-bold"
                    />
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-[10px] rounded-lg uppercase tracking-wider flex items-center justify-center gap-1 border border-slate-700"
                    >
                      <Plus size={11} />
                      <span>Append Module</span>
                    </button>
                  </form>
                </div>

                {/* Center Canvas: Visual Blueprint Builder / Drag-and-Drop Area */}
                <div className="lg:col-span-6 space-y-6 text-left">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">Course Blueprint Visual Builder</h3>
                    <span className="text-[10px] text-slate-500 font-bold font-mono">Drag modules and lessons to reorder</span>
                  </div>

                  <div className="space-y-6">
                    {modules.map((mod, idx) => (
                      <div 
                        key={mod.id}
                        className="bg-[#0b0e1c] border border-slate-800 rounded-2xl p-5 space-y-4 relative"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-extrabold text-indigo-300 uppercase block tracking-wider">
                            {mod.title}
                          </h4>
                          <button 
                            onClick={() => {
                              setModules(modules.filter(m => m.id !== mod.id));
                              showToast('✓ Module removed from curriculum stream.');
                            }}
                            className="text-slate-500 hover:text-crimson p-1 hover:bg-slate-900 rounded-lg transition"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <div className="space-y-2 pl-3 border-l-2 border-purple-500/20">
                          {mod.lessons.map(lesson => (
                            <div
                              key={lesson.id}
                              className="bg-[#12162a] border border-slate-850/80 rounded-xl p-3 flex justify-between items-center text-xs font-bold font-sans text-slate-200 shadow-sm cursor-grab select-none hover:border-purple-500/40 transition active:cursor-grabbing"
                            >
                              <span className="truncate">{lesson.title}</span>
                              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-900 border border-slate-800/85 rounded-md text-slate-400">
                                {lesson.type}
                              </span>
                            </div>
                          ))}

                          {/* Module Quiz link card */}
                          <div className="bg-gradient-to-r from-purple-950/20 to-indigo-950/20 border border-slate-800/50 rounded-xl p-3 flex justify-between items-center text-xs font-bold text-indigo-200">
                            <span>{mod.quiz.title}</span>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-purple-500/10 text-purple-300 rounded-md">Quiz</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side Panel: AI Copilot Assistant */}
                <div className="lg:col-span-3 space-y-4 text-left">
                  <div className="bg-[#11152a] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col h-[400px]">
                    <div className="flex items-center gap-1.5 border-b border-indigo-900/40 pb-3 mb-3">
                      <Sparkles className="text-purple-400" size={15} />
                      <span className="text-xs font-black uppercase tracking-wider text-white">CogniSacra Architect AI</span>
                    </div>

                    {/* Messages log */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-[11px] font-medium leading-relaxed mb-3 scrollbar-none">
                      {chatLog.map((c, idx) => (
                        <div key={idx} className={`p-2.5 rounded-xl ${
                          c.role === 'assistant' 
                            ? 'bg-[#060811] text-indigo-200 border border-indigo-950 text-left' 
                            : 'bg-purple-900/30 text-purple-100 border border-purple-800/20 text-right'
                        }`}>
                          {c.text}
                        </div>
                      ))}
                      {isCopilotGenerating && (
                        <div className="text-[10px] font-mono italic text-purple-400 flex items-center gap-1.5">
                          <RefreshCw size={11} className="animate-spin" />
                          <span>Streaming blueprint iterations...</span>
                        </div>
                      )}
                    </div>

                    {/* Quick helper prompts */}
                    <div className="grid grid-cols-2 gap-1 mb-2">
                      {[
                        'Generate Module 3', 'Improve Outcomes', 'Suggest Activities', 
                        'Generate Case Study', 'Generate Quiz', 'Draft Rubrics'
                      ].map(act => (
                        <button
                          key={act}
                          onClick={() => {
                            setGptPrompt(act);
                            showToast(`AI prompt pre-loaded: "${act}"`);
                          }}
                          className="px-2 py-1 bg-[#090b14] border border-slate-800 hover:border-purple-500/40 text-[9.5px] font-black uppercase text-slate-400 hover:text-white rounded transition truncate"
                        >
                          {act}
                        </button>
                      ))}
                    </div>

                    {/* Form Input */}
                    <form onSubmit={handleSendCopilotPrompt} className="relative flex-shrink-0">
                      <input 
                        type="text" 
                        value={gptPrompt}
                        onChange={(e) => setGptPrompt(e.target.value)}
                        placeholder="Request extra content..." 
                        className="w-full bg-[#05060d] border border-slate-800 rounded-xl pl-3 pr-10 py-2 text-xs font-bold text-gray-200 focus:outline-none focus:border-purple-500"
                      />
                      <button 
                        type="submit" 
                        className="absolute right-1 text-purple-400 hover:text-purple-300 top-1/2 -translate-y-1/2 p-1.5"
                      >
                        <Send size={13} />
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: KNOWLEDGE NETWORK GRAPH */}
            {activeStep === 'graph' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center text-left">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">Interactive Knowledge Graph Network</h3>
                    <p className="text-xs text-slate-400">Unique CogniSacra compliance feature tracking skill connections.</p>
                  </div>
                  <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/10 text-indigo-400 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Competency Matrix view enabled
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
                  {/* Visual Node mapping panel */}
                  <div className="md:col-span-8 bg-[#0a0d1d] border border-slate-800 rounded-3xl p-6 min-h-[380px] flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#1c2242_1px,transparent_1px)] [background-size:16px_16px] opacity-35"></div>
                    
                    {/* SVG GRAPH DESIGN MAP */}
                    <div className="relative z-10 w-full flex items-center justify-center my-6">
                      <svg className="w-full max-w-lg h-64" viewBox="0 0 500 240">
                        {/* Connecting Paths links */}
                        <line x1="250" y1="40" x2="110" y2="120" stroke="#6C3BFF" strokeWidth="2.5" strokeDasharray="3" />
                        <line x1="250" y1="40" x2="250" y2="120" stroke="#6C3BFF" strokeWidth="2.5" />
                        <line x1="250" y1="40" x2="390" y2="120" stroke="#6C3BFF" strokeWidth="2.5" strokeDasharray="3" />
                        <line x1="250" y1="40" x2="440" y2="180" stroke="#334155" strokeWidth="1.5" />
                        <line x1="110" y1="120" x2="110" y2="180" stroke="#00E5A8" strokeWidth="2" />
                        <line x1="250" y1="120" x2="250" y2="180" stroke="#00E5A8" strokeWidth="2" />

                        {/* Node Elements */}
                        {/* Parent Node */}
                        <g className="cursor-pointer" onClick={() => setSelectedNode('ai-fundamentals')}>
                          <circle cx="250" cy="40" r="24" fill="#0B1020" stroke={selectedNode === 'ai-fundamentals' ? '#00E5A8' : '#6C3BFF'} strokeWidth="4" />
                          <text x="250" y="44" fill="#E2E8F0" fontSize="10" fontWeight="900" textAnchor="middle">AI</text>
                          <text x="250" y="16" fill="#A78BFA" fontSize="8.5" fontWeight="900" textAnchor="middle" letterSpacing="0.05em">ROOT NODE</text>
                        </g>

                        {/* Child Node 1 */}
                        <g className="cursor-pointer" onClick={() => setSelectedNode('machine-learning')}>
                          <circle cx="110" cy="120" r="18" fill="#0B1020" stroke={selectedNode === 'machine-learning' ? '#00E5A8' : '#cbd5e1'} strokeWidth="3" />
                          <text x="110" y="123" fill="#94A3B8" fontSize="8" fontWeight="800" textAnchor="middle">ML</text>
                          <text x="110" y="150" fill="#E2E8F0" fontSize="8" fontWeight="700" textAnchor="middle">Foundation ML</text>
                        </g>

                        {/* Child Node 2 */}
                        <g className="cursor-pointer" onClick={() => setSelectedNode('deep-learning')}>
                          <circle cx="250" cy="120" r="18" fill="#0B1020" stroke={selectedNode === 'deep-learning' ? '#00E5A8' : '#cbd5e1'} strokeWidth="3" />
                          <text x="250" y="123" fill="#94A3B8" fontSize="8" fontWeight="800" textAnchor="middle">DL</text>
                          <text x="250" y="150" fill="#E2E8F0" fontSize="8" fontWeight="700" textAnchor="middle">Deep Transformers</text>
                        </g>

                        {/* Child Node 3 */}
                        <g className="cursor-pointer" onClick={() => setSelectedNode('nlp')}>
                          <circle cx="390" cy="120" r="18" fill="#0B1020" stroke={selectedNode === 'nlp' ? '#00E5A8' : '#cbd5e1'} strokeWidth="3" />
                          <text x="390" y="123" fill="#94A3B8" fontSize="8" fontWeight="800" textAnchor="middle">NLP</text>
                          <text x="390" y="150" fill="#E2E8F0" fontSize="8" fontWeight="700" textAnchor="middle">Natural Language</text>
                        </g>

                        {/* Nested node */}
                        <g className="cursor-pointer" onClick={() => setSelectedNode('edge')}>
                          <circle cx="110" cy="180" r="14" fill="#0B1020" stroke={selectedNode === 'edge' ? '#00E5A8' : '#475569'} strokeWidth="2.5" />
                          <text x="110" y="183" fill="#64748B" fontSize="6.5" fontWeight="800" textAnchor="middle">EDGE</text>
                        </g>
                      </svg>
                    </div>

                    <div className="p-3 bg-indigo-950/20 border border-slate-800 rounded-xl relative z-10">
                      <span className="text-[10px] text-purple-400 font-extrabold uppercase font-mono tracking-wider block">Interactive Nodes Interface Guide</span>
                      <p className="text-[10.5px] text-slate-300 mt-1">
                        Click on specific modular elements or branches above to instantly inspection objectives, lesson dependencies, assessment criteria, resources and registered accreditation standards in real-time.
                      </p>
                    </div>
                  </div>

                  {/* Selected Node Details Side Bar card */}
                  <div className="md:col-span-4 bg-[#11142a] border border-slate-800 rounded-3xl p-5 text-left space-y-4">
                    <div className="border-b border-indigo-900/60 pb-3">
                      <span className="text-[9.5px] text-purple-400 font-extrabold uppercase font-mono tracking-wider block">Currently Auditing:</span>
                      <h4 className="text-sm font-black uppercase text-white mt-1">
                        {selectedNode === 'ai-fundamentals' && 'AI & Architecture Fundamentals'}
                        {selectedNode === 'machine-learning' && 'Machine Learning Foundations'}
                        {selectedNode === 'deep-learning' && 'Deep Learning Transformers'}
                        {selectedNode === 'nlp' && 'Natural Language Processing (NLP)'}
                        {selectedNode === 'edge' && 'Edge Inference deployments'}
                      </h4>
                    </div>

                    <div className="space-y-3.5">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Assigned Lessons</span>
                        <div className="space-y-1.5 mt-1">
                          <p className="text-[11.5px] font-bold text-gray-200">✓ Foundations of context sizing vectors</p>
                          <p className="text-[11.5px] font-bold text-gray-250 text-slate-400">✓ Computational Fallbacks in High Latency</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Accreditation Standards Group</span>
                        <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full mt-1.5 inline-block">
                          SETA standard aligned / Outcome 4
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Predicted Competency Output</span>
                        <p className="text-xs text-slate-300 mt-1">
                          Mastery over vector database indexing, localized context mapping structures and sharding mechanisms.
                        </p>
                      </div>

                      <div className="h-px bg-slate-800"></div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setActiveStep('builder');
                            showToast('Opened active lesson content studio!');
                          }}
                          className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-black text-[11px] rounded-lg uppercase tracking-wider text-center"
                        >
                          Launch Content Builder
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: BLOCK LESSON BUILDER */}
            {activeStep === 'builder' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left animate-fade-in"
              >
                {/* Visual Block Editor workspace */}
                <div className="md:col-span-8 bg-[#090b16] border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="text-purple-400" size={16} />
                      <h3 className="text-sm font-black uppercase text-white tracking-wider">Lesson Workspace Editor</h3>
                    </div>
                    <span className="text-[9px] uppercase font-mono text-slate-500">Block-Based authoring active</span>
                  </div>

                  {/* Rendering active blocks */}
                  <div className="space-y-4 min-h-[250px]">
                    {lessonBlocks.map(block => (
                      <div 
                        key={block.id} 
                        className="bg-[#0e1224] border border-slate-800/80 p-4 rounded-2xl relative shadow-inner group hover:border-purple-500/30 transition-all"
                      >
                        <div className="flex justify-between items-start gap-4 mb-1">
                          <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            block.type === 'heading' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' :
                            block.type === 'slides' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' :
                            block.type === 'quiz' ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' :
                            'bg-slate-500/10 text-slate-300 border-slate-500/20'
                          }`}>
                            {block.type} BLOCK
                          </span>
                          <button 
                            onClick={() => {
                              setLessonBlocks(lessonBlocks.filter(b => b.id !== block.id));
                              showToast('✓ Removed lesson block.');
                            }}
                            className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 hover:bg-slate-900 rounded transition"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <p className="text-xs font-semibold leading-relaxed text-slate-105 text-slate-200">
                          {block.content}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Inserter Control interface */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3">
                    <span className="text-[10px] text-purple-400 font-extrabold uppercase font-mono tracking-wider block">Insert Block</span>
                    
                    <div className="flex gap-1.5 flex-wrap">
                      {[
                        { id: 'text', label: 'Plain Text' },
                        { id: 'heading', label: 'Large Heading' },
                        { id: 'video', label: 'Video Lecture' },
                        { id: 'slides', label: 'Presentation Hub' },
                        { id: 'quiz', label: 'Assessment block' }
                      ].map(type => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedMediaType(type.id as any)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition ${
                            selectedMediaType === type.id 
                              ? 'bg-purple-600 border border-purple-500 text-white' 
                              : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-white'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={blockInput}
                        onChange={(e) => setBlockInput(e.target.value)}
                        placeholder="Write content paragraphs, add slide URLs, or code challenge triggers..." 
                        className="flex-1 bg-[#090b14] border border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold text-gray-200 focus:outline-none focus:border-purple-500"
                      />
                      <button
                        onClick={handleAddLessonBlock}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 rounded-xl font-black text-xs uppercase text-white shadow-md flex items-center gap-1 shrink-0"
                      >
                        <Plus size={13} />
                        <span>Insert</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Pre-generated outlines output */}
                <div className="md:col-span-4 space-y-4">
                  <div className="bg-[#11142b] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-lg text-left">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1 pb-3 border-b border-indigo-900/60 font-mono">
                      <Cpu size={14} className="text-purple-400 animate-spin" />
                      CogniSacra Generator Output
                    </h4>
                    
                    <div className="space-y-4 font-sans text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide block">Instructor Guide Note</span>
                        <p className="bg-slate-900 p-2.5 rounded-lg text-[11px] text-slate-450 mt-1 leading-normal text-slate-300">
                          Configure fallback triggers during local failure simulations. Highlight bias vector offsets in Week 3.
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide block">Generated Speaker Notes</span>
                        <p className="bg-slate-900 p-2.5 rounded-lg text-[11px] text-slate-450 mt-1 leading-normal text-slate-300">
                          "We are looking closely at how under-resourced edge servers partition matrices to maintain local inference benchmarks..."
                        </p>
                      </div>

                      <div className="bg-purple-950/20 border border-purple-500/20 rounded-xl p-3 space-y-1.5 text-left">
                        <span className="text-[9px] text-purple-400 uppercase tracking-widest font-bold block font-mono animate-bounce">Smart Audit Trigger</span>
                        <p className="text-[11px] text-slate-300 leading-normal">
                          This lesson aligns with **Bloom Taxonomy Level 4 (Analyze)**. Recommended assessment: Quantization simulation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: MULTIMEDIA GENERATION STUDIO */}
            {activeStep === 'multimedia' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-left animate-fade-in"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">Multimedia Generation Studio</h3>
                    <p className="text-xs text-slate-450 text-slate-400">Generate high-fidelity instructional components in seconds.</p>
                  </div>
                  <span className="text-[9.5px] uppercase font-mono text-purple-400 font-bold bg-[#14183a] border border-indigo-900/40 px-3 py-1 rounded-full">
                    Media Rendering Pipeline active
                  </span>
                </div>

                <div className="bg-[#090b16] border border-slate-800 rounded-3xl p-6 space-y-6">
                  {/* Internal tabs for Multimedia Generators */}
                  <div className="flex gap-2 border-b border-slate-850 pb-px overflow-x-auto">
                    {[
                      { id: 'avatar', label: 'Video Avatar Generator', icon: <Video size={13} /> },
                      { id: 'audio', label: 'Audio Narrator Studio', icon: <Radio size={13} /> },
                      { id: 'image', label: 'Image vector Creator', icon: <ImageIcon size={13} /> },
                      { id: 'slides', label: 'Slide Deck Architect', icon: <Layers size={13} /> }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setMmTab(tab.id as any)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 text-xs font-black uppercase transition-all tracking-wider ${
                          mmTab === tab.id 
                            ? 'border-purple-500 text-purple-400' 
                            : 'border-transparent text-slate-400 hover:text-white'
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Media Input Form */}
                    <div className="md:col-span-6 space-y-4">
                      {mmTab === 'avatar' && (
                        <div className="space-y-3">
                          <label className="text-[10px] text-slate-400 font-extrabold uppercase font-mono block">Instructor script fallback to read</label>
                          <textarea 
                            rows={3}
                            value={avatarScript}
                            onChange={(e) => setAvatarScript(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-slate-200 focus:outline-none"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <label className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-850 rounded-lg text-xs font-bold text-slate-300">
                              <input type="radio" name="avatar_v" defaultChecked /> Whiteboard Video
                            </label>
                            <label className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-850 rounded-lg text-xs font-bold text-slate-300">
                              <input type="radio" name="avatar_v" /> Talking Head Clone
                            </label>
                          </div>
                        </div>
                      )}

                      {mmTab === 'audio' && (
                        <div className="space-y-3">
                          <label className="text-[10px] text-slate-400 font-extrabold uppercase font-mono block">Voice Narration Objective</label>
                          <p className="text-xs text-slate-450 text-slate-450">Convert written lessons to a natural sounding narration.</p>
                          <div className="grid grid-cols-2 gap-2">
                            <label className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-850 rounded-lg text-sm font-bold text-slate-300">
                              <input type="radio" name="audio_v" defaultChecked /> South African Accent
                            </label>
                            <label className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-850 rounded-lg text-sm font-bold text-slate-300">
                              <input type="radio" name="audio_v" /> West African Accent
                            </label>
                          </div>
                        </div>
                      )}

                      {mmTab === 'image' && (
                        <div className="space-y-3">
                          <label className="text-[10px] text-slate-400 font-extrabold uppercase font-mono block">Vector Asset Objective</label>
                          <p className="text-xs text-slate-440 text-slate-400">Generate diagrams, infographics, or custom course covers.</p>
                          <select className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none">
                            <option>Mathematical Matrix Infographic</option>
                            <option>Low-rank Adaptation gradient diagram</option>
                            <option>Accredited Course Cover Design Art</option>
                          </select>
                        </div>
                      )}

                      {mmTab === 'slides' && (
                        <div className="space-y-3">
                          <label className="text-[10px] text-slate-400 font-extrabold uppercase font-mono block">Deck templates</label>
                          <p className="text-sm text-slate-400">Instantly generate structured visual presentation slides for this classroom.</p>
                        </div>
                      )}

                      <button
                        onClick={handleGenerateMultimedia}
                        disabled={isGeneratingMM}
                        className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-xs font-black uppercase text-white shadow-lg shadow-purple-900/10 flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50"
                      >
                        {isGeneratingMM ? <RefreshCw className="animate-spin" size={13} /> : <Sparkles size={13} />}
                        <span>Render Media Assets</span>
                      </button>
                    </div>

                    {/* Media Output Preview Window */}
                    <div className="md:col-span-6 bg-slate-950 border border-slate-850 rounded-3xl p-5 min-h-[220px] flex flex-col justify-center items-center text-center relative overflow-hidden">
                      {isGeneratingMM ? (
                        <div className="space-y-2 animate-pulse text-purple-400 font-mono text-xs">
                          <RefreshCw className="animate-spin mx-auto text-xl" size={24} />
                          <p>Synthesizing neural model weight layers...</p>
                        </div>
                      ) : (
                        <div className="space-y-4 w-full">
                          {mmTab === 'avatar' && (
                            generatedVideoUrl ? (
                              <div className="space-y-2">
                                <img src={generatedVideoUrl} alt="Talking Head" className="w-48 h-48 rounded-2xl mx-auto object-cover border border-purple-500/30" />
                                <span className="text-[10.5px] text-purple-300 font-mono block mt-1">✓ AI Avatar Render Matrix Complete (mp4)</span>
                              </div>
                            ) : (
                              <div className="text-slate-550 space-y-2">
                                <Video className="mx-auto text-slate-600" size={30} />
                                <p className="text-xs text-slate-400 font-semibold">Generate an AI Avatar lecture talking head or explainer</p>
                              </div>
                            )
                          )}

                          {mmTab === 'audio' && (
                            generatedAudioUrl ? (
                              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-left space-y-2">
                                <span className="text-[10px] text-purple-400 font-mono uppercase font-bold tracking-wider block">Sound Signature:</span>
                                <p className="text-xs text-slate-300 leading-normal">
                                  {generatedAudioUrl}
                                </p>
                                <button className="px-3 py-1 bg-slate-805 hover:bg-slate-800 border border-slate-750 text-xs font-extrabold rounded-lg inline-flex items-center gap-1 text-slate-200">
                                  <Download size={12} /> Play Generated Wave Out
                                </button>
                              </div>
                            ) : (
                              <div className="text-slate-550 space-y-2">
                                <Radio className="mx-auto text-slate-600" size={30} />
                                <p className="text-xs text-slate-400 font-semibold">Generate high fidelity narrations, translated lectures or voice clones</p>
                              </div>
                            )
                          )}

                          {mmTab === 'image' && (
                            generatedImageUrl ? (
                              <div className="space-y-2">
                                <img src={generatedImageUrl} alt="Infographic" className="w-full max-h-48 rounded-xl object-cover border border-purple-500/20" />
                                <span className="text-[10px] text-purple-300 font-mono block mt-1">✓ SVG Render Output successfully saved</span>
                              </div>
                            ) : (
                              <div className="text-slate-550 space-y-2">
                                <ImageIcon className="mx-auto text-slate-600" size={30} />
                                <p className="text-xs text-slate-400 font-semibold">Create educational diagrams or vector layouts</p>
                              </div>
                            )
                          )}

                          {mmTab === 'slides' && (
                            <div className="space-y-2">
                              <span className="text-xs text-slate-450 block text-slate-400">Generate visual slides presentation with lecture speaker notes</span>
                              <button 
                                onClick={() => {
                                  setIsGeneratingMM(true);
                                  setTimeout(() => {
                                    setIsGeneratingMM(false);
                                    showToast('✓ Presentation generated with 12 structured slides');
                                  }, 1500);
                                }}
                                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase rounded-lg"
                              >
                                Build Presentation Slide deck
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 6: ASSESSMENT ARCHITECT */}
            {activeStep === 'assessments' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left animate-fade-in"
              >
                {/* Form fields */}
                <div className="md:col-span-8 bg-[#090b16] border border-slate-800 rounded-3xl p-6 space-y-6">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <HelpCircle className="text-purple-400" size={18} />
                    <h3 className="text-sm font-black uppercase text-white tracking-wider">Assessment Engineering Workstation</h3>
                  </div>

                  <div className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">Assessment Type</label>
                        <select className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2 text-xs font-bold text-slate-200">
                          <option>NQF Aligned Certification Exam</option>
                          <option>Weekly Practical coding Assignment</option>
                          <option>Matrix Quantization simulation Project</option>
                          <option>Oral Board Presentation</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">Bloom Taxonomy Alignment Target</label>
                        <select className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2 text-xs font-bold text-slate-200">
                          <option>Level 4: Analyze (Core linear algebra mechanics)</option>
                          <option>Level 5: Evaluate (Quantization benchmarks parity)</option>
                          <option>Level 6: Create (Deploy dynamic client inference setups)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase font-mono block">Custom Passing Evaluation Criteria</label>
                      <p className="bg-slate-900 p-3 rounded-lg text-[11px] leading-normal text-slate-300 border border-slate-850 text-xs">
                        The candidate must mathematically demonstrate L1 context sizing bounds. The code submissions must complete compiling without invoking legacy heavy Python packages. Unassisted local context fallback must sustain a latency score under 140ms.
                      </p>
                    </div>

                    <button 
                      onClick={() => showToast('✓ Compiled detailed assessment structure with 15 questions in question bank.')}
                      className="px-5 py-2 bg-[#12162d] border border-purple-500/20 hover:border-purple-500/40 font-black text-xs uppercase tracking-wider rounded-xl text-purple-300"
                    >
                      Generate Question Bank & Marking Rubrics
                    </button>
                  </div>
                </div>

                {/* Right Panel: Aligned question structures and Bloom indicators */}
                <div className="md:col-span-4 space-y-4">
                  <div className="bg-[#10142c] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-lg text-left">
                    <h4 className="text-xs font-black uppercase text-white pb-3 border-b border-slate-800 font-mono">Question Bank Drafts</h4>
                    
                    <div className="space-y-3 font-sans text-xs">
                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                        <span className="text-[9px] text-purple-400 font-mono uppercase font-bold block">Question 1.1 (Multi-Choice)</span>
                        <p className="font-bold text-slate-200 mt-1">If the localized quantization layer returns an integer overflow during gradient bias, which correction formula sustains index synchronization?</p>
                      </div>
                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                        <span className="text-[9px] text-purple-400 font-mono uppercase font-bold block">Practical Grading Rubrics Matrix</span>
                        <p className="text-[11px] text-slate-400 leading-normal mt-1">
                          - Exceptional (A+): Compiles locally on offline mobile context inside 140ms. Code demonstrates strict modularity.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 7: LEARNING PATH PLANNER */}
            {activeStep === 'path' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-left"
              >
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Visual Adaptive Learning Path Architect</h3>
                  <p className="text-xs text-slate-400">Design custom branching courses and skill-based progression nodes.</p>
                </div>

                <div className="bg-[#090b16] border border-slate-800 rounded-3xl p-6 min-h-[300px] flex flex-col justify-between overflow-hidden relative">
                  <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                  
                  {/* Flow chart diagram representation */}
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 my-4 w-full">
                    
                    {/* Course Node A */}
                    <div className="bg-slate-900 border border-purple-500/40 p-4 rounded-xl text-center w-full max-w-xs space-y-1 shadow-md">
                      <span className="text-[9px] text-slate-500 font-mono block">TRACK NODE A</span>
                      <h4 className="text-xs font-black uppercase text-gray-200">AI and LLM Systems foundations</h4>
                      <p className="text-[10px] text-slate-400">Target Level: Intermediate</p>
                    </div>

                    <ArrowRight className="text-slate-500 hidden md:block" size={20} />

                    {/* Branching container */}
                    <div className="flex flex-col gap-4 w-full max-w-xs relative">
                      
                      <div className="p-3 bg-[#11142a] border border-[#6C3BFF] rounded-xl text-center shadow-lg relative">
                        <span className="text-[9px] text-emerald-400 uppercase font-mono font-bold block">✓ Passed Assessment 1 Path</span>
                        <h4 className="text-[10.5px] font-black uppercase text-slate-100">Postgrad Quantization Sandbox</h4>
                      </div>

                      <div className="p-3 bg-slate-900 border border-rose-500/30 rounded-xl text-center opacity-60">
                        <span className="text-[9px] text-rose-400 uppercase font-mono font-bold block">✗ Remedial Loop</span>
                        <h4 className="text-[10.5px] font-bold text-slate-400">Matrix Multiplication Boot camp</h4>
                      </div>
                    </div>

                    <ArrowRight className="text-slate-500 hidden md:block" size={20} />

                    {/* Advanced certification */}
                    <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/50 p-4 rounded-xl text-center w-full max-w-xs space-y-1 shadow-lg">
                      <span className="text-[9px] text-purple-300 font-mono block">FINAL ACCREDITED CERT</span>
                      <h4 className="text-xs font-black uppercase text-white">Edge Systems Architect</h4>
                      <p className="text-[10px] text-emerald-300">120 Academic Credits Aligned</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-850 rounded-2xl relative z-10 text-xs">
                    <span className="text-[10px] text-purple-400 font-bold uppercase font-mono">Adaptive branching settings</span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Adaptive tracking algorithm automatically routes students scoring under 70% in Assessment 1 to our remediative linear algebra matrix workbook before allowing code execution.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 8: AI TUTOR SIMULATOR */}
            {activeStep === 'tutor' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left"
              >
                {/* Simulator controls */}
                <div className="md:col-span-4 bg-[#0a0c1a] border border-slate-850 p-5 rounded-3xl space-y-4">
                  <div className="border-b border-indigo-900/40 pb-3">
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">AI Student Simulator</h3>
                    <p className="text-xs text-slate-450 text-slate-400">Pre-test lesson difficulty and drop-off risks before publishing.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">Select Student Persona</label>
                      <div className="grid grid-cols-1 gap-2 mt-1">
                        {[
                          { id: 'beginner', label: 'Beginner Student (Business Focus)', color: 'text-amber-400' },
                          { id: 'average', label: 'Average Student (Web Programmer)', color: 'text-indigo-400' },
                          { id: 'striving', label: 'Struggling Student (Low Bandwidth)', color: 'text-rose-400' },
                          { id: 'expert', label: 'Expert Student (Advanced systems)', color: 'text-emerald-400' }
                        ].map(st => (
                          <button
                            key={st.id}
                            onClick={() => setSelectedStudent(st.id as any)}
                            className={`w-full text-left p-3 rounded-xl text-xs font-bold transition border ${
                              selectedStudent === st.id 
                                ? 'bg-gradient-to-r from-purple-900/30 to-indigo-950/30 border-purple-500' 
                                : 'bg-[#0f111c] hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-white'
                            }`}
                          >
                            <span className={st.color}>• </span>{st.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulation Output Dashboard */}
                <div className="md:col-span-8 bg-[#090b16] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
                  <span className="text-[10px] text-purple-400 font-extrabold uppercase font-mono tracking-wider block">CogniSacra Simulation Matrix Output</span>
                  
                  <div className="space-y-4 font-sans text-xs">
                    <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-850/80">
                        <span className="text-[10.5px] font-black text-slate-150 uppercase tracking-tight text-white font-mono">
                          {studentProfiles[selectedStudent].labels}
                        </span>
                        <span className="text-[10.5px] font-bold text-rose-400">
                          {studentProfiles[selectedStudent].risk}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9.5px] uppercase font-mono text-slate-500 font-bold block">Detected Knowledge Gaps:</span>
                          <p className="text-[11.5px] font-bold text-slate-350 mt-1">{studentProfiles[selectedStudent].gaps}</p>
                        </div>
                        <div>
                          <span className="text-[9.5px] uppercase font-mono text-slate-500 font-bold block">Primary Drop-off Hotspots:</span>
                          <p className="text-[11.5px] font-bold text-slate-355 mt-1">{studentProfiles[selectedStudent].hotspots}</p>
                        </div>
                      </div>

                      <div className="h-px bg-slate-850"></div>

                      <div>
                        <span className="text-[9px] uppercase font-mono text-slate-500 font-bold block">Predicted Student Query:</span>
                        <span className="inline-block mt-1 font-semibold italic text-slate-200">
                          "{studentProfiles[selectedStudent].predictedQ}"
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl">
                      <span className="text-[10px] text-purple-400 font-bold uppercase font-mono tracking-wider block">Recommended intervention checklist:</span>
                      <p className="text-[11px] text-slate-300 mt-1 leading-normal">
                        Pre-inject micro-assessment tutorials at Module 1 Lesson 1.2. Render South African audio translation narrative track to circumvent reading retention lag.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 9: ACCREDITATION DESIGNER & QA */}
            {activeStep === 'compliance' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left"
              >
                {/* Standards Matrix mapping */}
                <div className="md:col-span-8 bg-[#090b16] border border-slate-800 rounded-3xl p-6 space-y-6">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Award className="text-purple-400" size={18} />
                    <h3 className="text-sm font-black uppercase text-white tracking-wider">Accreditation designer Workspace</h3>
                  </div>

                  <div className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 bg-slate-950 border border-slate-850/80 p-3 rounded-xl">
                        <span className="text-[9px] text-slate-500 font-bold block font-mono">compliance Authority</span>
                        <span className="font-extrabold text-white">SAQA (South African Qualifications Authority)</span>
                      </div>
                      <div className="space-y-1 bg-slate-950 border border-slate-850/80 p-3 rounded-xl">
                        <span className="text-[9px] text-slate-500 font-bold block font-mono">Credits distribution</span>
                        <span className="font-extrabold text-white">120 total credits aligned</span>
                      </div>
                    </div>

                    <div className="bg-[#0e1222] border border-[#6C3BFF]/20 p-4 rounded-2xl space-y-2">
                      <span className="text-[10px] text-purple-400 font-black uppercase tracking-wider font-mono">SAQA outcome mapping Matrix</span>
                      <div className="space-y-2 text-[11px] font-extrabold">
                        <div className="flex justify-between border-b border-indigo-950 pb-1.5 text-slate-200">
                          <span>NQF Exit Outcomes</span>
                          <span className="text-emerald-400 font-mono">✓ Aligned</span>
                        </div>
                        <div className="flex justify-between border-b border-indigo-950 pb-1.5 text-slate-400 font-medium">
                          <span>Core Module 1 Credits (35 credits)</span>
                          <span className="text-emerald-400 font-mono">✓ Verified</span>
                        </div>
                        <div className="flex justify-between text-slate-400 font-medium">
                          <span>Edge validation assignments</span>
                          <span className="text-emerald-400 font-mono">✓ Cleared</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => showToast('✓ Certification matrix successfully locked and registered with SAQA guidelines.')}
                        className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-lg uppercase tracking-wider block text-center"
                      >
                        Enforce compliance Matrix Sign-off
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Panel: AI Quality Assurance audit scores */}
                <div className="md:col-span-4 bg-[#11142b] border border-slate-800 rounded-3xl p-5 space-y-4">
                  <h4 className="text-xs font-black uppercase text-white pb-3 border-b border-indigo-950 font-mono">AI QA Audit Engine</h4>
                  
                  <div className="space-y-4 text-xs font-sans">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span>Learning Outcome Score</span>
                        <span className="text-emerald-400">92/100 Excellent</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-1.5 rounded-full w-[92%]"></div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span>Engagement Forecast Score</span>
                        <span className="text-purple-400">85% Optimal</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-1.5 rounded-full w-[85%]"></div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span>Accreditation alignment Verification</span>
                        <span className="text-emerald-300">100% SECURE</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-1.5 rounded-full w-full"></div>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 font-mono rounded bg-slate-950 p-2.5 leading-normal">
                      ✓ No accessibility flags detected. Ready for publication.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 10: COLLABORATION WORKSPACE */}
            {activeStep === 'collaboration' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left"
              >
                {/* Active comment threads */}
                <div className="md:col-span-8 bg-[#090b16] border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-indigo-950 pb-3">
                    <h3 className="text-sm font-black uppercase text-white">Collaboration Workspace Review Stream</h3>
                    <span className="text-[10.5px] text-purple-300 font-extrabold uppercase">Enterprise review gates active</span>
                  </div>

                  <div className="space-y-4 h-[250px] overflow-y-auto pr-1">
                    {comments.map(c => (
                      <div key={c.id} className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-black text-indigo-300">{c.author}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9.5px] text-slate-500 font-bold block">{c.date}</span>
                            {c.approved ? (
                              <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">Sign-off Approver</span>
                            ) : (
                              <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded">Review Gate</span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs leading-normal text-slate-350 text-slate-200">"{c.text}"</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <input 
                      type="text"
                      placeholder="Comment on accreditation alignment outlines or matrix sharding parameters..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-gray-200 font-bold focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (!commentInput.trim()) return;
                        const comm = {
                          id: `comm-${Date.now()}`,
                          author: 'Co-Instructor Panel (QA)',
                          text: commentInput,
                          date: 'Just now',
                          approved: false
                        };
                        setComments([...comments, comm]);
                        setCommentInput('');
                        showToast('✓ Review comment posted');
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-xs font-black uppercase text-white shadow-md inline-flex items-center gap-1 shrink-0"
                    >
                      <Plus size={13} />
                      <span>Comment</span>
                    </button>
                  </div>
                </div>

                {/* Left Side: Collaborator roles panel */}
                <div className="md:col-span-4 bg-[#10132b] border border-slate-850 p-5 rounded-3xl space-y-4">
                  <h4 className="text-xs font-black uppercase text-white pb-3 border-b border-slate-800 font-mono">Sign-off Gates</h4>
                  
                  <div className="space-y-3 text-xs font-sans">
                    <div className="flex justify-between items-center p-2.5 bg-slate-950 border border-slate-850 rounded-xl">
                      <span>Lead Instructor (Adebayo)</span>
                      <span className="text-emerald-400 font-mono text-[10.5px]">✓ APPROVED</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-slate-950 border border-slate-850 rounded-xl">
                      <span>Accreditation Reviewer (SETA)</span>
                      <span className="text-amber-400 font-mono text-[10.5px]">⏳ PENDING ACTION</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-slate-950 border border-slate-850 rounded-xl">
                      <span>Campus Board Quality audit</span>
                      <span className="text-slate-500 font-mono text-[10.5px]">LOCKED</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 11: PUBLISHING CENTER */}
            {activeStep === 'publishing' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left"
              >
                {/* Visual file export options */}
                <div className="md:col-span-8 bg-[#090b16] border border-slate-800 rounded-3xl p-6 space-y-6">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Laptop className="text-purple-400" size={18} />
                    <h3 className="text-sm font-black uppercase text-white tracking-wider">Publishing Command Center</h3>
                  </div>

                  <div className="space-y-4 text-xs font-sans">
                    <div>
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide block">Select Distribution Channel</span>
                      <div className="grid grid-cols-2 gap-2 mt-1.5">
                        <label className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center gap-2 text-slate-300 font-bold cursor-pointer">
                          <input type="radio" name="dist" defaultChecked /> Organization Private LMS (SCORM, LTI 1.3)
                        </label>
                        <label className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center gap-2 text-slate-300 font-bold cursor-pointer">
                          <input type="radio" name="dist" /> CogniSacra Public Marketplace (Subscription)
                        </label>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide block">Academic Interoperability Formats</span>
                      <div className="grid grid-cols-3 gap-2 mt-1.5">
                        {[
                          'SCORM 2004 v4 Package', 'xAPI Cloud Wrapper', 'LTI v1.3 Package', 
                          'PDF Syllabus Manual', 'Integrated Video Archive', 'E-Book PDF Manual'
                        ].map(fmt => (
                          <button
                            key={fmt}
                            onClick={() => showToast(`✓ Rendering and packaging "${fmt}" download artifact`)}
                            className="bg-slate-950 hover:bg-slate-900 border border-slate-850 p-2.5 rounded-lg text-[10.5px] font-black text-slate-400 text-left transition hover:text-white"
                          >
                            ↓ Get {fmt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-slate-850"></div>

                    <button 
                      onClick={() => {
                        showToast('🎉 Enterprise Program successfully published across all global academy channels!');
                        setActiveStep('analytics');
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-lg flex items-center gap-1.5"
                    >
                      <Zap size={14} className="text-yellow-300 animate-bounce" />
                      <span>Compile Course and Deploy Instantly</span>
                    </button>
                  </div>
                </div>

                {/* Publishing metrics right side */}
                <div className="md:col-span-4 bg-[#11142c] border border-slate-800 rounded-3xl p-5 space-y-4">
                  <h4 className="text-xs font-black uppercase text-white pb-3 border-b border-indigo-950 font-mono">Distribution Metrics</h4>
                  
                  <div className="space-y-4 text-xs font-sans">
                    <div className="bg-[#0b0e1a] p-3 rounded-lg border border-slate-850 text-xs">
                      <span className="text-[9.5px] text-slate-500 font-bold block uppercase tracking-wider">Estimated Compilation Sizing</span>
                      <p className="font-extrabold text-slate-200 mt-0.5">384.5 MB packages containing vectors, audio narrative clones & video slides</p>
                    </div>

                    <div className="p-3 bg-indigo-900/10 border border-indigo-900/30 rounded-xl text-xs space-y-1">
                      <span className="text-[9px] text-purple-300 font-mono font-bold uppercase block">Accreditation Seals</span>
                      <p className="text-slate-400 leading-normal">
                        Automatic LTI authentication wrappers successfully locked to metadata, validating credential signatures globally.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 12: ANALYTICS COMMAND CENTER */}
            {activeStep === 'analytics' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-left animate-fade-in"
              >
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">AI Predictive Analytics & Command Center</h3>
                  <p className="text-xs text-slate-400">Review forecast analytics and engagement bottlenecks parsed dynamically by CogniSacra engines.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Forecast Enrollments Year 1', val: '240 Entrepreneurs', desc: '+12% Over Pan-African Benchmarks', color: 'text-purple-400' },
                    { label: 'Predicted Completion rate', val: '92.5%', desc: 'Average: 45%. remediations active', color: 'text-emerald-400' },
                    { label: 'Target Annualized Revenue', val: '$144,000 USD', desc: '$600 per student voucher, mapped', color: 'text-amber-400' },
                    { label: 'Accreditation Pass forecast', val: '98% Pass Likelihood', desc: 'Outcomes synchronized perfectly', color: 'text-indigo-400' }
                  ].map(card => (
                    <div key={card.label} className="bg-[#0b0e1b] border border-slate-850 p-4 rounded-2xl shadow-md space-y-1.5 text-left">
                      <span className="text-[9.5px] text-slate-500 font-extrabold uppercase tracking-wide font-mono block">{card.label}</span>
                      <span className={`text-lg font-black ${card.color} block`}>{card.val}</span>
                      <span className="text-[10px] text-slate-400 block">{card.desc}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-[#090b16] border border-slate-800 rounded-3xl p-6 space-y-4">
                  <span className="text-[10px] text-purple-400 font-extrabold uppercase font-mono tracking-wider block">CogniSacra Predictive Intelligence Insights</span>
                  
                  <div className="space-y-3 text-xs leading-relaxed">
                    <div className="flex gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                      <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-amber-500 font-mono">Module 2 Sharding lab predicted bottleneck:</span>
                        <p className="text-slate-300 mt-0.5">
                          Calculations show 27% of Average level student path profiles will lag in Week 5 due to latency parsing databases offline. Recommended adaptive intervention: dispatch local cached SMS code blocks.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                      <Sparkles size={15} className="text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-purple-400 font-mono">Recommended curriculum optimization matrix:</span>
                        <p className="text-slate-300 mt-0.5">
                          Increase multimedia whiteboards in Module 1 Lesson 1.2. This triggers a 15% predicted improvement in context matching test evaluations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

    </div>
  );
};

export default AIArchitectView;
