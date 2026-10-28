import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  GraduationCap, 
  Award, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Layers,
  Search,
  BookOpen,
  Building2,
  Users
} from 'lucide-react';

export interface TourStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  tip: string;
}

interface PlatformTourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'sidebar-controls',
    title: 'Unified Sidebar & Navigation',
    subtitle: 'All platform controls in one clean place',
    description: 'We unified everything into the left menu. Access your profile, switch roles (Learner, Lecturer, Institution), search courses, change languages, and view notifications without a top header.',
    icon: <Layers className="w-8 h-8 text-emerald-400" />,
    badge: 'CORE NAVIGATION',
    tip: 'Click any role button in the sidebar to test Learner, Lecturer, or Institution dashboards instantly.'
  },
  {
    id: 'ai-tutor',
    title: 'AI Tutor & Interactive Learning',
    subtitle: 'Real-time intelligence and study assistance',
    description: 'Ask questions, practice code, run voice sessions, and get step-by-step solutions with the integrated CogniSacra AI Tutor and hands-on lab sandbox.',
    icon: <Sparkles className="w-8 h-8 text-cyan-400" />,
    badge: 'AI MENTORSHIP',
    tip: 'Use the quick search or Ask Tutor button in the sidebar anytime you need help.'
  },
  {
    id: 'courses-catalog',
    title: 'Curriculum & Progress Tracker',
    subtitle: 'Learn at your pace and track achievements',
    description: 'Explore multimedia courses across computer science, engineering, and arts. Track lesson progress, bookmark favorites, and take adaptive quizzes.',
    icon: <GraduationCap className="w-8 h-8 text-emerald-400" />,
    badge: 'COURSE CATALOG',
    tip: 'Your daily streak and module completion are automatically saved as you study.'
  },
  {
    id: 'accreditation-hub',
    title: 'Institutional Accreditation & Codes',
    subtitle: 'Direct onboarding for students & lecturers',
    description: 'Institutions can onboard students and faculty by generating official Accreditation Codes. Entering a code instantly unlocks the corresponding learner or lecturer dashboard.',
    icon: <Award className="w-8 h-8 text-amber-400" />,
    badge: 'ACCREDITATION',
    tip: 'Private instructors and independent students can also use the platform freely with open access.'
  }
];

export const PlatformTourGuide: React.FC<PlatformTourGuideProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleFinish();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    try {
      localStorage.setItem('cognisacra_tour_completed', 'true');
    } catch (e) {
      // ignore
    }
    if (onComplete) onComplete();
    onClose();
  };

  const handleSkip = () => {
    try {
      localStorage.setItem('cognisacra_tour_completed', 'true');
    } catch (e) {
      // ignore
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-xl rounded-2xl bg-[#0E131C] text-zinc-100 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Progress bar */}
        <div className="w-full h-1 bg-[#1A2230]">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Modal Header */}
        <div className="p-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[11px] font-semibold tracking-wide">
              {currentStep.badge}
            </span>
            <span className="text-xs font-mono text-zinc-500">
              Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSkip}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#151C28] transition"
            aria-label="Close tour"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tour Body */}
        <div className="px-6 py-4 space-y-5">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-[#141B26] text-emerald-400 shrink-0 shadow-inner">
              {currentStep.icon}
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-serif text-white tracking-tight">
                {currentStep.title}
              </h3>
              <p className="text-xs font-mono text-emerald-400">
                {currentStep.subtitle}
              </p>
            </div>
          </div>

          <p className="text-sm text-zinc-300 font-sans leading-relaxed">
            {currentStep.description}
          </p>

          {/* Quick Tip Box - Minimalist borderless style */}
          <div className="p-3.5 rounded-xl bg-[#141B26] text-xs font-mono text-zinc-300 flex items-start gap-2.5">
            <span className="text-emerald-400 font-bold shrink-0">TIP:</span>
            <span>{currentStep.tip}</span>
          </div>

          {/* Step Dots indicator */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {TOUR_STEPS.map((step, idx) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  idx === currentStepIndex 
                    ? 'w-7 bg-emerald-500' 
                    : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Actions with Skip, Back, Next */}
        <div className="p-6 pt-4 bg-[#0A0E15] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSkip}
            className="px-4 py-2.5 rounded-xl text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:bg-[#141B26] transition"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-4 py-2.5 rounded-xl bg-[#141B26] hover:bg-[#1B2332] text-xs font-mono text-zinc-300 hover:text-white transition flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <span>{isLastStep ? 'Get Started' : 'Next Step'}</span>
              {isLastStep ? <Check size={15} /> : <ArrowRight size={15} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
