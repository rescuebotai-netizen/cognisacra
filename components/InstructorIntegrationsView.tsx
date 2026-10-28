import React, { useState } from 'react';
import { 
    Plug, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, 
    Video, MessageSquare, Code2, Globe, Shield, Key, Sparkles, 
    Sliders, Zap, Webhook, Copy, Check, ChevronRight, Lock, CheckCircle
} from 'lucide-react';
import { 
    PayPalSvg, ZoomSvg, DiscordSvg, ZapierSvg, 
    GoogleCalendarSvg, CanvaSvg, StripeSvg, MoodleSvg, GoogleClassroomSvg 
} from './icons/IntegrationSvgs';

interface IntegrationApp {
    id: string;
    name: string;
    category: 'video' | 'lms' | 'code' | 'community' | 'payments' | 'automation';
    icon: string;
    description: string;
    connected: boolean;
    status: 'operational' | 'syncing' | 'needs_auth' | 'disconnected';
    lastSync?: string;
    configFields?: { label: string; placeholder: string; type: string; value: string }[];
}

export const renderAppIcon = (id: string, name: string, fallbackImg: string, className = "w-11 h-11 rounded-xl object-cover ring-1 ring-white/10") => {
    switch (id) {
        case 'zoom':
            return <div className="w-11 h-11 rounded-xl bg-[#2196f3]/10 border border-[#2196f3]/30 flex items-center justify-center p-1.5 shrink-0"><ZoomSvg className="w-8 h-8" /></div>;
        case 'canva':
        case 'canvas':
            return <div className="w-11 h-11 rounded-xl bg-[#00C4CC]/10 border border-[#00C4CC]/30 flex items-center justify-center p-1.5 shrink-0"><CanvaSvg className="w-8 h-8" /></div>;
        case 'discord':
            return <div className="w-11 h-11 rounded-xl bg-[#5865f2]/10 border border-[#5865f2]/30 flex items-center justify-center p-1.5 shrink-0"><DiscordSvg className="w-8 h-8" /></div>;
        case 'google-calendar':
        case 'google-meet':
            return <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center p-1.5 shrink-0"><GoogleCalendarSvg className="w-8 h-8" /></div>;
        case 'google-classroom':
        case 'classroom':
            return <div className="w-11 h-11 rounded-xl bg-[#0f9d58]/10 border border-[#0f9d58]/30 flex items-center justify-center p-1.5 shrink-0"><GoogleClassroomSvg className="w-8 h-8" /></div>;
        case 'stripe':
            return <div className="w-11 h-11 rounded-xl bg-[#635BFF]/10 border border-[#635BFF]/30 flex items-center justify-center p-1.5 shrink-0"><StripeSvg className="w-8 h-8" /></div>;
        case 'zapier':
            return <div className="w-11 h-11 rounded-xl bg-[#ff4f00]/10 border border-[#ff4f00]/30 flex items-center justify-center p-1.5 shrink-0"><ZapierSvg className="w-8 h-8" /></div>;
        case 'moodle':
            return <div className="w-11 h-11 rounded-xl bg-[#F98012]/10 border border-[#F98012]/30 flex items-center justify-center p-1.5 shrink-0"><MoodleSvg className="w-8 h-8" /></div>;
        case 'paypal':
            return <div className="w-11 h-11 rounded-xl bg-[#27346a]/20 border border-[#2790c3]/30 flex items-center justify-center p-1.5 shrink-0"><PayPalSvg className="w-8 h-8" /></div>;
        default:
            return <img src={fallbackImg} alt={name} className={className} />;
    }
};

