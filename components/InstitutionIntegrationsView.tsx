import React, { useState } from 'react';
import { 
    Plug, Shield, Key, CheckCircle2, Lock, Globe, Server, 
    Database, Cpu, RefreshCw, Sliders, ExternalLink, Copy, 
    Check, Zap, AlertTriangle, Layers, BookOpen, Building2, Terminal
} from 'lucide-react';

interface EnterpriseIntegration {
    id: string;
    name: string;
    category: 'sso' | 'sis' | 'integrity' | 'cloud' | 'lti' | 'ledger';
    icon: string;
    provider: string;
    description: string;
    status: 'connected' | 'syncing' | 'pending_handshake' | 'unconfigured';
    connected: boolean;
    syncFrequency: string;
    protocol: string;
    scopes: string[];
}

export const InstitutionIntegrationsView: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedApp, setSelectedApp] = useState<EnterpriseIntegration | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [apiKeyCopied, setApiKeyCopied] = useState(false);
    const [isPingingEndpoints, setIsPingingEndpoints] = useState(false);

    const [integrations, setIntegrations] = useState<EnterpriseIntegration[]>([
        {
            id: 'okta-sso',
            name: 'Okta Enterprise SAML 2.0 & OIDC',
            category: 'sso',
            provider: 'Identity Access Management',
            icon: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=80&q=80',
            description: 'Enforce university-wide single sign-on with multi-factor authentication, campus role provisioning, and automated de-provisioning on graduation.',
            status: 'connected',
            connected: true,
            syncFrequency: 'Real-time JIT Provisioning',
            protocol: 'SAML 2.0 / OpenID Connect',
            scopes: ['openid', 'profile', 'email', 'groups:campus_faculty', 'groups:matriculated_students']
        },
        {
            id: 'banner-sis',
            name: 'Ellucian Banner Student Information System',
            category: 'sis',
            provider: 'Registrar & SIS Infrastructure',
            icon: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=80&q=80',
            description: 'Bidirectional sync for semester enrollments, student financial clearance, GPA passback, and graduation conferral audits.',
            status: 'connected',
            connected: true,
            syncFrequency: 'Every 15 minutes',
            protocol: 'Ellucian Ethos API / REST JSON',
            scopes: ['students:read', 'courses:read', 'registrations:sync', 'academic-records:write']
        },
        {
            id: 'azure-ad',
            name: 'Microsoft Entra ID (Azure AD)',
            category: 'sso',
            provider: 'Identity & Compliance',
            icon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&q=80',
            description: 'Tenant federated authentication matching institutional Office 365 student licensing and campus email routing.',
            status: 'connected',
            connected: true,
            syncFrequency: 'Real-time token exchange',
            protocol: 'OAuth 2.0 / MS Graph API',
            scopes: ['User.Read', 'GroupMember.Read.All']
        },
        {
            id: 'turnitin',
            name: 'Turnitin Originality & AI Integrity Suite',
            category: 'integrity',
            provider: 'Academic Integrity',
            icon: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=80&q=80',
            description: 'Automated plagiarism scans, AI writing probability telemetry, and peer-review citations verification for research papers and final projects.',
            status: 'connected',
            connected: true,
            syncFrequency: 'Event-driven on submission',
            protocol: 'Turnitin Core API v2',
            scopes: ['submissions:scan', 'similarity-reports:read', 'ai-telemetry:evaluate']
        },
        {
            id: 'canvas-lti',
            name: 'Canvas & Moodle LTI 1.3 Advantage',
            category: 'lti',
            provider: 'LMS Interoperability',
            icon: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=80&q=80',
            description: 'IMS Global certified LTI 1.3 deep linking, assignment and grade services (AGS), and names/role provisioning services (NRPS).',
            status: 'connected',
            connected: true,
            syncFrequency: 'Continuous bidirectional',
            protocol: '1EdTech LTI 1.3 Core',
            scopes: ['ags:lineitem', 'ags:result:read', 'nrps:membership:read']
        },
        {
            id: 'aws-cloud-labs',
            name: 'AWS Cloud Simulation Compute Sandbox',
            category: 'cloud',
            provider: 'High-Performance Computing',
            icon: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=80&q=80',
            description: 'Dedicated GPU compute clusters for student engineering simulations, automated container spin-up, and budget quota controls.',
            status: 'connected',
            connected: true,
            syncFrequency: 'On-demand ephemeral cluster',
            protocol: 'AWS IAM Role Delegation',
            scopes: ['ec2:RunInstances', 'ecs:TaskExecution', 'budgets:ViewQuota']
        },
        {
            id: 'w3c-ledger',
            name: 'W3C Sovereign Verifiable Credentials Ledger',
            category: 'ledger',
            provider: 'Cryptographic Accreditation',
            icon: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=80&q=80',
            description: 'Anchor accredited degree certificates and semester micro-credentials to tamper-proof institutional decentralized identifiers (DIDs).',
            status: 'connected',
            connected: true,
            syncFrequency: 'Instant batch anchoring',
            protocol: 'DID:ION / W3C VC 1.1',
            scopes: ['credentials:issue', 'proof:verify', 'revocation-list:write']
        },
        {
            id: 'workday-sis',
            name: 'Workday Student Cloud',
            category: 'sis',
            provider: 'Enterprise Higher Ed ERP',
            icon: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=80&q=80',
            description: 'Next-generation campus operations sync for institutional faculty workloads, curriculum approvals, and financial aid compliance.',
            status: 'unconfigured',
            connected: false,
            syncFrequency: 'Scheduled hourly batch',
            protocol: 'Workday REST API / WSDL',
            scopes: ['Academic_Foundation', 'Student_Records', 'Financial_Aid']
        }
    ]);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const copyInstitutionKey = () => {
        navigator.clipboard.writeText('cognisacra_inst_live_884192047101824ab719c');
        setApiKeyCopied(true);
        showToast('Institution Master API Key copied to clipboard');
        setTimeout(() => setApiKeyCopied(false), 2000);
    };

    const handlePingEndpoints = () => {
        setIsPingingEndpoints(true);
        setTimeout(() => {
            setIsPingingEndpoints(false);
            showToast('✅ All 7 Institutional Gateway Endpoints Healthy (Avg Response: 42ms)');
        }, 1400);
    };

    const toggleConnect = (app: EnterpriseIntegration) => {
        setIntegrations(prev => prev.map(a => {
            if (a.id === app.id) {
                const nextConnected = !a.connected;
                return {
                    ...a,
                    connected: nextConnected,
                    status: nextConnected ? 'connected' : 'unconfigured'
                };
            }
            return a;
        }));
        showToast(app.connected ? `Revoked connection for ${app.name}` : `Successfully authorized ${app.name}`);
        if (selectedApp && selectedApp.id === app.id) {
            setSelectedApp(prev => prev ? { ...prev, connected: !prev.connected, status: !prev.connected ? 'connected' : 'unconfigured' } : null);
        }
    };

    const filtered = integrations.filter(app => {
        const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
        const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              app.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="w-full animate-fade-in space-y-6 text-left pb-16">
            
            {/* Dynamic Toast Feedback */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#141B26] text-emerald-400 font-mono text-xs shadow-2xl flex items-center gap-2 border border-emerald-500/30 animate-fade-in">
                    <CheckCircle2 size={15} />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Header Banner */}
            <div className="bg-[#0E131C] p-6 sm:p-7 rounded-2xl shadow-xl border border-[#1E2536] space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                                Enterprise Campus Architecture
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight flex items-center gap-2.5">
                            <Building2 className="text-emerald-400 w-7 h-7" />
                            <span>Institution Integrations Hub</span>
                        </h1>
                        <p className="text-xs sm:text-sm font-sans text-zinc-300 max-w-2xl leading-relaxed">
                            Federate your university campus infrastructure with enterprise SAML SSO, SIS automated roster sync, Turnitin originality scans, and W3C tamper-proof credential anchors.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 font-mono">
                        <button
                            onClick={handlePingEndpoints}
                            disabled={isPingingEndpoints}
                            className="px-3.5 py-2 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-zinc-200 text-xs font-semibold transition flex items-center gap-2 border border-zinc-800 cursor-pointer disabled:opacity-50"
                        >
                            <Server size={14} className={isPingingEndpoints ? 'animate-spin text-amber-400' : 'text-emerald-400'} />
                            <span>{isPingingEndpoints ? 'Auditing Nodes...' : 'Health Audit'}</span>
                        </button>
                        <button
                            onClick={copyInstitutionKey}
                            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                        >
                            <Key size={14} />
                            <span>{apiKeyCopied ? 'Copied Master Token!' : 'Master Campus Token'}</span>
                        </button>
                    </div>
                </div>

                {/* Telemetry Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-zinc-800/60 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-[#141B26]">
                        <span className="text-[10px] text-zinc-400 uppercase block">Active Gateways</span>
                        <span className="text-lg font-bold text-emerald-400">{integrations.filter(i => i.connected).length} / {integrations.length} Active</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#141B26]">
                        <span className="text-[10px] text-zinc-400 uppercase block">SIS Synchronization</span>
                        <span className="text-lg font-bold text-white">4,280 Students Synced</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#141B26]">
                        <span className="text-[10px] text-zinc-400 uppercase block">SAML Authentication</span>
                        <span className="text-lg font-bold text-emerald-400">100% MFA Enforced</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#141B26]">
                        <span className="text-[10px] text-zinc-400 uppercase block">Compliance Protocol</span>
                        <span className="text-lg font-bold text-white">FERPA / GDPR Tier 1</span>
                    </div>
                </div>
            </div>

            {/* Filter toolbar */}
            <div className="p-4 bg-[#0E131C] rounded-2xl shadow-xl border border-[#1E2536] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-mono text-xs">
                    {[
                        { id: 'all', label: 'All Enterprise Connectors' },
                        { id: 'sso', label: 'SSO & Identity' },
                        { id: 'sis', label: 'SIS / ERP Roster' },
                        { id: 'integrity', label: 'Integrity & Turnitin' },
                        { id: 'lti', label: 'LTI 1.3 / LMS' },
                        { id: 'cloud', label: 'Cloud Compute' },
                        { id: 'ledger', label: 'W3C Ledger' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedCategory(tab.id)}
                            className={`px-3 py-1.5 rounded-xl transition cursor-pointer font-semibold shrink-0 ${
                                selectedCategory === tab.id
                                    ? 'bg-emerald-500 text-black'
                                    : 'bg-[#141B26] text-zinc-400 hover:text-white'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="w-full sm:w-64">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter campus tools..."
                        className="w-full px-3 py-2 bg-[#141B26] text-xs font-mono text-zinc-200 placeholder-zinc-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                </div>
            </div>

            {/* Integrations Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(app => (
                    <div 
                        key={app.id} 
                        className={`p-5 rounded-2xl bg-[#0E131C] border transition-all duration-200 flex flex-col justify-between space-y-4 shadow-xl ${
                            app.connected ? 'border-emerald-500/30 ring-1 ring-emerald-500/10' : 'border-[#1E2536] hover:border-zinc-700'
                        }`}
                    >
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={app.icon} 
                                        alt={app.name} 
                                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10" 
                                    />
                                    <div>
                                        <h3 className="text-sm font-bold font-serif text-white">{app.name}</h3>
                                        <span className="text-[10px] font-mono text-zinc-400 block">
                                            {app.provider}
                                        </span>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                                    app.connected 
                                        ? 'bg-emerald-500/15 text-emerald-400' 
                                        : 'bg-zinc-800 text-zinc-500'
                                }`}>
                                    {app.connected ? 'Active' : 'Unlinked'}
                                </span>
                            </div>

                            <p className="text-xs font-sans text-zinc-300 leading-relaxed">
                                {app.description}
                            </p>

                            <div className="p-2.5 rounded-xl bg-[#141B26] space-y-1 font-mono text-[10px]">
                                <div className="flex justify-between text-zinc-400">
                                    <span>Protocol:</span>
                                    <span className="text-zinc-200 font-semibold">{app.protocol}</span>
                                </div>
                                <div className="flex justify-between text-zinc-400">
                                    <span>Sync Schedule:</span>
                                    <span className="text-emerald-400 font-semibold">{app.syncFrequency}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2.5 pt-2 border-t border-zinc-800/40">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSelectedApp(app)}
                                    className="flex-1 py-2 px-3 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-xs font-mono font-semibold text-zinc-300 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <Sliders size={13} />
                                    <span>Scopes & Keys</span>
                                </button>
                                <button
                                    onClick={() => toggleConnect(app)}
                                    className={`py-2 px-3.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                                        app.connected 
                                            ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400' 
                                            : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md'
                                    }`}
                                >
                                    {app.connected ? 'Disconnect' : 'Connect'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Drawer: Scopes & Settings */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#0E131C] border border-[#1E2536] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-left">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <img src={selectedApp.icon} alt={selectedApp.name} className="w-12 h-12 rounded-xl object-cover" />
                                <div>
                                    <h2 className="text-base font-bold font-serif text-white">{selectedApp.name}</h2>
                                    <p className="text-xs font-mono text-zinc-400">{selectedApp.protocol}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="p-1 rounded-lg text-zinc-500 hover:text-white transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-3 font-mono text-xs">
                            <div className="space-y-1">
                                <label className="text-zinc-400 text-[10px] uppercase font-bold">Authorized API Scopes</label>
                                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#141B26] border border-zinc-800">
                                    {selectedApp.scopes.map((s, idx) => (
                                        <span key={idx} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-zinc-400 text-[10px] uppercase font-bold">Federation Metadata Endpoint</label>
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={`https://auth.cognisacra.edu/federation/saml2/${selectedApp.id}/metadata.xml`}
                                    className="w-full px-3 py-2 rounded-xl bg-[#141B26] border border-zinc-800 text-[11px] text-zinc-300"
                                />
                            </div>

                            <div className="p-3 rounded-xl bg-[#141B26] border border-zinc-800 space-y-1">
                                <div className="text-[10px] text-zinc-400 uppercase font-bold">Audit Telemetry</div>
                                <div className="text-zinc-300 text-[11px] flex items-center justify-between">
                                    <span>Last Sync Timestamp:</span>
                                    <span className="text-emerald-400 font-semibold">{new Date().toLocaleTimeString()} Today</span>
                                </div>
                                <div className="text-zinc-300 text-[11px] flex items-center justify-between">
                                    <span>Payload Encryption:</span>
                                    <span className="text-zinc-200">TLS 1.3 / AES-256-GCM</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <button
                                onClick={() => toggleConnect(selectedApp)}
                                className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition cursor-pointer ${
                                    selectedApp.connected ? 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/20' : 'text-emerald-400 bg-emerald-500/10'
                                }`}
                            >
                                {selectedApp.connected ? 'Revoke Integration' : 'Activate Connector'}
                            </button>

                            <button
                                onClick={() => {
                                    showToast(`Saved settings for ${selectedApp.name}`);
                                    setSelectedApp(null);
                                }}
                                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition shadow-lg cursor-pointer"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default InstitutionIntegrationsView;
