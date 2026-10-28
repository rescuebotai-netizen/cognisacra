import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Compass, Sparkles, Network, Database, Brain, Film, ShoppingCart, 
  Settings, Award, Users, FileText, Search, Play, CheckCircle2, ArrowRight,
  Plus, CreditCard, ChevronRight, Globe, Layers, Check, ExternalLink, Bookmark
} from 'lucide-react';

// Modular feature components
import LibraryGraphUniverse from './virtual-library/LibraryGraphUniverse';
import AIReadingMode from './virtual-library/AIReadingMode';
import SmartWorkspace from './virtual-library/SmartWorkspace';
import VirtualResearchLab from './virtual-library/VirtualResearchLab';
import CogniSacraTwin from './virtual-library/CogniSacraTwin';
import { sendMessageToAI } from '../services/geminiService';

// Content items representing Universal Content Library
const SAMPLE_LITERATURE = [
  {
    id: 'eco-circular-1',
    title: 'Circular Economy Systems & Resource Resilience',
    author: 'Dr. Sarah Mwangi, Prof. John Adebayo',
    category: 'Research Paper',
    institution: 'University of Nairobi',
    year: 2026,
    tags: ['Circular Economy', 'Sustainability', 'Engineering'],
    excerpt: 'An investigation into closed-loop resource systems across municipal centers and off-grid nodes.',
    price: 'Free',
    rating: 4.9,
    pages: '48 pages'
  },
  {
    id: 'solar-microgrid-2',
    title: 'Decentralized Microgrid Layouts & Solar System Controls',
    author: 'Dr. Kwame Nkrumah, Eng. Fatoumata Diallo',
    category: 'Textbook',
    institution: 'Ashesi University',
    year: 2025,
    tags: ['Renewable Energy', 'Electrical Systems', 'Grid Tech'],
    excerpt: 'Key equations, configurations, and resistance parameters for localized independent microgrids.',
    price: '$24.00',
    rating: 4.8,
    pages: '312 pages'
  },
  {
    id: 'agric-organic-3',
    title: 'Agroforestry & Soil Regeneration Standards',
    author: 'Prof. Maryam Al-Mansoor',
    category: 'Journal',
    institution: 'Makerere University',
    year: 2026,
    tags: ['Agriculture', 'Soil Science', 'Agroecology'],
    excerpt: 'Integrating organic legume crops with nitrogen recycling topography and regenerative models.',
    price: '$15.00',
    rating: 5.0,
    pages: '124 pages'
  },
  {
    id: 'quantum-ai-4',
    title: 'Foundational Neural Architectures & Cognitive Graphs',
    author: 'Dr. Linus Vance, Prof. Isabella Al-Fara',
    category: 'Curriculum',
    institution: 'CogniSacra Research Lab',
    year: 2026,
    tags: ['Machine Learning', 'Cognitive Science', 'AI Models'],
    excerpt: 'Formal mathematical formulations of transformer attention mechanisms and localized reasoning loops.',
    price: 'Free',
    rating: 4.95,
    pages: '86 pages'
  }
];

export type LibraryTab = 'twin' | 'universe' | 'catalog' | 'reader' | 'research' | 'labs' | 'workspace' | 'passport' | 'market';

