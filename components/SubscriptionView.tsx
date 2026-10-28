import React, { useState, useMemo } from 'react';
import { SubscriptionTier } from '../types';
import { 
    CheckCircle2, Sparkles, ShieldCheck, ArrowRight, Calculator, 
    Building2, UserCheck, Zap, CreditCard, TrendingUp, Award, 
    Info, DollarSign, Calendar, ChevronRight, Lock
} from 'lucide-react';
import { PayPalSvg, StripeSvg, PaymytuitionSvg } from './icons/IntegrationSvgs';

interface SubscriptionViewProps {
    onSelectPlan: (planName: string) => void;
    tiers?: SubscriptionTier[];
    title: string;
    subtitle: string;
    planType?: 'instructor' | 'institution';
    onAffiliateBypass?: (institutionCode: string) => void;
}

const SubscriptionView: React.FC<SubscriptionViewProps> = ({ 
    onSelectPlan, 
    tiers, 
    title, 
    subtitle,
    planType,
    onAffiliateBypass
}) => {
    // Detect whether this is the Instructor or Institution page
    const isInstructorMode = planType === 'instructor' || title.toLowerCase().includes('instructor');
    const isInstitutionMode = planType === 'institution' || title.toLowerCase().includes('institution');

    // Billing Cycle: Monthly vs Yearly
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    // Instructor Calculator States
    const [monthlyLearnersEstimate, setMonthlyLearnersEstimate] = useState<number>(35);
    const [averageCoursePrice, setAverageCoursePrice] = useState<number>(45);

    // Institution Calculator States
    const [instructorsCount, setInstructorsCount] = useState<number>(12);
    const [activeStudentsCount, setActiveStudentsCount] = useState<number>(850);

    // Affiliation Code bypass state
    const [showAffiliationInput, setShowAffiliationInput] = useState(false);
    const [affiliationCode, setAffiliationCode] = useState('');
    const [affiliationError, setAffiliationError] = useState('');

    // Currency Switcher
    const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
    const currencyRates = { USD: 1, EUR: 0.92, GBP: 0.79 };
    const currencySymbols = { USD: '$', EUR: '€', GBP: '£' };
    const rate = currencyRates[currency];
    const symbol = currencySymbols[currency];

    // INSTRUCTOR PRICING (One single plan: $49.99/mo)
    const instructorMonthlyPrice = 49.99;
    const instructorYearlyDiscount = 0.20; // 20% discount
    const instructorYearlyPricePerYear = Number((instructorMonthlyPrice * 12 * (1 - instructorYearlyDiscount)).toFixed(2)); // $479.90
    const instructorYearlyEffectiveMonthly = Number((instructorYearlyPricePerYear / 12).toFixed(2)); // $39.99/mo
    const instructorSavings = Number((instructorMonthlyPrice * 12 - instructorYearlyPricePerYear).toFixed(2)); // $119.98

    // Estimated Instructor Earnings
    const estimatedInstructorGross = monthlyLearnersEstimate * averageCoursePrice;
    const estimatedInstructorCost = billingCycle === 'monthly' ? instructorMonthlyPrice : instructorYearlyEffectiveMonthly;
    const estimatedInstructorNet = Math.max(0, estimatedInstructorGross - estimatedInstructorCost);

    // INSTITUTION PRICING ($999.99/mo)
    const institutionMonthlyPrice = 999.99;
    const institutionYearlyDiscount = 0.20; // 20% discount
    const institutionYearlyPricePerYear = Number((institutionMonthlyPrice * 12 * (1 - institutionYearlyDiscount)).toFixed(2)); // $9,599.90
    const institutionYearlyEffectiveMonthly = Number((institutionYearlyPricePerYear / 12).toFixed(2)); // $799.99/mo
    const institutionSavings = Number((institutionMonthlyPrice * 12 - institutionYearlyPricePerYear).toFixed(2)); // $2,399.98

    // Institution $5 once-off fee per onboarded instructor
    const ONCE_OFF_FEE_PER_INSTRUCTOR = 5.00;
    const totalInstructorOnboardingFees = Number((instructorsCount * ONCE_OFF_FEE_PER_INSTRUCTOR).toFixed(2));

    const handleAffiliationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!affiliationCode.trim()) {
            setAffiliationError('Please enter a valid institution faculty code.');
            return;
        }
        if (affiliationCode.trim().length < 4) {
            setAffiliationError('Invalid institutional accreditation code.');
            return;
        }
        if (onAffiliateBypass) {
            onAffiliateBypass(affiliationCode.trim());
        } else {
            onSelectPlan(`Institution Covered (${affiliationCode.trim().toUpperCase()})`);
        }
    };

    return (
        <div className="min-h-screen bg-[#080B10] text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-crimson selection:text-white">
            <div className="max-w-6xl mx-auto space-y-12">
                
                {/* 1. HERO HEADER */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-crimson/15 border border-crimson/30 text-crimson text-xs font-mono font-bold tracking-wider uppercase">
                        <Sparkles size={13} />
                        <span>Sovereign Knowledge Ecosystem</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight">
                        {title}
                    </h1>
                    
                    <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
                        {subtitle}
                    </p>

                    {/* Currency & Billing Cycle Toggle */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        {/* Monthly vs Yearly Switch */}
                        <div className="inline-flex p-1 bg-[#141B26] border border-zinc-800 rounded-2xl shadow-inner">
                            <button
                                type="button"
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-5 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                                    billingCycle === 'monthly'
                                        ? 'bg-crimson text-white shadow-md'
                                        : 'text-zinc-400 hover:text-white'
                                }`}
                            >
                                Monthly Billing
                            </button>
                            <button
                                type="button"
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                    billingCycle === 'yearly'
                                        ? 'bg-crimson text-white shadow-md'
                                        : 'text-zinc-400 hover:text-white'
                                }`}
                            >
                                <span>Yearly Payment</span>
                                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold border border-emerald-500/30">
                                    Save 20%
                                </span>
                            </button>
                        </div>

                        {/* Currency Selector */}
                        <div className="flex items-center gap-1 bg-[#141B26] border border-zinc-800 rounded-xl p-1 font-mono text-xs">
                            {(['USD', 'EUR', 'GBP'] as const).map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setCurrency(c)}
                                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                                        currency === c ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                                    }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. INSTRUCTOR PLAN PRESENTATION (ONE PLAN FOR INDEPENDENT INSTRUCTORS) */}
                {isInstructorMode && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Institutional Affiliation Notice */}
                        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#141B26] to-[#0E131C] border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
                            <div className="flex items-center gap-2.5 text-blue-200">
                                <Building2 size={18} className="text-blue-400 shrink-0" />
                                <div>
                                    <span className="font-bold text-white block">Joining Through an Institution?</span>
                                    <span className="text-[11px] text-zinc-300">
                                        Faculty members affiliated with partner institutions pay <strong className="text-emerald-400">$0</strong>. Your institution covers the $5 once-off onboarding fee.
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAffiliationInput(!showAffiliationInput)}
                                className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 font-bold border border-blue-500/40 shrink-0 transition cursor-pointer text-[11px]"
                            >
                                {showAffiliationInput ? 'Close' : 'Enter Institution Code'}
                            </button>
                        </div>

                        {/* Affiliation Code Input Expandable */}
                        {showAffiliationInput && (
                            <form onSubmit={handleAffiliationSubmit} className="max-w-md mx-auto p-4 rounded-2xl bg-[#0E131C] border border-zinc-700/80 space-y-3 font-mono text-xs">
                                <label className="block text-zinc-300 font-bold">
                                    Enter 8-Digit Institutional Faculty Accreditation Code:
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={affiliationCode}
                                        onChange={(e) => {
                                            setAffiliationCode(e.target.value.toUpperCase());
                                            setAffiliationError('');
                                        }}
                                        placeholder="e.g. CS-OXF-9481"
                                        className="flex-1 px-3 py-2 bg-[#141B26] border border-zinc-700 rounded-xl text-white font-mono focus:border-blue-500 focus:outline-none uppercase"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition cursor-pointer"
                                    >
                                        Verify & Bypass
                                    </button>
                                </div>
                                {affiliationError && <p className="text-rose-400 text-[11px]">{affiliationError}</p>}
                            </form>
                        )}

                        {/* Main Independent Instructor Card */}
                        <div className="max-w-3xl mx-auto rounded-3xl bg-[#0E131C] border-2 border-crimson/80 shadow-2xl overflow-hidden relative">
                            {/* Accent Glow */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-crimson/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="p-8 sm:p-10 space-y-8 relative z-10">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2.5 py-0.5 rounded-full bg-crimson text-white font-mono text-[10px] uppercase font-bold tracking-wider">
                                                Independent Instructor Plan
                                            </span>
                                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-[10px] uppercase font-bold border border-emerald-500/30">
                                                Single All-Inclusive Tier
                                            </span>
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                                            Independent Faculty Sovereign Suite
                                        </h2>
                                        <p className="text-xs text-zinc-400 mt-1">
                                            Everything independent mentors and educators need to publish courses, schedule live classrooms, and monetize global knowledge.
                                        </p>
                                    </div>

                                    {/* Price Display */}
                                    <div className="text-left sm:text-right shrink-0 font-mono">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl sm:text-5xl font-extrabold text-white">
                                                {symbol}{billingCycle === 'monthly' ? (instructorMonthlyPrice * rate).toFixed(2) : (instructorYearlyEffectiveMonthly * rate).toFixed(2)}
                                            </span>
                                            <span className="text-xs text-zinc-400 font-normal">/ month</span>
                                        </div>
                                        {billingCycle === 'yearly' ? (
                                            <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                                                Billed annually at {symbol}{(instructorYearlyPricePerYear * rate).toFixed(2)} (Save {symbol}{(instructorSavings * rate).toFixed(2)}/yr)
                                            </p>
                                        ) : (
                                            <p className="text-[11px] text-zinc-500 mt-0.5">
                                                Billed monthly · Cancel anytime
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Feature Pillars */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        'Unlimited Course Creation & Module Publishing',
                                        'Live Virtual Classroom & Interactive Whiteboard Access',
                                        'Real-Time Student Mentoring & Office Hours Booking',
                                        'Sovereign W3C Cryptographic Accreditation Badges',
                                        'Zero Course-Sales Platform Commission (100% Payouts)',
                                        'Automated Grading, Rubrics & Anti-Plagiarism Engine',
                                        'Multi-Channel Payouts via Stripe, PayPal & Paymytuition',
                                        'AI Teaching Assistant & Automated Lesson Transcripts'
                                    ].map((feat, idx) => (
                                        <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                            <span>{feat}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Real-Time Revenue Calculator */}
                                <div className="p-5 rounded-2xl bg-[#141B26] border border-zinc-800 space-y-4">
                                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                                        <div className="flex items-center gap-2">
                                            <Calculator size={16} className="text-amber-400" />
                                            <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                                                Real-Time Revenue & Profit Estimator
                                            </h4>
                                        </div>
                                        <span className="text-[11px] font-mono text-zinc-400">
                                            Instant Projections
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                                                <span className="text-zinc-400">Est. Enrolled Students / Mo</span>
                                                <span className="text-white font-bold">{monthlyLearnersEstimate} students</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="5"
                                                max="250"
                                                step="5"
                                                value={monthlyLearnersEstimate}
                                                onChange={(e) => setMonthlyLearnersEstimate(Number(e.target.value))}
                                                className="w-full accent-crimson cursor-pointer"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                                                <span className="text-zinc-400">Average Course / Session Fee</span>
                                                <span className="text-white font-bold">{symbol}{(averageCoursePrice * rate).toFixed(0)}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="10"
                                                max="150"
                                                step="5"
                                                value={averageCoursePrice}
                                                onChange={(e) => setAverageCoursePrice(Number(e.target.value))}
                                                className="w-full accent-crimson cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2 grid grid-cols-3 gap-2 text-center font-mono text-xs">
                                        <div className="p-2.5 rounded-xl bg-slate-900 border border-zinc-800">
                                            <span className="text-[10px] text-zinc-500 uppercase block">Gross Income</span>
                                            <span className="text-sm font-bold text-zinc-200">
                                                {symbol}{(estimatedInstructorGross * rate).toFixed(0)}
                                            </span>
                                        </div>
                                        <div className="p-2.5 rounded-xl bg-slate-900 border border-zinc-800">
                                            <span className="text-[10px] text-zinc-500 uppercase block">Plan Cost</span>
                                            <span className="text-sm font-bold text-rose-400">
                                                -{symbol}{(estimatedInstructorCost * rate).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                                            <span className="text-[10px] text-emerald-400 uppercase block font-bold">Net Profit</span>
                                            <span className="text-sm font-bold text-emerald-300">
                                                {symbol}{(estimatedInstructorNet * rate).toFixed(0)} / mo
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Supported Payouts & CTA */}
                                <div className="space-y-4 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => onSelectPlan('Independent Instructor Sovereign Plan')}
                                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-crimson to-red-800 hover:from-red-700 hover:to-red-900 text-white font-serif font-bold text-base shadow-xl hover:shadow-red-900/30 transition flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <span>Activate Independent Instructor Plan</span>
                                        <ArrowRight size={18} />
                                    </button>

                                    <div className="flex flex-wrap items-center justify-between text-xs text-zinc-400 font-mono gap-3 pt-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-zinc-500 text-[11px]">Instant Payout Channels:</span>
                                            <div className="flex items-center gap-2">
                                                <StripeSvg className="w-5 h-5" />
                                                <PayPalSvg className="w-5 h-5" />
                                                <PaymytuitionSvg className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-emerald-400">
                                            <ShieldCheck size={14} />
                                            <span>256-Bit SSL Encrypted & SOC-2 Verified</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. INSTITUTION PLAN PRESENTATION ($999.99/mo + $5 ONCE-OFF ONBOARDING FEE) */}
                {isInstitutionMode && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Main Enterprise Institution Card */}
                        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-[#141B26] to-[#0E131C] border-2 border-amber-500/60 shadow-2xl overflow-hidden relative">
                            {/* Ambient Gold Glow */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="p-8 sm:p-12 space-y-8 relative z-10">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-zinc-800 pb-8">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] uppercase font-bold tracking-wider border border-amber-500/40">
                                                Institutional Academic Suite
                                            </span>
                                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-[10px] uppercase font-bold border border-emerald-500/30">
                                                Accredited Partner
                                            </span>
                                        </div>
                                        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
                                            Higher Education & Enterprise Plan
                                        </h2>
                                        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl">
                                            Deploy an enterprise-grade academic campus with sovereign W3C credentials, unlimited student enrollments, faculty provisioning, and custom domain white-labeling.
                                        </p>
                                    </div>

                                    {/* Monthly vs Yearly Price Box */}
                                    <div className="text-left sm:text-right shrink-0 font-mono bg-slate-900/80 p-5 rounded-2xl border border-zinc-800 shadow-inner">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl sm:text-5xl font-extrabold text-amber-400">
                                                {symbol}{billingCycle === 'monthly' ? (institutionMonthlyPrice * rate).toFixed(2) : (institutionYearlyEffectiveMonthly * rate).toFixed(2)}
                                            </span>
                                            <span className="text-xs text-zinc-400 font-normal">/ month</span>
                                        </div>
                                        {billingCycle === 'yearly' ? (
                                            <p className="text-xs text-emerald-400 font-semibold mt-1">
                                                Billed annually at {symbol}{(institutionYearlyPricePerYear * rate).toFixed(2)}
                                                <span className="block text-[11px] text-zinc-400">(Save {symbol}{(institutionSavings * rate).toFixed(2)}/yr)</span>
                                            </p>
                                        ) : (
                                            <p className="text-[11px] text-zinc-400 mt-1">
                                                Billed monthly · Dedicated Account Director
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Institution Real-Time Fee & Faculty Calculator */}
                                <div className="p-6 rounded-2xl bg-[#080B10] border border-zinc-800 space-y-5">
                                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                                        <div className="flex items-center gap-2">
                                            <Calculator size={18} className="text-amber-400" />
                                            <div>
                                                <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                                                    Real-Time Faculty Onboarding & Seat Calculator
                                                </h4>
                                                <p className="text-[11px] text-zinc-400">
                                                    Includes the mandated <strong className="text-amber-300">$5.00 once-off fee</strong> per new instructor onboarded.
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 font-mono text-[11px] font-bold border border-amber-500/20">
                                            $5 Once-Off / Instructor
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <div className="flex items-center justify-between text-xs font-mono mb-2">
                                                <span className="text-zinc-300">Instructors to Onboard ({instructorsCount} Faculty)</span>
                                                <span className="text-amber-400 font-bold">{symbol}{(totalInstructorOnboardingFees * rate).toFixed(2)} once-off</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="1"
                                                max="100"
                                                step="1"
                                                value={instructorsCount}
                                                onChange={(e) => setInstructorsCount(Number(e.target.value))}
                                                className="w-full accent-amber-500 cursor-pointer"
                                            />
                                            <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                                                Calculated as {instructorsCount} × $5.00 once-off onboarding fee
                                            </span>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between text-xs font-mono mb-2">
                                                <span className="text-zinc-300">Active Students & Fellows Capacity</span>
                                                <span className="text-emerald-400 font-bold">{activeStudentsCount} enrolled</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="100"
                                                max="5000"
                                                step="50"
                                                value={activeStudentsCount}
                                                onChange={(e) => setActiveStudentsCount(Number(e.target.value))}
                                                className="w-full accent-emerald-500 cursor-pointer"
                                            />
                                            <span className="text-[10px] text-emerald-500/80 font-mono mt-1 block">
                                                Unlimited concurrent bandwidth included in plan
                                            </span>
                                        </div>
                                    </div>

                                    {/* Itemized Total Invoice Snapshot */}
                                    <div className="p-4 rounded-xl bg-[#141B26] border border-zinc-800 font-mono text-xs space-y-2">
                                        <div className="flex justify-between text-zinc-300">
                                            <span>Institutional Platform Subscription ({billingCycle})</span>
                                            <span>{symbol}{billingCycle === 'monthly' ? (institutionMonthlyPrice * rate).toFixed(2) : (institutionYearlyPricePerYear * rate).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-zinc-300">
                                            <span>Instructor Onboarding Fee ({instructorsCount} × $5.00 once-off)</span>
                                            <span className="text-amber-400">+{symbol}{(totalInstructorOnboardingFees * rate).toFixed(2)}</span>
                                        </div>
                                        <div className="border-t border-zinc-700/80 pt-2 flex justify-between text-white font-bold text-sm">
                                            <span>Estimated First Invoice Total</span>
                                            <span className="text-emerald-400">
                                                {symbol}{((billingCycle === 'monthly' ? institutionMonthlyPrice : institutionYearlyPricePerYear) * rate + totalInstructorOnboardingFees * rate).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Enterprise Features Matrix */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        'Unlimited Department & Faculty Accreditation Roster',
                                        'Sovereign W3C Cryptographic DID Degree Issuance',
                                        'White-Label Institution Portal (Custom Domain & Logo)',
                                        'LMS Integrations: Moodle Academic Hub & Google Classroom',
                                        'Global Payment Processing via Paymytuition & Stripe',
                                        'Real-Time Student Analytics & Cohort Completion Logs',
                                        '99.99% Guaranteed SLA Uptime & Priority Support Lead',
                                        'Compliant with International Higher-Ed Data Standards'
                                    ].map((feat, idx) => (
                                        <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                                            <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                                            <span>{feat}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Activate Institution CTA */}
                                <div className="space-y-4 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => onSelectPlan('Institutional Academic Enterprise Plan')}
                                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-serif font-bold text-base shadow-xl hover:shadow-amber-900/30 transition flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <span>Deploy Institutional Academic Platform</span>
                                        <ArrowRight size={18} />
                                    </button>

                                    <div className="flex flex-wrap items-center justify-between text-xs text-zinc-400 font-mono gap-3 pt-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-zinc-500 text-[11px]">Supported Institution Wallets:</span>
                                            <div className="flex items-center gap-2">
                                                <PaymytuitionSvg className="w-5 h-5" />
                                                <StripeSvg className="w-5 h-5" />
                                                <PayPalSvg className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-amber-400">
                                            <Award size={14} />
                                            <span>Official Academic Charter Guarantee</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionView;