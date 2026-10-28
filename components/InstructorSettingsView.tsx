import React, { useState } from 'react';
import { InstructorSettings } from '../types';
import { 
    CreditCard, DollarSign, Download, CheckCircle2, AlertCircle, 
    ShieldCheck, Building, HelpCircle, FileText, ArrowUpRight, 
    Check, Lock, Globe, RefreshCw, ChevronRight, Sliders, Sparkles
} from 'lucide-react';
import { PayPalSvg, StripeSvg, PaymytuitionSvg } from './icons/IntegrationSvgs';

interface InstructorSettingsViewProps {
    settings: InstructorSettings;
    onSave: (updatedSettings: InstructorSettings) => void;
}

type TabType = 'payout-methods' | 'tax-center' | 'revenue-share' | 'payout-history' | 'agreements';

export const InstructorSettingsView: React.FC<InstructorSettingsViewProps> = ({ settings, onSave }) => {
    const [activeTab, setActiveTab] = useState<TabType>('payout-methods');
    const [payoutMethod, setPayoutMethod] = useState<'stripe' | 'paypal' | 'bank' | 'paymytuition'>('stripe');
    const [minThreshold, setMinThreshold] = useState<number>(100);
    const [currency, setCurrency] = useState<'USD' | 'EUR' | 'KES' | 'ZAR'>('USD');
    const [dealsEnabled, setDealsEnabled] = useState(true);
    const [marketingPoolEnabled, setMarketingPoolEnabled] = useState(true);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Form states
    const [bankDetails, setBankDetails] = useState({
        accountHolder: 'Dr. Isabella Al-Fara',
        bankName: 'Standard Chartered Bank East Africa',
        accountNumber: '••••••••8819',
        swiftCode: 'SCBLKENX',
        iban: 'KE88SCBL01000928172938'
    });

    const [paypalEmail, setPaypalEmail] = useState('payouts@alfara-research.org');
    const [stripeAccountId, setStripeAccountId] = useState('acct_1NZQ82Kj918Sa');
    const [paymytuitionDetails, setPaymytuitionDetails] = useState({
        studentFacultyId: 'PMT-CS-892104',
        institutionRouting: 'CAMPUS-AFRICA-CENTRAL',
        recipientEmail: 'faculty.bursar@cognisacra.edu'
    });

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleSaveSettings = () => {
        onSave({
            ...settings,
            payout: {
                ...settings.payout,
                method: payoutMethod,
                paypalEmail,
                bankAccount: bankDetails.accountNumber
            }
        });
        showToast('Payment and payout preferences updated successfully');
    };

    const payoutLedger = [
        { id: 'TX-9841', period: 'Sep 2026', gross: '$4,820.00', platformFee: '$723.00', taxWithheld: '$0.00', netPaid: '$4,097.00', date: 'Oct 08, 2026', method: 'Stripe Express', status: 'Paid' },
        { id: 'TX-9412', period: 'Aug 2026', gross: '$5,150.00', platformFee: '$772.50', taxWithheld: '$0.00', netPaid: '$4,377.50', date: 'Sep 08, 2026', method: 'Stripe Express', status: 'Paid' },
        { id: 'TX-8921', period: 'Jul 2026', gross: '$3,940.00', platformFee: '$591.00', taxWithheld: '$0.00', netPaid: '$3,349.00', date: 'Aug 08, 2026', method: 'Stripe Express', status: 'Paid' },
        { id: 'TX-8430', period: 'Jun 2026', gross: '$4,200.00', platformFee: '$630.00', taxWithheld: '$0.00', netPaid: '$3,570.00', date: 'Jul 08, 2026', method: 'Direct Bank Wire', status: 'Paid' },
    ];

    return (
        <div className="w-full animate-fade-in space-y-6 text-left pb-16">
            
            {/* Dynamic Toast Feedback */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#141B26] text-emerald-400 font-mono text-xs shadow-2xl flex items-center gap-2 border border-emerald-500/30 animate-fade-in">
                    <CheckCircle2 size={15} />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Header Banner (Udemy / Enterprise Instructor Payout Grade) */}
            <div className="bg-[#0E131C] p-6 sm:p-7 rounded-2xl shadow-xl border border-[#1E2536] space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                                CogniSacra Premium Faculty Treasury
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight flex items-center gap-2.5">
                            <CreditCard className="text-emerald-400 w-7 h-7" />
                            <span>Payment & Payout Settings</span>
                        </h1>
                        <p className="text-xs sm:text-sm font-sans text-zinc-300 max-w-2xl leading-relaxed">
                            Manage your global disbursement methods, automated monthly payouts, W-8BEN international tax treaties, and download certified royalty statements.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 font-mono">
                        <div className="px-3.5 py-2 rounded-xl bg-[#141B26] border border-zinc-800 text-xs">
                            <span className="text-[10px] text-zinc-400 uppercase block">Next Disbursement</span>
                            <span className="text-white font-bold flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                Nov 08, 2026 (Est. $4,290.00)
                            </span>
                        </div>
                        <button
                            onClick={handleSaveSettings}
                            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
                        >
                            <Check size={14} />
                            <span>Save Preferences</span>
                        </button>
                    </div>
                </div>

                {/* KPI Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-zinc-800/60 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-[#141B26]">
                        <span className="text-[10px] text-zinc-400 uppercase block">Lifetime Earnings</span>
                        <span className="text-lg font-bold text-white">$68,410.00 USD</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#141B26]">
                        <span className="text-[10px] text-zinc-400 uppercase block">Pending Payout Balance</span>
                        <span className="text-lg font-bold text-emerald-400">$3,420.50</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#141B26]">
                        <span className="text-[10px] text-zinc-400 uppercase block">Tax Status (W-8BEN)</span>
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
                            <ShieldCheck size={13} />
                            <span>Validated (0% Withholding)</span>
                        </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#141B26]">
                        <span className="text-[10px] text-zinc-400 uppercase block">Disbursement Schedule</span>
                        <span className="text-xs font-bold text-zinc-200 mt-1">Monthly (Net-30 Cycle)</span>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs (Udemy Style Visual Hierarchy) */}
            <div className="p-1 bg-[#0E131C] rounded-2xl shadow-xl border border-[#1E2536] flex flex-wrap gap-1 font-mono text-xs">
                {[
                    { id: 'payout-methods', label: 'Payout Methods', icon: <CreditCard size={14} /> },
                    { id: 'tax-center', label: 'Tax Center & Forms', icon: <FileText size={14} /> },
                    { id: 'revenue-share', label: 'Revenue Economics', icon: <DollarSign size={14} /> },
                    { id: 'payout-history', label: 'Disbursement Ledger', icon: <Download size={14} /> },
                    { id: 'agreements', label: 'Promotional Agreements', icon: <Sliders size={14} /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer font-semibold ${
                            activeTab === tab.id
                                ? 'bg-emerald-500 text-black shadow-md'
                                : 'text-zinc-400 hover:text-white hover:bg-[#141B26]'
                        }`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* TAB 1: PAYOUT METHODS */}
            {activeTab === 'payout-methods' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left: Provider Selection (8 Cols) */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl border border-[#1E2536] space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                                <div>
                                    <h2 className="text-base font-bold font-serif text-white">Select Primary Payout Provider</h2>
                                    <p className="text-xs font-mono text-zinc-400">All student course purchases and sovereign royalties will disburse to this endpoint.</p>
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold uppercase">
                                    Encrypted TLS 1.3
                                </span>
                            </div>

                            {/* Providers Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                {[
                                    {
                                        id: 'stripe',
                                        name: 'Stripe Express Connect',
                                        subtitle: 'Recommended · Direct debit card & bank transfer',
                                        badge: 'Instant & Low Fee',
                                        status: 'Active / Connected',
                                        icon: <StripeSvg className="w-5 h-5" />
                                    },
                                    {
                                        id: 'bank',
                                        name: 'Direct Bank Wire (SWIFT / IBAN)',
                                        subtitle: 'Direct wire transfer to any verified global bank',
                                        badge: 'Global Commercial Bank',
                                        status: 'Configured',
                                        icon: <Building size={18} className="text-zinc-300" />
                                    },
                                    {
                                        id: 'paypal',
                                        name: 'PayPal Account',
                                        subtitle: 'Direct deposit into your personal or business PayPal',
                                        badge: 'Fast Transfer',
                                        status: 'Ready to Link',
                                        icon: <PayPalSvg className="w-5 h-5" />
                                    },
                                    {
                                        id: 'paymytuition',
                                        name: 'Paymytuition',
                                        subtitle: 'Cross-border educational payments & international tuition deposit rails',
                                        badge: 'Higher Ed Rail',
                                        status: 'Ready to Link',
                                        icon: <PaymytuitionSvg className="w-5 h-5" />
                                    }
                                ].map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => setPayoutMethod(item.id as any)}
                                        className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 text-left relative ${
                                            payoutMethod === item.id
                                                ? 'bg-[#141B26] border-emerald-500/50 ring-1 ring-emerald-500/30'
                                                : 'bg-[#0A0D14] border-zinc-800/80 hover:border-zinc-700'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-zinc-800/60 flex items-center justify-center p-1">
                                                    {item.icon}
                                                </div>
                                                <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase">{item.badge}</span>
                                            </div>
                                            {payoutMethod === item.id && (
                                                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-black">
                                                    <Check size={12} strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold font-serif text-white">{item.name}</h3>
                                            <p className="text-[11px] font-sans text-zinc-400 mt-0.5 leading-snug">{item.subtitle}</p>
                                        </div>
                                        <div className="text-[10px] font-mono text-zinc-500 pt-1 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                            <span>{item.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Active Method Form Detail */}
                            <div className="mt-4 p-5 rounded-xl bg-[#141B26] border border-zinc-800 space-y-3 font-mono text-xs">
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <Building size={14} className="text-emerald-400" />
                                    <span>Active Method Details: {payoutMethod.toUpperCase()}</span>
                                </h3>

                                {payoutMethod === 'stripe' && (
                                    <div className="space-y-3 pt-1">
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-[#0E131C] border border-zinc-800">
                                            <div>
                                                <span className="text-[10px] text-zinc-400 uppercase block">Connected Stripe Express Account</span>
                                                <span className="text-white font-bold">{stripeAccountId}</span>
                                            </div>
                                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                                                Active & Receiving Funds
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-zinc-400">
                                            Earnings are automatically swept on the 8th of each calendar month. Funds arrive in your local bank within 1-2 business days.
                                        </p>
                                    </div>
                                )}

                                {payoutMethod === 'bank' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                        <div>
                                            <label className="text-[10px] text-zinc-400 uppercase block mb-1">Account Holder</label>
                                            <input 
                                                type="text" 
                                                value={bankDetails.accountHolder} 
                                                onChange={e => setBankDetails({...bankDetails, accountHolder: e.target.value})}
                                                className="w-full px-3 py-2 rounded-lg bg-[#0E131C] border border-zinc-800 text-white" 
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-zinc-400 uppercase block mb-1">Bank Name</label>
                                            <input 
                                                type="text" 
                                                value={bankDetails.bankName} 
                                                onChange={e => setBankDetails({...bankDetails, bankName: e.target.value})}
                                                className="w-full px-3 py-2 rounded-lg bg-[#0E131C] border border-zinc-800 text-white" 
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-zinc-400 uppercase block mb-1">SWIFT / BIC Code</label>
                                            <input 
                                                type="text" 
                                                value={bankDetails.swiftCode} 
                                                onChange={e => setBankDetails({...bankDetails, swiftCode: e.target.value})}
                                                className="w-full px-3 py-2 rounded-lg bg-[#0E131C] border border-zinc-800 text-white" 
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-zinc-400 uppercase block mb-1">IBAN / Account Number</label>
                                            <input 
                                                type="text" 
                                                value={bankDetails.iban} 
                                                onChange={e => setBankDetails({...bankDetails, iban: e.target.value})}
                                                className="w-full px-3 py-2 rounded-lg bg-[#0E131C] border border-zinc-800 text-white" 
                                            />
                                        </div>
                                    </div>
                                )}

                                {payoutMethod === 'paypal' && (
                                    <div className="space-y-2 pt-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <PayPalSvg className="w-5 h-5" />
                                            <label className="text-[10px] text-zinc-400 uppercase block">PayPal Registered Email</label>
                                        </div>
                                        <input 
                                            type="email" 
                                            value={paypalEmail} 
                                            onChange={e => setPaypalEmail(e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-[#0E131C] border border-zinc-800 text-white" 
                                        />
                                        <p className="text-[10px] text-zinc-500">Student and institutional remittances are deposited directly into this PayPal wallet.</p>
                                    </div>
                                )}

                                {payoutMethod === 'paymytuition' && (
                                    <div className="space-y-3 pt-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <PaymytuitionSvg className="w-5 h-5" />
                                            <span className="text-[11px] text-emerald-400 font-bold">Paymytuition Higher Education Settlement</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] text-zinc-400 uppercase block mb-1">Paymytuition Faculty / Account ID</label>
                                                <input 
                                                    type="text" 
                                                    value={paymytuitionDetails.studentFacultyId} 
                                                    onChange={e => setPaymytuitionDetails({...paymytuitionDetails, studentFacultyId: e.target.value})}
                                                    className="w-full px-3 py-2 rounded-lg bg-[#0E131C] border border-zinc-800 text-white" 
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-zinc-400 uppercase block mb-1">Campus Routing Code</label>
                                                <input 
                                                    type="text" 
                                                    value={paymytuitionDetails.institutionRouting} 
                                                    onChange={e => setPaymytuitionDetails({...paymytuitionDetails, institutionRouting: e.target.value})}
                                                    className="w-full px-3 py-2 rounded-lg bg-[#0E131C] border border-zinc-800 text-white" 
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="text-[10px] text-zinc-400 uppercase block mb-1">Academic Remittance Email</label>
                                                <input 
                                                    type="email" 
                                                    value={paymytuitionDetails.recipientEmail} 
                                                    onChange={e => setPaymytuitionDetails({...paymytuitionDetails, recipientEmail: e.target.value})}
                                                    className="w-full px-3 py-2 rounded-lg bg-[#0E131C] border border-zinc-800 text-white" 
                                                />
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-zinc-500">Zero foreign exchange conversion drag for global tuition settlements across 140+ countries.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Threshold & Preferences (4 Cols) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-[#0E131C] p-5 rounded-2xl shadow-xl border border-[#1E2536] space-y-4 font-mono text-xs">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                                Minimum Payout Threshold
                            </h3>
                            <p className="text-[11px] font-sans text-zinc-400 leading-relaxed">
                                Payouts will only disburse when your accumulated balance reaches or exceeds this amount.
                            </p>

                            <div className="grid grid-cols-3 gap-2">
                                {[50, 100, 250].map(amt => (
                                    <button
                                        key={amt}
                                        onClick={() => setMinThreshold(amt)}
                                        className={`py-2 rounded-xl font-bold transition cursor-pointer text-center ${
                                            minThreshold === amt 
                                                ? 'bg-emerald-500 text-black' 
                                                : 'bg-[#141B26] text-zinc-300 hover:text-white'
                                        }`}
                                    >
                                        ${amt}
                                    </button>
                                ))}
                            </div>

                            <div className="pt-3 border-t border-zinc-800/60 space-y-2">
                                <label className="text-[10px] text-zinc-400 uppercase block font-bold">Payout Currency</label>
                                <select 
                                    value={currency} 
                                    onChange={(e: any) => setCurrency(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-[#141B26] border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                >
                                    <option value="USD">USD ($) - United States Dollar</option>
                                    <option value="EUR">EUR (€) - Eurozone</option>
                                    <option value="KES">KES (KSh) - Kenya Shillings</option>
                                    <option value="ZAR">ZAR (R) - South African Rand</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-[#0E131C] p-5 rounded-2xl shadow-xl border border-[#1E2536] space-y-2.5 font-mono text-xs">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold">
                                <ShieldCheck size={16} />
                                <span>Security Guarantee</span>
                            </div>
                            <p className="text-[11px] font-sans text-zinc-400 leading-relaxed">
                                All payouts are protected by 256-bit encryption. Account changes require two-factor confirmation before funds are routed.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: TAX CENTER & FORMS */}
            {activeTab === 'tax-center' && (
                <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl border border-[#1E2536] space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/60">
                        <div>
                            <h2 className="text-base font-bold font-serif text-white">Tax Information & Treaty Documentation</h2>
                            <p className="text-xs font-mono text-zinc-400">CogniSacra collects IRS tax certification to determine mandatory withholding rates on worldwide course royalties.</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-xs font-bold uppercase self-start sm:self-center flex items-center gap-1.5">
                            <CheckCircle2 size={14} />
                            <span>Tax Profile Approved</span>
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                        <div className="p-4 rounded-xl bg-[#141B26] space-y-2">
                            <span className="text-[10px] text-zinc-400 uppercase block font-bold">Validated Form</span>
                            <div className="text-white font-bold text-sm">Form W-8BEN (Certificate of Foreign Status)</div>
                            <p className="text-[11px] font-sans text-zinc-400">
                                Certified for individual non-US resident aliens claiming academic bilateral tax treaty exemption.
                            </p>
                            <div className="pt-2 text-emerald-400 text-[11px] flex items-center gap-1">
                                <Check size={13} />
                                <span>Treaty Withholding Rate: 0.00%</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-[#141B26] space-y-2">
                            <span className="text-[10px] text-zinc-400 uppercase block font-bold">Foreign Tax Identification Number</span>
                            <div className="text-white font-bold text-sm">PIN: A00••••••••8Z</div>
                            <p className="text-[11px] font-sans text-zinc-400">
                                Verified by Kenya Revenue Authority (KRA) & international bilateral verification gateway.
                            </p>
                            <div className="pt-2 text-zinc-400 text-[11px]">
                                Expiration Date: Dec 31, 2028 (Valid for 3 years)
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800/60 space-y-3 font-mono text-xs">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Annual Tax Statements (Download Center)</h3>
                        <div className="space-y-2">
                            {[
                                { year: '2025 Form 1042-S', desc: 'Foreign Person’s U.S. Source Income Subject to Withholding', size: '240 KB' },
                                { year: '2024 Form 1042-S', desc: 'Foreign Person’s U.S. Source Income Subject to Withholding', size: '228 KB' },
                                { year: '2025 Annual Gross Royalty Certificate', desc: 'Consolidated statement of course sales across all partner universities', size: '412 KB' },
                            ].map((doc, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-[#141B26] flex items-center justify-between hover:bg-[#182130] transition">
                                    <div className="flex items-center gap-3">
                                        <FileText size={18} className="text-emerald-400" />
                                        <div>
                                            <div className="font-bold text-white">{doc.year}</div>
                                            <div className="text-[10px] text-zinc-400 font-sans">{doc.desc}</div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => showToast(`Downloaded ${doc.year}`)}
                                        className="px-3 py-1.5 rounded-lg bg-[#0E131C] hover:bg-emerald-500 hover:text-black text-zinc-300 font-bold text-[11px] transition flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <Download size={13} />
                                        <span>PDF ({doc.size})</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: REVENUE SHARE ECONOMICS (UDEMY MODEL) */}
            {activeTab === 'revenue-share' && (
                <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl border border-[#1E2536] space-y-5">
                    <div className="pb-2 border-b border-zinc-800/60">
                        <h2 className="text-base font-bold font-serif text-white">Revenue Share Economics & Payout Tiers</h2>
                        <p className="text-xs font-mono text-zinc-400">Transparent royalty splits aligned with Udemy & Sovereign Academic Guild standards.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                        <div className="p-5 rounded-2xl bg-[#141B26] border border-emerald-500/20 space-y-3 text-left">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Instructor Referral</span>
                            <div className="text-3xl font-extrabold text-white">97% <span className="text-xs text-zinc-400 font-normal">Revenue Share</span></div>
                            <p className="text-[11px] font-sans text-zinc-300 leading-relaxed">
                                When students purchase your course using your instructor referral link or coupon code, you keep 97% of net proceeds (3% standard payment processing fee).
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-[#141B26] border border-zinc-800 space-y-3 text-left">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Organic Marketplace Sales</span>
                            <div className="text-3xl font-extrabold text-white">50% <span className="text-xs text-zinc-400 font-normal">Revenue Share</span></div>
                            <p className="text-[11px] font-sans text-zinc-300 leading-relaxed">
                                For sales occurring through CogniSacra marketplace organic catalog search, recommendation algorithms, or category browsing.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-[#141B26] border border-zinc-800 space-y-3 text-left">
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Enterprise & Institutional Pool</span>
                            <div className="text-3xl font-extrabold text-white">Royalty Pool <span className="text-xs text-zinc-400 font-normal">Per Minute</span></div>
                            <p className="text-[11px] font-sans text-zinc-300 leading-relaxed">
                                Partner universities license full catalog access; instructor royalties are weighted and disbursed monthly based on total learner active viewing minutes.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 4: DISBURSEMENT LEDGER & INVOICES */}
            {activeTab === 'payout-history' && (
                <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl border border-[#1E2536] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800/60">
                        <div>
                            <h2 className="text-base font-bold font-serif text-white">Monthly Disbursement Ledger</h2>
                            <p className="text-xs font-mono text-zinc-400">Comprehensive historical ledger of all processed transfers, fees, and receipts.</p>
                        </div>
                        <button
                            onClick={() => showToast('Exporting complete CSV ledger...')}
                            className="px-3.5 py-1.5 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-xs font-mono font-semibold text-zinc-200 transition flex items-center gap-1.5 border border-zinc-800 self-start sm:self-center cursor-pointer"
                        >
                            <Download size={13} />
                            <span>Export CSV</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full font-mono text-xs text-left">
                            <thead>
                                <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px]">
                                    <th className="py-2.5 px-3">Transaction ID</th>
                                    <th className="py-2.5 px-3">Period</th>
                                    <th className="py-2.5 px-3">Gross Sales</th>
                                    <th className="py-2.5 px-3">Platform Fee</th>
                                    <th className="py-2.5 px-3">Net Paid</th>
                                    <th className="py-2.5 px-3">Payment Method</th>
                                    <th className="py-2.5 px-3">Status</th>
                                    <th className="py-2.5 px-3 text-right">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60">
                                {payoutLedger.map(item => (
                                    <tr key={item.id} className="hover:bg-[#141B26]/50 transition">
                                        <td className="py-3 px-3 font-semibold text-white">{item.id}</td>
                                        <td className="py-3 px-3 text-zinc-300">{item.period}</td>
                                        <td className="py-3 px-3 text-zinc-300">{item.gross}</td>
                                        <td className="py-3 px-3 text-rose-400">-{item.platformFee}</td>
                                        <td className="py-3 px-3 font-bold text-emerald-400">{item.netPaid}</td>
                                        <td className="py-3 px-3 text-zinc-300">{item.method}</td>
                                        <td className="py-3 px-3">
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                                                {item.status} ({item.date})
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                            <button 
                                                onClick={() => showToast(`Downloaded invoice for ${item.period}`)}
                                                className="text-zinc-400 hover:text-white transition cursor-pointer p-1"
                                                title="Download PDF Invoice"
                                            >
                                                <Download size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 5: PROMOTIONAL AGREEMENTS */}
            {activeTab === 'agreements' && (
                <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl border border-[#1E2536] space-y-4 font-mono text-xs">
                    <div className="pb-2 border-b border-zinc-800/60">
                        <h2 className="text-base font-bold font-serif text-white">Promotional Agreements & Pricing Programs</h2>
                        <p className="text-xs text-zinc-400">Opt in or out of global promotional discount campaigns and enterprise licensing agreements.</p>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="p-4 rounded-xl bg-[#141B26] flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <h3 className="font-bold text-white text-sm">CogniSacra Deals Program</h3>
                                <p className="text-[11px] font-sans text-zinc-300 leading-relaxed">
                                    Allows CogniSacra to optimize your course listing price in localized emerging markets (Kenya, Nigeria, Ghana, South Africa, Southeast Asia) to increase student enrollment volume.
                                </p>
                            </div>
                            <button
                                onClick={() => setDealsEnabled(!dealsEnabled)}
                                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                                    dealsEnabled ? 'bg-emerald-500' : 'bg-zinc-700'
                                }`}
                            >
                                <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                                    dealsEnabled ? 'left-6.5' : 'left-0.5'
                                }`} />
                            </button>
                        </div>

                        <div className="p-4 rounded-xl bg-[#141B26] flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <h3 className="font-bold text-white text-sm">Enterprise Academic Subscription Program</h3>
                                <p className="text-[11px] font-sans text-zinc-300 leading-relaxed">
                                    Include your courses in the institutional package provided to accredited university partners. You receive proportional royalties for each consumed lesson.
                                </p>
                            </div>
                            <button
                                onClick={() => setMarketingPoolEnabled(!marketingPoolEnabled)}
                                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                                    marketingPoolEnabled ? 'bg-emerald-500' : 'bg-zinc-700'
                                }`}
                            >
                                <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                                    marketingPoolEnabled ? 'left-6.5' : 'left-0.5'
                                }`} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default InstructorSettingsView;