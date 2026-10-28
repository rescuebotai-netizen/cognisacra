import React from 'react';

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
    <div className="bg-[#0E131C] p-5 rounded-2xl shadow-xl flex items-center space-x-4 text-left">
        <div className={`p-3 rounded-xl ${color} flex items-center justify-center shrink-0`}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-xs font-mono text-zinc-400 truncate">{label}</p>
            <p className="text-xl font-bold font-mono text-white mt-0.5">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        </div>
    </div>
);

export default StatCard;
