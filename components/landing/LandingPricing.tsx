import React, { useState } from 'react';
import { SubscriptionTier } from '../../types';
import { learnerSubscriptionTiers, instructorSubscriptionTiers, institutionSubscriptionTiers } from '../../constants';
import { Check, Star, Zap } from 'lucide-react';

interface LandingPricingProps {
    onGetStarted: () => void;
}

const PricingTierCard: React.FC<{ tier: SubscriptionTier; onSelect: () => void }> = ({ tier, onSelect }) => (
    <div
        className={`relative flex flex-col rounded-xl border transition-all duration-200 font-mono ${
            tier.featured 
                ? 'border-emerald-500/50 bg-[#0E1420] shadow-[0_0_25px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20' 
                : 'border-[#1A2230] bg-[#0B0E14] shadow-xl hover:border-zinc-700 hover:bg-[#10141D]'
        } p-7`}
    >
        {tier.featured && (
            <div className="absolute top-0 py-1 px-3 bg-emerald-500 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider text-black transform -translate-y-1/2 left-1/2 -translate-x-1/2 shadow-lg">
                RECOMMENDED // PRODUCTION
            </div>
        )}
        <h3 className="text-lg font-bold text-white">{tier.name}</h3>
        <p className="mt-2 text-xs text-zinc-400 h-10 leading-relaxed">{tier.idealFor}</p>

        <div className="mt-6 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-white">
                {tier.price > 0 ? `$${tier.price}` : 'Free'}
            </span>
            {tier.price > 0 && <span className="text-xs text-zinc-500 uppercase tracking-wider">/ mo</span>}
        </div>
        
        <ul className="mt-6 space-y-3 flex-grow">
            {tier.features.map((feature) => (
                <li key={feature} className="flex items-start text-xs text-zinc-300">
                    <div className="flex-shrink-0 p-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 mr-2.5 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                    </div>
                    <span>{feature}</span>
                </li>
            ))}
        </ul>
        
        <button
            onClick={onSelect}
            className={`mt-8 block w-full py-3 px-4 rounded-lg text-center text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                tier.featured
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-[#151C28] hover:bg-[#1A2333] text-zinc-200 hover:text-white border border-[#1E2536]'
            }`}
        >
            &gt; {tier.cta}
        </button>
    </div>
);

const LandingPricing: React.FC<LandingPricingProps> = ({ onGetStarted }) => {
    const [activeTab, setActiveTab] = useState<'learners' | 'instructors' | 'institutions'>('learners');

    const tiers = activeTab === 'learners' 
        ? learnerSubscriptionTiers 
        : activeTab === 'instructors' 
            ? instructorSubscriptionTiers 
            : institutionSubscriptionTiers;

    return (
        <div className="bg-[#08090A] text-zinc-100 font-sans antialiased pt-24 min-h-screen">
            <section className="py-20 bg-[#090C11] border-b border-[#1A2230]">
                <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
                    <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold block">// PRICING &amp; CAPACITY</span>
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
                        Predictable Compute Tiers
                    </h1>
                    <p className="text-zinc-400 text-sm sm:text-base font-mono max-w-2xl mx-auto">
                        Transparent, modular scaling for individual scholars, technical instructors, and continental universities.
                    </p>

                    {/* Selector Buttons */}
                    <div className="inline-flex p-1 bg-[#0B0E14] border border-[#1A2230] rounded-lg mt-6 font-mono text-xs">
                        <button
                            onClick={() => setActiveTab('learners')}
                            className={`px-4 py-2 rounded-md font-bold transition-colors cursor-pointer ${
                                activeTab === 'learners' ? 'bg-emerald-500 text-black shadow' : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            Learners
                        </button>
                        <button
                            onClick={() => setActiveTab('instructors')}
                            className={`px-4 py-2 rounded-md font-bold transition-colors cursor-pointer ${
                                activeTab === 'instructors' ? 'bg-emerald-500 text-black shadow' : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            Instructors
                        </button>
                        <button
                            onClick={() => setActiveTab('institutions')}
                            className={`px-4 py-2 rounded-md font-bold transition-colors cursor-pointer ${
                                activeTab === 'institutions' ? 'bg-emerald-500 text-black shadow' : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            Institutions
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-[#08090A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {tiers.map((tier) => (
                            <PricingTierCard key={tier.name} tier={tier} onSelect={onGetStarted} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPricing;
