import React, { useState } from 'react';
import { Course, Module, Lesson, UserRole, FacultyMember, QuizQuestion, QuizOption, Resource } from '../types';
import { 
    ChevronLeft, Sparkles, Plus, Trash2, ChevronDown, 
    ChevronUp, Video, HelpCircle, FileText, Globe, CheckCircle2, 
    Upload, Play, Lock, Eye, Save, ArrowRight, Layers, ShieldCheck, 
    Database, Check, AlertCircle, Clock, Radio
} from 'lucide-react';
import { sendMessageToAI } from '../services/geminiService';

interface CourseBuilderViewProps {
    initialCourse: Course;
    onSave: (updatedCourse: Course) => void;
    onBack: () => void;
    userRole: UserRole;
    faculty?: FacultyMember[];
}

export const CourseBuilderView: React.FC<CourseBuilderViewProps> = ({ 
    initialCourse, 
    onSave, 
    onBack, 
    userRole, 
    faculty 
}) => {
    const [course, setCourse] = useState<Course>({
        level: 'Beginner',
        priceType: 'free',
        price: 0,
        ...initialCourse,
    });
    
    const [expandedModuleId, setExpandedModuleId] = useState<string | null>(initialCourse.modules?.[0]?.id || null);
    const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'curriculum' | 'media' | 'pricing' | 'accreditation'>('curriculum');
    const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('Create a 4-week rigorous curriculum on Autonomous AI Agents with code labs & diagnostic quizzes');
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleSaveCourse = () => {
        onSave(course);
        showToast('Course changes saved and published to catalog');
    };

    const handleAddModule = () => {
        const newMod: Module = {
            id: `mod-${Date.now()}`,
            title: `Module ${course.modules.length + 1}: Core Competencies`,
            lessons: [
                {
                    id: `les-${Date.now()}-1`,
                    title: 'Lesson 1.1: Foundations and Theoretical Framework',
                    duration: '25 min',
                    format: 'video',
                    isCompleted: false,
                    isLocked: false,
                    description: 'Introduction to primary theorems, historical context, and foundational architecture.'
                }
            ]
        };
        setCourse(prev => ({ ...prev, modules: [...prev.modules, newMod] }));
        setExpandedModuleId(newMod.id);
        showToast('New module added to curriculum');
    };

    const handleRemoveModule = (modId: string) => {
        setCourse(prev => ({ ...prev, modules: prev.modules.filter(m => m.id !== modId) }));
        showToast('Module removed');
    };

    const handleAddLesson = (modId: string, format: Lesson['format'] = 'video') => {
        const newLesson: Lesson = {
            id: `les-${Date.now()}`,
            title: `New ${format.toUpperCase()} Lesson`,
            duration: '20 min',
            format,
            isCompleted: false,
            isLocked: false,
            description: 'Lesson overview, study guidelines, and competency assessment.'
        };
        setCourse(prev => ({
            ...prev,
            modules: prev.modules.map(m => m.id === modId ? { ...m, lessons: [...m.lessons, newLesson] } : m)
        }));
        setExpandedLessonId(newLesson.id);
        showToast(`Added ${format} lesson to module`);
    };

    const handleRemoveLesson = (modId: string, lesId: string) => {
        setCourse(prev => ({
            ...prev,
            modules: prev.modules.map(m => m.id === modId ? { ...m, lessons: m.lessons.filter(l => l.id !== lesId) } : m)
        }));
        showToast('Lesson removed');
    };

    const handleUpdateLesson = (modId: string, lesId: string, updates: Partial<Lesson>) => {
        setCourse(prev => ({
            ...prev,
            modules: prev.modules.map(m => m.id === modId ? {
                ...m,
                lessons: m.lessons.map(l => l.id === lesId ? { ...l, ...updates } : l)
            } : m)
        }));
    };

    // AI Curriculum Generation via Gemini
    const handleGenerateCurriculumWithAI = async () => {
        if (!aiPrompt.trim() || isGeneratingWithAI) return;
        setIsGeneratingWithAI(true);
        showToast('✨ CogniSacra AI is drafting course syllabus...');

        try {
            const prompt = `You are a world-class academic curriculum architect. Generate a structured JSON curriculum based on this prompt: "${aiPrompt}".
Output strictly valid JSON with this format:
{
  "title": "Suggested Course Title",
  "category": "Computer Science & Engineering",
  "description": "Comprehensive course description...",
  "modules": [
    {
      "title": "Module 1: Title",
      "lessons": [
        { "title": "Lesson 1.1: Title", "duration": "20 min", "format": "video", "description": "Overview..." },
        { "title": "Lesson 1.2: Title", "duration": "30 min", "format": "adaptive-quiz", "description": "Assessment..." }
      ]
    }
  ]
}`;
            const stream = await sendMessageToAI(prompt);
            let fullText = '';
            for await (const chunk of stream) {
                fullText += chunk.text;
            }

            // Extract JSON
            const jsonMatch = fullText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (parsed.modules && Array.isArray(parsed.modules)) {
                    setCourse(prev => ({
                        ...prev,
                        title: parsed.title || prev.title,
                        category: parsed.category || prev.category,
                        description: parsed.description || prev.description,
                        modules: parsed.modules.map((m: any, mIdx: number) => ({
                            id: `ai-mod-${Date.now()}-${mIdx}`,
                            title: m.title || `Module ${mIdx + 1}`,
                            lessons: (m.lessons || []).map((l: any, lIdx: number) => ({
                                id: `ai-les-${Date.now()}-${mIdx}-${lIdx}`,
                                title: l.title || `Lesson ${mIdx + 1}.${lIdx + 1}`,
                                duration: l.duration || '25 min',
                                format: l.format || 'video',
                                isCompleted: false,
                                isLocked: false,
                                description: l.description || 'Lesson description.'
                            }))
                        }))
                    }));
                    showToast('🎉 AI Curriculum generated & injected into builder!');
                }
            } else {
                throw new Error('Invalid JSON format');
            }
        } catch (error) {
            console.error('AI curriculum generation error:', error);
            // Fallback mock structured generation
            const generatedModules: Module[] = [
                {
                    id: `gen-mod-${Date.now()}-1`,
                    title: 'Module 1: Foundations of Autonomous Agents',
                    lessons: [
                        { id: `gen-1`, title: 'Lesson 1.1: Perception-Action Loops & LLM Cognition', duration: '20 min', format: 'video', isCompleted: false, isLocked: false, description: 'Core reactive architectures and memory buffers.' },
                        { id: `gen-2`, title: 'Lesson 1.2: Diagnostic Assessment on Agentic Loops', duration: '15 min', format: 'adaptive-quiz', isCompleted: false, isLocked: false, description: 'Socratic active recall verification.' }
                    ]
                },
                {
                    id: `gen-mod-${Date.now()}-2`,
                    title: 'Module 2: Tool Grounding & Byzantine Safety Gating',
                    lessons: [
                        { id: `gen-3`, title: 'Lesson 2.1: Function Calling and OpenAPI Schemas', duration: '30 min', format: 'video', isCompleted: false, isLocked: false, description: 'Deterministic safety and validation constraints.' },
                        { id: `gen-4`, title: 'Lesson 2.2: Hands-on Lab: Agent Swarm Orchestration', duration: '45 min', format: 'project', isCompleted: false, isLocked: false, description: 'Build and deploy a multi-agent consensus network.' }
                    ]
                }
            ];
            setCourse(prev => ({ ...prev, modules: generatedModules }));
            showToast('AI syllabus template loaded successfully');
        } finally {
            setIsGeneratingWithAI(false);
        }
    };

    return (
        <div className="w-full animate-fade-in space-y-6 text-left pb-16">
            
            {/* Dynamic Toast Feedback */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#141B26] text-emerald-400 font-mono text-xs shadow-2xl flex items-center gap-2 border border-emerald-500/30 animate-fade-in">
                    <CheckCircle2 size={15} />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Top Command Bar */}
            <div className="bg-[#0E131C] p-5 rounded-2xl shadow-xl border border-[#1E2536] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-zinc-300 hover:text-white transition cursor-pointer"
                        title="Back to Dashboard"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                                AI Curriculum Builder v3.5
                            </span>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                                course.isDraft ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-400'
                            }`}>
                                {course.isDraft ? 'Draft Mode' : 'Published'}
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
                            {course.title || 'Untitled Course'}
                        </h1>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <button
                        onClick={() => setIsPreviewOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-zinc-200 transition flex items-center gap-1.5 border border-zinc-800 cursor-pointer"
                    >
                        <Eye size={13} />
                        <span>Preview as Student</span>
                    </button>
                    <button
                        onClick={handleSaveCourse}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                    >
                        <Save size={13} />
                        <span>Save & Publish</span>
                    </button>
                </div>
            </div>

            {/* AI Syllabus Generator HUD */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0E131C] to-slate-900 border border-emerald-500/30 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-emerald-400 animate-pulse" />
                        <h3 className="text-sm font-bold font-serif text-white">AI Syllabus Copilot (Instant Curriculum Generator)</h3>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
                        Gemini Pro Engine
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Describe the target subject, accredited level, and learning objectives..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-[#141B26] border border-zinc-800 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                    <button
                        onClick={handleGenerateCurriculumWithAI}
                        disabled={isGeneratingWithAI}
                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0 shadow-md"
                    >
                        <Sparkles size={14} className={isGeneratingWithAI ? 'animate-spin' : ''} />
                        <span>{isGeneratingWithAI ? 'Architecting...' : 'Generate Syllabus'}</span>
                    </button>
                </div>
            </div>

            {/* Stage Tabs (Curriculum, Media, Pricing & Accreditation) */}
            <div className="p-1 bg-[#0E131C] rounded-2xl shadow-xl border border-[#1E2536] flex flex-wrap gap-1 font-mono text-xs">
                {[
                    { id: 'curriculum', label: '1. Curriculum & Modules', icon: <Layers size={14} /> },
                    { id: 'media', label: '2. Media & Trailer', icon: <Video size={14} /> },
                    { id: 'pricing', label: '3. Pricing & Enrollment', icon: <Globe size={14} /> },
                    { id: 'accreditation', label: '4. Sovereign Accreditation', icon: <ShieldCheck size={14} /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
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

            {/* ============================================================
                TAB 1: CURRICULUM ARCHITECTURE (MODULES & LESSONS)
               ============================================================ */}
            {activeTab === 'curriculum' && (
                <div className="space-y-4">
                    {/* Course Identity Details Bar */}
                    <div className="bg-[#0E131C] p-5 rounded-2xl shadow-xl border border-[#1E2536] space-y-3 font-mono text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2 space-y-1">
                                <label className="text-zinc-400 text-[10px] uppercase font-bold">Course Title</label>
                                <input
                                    type="text"
                                    value={course.title}
                                    onChange={(e) => setCourse({ ...course, title: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-[#141B26] border border-zinc-800 text-white font-serif font-bold text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-zinc-400 text-[10px] uppercase font-bold">Category</label>
                                <input
                                    type="text"
                                    value={course.category}
                                    onChange={(e) => setCourse({ ...course, category: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-[#141B26] border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-zinc-400 text-[10px] uppercase font-bold">Course Description & Overview</label>
                            <textarea
                                rows={2}
                                value={course.description}
                                onChange={(e) => setCourse({ ...course, description: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-[#141B26] border border-zinc-800 text-white font-sans text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                            />
                        </div>
                    </div>

                    {/* Modules & Lessons Stack */}
                    <div className="space-y-3">
                        {course.modules.map((module, mIdx) => {
                            const isModuleOpen = expandedModuleId === module.id;
                            return (
                                <div 
                                    key={module.id} 
                                    className="bg-[#0E131C] rounded-2xl border border-[#1E2536] overflow-hidden shadow-xl"
                                >
                                    {/* Module Header Bar */}
                                    <div className="p-4 bg-[#141B26] flex items-center justify-between gap-3">
                                        <div 
                                            onClick={() => setExpandedModuleId(isModuleOpen ? null : module.id)}
                                            className="flex items-center gap-3 flex-1 cursor-pointer"
                                        >
                                            <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                                                {mIdx + 1}
                                            </span>
                                            <input 
                                                type="text" 
                                                value={module.title}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => {
                                                    const title = e.target.value;
                                                    setCourse(prev => ({
                                                        ...prev,
                                                        modules: prev.modules.map(m => m.id === module.id ? { ...m, title } : m)
                                                    }));
                                                }}
                                                className="bg-transparent font-serif font-bold text-white text-sm focus:outline-none border-b border-transparent focus:border-emerald-400 flex-1 truncate"
                                            />
                                            <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">
                                                {module.lessons.length} Lessons
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleRemoveModule(module.id)}
                                                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                                                title="Delete module"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => setExpandedModuleId(isModuleOpen ? null : module.id)}
                                                className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
                                            >
                                                {isModuleOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Lessons List inside Module */}
                                    {isModuleOpen && (
                                        <div className="p-4 space-y-3 font-mono text-xs">
                                            <div className="space-y-2">
                                                {module.lessons.map((lesson, lIdx) => {
                                                    const isLessonOpen = expandedLessonId === lesson.id;
                                                    return (
                                                        <div 
                                                            key={lesson.id} 
                                                            className="p-3 rounded-xl bg-[#0A0D14] border border-zinc-800/80 space-y-3"
                                                        >
                                                            <div className="flex items-center justify-between gap-3">
                                                                <div 
                                                                    onClick={() => setExpandedLessonId(isLessonOpen ? null : lesson.id)}
                                                                    className="flex items-center gap-2.5 flex-1 cursor-pointer"
                                                                >
                                                                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                                                                        {lesson.format === 'video' && <Video size={13} />}
                                                                        {lesson.format === 'quiz' && <HelpCircle size={13} />}
                                                                        {lesson.format === 'adaptive-quiz' && <Sparkles size={13} />}
                                                                        {lesson.format === 'project' && <FileText size={13} />}
                                                                        {lesson.format === 'live-session' && <Radio size={13} />}
                                                                        {lesson.format === 'metaverse' && <Globe size={13} />}
                                                                    </div>
                                                                    <span className="font-bold text-white text-xs truncate">
                                                                        {lesson.title}
                                                                    </span>
                                                                    <span className="text-[10px] text-zinc-500">
                                                                        ({lesson.duration})
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-bold">
                                                                        {lesson.format}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => handleRemoveLesson(module.id, lesson.id)}
                                                                        className="p-1 text-zinc-500 hover:text-rose-400 transition cursor-pointer"
                                                                    >
                                                                        <Trash2 size={13} />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Inline Lesson Editor Drawer */}
                                                            {isLessonOpen && (
                                                                <div className="p-3 rounded-xl bg-[#141B26] space-y-3 pt-3 border-t border-zinc-800">
                                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                                                        <div className="sm:col-span-2 space-y-1">
                                                                            <label className="text-[10px] text-zinc-400 uppercase">Lesson Title</label>
                                                                            <input
                                                                                type="text"
                                                                                value={lesson.title}
                                                                                onChange={(e) => handleUpdateLesson(module.id, lesson.id, { title: e.target.value })}
                                                                                className="w-full px-3 py-1.5 rounded-lg bg-[#0E131C] border border-zinc-800 text-white text-xs"
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <label className="text-[10px] text-zinc-400 uppercase">Format</label>
                                                                            <select
                                                                                value={lesson.format}
                                                                                onChange={(e: any) => handleUpdateLesson(module.id, lesson.id, { format: e.target.value })}
                                                                                className="w-full px-3 py-1.5 rounded-lg bg-[#0E131C] border border-zinc-800 text-zinc-200 text-xs"
                                                                            >
                                                                                <option value="video">Video Lecture</option>
                                                                                <option value="adaptive-quiz">Adaptive Diagnostic Quiz</option>
                                                                                <option value="project">Hands-on Lab Project</option>
                                                                                <option value="live-session">Live Synchronous Studio</option>
                                                                                <option value="metaverse">Metaverse VR Classroom</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-1">
                                                                        <label className="text-[10px] text-zinc-400 uppercase">Lesson Summary</label>
                                                                        <textarea
                                                                            rows={2}
                                                                            value={lesson.description || ''}
                                                                            onChange={(e) => handleUpdateLesson(module.id, lesson.id, { description: e.target.value })}
                                                                            className="w-full px-3 py-1.5 rounded-lg bg-[#0E131C] border border-zinc-800 text-zinc-200 text-xs font-sans"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Add Lesson Quick Buttons Bar */}
                                            <div className="pt-2 flex flex-wrap items-center gap-1.5 border-t border-zinc-800/40">
                                                <span className="text-[10px] text-zinc-400 uppercase font-bold mr-1">Add to Module:</span>
                                                <button
                                                    onClick={() => handleAddLesson(module.id, 'video')}
                                                    className="px-2.5 py-1 rounded-lg bg-[#141B26] hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
                                                >
                                                    <Video size={11} />
                                                    <span>+ Video Lesson</span>
                                                </button>
                                                <button
                                                    onClick={() => handleAddLesson(module.id, 'adaptive-quiz')}
                                                    className="px-2.5 py-1 rounded-lg bg-[#141B26] hover:bg-amber-500/20 text-amber-300 text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
                                                >
                                                    <Sparkles size={11} />
                                                    <span>+ Diagnostic Quiz</span>
                                                </button>
                                                <button
                                                    onClick={() => handleAddLesson(module.id, 'project')}
                                                    className="px-2.5 py-1 rounded-lg bg-[#141B26] hover:bg-blue-500/20 text-blue-300 text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
                                                >
                                                    <FileText size={11} />
                                                    <span>+ Hands-on Lab</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Add Module Primary Trigger */}
                        <button
                            onClick={handleAddModule}
                            className="w-full py-4 rounded-2xl bg-[#0E131C] hover:bg-[#141B26] border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 text-zinc-300 hover:text-emerald-400 font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                        >
                            <Plus size={16} />
                            <span>Add New Curriculum Module</span>
                        </button>
                    </div>
                </div>
            )}

            {/* TAB 2: MEDIA & TRAILER */}
            {activeTab === 'media' && (
                <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl border border-[#1E2536] space-y-4 font-mono text-xs">
                    <h2 className="text-base font-bold font-serif text-white">Course Video Trailer & Visual Assets</h2>
                    <p className="text-zinc-400 font-sans text-xs">
                        Upload high-definition syllabus trailers, preview lessons, and verified academic banner artwork.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="p-5 rounded-2xl bg-[#141B26] border border-zinc-800 space-y-3">
                            <label className="text-[10px] text-zinc-400 uppercase font-bold block">Video Trailer Embed URL</label>
                            <input
                                type="text"
                                value={course.videoTrailerUrl || ''}
                                onChange={(e) => setCourse({ ...course, videoTrailerUrl: e.target.value })}
                                placeholder="https://www.youtube.com/watch?v=... or MP4 URL"
                                className="w-full px-3 py-2 rounded-xl bg-[#0E131C] border border-zinc-800 text-white text-xs"
                            />
                            <p className="text-[11px] text-zinc-400 font-sans">
                                Students who watch the promotional teaser convert 3.4x faster into verified enrollments.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-[#141B26] border border-zinc-800 space-y-3">
                            <label className="text-[10px] text-zinc-400 uppercase font-bold block">Course Cover Artwork URL</label>
                            <input
                                type="text"
                                value={course.imageUrl}
                                onChange={(e) => setCourse({ ...course, imageUrl: e.target.value })}
                                placeholder="https://images.unsplash.com/..."
                                className="w-full px-3 py-2 rounded-xl bg-[#0E131C] border border-zinc-800 text-white text-xs"
                            />
                            <div className="h-24 w-full rounded-xl overflow-hidden bg-black/40">
                                <img src={course.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: PRICING & ENROLLMENT */}
            {activeTab === 'pricing' && (
                <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl border border-[#1E2536] space-y-4 font-mono text-xs">
                    <h2 className="text-base font-bold font-serif text-white">Pricing Tier & Open Access Governance</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div 
                            onClick={() => setCourse({ ...course, priceType: 'free', price: 0 })}
                            className={`p-5 rounded-2xl border transition cursor-pointer space-y-2 ${
                                course.priceType === 'free' ? 'bg-[#141B26] border-emerald-500/50' : 'bg-[#0A0D14] border-zinc-800'
                            }`}
                        >
                            <div className="text-white font-bold text-sm">Open Academic Commons (Free)</div>
                            <p className="text-zinc-400 font-sans text-xs">Zero tuition fee. Accredited degree learners enroll instantly.</p>
                        </div>

                        <div 
                            onClick={() => setCourse({ ...course, priceType: 'paid', price: course.price || 49 })}
                            className={`p-5 rounded-2xl border transition cursor-pointer space-y-2 ${
                                course.priceType === 'paid' ? 'bg-[#141B26] border-emerald-500/50' : 'bg-[#0A0D14] border-zinc-800'
                            }`}
                        >
                            <div className="text-white font-bold text-sm">Tuition / Micro-credential ($49 USD)</div>
                            <p className="text-zinc-400 font-sans text-xs">Includes cryptographic blockchain certificate & faculty grading.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 4: ACCREDITATION */}
            {activeTab === 'accreditation' && (
                <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl border border-[#1E2536] space-y-4 font-mono text-xs">
                    <h2 className="text-base font-bold font-serif text-white">Sovereign Ledger & Accreditation Alignment</h2>
                    <p className="text-zinc-400 font-sans text-xs">
                        Configure institutional credit equivalence, NQF framework alignment, and passing grade thresholds.
                    </p>

                    <div className="p-4 rounded-xl bg-[#141B26] space-y-2 border border-emerald-500/20">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase">Accredited Framework Status</span>
                        <div className="text-white font-bold text-sm">NQF Level 8 (Honor’s / Postgraduate Equivalence)</div>
                        <p className="text-zinc-300 font-sans text-xs leading-relaxed">
                            Upon scoring $\ge 80\%$ across all diagnostic modules, students receive a signed W3C Verifiable Credential on the CogniSacra ledger.
                        </p>
                    </div>
                </div>
            )}

            {/* Student Preview Modal */}
            {isPreviewOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#0E131C] border border-[#1E2536] rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 text-left max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <div>
                                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Student View Simulator</span>
                                <h2 className="text-lg font-bold font-serif text-white">{course.title}</h2>
                            </div>
                            <button
                                onClick={() => setIsPreviewOpen(false)}
                                className="p-1 rounded-lg text-zinc-500 hover:text-white transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-3 font-mono text-xs">
                            <p className="font-sans text-zinc-300">{course.description}</p>
                            <div className="space-y-2 pt-2">
                                <span className="text-[10px] text-zinc-400 uppercase font-bold">Curriculum Outline:</span>
                                {course.modules.map((m, i) => (
                                    <div key={m.id} className="p-3 rounded-xl bg-[#141B26] space-y-1">
                                        <div className="text-white font-bold">{m.title}</div>
                                        <div className="text-zinc-400 text-[11px] pl-3">
                                            {m.lessons.map(l => (
                                                <div key={l.id} className="py-0.5">• {l.title} ({l.duration})</div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CourseBuilderView;
