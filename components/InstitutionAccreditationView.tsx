import React, { useState, useEffect } from 'react';
import { 
  Award, ShieldCheck, UserPlus, Users, Search, Copy, Check, ExternalLink, 
  RefreshCw, FileText, Download, Mail, Filter, CheckCircle2, AlertCircle,
  Building, GraduationCap, Sparkles, Terminal, KeyRound, QrCode, ArrowRight,
  Trash2, Eye
} from 'lucide-react';
import { FullInstitutionData } from '../types';
import { accreditationService, AccreditationRecord } from '../services/accreditationService';

interface InstitutionAccreditationViewProps {
  institutionData: FullInstitutionData;
  onSimulateAccess?: (role: 'learner' | 'instructor', memberName: string, institutionName: string) => void;
}

export const InstitutionAccreditationView: React.FC<InstitutionAccreditationViewProps> = ({
  institutionData,
  onSimulateAccess
}) => {
  const [records, setRecords] = useState<AccreditationRecord[]>([]);
  const [stats, setStats] = useState({ total: 0, learners: 0, instructors: 0, active: 0, redeemed: 0, revoked: 0 });
  const [activeTab, setActiveTab] = useState<'onboard' | 'roster' | 'templates'>('onboard');
  
  // Onboarding Form State
  const [targetRole, setTargetRole] = useState<'learner' | 'instructor'>('learner');
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [department, setDepartment] = useState('School of AI & Neural Computing');
  const [campusName, setCampusName] = useState('Main Campus (Nairobi)');
  const [program, setProgram] = useState('');
  const [studentOrStaffId, setStudentOrStaffId] = useState('');
  const [validMonths, setValidMonths] = useState(12);
  
  // UI States
  const [newlyGenerated, setNewlyGenerated] = useState<AccreditationRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [filterRole, setFilterRole] = useState<'all' | 'learner' | 'instructor'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'redeemed' | 'revoked'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPass, setSelectedPass] = useState<AccreditationRecord | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailSentNotice, setEmailSentNotice] = useState(false);

  // Load records and subscribe to live changes
  const refreshData = () => {
    const all = accreditationService.getAllRecords();
    setRecords(all);
    setStats(accreditationService.getStats());
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = accreditationService.subscribe(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, []);

  const handleCreateOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName || !memberEmail) return;

    const generated = accreditationService.generateAccreditation({
      memberName,
      memberEmail,
      targetRole,
      department,
      campusName,
      program: program || (targetRole === 'instructor' ? 'Faculty Lecturer & Researcher' : 'B.Sc AI & Neural Systems'),
      institutionId: 'inst-main',
      institutionName: institutionData.name || 'CogniSacra Sovereign University',
      institutionLogo: institutionData.branding.logoUrl,
      validMonths
    });

    setNewlyGenerated(generated);
    refreshData();

    // Reset form fields
    setMemberName('');
    setMemberEmail('');
    setProgram('');
    setStudentOrStaffId('');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCopyOnboardingLink = (code: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://cognisacra.edu';
    const link = `${origin}/?onboarding=true&code=${encodeURIComponent(code)}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleRevoke = (id: string) => {
    if (confirm('Are you sure you want to revoke this institutional accreditation pass?')) {
      accreditationService.revokeAccreditation(id);
      refreshData();
      if (selectedPass?.id === id) {
        setSelectedPass(null);
      }
    }
  };

  const filteredRecords = records.filter(r => {
    const matchesRole = filterRole === 'all' || r.targetRole === filterRole;
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      r.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.memberEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in text-zinc-100">
      
      {/* Top Banner / Header (Borderless & Minimalist) */}
      <div className="relative rounded-2xl bg-[#0E131C] p-6 lg:p-8 overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold">
              <ShieldCheck size={14} />
              <span>ACCREDITATION & ONBOARDING</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight font-serif">
              Accreditation Hub
            </h1>
            <p className="text-xs text-zinc-400 max-w-2xl font-sans">
              Issue and manage accreditation codes for students and lecturers to enable direct institutional onboarding.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('onboard')}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition ${
                activeTab === 'onboard' 
                  ? 'bg-emerald-500 text-black font-bold shadow-md' 
                  : 'bg-[#141B26] text-zinc-300 hover:text-white'
              }`}
            >
              <UserPlus size={14} />
              <span>Issue Code</span>
            </button>
            <button 
              onClick={() => setActiveTab('roster')}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition ${
                activeTab === 'roster' 
                  ? 'bg-emerald-500 text-black font-bold shadow-md' 
                  : 'bg-[#141B26] text-zinc-300 hover:text-white'
              }`}
            >
              <Users size={14} />
              <span>Roster ({stats.total})</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid (Borderless) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4">
          <div className="p-3.5 rounded-xl bg-[#141B26]">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Total Issued</span>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{stats.total}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#141B26]">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Students</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{stats.learners}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#141B26]">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Lecturers</span>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">{stats.instructors}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#141B26]">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Active Codes</span>
            <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">{stats.active}</div>
          </div>
        </div>
      </div>

      {/* NEWLY GENERATED ACCREDITATION PASS ALERT (when just onboarded) */}
      {newlyGenerated && (
        <div className="p-6 rounded-2xl bg-[#0E131C] shadow-2xl animate-fade-in relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 size={18} />
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Accreditation Code Successfully Generated & Issued
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-serif">
                  {newlyGenerated.memberName} ({newlyGenerated.targetRole === 'instructor' ? 'Lecturer' : 'Student'})
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  {newlyGenerated.department} • {newlyGenerated.campusName} • Valid until {newlyGenerated.expiresAt}
                </p>
              </div>

              {/* Code Highlight Box */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="px-4 py-2.5 rounded-xl bg-[#07090C] border border-emerald-500/40 text-emerald-300 font-mono text-lg font-bold tracking-widest shadow-inner flex items-center gap-2">
                  <KeyRound size={16} className="text-emerald-400" />
                  <span>{newlyGenerated.code}</span>
                </div>
                <button
                  onClick={() => handleCopyCode(newlyGenerated.code)}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95"
                >
                  {copiedCode === newlyGenerated.code ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedCode === newlyGenerated.code ? 'Copied!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={() => handleCopyOnboardingLink(newlyGenerated.code)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#141B26] hover:bg-[#1D2738] border border-[#243044] text-zinc-200 text-xs font-mono transition flex items-center gap-1.5"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-400" /> : <ExternalLink size={14} />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Self-Onboard Link'}</span>
                </button>
                <button
                  onClick={() => setSelectedPass(newlyGenerated)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#141B26] hover:bg-[#1D2738] border border-[#243044] text-zinc-200 text-xs font-mono transition flex items-center gap-1.5"
                >
                  <QrCode size={14} />
                  <span>View Full Pass</span>
                </button>
              </div>
            </div>

            {/* Quick Test Simulator Button */}
            {onSimulateAccess && (
              <div className="flex flex-col items-start md:items-end gap-2 border-t md:border-t-0 md:border-l border-emerald-500/20 pt-4 md:pt-0 md:pl-6 shrink-0">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Administrator Preview:</span>
                <button
                  onClick={() => onSimulateAccess(newlyGenerated.targetRole, newlyGenerated.memberName, newlyGenerated.institutionName)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold transition flex items-center gap-2"
                >
                  <span>Test Dashboard As This {newlyGenerated.targetRole === 'instructor' ? 'Lecturer' : 'Student'}</span>
                  <ArrowRight size={14} />
                </button>
                <span className="text-[10px] text-zinc-500 max-w-xs text-left md:text-right font-sans">
                  Instantly tests the exact view this user receives when entering this accreditation code.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      {activeTab === 'onboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: DIRECT ONBOARDING FORM (lg: 7 cols) */}
          <div className="lg:col-span-7 bg-[#0E131C] rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-2">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
                  <UserPlus size={18} className="text-emerald-400" />
                  <span>Issue Accreditation Code</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Select role and enter member information to generate an accreditation pass.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateOnboarding} className="space-y-4">
              
              {/* Role Toggle */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                  Member Role *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTargetRole('learner')}
                    className={`p-3.5 rounded-xl text-left transition flex items-center gap-3 ${
                      targetRole === 'learner'
                        ? 'bg-emerald-500/15 text-white shadow-md'
                        : 'bg-[#141B26] text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${targetRole === 'learner' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#1C2534] text-zinc-400'}`}>
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono">Student</div>
                      <div className="text-[10px] text-zinc-400 font-sans">Learner dashboard access</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetRole('instructor')}
                    className={`p-3.5 rounded-xl text-left transition flex items-center gap-3 ${
                      targetRole === 'instructor'
                        ? 'bg-cyan-500/15 text-white shadow-md'
                        : 'bg-[#141B26] text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${targetRole === 'instructor' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-[#1C2534] text-zinc-400'}`}>
                      <Award size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono">Lecturer</div>
                      <div className="text-[10px] text-zinc-400 font-sans">Faculty dashboard access</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                    {targetRole === 'instructor' ? 'Lecturer Full Name *' : 'Student Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={targetRole === 'instructor' ? 'e.g. Dr. Amina Touré' : 'e.g. Malik Adebayo'}
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B26] text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:bg-[#1A2332] transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                    Institutional Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. a.toure@cognisacra.edu"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B26] text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:bg-[#1A2332] transition"
                  />
                </div>
              </div>

              {/* Department & Campus */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                    Faculty / Department *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B26] text-xs font-mono text-zinc-100 focus:outline-none focus:bg-[#1A2332]"
                  >
                    <option value="School of AI & Neural Computing">School of AI & Neural Computing</option>
                    <option value="Department of Decentralized Agronomy">Department of Decentralized Agronomy</option>
                    <option value="Sustainable Microgrids & Renewable Engineering">Sustainable Microgrids & Renewable Engineering</option>
                    <option value="Biomedical Informatics & Genomics">Biomedical Informatics & Genomics</option>
                    <option value="Quantum Computing & Cryptographic Protocols">Quantum Computing & Cryptographic Protocols</option>
                    <option value="Digital Economics & Sovereign Law">Digital Economics & Sovereign Law</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                    Campus Satellite *
                  </label>
                  <select
                    value={campusName}
                    onChange={(e) => setCampusName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B26] text-xs font-mono text-zinc-100 focus:outline-none focus:bg-[#1A2332]"
                  >
                    <option value="Main Campus (Nairobi)">Main Campus (Nairobi)</option>
                    <option value="Cape Town Research Station">Cape Town Research Station</option>
                    <option value="Johannesburg Satellite">Johannesburg Satellite</option>
                    <option value="Durban Innovation Hub">Durban Innovation Hub</option>
                    <option value="Global Distributed Node (Online)">Global Distributed Node (Online)</option>
                  </select>
                </div>
              </div>

              {/* Program & ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                    Program / Track
                  </label>
                  <input
                    type="text"
                    placeholder={targetRole === 'instructor' ? 'e.g. Senior Faculty Lecturer' : 'e.g. B.Sc AI & Robotics'}
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B26] text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:bg-[#1A2332]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                    Student / Staff ID
                  </label>
                  <input
                    type="text"
                    placeholder={targetRole === 'instructor' ? 'e.g. FAC-2026-081' : 'e.g. STU-2026-442'}
                    value={studentOrStaffId}
                    onChange={(e) => setStudentOrStaffId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B26] text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:bg-[#1A2332]"
                  />
                </div>
              </div>

              {/* Validity duration */}
              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                  Validity Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '6 Months', months: 6 },
                    { label: '1 Year', months: 12 },
                    { label: '2 Years', months: 24 }
                  ].map(item => (
                    <button
                      key={item.months}
                      type="button"
                      onClick={() => setValidMonths(item.months)}
                      className={`py-2 px-3 rounded-xl text-xs font-mono text-center transition ${
                        validMonths === item.months
                          ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                          : 'bg-[#141B26] text-zinc-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Award size={16} />
                  <span>Generate Accreditation Pass</span>
                </button>
              </div>

            </form>
          </div>

          {/* RIGHT: HOW ACCREDITATION CODES WORK & DEMO PREVIEW (lg: 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Explanatory Protocol Card (Borderless) */}
            <div className="bg-[#0E131C] rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
                <Terminal size={14} />
                <span>HOW ACCREDITATION WORKS</span>
              </div>
              <h3 className="text-base font-bold text-white font-serif">
                Direct & Self-Onboarding
              </h3>
              
              <div className="space-y-3 text-xs text-zinc-300 font-sans leading-relaxed">
                <div className="p-3.5 rounded-xl bg-[#141B26] space-y-1">
                  <div className="font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">1</span>
                    Direct Generation
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Create passes directly above. The generated code can be sent via email or copied to the member.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141B26] space-y-1">
                  <div className="font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px]">2</span>
                    Instant Code Redemption
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Students and lecturers enter their code during signup to immediately unlock their dashboard.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141B26] space-y-1">
                  <div className="font-mono text-amber-400 font-semibold flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">3</span>
                    Open Platform Access
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Independent scholars and private educators can also join without an institutional code.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Demo Pre-Seeded Codes for Instant Testing (Borderless) */}
            <div className="bg-[#0E131C] rounded-2xl p-6 space-y-3 shadow-xl">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">Sample Accreditation Codes</span>
              <p className="text-xs text-zinc-400">
                Click any code below to copy it or test instant self-onboarding:
              </p>
              
              <div className="space-y-2">
                {[
                  { code: 'COG-STU-2026-9F4B', role: 'Student', name: 'Kofi Mensah', dept: 'AI & Neural Computing' },
                  { code: 'COG-LEC-2026-7A1C', role: 'Lecturer', name: 'Dr. Sarah Mwangi', dept: 'Decentralized Agronomy' },
                  { code: 'OXF-AI-2026-4412', role: 'Student', name: 'Amara Okafor', dept: 'Cognitive Robotics' },
                  { code: 'MIT-FAC-2026-1092', role: 'Lecturer', name: 'Prof. David Nkosi', dept: 'Distributed Systems' },
                ].map(demo => (
                  <div key={demo.code} className="p-2.5 rounded-xl bg-[#141B26] flex items-center justify-between text-xs font-mono">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">{demo.code}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#1C2534] text-zinc-300">{demo.role}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-sans">{demo.name} • {demo.dept}</div>
                    </div>
                    <button
                      onClick={() => handleCopyCode(demo.code)}
                      className="px-2.5 py-1 rounded-lg bg-[#1C2534] hover:bg-[#243044] text-zinc-300 text-[11px] transition flex items-center gap-1"
                    >
                      {copiedCode === demo.code ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedCode === demo.code ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ROSTER TAB (Borderless) */}
      {activeTab === 'roster' && (
        <div className="bg-[#0E131C] rounded-2xl p-6 space-y-6 shadow-xl">
          
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute left-3 top-3 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by student, lecturer, code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#141B26] text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:bg-[#1A2332]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Role filter */}
              <div className="flex rounded-xl bg-[#141B26] p-1 text-xs font-mono">
                {(['all', 'learner', 'instructor'] as const).map(rf => (
                  <button
                    key={rf}
                    onClick={() => setFilterRole(rf)}
                    className={`px-3 py-1 rounded-lg transition capitalize ${
                      filterRole === rf ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {rf === 'all' ? 'All Roles' : rf === 'learner' ? 'Students' : 'Lecturers'}
                  </button>
                ))}
              </div>

              {/* Status filter */}
              <div className="flex rounded-xl bg-[#141B26] p-1 text-xs font-mono">
                {(['all', 'active', 'redeemed', 'revoked'] as const).map(sf => (
                  <button
                    key={sf}
                    onClick={() => setFilterStatus(sf)}
                    className={`px-3 py-1 rounded-lg transition capitalize ${
                      filterStatus === sf ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {sf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-[#141B26] rounded-xl">
                  <th className="py-3 px-4 rounded-l-xl">Member</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Accreditation Code</th>
                  <th className="py-3 px-4">Department & Campus</th>
                  <th className="py-3 px-4">Expires</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs font-mono">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-zinc-500 font-sans">
                      No accreditation records match your current filters.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map(rec => (
                    <tr key={rec.id} className="hover:bg-[#0E131C] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{rec.memberName}</div>
                        <div className="text-[10px] text-zinc-400 font-sans">{rec.memberEmail}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          rec.targetRole === 'instructor' 
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {rec.targetRole === 'instructor' ? 'Lecturer' : 'Student'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-400 tracking-wider">
                        {rec.code}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-zinc-200">{rec.department}</div>
                        <div className="text-[10px] text-zinc-500">{rec.campusName}</div>
                      </td>
                      <td className="py-3 px-4 text-zinc-400">
                        {rec.expiresAt}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                          rec.status === 'active' 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                            : rec.status === 'redeemed'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}>
                          {rec.status === 'active' ? 'Active (Pending)' : rec.status === 'redeemed' ? 'Redeemed' : 'Revoked'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopyCode(rec.code)}
                            title="Copy Code"
                            className="p-1.5 rounded-lg bg-[#141B26] hover:bg-[#1D2738] text-zinc-300 hover:text-white transition"
                          >
                            {copiedCode === rec.code ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                          </button>
                          <button
                            onClick={() => setSelectedPass(rec)}
                            title="View Accreditation Pass"
                            className="p-1.5 rounded-lg bg-[#141B26] hover:bg-[#1D2738] text-zinc-300 hover:text-white transition"
                          >
                            <Eye size={13} />
                          </button>
                          {rec.status === 'active' && (
                            <button
                              onClick={() => handleRevoke(rec.id)}
                              title="Revoke Clearance"
                              className="p-1.5 rounded-lg bg-[#141B26] hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* MODAL: FULL INSTITUTIONAL ACCREDITATION PASS (Borderless) */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl bg-[#0E131C] rounded-2xl overflow-hidden shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="p-4 bg-[#141B26] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Accreditation Pass
                </span>
              </div>
              <button 
                onClick={() => setSelectedPass(null)}
                className="text-zinc-400 hover:text-white text-xs font-mono px-2 py-1 rounded hover:bg-white/10"
              >
                Close ✕
              </button>
            </div>

            {/* Pass Body */}
            <div className="p-8 space-y-6 relative overflow-hidden bg-[#0E131C]">
              
              {/* Institution Crest Header */}
              <div className="flex items-center justify-between pb-4">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                    ACCREDITED CREDENTIAL
                  </div>
                  <h3 className="text-xl font-bold font-serif text-white tracking-tight">
                    {selectedPass.institutionName}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    {selectedPass.campusName} • {selectedPass.department}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Award size={28} />
                </div>
              </div>

              {/* Member Details */}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase block">Member</span>
                  <span className="text-sm font-bold text-white font-sans">{selectedPass.memberName}</span>
                  <div className="text-[11px] text-zinc-400">{selectedPass.memberEmail}</div>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-400 uppercase block">Status</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mt-1 ${
                    selectedPass.targetRole === 'instructor'
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {selectedPass.targetRole === 'instructor' ? 'Lecturer / Faculty' : 'Student (Learner)'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-400 uppercase block">Program</span>
                  <span className="text-zinc-200">{selectedPass.program}</span>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-400 uppercase block">Valid Through</span>
                  <span className="text-zinc-200">{selectedPass.expiresAt}</span>
                </div>
              </div>

              {/* Official Code Card */}
              <div className="p-4 rounded-2xl bg-[#141B26] text-center space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  Accreditation Code
                </span>
                <div className="text-2xl font-bold font-mono tracking-widest text-emerald-300">
                  {selectedPass.code}
                </div>
                <div className="text-[9px] font-mono text-zinc-500 truncate">
                  Hash: {selectedPass.accreditationHash}
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => handleCopyCode(selectedPass.code)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition flex items-center justify-center gap-2"
                >
                  <Copy size={14} />
                  <span>{copiedCode === selectedPass.code ? 'Copied!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={() => handleCopyOnboardingLink(selectedPass.code)}
                  className="flex-1 py-2.5 rounded-xl bg-[#141B26] hover:bg-[#1D2738] text-zinc-200 text-xs font-mono transition flex items-center justify-center gap-2"
                >
                  <ExternalLink size={14} />
                  <span>Copy Onboard Link</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
