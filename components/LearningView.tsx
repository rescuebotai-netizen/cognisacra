import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Course, Lesson, DiscussionPost, Annotation } from '../types';
import { 
    ChevronLeft, 
    List, 
    MessageSquare, 
    Edit, 
    Sparkles, 
    Check, 
    X, 
    BookOpen,
    ArrowLeft,
    CheckCircle2,
    Clock,
    Play,
    Send,
    ShieldCheck,
    Award,
    Zap,
    Flame,
    ArrowRight
} from 'lucide-react';
import { sendMessageToAI } from '../services/geminiService';
import { getLessonIcon } from './utils/uiUtils';

type SidebarTab = 'syllabus' | 'notes' | 'annotations';
type InfoTab = 'transcript' | 'discussion';

interface LearningViewProps {
    course: Course;
    lesson: Lesson;
    onBack: () => void;
    onCompleteLesson: (lesson: Lesson) => void;
    onNavigateLesson: (lesson: Lesson) => void;
}

const NotesPanel: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
    const [notes, setNotes] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);

    useEffect(() => {
        try {
            const savedNotes = localStorage.getItem(`cognisacra-notes-${lesson.id}`);
            if (savedNotes) {
                setNotes(savedNotes);
            } else {
                setNotes('');
            }
        } catch (error) {
            console.error("Failed to read notes from localStorage", error);
        }
    }, [lesson.id]);

    useEffect(() => {
        const handler = setTimeout(() => {
            try {
                localStorage.setItem(`cognisacra-notes-${lesson.id}`, notes);
            } catch (error) {
                console.error("Failed to save notes to localStorage", error);
            }
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [notes, lesson.id]);

    const handleSummarize = async () => {
        if (!lesson.transcript || isSummarizing) return;
        setIsSummarizing(true);
        
        const originalNotes = notes.trim();
        const summaryHeader = originalNotes ? "\n\n**AI Synthesis:**\n" : "**AI Synthesis:**\n";

        try {
            const prompt = `Summarize the key points of the following lesson transcript into a concise, bulleted list:\n\n---\n\n${lesson.transcript}`;
            const stream = await sendMessageToAI(prompt);
            let summaryText = '';
            
            setNotes(originalNotes + summaryHeader + '...');

            for await (const chunk of stream) {
                summaryText += chunk.text;
                setNotes(originalNotes + summaryHeader + summaryText);
            }
        } catch (error) {
            console.error('Error summarizing:', error);
            setNotes(originalNotes + summaryHeader + "Unable to generate summary. Please review transcript directly.");
        } finally {
            setIsSummarizing(false);
        }
    };

    return (
        <div className="p-4 h-full flex flex-col space-y-3 text-left">
            <h3 className="text-sm font-bold text-white font-serif">Study Cockpit Notes</h3>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Document your thoughts, equations, and insights..."
                className="w-full flex-1 p-3 rounded-xl bg-[#141B26] text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none"
            />
            {lesson.transcript && (
                <button
                    onClick={handleSummarize}
                    disabled={isSummarizing}
                    className="w-full flex items-center justify-center py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-mono text-xs font-bold transition disabled:opacity-40 cursor-pointer"
                >
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span>{isSummarizing ? 'Synthesizing...' : 'AI Auto-Summarize'}</span>
                </button>
            )}
        </div>
    );
};

const AnnotationsPanel: React.FC<{ annotations: Annotation[]; onSelectAnnotation: (id: string) => void }> = ({ annotations, onSelectAnnotation }) => {
    return (
        <div className="p-4 h-full flex flex-col text-left space-y-3">
            <h3 className="text-sm font-bold text-white font-serif">Transcript Annotations</h3>
            {annotations.length === 0 ? (
                <p className="text-xs font-mono text-zinc-400">Select text in the transcript to attach marginal notes.</p>
            ) : (
                <div className="space-y-2.5 overflow-y-auto no-scrollbar">
                    {annotations.map(anno => (
                        <div 
                            key={anno.id} 
                            onClick={() => onSelectAnnotation(anno.id)} 
                            className="p-3 bg-[#141B26] rounded-xl cursor-pointer hover:bg-[#1A2332] transition space-y-1 text-xs"
                        >
                            <p className="font-mono text-emerald-400 italic truncate text-[11px]">"{anno.text}"</p>
                            <p className="text-zinc-200 font-sans">{anno.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const SyllabusPanel: React.FC<{ course: Course; currentLessonId: string; onNavigateLesson: (lesson: Lesson) => void; }> = ({ course, currentLessonId, onNavigateLesson }) => (
    <div className="p-4 text-left space-y-4">
        <h3 className="text-sm font-bold text-white font-serif">{course.title}</h3>
        <div className="space-y-4">
            {course.modules.map((module, mIdx) => (
                <div key={module.id} className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                        Module {String(mIdx + 1).padStart(2, '0')}: {module.title}
                    </span>
                    <div className="space-y-1">
                        {module.lessons.map(lesson => {
                            const isCurrent = lesson.id === currentLessonId;
                            return (
                                <button
                                    key={lesson.id}
                                    onClick={() => onNavigateLesson(lesson)}
                                    className={`w-full text-left p-2.5 rounded-xl flex items-center transition cursor-pointer text-xs font-mono ${
                                        isCurrent
                                            ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                                            : 'hover:bg-[#141B26] text-zinc-300'
                                    }`}
                                >
                                    <div className="mr-2.5 shrink-0 text-emerald-400">
                                        {lesson.isCompleted ? <CheckCircle2 size={14} /> : getLessonIcon(lesson.format, "w-3.5 h-3.5")}
                                    </div>
                                    <span className="truncate flex-1">{lesson.title}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const getYouTubeEmbedUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
};

export const LearningView: React.FC<LearningViewProps> = ({ 
    course, 
    lesson, 
    onBack, 
    onCompleteLesson, 
    onNavigateLesson 
}) => {
    const [sidebarTab, setSidebarTab] = useState<SidebarTab>('syllabus');
    const [infoTab, setInfoTab] = useState<InfoTab>('transcript');
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [activeAnnotation, setActiveAnnotation] = useState<Annotation | null>(null);
    const [isAnnotationModalOpen, setAnnotationModalOpen] = useState(false);
    const [selection, setSelection] = useState<{ text: string; rect: DOMRect; range: Range } | null>(null);
    const [newAnnotationComment, setNewAnnotationComment] = useState('');
    const transcriptContainerRef = useRef<HTMLDivElement>(null);

    // Quiz states
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
    const [score, setScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [quizAttempts, setQuizAttempts] = useState(1);

    const questions = lesson.quizQuestions || [];
    const passingScorePercentage = 70;
    const userScorePercentage = questions.length > 0 ? (score / questions.length) * 100 : 0;
    const hasPassed = userScorePercentage >= passingScorePercentage;

    // Premium Completion Celebration States
    const [isMintingProof, setIsMintingProof] = useState(false);
    const [celebrateBurst, setCelebrateBurst] = useState(false);

    const handleMarkCompleteClick = () => {
        if (lesson.format === 'quiz' && !hasPassed) return;
        setIsMintingProof(true);
        setCelebrateBurst(true);
        setTimeout(() => {
            setIsMintingProof(false);
            onCompleteLesson(lesson);
            setTimeout(() => setCelebrateBurst(false), 3000);
        }, 650);
    };

    const handleCheckItem = (id: string) => {
        setCheckedItems(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleSelectOption = (optionId: string) => {
        if (feedback) return;
        setSelectedOptionId(optionId);
    };

    const handleSubmitAnswer = () => {
        if (!selectedOptionId) return;
        const currentQ = questions[currentQuestionIndex];
        const isCorrect = selectedOptionId === currentQ.correctOptionId;
        if (isCorrect) setScore(s => s + 1);
        setFeedback({
            isCorrect,
            explanation: isCorrect 
                ? "Correct! Your deduction aligns with the core theorem."
                : `Incorrect. The required outcome is based on ${currentQ.options.find(o => o.id === currentQ.correctOptionId)?.text}.`
        });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex === questions.length - 1) {
            setIsQuizFinished(true);
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOptionId(null);
            setFeedback(null);
        }
    };

    const handleRestartQuiz = () => {
        setQuizAttempts(prev => prev + 1);
        setCurrentQuestionIndex(0);
        setSelectedOptionId(null);
        setFeedback(null);
        setScore(0);
        setIsQuizFinished(false);
    };

    const renderQuizContent = () => {
        if (questions.length === 0) {
            return (
                <div className="p-8 text-center text-zinc-400 font-mono text-xs">
                    This quiz module has no questions currently staged.
                </div>
            );
        }

        if (isQuizFinished) {
            return (
                <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-4">
                    <h2 className="text-2xl font-bold text-white font-serif">
                        {hasPassed ? 'Diagnostic Assessment Passed!' : 'Assessment Complete'}
                    </h2>
                    <p className="text-xs font-mono text-zinc-400">Attempt #{quizAttempts}</p>
                    <div className={`text-6xl font-extrabold font-mono ${hasPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {score} / {questions.length}
                    </div>
                    <p className="text-xs font-mono text-zinc-400">({userScorePercentage.toFixed(0)}% Mastery Score)</p>
                    
                    {!hasPassed ? (
                        <div className="space-y-3 pt-2">
                            <p className="text-xs text-zinc-400">You need 70% or higher to qualify for verifiable credit.</p>
                            <button 
                                onClick={handleRestartQuiz} 
                                className="px-5 py-2 font-mono text-xs font-bold text-emerald-400 bg-[#141B26] hover:bg-[#182130] rounded-xl"
                            >
                                Retake Assessment
                            </button>
                        </div>
                    ) : (
                        <div className="p-3 bg-emerald-500/10 text-emerald-300 text-xs font-mono rounded-xl">
                            Great work! You can now mark this lesson as complete.
                        </div>
                    )}
                </div>
            );
        }

        const currentQuestion = questions[currentQuestionIndex];
        return (
            <div className="p-6 flex-1 flex flex-col text-left space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-2 border-b border-zinc-800/40">
                    <span className="font-bold text-white">Quiz: {lesson.title}</span>
                    <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                </div>

                <div className="w-full bg-[#141B26] h-1.5 rounded-full overflow-hidden">
                    <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-300" 
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>

                <h3 className="text-base font-bold text-white font-serif pt-2">
                    {currentQuestion.questionText}
                </h3>

                <div className="space-y-2.5 pt-2">
                    {currentQuestion.options.map(option => {
                        const isChosen = option.id === selectedOptionId;
                        let optionClass = 'bg-[#141B26] text-zinc-200 hover:bg-[#182130]';

                        if (feedback) {
                            if (option.id === currentQuestion.correctOptionId) {
                                optionClass = 'bg-emerald-500/20 text-emerald-300 font-bold';
                            } else if (isChosen && !feedback.isCorrect) {
                                optionClass = 'bg-rose-500/20 text-rose-300';
                            } else {
                                optionClass = 'bg-[#141B26] opacity-50 cursor-not-allowed';
                            }
                        } else if (isChosen) {
                            optionClass = 'bg-emerald-500/20 text-emerald-300 font-bold';
                        }

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleSelectOption(option.id)}
                                disabled={!!feedback}
                                className={`w-full text-left p-3.5 rounded-xl text-xs font-mono transition flex items-center gap-3 cursor-pointer ${optionClass}`}
                            >
                                <span className="w-5 h-5 rounded-lg bg-[#0E131C] flex items-center justify-center text-[10px] shrink-0 font-bold">
                                    {isChosen ? '●' : '○'}
                                </span>
                                <span>{option.text}</span>
                            </button>
                        );
                    })}
                </div>

                {feedback && (
                    <div className={`p-3 rounded-xl text-xs font-mono space-y-1 ${feedback.isCorrect ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>
                        <div className="font-bold">{feedback.isCorrect ? "Correct!" : "Concept Review:"}</div>
                        <p className="text-zinc-300 text-[11px]">{feedback.explanation}</p>
                    </div>
                )}

                <div className="mt-auto pt-4">
                    {feedback ? (
                        <button 
                            onClick={handleNextQuestion} 
                            className="w-full py-3 font-mono font-bold text-xs bg-emerald-500 text-black rounded-xl hover:bg-emerald-400 cursor-pointer"
                        >
                            {currentQuestionIndex === questions.length - 1 ? 'Finish Assessment' : 'Next Question →'}
                        </button>
                    ) : (
                        <button 
                            onClick={handleSubmitAnswer} 
                            disabled={!selectedOptionId} 
                            className="w-full py-3 font-mono font-bold text-xs bg-emerald-500 text-black rounded-xl hover:bg-emerald-400 disabled:opacity-40 cursor-pointer"
                        >
                            Submit Answer
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const renderDefaultContent = () => {
        const embedUrl = getYouTubeEmbedUrl(lesson.videoUrl) || '';
        return (
            <div className="flex-1 flex flex-col overflow-hidden text-left">
                {lesson.format === 'video' && lesson.videoUrl ? (
                    <div className="aspect-video bg-black overflow-hidden relative">
                        <iframe 
                            src={embedUrl} 
                            title={lesson.title} 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen 
                            className="w-full h-full"
                        />
                    </div>
                ) : (
                    <div className="aspect-video bg-[#090C11] flex items-center justify-center">
                        <div className="text-center space-y-2">
                            <BookOpen size={32} className="text-emerald-400 mx-auto" />
                            <p className="text-xs font-mono text-zinc-400">Interactive Reading & Lab View</p>
                        </div>
                    </div>
                )}

                {/* Lesson Checklist */}
                {lesson.checklist && lesson.checklist.length > 0 && (
                    <div className="p-4 sm:p-5 border-b border-zinc-800/40 space-y-2.5">
                        <h3 className="text-xs font-bold font-serif text-white uppercase tracking-wider">Lesson Learning Objectives</h3>
                        <div className="space-y-1.5">
                            {lesson.checklist.map(item => (
                                <label key={item.id} className="flex items-center gap-2.5 text-xs font-mono text-zinc-300 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={checkedItems.has(item.id)} 
                                        onChange={() => handleCheckItem(item.id)} 
                                        className="h-4 w-4 rounded bg-[#141B26] accent-emerald-500" 
                                    />
                                    <span className={checkedItems.has(item.id) ? 'line-through text-zinc-500' : ''}>
                                        {item.text}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Transcript area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 no-scrollbar text-xs font-sans text-zinc-300 leading-relaxed space-y-2">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                        Lesson Transcript & Lecture Notes
                    </span>
                    <p className="whitespace-pre-wrap">
                        {lesson.transcript || 'Transcript for this lecture is being verified by the instructional guild. Follow along with interactive notes in the side panel.'}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row h-full max-h-[calc(100vh-6rem)] animate-fade-in gap-5 text-zinc-100">
            
            {/* Main Stage (Left / Center) */}
            <div className="flex-1 flex flex-col min-w-0 space-y-3">
                <div className="flex items-center justify-between text-left">
                    <button 
                        onClick={onBack} 
                        className="flex items-center gap-1.5 text-xs font-mono font-semibold text-zinc-400 hover:text-emerald-400 transition cursor-pointer"
                    >
                        <ArrowLeft size={14} />
                        <span>Back to Course Overview</span>
                    </button>
                    <span className="text-xs font-mono text-emerald-400 capitalize">
                        {lesson.format} Mode
                    </span>
                </div>

                <div className="flex-1 bg-[#0E131C] rounded-2xl shadow-xl flex flex-col overflow-hidden relative">
                    {lesson.format === 'quiz' ? renderQuizContent() : renderDefaultContent()}
                </div>

                {/* Premium Mark Lesson as Complete Station */}
                <div className="relative">
                    {/* Celebration particles burst animation */}
                    {celebrateBurst && (
                        <div className="absolute -inset-2 pointer-events-none z-20 flex items-center justify-center overflow-visible">
                            <div className="w-full h-full relative flex items-center justify-center">
                                {[...Array(12)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-2 h-2 rounded-full animate-ping"
                                        style={{
                                            backgroundColor: i % 2 === 0 ? '#10B981' : '#F59E0B',
                                            transform: `rotate(${i * 30}deg) translate(${40 + (i % 3) * 15}px)`,
                                            animationDuration: '1.2s'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {lesson.isCompleted ? (
                        <div className="p-3.5 bg-gradient-to-r from-emerald-950/40 via-[#141B26] to-emerald-950/30 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg shadow-emerald-500/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                                    <CheckCircle2 size={20} className="fill-emerald-500 text-black" />
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-xs text-white">Competency Verified & Minted</span>
                                        <span className="text-[10px] font-mono font-extrabold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                            +75 XP
                                        </span>
                                    </div>
                                    <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                                        Signed on CogniSacra Ledger · Sovereign Credential Active
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => onCompleteLesson(lesson)}
                                className="w-full sm:w-auto py-2 px-4 bg-emerald-500/15 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 text-emerald-300 font-mono font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                            >
                                <Award size={14} />
                                <span>View Sovereign Proof</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            {lesson.format === 'quiz' && !hasPassed && (
                                <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-[11px] font-mono text-amber-300">
                                    <span>Diagnostic Requirement: Achieve 70% or higher to unlock lesson credit.</span>
                                    <span className="font-bold">Current: {userScorePercentage.toFixed(0)}%</span>
                                </div>
                            )}

                            <button
                                onClick={handleMarkCompleteClick}
                                disabled={(lesson.format === 'quiz' && !hasPassed) || isMintingProof}
                                className="w-full relative group overflow-hidden py-3.5 px-5 font-mono font-extrabold text-xs bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-black rounded-2xl transition-all shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/35 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-lg bg-black/15 flex items-center justify-center text-black">
                                        <CheckCircle2 size={16} className={isMintingProof ? 'animate-spin' : ''} />
                                    </div>
                                    <span className="tracking-wide">
                                        {isMintingProof 
                                            ? 'Verifying & Minting On-Chain...' 
                                            : 'Mark Lesson as Complete'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="bg-black/20 text-black px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1">
                                        <Zap size={11} className="fill-black" />
                                        <span>+75 XP</span>
                                    </span>
                                    <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider opacity-80">
                                        Verify →
                                    </span>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Side Tools (Right) */}
            <div className="w-full lg:w-80 shrink-0 bg-[#0E131C] rounded-2xl shadow-xl flex flex-col overflow-hidden">
                <div className="flex border-b border-zinc-800/40 p-1 bg-[#090C11]">
                    <button 
                        onClick={() => setSidebarTab('syllabus')}
                        className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                            sidebarTab === 'syllabus' ? 'bg-[#141B26] text-emerald-400 font-bold' : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                        <List size={13} />
                        <span>Syllabus</span>
                    </button>
                    <button 
                        onClick={() => setSidebarTab('notes')}
                        className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                            sidebarTab === 'notes' ? 'bg-[#141B26] text-emerald-400 font-bold' : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                        <Edit size={13} />
                        <span>Notes</span>
                    </button>
                    <button 
                        onClick={() => setSidebarTab('annotations')}
                        className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                            sidebarTab === 'annotations' ? 'bg-[#141B26] text-emerald-400 font-bold' : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                        <BookOpen size={13} />
                        <span>Notes</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {sidebarTab === 'syllabus' && (
                        <SyllabusPanel 
                            course={course} 
                            currentLessonId={lesson.id} 
                            onNavigateLesson={onNavigateLesson} 
                        />
                    )}
                    {sidebarTab === 'notes' && <NotesPanel lesson={lesson} />}
                    {sidebarTab === 'annotations' && (
                        <AnnotationsPanel 
                            annotations={annotations} 
                            onSelectAnnotation={() => {}} 
                        />
                    )}
                </div>
            </div>

        </div>
    );
};

export default LearningView;
