import React, { useState } from 'react';
import { 
  BookOpen, Compass, Sparkles, Network, Database, Brain, Film, ShoppingCart, 
  Settings, Award, TrendingUp, Users, FileText, Search, Play, HelpCircle, 
  CheckCircle, ArrowRight, Quote, Plus, CreditCard, ChevronRight, Map, Globe,
  Upload, Shield, Eye, Trash2, RefreshCw, Layers, CheckSquare, Clock, Download,
  Volume2, Languages, ShieldCheck, DollarSign, BarChart2, MessageSquare, AlertTriangle, BookMarked
} from 'lucide-react';
import { sendMessageToAI } from '../services/geminiService';

// Custom interfaces
interface AcademicResource {
  id: string;
  title: string;
  author: string;
  category: 'PDF & eBook' | 'Lecture Slides' | 'Video Lecture' | 'Audio Lesson' | 'Past Paper' | 'Lab Manual' | 'Research Paper' | 'AI Training Dataset' | 'Code Repository' | 'Curriculum Doc';
  institution: string;
  year: number;
  tags: string[];
  excerpt: string;
  price: string;
  accessRule: 'Verified Student' | 'Alumni' | 'Public' | 'Paid Subscriber';
  isPublic: boolean;
  version: string;
  downloadsCount: number;
  viewsCount: number;
}

// Interactive Knowledge Graph node
interface GraphNode {
  id: string;
  label: string;
  type: 'Book' | 'Lecture Note' | 'Research Paper' | 'Video' | 'Exam' | 'Expert' | 'Main';
  institution: string;
  x: number;
  y: number;
  citation: string;
}

// Outdated References
interface SyllabusReference {
  id: string;
  course: string;
  currentRef: string;
  yearPublished: number;
  status: 'Critical Alert' | 'Up-to-Date' | 'Needs Review';
  suggestedUpgrade: string;
}

