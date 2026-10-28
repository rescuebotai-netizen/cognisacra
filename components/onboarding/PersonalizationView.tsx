import React, { useState } from 'react';
import { interests } from '../../constants';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface PersonalizationViewProps {
    onComplete: (interests: string[]) => void;
}

const InterestPill: React.FC<{
    name: string;
    icon: string;
    isSelected: boolean;
    onSelect: () => void;
}> = ({ name, icon, isSelected, onSelect }) => (
    <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSelect}
        className={`flex items-center p-3.5 rounded-xl border text-left transition-all duration-200 group ${
            isSelected 
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] font-semibold' 
                : 'bg-[#0E131C] border-[#1E2536] text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-[#141B26]'
        }`}
    >
        <span className="text-xl mr-3 group-hover:scale-110 transition-transform">{icon}</span>
        <span className="text-xs font-mono font-medium truncate flex-1">{name}</span>
        {isSelected && (
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center shrink-0 ml-1">
                <Check size={10} strokeWidth={3} />
            </span>
        )}
    </motion.button>
);

const PersonalizationView: React.FC<PersonalizationViewProps> = ({ onComplete }) => {
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const toggleInterest = (interestName: string) => {
        setSelectedInterests(prev => 
            prev.includes(interestName) 
            ? prev.filter(i => i !== interestName) 
            : [...prev, interestName]
        );
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-3xl p-6 sm:p-10 bg-[#0B0E14] border border-[#1A2230] rounded-2xl shadow-2xl text-zinc-100"
        >
            <div className="text-center space-y-2 mb-8">
                <motion.div 
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono"
                >
                    <Sparkles size={13} />
                    <span>CURRICULUM PERSONALIZATION ENGINE</span>
                </motion.div>
                <motion.h2 
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight"
                >
                    Select Your Academic Disciplines
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xs sm:text-sm text-zinc-400 font-sans max-w-lg mx-auto"
                >
                    Choose one or more domains to initialize personalized neural course recommendations and adaptive learning tracks.
                </motion.p>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
                {interests.map(interest => (
                    <InterestPill
                        key={interest.name}
                        name={interest.name}
                        icon={interest.icon}
                        isSelected={selectedInterests.includes(interest.name)}
                        onSelect={() => toggleInterest(interest.name)}
                    />
                ))}
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-8 pt-6 border-t border-[#1A2230] flex flex-col sm:flex-row items-center justify-between gap-4"
            >
                <div className="text-xs font-mono text-zinc-400">
                    <span className="text-emerald-400 font-bold">{selectedInterests.length}</span> disciplines selected
                </div>

                <button 
                    onClick={() => onComplete(selectedInterests.length > 0 ? selectedInterests : ['AI & Machine Learning'])}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:scale-105 active:scale-95"
                >
                    <span>Proceed to Workspace</span>
                    <ArrowRight size={14} />
                </button>
            </motion.div>
        </motion.div>
    );
};

export default PersonalizationView;