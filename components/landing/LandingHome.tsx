import React, { useState, useEffect } from 'react';
import { 
  Globe, Sparkles, Shield, Cpu, Network, Users, BookOpen, Award, Database, 
  Map, HardDrive, ArrowRight, Brain, Zap, Search, Eye, HelpCircle, CheckCircle, 
  Check, Play, ArrowUpRight, CheckCircle2, Star, TrendingUp, ShieldAlert, Library
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MotionSection, MotionText, MotionCard } from '../motion/MotionScroll';

interface LandingHomeProps {
  onGetStarted: () => void;
}

export default function LandingHome({ onGetStarted }: LandingHomeProps) {
  // Section 2: Infrastructure Animation State
  const [activeLayer, setActiveLayer] = useState<'student' | 'instructor' | 'department' | 'institution' | 'research' | 'cloud'>('student');
  
  // Section 3: Academic Ecosystem Module State
  const [selectedModule, setSelectedModule] = useState<string>('learner-hub');

  // Section 4: AI Knowledge Cloud Demo State
  const [selectedTerm, setSelectedTerm] = useState<string>('Renewable Energy');
  const [customTerm, setCustomTerm] = useState<string>('');
  
  // Section 6: Student Verification Engine State
  const [studentId, setStudentId] = useState<string>('COG-992-KE');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);

  // Section 11: Testimonial Carousel State
  const [activeTestimonial, setActiveTestimonial] = useState<number>(0);

  // Live Counter state for numerical sections
  const [metrics, setMetrics] = useState({
    learners: 4100000,
    institutions: 8200,
    resources: 42000000,
    countries: 42,
    connections: 84000000
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        learners: prev.learners + Math.floor(Math.random() * 5) + 1,
        institutions: prev.institutions,
        resources: prev.resources + Math.floor(Math.random() * 3) + 1,
        countries: 54, // Target representing 54 nations of Africa
        connections: prev.connections + Math.floor(Math.random() * 11) + 2
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Section 2 Infrastructure steps data
  const infraLayers = [
    {
      id: 'student',
      title: '1. Verified Learner',
      description: 'The atom of the ecosystem. Students gain secure digital credentials, micro-credentials, and personal offline-capable AI tutoring companions.',
      stat: '5M+ Learners Activated',
      color: 'from-red-600 to-rose-500'
    },
    {
      id: 'instructor',
      title: '2. Empowered Educator',
      description: 'Instructors utilize intelligent AI curriculum builders to auto-generate courses and publish premium content to the continental marketplace.',
      stat: '25,000+ Deployed Educators',
      color: 'from-rose-500 to-red-500'
    },
    {
      id: 'department',
      title: '3. Smart Department',
      description: 'Head of Departments govern curriculum drifts, assign teaching workloads, and automate lecture approval workflows with absolute version control.',
      stat: '3,400+ Department Portals',
      color: 'from-red-650 to-red-400'
    },
    {
      id: 'institution',
      title: '4. Enterprise Campus',
      description: 'Chancellor and Board members oversee student engagement drop-offs, track revenue streams on-chain, and administrate multi-campus setups seamlessly.',
      stat: '10,000+ Active Campuses',
      color: 'from-red-700 to-rose-600'
    },
    {
      id: 'research',
      title: '5. Connected Research Network',
      description: 'Researchers upload secure citations, map DOI hashes, and co-collaborate on high-tier Pan-African studies with dedicated government nodes.',
      stat: '50M+ Research Data Connections',
      color: 'from-rose-600 to-orange-500'
    },
    {
      id: 'cloud',
      title: '6. Africa Knowledge Cloud',
      description: 'The ultimate academic operating system. All decentralized repositories and institutional networks compiled into a secure, single sovereignty node.',
      stat: '100% Academic Sovereignty',
      color: 'from-red-600 to-orange-600'
    }
  ];

  // Section 3 Modules list
  const modules = [
    {
      id: 'learner-hub',
      title: 'Learner Hub',
      stat: 'Active adaptive learning path',
      icon: Users,
      desc: 'Seamless personal dashboard featuring offline-first course lectures, dynamic blockchain micro-credentials, and peer-to-peer messaging forums.',
      details: 'Integrates real-time diagnostic quiz engine checking conceptual gaps directly.'
    },
    {
      id: 'inst-library',
      title: 'Institutional Library',
      stat: 'Sovereign digital preservation',
      icon: Library,
      desc: 'Centralized repository with automated citation hashes, advanced metadata categorization, and instant PDF download security triggers.',
      details: 'Transforms raw assets into encrypted offline-first packages with legal proof-of-ownership.'
    },
    {
      id: 'marketplace',
      title: 'Instructor Marketplace',
      stat: 'Direct-to-learner payouts',
      icon: Zap,
      desc: 'Let educators directly publish interactive courses, rent laboratory slides, and track mobile money (M-Pesa, MTN, Airtel) sales shares natively.',
      details: 'Pre-fitted with instant contract micro-transacts splitting 90% revenue directly to creators.'
    },
    {
      id: 'research-cloud',
      title: 'Research Cloud',
      stat: 'High-throughput cataloging',
      icon: Network,
      desc: 'Pan-African collaborative workspace securely preserving on-chain document hashes, citation metrics, and sovereign peer-reviews.',
      details: 'Directly hooks into global registries and university cluster systems.'
    },
    {
      id: 'verification',
      title: 'Student Verification',
      stat: 'Instant trusted credentialing',
      icon: Shield,
      desc: 'Eliminate credential fraud overnight. Employers verify academic status, degrees, and grades in 3 seconds via immutable cryptographic signatures.',
      details: 'Direct SIS integrations supporting student discount verification instantly.'
    },
    {
      id: 'curriculum-intel',
      title: 'Curriculum Intelligence',
      stat: 'Accreditation alignment check',
      icon: Brain,
      desc: 'Automated auditing mapping local course syllabus items to international standard matrices and accreditation parameters.',
      details: 'Pre-detects structural curriculum drifts across separated campus databases.'
    },
    {
      id: 'ai-assistant',
      title: 'AI Academic Assistant',
      stat: 'Next-gen LLM integration',
      icon: Cpu,
      desc: 'Contextual tutor answering localized student questions, auto-suggesting course slides to professors, and drafting department compliance papers.',
      details: 'Powered by highly trained local knowledge pipelines without data leakage risk.'
    },
    {
      id: 'cert-engine',
      title: 'Certification Engine',
      stat: 'Blockchain backed credentials',
      icon: Award,
      desc: 'Issue verified tamper-proof diplomas and learning badges backed by cryptographically verifiable blockchain standards.',
      details: 'Supports native PDF embedding with direct single-click QR authenticity verification.'
    }
  ];

  // Section 4 mapping data details
  const knowledgeMapData: Record<string, { courses: string[]; researchers: string[]; universities: string[]; papers: string[] }> = {
    'Renewable Energy': {
      courses: ['Solar PV Microgrid Dynamics', 'Hydro-Electric Turbine Modeling', 'Wind Battery Array Architecture'],
      researchers: ['Dr. Sarah Mwangi', 'Prof. Maryam Al-Mansoor', 'Eng. Fatoumata Diallo'],
      universities: ['Kenyatta University', 'University of Cape Town', 'Ashesi University'],
      papers: ['Decentralized Solar Load-bearing Parameters v2', 'Bio-chemical Kinetic Systems in Agronomy']
    },
    'Decentralized Agronomy': {
      courses: ['Precision Farming in Sahel', 'Bio-Chemical Crop Diagnostics', 'Sub-Saharan Fertilizer Scaling'],
      researchers: ['Dr. James Adebayo', 'Prof. Helen Naidoo', 'Auditor Charles Kamau'],
      universities: ['Makerere University', 'Lilongwe University', 'University of Ibadan'],
      papers: ['Localized Soil Microgrid Data Arrays', 'Nitrogen Cycling in Renewable Orchards']
    },
    'Fintech Infrastructure': {
      courses: ['Mobile Money Protocol Engineering', 'Distributed Ledgers for Micro-Credit', 'Pan-African Settlement APIs'],
      researchers: ['Chancellor Maryam Al-Mansoor', 'Dr. Sarah Ndlovu', 'Prof. David Nkosi'],
      universities: ['Strathmore University', 'University of Witwatersrand', 'Accra Institute of Technology'],
      papers: ['On-Chain Revenue Split Audits on M-Pesa', 'SSO Gateways for Rural Student Financial Index']
    }
  };

  const handleVerifyStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      if (studentId.toUpperCase() === 'COG-992-KE') {
        setVerificationResult({
          status: 'SUCCESS',
          name: 'Adewale Mensah',
          institution: 'CogniSacra Sovereign University',
          campus: 'Nairobi Main Campus',
          credential: 'Bachelor of Science (First Class Hons) in Sustainable Microgrids',
          issuedDate: 'November 24, 2025',
          hash: '0xBD79A814F912...C83'
        });
      } else {
        setVerificationResult({
          status: 'NOT_FOUND',
          studentId: studentId
        });
      }
    }, 1500);
  };

  // Section 11 Testimonials List
  const testimonials = [
    {
      quote: "CogniSacra has completely transformed our sovereign administration. Hosting multiple campuses under a single unified dashboard while retaining departmental curriculum control is a massive leap forward for higher education in Africa.",
      name: "Prof. Maryam Al-Mansoor",
      title: "Vice Chancellor, STEM Agronomy Institute",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      rating: 5
    },
    {
      quote: "As an instructor, the automated AI course outline generator and direct billing to students mobile money accounts solved our biggest bottlenecks. We monetize peer-vetted papers within 3 minutes of upload approval.",
      name: "Dr. Sarah Mwangi",
      title: "Senior Lecturer, Sustainable Resources",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
      rating: 5
    },
    {
      quote: "Applying for on-chain scholarship credentials used to take 3 weeks of physical stamps. On CogniSacra, my verified academic fingerprint was vetted by independent registrars and unlocked my study grants instantly.",
      name: "Adewale Mensah",
      title: "Decentralized Microgrid Student Scholar",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      rating: 5
    }
  ];

  return (
    <div className="bg-[#08090A] text-zinc-100 font-sans antialiased relative overflow-hidden pt-12">
      
      {/* Decorative Codex theme ambient glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] rounded-full bg-gradient-to-tr from-emerald-500/10 to-teal-500/5 filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[45%] h-[50%] rounded-full bg-gradient-to-tr from-emerald-500/5 to-cyan-500/5 filter blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[30%] rounded-full bg-gradient-to-br from-emerald-950/20 to-black filter blur-[120px] pointer-events-none z-0" />

      {/* Grid Pattern overlay with scanline vibe */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(16,185,129,0.06)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-80" />

      {/* SECTION 1: HERO EXPERIENCE (Clean Executive Console Hero) */}
      <MotionSection className="relative min-h-[75vh] flex items-center justify-center py-20 md:py-28 z-10 px-4">
        <div className="max-w-4xl mx-auto w-full text-center space-y-8 flex flex-col items-center">
          
          <MotionText as="div" delay={0.05}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0E131C] border border-[#1E2536] shadow-xl transform transition duration-300 hover:scale-105">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-zinc-300">
                COGNISACRA PROTOCOL v3.2 <span className="text-emerald-400">•</span> LIVE RUNTIME
              </span>
            </div>
          </MotionText>

          <MotionText as="h1" delay={0.15} className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight font-sans leading-tight text-white max-w-4xl mx-auto">
            The AI Engine for <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">Academic Systems &amp;</span> <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 drop-shadow-[0_2px_15px_rgba(16,185,129,0.3)]">Intelligent Code</span>
          </MotionText>

          <MotionText as="p" delay={0.25} className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto font-mono text-sm sm:text-base">
            "Minimal UI. Maximum Execution." Train neural models, run live simulations, generate accredited curricula, and explore self-healing education nodes with sovereign on-chain verification.
          </MotionText>

          <MotionText as="div" delay={0.35} className="flex flex-col sm:flex-row gap-4 justify-center pt-2 w-full sm:w-auto">
            <button 
              onClick={onGetStarted}
              className="group px-8 py-3.5 bg-[#10B981] hover:bg-[#00F29A] text-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>&gt; LAUNCH CONSOLE</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            <button 
              onClick={onGetStarted}
              className="px-8 py-3.5 bg-[#0E131C] hover:bg-[#151C28] border border-[#1E2536] hover:border-emerald-500/50 text-zinc-200 hover:text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>EXPLORE ARCHITECTURE</span>
            </button>
          </MotionText>

          <MotionText as="div" delay={0.45} className="w-full pt-8 border-t border-[#1A2230] max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-white block">50M+</span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Encrypted Repos</span>
              </div>
              <div className="text-center">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 block">99.98%</span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Model Accuracy</span>
              </div>
              <div className="text-center">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-white block">54</span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Sovereign Nodes</span>
              </div>
            </div>
          </MotionText>

        </div>
      </MotionSection>

      {/* SECTION 2: THE ARCHITECTURE ANIMATION */}
      <MotionSection className="py-24 bg-[#090C11] border-y border-[#1A2230] relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          
          <MotionText as="div" delay={0.1} className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold block">// SYSTEM TOPOLOGY</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-white">Neural Knowledge Architecture</h2>
            <p className="text-zinc-400 text-sm md:text-base font-mono">
              Observe how a single learner node scales up dynamically across distributed institutional clusters.
            </p>
          </MotionText>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col: Layers Selector */}
            <div className="lg:col-span-5 space-y-2.5">
              {infraLayers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id as any)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    activeLayer === layer.id
                      ? `bg-[#0E1420] border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]`
                      : 'bg-[#0B0E14] border-[#1A2230] hover:border-zinc-700 hover:bg-[#10141D]'
                  }`}
                >
                  <div className="space-y-1">
                    <h3 className={`text-sm md:text-base font-bold font-mono ${
                      activeLayer === layer.id ? 'text-emerald-400' : 'text-zinc-200'
                    }`}>{layer.title}</h3>
                    <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block">{layer.stat}</span>
                  </div>
                  <div className={`p-2 rounded-lg transition-all duration-200 ${
                    activeLayer === layer.id ? 'bg-emerald-500 text-black' : 'bg-[#151C28] text-zinc-400'
                  }`}>
                    <ArrowUpRight size={14} />
                  </div>
                </button>
              ))}
            </div>

            {/* Right Col: Layer visual showcase panel */}
            <div className="lg:col-span-7 bg-[#0B0E14] rounded-2xl border border-[#1A2230] p-6 sm:p-10 relative overflow-hidden min-h-[350px] flex flex-col justify-between shadow-2xl">
              <div className="absolute right-0 top-0 opacity-5 pointer-events-none text-emerald-400">
                <Globe size={300} />
              </div>
              
              <AnimatePresence mode="wait">
                {infraLayers.map(layer => layer.id === activeLayer && (
                  <motion.div
                    key={layer.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 relative z-10"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <Cpu size={20} />
                      </span>
                      <h4 className="text-xl sm:text-2xl font-bold font-mono text-white">{layer.title}</h4>
                    </div>

                    <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-mono">
                      {layer.description}
                    </p>

                    <div className="p-4 bg-[#08090A] rounded-xl border border-[#1A2230] space-y-3 font-mono">
                      <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Live Cluster Deployment Scale</span>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400">Active Handshakes</span>
                        <span className="text-emerald-400 font-bold">99.98% Latency Secure</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#1A2230] rounded-full overflow-hidden">
                        <div className="h-full w-11/12 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>

          {/* Interactive numbers counter bottom segment */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-[#1A2230] text-center font-mono">
            <div className="space-y-1 transform hover:scale-105 transition duration-200">
              <p className="text-3xl md:text-5xl font-bold text-white">{metrics.countries}</p>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Sovereign State Nodes</span>
            </div>
            <div className="space-y-1 transform hover:scale-105 transition duration-200">
              <p className="text-3xl md:text-5xl font-bold text-emerald-400">{(metrics.learners / 1000000).toFixed(1)}M</p>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Active Verified Students</span>
            </div>
            <div className="space-y-1 transform hover:scale-105 transition duration-200">
              <p className="text-3xl md:text-5xl font-bold text-white">{(metrics.resources / 1000000).toFixed(0)}M+</p>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Knowledge Repos</span>
            </div>
            <div className="space-y-1 transform hover:scale-105 transition duration-200">
              <p className="text-3xl md:text-5xl font-bold text-emerald-400">{(metrics.connections / 1000000).toFixed(0)}M+</p>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">AI Citations Mapped</span>
            </div>
          </div>

        </div>
      </MotionSection>

      {/* SECTION 3: ACADEMIC ECOSYSTEM (Platform Showcase modules) */}
      <MotionSection className="py-24 bg-[#08090A] relative z-10 px-4">
        <div className="max-w-7xl mx-auto">
          
          <MotionText as="div" delay={0.1} className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold block">// WORKSPACE MODULES</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-white">Unified Developer &amp; Learning Hub</h2>
            <p className="text-zinc-400 text-sm md:text-base font-mono">
              Each workspace module features responsive telemetry, real-time code sandboxes, and verified cryptographic stamps.
            </p>
          </MotionText>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Grid of Modules Selector */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modules.map((mod) => {
                const IconComponent = mod.icon;
                return (
                  <button
                    key={mod.id}
                    onClick={() => setSelectedModule(mod.id)}
                    className={`p-5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between space-y-4 cursor-pointer ${
                      selectedModule === mod.id
                        ? 'bg-[#0E1420] border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20'
                        : 'bg-[#0B0E14] border-[#1A2230] hover:border-zinc-700 hover:bg-[#10141D]'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className={`p-2.5 rounded-lg ${
                        selectedModule === mod.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-[#151C28] text-zinc-400'
                      }`}>
                        <IconComponent size={20} />
                      </div>
                      <span className="text-[9px] uppercase tracking-wider font-mono text-emerald-400 font-bold">{mod.stat}</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className={`text-base font-bold font-mono ${
                        selectedModule === mod.id ? 'text-emerald-300' : 'text-zinc-100'
                      }`}>{mod.title}</h4>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-mono">{mod.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Showcase Visual specifications details (Right Col) */}
            <div className="lg:col-span-5 bg-[#0B0E14] rounded-2xl border border-[#1A2230] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
              <div className="absolute right-[-30px] bottom-[-20px] opacity-10 pointer-events-none text-emerald-500">
                <Brain size={250} />
              </div>
              
              <AnimatePresence mode="wait">
                {modules.map(mod => mod.id === selectedModule && (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6 relative z-10"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-mono font-bold block">// ACTIVE MODULE RUNTIME</span>
                      <h3 className="text-2xl md:text-3xl font-bold font-mono text-white">{mod.title}</h3>
                    </div>

                    <div className="p-4 bg-[#08090A] rounded-xl border border-[#1A2230]">
                      <p className="text-sm font-mono text-zinc-300 leading-relaxed">
                        {mod.desc}
                      </p>
                    </div>

                    <div className="space-y-3 font-mono">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 block pb-1 border-b border-[#1A2230]">Integration Specifications</span>
                      <div className="text-xs text-zinc-300 leading-relaxed">
                        • {mod.details}
                      </div>
                      <div className="text-xs text-emerald-400 leading-relaxed">
                        • Cryptographic validation speed: &lt; 24ms.
                      </div>
                    </div>

                    <button 
                      onClick={onGetStarted}
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] transition duration-200 cursor-pointer"
                    >
                      &gt; INITIALIZE MODULE SANDBOX
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </MotionSection>

      {/* SECTION 4: AI KNOWLEDGE CLOUD (Demo: Renewable Energy etc.) */}
      <MotionSection className="py-24 bg-[#090C11] border-t border-[#1A2230] relative z-10 px-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <MotionText as="div" delay={0.1}>
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold block">// NEURAL CLOUD INDEX</span>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-white leading-tight">
                  Academic Knowledge Mapped by AI
                </h2>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-mono">
                  Query any focus area or choose preset tags. The CogniSacra neural index dynamically parses related code repositories, researchers, and cryptographic certs.
                </p>
              </MotionText>

              {/* Tag Selection Row */}
              <div className="flex flex-wrap gap-2 pt-2">
                {['Renewable Energy', 'Decentralized Agronomy', 'Fintech Infrastructure'].map(term => (
                  <button
                    key={term}
                    onClick={() => { setSelectedTerm(term); setCustomTerm(''); }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${
                      selectedTerm === term && !customTerm
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'bg-[#0B0E14] hover:bg-[#151C28] text-zinc-300 border border-[#1A2230]'
                    }`}
                  >
                    #{term}
                  </button>
                ))}
              </div>

              {/* Interactive Search input */}
              <div className="relative pt-2">
                <Search size={16} className="absolute left-4 top-[22px] text-zinc-500" />
                <input
                  type="text"
                  placeholder="Type search hashtag or query..."
                  value={customTerm}
                  onChange={(e) => {
                    setCustomTerm(e.target.value);
                    if (knowledgeMapData[e.target.value]) {
                      setSelectedTerm(e.target.value);
                    }
                  }}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#1A2230] bg-[#0B0E14] text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                />
              </div>
            </div>

            {/* Neural Net graph (Codex styled) */}
            <div className="lg:col-span-7 bg-[#0B0E14] rounded-2xl border border-[#1A2230] p-6 md:p-8 min-h-[400px] flex flex-col justify-between relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.04),transparent)]" />
              
              <div className="flex justify-between items-center border-b border-[#1A2230] pb-3 mb-4">
                <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 flex items-center gap-1.5">
                  <Brain size={14} className="text-emerald-400 animate-pulse" />
                  <span>CogniSacra Neural Vector Graph</span>
                </span>
                <span className="text-[9px] uppercase font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">ONLINE</span>
              </div>

              {/* Nodes display */}
              <div className="relative flex-1 min-h-[280px] flex items-center justify-center">
                
                {/* Central Root Anchor */}
                <div className="absolute p-3.5 rounded-xl bg-[#08090A] border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] text-center max-w-[170px] z-20">
                  <span className="text-[8px] uppercase tracking-wider text-emerald-400 font-mono font-bold block">ANCHOR NODE</span>
                  <h4 className="text-xs font-mono font-bold text-white truncate">{customTerm || selectedTerm}</h4>
                </div>

                {/* Left Top Node */}
                <div className="absolute left-2 top-8 bg-[#08090A] border border-[#1A2230] p-3 rounded-lg max-w-[130px] space-y-1 transform hover:scale-105 transition duration-200 z-10">
                  <span className="text-[8px] uppercase tracking-wider text-emerald-400 font-mono font-bold block">Active Track</span>
                  <p className="text-[10px] font-mono font-semibold text-zinc-200 line-clamp-2">
                    {knowledgeMapData[selectedTerm]?.courses[0] || 'Dynamic Module Outline'}
                  </p>
                </div>

                {/* Left Bottom Node */}
                <div className="absolute left-10 bottom-4 bg-[#08090A] border border-[#1A2230] p-3 rounded-lg max-w-[130px] space-y-1 transform hover:scale-105 transition duration-200 z-10">
                  <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-mono font-bold block">Secondary Path</span>
                  <p className="text-[10px] font-mono font-semibold text-zinc-400 line-clamp-2">
                    {knowledgeMapData[selectedTerm]?.courses[1] || 'Accreditation Syllabi'}
                  </p>
                </div>

                {/* Right Top Node */}
                <div className="absolute right-2 top-10 bg-[#08090A] border border-[#1A2230] p-3 rounded-lg max-w-[130px] space-y-1 transform hover:scale-105 transition duration-200 z-10">
                  <span className="text-[8px] uppercase tracking-wider text-emerald-400 font-mono font-bold block">Lead Expert</span>
                  <p className="text-[10px] font-mono font-semibold text-zinc-200">
                    {knowledgeMapData[selectedTerm]?.researchers[0] || 'Prof. Maryam Al-Mansoor'}
                  </p>
                </div>

                {/* Right Bottom Node */}
                <div className="absolute right-12 bottom-2 bg-[#08090A] border border-[#1A2230] p-3 rounded-lg max-w-[130px] space-y-1 transform hover:scale-105 transition duration-200 z-10">
                  <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-mono font-bold block">Node Cluster</span>
                  <p className="text-[10px] font-mono font-semibold text-zinc-400">
                    {knowledgeMapData[selectedTerm]?.universities[0] || 'Kenyatta University'}
                  </p>
                </div>

                {/* Connecting SVGs lines in emerald */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1.5" strokeDasharray="3,3" />
                  <line x1="25%" y1="80%" x2="50%" y2="50%" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1.5" />
                  <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1.5" />
                  <line x1="75%" y1="80%" x2="50%" y2="50%" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1.5" strokeDasharray="3,3" />
                </svg>

              </div>

              <div className="space-y-1 mt-4 pt-3 border-t border-[#1A2230] text-xs font-mono text-zinc-400">
                <span className="text-[9px] uppercase font-bold text-emerald-400 block">// CITATION LOG</span>
                <p className="text-zinc-300 italic">
                  "{knowledgeMapData[selectedTerm]?.papers[0] || 'Sovereign Knowledge Preservation metrics loaded'}"
                </p>
              </div>

            </div>

          </div>

        </div>
      </MotionSection>

      {/* SECTION 5: GLOBAL INSTITUTIONAL LIBRARY */}
      <MotionSection className="py-24 bg-[#08090A] border-y border-[#1A2230] relative z-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative w-full h-[400px] flex items-center justify-center">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-teal-500/5 rounded-full filter blur-xl animate-pulse" />
            
            {/* Visual Books stack in Codex Dark */}
            <div className="relative space-y-3 w-72 font-mono">
              <div className="p-4 bg-[#0B0E14] border border-[#1A2230] rounded-xl shadow-xl flex items-center gap-3 transform -rotate-2 hover:rotate-0 transition duration-200">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold">PDF</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Solar PV Kinetics Manual</h4>
                  <p className="text-[9px] text-emerald-400">Approved Core Library</p>
                </div>
              </div>

              <div className="p-4 bg-[#0B0E14] border border-[#1A2230] rounded-xl shadow-xl flex items-center gap-3 transform rotate-2 hover:rotate-0 transition duration-200">
                <div className="p-2 bg-[#151C28] text-zinc-300 rounded-lg text-xs font-bold">DOC</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Sahel Bio-Chemical Crop Diagnostic</h4>
                  <p className="text-[9px] text-zinc-400">Accredited Syllabus</p>
                </div>
              </div>

              <div className="p-4 bg-[#0B0E14] border border-[#1A2230] rounded-xl shadow-xl flex items-center gap-3 transform -rotate-1 hover:rotate-0 transition duration-200">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold">XLS</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Microgrid Array Data Set</h4>
                  <p className="text-[9px] text-emerald-400">M-Pesa Ledger Mapped</p>
                </div>
              </div>
            </div>

            {/* Glowing particle arcs */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none text-emerald-500/30">
              <path d="M 120 120 Q 200 40 320 180" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" className="opacity-50" />
              <path d="M 100 240 Q 220 320 300 150" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" className="opacity-40" />
            </svg>
          </div>

          <MotionText as="div" delay={0.1} className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold block">// DIGITAL ASSET VAULT</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-white leading-tight">
              Cryptographic Institutional Vault
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-mono">
              Publish university assets into encrypted, legally authenticated virtual packages. Books, theses, lab records, and syllabus modules indexable with instant retrieval.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              <div className="p-4 bg-[#0B0E14] rounded-xl border border-[#1A2230] space-y-1">
                <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                  <Library size={16} />
                  <span>Instant Ingestion</span>
                </span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">Convert files into cryptographic index vectors automatically.</p>
              </div>
              <div className="p-4 bg-[#0B0E14] rounded-xl border border-[#1A2230] space-y-1">
                <span className="text-zinc-200 font-bold text-sm flex items-center gap-1.5">
                  <Shield size={16} className="text-emerald-400" />
                  <span>On-Chain Provenance</span>
                </span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">Decentralized timestamps protect academic intellectual property.</p>
              </div>
            </div>
          </MotionText>

        </div>
      </MotionSection>

      {/* SECTION 6: STUDENT VERIFICATION ENGINE */}
      <MotionSection className="py-24 bg-[#090C11] relative z-10 px-4">
        <div className="max-w-7xl mx-auto">
          
          <MotionText as="div" delay={0.1} className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold block">// SECURITY & VERIFICATION</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-white">Cryptographic Verification Engine</h2>
            <p className="text-zinc-400 text-sm md:text-base font-mono">
              Test drive the credential ledger. Enter the test student key below to run real-time evaluation against smart contract blocks.
            </p>
          </MotionText>

          <div className="max-w-3xl mx-auto bg-[#0B0E14] border border-[#1A2230] p-6 sm:p-10 rounded-2xl relative overflow-hidden shadow-2xl">
            <div className="absolute right-0 top-0 opacity-5 pointer-events-none text-emerald-500">
              <Shield size={350} />
            </div>

            <form onSubmit={handleVerifyStudent} className="space-y-6 relative z-10 font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                
                <div className="sm:col-span-8 space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Student ID Code</label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. COG-992-KE"
                    className="w-full text-xs font-mono font-bold px-4 py-3 rounded-lg border border-[#1A2230] bg-[#08090A] text-emerald-400 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition"
                  />
                  <span className="text-[10px] text-zinc-500 block">Use test code: <b className="text-emerald-400">COG-992-KE</b> for verified check</span>
                </div>

                <div className="sm:col-span-4 pt-3">
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] transition duration-200 disabled:opacity-50 cursor-pointer"
                  >
                    {isVerifying ? 'Verifying...' : '> RUN VERIFICATION'}
                  </button>
                </div>

              </div>
            </form>

            <AnimatePresence mode="wait">
              {isVerifying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-10 space-y-4"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-[#1A2230] border-t-emerald-400 animate-spin" />
                  <p className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">Querying Distributed Ledger Nodes...</p>
                </motion.div>
              )}

              {verificationResult && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-8 p-5 rounded-xl border font-mono ${
                    verificationResult.status === 'SUCCESS'
                      ? 'border-emerald-500/30 bg-[#080D0A] space-y-4'
                      : 'border-red-500/30 bg-[#120808] space-y-2'
                  }`}
                >
                  {verificationResult.status === 'SUCCESS' ? (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Identity Confirmed</span>
                          <h4 className="text-base font-bold text-white">{verificationResult.name}</h4>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1A2230] text-xs text-zinc-300">
                        <div>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-bold">Institution</span>
                          <p className="text-white font-bold">{verificationResult.institution}</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-bold">Campus / Location</span>
                          <p>{verificationResult.campus}</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-bold">Completed Degree</span>
                          <p className="text-emerald-400 font-bold">{verificationResult.credential}</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-bold">Cryptographic Ledger Stamp</span>
                          <p className="font-mono text-[10px] text-zinc-400 break-all">{verificationResult.hash}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-500/20 text-red-400 rounded-lg">
                        <ShieldAlert size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">Verification Error</span>
                        <h4 className="text-sm font-bold text-white">Record Not Resolved</h4>
                        <p className="text-xs text-zinc-400 mt-1">
                          The signature "{verificationResult.studentId}" does not map to any validated block.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </MotionSection>

      {/* SECTION 7: INSTITUTION CONTROL CENTER */}
      <MotionSection className="py-24 bg-[#08090A] border-y border-[#1A2230] relative z-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <MotionText as="div" delay={0.1} className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold block">// TELEMETRY HUB</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-white leading-tight">
              Sovereign Console &amp; Analytics
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-mono">
              The Chancellor &amp; Admin console delivers real-time cluster telemetry. Monitor concurrent executions, resource downloads, API throughput, and syllabus version drifts across all nodes.
            </p>

            <div className="space-y-4 font-mono">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg mt-0.5"><TrendingUp size={16} /></div>
                <div>
                  <h4 className="text-sm font-bold text-white">Real-Time Auditable Volume</h4>
                  <p className="text-xs text-zinc-400">Track learner engagement logs compiled every UTC block.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg mt-0.5"><Users size={16} /></div>
                <div>
                  <h4 className="text-sm font-bold text-white">Enterprise Accreditation Audits</h4>
                  <p className="text-xs text-zinc-400">Direct compliance mappings sent instantly to central education boards.</p>
                </div>
              </div>
            </div>
          </MotionText>

          {/* Floating dashboard showcase mock */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 relative font-mono">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-teal-500/5 rounded-full filter blur-xl" />
            
            <div className="p-5 bg-[#0B0E14] border border-[#1A2230] rounded-xl shadow-2xl relative z-10 space-y-3">
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Aggregated Asset Ingest</span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-bold text-white">4,192,204</span>
                <span className="text-xs text-emerald-400 font-bold">▲ 12.4%</span>
              </div>
              <div className="h-1.5 w-full bg-[#1A2230] rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-emerald-400 rounded-full" />
              </div>
            </div>

            <div className="p-5 bg-[#0B0E14] border border-[#1A2230] rounded-xl shadow-2xl relative z-10 space-y-3 transform sm:translate-y-6">
              <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold block">Total Consolidated Revenue</span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-bold text-white">$2.4M</span>
                <span className="text-xs text-zinc-400">Settlement Node</span>
              </div>
              <div className="h-1.5 w-full bg-[#1A2230] rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-emerald-400 rounded-full" />
              </div>
            </div>

            <div className="p-5 bg-[#0B0E14] border border-[#1A2230] rounded-xl shadow-2xl relative z-10 space-y-3">
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Active Citation Vectors</span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-bold text-white">104.9M</span>
                <span className="text-xs text-emerald-400 font-bold">▲ 8.1%</span>
              </div>
              <div className="h-1.5 w-full bg-[#1A2230] rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-emerald-400 rounded-full" />
              </div>
            </div>

            <div className="p-5 bg-[#0B0E14] border border-[#1A2230] rounded-xl shadow-2xl relative z-10 space-y-3 transform sm:translate-y-6">
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Accreditation Drift Check</span>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle size={14} />
                <span className="text-xs font-bold uppercase">100% Compliant</span>
              </div>
              <p className="text-[10px] text-zinc-500">Evaluated 3 minutes ago.</p>
            </div>
          </div>

        </div>
      </MotionSection>

      {/* SECTION 8: RESEARCH & INNOVATION NETWORK */}
      <MotionSection className="py-24 bg-[#090C11] relative z-10 px-4 border-b border-[#1A2230]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative w-full h-[400px] flex items-center justify-center lg:order-last">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-teal-500/5 rounded-full filter blur-xl animate-pulse" />
            
            {/* Visual representations of connected Universities and nodes */}
            <div className="relative w-80 h-80 flex items-center justify-center font-mono">
              {/* Central Sovereignty Pillar */}
              <div className="p-4 bg-[#0B0E14] border border-emerald-500/50 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] z-20 text-center text-xs font-bold uppercase text-white max-w-[140px]">
                Sovereign Core
              </div>

              {/* Around Nodes */}
              <div className="absolute top-4 left-4 p-2 bg-[#08090A] border border-[#1A2230] rounded-lg text-[9px] font-bold text-zinc-300 z-10">
                🏫 Universities
              </div>
              <div className="absolute bottom-4 right-4 p-2 bg-[#08090A] border border-[#1A2230] rounded-lg text-[9px] font-bold text-zinc-300 z-10">
                🏛 Government
              </div>
              <div className="absolute top-1/2 right-2 p-2 bg-[#08090A] border border-[#1A2230] rounded-lg text-[9px] font-bold text-zinc-300 z-10">
                🏭 Industry Hubs
              </div>

              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <line x1="15%" y1="15%" x2="50%" y2="50%" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1.5" />
                <line x1="85%" y1="85%" x2="50%" y2="50%" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1.5" />
                <line x1="90%" y1="50%" x2="50%" y2="50%" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          <MotionText as="div" delay={0.1} className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold block">// DISTRIBUTED MESH</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-white leading-tight">
              Global Innovation &amp; Research Mesh
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-mono">
              Ecosystem pathways link physical laboratories, patent offices, and industrial testing grids under a single sovereign ledger. Direct DOI mappings guarantee absolute priority tracking of inventions.
            </p>

            <button 
              onClick={onGetStarted}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)] transition cursor-pointer"
            >
              &gt; REQUEST NETWORK ACCESS
            </button>
          </MotionText>

        </div>
      </MotionSection>

      {/* SECTION 9: SUCCESS METRICS */}
      <MotionSection className="py-20 bg-[#08090A] border-b border-[#1A2230] relative z-10 font-mono">
        <div className="max-w-7xl mx-auto px-4">
          <MotionText as="div" delay={0.1} className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">// SCALE METRICS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Verified Platform Milestones</h2>
          </MotionText>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-center">
            <div className="p-5 bg-[#0B0E14] rounded-xl border border-[#1A2230] space-y-1 shadow-lg">
              <span className="text-3xl sm:text-4xl font-bold text-white">5M+</span>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest block">Active Learners</p>
            </div>
            <div className="p-5 bg-[#0B0E14] rounded-xl border border-[#1A2230] space-y-1 shadow-lg">
              <span className="text-3xl sm:text-4xl font-bold text-emerald-400">10,000+</span>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest block">Institutions</p>
            </div>
            <div className="p-5 bg-[#0B0E14] rounded-xl border border-[#1A2230] space-y-1 shadow-lg flex flex-col justify-center">
              <span className="text-3xl sm:text-4xl font-bold text-white">50M+</span>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest block">Repositories</p>
            </div>
            <div className="p-5 bg-[#0B0E14] rounded-xl border border-[#1A2230] space-y-1 shadow-lg">
              <span className="text-3xl sm:text-4xl font-bold text-emerald-400">54</span>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest block">Countries Active</p>
            </div>
            <div className="p-5 bg-[#0B0E14] rounded-xl border border-[#1A2230] space-y-1 shadow-lg">
              <span className="text-3xl sm:text-4xl font-bold text-white">100M+</span>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest block">Sync Connections</p>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* SECTION 10: WHY CODEX ACADEMY */}
      <MotionSection className="py-24 bg-[#090C11] border-b border-[#1A2230] relative z-10 px-4">
        <div className="max-w-7xl mx-auto">
          
          <MotionText as="div" delay={0.1} className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold block">// SYSTEM CAPABILITIES</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-white">The CogniSacra Academic OS</h2>
          </MotionText>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Card 1 */}
            <div className="p-7 bg-[#0B0E14] border border-[#1A2230] rounded-xl space-y-4 hover:border-emerald-500/50 transition duration-200 shadow-xl flex flex-col justify-between">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg w-fit">
                <Brain size={20} />
              </div>
              <div className="space-y-1.5 font-mono">
                <h3 className="text-base font-bold text-white">AI Native Foundation</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Engineered from the ground up for AI-first sovereign learning pathways with zero latency.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-7 bg-[#0B0E14] border border-[#1A2230] rounded-xl space-y-4 hover:border-emerald-500/50 transition duration-200 shadow-xl flex flex-col justify-between">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg w-fit">
                <Shield size={20} />
              </div>
              <div className="space-y-1.5 font-mono">
                <h3 className="text-base font-bold text-white">Enterprise Ready</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  School governance protocols pre-equipped with Ministry compliance checks and role-based access.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-7 bg-[#0B0E14] border border-[#1A2230] rounded-xl space-y-4 hover:border-emerald-500/50 transition duration-200 shadow-xl flex flex-col justify-between">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg w-fit">
                <Globe size={20} />
              </div>
              <div className="space-y-1.5 font-mono">
                <h3 className="text-base font-bold text-white">Pan-African &amp; Global</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Interconnected digital infrastructure aligned with standard sovereign educational credentials.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-7 bg-[#0B0E14] border border-[#1A2230] rounded-xl space-y-4 hover:border-emerald-500/50 transition duration-200 shadow-xl flex flex-col justify-between">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg w-fit">
                <Award size={20} />
              </div>
              <div className="space-y-1.5 font-mono">
                <h3 className="text-base font-bold text-white">Cryptographically Secure</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Zero room for credential fraud. High-throughput cryptographic ledger stamps keep degree statuses immutable.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="p-7 bg-[#0B0E14] border border-[#1A2230] rounded-xl space-y-4 hover:border-emerald-500/50 transition duration-200 shadow-xl flex flex-col justify-between">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg w-fit">
                <HardDrive size={20} />
              </div>
              <div className="space-y-1.5 font-mono">
                <h3 className="text-base font-bold text-white">Massive Scalability</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Built to scale from localized offline nodes up to massive multi-campus university clusters seamlessly.
                </p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="p-7 bg-[#0B0E14] border border-[#1A2230] rounded-xl space-y-4 hover:border-emerald-500/50 transition duration-200 shadow-xl flex flex-col justify-between">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg w-fit">
                <Zap size={20} />
              </div>
              <div className="space-y-1.5 font-mono">
                <h3 className="text-base font-bold text-white">Revenue Automation</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Monetize premium curricula natively. Instructors collect instant royalty shares via smart settlement gateways.
                </p>
              </div>
            </div>

          </div>

        </div>
      </MotionSection>

      {/* SECTION 11: TESTIMONIALS */}
      <MotionSection className="py-24 bg-[#08090A] border-b border-[#1A2230] relative z-10 px-4">
        <div className="max-w-7xl mx-auto">
          
          <MotionText as="div" delay={0.1} className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold block">// FIELD REPORTS</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-white">Voice of the Directorate</h2>
          </MotionText>

          <div className="max-w-4xl mx-auto bg-[#0B0E14] border border-[#1A2230] p-8 sm:p-12 rounded-2xl relative overflow-hidden shadow-2xl">
            <div className="absolute right-0 top-0 opacity-5 pointer-events-none text-emerald-500">
              <Star size={300} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Emerald Stars */}
                <div className="flex gap-1 text-emerald-400">
                  {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, idx) => (
                    <Star key={idx} size={16} fill="currentColor" />
                  ))}
                </div>

                <blockquote className="text-base sm:text-lg lg:text-xl font-mono text-zinc-200 leading-relaxed italic">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>

                <div className="flex items-center gap-4 pt-4 border-t border-[#1A2230]">
                  <img
                    src={testimonials[activeTestimonial].avatar}
                    alt={testimonials[activeTestimonial].name}
                    className="w-12 h-12 rounded-lg object-cover border border-[#1A2230]"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm font-mono">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-xs text-emerald-400 font-mono">{testimonials[activeTestimonial].title}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Manual Dot controls */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-3 h-2 rounded-full transition-all duration-200 cursor-pointer ${
                    activeTestimonial === idx ? 'bg-emerald-400 w-6' : 'bg-[#1A2230] hover:bg-zinc-700'
                  }`}
                  aria-label={`Show testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </MotionSection>

      {/* SECTION 12: PARTNERS & ACCREDITATION */}
      <MotionSection className="py-16 bg-[#090C11] relative overflow-hidden z-10 border-b border-[#1A2230]">
        <MotionText as="div" delay={0.1} className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-zinc-500 block">// TRUST &amp; ACCREDITATION MATRIX</span>
          
          <div className="relative w-full overflow-hidden py-2 font-mono">
            <div className="flex gap-4 justify-around items-center flex-wrap md:flex-nowrap">
              <div className="px-5 py-2.5 bg-[#0B0E14] border border-[#1A2230] rounded-lg text-xs font-bold uppercase text-zinc-300 tracking-wider">
                🛡 Ministry of Education
              </div>
              <div className="px-5 py-2.5 bg-[#0B0E14] border border-emerald-500/30 rounded-lg text-xs font-bold uppercase text-emerald-400 tracking-wider">
                🎓 Cape Town University
              </div>
              <div className="px-5 py-2.5 bg-[#0B0E14] border border-[#1A2230] rounded-lg text-xs font-bold uppercase text-zinc-300 tracking-wider">
                🏢 Sovereign Agronomy Council
              </div>
              <div className="px-5 py-2.5 bg-[#0B0E14] border border-emerald-500/30 rounded-lg text-xs font-bold uppercase text-emerald-400 tracking-wider">
                🌍 Global Research Hub
              </div>
            </div>
          </div>
        </MotionText>
      </MotionSection>

      {/* SECTION 13: FINAL CONVERSION SECTION */}
      <MotionSection className="py-24 bg-[#08090A] relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05),transparent)] pointer-events-none" />
        
        <MotionText as="div" delay={0.1} className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <div className="inline-flex p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl">
            <Cpu size={24} />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
            Empower Your Academic Infrastructure With CogniSacra
          </h2>

          <p className="max-w-2xl mx-auto text-zinc-400 font-mono text-sm sm:text-base leading-relaxed">
            One platform. Zero noise. Maximum clarity. Deploy sovereign campus nodes, run live simulations, and automate educational curricula.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.35)] transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              &gt; LAUNCH CONSOLE
            </button>
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 bg-[#0B0E14] border border-[#1A2230] text-zinc-200 hover:text-white hover:border-emerald-500/40 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition cursor-pointer"
            >
              REQUEST DEMO CLUSTER
            </button>
          </div>
        </MotionText>
      </MotionSection>

    </div>
  );
}