export default function CogniSacraInstitutionalLibraryView() {
  // Navigation: Institution Control vs Student View Simulator
  const [perspective, setPerspective] = useState<'control' | 'student'>('control');
  
  // Sub-tabs for Institution Control perspective
  const [controlTab, setControlTab] = useState<'dashboard' | 'publishing' | 'curriculum' | 'verification' | 'graph'>('dashboard');
  
  // Student View journey active tabs
  const [studentJourneyTab, setStudentJourneyTab] = useState<'landing' | 'verify' | 'catalog' | 'viewer' | 'checkout' | 'graph'>('landing');

  // Multi-currency Selection
  const [selectedCurrency, setSelectedCurrency] = useState<'KES' | 'NGN' | 'GHS' | 'ZAR' | 'USD'>('KES');

  // AI Knowledge Graph Search query state
  const [graphQuery, setGraphQuery] = useState('Renewable Energy from African universities between 2022–2026');
  const [customGraphNodes, setCustomGraphNodes] = useState<GraphNode[]>([]);
  const [isBuildingGraph, setIsBuildingGraph] = useState(false);
  const [selectedGraphNode, setSelectedGraphNode] = useState<GraphNode | null>(null);

  // Verification Portal States
  const [verificationInput, setVerificationInput] = useState({
    studentNum: 'UON-88412-2025',
    institution: 'University of Nairobi',
    email: 'sarah.mwangi@uonbi.ac.ke',
    otp: ''
  });
  const [verificationStep, setVerificationStep] = useState<'info' | 'otp' | 'success'>('info');
  const [verificationLogs, setVerificationLogs] = useState<string[]>([
    'System: Waiting for verification request...',
    'Integrations: SIS connection status - ONLINE',
  ]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSession, setVerifiedSession] = useState<boolean>(false);

  // Student Search query states
  const [studentSearchSub, setStudentSearchSub] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('All');
  const [activeVoiceSearch, setActiveVoiceSearch] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'sw' | 'fr' | 'yo'>('en');

  // Resource Viewer state
  const [viewerHighlight, setViewerHighlight] = useState('');
  const [viewerHighlightsList, setViewerHighlightsList] = useState<string[]>([]);
  const [viewerNotes, setViewerNotes] = useState('');
  const [viewerSummaryText, setViewerSummaryText] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [selectedCitationFormat, setSelectedCitationFormat] = useState<'APA' | 'Harvard' | 'MLA' | 'Chicago'>('APA');

  // Publishing Console Upload Form
  const [uploadForm, setUploadForm] = useState({
    title: '',
    author: 'Institution Faculty Group',
    category: 'PDF & eBook' as AcademicResource['category'],
    institution: 'University of Nairobi',
    year: 2026,
    tags: '',
    excerpt: '',
    price: 'Free',
    accessRule: 'Verified Student' as AcademicResource['accessRule'],
  });
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState(false);

  // Mock initial resources
  const [resources, setResources] = useState<AcademicResource[]>([
    {
      id: 'eco-circular-1',
      title: 'The Emergence of Circular Economy Systems in Sub-Saharan Africa',
      author: 'Dr. Sarah Mwangi, Prof. John Adebayo',
      category: 'Research Paper',
      institution: 'University of Nairobi',
      year: 2026,
      tags: ['Circular Economy', 'Sustainable Development', 'Africa'],
      excerpt: 'An investigation into closed-loop resource systems across municipal centers in Kenya and Nigeria.',
      price: 'Free',
      accessRule: 'Verified Student',
      isPublic: true,
      version: 'v1.4',
      downloadsCount: 1420,
      viewsCount: 3850
    },
    {
      id: 'solar-microgrid-2',
      title: 'Decentralized Microgrid Layouts & Solar System Controls',
      author: 'Dr. Kwame Nkrumah, Eng. Fatoumata Diallo',
      category: 'Lecture Slides',
      institution: 'Ashesi University',
      year: 2025,
      tags: ['Renewable Energy', 'Electrical Engineering', 'Microgrids'],
      excerpt: 'Key equations, configurations, and resistance parameters for localized off-grid grids.',
      price: 'KES 2,400',
      accessRule: 'Paid Subscriber',
      isPublic: true,
      version: 'v2.1',
      downloadsCount: 320,
      viewsCount: 1250
    },
    {
      id: 'agric-organic-3',
      title: 'Agroforestry & Soil Regeneration Standards in East Africa',
      author: 'Prof. Maryam Al-Mansoor',
      category: 'PDF & eBook',
      institution: 'Makerere University',
      year: 2026,
      tags: ['Agriculture', 'Organic Farming', 'Agroforestry'],
      excerpt: 'Integrating organic legume crops with nitrogen recycling standards topographies.',
      price: 'Free',
      accessRule: 'Public',
      isPublic: true,
      version: 'v1.0',
      downloadsCount: 2940,
      viewsCount: 6840
    },
    {
      id: 'past-exam-thermo',
      title: 'Thermodynamics & Kinetics final exam paper (2025)',
      author: 'Department of Mechanical Engineering',
      category: 'Past Paper',
      institution: 'University of Nairobi',
      year: 2025,
      tags: ['Thermodynamics', 'Mechanical Engineering', 'Past Papers'],
      excerpt: 'Thermodynamic heat transfers, fluid compression scenarios and kinetic coefficients matrices.',
      price: 'KES 500',
      accessRule: 'Verified Student',
      isPublic: true,
      version: 'v1.0',
      downloadsCount: 840,
      viewsCount: 2200
    },
    {
      id: 'dataset-green-accra',
      title: 'Accra Municipal Waste recycling dataset (2025)',
      author: 'Ashesi Green Lab & EPA',
      category: 'AI Training Dataset',
      institution: 'Ashesi University',
      year: 2025,
      tags: ['AI Dataset', 'Waste Management', 'West Africa'],
      excerpt: 'Excel sheets mapping organic and solid metal scrap transactions over Accra municipalities.',
      price: 'KES 5,800',
      accessRule: 'Alumni',
      isPublic: false,
      version: 'v3.2',
      downloadsCount: 110,
      viewsCount: 450
    }
  ]);

  const [selectedViewerResource, setSelectedViewerResource] = useState<AcademicResource>(resources[0]);

  // Outdated bibliography lists
  const [outdatedRefs, setOutdatedRefs] = useState<SyllabusReference[]>([
    { id: 'ref-1', course: 'BIO-101: Basic Agronomy structures', currentRef: 'Sands of Soil: Handbook 2012 edition', yearPublished: 2012, status: 'Critical Alert', suggestedUpgrade: 'Agroforestry standards East Africa (2026)' },
    { id: 'ref-2', course: 'EE-304: Localized grids layout', currentRef: 'Standard copper grid layout instructions (2018)', yearPublished: 2018, status: 'Needs Review', suggestedUpgrade: 'Decentralized Microgrids Controls (2025)' },
    { id: 'ref-3', course: 'MECH-441: High-temperature Thermodynamics', currentRef: 'Manual of heat transfers (2020)', yearPublished: 2020, status: 'Up-to-Date', suggestedUpgrade: 'Thermodynamic transfer kinetics paper (2025)' }
  ]);

  // Curriculum Comparison View years
  const [curriculumCompareYear, setCurriculumCompareYear] = useState({ old: 2023, new: 2026 });
  const [curriculumAILogs, setCurriculumAILogs] = useState<string>('Syllabus analysis ready. Compare to flag curriculum drifts.');
  const [isComparingCurriculum, setIsComparingCurriculum] = useState(false);

  // Active student resource purchasing checkout states
  const [checkoutItem, setCheckoutItem] = useState<AcademicResource | null>(null);
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('+254 712 345 678');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Offline Simulation state
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // --- ACTIONS CONTROLLER ---

  // Compile Dynamic Knowledge Graph Node Web
  const handleCompileGraph = async (forcedQuery?: string) => {
    setIsBuildingGraph(true);
    const query = forcedQuery || graphQuery;
    
    // Call Gemini to structure nodes or fallback instantly
    const instructionPrompt = `Create a list of 5 academic resource nodes related closely to: "${query}". Respond with ONLY a raw valid JSON array inside markdown codeblock with properties: id, label, type ("Book" | "Lecture Note" | "Research Paper" | "Video" | "Exam" | "Expert"), institution, x (coord values 80 to 420), y (coord values 80 to 380), citation. Do not add explanations.`;
    
    try {
      const responseStream = await sendMessageToAI(instructionPrompt);
      let cumulative = '';
      for await (const chunk of responseStream) {
        if (chunk.text) cumulative += chunk.text;
      }
      
      const cleanJsonStr = cumulative.substring(
        cumulative.indexOf('['),
        cumulative.lastIndexOf(']') + 1
      );
      const parsed = JSON.parse(cleanJsonStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setCustomGraphNodes([
          { id: 'center', label: query.substring(0, 32) + '...', type: 'Main', institution: 'Global Campus Connection', x: 250, y: 220, citation: 'Global Hub search criteria query' },
          ...parsed.map((item: any, index: number) => ({
            id: item.id || `node-${index}`,
            label: item.label || 'Subject Unit',
            type: item.type || 'Book',
            institution: item.institution || 'African Research Hub',
            x: item.x || (100 + index * 80),
            y: item.y || (90 + (index % 2) * 120),
            citation: item.citation || 'Verifiable credential citation standard'
          }))
        ]);
      }
    } catch (e) {
      console.warn("AI Knowledge Graph build failed, default to high-fidelity simulated topology:", e);
      // Beautiful default graph for the user query
      setCustomGraphNodes([
        { id: 'center', label: 'Ecosystem Carbon Capture', type: 'Main', institution: 'Collaborative Union', x: 250, y: 210, citation: 'Main search target vector' },
        { id: 're-1', label: 'Biomass converters paper (2024)', type: 'Research Paper', institution: 'University of Nairobi', x: 120, y: 120, citation: 'Mwangi, S. (2024). Nairobi Academic Journals.' },
        { id: 're-2', label: 'Lecture slide 14: Soil capture mechanisms', type: 'Lecture Note', institution: 'Makerere University', x: 380, y: 110, citation: 'Agronomy Department slides index, Makerere' },
        { id: 're-3', label: 'Kenya Biofuel control parameters', type: 'Book', institution: 'Ashesi University', x: 110, y: 310, citation: 'Sustainable Engineering textbook, Section 4.5' },
        { id: 're-4', label: 'Video: Thermal kinetic conversions (2025)', type: 'Video', institution: 'GIMPA University', x: 390, y: 320, citation: 'Dean Al-Hassan Class Archives (44 mins)' },
        { id: 're-5', label: 'Prof. Maryam Al-Mansoor', type: 'Expert', institution: 'Makerere Agronomy dean', x: 250, y: 70, citation: 'Consult and peer-review appointments available' },
        { id: 're-6', label: 'Accreditation assessment quiz standard', type: 'Exam', institution: 'National Quality board', x: 250, y: 360, citation: 'Accreditation board past question arrays' }
      ]);
    } finally {
      setIsBuildingGraph(false);
    }
  };

  // Generate AI Summarization in Reader
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    setViewerSummaryText('');
    const prompt = `Provide a concise 1-paragraph summary, 3 core bullet terms, and 1 outstanding experimental challenge for the academic resource: "${selectedViewerResource.title}" under sub-context: "${selectedViewerResource.excerpt}"`;
    try {
      const responseStream = await sendMessageToAI(prompt);
      let cumulative = '';
      for await (const chunk of responseStream) {
        if (chunk.text) {
          cumulative += chunk.text;
          setViewerSummaryText(cumulative);
        }
      }
    } catch (e) {
      console.error(e);
      // Fallback
      setViewerSummaryText(`### 🧠 AI Compiled Executive Summary
This literature explores the architectural feasibility of localized decentralized infrastructures. Specifically, analyzing efficiency outputs and trade bottlenecks within African municipal frameworks.

#### Core Insights:
* **Decentralization efficiency**: Enhances resource uptime configurations by 42%.
* **Geographic parameters**: Demands specific adjustments for East African agricultural topographies.
* **Capital standards**: Underlines high initial setups requiring cooperative multi-lateral systems.

#### Critical Friction Challenge:
* Achieving standard chemical titration and heat transfers consistency under sub-Saharan operational limitations.`);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Add Custom Highlight note
  const handleAddHighlight = () => {
    if (!viewerHighlight.trim()) return;
    setViewerHighlightsList([viewerHighlight.trim(), ...viewerHighlightsList]);
    setViewerHighlight('');
  };

  // Upload Resource admin action
  const handleUploadResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title) return;
    const item: AcademicResource = {
      id: `custom-resource-${Date.now()}`,
      title: uploadForm.title,
      author: uploadForm.author,
      category: uploadForm.category,
      institution: uploadForm.institution,
      year: Number(uploadForm.year),
      tags: uploadForm.tags.split(',').map(t => t.trim()),
      excerpt: uploadForm.excerpt || 'Custom institutional publishing document archived inside sovereign storage clouds.',
      price: uploadForm.price === '0' || uploadForm.price.toLowerCase() === 'free' ? 'Free' : `${selectedCurrency} ${uploadForm.price}`,
      accessRule: uploadForm.accessRule,
      isPublic: true,
      version: 'v1.0',
      downloadsCount: 0,
      viewsCount: 1
    };
    setResources([item, ...resources]);
    setUploadForm({
      title: '',
      author: 'Institution Faculty Group',
      category: 'PDF & eBook',
      institution: 'University of Nairobi',
      year: 2026,
      tags: '',
      excerpt: '',
      price: 'Free',
      accessRule: 'Verified Student',
    });
    setUploadSuccessAlert(true);
    setTimeout(() => setUploadSuccessAlert(false), 4000);
  };

  // Delete Resource admin action
  const handleDeleteResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  // Toggle Public/Private resource admin action
  const handleTogglePublic = (id: string) => {
    setResources(resources.map(r => r.id === id ? { ...r, isPublic: !r.isPublic } : r));
  };

  // Version upgrade admin action
  const handleVersionUpgrade = (id: string) => {
    setResources(resources.map(r => {
      if (r.id === id) {
        const currentNum = parseFloat(r.version.replace('v', ''));
        const nextNum = (currentNum + 0.1).toFixed(1);
        return { ...r, version: `v${nextNum}` };
      }
      return r;
    }));
  };

  // Run Curriculum Comparison AI simulation
  const handleCompareCurriculum = () => {
    setIsComparingCurriculum(true);
    setCurriculumAILogs('Analysing standard syllabus modules with international criteria structures...');
    
    setTimeout(() => {
      setCurriculumAILogs(`### 🛰️ Unified Curriculum Comparison Report (${curriculumCompareYear.old} vs ${curriculumCompareYear.new})

* **Status Mapping**: Identified 3 core credit-hour adjustments. Environmental technology modules increased by 25% over basic metallurgy.
* **Accreditation Discrepancies**: The older ${curriculumCompareYear.old} syllabus lacked standardized digital microgrid calibration modules required by the Regional Engineering Boards (EBK/AfCFTA).
* **Automated Recommendation**: Outdated reference "${outdatedRefs[0].currentRef}" is still cited in 4 core sub-departments. Recommend upgrading references to "${outdatedRefs[0].suggestedUpgrade}".
* **Global Alignment Core**: Syllabi is now 92% aligned with international UN Sustainable Industrial Standards (UNIDO-2026 guidelines).`);
      setIsComparingCurriculum(false);
    }, 1500);
  };

  // Start Student verification OTP flow
  const handleSendVerificationOTP = () => {
    if (!verificationInput.studentNum || !verificationInput.email) {
      alert('Please complete the institution credentials form.');
      return;
    }
    setIsVerifying(true);
    setVerificationLogs(prev => [
      ...prev,
      `API: Connected to SIS matching university: "${verificationInput.institution}"`,
      `API: Dispatching secure verification token to ${verificationInput.email}...`
    ]);

    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStep('otp');
      setVerificationLogs(prev => [
        ...prev,
        `System: One-Time-Password (OTP) token dispatched safely.`
      ]);
    }, 1200);
  };

  // Complete Student verification
  const handleConfirmVerificationOTP = () => {
    if (verificationInput.otp !== '123456' && verificationInput.otp.trim() !== '') {
      alert('Simulation guide: Enter OTP: 123456 to verify easily.');
      return;
    }
    setIsVerifying(true);
    setVerificationLogs(prev => [
      ...prev,
      `SIS DB: Validating Student Profile: "${verificationInput.studentNum}" with token verification code...`
    ]);

    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStep('success');
      setVerifiedSession(true);
      setVerificationLogs(prev => [
        ...prev,
        `SUCCESS: Sovereign authentication credential recorded. User matched: "Sarah Mwangi" (Department: Circular Economies & Bio-processing Systems, Year: 4, Authorized status: VERIFIED STUDENT)`
      ]);
    }, 1500);
  };

  // Handle Checkout M-Pesa / MTN mobile money payment simulation
  const handleProcessMarketPayment = () => {
    if (!mobileMoneyNumber) {
      alert('Please type mobile money number.');
      return;
    }
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      setResources(prev => {
        return prev.map(r => r.id === checkoutItem?.id ? { ...r, downloadsCount: r.downloadsCount + 1 } : r);
      });
      setTimeout(() => {
        setPaymentSuccess(false);
        setCheckoutItem(null);
        setStudentJourneyTab('catalog');
      }, 2500);
    }, 2000);
  };

  // Filter Student Catalog list based on states
  const filteredCatalog = resources.filter(res => {
    const textMatch = res.title.toLowerCase().includes(studentSearchSub.toLowerCase()) || 
                      res.author.toLowerCase().includes(studentSearchSub.toLowerCase()) ||
                      res.tags.some(t => t.toLowerCase().includes(studentSearchSub.toLowerCase()));
    const facultyMatch = selectedFaculty === 'All' || 
                         (selectedFaculty === 'STEM' && (res.category.includes('Dataset') || res.tags.includes('Engineering') || res.tags.includes('Renewable Energy') || res.title.includes('Thermodynamics'))) ||
                         (selectedFaculty === 'Business' && res.tags.includes('Circular Economy')) ||
                         (selectedFaculty === 'Agriculture' && res.tags.includes('Agriculture'));
    return textMatch && facultyMatch;
  });

  return (
    <div className="bg-[#0B0E14] min-h-screen text-zinc-100 font-sans w-full">
      
      {/* Visual Header Panel with high-status brand claim */}
      <div className="bg-[#0E131C] border-b border-[#1E2536] p-5 sticky top-0 z-40 shadow-xl">
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-md flex items-center justify-center text-emerald-400">
              <Layers size={22} className="animate-pulse" />
            </div>
            <div>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] tracking-widest font-mono font-bold uppercase px-2 py-0.5 rounded border border-emerald-500/20">
                CogniSacra™ Global Signature Product
              </span>
              <h1 className="text-lg md:text-xl font-bold font-serif text-white flex items-center gap-2">
                <span>CogniSacra Global Institutional Library™</span>
              </h1>
              <p className="text-[11px] text-zinc-400 font-mono">Sovereign publishing, curriculum intelligence, student verification & monetization Cloud.</p>
            </div>
          </div>

          {/* Perspective Switcher Controls */}
          <div className="flex items-center gap-1.5 bg-[#141B26] p-1 rounded-xl border border-[#1E2536] w-full md:w-auto font-mono">
            <button
              onClick={() => {
                setPerspective('control');
                setControlTab('dashboard');
              }}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                perspective === 'control'
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-[#1A2332]'
              }`}
            >
              <Settings size={14} />
              <span>🏢 Control Panel</span>
            </button>
            <button
              onClick={() => {
                setPerspective('student');
                setStudentJourneyTab('landing');
              }}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                perspective === 'student'
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-[#1A2332]'
              }`}
            >
              <Users size={14} />
              <span>🎓 Student Simulator</span>
            </button>
          </div>

        </div>
      </div>

      <div className="w-full p-4 md:p-6 space-y-6">

        {/* 🏢 PERSPECTIVE 1: COGNISACRA INSTUTION CONTROL PANEL (ADMIN WORKFLOWS) */}
        {perspective === 'control' && (
          <div className="space-y-6">
            
            {/* Control Secondary Hub Navs */}
            <div className="bg-[#0E131C] rounded-2xl p-3 border border-[#1E2536] shadow-xl flex flex-wrap gap-2 text-xs font-mono font-bold">
              {[
                { id: 'dashboard', label: 'Analytics Dashboard', icon: <BarChart2 size={15} /> },
                { id: 'publishing', label: 'Publishing Console', icon: <Upload size={15} /> },
                { id: 'curriculum', label: 'Curriculum Intelligence', icon: <Layers size={15} /> },
                { id: 'verification', label: 'Student ID SIS Engine', icon: <Shield size={15} /> },
                { id: 'graph', label: 'Institutional Knowledge Graph', icon: <Network size={15} /> },
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setControlTab(sub.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer ${
                    controlTab === sub.id
                      ? 'bg-emerald-500 text-black shadow-md'
                      : 'text-zinc-400 hover:bg-[#141B26] hover:text-white'
                  }`}
                >
                  {sub.icon}
                  <span>{sub.label}</span>
                </button>
              ))}
            </div>

            {/* CONTROL SUB-VIEW CONTENT CONTROL */}
            <div className="relative">

              {/* 1. ANALYTICS & MONITORING DASHBOARD */}
              {controlTab === 'dashboard' && (
                <div className="space-y-6">
                  
                  {/* Stats Cards Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    <div className="bg-[#0E131C] p-6 rounded-3xl border border-[#1E2536] shadow-sm relative overflow-hidden">
                      <div className="absolute right-4 top-4 bg-rose-50 dark:bg-rose-950 p-2.5 rounded-xl text-rose-600 dark:text-rose-400">
                        <Download size={22} />
                      </div>
                      <span className="text-[10px] text-zinc-500 uppercase font-black block tracking-widest">Total Downloads</span>
                      <h3 className="text-3xl font-bold font-serif text-white mt-1">248,150</h3>
                      <p className="text-[11px] text-green-550 font-bold mt-2 flex items-center gap-1">
                        <span>↑ +18.4%</span>
                        <span className="text-zinc-400 font-semibold">this semester</span>
                      </p>
                    </div>

                    <div className="bg-[#0E131C] p-6 rounded-3xl border border-[#1E2536] shadow-sm relative overflow-hidden">
                      <div className="absolute right-4 top-4 bg-indigo-50 dark:bg-indigo-950 p-2.5 rounded-xl text-indigo-605 dark:text-indigo-400">
                        <Eye size={22} />
                      </div>
                      <span className="text-[10px] text-zinc-500 uppercase font-black block tracking-widest">Resource Views</span>
                      <h3 className="text-3xl font-bold font-serif text-white mt-1">1.84M</h3>
                      <p className="text-[11px] text-green-550 font-bold mt-2 flex items-center gap-1">
                        <span>↑ +32.1%</span>
                        <span className="text-zinc-400 font-semibold">cross-device hits</span>
                      </p>
                    </div>

                    <div className="bg-[#0E131C] p-6 rounded-3xl border border-[#1E2536] shadow-sm relative overflow-hidden">
                      <div className="absolute right-4 top-4 bg-emerald-50 dark:bg-emerald-950 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400">
                        <BookOpen size={22} />
                      </div>
                      <span className="text-[10px] text-zinc-500 uppercase font-black block tracking-widest">Reading Time Hours</span>
                      <h3 className="text-3xl font-bold font-serif text-white mt-1">640,200</h3>
                      <p className="text-[11px] text-green-550 font-bold mt-2 flex items-center gap-1">
                        <span>↑ +14.2%</span>
                        <span className="text-zinc-400 font-semibold">duration retention</span>
                      </p>
                    </div>

                    <div className="bg-[#0E131C] p-6 rounded-3xl border border-[#1E2536] shadow-sm relative overflow-hidden bg-gradient-to-br from-white to-rose-50/20 dark:to-rose-955/10">
                      <div className="absolute right-4 top-4 bg-rose-600 text-white p-2.5 rounded-xl shadow-md">
                        <DollarSign size={22} />
                      </div>
                      <span className="text-[10px] text-zinc-500 uppercase font-black block tracking-widest">Sovereign Revenue</span>
                      <h3 className="text-3xl font-bold font-serif text-emerald-400 dark:text-rose-450 mt-1">$84,320</h3>
                      <p className="text-[11px] text-zinc-400 font-semibold mt-2">
                        Supported by local African payment rails
                      </p>
                    </div>

                  </div>

                  {/* Operational Analytics & Geo-reach layouts */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Visual columns chart representing top course engagement */}
                    <div className="lg:col-span-8 bg-[#0E131C] p-6 rounded-3xl border border-[#1E2536] shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center pb-4 border-b">
                          <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Student Departmental Engagement Matrix</h3>
                            <p className="text-xs text-zinc-400">Real-time compilation of system logs and reading sessions across faculties.</p>
                          </div>
                          <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg font-bold">Live Synced</span>
                        </div>

                        {/* Beautiful simulated chart bars */}
                        <div className="space-y-4 mt-6">
                          {[
                            { name: 'STEM & Renewable Energy Research', hours: '18,400 hrs', pct: 94, color: 'bg-rose-500' },
                            { name: 'Business Economics & Circular Markets', hours: '12,200 hrs', pct: 68, color: 'bg-indigo-600' },
                            { name: 'Agronomy & Soil Regeneration Standards', hours: '9,450 hrs', pct: 51, color: 'bg-emerald-500' },
                            { name: 'Computer Science & AI Dataset Pipelines', hours: '15,600 hrs', pct: 81, color: 'bg-blue-500' },
                            { name: 'Public Health & Bio-Chemistry Kinetics', hours: '4,100 hrs', pct: 28, color: 'bg-amber-500' },
                          ].map((faculty, idx) => (
                            <div key={idx} className="space-y-1.5 text-xs">
                              <div className="flex justify-between font-bold">
                                <span>{faculty.name}</span>
                                <span className="text-zinc-400 font-mono">{faculty.hours} ({faculty.pct}%)</span>
                              </div>
                              <div className="w-full bg-[#141B26] dark:bg-slate-850 h-3 rounded-full overflow-hidden">
                                <div className={`h-full ${faculty.color} rounded-full transition-all duration-1000`} style={{ width: `${faculty.pct}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t mt-6 flex justify-between items-center text-xs text-zinc-400">
                        <span>Aggregating data across 5 active sub-canvases</span>
                        <span className="font-mono">Timestamp: 2026-06-20</span>
                      </div>
                    </div>

                    {/* Geographic reach stats */}
                    <div className="lg:col-span-4 bg-[#0E131C] p-6 rounded-3xl border border-[#1E2536] shadow-sm flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs uppercase font-black text-zinc-400 tracking-wider flex items-center gap-1.5 pb-2.5 border-b">
                          <Globe size={13} className="text-rose-505" />
                          <span>Geographic Reach & Hubs</span>
                        </h3>

                        <div className="space-y-4 mt-5 text-xs">
                          {[
                            { region: 'Nairobi, East Africa (UoN Base)', share: 42, activeUsers: '14.2K students' },
                            { region: 'Kampala, East Africa (Makerere)', share: 21, activeUsers: '7.1K students' },
                            { region: 'Accra, West Africa (Ashesi Hub)', share: 18, activeUsers: '6.0K students' },
                            { region: 'Lagos, West Africa (UNILAG)', share: 12, activeUsers: '4.1K students' },
                            { region: 'Cape Town/South Africa Sub-grids', share: 7, activeUsers: '2.3K students' }
                          ].map((geo, idx) => (
                            <div key={idx} className="p-2 border rounded-xl border-[#1E2536] space-y-1">
                              <div className="flex justify-between font-black">
                                <span className="text-slate-805 dark:text-slate-205">{geo.region}</span>
                                <span className="text-rose-600">{geo.share}%</span>
                              </div>
                              <div className="flex justify-between text-[11px] text-zinc-400">
                                <span>Verified IDs</span>
                                <span>{geo.activeUsers}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 text-[10px] text-indigo-700 dark:text-indigo-400 font-bold tracking-tight rounded-xl border border-indigo-100/30 mt-4 leading-relaxed text-center">
                        💡 Data gathered matches registered active SIS mobile money licenses.
                      </div>
                    </div>

                  </div>

                  {/* AI Generated Institutional Insights Notification component */}
                  <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md relative overflow-hidden">
                    <div className="absolute right-[-40px] bottom-[-40px] opacity-10 blur-sm pointer-events-none">
                      <Brain size={250} />
                    </div>
                    <div className="max-w-3xl relative z-10 space-y-3">
                      <span className="bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded">
                        CogniSacra Intelligence Advisory Engine
                      </span>
                      <h4 className="font-serif font-bold text-base md:text-lg text-white">AI-Generated Institutional Library Report</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                        "Your mechanical and renewable energy publications are yielding exceptionally high session duration retention rates (averaging 44 minutes per user). However, older thermodynamics textbooks printed before 2020 are seeing a 64% drop-off rate, primarily due to outdated formulas not aligned with the 2026 UNIDO green technology benchmarks. We recommend deploying the version upgrades in the publishing console and prioritizing your 2026 decentralized microgrid curriculum slides."
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* 2. INSTITUTION PUBLISHING CONSOLE */}
              {controlTab === 'publishing' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Upload Resource Form block */}
                  <div className="lg:col-span-5 bg-[#0E131C] p-6 rounded-3xl border border-[#1E2536] shadow-sm flex flex-col justify-between">
                    <form onSubmit={handleUploadResource} className="space-y-4">
                      <div className="border-b pb-3 flex justify-between items-center">
                        <h3 className="font-serif font-bold text-white">Academy Resource Publisher</h3>
                        <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-1 rounded">Sovereign Cloud</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-black text-zinc-400">Resource Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. System equations for crop rotation..."
                          value={uploadForm.title}
                          onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-[#1E2536] bg-transparent text-zinc-200 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-505"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-zinc-400">Category Type</label>
                          <select
                            value={uploadForm.category}
                            onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value as any })}
                            className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-[#1E2536] bg-transparent text-zinc-200 dark:text-white focus:outline-none"
                          >
                            <option value="PDF & eBook" className="dark:bg-slate-900">PDF & eBook</option>
                            <option value="Lecture Slides" className="dark:bg-slate-900">Lecture Slides (PPT)</option>
                            <option value="Video Lecture" className="dark:bg-slate-900">Video Lecture</option>
                            <option value="Audio Lesson" className="dark:bg-slate-900">Audio Lesson</option>
                            <option value="Past Paper" className="dark:bg-slate-900">Past Paper</option>
                            <option value="Lab Manual" className="dark:bg-slate-900">Lab Manual</option>
                            <option value="Research Paper" className="dark:bg-slate-900">Research Paper</option>
                            <option value="AI Training Dataset" className="dark:bg-slate-900">AI Training Dataset</option>
                            <option value="Code Repository" className="dark:bg-slate-900">Code Repository</option>
                            <option value="Curriculum Doc" className="dark:bg-slate-900">Curriculum Doc</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-zinc-400">Year Published</label>
                          <input
                            type="number"
                            value={uploadForm.year}
                            onChange={(e) => setUploadForm({ ...uploadForm, year: Number(e.target.value) })}
                            className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-[#1E2536] bg-transparent text-zinc-200 dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-zinc-400">Set Price ({selectedCurrency})</label>
                          <input
                            type="text"
                            placeholder="e.g. 1500 or Free"
                            value={uploadForm.price}
                            onChange={(e) => setUploadForm({ ...uploadForm, price: e.target.value })}
                            className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-[#1E2536] bg-transparent text-zinc-200 dark:text-white focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-zinc-400">Access Restrictions</label>
                          <select
                            value={uploadForm.accessRule}
                            onChange={(e) => setUploadForm({ ...uploadForm, accessRule: e.target.value as any })}
                            className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-[#1E2536] bg-transparent text-zinc-200 dark:text-white focus:outline-none"
                          >
                            <option value="Verified Student" className="dark:bg-slate-900">Verified Student</option>
                            <option value="Alumni" className="dark:bg-slate-900">Alumni</option>
                            <option value="Public" className="dark:bg-slate-900">Public</option>
                            <option value="Paid Subscriber" className="dark:bg-slate-900">Paid Subscriber</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-black text-zinc-400">Comma-separated tags</label>
                        <input
                          type="text"
                          placeholder="e.g. Thermodynamics, Engineering, Kenya"
                          value={uploadForm.tags}
                          onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-[#1E2536] bg-transparent text-zinc-200 dark:text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-black text-zinc-400">Excerpt Outline</label>
                        <textarea
                          placeholder="Provide index summaries and curriculum targets..."
                          rows={3}
                          value={uploadForm.excerpt}
                          onChange={(e) => setUploadForm({ ...uploadForm, excerpt: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-[#1E2536] bg-transparent text-zinc-200 dark:text-white focus:outline-none"
                        />
                      </div>

                      <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-2.5 rounded-xl transition flex justify-center items-center gap-1.5">
                        <Upload size={14} />
                        <span>Publish into Sovereign Indexes</span>
                      </button>

                      {uploadSuccessAlert && (
                        <div className="p-3 bg-green-50 text-green-700 text-xs font-bold rounded-xl border border-green-150 text-center animate-bounce">
                          ✓ Document successfully catalogued into university master repositories.
                        </div>
                      )}
                    </form>
                  </div>

                  {/* Published Catalog Table & controls */}
                  <div className="lg:col-span-7 bg-[#0E131C] p-6 rounded-3xl border border-[#1E2536] shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center pb-3 border-b mb-4">
                        <h3 className="font-serif font-bold text-white">Active Institution Repositories</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-400 font-semibold">Base Currency:</span>
                          <select
                            value={selectedCurrency}
                            onChange={(e) => setSelectedCurrency(e.target.value as any)}
                            className="text-xs px-2 py-1 rounded bg-[#141B26] border font-bold"
                          >
                            <option value="KES">KES (Kenya)</option>
                            <option value="NGN">NGN (Nigeria)</option>
                            <option value="GHS">GHS (Ghana)</option>
                            <option value="ZAR">ZAR (S. Africa)</option>
                            <option value="USD">USD (Global)</option>
                          </select>
                        </div>
                      </div>

                      {/* Display Published resource cards */}
                      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                        {resources.map(res => (
                          <div key={res.id} className="p-4 border rounded-2xl border-slate-150 dark:border-slate-800 bg-[#141B26] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition hover:shadow-sm">
                            <div className="space-y-1.5 max-w-[70%]">
                              <div className="flex flex-wrap gap-1.5 items-center">
                                <span className="bg-slate-205 dark:bg-slate-800 text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded text-zinc-300 dark:text-slate-350">
                                  {res.category}
                                </span>
                                <span className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-350 text-[8px] uppercase font-bold px-1.5 py-0.5 rounded">
                                  {res.accessRule}
                                </span>
                                <span className="text-[9px] font-mono text-rose-600 bg-rose-50 px-1 py-0.5 rounded">
                                  {res.version}
                                </span>
                              </div>
                              <h4 className="font-black text-white text-xs leading-relaxed">{res.title}</h4>
                              <p className="text-[10.5px] text-zinc-400 font-sans">{res.author} ({res.institution})</p>
                              <div className="flex gap-4 text-[10px] text-zinc-500 font-semibold font-mono">
                                <span>Views ID: {res.viewsCount}</span>
                                <span>Downloads ID: {res.downloadsCount}</span>
                              </div>
                            </div>

                            {/* Actions layout bar */}
                            <div className="flex sm:flex-col justify-end items-end gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-2.5 sm:pt-0">
                              <span className="text-xs font-black text-rose-600 font-mono self-start sm:self-auto">{res.price}</span>
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => handleVersionUpgrade(res.id)}
                                  title="Increase version metadata"
                                  className="p-1.5 rounded-lg border border-[#1E2536] bg-[#0E131C] text-zinc-300 hover:bg-[#141B26] dark:hover:bg-slate-800 transition"
                                >
                                  <RefreshCw size={13} />
                                </button>
                                <button
                                  onClick={() => handleTogglePublic(res.id)}
                                  title="Toggle Public visibility status"
                                  className={`p-1.5 rounded-lg border transition ${
                                    res.isPublic 
                                      ? 'border-emerald-200 bg-emerald-50 text-emerald-600' 
                                      : 'border-[#1E2536] bg-[#0E131C] text-zinc-400'
                                  }`}
                                >
                                  <Eye size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteResource(res.id)}
                                  title="Archive/Delete from repository database"
                                  className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-emerald-400 hover:bg-red-100 transition"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 text-[11px] text-zinc-400 italic bg-[#0E131C] p-2.5 rounded-xl border border-slate-100 text-center">
                      💡 Sovereign DRM (Digital Rights Management) guarantees keys stay hidden.
                    </div>
                  </div>

                </div>
              )}

              {/* 3. CURRICULUM INTELLIGENCE SYSTEM */}
              {controlTab === 'curriculum' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left Controls & Bibliographies Upgrade Checkers */}
                  <div className="lg:col-span-5 bg-[#0E131C] p-6 rounded-3xl border border-[#1E2536] shadow-sm space-y-4">
                    <div className="border-b pb-3">
                      <span className="text-[8px] uppercase tracking-widest font-black text-indigo-500 block">Accreditation mapping standard</span>
                      <h3 className="font-serif font-bold text-white mt-1">Curriculum Intelligence Cockpit</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-slate-200/55 rounded-xl space-y-3.5">
                        <span className="text-[9px] uppercase font-black text-indigo-600 block tracking-widest">Syllabus Drift years selection</span>
                        <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                          <div>
                            <label className="block text-zinc-400 text-[10px] uppercase mb-1">Old Baseline Year</label>
                            <input
                              type="number"
                              value={curriculumCompareYear.old}
                              onChange={(e) => setCurriculumCompareYear({ ...curriculumCompareYear, old: Number(e.target.value) })}
                              className="w-full bg-[#141B26] px-3 py-1.5 rounded border"
                            />
                          </div>
                          <div>
                            <label className="block text-zinc-400 text-[10px] uppercase mb-1">New Baseline Year</label>
                            <input
                              type="number"
                              value={curriculumCompareYear.new}
                              onChange={(e) => setCurriculumCompareYear({ ...curriculumCompareYear, new: Number(e.target.value) })}
                              className="w-full bg-[#141B26] px-3 py-1.5 rounded border"
                            />
                          </div>
                        </div>

                        <button
                          onClick={handleCompareCurriculum}
                          disabled={isComparingCurriculum}
                          className="w-full bg-slate-900 text-white font-black text-xs py-2 rounded-xl transition flex justify-center items-center gap-1.5"
                        >
                          {isComparingCurriculum ? (
                            <>
                              <RefreshCw size={13} className="animate-spin" />
                              <span>Mapping Slices...</span>
                            </>
                          ) : (
                            <>
                              <Layers size={13} />
                              <span>Detect Curriculum Drift</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Display Accreditation compliance values */}
                      <div className="space-y-2 text-xs">
                        <span className="text-[10px] font-black uppercase text-zinc-400 block">Accreditation Standards Mapping</span>
                        <div className="p-3.5 border rounded-xl space-y-2">
                          <div className="flex justify-between items-center font-bold">
                            <span>Engineers Board of Kenya (EBK)</span>
                            <span className="text-emerald-600 text-[10.5px]">94% Compliant</span>
                          </div>
                          <div className="flex justify-between items-center font-bold border-t pt-1.5">
                            <span>AfCFTA Environmental Directives</span>
                            <span className="text-amber-600 text-[10.5px]">78% Compliant</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Reports & Outdated bibliography cards list */}
                  <div className="lg:col-span-7 bg-[#0E131C] p-6 rounded-3xl border border-[#1E2536] shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="text-[10px] uppercase font-black text-zinc-400 tracking-wider pb-2 border-b">
                        Outdated bibliography references logs list
                      </h4>

                      {/* Outdated bibliography items */}
                      <div className="space-y-3 mt-3.5">
                        {outdatedRefs.map(ref => (
                          <div key={ref.id} className="p-3 border rounded-xl flex justify-between items-center bg-[#141B26] border-slate-150 dark:border-slate-800">
                            <div className="space-y-1.5 max-w-[70%]">
                              <div className="flex items-center gap-2">
                                <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded ${
                                  ref.status === 'Critical Alert' ? 'bg-red-50 text-emerald-400' : ref.status === 'Needs Review' ? 'bg-amber-50 text-amber-600 font-semibold' : 'bg-green-50 text-green-700'
                                }`}>
                                  {ref.status}
                                </span>
                                <span className="text-[10px] text-zinc-400 font-semibold">{ref.course}</span>
                              </div>
                              <p className="text-xs font-black text-slate-805 dark:text-slate-250 italic">Cited: "{ref.currentRef}"</p>
                              <p className="text-[10.5px] text-indigo-700 dark:text-indigo-400 font-bold">Recommended Upgrade: "{ref.suggestedUpgrade}"</p>
                            </div>

                            <button
                              onClick={() => {
                                setOutdatedRefs(outdatedRefs.map(r => r.id === ref.id ? { ...r, status: 'Up-to-Date', currentRef: r.suggestedUpgrade } : r));
                                alert('Incorporate upgrade successfully executed.');
                              }}
                              disabled={ref.status === 'Up-to-Date'}
                              className={`text-[9.5px] font-black uppercase px-2.5 py-1.5 rounded-lg border transition ${
                                ref.status === 'Up-to-Date' 
                                  ? 'bg-transparent text-zinc-400 border-transparent' 
                                  : 'bg-slate-900 hover:bg-slate-800 text-white border-transparent'
                              }`}
                            >
                              {ref.status === 'Up-to-Date' ? 'Up To Date ✓' : 'Upgrade'}
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* AI Compared Logs Display */}
                      <div className="mt-6 bg-[#141B26] p-4 rounded-xl border text-xs leading-relaxed space-y-2 overflow-y-auto max-h-52">
                        {curriculumAILogs.startsWith('###') ? (
                          <div className="space-y-2 text-slate-705 dark:text-slate-205">
                            {curriculumAILogs.split('\n').map((line, lIdx) => {
                              if (line.startsWith('###')) return <h5 key={lIdx} className="font-bold text-white uppercase font-sans border-b pb-1 mb-2 mt-1">{line.replace('###', '')}</h5>;
                              if (line.startsWith('*')) return <div key={lIdx} className="flex gap-2 items-start"><span className="text-indigo-600 font-black">•</span><span>{line.replace('*', '').trim()}</span></div>;
                              return <p key={lIdx}>{line}</p>;
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-zinc-400">{curriculumAILogs}</div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50 dark:border-slate-850 mt-4 text-[10px] text-zinc-400 flex justify-between uppercase">
                      <span>Curriculum Intelligence Engine</span>
                      <span>Syllabi drift verifications</span>
                    </div>
                  </div>

                </div>
              )}

              {/* 4. STUDENT VERIFICATION & ACCESS CONTROL PORTAL */}
              {controlTab === 'verification' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left Config parameters */}
                  <div className="lg:col-span-5 bg-[#0E131C] p-6 rounded-3xl border border-[#1E2536] shadow-sm space-y-4">
                    <div className="border-b pb-3">
                      <span className="text-[8px] uppercase tracking-widest font-black text-rose-500 block">Security and Compliance Settings</span>
                      <h3 className="font-serif font-bold text-white mt-1">SIS Integration Portal</h3>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div className="bg-[#141B26] p-3.5 rounded-xl space-y-3">
                        <span className="text-[9px] uppercase font-black tracking-widest text-zinc-400 block">Active Verification Methods</span>
                        
                        <div className="space-y-2">
                          <label className="flex items-center gap-2.5 font-bold cursor-pointer">
                            <input type="checkbox" defaultChecked className="rounded border text-rose-600 accent-rose-600" />
                            <span>Student Registration Number Validation</span>
                          </label>
                          <label className="flex items-center gap-2.5 font-semibold cursor-pointer">
                            <input type="checkbox" defaultChecked className="rounded border text-rose-600 accent-rose-600" />
                            <span>Institutional Email Domain Check (.edu / .ac.ke)</span>
                          </label>
                          <label className="flex items-center gap-2.5 font-semibold cursor-pointer">
                            <input type="checkbox" defaultChecked className="rounded border text-rose-600 accent-rose-600" />
                            <span>Sovereign Identity verification logs (Passport / ID)</span>
                          </label>
                          <label className="flex items-center gap-2.5 font-semibold cursor-pointer">
                            <input type="checkbox" defaultChecked={false} className="rounded border text-rose-600 accent-rose-600" />
                            <span>OTP (One-Time Password) Token Checks</span>
                          </label>
                        </div>
                      </div>

                      {/* Display access rules map */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase text-zinc-400 block">Access Rules Architecture</span>
                        <div className="border rounded-xl divide-y">
                          <div className="p-2 flex justify-between">
                            <span className="font-bold">Verified Student</span>
                            <span className="text-emerald-600 font-black">Full access (all catalogs)</span>
                          </div>
                          <div className="p-2 flex justify-between">
                            <span className="font-bold">Alumni Status</span>
                            <span className="text-indigo-600 font-bold">Selected resources, slides</span>
                          </div>
                          <div className="p-2 flex justify-between">
                            <span className="font-bold">Public/Visitor</span>
                            <span className="text-zinc-400">Free publications ONLY</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Live verification records logs */}
                  <div className="lg:col-span-7 bg-[#0E131C] p-6 rounded-3xl border border-[#1E2536] shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="text-[10px] uppercase font-black text-zinc-400 tracking-wider pb-2 border-b flex justify-between">
                        <span>Digital Registry Logs list</span>
                        <span className="text-emerald-600 animate-pulse">Running checks</span>
                      </h4>

                      <div className="space-y-2 mt-4 max-h-56 overflow-y-auto font-mono text-[11px] leading-relaxed pr-1">
                        {verificationLogs.map((log, idx) => (
                          <div key={idx} className={`p-2.5 rounded-lg border leading-relaxed ${
                            log.startsWith('SUCCESS') 
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-150 text-emerald-700 dark:text-emerald-300 font-bold font-sans' 
                              : log.startsWith('API') 
                              ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-100 text-indigo-700 dark:text-indigo-300' 
                              : 'bg-[#141B26] border-slate-100 text-zinc-400'
                          }`}>
                            {log}
                          </div>
                        ))}
                      </div>

                      {/* Quick mock registration verification button */}
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => {
                            setVerificationLogs(prev => [
                              ...prev,
                              `SUCCESS: External verification request validated. Student Registry: "Sarah Mwangi" (authorized at 2026-06-20). Code: AUTH-TRUE`
                            ]);
                            alert('Simulated active authorization registry added.');
                          }}
                          className="bg-slate-950 text-white text-xs font-black px-4 py-2 rounded-xl"
                        >
                          Trigger Simulated SIS Request
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t mt-4 text-[10px] text-zinc-400 flex justify-between uppercase">
                      <span>Sovereign Identity Locker</span>
                      <span>Verified Active session counters</span>
                    </div>
                  </div>

                </div>
              )}

              {/* 5. COGNISACRA KNOWLEDGE GRAPH CONFIG */}
              {controlTab === 'graph' && (
                <div className="bg-[#0E131C] p-6 rounded-3xl border border-[#1E2536] shadow-sm space-y-6">
                  
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b">
                    <div>
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-black uppercase px-2 py-0.5 rounded">The Killer Feature</span>
                      <h3 className="font-serif font-bold text-lg text-white mt-1">CogniSacra AI Knowledge Graph</h3>
                      <p className="text-xs text-zinc-400">Search queries mapped immediately to multi-axis node connections (Books, Papers, Experts, Videos).</p>
                    </div>

                    <div className="flex gap-2 w-full lg:w-96">
                      <input
                        type="text"
                        placeholder="Search related terms..."
                        value={graphQuery}
                        onChange={(e) => setGraphQuery(e.target.value)}
                        className="flex-1 text-xs px-3 py-1.5 rounded-xl border text-zinc-200 dark:text-white bg-[#141B26]"
                      />
                      <button
                        onClick={() => handleCompileGraph()}
                        disabled={isBuildingGraph}
                        className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition shrink-0"
                      >
                        {isBuildingGraph ? 'Mapping...' : 'Cluster Axis'}
                      </button>
                    </div>
                  </div>

                  {/* Dynamic SVG topological mapping graph */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* SVG canvas */}
                    <div className="lg:col-span-8 bg-[#141B26] rounded-3xl border flex items-center justify-center relative min-h-[380px] p-2">
                      {isBuildingGraph ? (
                        <div className="text-center py-24 space-y-2">
                          <div className="h-6 w-6 border-2 border-indigo-650 border-t-transparent rounded-full animate-spin mx-auto" />
                          <span className="text-xs text-zinc-500 font-extrabold uppercase animate-pulse block">Computing multi-axis cluster maps...</span>
                        </div>
                      ) : customGraphNodes.length > 0 ? (
                        <div className="w-full h-full relative">
                          <div className="absolute top-3 left-3 flex gap-2 text-[10px] bg-[#0E131C] text-emerald-400 border border-[#1E2536] px-2.5 py-1 rounded-lg font-mono">
                            <span className="h-2 w-2 rounded-full bg-indigo-500 my-auto animate-pulse" />
                            <span className="font-mono uppercase font-black text-zinc-400">Topology Graph Connected</span>
                          </div>

                          <svg width="100%" height="340" viewBox="0 0 500 400" className="mx-auto block max-w-lg">
                            {/* Render Lines */}
                            {customGraphNodes.map(node => {
                              if (node.id === 'center') return null;
                              return (
                                <line
                                  key={node.id}
                                  x1={250}
                                  y1={210}
                                  x2={node.x}
                                  y2={node.y}
                                  stroke={selectedGraphNode?.id === node.id ? '#e11d48' : '#cbd5e1'}
                                  strokeWidth={selectedGraphNode?.id === node.id ? 2.5 : 1}
                                  strokeDasharray={selectedGraphNode?.id === node.id ? '0' : '4 4'}
                                  className="transition-all duration-300"
                                />
                              );
                            })}

                            {/* Render Nodes */}
                            {customGraphNodes.map(node => {
                              const isCenter = node.id === 'center';
                              const isSelected = selectedGraphNode?.id === node.id;
                              return (
                                <g
                                  key={node.id}
                                  transform={`translate(${node.x}, ${node.y})`}
                                  onClick={() => setSelectedGraphNode(node)}
                                  className="cursor-pointer group"
                                >
                                  <circle
                                    r={isCenter ? 26 : 14}
                                    fill={isSelected ? '#e11d48' : isCenter ? '#1e1b4b' : '#ffffff'}
                                    stroke={isSelected ? '#fda4af' : '#cbd5e1'}
                                    strokeWidth={isSelected ? 3.5 : 1.5}
                                    className="transition-all"
                                  />
                                  <text
                                    y={isCenter ? 38 : 24}
                                    textAnchor="middle"
                                    className="text-[9.5px] font-bold fill-slate-800 dark:fill-slate-100"
                                  >
                                    {node.label.length > 18 ? node.label.substring(0, 16) + '...' : node.label}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>
                      ) : (
                        <div className="text-center py-20 text-zinc-500 font-bold flex flex-col items-center justify-center gap-2">
                          <Network size={32} className="opacity-40 animate-bounce" />
                          <p className="text-xs">Type a search prompt query and click Cluster Axis to compute nodes mapping.</p>
                          <button
                            onClick={() => handleCompileGraph()}
                            className="text-xs text-indigo-600 font-black uppercase mt-3 hover:underline"
                          >
                            Load Pre-built Ecosystem Node Path
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Node Metadata drawer preview */}
                    <div className="lg:col-span-4 bg-[#141B26] p-5 rounded-3xl border flex flex-col justify-between min-h-[300px]">
                      <div>
                        <h4 className="text-[10px] uppercase font-black text-zinc-400 tracking-wider pb-2 border-b">
                          Cluster Node Metadata
                        </h4>

                        {selectedGraphNode ? (
                          <div className="space-y-4 mt-4 text-xs font-semibold">
                            <div className="space-y-1">
                              <span className="bg-slate-105 dark:bg-slate-800 text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded text-indigo-600 block w-max">
                                {selectedGraphNode.type}
                              </span>
                              <h5 className="font-bold text-white">{selectedGraphNode.label}</h5>
                              <p className="text-[10.5px] text-zinc-400">{selectedGraphNode.institution}</p>
                            </div>

                            <div className="p-3 bg-[#141B26] rounded-xl border text-[11px] text-zinc-300 leading-relaxed italic">
                              <span className="text-[9px] uppercase font-black font-sans block text-rose-600">Sovereign Citation Code</span>
                              "{selectedGraphNode.citation}"
                            </div>
                            
                            <p className="text-[10.5px] text-zinc-400 leading-relaxed">
                              This element has been successfully parsed into your central curriculum knowledge indexes to map accreditation and study prerequisites.
                            </p>
                          </div>
                        ) : (
                          <div className="py-20 text-center text-zinc-500 text-xs">
                            <HelpCircle size={28} className="mx-auto opacity-35 mb-2" />
                            Click any network node inside our central SVG canvas to inspect core citations, metadata and parent files easily.
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-rose-50/40 text-[9px] text-rose-700 font-bold rounded-xl text-center leading-relaxed mt-4">
                        💡 Connecting materials across 12 African Universities in Nairobi, Accra, and South Africa.
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </div>

          </div>
        )}


        {/* 🎓 PERSPECTIVE 2: STUDENT SIMULATOR (COMPREHENSIVE MULTI-PHASE STUDENT EXPERIENCE JOURNEY) */}
        {perspective === 'student' && (
          <div className="space-y-6">
            
            {/* Student Stage Header Wizard indicator bar */}
            <div className="bg-[#0E131C] rounded-2xl p-4 border border-[#1E2536] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex gap-2 items-center text-xs font-black uppercase text-zinc-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Student Path Simulator</span>
              </div>

              {/* Step indicator buttons */}
              <div className="flex items-center gap-1.5 flex-wrap text-[10.5px] font-bold">
                {[
                  { id: 'landing', label: '1. Discovery Landing', icon: <Globe size={12} /> },
                  { id: 'verify', label: '2. Student Verification', icon: <ShieldCheck size={12} /> },
                  { id: 'catalog', label: '3. Intellectual Catalog', icon: <BookOpen size={12} /> },
                  { id: 'viewer', label: '4. Visual Reader Suite', icon: <Layers size={12} /> },
                  { id: 'graph', label: '5. AI Topology Graph', icon: <Network size={12} /> },
                ].map((step, sIdx) => (
                  <button
                    key={step.id}
                    onClick={() => setStudentJourneyTab(step.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                      studentJourneyTab === step.id
                        ? 'bg-rose-600 text-white shadow'
                        : 'bg-[#141B26] border text-zinc-400'
                    }`}
                  >
                    {step.icon}
                    <span>{step.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* active view containers mapping */}
            <div className="relative">

              {/* PHASE 1: SEARCH DISCOVERY LANDING PAGE (GOOGLE-STYLE DIRECTORY ENGINE) */}
              {studentJourneyTab === 'landing' && (
                <div className="space-y-6">
                  
                  {/* Google Academic Search Console UI layout block */}
                  <div className="bg-gradient-to-br from-slate-905 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-850 text-center relative overflow-hidden">
                    <div className="absolute right-[-40px] top-[-40px] opacity-10 blur-sm">
                      <Network size={280} />
                    </div>

                    <div className="max-w-2xl mx-auto space-y-6 relative z-10">
                      <span className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] tracking-widest font-black uppercase px-2.5 py-1 rounded">
                        Sovereign Academic Knowledge Cloud
                      </span>
                      <h2 className="text-2xl md:text-4xl font-serif font-black tracking-tight leading-tight">
                        CogniSacra Global Institutional Library™
                      </h2>
                      <p className="text-xs md:text-sm text-slate-350 leading-relaxed font-semibold">
                        Enter multi-disciplinary search terms to query university master catalogs, find lecture slides, datasets, research outlines, and schedule peer mentorships.
                      </p>

                      {/* Giant Central Search console */}
                      <div className="relative max-w-lg mx-auto">
                        <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="Search 'Renewable Energy systems', 'agric soil capture'..."
                          value={studentSearchSub}
                          onChange={(e) => setStudentSearchSub(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setStudentJourneyTab('catalog');
                            }
                          }}
                          className="w-full pl-11 pr-24 py-3 text-xs md:text-sm font-mono text-zinc-100 rounded-2xl bg-[#141B26] border border-[#1E2536] placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 shadow-lg"
                        />
                        <button
                          onClick={() => setStudentJourneyTab('catalog')}
                          className="absolute right-2 top-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black uppercase px-4 py-1.5 rounded-xl transition shadow"
                        >
                          Query
                        </button>
                      </div>

                      <div className="flex flex-wrap justify-center items-center gap-2 pt-2 text-[10px] text-slate-401 font-mono font-bold">
                        <span>Trending searches:</span>
                        <button onClick={() => { setStudentSearchSub('Circular Economy'); setStudentJourneyTab('catalog'); }} className="bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-0.5 rounded text-emerald-300 border border-emerald-500/20 font-mono text-[10px] cursor-pointer">Circular Economy</button>
                        <button onClick={() => { setStudentSearchSub('Microgrid Layouts'); setStudentJourneyTab('catalog'); }} className="bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-0.5 rounded text-emerald-300 border border-emerald-500/20 font-mono text-[10px] cursor-pointer">Microgrid Layouts</button>
                        <button onClick={() => { setStudentSearchSub('Agroforestry'); setStudentJourneyTab('catalog'); }} className="bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-0.5 rounded text-emerald-300 border border-emerald-500/20 font-mono text-[10px] cursor-pointer">Agroforestry standards</button>
                      </div>
                    </div>
                  </div>

                  {/* UI Sub-section 2: Showcase Verified Universities */}
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase font-black text-zinc-400 block tracking-widest">Verified Publishing Universities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { title: 'University of Nairobi', country: 'Kenya', resources: '1,420 resources published', bg: 'bg-rose-50' },
                        { title: 'Ashesi University', country: 'Ghana', resources: '840 resources published', bg: 'bg-indigo-50' },
                        { title: 'Makerere University', country: 'Uganda', resources: '1,120 resources published', bg: 'bg-emerald-50' },
                        { title: 'GIMPA Executive', country: 'Ghana', resources: '320 lectures published', bg: 'bg-amber-50' }
                      ].map((uni, idx) => (
                        <div key={idx} className="bg-[#0E131C] p-5 rounded-2xl border border-[#1E2536] shadow-sm space-y-1.5 transition hover:translate-y-[-2px]">
                          <span className={`${uni.bg} text-zinc-200 text-[8.5px] uppercase font-black px-1.5 py-0.5 rounded`}>
                            {uni.country}
                          </span>
                          <h4 className="font-bold text-white text-xs">{uni.title}</h4>
                          <p className="text-[10px] text-zinc-400 font-semibold">{uni.resources}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Discovering Featured Materials */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    
                    {/* Trending catalog cards */}
                    <div className="bg-[#0E131C] p-6 rounded-3xl border border-[#1E2536] shadow-sm space-y-4">
                      <div className="pb-3 border-b flex justify-between items-center">
                        <h4 className="font-serif font-black text-xs uppercase tracking-wider text-white">Trending Core Publications</h4>
                        <span className="text-[10px] text-rose-600 font-bold">24-hour log update</span>
                      </div>

                      <div className="divide-y max-h-64 overflow-y-auto pr-1">
                        {resources.slice(0, 3).map((res, rIdx) => (
                          <div key={res.id} className="py-3 flex justify-between items-center gap-4">
                            <div className="space-y-1">
                              <h5 className="font-black text-white text-xs leading-relaxed">{res.title}</h5>
                              <p className="text-[10px] text-zinc-400">{res.author}</p>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedViewerResource(res);
                                setStudentJourneyTab('viewer');
                              }}
                              className="text-xs bg-[#141B26] border p-1 rounded-lg shrink-0 text-zinc-300"
                            >
                              Open
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Access ID Verification promotion */}
                    <div className="bg-indigo-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md flex flex-col justify-between min-h-[220px]">
                      <div className="space-y-2">
                        <span className="bg-rose-500/20 text-rose-300 text-[8px] uppercase tracking-widest font-black px-1.5 py-0.5 rounded">
                          Identity and DRM Access Verification
                        </span>
                        <h4 className="font-serif font-bold text-base">Verify your Student Credentials for Access</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Your institution requires active verification via integration links (SIS API) or Registration Number, before licensing unrestricted resources and past examinations.
                        </p>
                      </div>

                      <button
                        onClick={() => setStudentJourneyTab('verify')}
                        className="bg-emerald-500 text-black font-mono font-bold text-xs py-2 px-4 rounded-xl shadow-lg shadow-emerald-500/20 self-start hover:bg-emerald-400 transition cursor-pointer"
                      >
                        Enter Student Verification Engine
                      </button>
                    </div>

                  </div>

                </div>
              )}

              {/* PHASE 2: STUDENT ID VERIFICATION (SIS INTEGRATION MOCKUP) */}
              {studentJourneyTab === 'verify' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Verification Credentials entry form */}
                  <div className="lg:col-span-5 bg-[#0E131C] p-6 rounded-3xl border border-[#1E2536] shadow-sm flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="border-b pb-3">
                        <span className="text-[8.5px] uppercase tracking-widest font-black text-rose-500 block">Sovereign Identity Protection</span>
                        <h3 className="font-serif font-black text-white mt-1">Student SIS Verification Engine</h3>
                      </div>

                      {verificationStep === 'info' && (
                        <div className="space-y-3.5 text-xs">
                          <p className="text-zinc-400 leading-relaxed font-semibold">
                            Enter credentials conforming to your registered University database registration records to sync your licensed credentials logs.
                          </p>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-403 block">Select Your Active Institution</label>
                            <select
                              value={verificationInput.institution}
                              onChange={(e) => setVerificationInput({ ...verificationInput, institution: e.target.value })}
                              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-201 dark:border-slate-800 bg-transparent text-zinc-200 dark:text-white"
                            >
                              <option value="University of Nairobi">University of Nairobi (Kenya)</option>
                              <option value="Ashesi University">Ashesi University (Ghana)</option>
                              <option value="Makerere University">Makerere University (Uganda)</option>
                              <option value="GIMPA Executive">GIMPA University (Ghana)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-403 block">Student Registration Number</label>
                            <input
                              type="text"
                              value={verificationInput.studentNum}
                              onChange={(e) => setVerificationInput({ ...verificationInput, studentNum: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-xl border text-slate-805 bg-transparent"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-403 block">Institution Email Check</label>
                            <input
                              type="text"
                              value={verificationInput.email}
                              onChange={(e) => setVerificationInput({ ...verificationInput, email: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-xl border text-slate-805 bg-transparent font-semibold"
                            />
                          </div>

                          <button
                            onClick={handleSendVerificationOTP}
                            disabled={isVerifying}
                            className="w-full bg-slate-905 hover:bg-slate-800 text-white font-black text-xs py-2.5 rounded-xl transition shadow flex justify-center items-center gap-1.5"
                          >
                            <span>Validate Credentials & Send OTP</span>
                          </button>
                        </div>
                      )}

                      {verificationStep === 'otp' && (
                        <div className="space-y-4 text-xs font-semibold">
                          <div className="bg-[#141B26] border p-3 rounded-xl">
                            <span className="text-[9px] uppercase font-black tracking-widest text-indigo-600 block mb-1">Interactive Sandbox Tip</span>
                            <p className="text-zinc-400 leading-normal">
                              Enter verification code **123456** to authenticate successfully.
                            </p>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-zinc-400 block">Enter One-Time PIN (OTP)</label>
                            <input
                              type="text"
                              placeholder="Type 123456..."
                              value={verificationInput.otp}
                              onChange={(e) => setVerificationInput({ ...verificationInput, otp: e.target.value })}
                              className="w-full px-3 py-2 border rounded-xl text-center font-mono font-bold text-lg tracking-widest focus:outline-none focus:ring-1 focus:ring-rose-505"
                            />
                          </div>

                          <button
                            onClick={handleConfirmVerificationOTP}
                            disabled={isVerifying}
                            className="w-full bg-rose-600 hover:bg-rose-505 text-white font-black text-xs py-2 rounded-xl"
                          >
                            {isVerifying ? 'Verifying keys...' : 'Authenticate Profile Sovereign Card'}
                          </button>
                        </div>
                      )}

                      {verificationStep === 'success' && (
                        <div className="space-y-4 text-center py-6 text-xs font-semibold">
                          <div className="h-14 w-14 bg-green-50 rounded-full border border-green-200 flex items-center justify-center text-green-700 mx-auto animate-bounce">
                            <CheckSquare size={32} />
                          </div>
                          
                          <div className="space-y-1">
                            <h4 className="font-bold text-white">Authentication Confirmed</h4>
                            <p className="text-zinc-400 leading-relaxed font-sans mt-1">
                              Successfully registered Sovereign Identity Card for student: "Sarah Mwangi" (University of Nairobi). Full access to Restricted courses and Exam catalogs is now unlocked!
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              setStudentJourneyTab('catalog');
                            }}
                            className="bg-slate-905 text-white px-5 py-2 rounded-xl font-bold uppercase text-[10.5px]"
                          >
                            Explore Authorized Resource Directory
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 text-[9.5px] text-zinc-400 italic rounded-xl mt-4">
                      ✓ QR Code credential tokens are generated at successful session completion.
                    </div>
                  </div>

                  {/* Verification telemetry console logs */}
                  <div className="lg:col-span-7 bg-[#0E131C] p-6 rounded-3xl border border-[#1E2536] shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="text-[10px] uppercase font-black text-zinc-400 tracking-wider pb-2 border-b flex justify-between">
                        <span>Liveness Verification System Registers</span>
                        <span className="text-indigo-650 font-bold">Active API Node</span>
                      </h4>

                      <div className="space-y-2 mt-4 max-h-[340px] overflow-y-auto font-mono text-[11px] scale-95 origin-top-left leading-relaxed">
                        {verificationLogs.map((log, idx) => (
                          <div key={idx} className={`p-2 rounded-lg border ${
                            log.startsWith('SUCCESS') 
                              ? 'bg-emerald-50 text-emerald-700 border-green-200 font-bold' 
                              : log.startsWith('API') 
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-150' 
                              : 'bg-[#141B26] text-zinc-400'
                          }`}>
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4 flex justify-between items-center text-[10px] text-zinc-400 uppercase">
                      <span>SIS API Integration Nodes: 5/5</span>
                      <span>Identity confirmation registry</span>
                    </div>
                  </div>

                </div>
              )}

              {/* PHASE 3: INTELLECTUAL CATALOG & SMART LIBRARY SEARCH (SEMANTIC FILTERS, LANGUAGE OPTIONS) */}
              {studentJourneyTab === 'catalog' && (
                <div className="space-y-6">
                  
                  {/* Advanced layout controls, faculties, translation, voice controls */}
                  <div className="bg-[#0E131C] p-6 rounded-3xl border border-[#1E2536] shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="font-serif font-black text-rose-505 uppercase tracking-wide text-xs">Dynamic Academic Directory Index</h4>
                        <p className="text-xs text-zinc-400">Perform semantic filters, select target translation, or activate simulation of Voice Searching.</p>
                      </div>

                      {/* Language and voice inputs bar layout */}
                      <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                        {/* Voice simulation control */}
                        <button
                          onClick={() => {
                            setActiveVoiceSearch(!activeVoiceSearch);
                            if (!activeVoiceSearch) {
                              setStudentSearchSub('Organic Bioenergy Converter guidelines');
                              alert('Voice simulated successfully! Input translated in search field.');
                            }
                          }}
                          className={`p-2.5 rounded-xl border flex items-center gap-1.5 transition text-xs font-bold ${
                            activeVoiceSearch 
                              ? 'bg-red-50 text-emerald-400 animate-pulse border-red-200' 
                              : 'bg-[#141B26] text-zinc-300'
                          }`}
                        >
                          <Volume2 size={13} />
                          <span>{activeVoiceSearch ? 'Listening...' : 'Voice Search'}</span>
                        </button>

                        {/* Translation selects */}
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400 border px-2.5 py-1.5 bg-[#141B26] rounded-xl">
                          <Languages size={13} />
                          <select
                            value={selectedLanguage}
                            onChange={(e) => {
                              setSelectedLanguage(e.target.value as any);
                              alert(`Catalog entries translation initialized to: "${e.target.value.toUpperCase()}"`);
                            }}
                            className="bg-transparent border-none font-bold focus:outline-none"
                          >
                            <option value="en">English (US)</option>
                            <option value="sw">KiSwahili (East Africa)</option>
                            <option value="fr">French (West Africa)</option>
                            <option value="yo">Yoruba (Nigeria)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Faculty search pills and filters */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t text-xs">
                      {['All', 'STEM', 'Business', 'Agriculture'].map(faculty => (
                        <button
                          key={faculty}
                          onClick={() => setSelectedFaculty(faculty)}
                          className={`px-4 py-2 font-black rounded-xl border transition ${
                            selectedFaculty === faculty
                              ? 'bg-slate-905 text-white border-transparent'
                              : 'bg-[#141B26] hover:bg-[#1A2332] text-zinc-400 border-[#1E2536]'
                          }`}
                        >
                          {faculty}
                        </button>
                      ))}

                      {/* Search console entry field */}
                      <div className="relative flex-1 max-w-sm ml-auto">
                        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="Filter search catalogs..."
                          value={studentSearchSub}
                          onChange={(e) => setStudentSearchSub(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-[#141B26] rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-505"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Grid layout containing resources */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredCatalog.map(res => (
                      <div key={res.id} className="bg-[#0E131C] p-5 rounded-3xl border border-[#1E2536] shadow-sm flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start gap-2.5">
                            <span className="bg-slate-105 text-zinc-300 text-[8.5px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded">
                              {res.category}
                            </span>
                            <span className={`text-[8.5px] uppercase font-extrabold px-1.5 py-0.5 rounded ${
                              res.accessRule === 'Public' ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-emerald-400'
                            }`}>
                              {res.accessRule}
                            </span>
                          </div>

                          <h4 className="font-serif font-black text-xs md:text-sm text-white leading-relaxed">
                            {res.title}
                          </h4>
                          <p className="text-[10.5px] text-zinc-400 font-semibold">{res.author}</p>
                          <p className="text-[11px] text-zinc-300 dark:text-slate-350 leading-relaxed pt-1.5">
                            {res.excerpt}
                          </p>
                        </div>

                        {/* Trigger Read and Purchase gateways */}
                        <div className="pt-4 border-t mt-6 flex justify-between items-center text-xs">
                          <span className="text-rose-600 font-black font-mono">{res.price}</span>
                          
                          <div className="flex gap-2">
                            {res.price !== 'Free' ? (
                              <button
                                onClick={() => {
                                  setCheckoutItem(res);
                                  setStudentJourneyTab('checkout');
                                }}
                                className="bg-slate-905 hover:bg-slate-800 text-white font-black text-[10px] uppercase px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0"
                              >
                                <CreditCard size={11} />
                                <span>Buy resource</span>
                              </button>
                            ) : null}

                            <button
                              onClick={() => {
                                setSelectedViewerResource(res);
                                setStudentJourneyTab('viewer');
                              }}
                              className="text-[10.5px] font-black uppercase text-indigo-605 hover:underline flex items-center gap-1 shrink-0"
                            >
                              <span>Read Text</span>
                              <ArrowRight size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* PHASE 4: IN-BROWSER RESOURCE VIEWER PANEL (HIGHLIGHTS, NOTES, CITATIONS, AI NOTES) */}
              {studentJourneyTab === 'viewer' && selectedViewerResource && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left central reader simulating PDF or PPT text sheets */}
                  <div className="lg:col-span-8 bg-[#0E131C] p-6 rounded-3xl border border-[#1E2536] shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="border-b pb-3 flex justify-between items-center flex-wrap gap-2">
                        <div className="space-y-0.5">
                          <span className="bg-rose-50 text-emerald-400 text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded">
                            Interactive Kindle-like Viewer Pane
                          </span>
                          <h3 className="font-serif font-black text-white leading-tight">
                            {selectedViewerResource.title}
                          </h3>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono">Page 1 of 8</span>
                      </div>

                      {/* Content panel mock sheet representing PDF pages */}
                      <div className="mt-4 p-5 bg-[#0E131C] border-[#1E2536] border rounded-2xl text-xs leading-relaxed text-slate-705 dark:text-slate-205 space-y-4 max-h-[380px] overflow-y-auto font-sans">
                        <p className="font-bold">SECTION 1.1: OVERVIEW AND HISTORICAL INFRASTRUCTURE DRIFTS</p>
                        <p>
                          Decentralized microgrid topologies represents one of the most promising avenues for clean sustainable agricultural power distribution within the East African Economic Corridor (specifically Kisumu and Kakamega districts). Historically, linear municipal grids relied upon large centralized turbine installations, which suffered transmission leakage rates in excess of 24.5% across major transits.
                        </p>
                        <p className="bg-indigo-50/30 p-3 rounded border-l-4 border-indigo-500 italic">
                          "Under thermodynamic boundary rules, energy loss indicators map exponentially alongside copper cable heating friction variables. Sustainable systems must substitute heavy-distance routes with decentralized bio-fiber anaerobic digesters to fulfill environmental standards."
                        </p>
                        <p>
                          Furthermore, regional green product integration demands harmonized chemical parameters to prevent local grid damage. Active pH titration tests should strictly observe values between 6.5 and 7.4. Microfluidic installations under 0.45 ml/sec are optimized parameters for anaerobic conversion loops.
                        </p>
                      </div>

                      {/* Highlight segment text action console */}
                      <div className="mt-4 flex gap-2 w-full">
                        <input
                          type="text"
                          placeholder="Select custom words or write custom highlighted quote..."
                          value={viewerHighlight}
                          onChange={(e) => setViewerHighlight(e.target.value)}
                          className="flex-1 text-xs px-3 py-1.5 rounded-xl border bg-transparent text-slate-801"
                        />
                        <button
                          onClick={handleAddHighlight}
                          className="bg-slate-950 text-white font-bold text-[10px] uppercase px-3.5 py-1.5 rounded-xl transition"
                        >
                          Highlight
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t mt-4 text-[10px] text-zinc-400 flex justify-between font-bold">
                      <span>DRM Sovereign key validation status: LOCKED GREEN</span>
                      <span>Citation indexing active</span>
                    </div>
                  </div>

                  {/* Right Highlights drawer & Custom AISummary & Citation Generator */}
                  <div className="lg:col-span-4 bg-[#0E131C] p-6 rounded-3xl border border-[#1E2536] shadow-sm flex flex-col justify-between gap-6">
                    
                    {/* Citations generator drawer and selections */}
                    <div className="space-y-4">
                      
                      {/* Interactive Highlights box */}
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-black text-zinc-400 block">Custom Highlights & Notes</span>
                        <div className="p-3 bg-rose-50/20 rounded-xl space-y-2 max-h-40 overflow-y-auto border border-rose-105">
                          {viewerHighlightsList.length > 0 ? (
                            viewerHighlightsList.map((hl, hlIdx) => (
                              <div key={hlIdx} className="text-[10.5px] leading-relaxed p-1.5 border-b text-slate-705 flex gap-1.5">
                                <span className="text-emerald-400">✓</span>
                                <span>"{hl}"</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-[10px] text-slate-401 text-center py-2 italic">No highlights recorded yet. Add some below the reader.</div>
                          )}
                        </div>
                      </div>

                      {/* Citation builder selection */}
                      <div className="space-y-2 border-t pt-3">
                        <div className="flex justify-between items-center text-[10px] text-zinc-400 uppercase">
                          <span>Sovereign Citation Builder</span>
                          <div className="flex gap-1.5">
                            {['APA', 'Harvard', 'MLA', 'Chicago'].map(fmt => (
                              <button
                                key={fmt}
                                onClick={() => setSelectedCitationFormat(fmt as any)}
                                className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                  selectedCitationFormat === fmt ? 'bg-indigo-600 text-white' : 'bg-[#141B26] text-slate-451'
                                }`}
                              >
                                {fmt}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="p-2.5 bg-[#141B26] border rounded-xl text-[10.5px] text-zinc-300 leading-relaxed italic">
                          {selectedCitationFormat === 'APA' && (
                            <span>Mwangi, S., & Adebayo, J. (2026). The Emergence of Circular Economy Systems in Sub-Saharan Africa. *Nairobi Academic Reports*, 14(2), 112-124.</span>
                          )}
                          {selectedCitationFormat === 'Harvard' && (
                            <span>Mwangi, S. and Adebayo, J. 2026. "The Emergence of Circular Economy Systems in Sub-Saharan Africa". *Nairobi Academic Reports*, vol. 14, no. 2, pp. 112-124.</span>
                          )}
                          {selectedCitationFormat === 'MLA' && (
                            <span>Mwangi, Sarah and Adebayo, John. "The Emergence of Circular Economy Systems in Sub-Saharan Africa." *Nairobi Academic Reports*, 14.2 (2026): 112-124.</span>
                          )}
                          {selectedCitationFormat === 'Chicago' && (
                            <span>Mwangi, Sarah, and John Adebayo. "The Emergence of Circular Economy Systems in Sub-Saharan Africa." *Nairobi Academic Reports* 14, no. 2 (2026): 112-124.</span>
                          )}
                        </div>
                        
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`Cite code segment: [${selectedViewerResource.title}]`);
                            alert('Citation string successfully saved in clipboard.');
                          }}
                          className="text-[9px] font-black uppercase text-indigo-650 hover:underline inline-block"
                        >
                          Copy Citation Registry
                        </button>
                      </div>

                    </div>

                    {/* AI Summarization generator trigger */}
                    <div className="space-y-3.5 border-t pt-3">
                      <button
                        onClick={handleGenerateSummary}
                        disabled={isGeneratingSummary}
                        className="w-full bg-slate-950 hover:bg-slate-900 text-white text-xs font-black py-2 rounded-xl transition flex justify-center items-center gap-1.5 shadow"
                      >
                        <Sparkles size={13} className={isGeneratingSummary ? 'animate-spin' : ''} />
                        <span>{isGeneratingSummary ? 'Processing summaries...' : 'Trigger AI Reader Summary'}</span>
                      </button>

                      {viewerSummaryText && (
                        <div className="p-3 bg-indigo-50/40 border border-indigo-150 rounded-xl text-[10.5px] leading-relaxed text-slate-705 max-h-40 overflow-y-auto pr-1">
                          {viewerSummaryText.split('\n').map((line, lIdx) => {
                            if (line.startsWith('###')) return <h5 key={lIdx} className="font-bold text-white uppercase tracking-wide mt-1 pb-1 border-b text-[9.5px]">{line.replace('###', '')}</h5>;
                            if (line.startsWith('*')) return <div key={lIdx} className="flex gap-1.5 items-start"><span className="text-rose-600">•</span><span>{line.replace('*', '').trim()}</span></div>;
                            return <p key={lIdx} className="mt-1">{line}</p>;
                          })}
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}

              {/* PHASE 5: MOUNT PAYMENT / PURCHASE GATEWAY OVERLAY FOR PREMIUM ASSETS */}
              {studentJourneyTab === 'checkout' && checkoutItem && (
                <div className="max-w-xl mx-auto bg-[#0E131C] p-6 md:p-8 rounded-3xl border border-rose-102 shadow-xl space-y-6">
                  
                  <div className="border-b pb-4 text-center">
                    <span className="bg-rose-50 text-emerald-400 text-[9.5px] font-black uppercase px-2.5 py-1 rounded">Local Currency Payments</span>
                    <h3 className="font-serif font-black text-xl text-slate-905 mt-2">Purchase Premium Repository Resource</h3>
                    <p className="text-xs text-zinc-400 mt-1">Authorized transaction system supported across major African financial integrations.</p>
                  </div>

                  <div className="p-4 bg-[#141B26] border rounded-2xl flex justify-between items-center text-xs">
                    <div className="space-y-1">
                      <span className="bg-slate-150 uppercase tracking-widest text-[8px] px-1.5 py-0.5 rounded font-black text-zinc-400">{checkoutItem.category}</span>
                      <h4 className="font-bold text-slate-905">{checkoutItem.title}</h4>
                      <p className="text-zinc-400 text-[11px]">{checkoutItem.institution}</p>
                    </div>
                    <span className="text-sm font-black text-emerald-400 font-mono shrink-0">{checkoutItem.price}</span>
                  </div>

                  {paymentSuccess ? (
                    <div className="p-6 bg-green-50 text-green-700 text-xs font-bold border rounded-2xl text-center space-y-3">
                      <div className="h-10 w-10 bg-green-105 flex items-center justify-center rounded-full text-green-600 mx-auto animate-bounce text-lg">✓</div>
                      <h4>Transaction Authorized!</h4>
                      <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                        Transaction reference: EAP-PAY-88419 completed. Access key added to your authorized sovereign locker index. Directing to Catalog directories...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 text-xs font-semibold">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-black text-zinc-400 block">Select Target Payment Mode</label>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <button className="border-2 border-emerald-500 bg-rose-50/10 p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5">
                            <CreditCard size={18} className="text-emerald-400" />
                            <span>Mobile Money (M-Pesa/MTN)</span>
                          </button>
                          <button className="border border-slate-200 p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 opacity-55">
                            <CreditCard size={18} />
                            <span>Sovereign Plastic/Visa Cards</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-black text-zinc-400 block">Provide Wallet/Mobile Money Number</label>
                        <input
                          type="text"
                          value={mobileMoneyNumber}
                          onChange={(e) => setMobileMoneyNumber(e.target.value)}
                          className="w-full text-center text-sm font-bold tracking-wider px-3.5 py-2.5 rounded-xl border bg-transparent font-mono"
                        />
                      </div>

                      <button
                        onClick={handleProcessMarketPayment}
                        disabled={isProcessingPayment}
                        className="w-full bg-slate-905 hover:bg-slate-800 text-white font-black text-xs py-3 rounded-xl transition shadow flex items-center justify-center gap-1.5"
                      >
                        {isProcessingPayment ? (
                          <>
                            <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Contacting payment gateway...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard size={14} />
                            <span>Authorize Payment {checkoutItem.price}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  <div className="text-[9.5px] leading-relaxed text-zinc-400 text-center italic">
                    By submitting payment, you agree to student identity rules and digital content license specifications.
                  </div>
                </div>
              )}

              {/* PHASE 6: DYNAMIC KNOWLEDGE GRAPH OPTION SIMULATION FOR STUDENTS */}
              {studentJourneyTab === 'graph' && (
                <div className="bg-[#0E131C] p-6 rounded-3xl border border-[#1E2536] shadow-sm space-y-6">
                  
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b">
                    <div>
                      <span className="bg-rose-50 text-emerald-400 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">Discovery Graph View</span>
                      <h3 className="font-serif font-bold text-lg text-white mt-1">Sovereign AI Interactive Graph</h3>
                      <p className="text-xs text-zinc-400">Discover resources matched across major faculties under topological visual models.</p>
                    </div>

                    <div className="flex gap-2 w-full lg:w-96">
                      <input
                        type="text"
                        placeholder="Search related terms..."
                        value={graphQuery}
                        onChange={(e) => setGraphQuery(e.target.value)}
                        className="flex-1 text-xs px-3 py-1.5 rounded-xl border bg-[#141B26] text-slate-801"
                      />
                      <button
                        onClick={() => handleCompileGraph()}
                        disabled={isBuildingGraph}
                        className="bg-slate-909 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl shrink-0"
                      >
                        {isBuildingGraph ? 'Cluster...' : 'Compute Graph'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Graph drawing */}
                    <div className="lg:col-span-8 bg-[#141B26] rounded-3xl border flex items-center justify-center relative min-h-[380px] p-2">
                      {isBuildingGraph ? (
                        <div className="text-center py-24 space-y-2">
                          <div className="h-6 w-6 border-2 border-rose-505 border-t-transparent rounded-full animate-spin mx-auto" />
                          <span className="text-xs text-zinc-500 font-extrabold uppercase animate-pulse block">Computing multi-axis cluster maps...</span>
                        </div>
                      ) : customGraphNodes.length > 0 ? (
                        <div className="w-full h-full relative">
                          <div className="absolute top-3 left-3 flex gap-2 text-[10px] bg-[#0E131C] text-emerald-400 border border-[#1E2536] px-2.5 py-1 rounded-lg font-mono">
                            <span className="h-2 w-2 rounded-full bg-rose-500 my-auto animate-pulse" />
                            <span className="font-mono uppercase font-black text-zinc-400">Topology Graph Active</span>
                          </div>

                          <svg width="100%" height="340" viewBox="0 0 500 400" className="mx-auto block max-w-lg">
                            {/* Render Lines */}
                            {customGraphNodes.map(node => {
                              if (node.id === 'center') return null;
                              return (
                                <line
                                  key={node.id}
                                  x1={250}
                                  y1={210}
                                  x2={node.x}
                                  y2={node.y}
                                  stroke={selectedGraphNode?.id === node.id ? '#e11d48' : '#cbd5e1'}
                                  strokeWidth={selectedGraphNode?.id === node.id ? 2.5 : 1}
                                  strokeDasharray={selectedGraphNode?.id === node.id ? '0' : '4 4'}
                                  className="transition-all duration-300"
                                />
                              );
                            })}

                            {/* Render Nodes */}
                            {customGraphNodes.map(node => {
                              const isCenter = node.id === 'center';
                              const isSelected = selectedGraphNode?.id === node.id;
                              return (
                                <g
                                  key={node.id}
                                  transform={`translate(${node.x}, ${node.y})`}
                                  onClick={() => setSelectedGraphNode(node)}
                                  className="cursor-pointer group"
                                >
                                  <circle
                                    r={isCenter ? 26 : 14}
                                    fill={isSelected ? '#e11d48' : isCenter ? '#1e1b4b' : '#ffffff'}
                                    stroke={isSelected ? '#fda4af' : '#cbd5e1'}
                                    strokeWidth={isSelected ? 3.5 : 1.5}
                                    className="transition-all"
                                  />
                                  <text
                                    y={isCenter ? 38 : 24}
                                    textAnchor="middle"
                                    className="text-[9.5px] font-bold fill-slate-800 dark:fill-slate-100"
                                  >
                                    {node.label.length > 18 ? node.label.substring(0, 16) + '...' : node.label}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>
                      ) : (
                        <div className="text-center py-20 text-zinc-500 font-bold flex flex-col items-center justify-center gap-2">
                          <Network size={32} className="opacity-40 animate-bounce" />
                          <p className="text-xs">Type a search prompt query and click Compute Graph to render central node vectors.</p>
                          <button
                            onClick={() => handleCompileGraph()}
                            className="text-xs text-rose-600 font-extrabold uppercase mt-3 hover:underline"
                          >
                            Load Pre-built Ecosystem Node Path
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Node Metadata drawer preview */}
                    <div className="lg:col-span-4 bg-[#141B26] p-5 rounded-3xl border flex flex-col justify-between min-h-[300px]">
                      <div>
                        <h4 className="text-[10px] uppercase font-black text-zinc-400 tracking-wider pb-2 border-b">
                          Cluster Node Metadata
                        </h4>

                        {selectedGraphNode ? (
                          <div className="space-y-4 mt-4 text-xs font-semibold">
                            <div className="space-y-1">
                              <span className="bg-slate-105 dark:bg-slate-800 text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded text-indigo-650 block w-max">
                                {selectedGraphNode.type}
                              </span>
                              <h5 className="font-bold text-white">{selectedGraphNode.label}</h5>
                              <p className="text-[10.5px] text-slate-403">{selectedGraphNode.institution}</p>
                            </div>

                            <div className="p-3 bg-[#141B26] rounded-xl border text-[11px] text-zinc-300 leading-relaxed italic">
                              <span className="text-[9px] uppercase font-black font-sans block text-rose-605">Standard Citation Code</span>
                              "{selectedGraphNode.citation}"
                            </div>
                            
                            <p className="text-[10.5px] text-zinc-400 leading-relaxed">
                              This element has been successfully parsed into your search matches to suggest direct cross-references.
                            </p>
                          </div>
                        ) : (
                          <div className="py-20 text-center text-zinc-500 text-xs">
                            <HelpCircle size={28} className="mx-auto opacity-35 mb-2" />
                            Click any network node inside our central SVG canvas to inspect core citations, metadata and parent files easily.
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-rose-50/45 text-[9px] text-rose-700 font-bold rounded-xl text-center leading-relaxed mt-4">
                        💡 Aggregating sources across Nairobi and West African networks.
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </div>

         </div>
        )}

      </div>

    </div>
  );
}
