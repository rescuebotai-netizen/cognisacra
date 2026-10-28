import React, { useState } from 'react';
import { Course, UserProfile } from '../types';
import { 
    BarChart3, Users, BookOpen, Plus, Radio, ArrowUpRight, 
    Sparkles, CheckCircle2, Clock, Search, Filter, Eye, 
    Pencil, Play, Award, MessageSquare, ChevronRight, Send, 
    Star, Flame, FileText, Download, Check, ShieldCheck, Activity
} from 'lucide-react';

interface InstructorDashboardViewProps {
    courses: Course[];
    onEditCourse: (course: Course) => void;
    onViewCourse: (course: Course) => void;
    onCreateCourse: () => void;
    onViewAnalytics: (course: Course) => void;
    seekingMentorshipLearners: UserProfile[];
    subscriptionPlan: string | null;
    rejoinSession?: any;
    onRejoinSession?: () => void;
}

interface StudentRealtimeProgress {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    institution: string;
    program: string;
    enrolledCourse: string;
    currentLesson: string;
    progressPercentage: number;
    quizScoreAvg: number;
    streakDays: number;
    status: 'studying_now' | 'active_today' | 'idle';
    lastActive: string;
    modulesCompleted: number;
    totalModules: number;
    competencies: string[];
}

export const InstructorDashboardView: React.FC<InstructorDashboardViewProps> = ({ 
    courses, 
    onEditCourse, 
    onViewCourse, 
    onCreateCourse, 
    onViewAnalytics, 
    seekingMentorshipLearners, 
    subscriptionPlan,
    rejoinSession,
    onRejoinSession
}) => {
    const [courseFilter, setCourseFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [studentSearch, setStudentSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<StudentRealtimeProgress | null>(null);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Real-time student telemetry dataset
    const [realtimeStudents, setRealtimeStudents] = useState<StudentRealtimeProgress[]>([
        {
            id: 'stu-1',
            name: 'Sarah Mwangi',
            email: 'sarah.mwangi@uonbi.ac.ke',
            avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&q=80',
            institution: 'University of Nairobi',
            program: 'BSc. Distributed Systems & AI',
            enrolledCourse: 'Advanced Autonomous Agent Architectures',
            currentLesson: 'Module 3.2: Socratic Context Anchoring & Grounding',
            progressPercentage: 84,
            quizScoreAvg: 96,
            streakDays: 14,
            status: 'studying_now',
            lastActive: 'Active right now',
            modulesCompleted: 4,
            totalModules: 5,
            competencies: ['Byzantine Agreement', 'Vector Embedding Search', 'LTI 1.3 Advantage', 'Socratic Synthesis']
        },
        {
            id: 'stu-2',
            name: 'David Mensah',
            email: 'david.mensah@knust.edu.gh',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
            institution: 'KNUST Ghana',
            program: 'MSc. Electrical & Neural Networks',
            enrolledCourse: 'Distributed Systems & Byzantine Fault Tolerance',
            currentLesson: 'Module 2.1: Paxos vs Raft State Machines in Cloud Sandboxes',
            progressPercentage: 62,
            quizScoreAvg: 88,
            streakDays: 9,
            status: 'studying_now',
            lastActive: 'Active right now',
            modulesCompleted: 3,
            totalModules: 5,
            competencies: ['Raft State Replication', 'Consensus Latency Analysis', 'Distributed SQL']
        },
        {
            id: 'stu-3',
            name: 'Amina Bello',
            email: 'amina.bello@unilag.edu.ng',
            avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&q=80',
            institution: 'University of Lagos',
            program: 'BSc. Software Engineering',
            enrolledCourse: 'PostgreSQL Enterprise Architecture & Scale-to-Zero',
            currentLesson: 'Module 4.4: High-Concurrency ACID Isolation Benchmarks',
            progressPercentage: 92,
            quizScoreAvg: 94,
            streakDays: 21,
            status: 'studying_now',
            lastActive: 'Active right now',
            modulesCompleted: 4,
            totalModules: 4,
            competencies: ['PostgreSQL Partitioning', 'WAL Replication', 'Query Explain Plan Tuning']
        },
        {
            id: 'stu-4',
            name: 'Liam Van Der Merwe',
            email: 'liam.vdm@uct.ac.za',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
            institution: 'University of Cape Town',
            program: 'BSc. Data Science',
            enrolledCourse: 'Advanced Autonomous Agent Architectures',
            currentLesson: 'Module 1.4: Multi-Agent Swarm Orchestration',
            progressPercentage: 45,
            quizScoreAvg: 82,
            streakDays: 4,
            status: 'active_today',
            lastActive: '28 mins ago',
            modulesCompleted: 2,
            totalModules: 5,
            competencies: ['Python AsyncIO', 'LangGraph Patterns']
        },
        {
            id: 'stu-5',
            name: 'Elena Rostova',
            email: 'elena.rostova@faculty.ox.ac.uk',
            avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80',
            institution: 'Oxford Academic Exchange',
            program: 'Fellowship in Cognitive Systems',
            enrolledCourse: 'Distributed Systems & Byzantine Fault Tolerance',
            currentLesson: 'Module 5.1: Cross-Border Sovereign Ledger Accreditation',
            progressPercentage: 98,
            quizScoreAvg: 99,
            streakDays: 32,
            status: 'active_today',
            lastActive: '1 hour ago',
            modulesCompleted: 5,
            totalModules: 5,
            competencies: ['Cryptographic Verification', 'DID Specifications', 'ZKP Rollups']
        }
    ]);

    const handleSendStudentFeedback = (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedbackMessage.trim() || !selectedStudent) return;
        showToast(`Personalized feedback dispatched to ${selectedStudent.name}`);
        setFeedbackMessage('');
    };

    const filteredCourses = courses.filter(c => {
        if (courseFilter === 'published') return !c.isDraft;
        if (courseFilter === 'draft') return !!c.isDraft;
        return true;
    });

    const filteredStudents = realtimeStudents.filter(s => 
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.enrolledCourse.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.institution.toLowerCase().includes(studentSearch.toLowerCase())
    );

    return (
        <div className="w-full animate-fade-in space-y-6 text-left pb-16">
            
            {/* Dynamic Toast Feedback */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#141B26] text-emerald-400 font-mono text-xs shadow-2xl flex items-center gap-2 border border-emerald-500/30 animate-fade-in">
                    <CheckCircle2 size={15} />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Rejoin Live Class Banner if interrupted */}
            {rejoinSession && (
                <div id="instructor-rejoin-banner" className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl animate-fade-in">
                    <div className="flex items-center gap-3">
                         <div className="p-2.5 bg-emerald-500 text-black rounded-xl">
                              <Radio className="w-5 h-5 animate-pulse" />
                         </div>
                         <div>
                              <h3 className="text-sm font-bold text-white font-serif">Live Studio Session in Progress</h3>
                              <p className="text-xs text-zinc-300 font-mono mt-0.5">
                                   "{rejoinSession.title}" is currently live with {rejoinSession.attendeesCount || 18} scholars connected.
                              </p>
                         </div>
                    </div>
                    <button 
                         onClick={onRejoinSession}
                         className="px-4 py-2 text-xs font-mono font-bold text-black bg-emerald-500 hover:bg-emerald-400 rounded-xl shadow cursor-pointer transition flex items-center gap-1.5 shrink-0"
                    >
                         <span>Resume Live Studio &rarr;</span>
                    </button>
                </div>
            )}

            {/* Executive Header Banner */}
            <div className="bg-[#0E131C] p-6 sm:p-7 rounded-2xl shadow-xl border border-[#1E2536] space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                                Academic Command Center
                            </span>
                            {subscriptionPlan && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-semibold">
                                    {subscriptionPlan}
                                </span>
                            )}
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight flex items-center gap-2.5">
                            <BarChart3 className="text-emerald-400 w-7 h-7" />
                            <span>Faculty Executive Dashboard</span>
                        </h1>
                        <p className="text-xs sm:text-sm font-sans text-zinc-300 max-w-2xl leading-relaxed">
                            Monitor live student diagnostic velocity, review interactive submissions, launch AI curriculum workflows, and audit sovereign royalties.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 font-mono">
                        <button
                            onClick={onCreateCourse}
                            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-2"
                        >
                            <Sparkles size={14} />
                            <span>Create New Course (AI Builder)</span>
                        </button>
                    </div>
                </div>

                {/* Telemetry Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-3 border-t border-zinc-800/60 font-mono text-xs">
                    <div className="p-3.5 rounded-xl bg-[#141B26] space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase">
                            <span>Total Learners</span>
                            <Users size={12} className="text-emerald-400" />
                        </div>
                        <span className="text-xl font-bold text-white">1,428</span>
                        <span className="text-[9px] text-emerald-400 block">+18% this month</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#141B26] space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase">
                            <span>Studying Now</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        </div>
                        <span className="text-xl font-bold text-emerald-400">24 Active</span>
                        <span className="text-[9px] text-zinc-400 block">Real-time live session</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#141B26] space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase">
                            <span>Course Velocity</span>
                            <Activity size={12} className="text-emerald-400" />
                        </div>
                        <span className="text-xl font-bold text-white">78.4%</span>
                        <span className="text-[9px] text-emerald-400 block">Completion benchmark</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#141B26] space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase">
                            <span>Monthly Payout</span>
                            <span className="text-emerald-400 text-xs">$</span>
                        </div>
                        <span className="text-xl font-bold text-white">$4,820.00</span>
                        <span className="text-[9px] text-zinc-400 block">Disburses on 8th</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#141B26] space-y-1 col-span-2 sm:col-span-1">
                        <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase">
                            <span>Faculty Rating</span>
                            <Star size={12} className="text-amber-400 fill-amber-400" />
                        </div>
                        <span className="text-xl font-bold text-amber-300">4.94 / 5.0</span>
                        <span className="text-[9px] text-zinc-400 block">892 Scholar Reviews</span>
                    </div>
                </div>
            </div>

            {/* ============================================================
                SECTION 1: REAL-TIME STUDENTS & PROGRESS TELEMETRY
               ============================================================ */}
            <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl border border-[#1E2536] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800/60">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <h2 className="text-base font-bold font-serif text-white">Live Student Progress Telemetry</h2>
                        </div>
                        <p className="text-xs font-mono text-zinc-400">
                            Inspect active students in real time, view diagnostic assessments, and track individual syllabus mastery.
                        </p>
                    </div>

                    <div className="w-full sm:w-72">
                        <input
                            type="text"
                            value={studentSearch}
                            onChange={(e) => setStudentSearch(e.target.value)}
                            placeholder="Filter student, course, or university..."
                            className="w-full px-3 py-2 bg-[#141B26] border border-zinc-800 text-xs font-mono text-zinc-200 placeholder-zinc-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                        />
                    </div>
                </div>

                {/* Real-time Students Table / List */}
                <div className="overflow-x-auto">
                    <table className="w-full font-mono text-xs text-left">
                        <thead>
                            <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px]">
                                <th className="py-2.5 px-3">Student Scholar</th>
                                <th className="py-2.5 px-3">Enrolled Course</th>
                                <th className="py-2.5 px-3">Live Active Lesson</th>
                                <th className="py-2.5 px-3">Course Progress</th>
                                <th className="py-2.5 px-3">Quiz Score</th>
                                <th className="py-2.5 px-3">Telemetry</th>
                                <th className="py-2.5 px-3 text-right">Dossier</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {filteredStudents.map(student => (
                                <tr key={student.id} className="hover:bg-[#141B26]/60 transition">
                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="relative">
                                                <img 
                                                    src={student.avatarUrl} 
                                                    alt={student.name} 
                                                    className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/10" 
                                                />
                                                {student.status === 'studying_now' && (
                                                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0E131C] animate-pulse"></span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-xs">{student.name}</div>
                                                <div className="text-[10px] text-zinc-400 font-sans">{student.institution}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 text-zinc-300 font-sans text-xs max-w-[180px] truncate">
                                        {student.enrolledCourse}
                                    </td>
                                    <td className="py-3 px-3 text-zinc-300 text-[11px] max-w-[200px] truncate">
                                        {student.currentLesson}
                                    </td>
                                    <td className="py-3 px-3">
                                        <div className="w-28 space-y-1">
                                            <div className="flex justify-between text-[10px]">
                                                <span className="text-white font-bold">{student.progressPercentage}%</span>
                                                <span className="text-zinc-500">{student.modulesCompleted}/{student.totalModules} M</span>
                                            </div>
                                            <div className="w-full bg-[#141B26] h-1.5 rounded-full overflow-hidden">
                                                <div 
                                                    className="bg-emerald-500 h-full rounded-full transition-all duration-300" 
                                                    style={{ width: `${student.progressPercentage}%` }} 
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className={`font-bold ${student.quizScoreAvg >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {student.quizScoreAvg}%
                                        </span>
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                            student.status === 'studying_now'
                                                ? 'bg-emerald-500/15 text-emerald-400 flex items-center gap-1 w-max'
                                                : 'bg-zinc-800 text-zinc-400'
                                        }`}>
                                            {student.status === 'studying_now' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
                                            {student.lastActive}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 text-right">
                                        <button
                                            onClick={() => setSelectedStudent(student)}
                                            className="px-3 py-1.5 rounded-lg bg-[#141B26] hover:bg-emerald-500 hover:text-black text-zinc-300 text-[11px] font-bold transition flex items-center gap-1.5 ml-auto cursor-pointer"
                                        >
                                            <Eye size={12} />
                                            <span>Inspect Progress</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ============================================================
                SECTION 2: COURSE PORTFOLIO & MANAGEMENT
               ============================================================ */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                            <BookOpen size={18} className="text-emerald-400" />
                            <span>Curriculum Portfolio</span>
                        </h2>
                        <p className="text-xs font-mono text-zinc-400">
                            Active courses authored or co-directed across partner institutions.
                        </p>
                    </div>

                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0E131C] border border-[#1E2536] font-mono text-xs">
                        {(['all', 'published', 'draft'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setCourseFilter(tab)}
                                className={`px-3 py-1.5 rounded-lg capitalize transition cursor-pointer font-semibold ${
                                    courseFilter === tab
                                        ? 'bg-emerald-500 text-black font-bold'
                                        : 'text-zinc-400 hover:text-white'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredCourses.map(course => (
                        <div 
                            key={course.id} 
                            className="bg-[#0E131C] rounded-2xl shadow-xl border border-[#1E2536] overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition duration-200"
                        >
                            <div>
                                <div className="relative h-40 w-full overflow-hidden bg-[#141B26]">
                                    <img 
                                        src={course.imageUrl} 
                                        alt={course.title} 
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                                    />
                                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono font-bold text-emerald-400 uppercase">
                                        {course.category}
                                    </span>
                                    <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                                        course.isDraft 
                                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    }`}>
                                        {course.isDraft ? 'Draft' : 'Published'}
                                    </span>
                                </div>

                                <div className="p-5 space-y-2.5">
                                    <h3 className="text-base font-bold font-serif text-white line-clamp-1">{course.title}</h3>
                                    <p className="text-xs font-sans text-zinc-400 line-clamp-2 leading-relaxed">{course.description}</p>
                                    
                                    <div className="pt-2 border-t border-zinc-800/40 grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
                                        <div className="p-2 rounded-lg bg-[#141B26]">
                                            <span className="text-zinc-500 uppercase block">Modules</span>
                                            <span className="text-white font-bold text-xs">{course.modules?.length || 4}</span>
                                        </div>
                                        <div className="p-2 rounded-lg bg-[#141B26]">
                                            <span className="text-zinc-500 uppercase block">Scholars</span>
                                            <span className="text-emerald-400 font-bold text-xs">240+</span>
                                        </div>
                                        <div className="p-2 rounded-lg bg-[#141B26]">
                                            <span className="text-zinc-500 uppercase block">Rating</span>
                                            <span className="text-amber-300 font-bold text-xs">4.9 ★</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 pt-0 grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => onEditCourse(course)}
                                    className="py-2 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-xs font-mono font-semibold text-zinc-200 transition flex items-center justify-center gap-1 cursor-pointer"
                                >
                                    <Pencil size={12} />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={() => onViewCourse(course)}
                                    className="py-2 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-xs font-mono font-semibold text-zinc-200 transition flex items-center justify-center gap-1 cursor-pointer"
                                >
                                    <Eye size={12} />
                                    <span>View</span>
                                </button>
                                <button
                                    onClick={() => onViewAnalytics(course)}
                                    className="py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                                >
                                    <BarChart3 size={12} />
                                    <span>Analytics</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ============================================================
                STUDENT PROGRESS DOSSIER MODAL (INSPECT PROGRESS IN REAL TIME)
               ============================================================ */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#0E131C] border border-[#1E2536] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto">
                        <div className="flex items-start justify-between border-b border-zinc-800/60 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img 
                                        src={selectedStudent.avatarUrl} 
                                        alt={selectedStudent.name} 
                                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/40" 
                                    />
                                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-[#0E131C] animate-pulse"></span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-bold font-serif text-white">{selectedStudent.name}</h2>
                                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                                            {selectedStudent.status === 'studying_now' ? 'Online Now' : 'Active Today'}
                                        </span>
                                    </div>
                                    <p className="text-xs font-mono text-zinc-400">{selectedStudent.email}</p>
                                    <p className="text-xs font-sans text-zinc-300 mt-0.5">{selectedStudent.program} · {selectedStudent.institution}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="p-1 rounded-lg text-zinc-500 hover:text-white transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Real-time syllabus telemetry */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                            <div className="p-3 rounded-xl bg-[#141B26]">
                                <span className="text-[10px] text-zinc-400 uppercase block">Curriculum Velocity</span>
                                <span className="text-base font-bold text-emerald-400">{selectedStudent.progressPercentage}%</span>
                            </div>
                            <div className="p-3 rounded-xl bg-[#141B26]">
                                <span className="text-[10px] text-zinc-400 uppercase block">Diagnostic Score</span>
                                <span className="text-base font-bold text-white">{selectedStudent.quizScoreAvg}% Average</span>
                            </div>
                            <div className="p-3 rounded-xl bg-[#141B26]">
                                <span className="text-[10px] text-zinc-400 uppercase block">Study Streak</span>
                                <span className="text-base font-bold text-amber-300 flex items-center gap-1">
                                    <Flame size={14} className="fill-amber-400" />
                                    {selectedStudent.streakDays} Days
                                </span>
                            </div>
                            <div className="p-3 rounded-xl bg-[#141B26]">
                                <span className="text-[10px] text-zinc-400 uppercase block">Modules Cleared</span>
                                <span className="text-base font-bold text-white">{selectedStudent.modulesCompleted} of {selectedStudent.totalModules}</span>
                            </div>
                        </div>

                        {/* Active Lesson & Competencies */}
                        <div className="space-y-3 font-mono text-xs">
                            <div className="p-4 rounded-xl bg-[#141B26] border border-zinc-800 space-y-1">
                                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Currently Working On</span>
                                <div className="text-sm font-serif font-bold text-white">{selectedStudent.currentLesson}</div>
                                <div className="text-[11px] text-zinc-400 font-sans">Course: {selectedStudent.enrolledCourse}</div>
                            </div>

                            <div className="space-y-1.5">
                                <span className="text-[10px] text-zinc-400 uppercase font-bold">Demonstrated Competencies (Verified)</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedStudent.competencies.map((comp, i) => (
                                        <span key={i} className="px-2.5 py-1 rounded-lg bg-[#141B26] border border-emerald-500/20 text-emerald-400 text-[11px] flex items-center gap-1">
                                            <Check size={11} />
                                            <span>{comp}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Direct Feedback / Instruction Box */}
                        <form onSubmit={handleSendStudentFeedback} className="pt-2 border-t border-zinc-800/60 space-y-2">
                            <label className="text-xs font-mono font-semibold text-zinc-300 block">
                                Send Direct Socratic Feedback / Encouragement to Scholar
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={feedbackMessage}
                                    onChange={(e) => setFeedbackMessage(e.target.value)}
                                    placeholder="e.g. Excellent work on Byzantine consensus proof! Take a look at lesson 3.3 for Raft comparison."
                                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#141B26] border border-zinc-800 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                                >
                                    <Send size={13} />
                                    <span>Send</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default InstructorDashboardView;
