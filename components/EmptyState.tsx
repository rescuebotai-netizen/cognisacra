import React from 'react';
import { BookOpen } from 'lucide-react';

interface EmptyStateProps {
    onBrowse: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onBrowse }) => {
    return (
        <div className="relative p-8 sm:p-10 rounded-xl border border-dashed border-[#1E2533] bg-[#0B0E14] text-center max-w-3xl mx-auto my-6 animate-fade-in shadow-xl">
            <div className="mx-auto w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center mb-4 text-emerald-400">
                <BookOpen className="w-5 h-5" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#101722] border border-[#1E2533] text-[10px] font-mono text-emerald-400 mb-2">
                <span>●</span>
                <span>WORKSPACE STATUS: EMPTY_QUEUE</span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100 tracking-tight mb-2">
                No Active Enrollments or Bookmarks
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed mb-6 font-mono">
                Your workspace queue has no active courses or saved repositories. Explore certified curriculum, interactive terminal modules, or neural tutoring tracks.
            </p>
            <button
                onClick={onBrowse}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold tracking-wider rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.25)] cursor-pointer transition active:scale-95"
            >
                <span>&gt;</span>
                <span>EXPLORE COURSE CATALOG</span>
            </button>
        </div>
    );
};

export default EmptyState;