export const InstructorIntegrationsView: React.FC = () => {
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedApp, setSelectedApp] = useState<IntegrationApp | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isTestingWebhook, setIsTestingWebhook] = useState(false);
    const [copiedKey, setCopiedKey] = useState(false);

    const [integrations, setIntegrations] = useState<IntegrationApp[]>([
        {
            id: 'zoom',
            name: 'Zoom Video Communications',
            category: 'video',
            icon: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=80&q=80',
            description: 'Automate live classroom meeting link generation, student attendance tracking, and cloud recordings sync.',
            connected: true,
            status: 'operational',
            lastSync: '12 mins ago',
            configFields: [
                { label: 'API Key', placeholder: 'zm_live_••••••••••••', type: 'password', value: 'zm_live_992147101824' },
                { label: 'Personal Meeting ID (PMI)', placeholder: '891-204-1192', type: 'text', value: '891-204-1192' }
            ]
        },
        {
            id: 'canva',
            name: 'Canva',
            category: 'lms',
            icon: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=80&q=80',
            description: 'Design dynamic course presentations, visual infographics, and creative student templates directly in Canva.',
            connected: true,
            status: 'operational',
            lastSync: '1 hour ago',
            configFields: [
                { label: 'Canva Connect Client ID', placeholder: 'canva_live_1000000000001', type: 'text', value: 'canva_live_1000000000001' },
                { label: 'Team Asset Workspace ID', placeholder: 'dep_cognisacra_creatives', type: 'text', value: 'dep_cognisacra_creatives' }
            ]
        },
        {
            id: 'google-classroom',
            name: 'Google Classroom',
            category: 'lms',
            icon: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=80&q=80',
            description: 'Synchronize course rosters, distribute digital coursework, sync grades, and publish classroom assignments.',
            connected: true,
            status: 'operational',
            lastSync: 'Just now',
            configFields: [
                { label: 'Google Workspace Domain', placeholder: 'classroom.google.com / school.edu', type: 'text', value: 'faculty.cognisacra.edu' },
                { label: 'Classroom Course ID', placeholder: 'c_live_••••••••', type: 'text', value: 'c_live_94827104' },
                { label: 'OAuth Client Authorization', placeholder: 'Auto-linked via Google SSO', type: 'text', value: 'oauth2_verified_active' }
            ]
        },
        {
            id: 'discord',
            name: 'Discord Student Guild',
            category: 'community',
            icon: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=80&q=80',
            description: 'Synchronize course roles, trigger office hours announcements, and grant private study circle channels.',
            connected: false,
            status: 'disconnected',
            configFields: [
                { label: 'Server ID (Guild ID)', placeholder: '119283746592817263', type: 'text', value: '' },
                { label: 'Bot Token', placeholder: 'Bot MTM2••••••••••••', type: 'password', value: '' }
            ]
        },
        {
            id: 'google-calendar',
            name: 'Google Calendar',
            category: 'video',
            icon: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=80&q=80',
            description: 'Schedule synchronous mentoring sessions, office hours, and sync calendar invites directly to student Google Workspace.',
            connected: true,
            status: 'operational',
            lastSync: '3 hours ago',
            configFields: [
                { label: 'Connected Workspace Account', placeholder: 'faculty@university.edu', type: 'text', value: 'prof.alfara@cognisacra.edu' }
            ]
        },
        {
            id: 'stripe',
            name: 'Stripe Connect Express',
            category: 'payments',
            icon: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=80&q=80',
            description: 'Direct sovereign payout processing, multi-currency course sales, and automated tax withholding calculations.',
            connected: true,
            status: 'operational',
            lastSync: 'Real-time',
            configFields: [
                { label: 'Connected Account ID', placeholder: 'acct_••••••••••••', type: 'text', value: 'acct_1NZQ82Kj918Sa' },
                { label: 'Payout Currency', placeholder: 'USD / KES / EUR', type: 'text', value: 'USD ($)' }
            ]
        },
        {
            id: 'paypal',
            name: 'PayPal Account',
            category: 'payments',
            icon: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=80&q=80',
            description: 'Direct student payment collection, instant payout deposits, and cross-border digital wallet transactions.',
            connected: true,
            status: 'operational',
            lastSync: 'Real-time Instant IPN',
            configFields: [
                { label: 'PayPal Business Email', placeholder: 'payments@cognisacra.edu', type: 'email', value: 'faculty.payouts@cognisacra.edu' },
                { label: 'Merchant Client ID', placeholder: 'client_live_••••••••', type: 'password', value: 'client_live_99410182' }
            ]
        },
        {
            id: 'zapier',
            name: 'Zapier & Webhooks Engine',
            category: 'automation',
            icon: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=80&q=80',
            description: 'Trigger 5,000+ app workflows when a student enrolls, passes an exam, or completes an accreditation milestone.',
            connected: true,
            status: 'operational',
            lastSync: 'Real-time webhook queue',
            configFields: [
                { label: 'Webhook Endpoint URL', placeholder: 'https://hooks.zapier.com/hooks/catch/...', type: 'text', value: 'https://hooks.zapier.com/hooks/catch/918274/cognisacra-live' },
                { label: 'Signing Key', placeholder: 'sig_••••••••••••', type: 'password', value: 'sig_a8f9c101824e883' }
            ]
        },
        {
            id: 'moodle',
            name: 'Moodle Academic Hub',
            category: 'lms',
            icon: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=80&q=80',
            description: 'SCORM package generation and bidirectional syllabus competency exchange.',
            connected: false,
            status: 'needs_auth',
            configFields: [
                { label: 'Moodle URL', placeholder: 'https://moodle.institution.edu', type: 'text', value: '' },
                { label: 'Web Services Token', placeholder: 'wstoken_••••••••', type: 'password', value: '' }
            ]
        }
    ]);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const toggleConnect = (app: IntegrationApp) => {
        setIntegrations(prev => prev.map(a => {
            if (a.id === app.id) {
                const nextConnected = !a.connected;
                return {
                    ...a,
                    connected: nextConnected,
                    status: nextConnected ? 'operational' : 'disconnected',
                    lastSync: nextConnected ? 'Just connected' : undefined
                };
            }
            return a;
        }));
        showToast(app.connected ? `Disconnected ${app.name}` : `Successfully connected ${app.name}`);
        if (selectedApp && selectedApp.id === app.id) {
            setSelectedApp(prev => prev ? { ...prev, connected: !prev.connected, status: !prev.connected ? 'operational' : 'disconnected' } : null);
        }
    };

    const handleTestWebhook = () => {
        setIsTestingWebhook(true);
        setTimeout(() => {
            setIsTestingWebhook(false);
            showToast('✅ Test payload dispatched successfully (HTTP 200 OK)');
        }, 1200);
    };

    const copyApiKey = () => {
        navigator.clipboard.writeText('cognisacra_live_sec_994827101824a7bc9102');
        setCopiedKey(true);
        showToast('Faculty API key copied to clipboard');
        setTimeout(() => setCopiedKey(false), 2000);
    };

    const filtered = integrations.filter(app => {
        const matchesCategory = filterCategory === 'all' || app.category === filterCategory;
        const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              app.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="w-full animate-fade-in space-y-6 text-left pb-16">
            
            {/* Dynamic Toast */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#141B26] text-emerald-400 font-mono text-xs shadow-2xl flex items-center gap-2 border border-emerald-500/30 animate-fade-in">
                    <CheckCircle2 size={15} />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Header Hero Banner */}
            <div className="bg-[#0E131C] p-6 sm:p-7 rounded-2xl shadow-xl border border-[#1E2536] space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                                Modern Faculty Ecosystem v3.2
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight flex items-center gap-2.5">
                            <Plug className="text-emerald-400 w-7 h-7" />
                            <span>Instructor Integrations Hub</span>
                        </h1>
                        <p className="text-xs sm:text-sm font-sans text-zinc-300 max-w-2xl leading-relaxed">
                            Connect your live video studio, external LMS gradebooks, GitHub repositories, and automated webhooks to synchronize your course workflows in real time.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 font-mono">
                        <button
                            onClick={handleTestWebhook}
                            disabled={isTestingWebhook}
                            className="px-3.5 py-2 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-zinc-200 text-xs font-semibold transition flex items-center gap-2 border border-zinc-800 cursor-pointer disabled:opacity-50"
                        >
                            <Zap size={14} className={isTestingWebhook ? 'animate-bounce text-amber-400' : 'text-emerald-400'} />
                            <span>{isTestingWebhook ? 'Sending Payload...' : 'Test Webhooks'}</span>
                        </button>
                        <button
                            onClick={copyApiKey}
                            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                        >
                            <Key size={14} />
                            <span>{copiedKey ? 'Copied Key!' : 'Faculty API Key'}</span>
                        </button>
                    </div>
                </div>

                {/* Status KPI Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-zinc-800/60 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-[#141B26]">
                        <span className="text-[10px] text-zinc-400 uppercase block">Active Pipelines</span>
                        <span className="text-lg font-bold text-emerald-400">{integrations.filter(i => i.connected).length} Connected</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#141B26]">
                        <span className="text-[10px] text-zinc-400 uppercase block">Sync Telemetry</span>
                        <span className="text-lg font-bold text-white">99.98% Latency &lt; 80ms</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#141B26]">
                        <span className="text-[10px] text-zinc-400 uppercase block">Daily Events</span>
                        <span className="text-lg font-bold text-white">1,842 Webhook Dispatches</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#141B26]">
                        <span className="text-[10px] text-zinc-400 uppercase block">Security Protocol</span>
                        <span className="text-lg font-bold text-emerald-400">HMAC-SHA256 Signed</span>
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 bg-[#0E131C] rounded-2xl shadow-xl border border-[#1E2536] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-mono text-xs">
                    {[
                        { id: 'all', label: 'All Modern Tools' },
                        { id: 'video', label: 'Live Video' },
                        { id: 'lms', label: 'LMS Sync' },
                        { id: 'code', label: 'Code & Repos' },
                        { id: 'community', label: 'Community' },
                        { id: 'payments', label: 'Payouts' },
                        { id: 'automation', label: 'Webhooks' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilterCategory(tab.id)}
                            className={`px-3 py-1.5 rounded-xl transition cursor-pointer font-semibold shrink-0 ${
                                filterCategory === tab.id
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
                        placeholder="Search integrations..."
                        className="w-full px-3 py-2 bg-[#141B26] text-xs font-mono text-zinc-200 placeholder-zinc-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                </div>
            </div>

            {/* Integrations Grid */}
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
                                    {renderAppIcon(app.id, app.name, app.icon)}
                                    <div>
                                        <h3 className="text-sm font-bold font-serif text-white">{app.name}</h3>
                                        <span className="text-[10px] font-mono text-zinc-400 uppercase">
                                            {app.category}
                                        </span>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                                    app.connected 
                                        ? 'bg-emerald-500/15 text-emerald-400' 
                                        : 'bg-zinc-800 text-zinc-500'
                                }`}>
                                    {app.connected ? 'Connected' : 'Available'}
                                </span>
                            </div>

                            <p className="text-xs font-sans text-zinc-300 leading-relaxed">
                                {app.description}
                            </p>
                        </div>

                        <div className="space-y-2.5 pt-2 border-t border-zinc-800/40">
                            {app.lastSync && (
                                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                                    <span>Sync Status:</span>
                                    <span className="text-emerald-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                        {app.lastSync}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSelectedApp(app)}
                                    className="flex-1 py-2 px-3 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-xs font-mono font-semibold text-zinc-300 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <Sliders size={13} />
                                    <span>Configure</span>
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

            {/* Modal Drawer: Configure App Details */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#0E131C] border border-[#1E2536] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-left">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                {renderAppIcon(selectedApp.id, selectedApp.name, selectedApp.icon, "w-12 h-12 rounded-xl object-cover")}
                                <div>
                                    <h2 className="text-base font-bold font-serif text-white">{selectedApp.name} Configuration</h2>
                                    <p className="text-xs font-mono text-zinc-400">Protocol credentials & webhook synchronization</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="p-1 rounded-lg text-zinc-500 hover:text-white transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-3.5">
                            {selectedApp.configFields?.map((field, idx) => (
                                <div key={idx} className="space-y-1">
                                    <label className="text-xs font-mono font-semibold text-zinc-300 block">{field.label}</label>
                                    <input 
                                        type={field.type}
                                        defaultValue={field.value}
                                        placeholder={field.placeholder}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B26] border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                                    />
                                </div>
                            ))}

                            <div className="p-3 rounded-xl bg-[#141B26] text-xs font-mono space-y-1 border border-zinc-800/80">
                                <div className="text-zinc-400 uppercase text-[10px] font-bold">Automatic Sync Triggers</div>
                                <div className="text-zinc-300 flex items-center gap-1.5">
                                    <CheckCircle size={13} className="text-emerald-400" />
                                    <span>Sync on student course enrollment</span>
                                </div>
                                <div className="text-zinc-300 flex items-center gap-1.5">
                                    <CheckCircle size={13} className="text-emerald-400" />
                                    <span>Post grade to Canvas LMS upon quiz pass</span>
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
                                {selectedApp.connected ? 'Revoke Access' : 'Authorize Pipeline'}
                            </button>

                            <button
                                onClick={() => {
                                    showToast(`Saved configuration for ${selectedApp.name}`);
                                    setSelectedApp(null);
                                }}
                                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition shadow-lg cursor-pointer"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default InstructorIntegrationsView;
