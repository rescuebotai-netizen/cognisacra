import React from 'react';
import { Job } from '../types';
import { Briefcase, MapPin, Building, Sparkles, CheckCircle2 } from 'lucide-react';

interface JobBoardViewProps {
    jobs: Job[];
    onApplyJob: (job: Job) => void;
}

const JobCard: React.FC<{ job: Job; onApply: (job: Job) => void; }> = ({ job, onApply }) => (
    <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 ease-in-out flex flex-col text-left border border-[#1E2536]">
        <div className="flex justify-between items-start gap-3">
            <div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                    <MapPin size={12} />
                    <span>{job.location}</span>
                </div>
                <h3 className="text-lg font-bold mt-1 text-white font-serif">{job.title}</h3>
                <div className="flex items-center gap-1 text-xs font-mono text-zinc-400 mt-0.5">
                    <Building size={12} />
                    <span>{job.company}</span>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                <span className="text-base font-bold font-mono text-emerald-400">{job.matchPercentage}%</span>
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Match</span>
            </div>
        </div>
        <div className="mt-4">
             <p className="text-[10px] font-mono uppercase tracking-wider font-semibold text-zinc-400">Target Competencies:</p>
             <div className="flex flex-wrap gap-1.5 mt-2">
                {job.skills.map(skill => (
                    <span key={skill} className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-[#141B26] text-zinc-300 border border-zinc-800/60">
                        {skill}
                    </span>
                ))}
            </div>
        </div>
        <div className="mt-6 flex-grow"></div>
        <button 
            onClick={() => onApply(job)}
            className="w-full mt-2 px-4 py-2.5 font-mono text-xs font-bold text-black bg-emerald-500 rounded-xl hover:bg-emerald-400 transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
            <Sparkles size={13} />
            <span>Apply With Sovereign Credential</span>
        </button>
    </div>
);

const JobBoardView: React.FC<JobBoardViewProps> = ({ jobs, onApplyJob }) => {
    return (
        <div className="w-full animate-fade-in space-y-6 text-left pb-16">
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0E131C] shadow-xl border border-[#1E2536] space-y-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                        CogniSacra Sovereign Placement Network
                    </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif flex items-center gap-3">
                    <Briefcase className="w-7 h-7 text-emerald-400" />
                    <span>Career & Industry Opportunities</span>
                </h1>
                <p className="text-xs sm:text-sm font-sans text-zinc-300 max-w-2xl">
                    Direct recruitment pipelines matching your verified academic credentials and course competencies with accredited institutional and enterprise partners.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobs.map(job => (
                    <JobCard key={job.id} job={job} onApply={onApplyJob} />
                ))}
            </div>
        </div>
    );
};

export default JobBoardView;