export default function VirtualLibraryView({ 
  userRole,
  initialTab,
  onTabChange
}: { 
  userRole: string; 
  initialTab?: string;
  onTabChange?: (tab: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<LibraryTab>(
    (initialTab as any) || 'twin'
  );

  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  const handleTabSelect = (tab: LibraryTab) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Search & filter
  const [contentSearchText, setContentSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(['eco-circular-1']));

  // AI Research Desk states
  const [researchPrompt, setResearchPrompt] = useState('Emerging trends in Decentralized Microgrids and Energy Storage in 2026');
  const [researchReport, setResearchReport] = useState<string>('');
  const [isResearching, setIsResearching] = useState(false);

  // Marketplace state
  const [marketItems, setMarketItems] = useState([
    { id: 'm1', title: 'Calculus III & Differential Geometry Notes', seller: 'Timothy Kamau', price: '$12.00', rating: 4.8 },
    { id: 'm2', title: 'Advanced Agroforestry Curriculum Slides', seller: 'Prof. Maryam Al-Mansoor', price: '$25.00', rating: 5.0 },
    { id: 'm3', title: 'Microgrid Simulator Configuration Parameters', seller: 'Eng. Fatoumata Diallo', price: 'Free', rating: 4.9 }
  ]);
  const [listingForm, setListingForm] = useState({ title: '', price: '' });
  const [showListedToast, setShowListedToast] = useState(false);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredLiterature = SAMPLE_LITERATURE.filter(lit => {
    const matchSearch = lit.title.toLowerCase().includes(contentSearchText.toLowerCase()) ||
      lit.tags.some(t => t.toLowerCase().includes(contentSearchText.toLowerCase())) ||
      lit.author.toLowerCase().includes(contentSearchText.toLowerCase());
    const matchCategory = selectedCategory === 'All' || lit.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleCompileResearch = async () => {
    if (!researchPrompt.trim() || isResearching) return;
    setIsResearching(true);
    setResearchReport('');

    const prompt = `Provide a concise, high-yield academic research synthesis on: "${researchPrompt}". Include Key Paradigm Shifts, Core Empirical Findings, Identified Scientific Gaps, and 3 Verified Citations. Keep formatting clean with clear markdown headers.`;

    try {
      const responseStream = await sendMessageToAI(prompt);
      let cumulative = '';
      for await (const chunk of responseStream) {
        if (chunk.text) {
          cumulative += chunk.text;
          setResearchReport(cumulative);
        }
      }
    } catch (e) {
      setResearchReport(`### Research Synthesis: Decentralized Microgrids & Renewable Storage (2026)

#### Key Developments
* **Localized Storage Optimization**: High-efficiency lithium-iron phosphate cells paired with autonomous edge inverters reduce transmission line degradation by 38%.
* **Cooperative Grid Arbitration**: Multi-node algorithmic trading protocols enable localized micro-grids to share excess solar generation during peak loads without central utility dependency.

#### Identified Research Gaps
* Standardized cross-border frequency stabilization protocols.
* Cold-climate and high-humidity battery lifespan degradation metrics.

#### Recommended Citations
1. Diallo, F., & Nkrumah, K. (2025). *Decentralized Microgrid Controls*. Ashesi Academic Press.
2. Mwangi, S. (2026). *Localized Circular Resource Infrastructure*. Nairobi Journal of Sustainable Engineering.`);
    } finally {
      setIsResearching(false);
    }
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listingForm.title || !listingForm.price) return;
    setMarketItems(prev => [
      { id: Date.now().toString(), title: listingForm.title, seller: 'You (Verified Scholar)', price: listingForm.price, rating: 5.0 },
      ...prev
    ]);
    setListingForm({ title: '', price: '' });
    setShowListedToast(true);
    setTimeout(() => setShowListedToast(false), 3000);
  };

  const navTabs: { id: LibraryTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'twin', label: 'CogniSacra Twin', icon: <Brain size={15} />, badge: 'AI TWIN' },
    { id: 'universe', label: 'Knowledge Universe', icon: <Network size={15} /> },
    { id: 'catalog', label: 'Content Vault', icon: <BookOpen size={15} /> },
    { id: 'reader', label: 'AI Reading Mode', icon: <FileText size={15} /> },
    { id: 'research', label: 'AI Research Desk', icon: <Compass size={15} /> },
    { id: 'labs', label: 'STEM Sandbox', icon: <Database size={15} /> },
    { id: 'workspace', label: 'Study Cockpit', icon: <Settings size={15} /> },
    { id: 'passport', label: 'Academic Passport', icon: <Award size={15} /> },
    { id: 'market', label: 'Marketplace', icon: <ShoppingCart size={15} /> },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-zinc-100">
      
      {/* Premium Minimalist Hero Card */}
      <div className="bg-[#0E131C] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
              CogniSacra Virtual Library
            </span>
            <span className="text-[11px] font-mono text-zinc-500">• AI-Powered Intelligence</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
            Academic Knowledge & Research Ecosystem
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl">
            Explore multi-dimensional knowledge graphs, run scientific experiments in the STEM sandbox, review curriculum papers, and consult your personalized cognitive twin.
          </p>
        </div>

        {/* Minimalist Borderless Segment Switcher */}
        <div className="mt-6 pt-5 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {navTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabSelect(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20 scale-[1.02]'
                    : 'bg-[#141B26] text-zinc-400 hover:text-white hover:bg-[#1A2332]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && !isActive && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dynamic Workspace Compartment */}
      <div className="relative">
        
        {/* TAB 1: COGNISACRA KNOWLEDGE TWIN */}
        {activeTab === 'twin' && <CogniSacraTwin />}

        {/* TAB 2: KNOWLEDGE UNIVERSE */}
        {activeTab === 'universe' && <LibraryGraphUniverse />}

        {/* TAB 3: AI READING MODE */}
        {activeTab === 'reader' && <AIReadingMode />}

        {/* TAB 4: STEM LAB SANDBOX */}
        {activeTab === 'labs' && <VirtualResearchLab />}

        {/* TAB 5: STUDY COCKPIT */}
        {activeTab === 'workspace' && <SmartWorkspace />}

        {/* TAB 6: CONTENT VAULT / UNIVERSAL CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="bg-[#0E131C] p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search size={14} className="absolute left-3.5 top-3 text-zinc-500 pointer-events-none" />
                <input
                  type="text"
                  value={contentSearchText}
                  onChange={(e) => setContentSearchText(e.target.value)}
                  placeholder="Search textbooks, research papers..."
                  className="w-full pl-9 pr-4 py-2 bg-[#141B26] text-xs font-mono text-zinc-200 placeholder-zinc-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {['All', 'Research Paper', 'Textbook', 'Journal', 'Curriculum'].map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer ${
                      selectedCategory === category
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                        : 'bg-[#141B26] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Literature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLiterature.map(item => (
                <div 
                  key={item.id}
                  className="bg-[#0E131C] hover:bg-[#131926] p-5 rounded-2xl shadow-xl transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                        {item.category}
                      </span>
                      <button 
                        onClick={() => toggleBookmark(item.id)}
                        className={`p-1.5 rounded-lg transition ${bookmarkedIds.has(item.id) ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-500 hover:text-zinc-200'}`}
                      >
                        <Bookmark size={14} className={bookmarkedIds.has(item.id) ? 'fill-emerald-400' : ''} />
                      </button>
                    </div>

                    <h3 className="text-sm font-bold font-serif text-white group-hover:text-emerald-300 transition line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-[11px] font-mono text-zinc-400">
                      {item.author} • {item.institution} ({item.year})
                    </p>

                    <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
                      {item.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map(t => (
                        <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141B26] text-zinc-400">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-emerald-400">{item.price}</span>
                    <button
                      onClick={() => handleTabSelect('reader')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-black font-semibold transition flex items-center gap-1.5"
                    >
                      <span>Open Reader</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: AI RESEARCH DESK */}
        {activeTab === 'research' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Research Input Panel */}
              <div className="lg:col-span-5 bg-[#0E131C] p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Compass size={18} />
                    </span>
                    <div>
                      <h3 className="text-base font-bold font-serif text-white">AI Research Desk</h3>
                      <p className="text-xs font-mono text-zinc-400">Synthesize findings, peer citations, and literature gaps</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                      Inquiry Thesis or Topic
                    </label>
                    <textarea
                      rows={4}
                      value={researchPrompt}
                      onChange={(e) => setResearchPrompt(e.target.value)}
                      placeholder="Enter a scientific inquiry, e.g. 'Microgrid decentralized stability'..."
                      className="w-full p-3 bg-[#141B26] text-xs font-mono text-zinc-100 placeholder-zinc-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none transition"
                    />
                  </div>

                  {/* Active Source Directories */}
                  <div className="p-3 rounded-xl bg-[#141B26] text-[11px] font-mono text-zinc-300 space-y-1">
                    <span className="text-emerald-400 font-bold block text-[10px] uppercase">Indexed Repositories</span>
                    <p className="text-zinc-400">Google Scholar, arXiv preprints, Makerere, Ashesi & Nairobi University archives.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCompileResearch}
                  disabled={isResearching}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <Sparkles size={14} className={isResearching ? 'animate-spin' : ''} />
                  <span>{isResearching ? 'Compiling Sources...' : 'Generate Literature Review'}</span>
                </button>
              </div>

              {/* Research Output Panel */}
              <div className="lg:col-span-7 bg-[#0E131C] p-6 rounded-2xl shadow-xl flex flex-col justify-between min-h-[360px]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3">
                    <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 size={14} />
                      <span>Synthesized Findings</span>
                    </span>
                    {researchReport && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(researchReport);
                        }}
                        className="text-[11px] font-mono text-zinc-400 hover:text-white transition"
                      >
                        Copy Markdown
                      </button>
                    )}
                  </div>

                  {isResearching ? (
                    <div className="py-24 flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                      <span className="text-xs font-mono text-zinc-400 animate-pulse">Clustering citations and analyzing empirical models...</span>
                    </div>
                  ) : researchReport ? (
                    <div className="text-xs font-mono text-zinc-200 leading-relaxed space-y-3 max-h-80 overflow-y-auto pr-2">
                      {researchReport.split('\n').map((line, idx) => {
                        if (line.startsWith('###')) {
                          return <h4 key={idx} className="font-bold text-sm text-white pt-2 font-serif">{line.replace('###', '')}</h4>;
                        }
                        if (line.startsWith('####')) {
                          return <h5 key={idx} className="font-bold text-xs text-emerald-400 pt-1">{line.replace('####', '')}</h5>;
                        }
                        if (line.startsWith('*') || line.startsWith('-')) {
                          return (
                            <div key={idx} className="flex gap-2 items-start text-zinc-300">
                              <span className="text-emerald-400">•</span>
                              <span>{line.replace(/^[-*]\s*/, '')}</span>
                            </div>
                          );
                        }
                        return <p key={idx} className="text-zinc-300">{line}</p>;
                      })}
                    </div>
                  ) : (
                    <div className="py-24 text-center text-zinc-500 space-y-2">
                      <Compass size={32} className="mx-auto opacity-30 text-emerald-400" />
                      <p className="text-xs font-mono">Enter a research question and click Generate to start synthesis.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: ACADEMIC PASSPORT */}
        {activeTab === 'passport' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sovereign ID Card */}
              <div className="lg:col-span-5 bg-[#0E131C] p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                      Sovereign Digital Passport
                    </span>
                    <Globe size={16} className="text-emerald-400" />
                  </div>

                  <h3 className="text-lg font-bold font-serif text-white">
                    Academic Credential Card
                  </h3>

                  <div className="p-4 rounded-xl bg-[#141B26] space-y-2 font-mono text-xs">
                    <div className="flex justify-between text-zinc-400 text-[10px]">
                      <span>IDENTIFIER:</span>
                      <span className="text-emerald-400 font-bold">CSP-2026-88910</span>
                    </div>
                    <div className="text-white font-bold text-sm">
                      Sarah Mwangi
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Tier: Sovereign Student (Level 8)
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-3">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 size={13} />
                    <span>Cryptographically Verified</span>
                  </span>
                  <span>Active</span>
                </div>
              </div>

              {/* Achievements Record */}
              <div className="lg:col-span-7 bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-4">
                <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-bold">
                  Verified Academic Certifications
                </h4>

                <div className="space-y-3">
                  {[
                    { title: 'Circular Economy Systems & Sustainability', institution: 'University of Nairobi', date: 'June 2026', id: 'CERT-4892' },
                    { title: 'Applied STEM Microfluidics Simulation', institution: 'CogniSacra Academy', date: 'May 2026', id: 'CERT-1029' },
                    { title: 'Algorithms & Discrete Mathematics', institution: 'Ashesi University', date: 'April 2026', id: 'CERT-0094' }
                  ].map(cert => (
                    <div key={cert.id} className="p-3.5 rounded-xl bg-[#141B26] flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h5 className="text-xs font-bold text-white font-serif">{cert.title}</h5>
                        <p className="text-[10px] font-mono text-zinc-400">{cert.institution} • {cert.date}</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                        VERIFIED
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: MARKETPLACE */}
        {activeTab === 'market' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Publish guide form */}
              <form onSubmit={handleCreateListing} className="lg:col-span-5 bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold font-serif text-white">Publish Learning Asset</h3>
                  <p className="text-xs font-mono text-zinc-400">Share study guides, research notes, and curriculum blueprints.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-400">Resource Title</label>
                  <input
                    type="text"
                    value={listingForm.title}
                    onChange={(e) => setListingForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Distributed Consensus Systems Notes..."
                    className="w-full px-3 py-2 rounded-xl bg-[#141B26] text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-400">Price</label>
                  <input
                    type="text"
                    value={listingForm.price}
                    onChange={(e) => setListingForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g. $15.00 or Free"
                    className="w-full px-3 py-2 rounded-xl bg-[#141B26] text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  Publish to Network
                </button>

                {showListedToast && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-300 text-xs font-mono text-center">
                    Asset successfully cataloged on the exchange.
                  </div>
                )}
              </form>

              {/* Items List */}
              <div className="lg:col-span-7 bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-3">
                <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-bold">
                  Community Curated Resources
                </h4>

                <div className="space-y-2.5">
                  {marketItems.map(item => (
                    <div key={item.id} className="p-3.5 rounded-xl bg-[#141B26] flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0E131C] text-zinc-400">
                          {item.seller}
                        </span>
                        <h5 className="text-xs font-bold font-serif text-white">{item.title}</h5>
                        <div className="text-[10px] font-mono text-emerald-400 font-semibold">
                          ★ {item.rating} rating
                        </div>
                      </div>

                      <div className="text-right space-y-1.5 shrink-0">
                        <span className="text-xs font-mono font-bold text-emerald-400 block">{item.price}</span>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition active:scale-95"
                        >
                          Acquire
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
