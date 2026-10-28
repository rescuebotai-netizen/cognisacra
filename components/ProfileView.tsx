import React, { useState, useMemo, useRef } from 'react';
import { 
  UserProfile, Certificate, Course, Job, EducationEntry, 
  InstructorSettings, UserRole 
} from '../types';
import BlockchainVerificationModal from './BlockchainVerificationModal';
import CourseCard from './CourseCard';
import { 
  MapPin, Building2, Calendar, Award, ExternalLink, Share2, 
  MoreHorizontal, Plus, Pencil, CheckCircle2, ShieldCheck, 
  Eye, BarChart3, Search, FileText, Upload, Download, 
  ThumbsUp, MessageSquare, Repeat2, Send, Globe, Sparkles, 
  Briefcase, GraduationCap, Bookmark, X, Link2, Users, 
  Check, Lock, ArrowUpRight, Camera, Mail, Phone, Heart,
  Flame, CheckCircle, HelpCircle, Layers, Star
} from 'lucide-react';

interface ProfileViewProps {
  userProfile: UserProfile;
  courses: Course[];
  jobs: Job[];
  onSelectCourse: (course: Course) => void;
  onApplyJob: (job: Job) => void;
  onEditProfile: () => void;
  instructorSettings: InstructorSettings;
  userRole: UserRole;
  instructorCourses: Course[];
  allCourses: Course[];
  bookmarkedCourseIds: Set<string>;
  onToggleBookmark: (courseId: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  courses,
  jobs,
  onSelectCourse,
  onApplyJob,
  onEditProfile,
  instructorSettings,
  userRole,
  instructorCourses,
  allCourses,
  bookmarkedCourseIds,
  onToggleBookmark
}) => {
  const isInstructor = userRole === 'instructor';
  const { publicProfile } = instructorSettings;

  // Blockchain verification modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  // Resume upload state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // LinkedIn UI dropdown & toggle states
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isOpenToMenuOpen, setIsOpenToMenuOpen] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [activeCourseTab, setActiveCourseTab] = useState<'completed' | 'teaching' | 'saved'>('completed');
  const [activityTab, setActivityTab] = useState<'all' | 'posts' | 'comments'>('posts');
  const [recommendationsTab, setRecommendationsTab] = useState<'received' | 'given'>('received');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Interactive post likes & comments state
  const [postLikes, setPostLikes] = useState<number>(142);
  const [isPostLiked, setIsPostLiked] = useState<boolean>(false);
  const [postComments, setPostComments] = useState<string[]>([
    "Groundbreaking research on localized synchronization! Congratulations on publishing.",
    "Inspiring milestone for sovereign compute networks across the continent."
  ]);
  const [commentInput, setCommentInput] = useState<string>('');
  const [showCommentBox, setShowCommentBox] = useState<boolean>(false);

  // Peer network mock
  const [connectedUsers, setConnectedUsers] = useState<Set<string>>(new Set());

  // Interactive Skills endorsements count state
  const [skillEndorsements, setSkillEndorsements] = useState<Record<string, { count: number; endorsed: boolean }>>({
    'Distributed Systems': { count: 48, endorsed: false },
    'PostgreSQL': { count: 35, endorsed: false },
    'Cognitive AI': { count: 29, endorsed: false },
    'TypeScript': { count: 41, endorsed: false },
    'Algorithms': { count: 26, endorsed: false },
    'Curriculum Architecture': { count: 32, endorsed: false },
    'Scientific Computing': { count: 21, endorsed: false }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleVerifyClick = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setModalOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setResumeFile(event.target.files[0]);
      showToast(`Uploaded ${event.target.files[0].name} to CV Locker`);
    }
  };

  const toggleConnect = (id: string, name: string) => {
    setConnectedUsers(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast(`Withdrew connection request to ${name}`);
      } else {
        next.add(id);
        showToast(`Invitation sent to ${name}`);
      }
      return next;
    });
  };

  const copyProfileLink = () => {
    navigator.clipboard.writeText(publicProfileUrl);
    setCopiedLink(true);
    showToast(`Public ${profileRolePrefix} link copied to clipboard`);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadCV = () => {
    showToast('Exporting official Academic CV (PDF)...');
  };

  const handleEndorseSkill = (skill: string) => {
    setSkillEndorsements(prev => {
      const current = prev[skill] || { count: 10, endorsed: false };
      const isNowEndorsed = !current.endorsed;
      const newCount = isNowEndorsed ? current.count + 1 : current.count - 1;
      showToast(isNowEndorsed ? `Endorsed ${skill}!` : `Removed endorsement for ${skill}`);
      return {
        ...prev,
        [skill]: { count: newCount, endorsed: isNowEndorsed }
      };
    });
  };

  const handleLikePost = () => {
    setIsPostLiked(!isPostLiked);
    setPostLikes(prev => isPostLiked ? prev - 1 : prev + 1);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setPostComments(prev => [...prev, commentInput.trim()]);
    setCommentInput('');
    showToast('Comment posted to activity feed');
  };

  const completedCourses = useMemo(() => courses.filter(c => c.progress === 100), [courses]);
  const savedCourses = useMemo(() => allCourses.filter(c => bookmarkedCourseIds.has(c.id)), [allCourses, bookmarkedCourseIds]);

  const careerReadiness = useMemo(() => {
    if (!userProfile.targetCareer || !userProfile.skills) return { percentage: 92, neededSkills: ['Docker', 'Distributed Consensus'] };
    const targetJob = jobs.find(j => j.title === userProfile.targetCareer);
    if (!targetJob) return { percentage: 88, neededSkills: ['Microservices', 'GraphQL'] };
    const userSkillsSet = new Set(userProfile.skills.map(s => s.toLowerCase()));
    const matchedSkills = targetJob.skills.filter(s => userSkillsSet.has(s.toLowerCase()));
    const percentage = Math.max(75, Math.round((matchedSkills.length / targetJob.skills.length) * 100));
    const neededSkills = targetJob.skills.filter(s => !userSkillsSet.has(s.toLowerCase()));
    return { percentage, neededSkills };
  }, [userProfile.skills, userProfile.targetCareer, jobs]);

  // Unified display data depending on role - prioritizing userProfile for real-time consistency
  const displayName = userProfile.name || (isInstructor ? (publicProfile?.displayName || 'Faculty Scholar') : 'Scholar');
  const displayTitle = userProfile.title || (isInstructor 
    ? (publicProfile?.title || 'Professor of Distributed Computing & Neural Systems | Lead Curriculum Architect @ CogniSacra') 
    : 'Computer Science & AI Scholar @ University of Nairobi | Autonomous Agents Researcher | NQF Level 8 Fellow');
  const displayBio = userProfile.bio !== undefined ? userProfile.bio : (isInstructor ? (publicProfile?.bio || '') : '');
  const displayInstitution = userProfile.academicInstitution || (isInstructor ? 'CogniSacra Faculty & Research Guild' : 'University of Nairobi');
  const displayLocation = (userProfile.location?.city || userProfile.location?.country)
    ? [userProfile.location?.city, userProfile.location?.country].filter(Boolean).join(', ')
    : 'Nairobi, Kenya';
  const displayAvatar = userProfile.avatarUrl || (isInstructor ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80' : 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80');
  const displayCover = userProfile.coverImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80';
  const profileRolePrefix = isInstructor ? 'instructor' : (userRole === 'institution' ? 'institution' : 'student');
  const publicProfileUrl = `https://cognisacra.io/${profileRolePrefix}/${displayName.toLowerCase().replace(/\s+/g, '-')}`;

  const displaySkillsList = useMemo(() => {
    if (userProfile.skills && userProfile.skills.length > 0) {
      return userProfile.skills;
    }
    return ['Distributed Systems', 'PostgreSQL', 'Cognitive AI', 'TypeScript', 'Curriculum Architecture', 'Scientific Computing'];
  }, [userProfile.skills]);

  // Sample Experiences for LinkedIn authentic feel
  const experiences = useMemo(() => {
    if (isInstructor) {
      return [
        {
          id: 'exp-1',
          role: 'Professor of Distributed Computing & AI',
          institution: displayInstitution,
          logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&q=80',
          type: 'Full-time',
          period: 'Jan 2022 - Present · 4 yrs 6 mos',
          location: 'Nairobi, Kenya · Hybrid',
          description: 'Directing curriculum accreditation for undergraduate and master tracks in distributed consensus, neural architectures, and software engineering. Leading 8 funded research initiatives across East Africa.',
          skills: ['Distributed Systems', 'PostgreSQL', 'Curriculum Architecture', 'Cloud Infrastructure']
        },
        {
          id: 'exp-2',
          role: 'Senior Principal Research Scientist',
          institution: 'African Institute for Advanced Technology',
          logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&q=80',
          type: 'Contract',
          period: 'Mar 2019 - Dec 2021 · 2 yrs 10 mos',
          location: 'Remote',
          description: 'Authored 14 peer-reviewed publications on offline-first edge compute networks and microgrid energy optimization.',
          skills: ['Scientific Computing', 'Python', 'Systems Architecture']
        }
      ];
    }
    return [
      {
        id: 'exp-1',
        role: 'Undergraduate Research Fellow',
        institution: displayInstitution,
        logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100&q=80',
        type: 'Full-time Fellowship',
        period: 'Aug 2024 - Present · 1 yr 11 mos',
        location: `${displayLocation} · On-site`,
        description: 'Conducting algorithmic benchmarks on self-balancing BST traversals and decentralized storage networks under NQF Level 8 accreditation. Published technical preprint in the University Open Research Vault.',
        skills: ['Data Structures', 'TypeScript', 'Algorithms', 'Research Writing']
      },
      {
        id: 'exp-2',
        role: 'Junior Software Engineer Intern',
        institution: 'FinTech Innovation Lab East Africa',
        logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&q=80',
        type: 'Internship',
        period: 'May 2024 - Aug 2024 · 4 mos',
        location: 'Nairobi, Kenya · Hybrid',
        description: 'Developed automated transaction validation endpoints and React client state synchronization buffers handling 20,000+ daily operational records.',
        skills: ['React', 'Node.js', 'PostgreSQL', 'REST APIs']
      }
    ];
  }, [isInstructor, displayInstitution, displayLocation]);

  // Education entries
  const educationList: EducationEntry[] = useMemo(() => {
    if (userProfile.education && userProfile.education.length > 0) {
      return userProfile.education;
    }
    if (isInstructor) {
      return [
        { 
          id: 'edu-1', 
          institution: 'University of Oxford', 
          degree: 'Doctor of Philosophy - Ph.D., Computer Science & Distributed Systems', 
          period: '2015 - 2019' 
        },
        { 
          id: 'edu-2', 
          institution: 'University of Nairobi', 
          degree: 'Bachelor of Science - BS, Electrical & Information Engineering (First Class Honours)', 
          period: '2010 - 2014' 
        }
      ];
    }
    return [
      { 
        id: 'edu-1', 
        institution: displayInstitution, 
        degree: 'Bachelor of Science - BS, Computer Science & Intelligent Systems', 
        period: '2023 - 2027 · Grade: Summa Cum Laude Track (GPA 3.94)' 
      },
      { 
        id: 'edu-2', 
        institution: 'Alliance High School', 
        degree: 'Kenya Certificate of Secondary Education (KCSE) · Grade: A (84 points)', 
        period: '2019 - 2022' 
      }
    ];
  }, [userProfile.education, isInstructor, displayInstitution]);

  // Featured Work Showcase (LinkedIn Featured items)
  const featuredItems = useMemo(() => {
    return [
      {
        id: 'feat-1',
        title: isInstructor 
          ? 'Research Monograph: Autonomous Ledger Consensus in Asynchronous Topologies'
          : 'Capstone Project: High-Throughput Decentralized Message Broker in Rust',
        desc: 'Comprehensive peer-reviewed formulation demonstrating sub-10ms Byzantine fault-tolerant ordering.',
        type: 'Publication & Repository',
        badge: 'Featured Paper',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&q=80'
      },
      {
        id: 'feat-2',
        title: 'CogniSacra Sovereign Cryptographic Diploma (Hash: 0x8f2c...49b)',
        desc: 'Verifiable on-chain academic credential credentialed under NQF Level 8 regional framework.',
        type: 'Verified Credential',
        badge: 'Blockchain Certificate',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&q=80'
      },
      {
        id: 'feat-3',
        title: 'Interactive STEM Sandbox: Neural Pathway Architecture Simulator',
        desc: 'Browser-based visual playground running real-time forward and backward backpropagation passes.',
        type: 'Interactive Tool',
        badge: 'Live Demo',
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&q=80'
      }
    ];
  }, [isInstructor]);

  // Recommended Scholars / Peers (LinkedIn "People also viewed")
  const recommendedPeers = [
    { id: 'p1', name: 'Dr. Kwame Nkrumah', title: 'Dean of Engineering at Ashesi University', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', mutual: 18 },
    { id: 'p2', name: 'Fatoumata Diallo', title: 'Solar Microgrid Systems Researcher', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80', mutual: 24 },
    { id: 'p3', name: 'Prof. Maryam Al-Mansoor', title: 'Chair of Agronomy at Makerere University', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80', mutual: 12 },
    { id: 'p4', name: 'Tendai Moyo', title: 'Autonomous Robotics Researcher at UCT', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80', mutual: 9 }
  ];

  // Recommendations data
  const recommendations = [
    {
      id: 'rec-1',
      author: 'Dr. Kwame Nkrumah',
      title: 'Dean of Engineering at Ashesi University',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      relation: 'supervised on academic research papers',
      date: 'May 14, 2025',
      text: `${displayName} demonstrates unparalleled intellectual rigor and depth in computational systems. Their ability to decompose complex concurrency bottlenecks and formulate sovereign architectures stands out among contemporary scholars.`
    },
    {
      id: 'rec-2',
      author: 'Prof. Maryam Al-Mansoor',
      title: 'Chair of Agronomy at Makerere University',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80',
      relation: 'worked together on cross-institutional grant projects',
      date: 'February 2, 2025',
      text: `An exceptional collaborator whose mastery over theoretical foundations is matched only by their practical execution speed. Always dedicated, collaborative, and forward-thinking.`
    }
  ];

  return (
    <div className="w-full space-y-4 animate-fade-in pb-16 text-zinc-100">
      
      {/* Dynamic Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#141B26] text-emerald-400 font-mono text-xs shadow-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={15} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2-Column LinkedIn Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* ============================================================
            MAIN COLUMN (8 COLS): Hero Card, Analytics, About, Featured,
            Activity, Experience, Education, Licenses, Skills, Recommendations
           ============================================================ */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* 1. TOP INTRO CARD (AUTHENTIC LINKEDIN PROFILE HERO) */}
          <div className="bg-[#0E131C] rounded-2xl shadow-xl overflow-hidden relative">
            
            {/* Cover Banner */}
            <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-[#141B26]">
              <img 
                src={displayCover} 
                alt="Profile Cover" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" />
              <button 
                onClick={onEditProfile}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition cursor-pointer"
                title="Change cover photo"
              >
                <Camera size={15} />
              </button>
            </div>

            {/* Intro Details Container */}
            <div className="px-6 pb-6 pt-0 relative">
              
              {/* Overlapping Avatar & Action Corner */}
              <div className="flex justify-between items-end -mt-16 sm:-mt-20 mb-4">
                <div className="relative group">
                  <img 
                    src={displayAvatar} 
                    alt={displayName} 
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover ring-4 ring-[#0E131C] bg-[#141B26] shadow-2xl"
                  />
                  <span className="absolute bottom-1 right-2 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-[#0E131C] flex items-center justify-center text-black font-bold text-[9px]" title="Online & open to connections">
                    ●
                  </span>
                  <button 
                    onClick={onEditProfile}
                    className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition cursor-pointer"
                    title="Change profile picture"
                  >
                    <Camera size={22} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onEditProfile}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-zinc-300 hover:text-white text-xs font-mono font-semibold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Pencil size={13} />
                    <span className="hidden sm:inline">Edit Profile</span>
                  </button>
                </div>
              </div>

              {/* Identity & Headline (LinkedIn style) */}
              <div className="space-y-1.5 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight flex items-center gap-1.5">
                    <span>{displayName}</span>
                    <CheckCircle2 size={18} className="text-emerald-400 fill-emerald-500/20" />
                  </h1>
                  <span className="text-xs font-mono text-zinc-400">
                    {isInstructor ? '(Faculty Scholar · Lead Instructor)' : '(Student · Academic Fellow)'}
                  </span>
                  {userProfile.mentorshipStatus === 'offering' && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold">
                      Open to Mentoring
                    </span>
                  )}
                </div>

                {/* Headline */}
                <p className="text-sm font-sans text-zinc-200 leading-snug max-w-2xl">
                  {displayTitle}
                </p>

                {/* Company / Institution & Location */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs font-mono text-zinc-400 pt-1">
                  <span className="flex items-center gap-1 text-zinc-300">
                    <Building2 size={13} className="text-emerald-400" />
                    <span>{displayInstitution}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-zinc-500" />
                    <span>{displayLocation}</span>
                  </span>
                  <span>•</span>
                  <button onClick={() => setShowContactModal(true)} className="text-emerald-400 hover:underline cursor-pointer">
                    Contact info
                  </button>
                </div>

                {/* Network count */}
                <div className="pt-1 text-xs font-mono">
                  <span className="text-emerald-400 font-bold">500+ connections</span>
                  <span className="text-zinc-500 ml-2">· 1,840 followers</span>
                </div>

                {/* Social & Scholarly Links */}
                {(userProfile.socialLinks?.linkedin || userProfile.socialLinks?.github || userProfile.socialLinks?.portfolio) && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {userProfile.socialLinks.linkedin && (
                      <a 
                        href={userProfile.socialLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141B26] hover:bg-[#1A2332] text-blue-400 hover:text-blue-300 text-xs font-mono border border-zinc-800 transition"
                      >
                        <Link2 size={12} />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {userProfile.socialLinks.github && (
                      <a 
                        href={userProfile.socialLinks.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141B26] hover:bg-[#1A2332] text-zinc-300 hover:text-white text-xs font-mono border border-zinc-800 transition"
                      >
                        <ExternalLink size={12} />
                        <span>GitHub</span>
                      </a>
                    )}
                    {userProfile.socialLinks.portfolio && (
                      <a 
                        href={userProfile.socialLinks.portfolio} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141B26] hover:bg-[#1A2332] text-emerald-400 hover:text-emerald-300 text-xs font-mono border border-zinc-800 transition"
                      >
                        <Globe size={12} />
                        <span>Scholar Portfolio</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* LinkedIn Action Buttons Row */}
              <div className="mt-4 pt-3 flex flex-wrap items-center gap-2 relative">
                {/* Open to button */}
                <div className="relative">
                  <button
                    onClick={() => setIsOpenToMenuOpen(!isOpenToMenuOpen)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold transition shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95 flex items-center gap-1.5"
                  >
                    <span>Open to</span>
                    <Plus size={13} />
                  </button>

                  {isOpenToMenuOpen && (
                    <div className="absolute left-0 mt-2 w-64 bg-[#141B26] rounded-xl shadow-2xl p-2 z-30 animate-fade-in text-xs font-mono text-left space-y-1">
                      <button 
                        onClick={() => { setIsOpenToMenuOpen(false); showToast('Status set to Open to Work'); }}
                        className="w-full text-left p-2 rounded-lg hover:bg-[#1A2332] text-zinc-200 hover:text-white transition"
                      >
                        <div className="font-bold text-emerald-400">Finding a new job</div>
                        <div className="text-[10px] text-zinc-400">Show recruiters and hiring managers you are open</div>
                      </button>
                      <button 
                        onClick={() => { setIsOpenToMenuOpen(false); showToast('Status set to Providing Mentorship'); }}
                        className="w-full text-left p-2 rounded-lg hover:bg-[#1A2332] text-zinc-200 hover:text-white transition"
                      >
                        <div className="font-bold text-amber-400">Hiring or Mentoring</div>
                        <div className="text-[10px] text-zinc-400">Share that you are accepting mentees or hiring</div>
                      </button>
                      <button 
                        onClick={() => { setIsOpenToMenuOpen(false); showToast('Status set to Providing Services'); }}
                        className="w-full text-left p-2 rounded-lg hover:bg-[#1A2332] text-zinc-200 hover:text-white transition"
                      >
                        <div className="font-bold text-zinc-200">Providing services</div>
                        <div className="text-[10px] text-zinc-400">Showcase consulting & technical services</div>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={onEditProfile}
                  className="px-4 py-2 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-zinc-200 hover:text-white font-mono text-xs font-semibold transition cursor-pointer"
                >
                  Add profile section
                </button>

                {/* More button */}
                <div className="relative">
                  <button
                    onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                    className="p-2 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-zinc-300 hover:text-white transition cursor-pointer"
                    aria-label="More options"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {isMoreMenuOpen && (
                    <div className="absolute left-0 mt-2 w-52 bg-[#141B26] rounded-xl shadow-2xl p-1.5 z-30 animate-fade-in text-xs font-mono text-left space-y-0.5">
                      <button 
                        onClick={() => { copyProfileLink(); setIsMoreMenuOpen(false); }}
                        className="w-full flex items-center px-3 py-2 rounded-lg text-zinc-300 hover:bg-[#1A2332] hover:text-white transition"
                      >
                        <Share2 size={13} className="mr-2" />
                        <span>Share Profile</span>
                      </button>
                      <button 
                        onClick={() => { handleDownloadCV(); setIsMoreMenuOpen(false); }}
                        className="w-full flex items-center px-3 py-2 rounded-lg text-zinc-300 hover:bg-[#1A2332] hover:text-white transition"
                      >
                        <Download size={13} className="mr-2" />
                        <span>Save to PDF</span>
                      </button>
                      <button 
                        onClick={() => { fileInputRef.current?.click(); setIsMoreMenuOpen(false); }}
                        className="w-full flex items-center px-3 py-2 rounded-lg text-zinc-300 hover:bg-[#1A2332] hover:text-white transition"
                      >
                        <Upload size={13} className="mr-2" />
                        <span>Upload CV / Resume</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Open to Work / Mentoring Spotlight Pill */}
              <div className="mt-4 p-3.5 rounded-xl bg-[#141B26] flex items-start justify-between gap-3 text-xs font-mono text-left">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">
                      {isInstructor 
                        ? 'Available for Consulting & Guest Lectures' 
                        : 'Open to work — Research Fellow & Software Engineer roles'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {isInstructor 
                      ? 'Curriculum Advisory, Ph.D. Supervision, Institutional Review · Global or Hybrid' 
                      : 'Full-time · Hybrid / Remote · Nairobi or Global'}
                  </p>
                  <button onClick={onEditProfile} className="text-emerald-400 text-[10px] hover:underline font-bold block pt-0.5">
                    See all details
                  </button>
                </div>
                <button onClick={onEditProfile} className="text-zinc-400 hover:text-white p-1">
                  <Pencil size={13} />
                </button>
              </div>

            </div>
          </div>

          {/* 2. ANALYTICS CARD (PRIVATE TO YOU) */}
          <div className="bg-[#0E131C] p-5 rounded-2xl shadow-xl space-y-3 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-serif text-white">Analytics</h3>
                <p className="text-[10px] font-mono text-zinc-500">Private to you</p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <Sparkles size={12} />
                <span>Creator Mode: Active</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[#141B26] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Eye size={16} />
                </div>
                <div>
                  <div className="text-base font-bold font-mono text-white">1,420</div>
                  <p className="text-[10px] font-mono text-zinc-400">Profile views (+14%)</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#141B26] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <FileText size={16} />
                </div>
                <div>
                  <div className="text-base font-bold font-mono text-white">342</div>
                  <p className="text-[10px] font-mono text-zinc-400">Employer CV reads (+28%)</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#141B26] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Briefcase size={16} />
                </div>
                <div>
                  <div className="text-base font-bold font-mono text-white">94.6%</div>
                  <p className="text-[10px] font-mono text-zinc-400">Employer job offer rate (8 offers)</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. ABOUT CARD */}
          <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-3 text-left">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-serif text-white">About</h2>
              <button onClick={onEditProfile} className="text-zinc-400 hover:text-white p-1">
                <Pencil size={14} />
              </button>
            </div>

            <div className="text-xs sm:text-sm font-sans text-zinc-300 leading-relaxed space-y-2">
              <p className={!showFullBio && displayBio && displayBio.length > 240 ? 'line-clamp-3' : ''}>
                {displayBio || 'Passionate scholar dedicated to building sovereign educational infrastructure, cognitive AI companions, and decentralized computing architectures. Currently researching localized network synchronization and peer-to-peer knowledge graphs under NQF Level 8 regional frameworks.'}
              </p>
              {displayBio && displayBio.length > 240 && (
                <button 
                  onClick={() => setShowFullBio(!showFullBio)}
                  className="text-xs font-mono text-emerald-400 hover:underline pt-1 block cursor-pointer"
                >
                  {showFullBio ? '...see less' : '...see more'}
                </button>
              )}
            </div>

            {/* Top Skills Tagline */}
            <div className="pt-3 flex flex-wrap items-center gap-2 border-t border-zinc-800/40 text-xs font-mono">
              <span className="text-zinc-500">Top skills:</span>
              {(userProfile.skills || ['Distributed Systems', 'PostgreSQL', 'Cognitive AI', 'TypeScript']).slice(0, 4).map(skill => (
                <span key={skill} className="px-2.5 py-1 rounded-lg bg-[#141B26] text-zinc-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* 4. FEATURED SECTION (LINKEDIN STYLE CAROUSEL/CARDS) */}
          <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-serif text-white">Featured</h2>
                <p className="text-[11px] font-mono text-zinc-400">Publications, whitepapers, and verified credentials</p>
              </div>
              <button onClick={onEditProfile} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#141B26]">
                <Plus size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {featuredItems.map(item => (
                <div key={item.id} className="p-3.5 rounded-xl bg-[#141B26] flex flex-col justify-between space-y-2.5 group hover:bg-[#182130] transition cursor-pointer">
                  <div className="space-y-2">
                    <div className="h-24 w-full rounded-lg overflow-hidden bg-[#0E131C]">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    </div>
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                      {item.badge}
                    </span>
                    <h3 className="text-xs font-bold font-serif text-white line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-zinc-400 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 pt-1 border-t border-zinc-800/40">
                    <span>Explore resource</span>
                    <ArrowUpRight size={11} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. ACTIVITY SECTION */}
          <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-4 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold font-serif text-white">Activity</h2>
                <p className="text-[11px] font-mono text-emerald-400">1,840 followers</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowCommentBox(!showCommentBox)} 
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-black text-xs font-mono font-semibold transition"
                >
                  Create a post
                </button>
              </div>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              {(['posts', 'all', 'comments'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActivityTab(tab)}
                  className={`px-3 py-1 rounded-lg capitalize transition cursor-pointer ${
                    activityTab === tab 
                      ? 'bg-emerald-500 text-black font-bold' 
                      : 'bg-[#141B26] text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Recent Post Mock */}
            <div className="p-4 rounded-xl bg-[#141B26] space-y-2.5 text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <img src={displayAvatar} alt={displayName} className="w-9 h-9 rounded-full object-cover bg-[#0E131C]" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white">{displayName}</span>
                    <span className="text-[10px] text-zinc-500">· 2d · 🌐</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 line-clamp-1">{displayTitle}</p>
                </div>
              </div>

              <p className="text-zinc-200 font-sans text-xs leading-relaxed pt-1">
                Excited to announce the completion of our latest research milestone on decentralized microgrid frequency arbitration under AfCFTA regulatory standards! All simulation benchmarks are open-sourced in the Virtual Research Sandbox.
              </p>

              {/* Reaction Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/40 text-[11px] text-zinc-400">
                <button 
                  onClick={handleLikePost}
                  className={`flex items-center gap-1.5 transition cursor-pointer ${isPostLiked ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'}`}
                >
                  <ThumbsUp size={14} className={isPostLiked ? 'fill-emerald-400' : ''} /> 
                  <span>{postLikes}</span>
                </button>
                <button 
                  onClick={() => setShowCommentBox(!showCommentBox)}
                  className="flex items-center gap-1.5 hover:text-emerald-400 transition cursor-pointer"
                >
                  <MessageSquare size={14} /> 
                  <span>{postComments.length} comments</span>
                </button>
                <button 
                  onClick={copyProfileLink}
                  className="flex items-center gap-1.5 hover:text-emerald-400 transition cursor-pointer"
                >
                  <Repeat2 size={14} /> 
                  <span>14 reposts</span>
                </button>
                <button 
                  onClick={() => copyProfileLink()}
                  className="flex items-center gap-1.5 hover:text-emerald-400 transition cursor-pointer"
                >
                  <Send size={14} /> 
                  <span>Send</span>
                </button>
              </div>

              {/* Comments drawer */}
              {showCommentBox && (
                <div className="pt-3 space-y-2 border-t border-zinc-800/40">
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input 
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Add a comment to this discussion..."
                      className="flex-1 px-3 py-1.5 bg-[#0E131C] text-xs font-mono text-zinc-100 placeholder-zinc-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                    <button type="submit" className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-bold font-mono">
                      Post
                    </button>
                  </form>
                  <div className="space-y-1.5 pt-1">
                    {postComments.map((comment, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-[#0E131C] text-[11px] text-zinc-300 font-sans">
                        {comment}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 6. EXPERIENCE SECTION */}
          <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-5 text-left">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-serif text-white">Experience</h2>
              <div className="flex items-center gap-1">
                <button onClick={onEditProfile} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#141B26]">
                  <Plus size={16} />
                </button>
                <button onClick={onEditProfile} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#141B26]">
                  <Pencil size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {experiences.map(exp => (
                <div key={exp.id} className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#141B26] flex items-center justify-center shrink-0">
                    <img src={exp.logo} alt={exp.institution} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1 text-left flex-1">
                    <h3 className="text-sm font-bold font-serif text-white">{exp.role}</h3>
                    <p className="text-xs font-mono text-zinc-300">
                      {exp.institution} · <span className="text-zinc-500">{exp.type}</span>
                    </p>
                    <p className="text-[11px] font-mono text-zinc-500">
                      {exp.period} · {exp.location}
                    </p>
                    <p className="text-xs font-sans text-zinc-400 leading-relaxed pt-1">
                      {exp.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {exp.skills.map(s => (
                        <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141B26] text-zinc-400">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. EDUCATION SECTION */}
          <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-5 text-left">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-serif text-white">Education</h2>
              <div className="flex items-center gap-1">
                <button onClick={onEditProfile} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#141B26]">
                  <Plus size={16} />
                </button>
                <button onClick={onEditProfile} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#141B26]">
                  <Pencil size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {educationList.map(edu => (
                <div key={edu.id} className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#141B26] flex items-center justify-center text-emerald-400 shrink-0">
                    <GraduationCap size={24} />
                  </div>
                  <div className="space-y-0.5 text-left flex-1">
                    <h3 className="text-sm font-bold font-serif text-white">{edu.institution}</h3>
                    <p className="text-xs font-mono text-zinc-300">{edu.degree}</p>
                    <p className="text-[11px] font-mono text-zinc-500">{edu.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8. LICENSES & CERTIFICATIONS SECTION */}
          <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-serif text-white">Licenses & Certifications</h2>
              <button onClick={onEditProfile} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#141B26]">
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-3.5">
              {userProfile.certificates.map(cert => (
                <div key={cert.id} className="p-4 rounded-xl bg-[#141B26] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-[#0E131C] text-amber-400 shrink-0">
                      <Award size={20} />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold font-serif text-white">{cert.courseTitle}</h4>
                      <p className="text-[11px] font-mono text-zinc-400">
                        CogniSacra Sovereign Ledger · Issued {cert.issuedDate}
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500 truncate max-w-xs">
                        Credential ID: {cert.transactionHash ? cert.transactionHash.slice(0, 20) + '...' : `CSP-${cert.id}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleVerifyClick(cert)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-black text-xs font-mono font-semibold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck size={13} />
                      <span>Show Credential</span>
                      <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              ))}

              {userProfile.certificates.length === 0 && (
                <p className="text-xs font-mono text-zinc-500 py-4 text-center">
                  No certifications yet. Complete accredited courses to earn verifiable credentials.
                </p>
              )}
            </div>
          </div>

          {/* 9. SKILLS & ENDORSEMENTS SECTION */}
          <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-serif text-white">Skills & Endorsements</h2>
                <p className="text-[11px] font-mono text-zinc-400">Validated by academic colleagues and industry peers</p>
              </div>
              <button onClick={onEditProfile} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#141B26]">
                <Plus size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {displaySkillsList.map(skill => {
                const data = skillEndorsements[skill] || { count: 18, endorsed: false };
                return (
                  <div key={skill} className="p-3.5 rounded-xl bg-[#141B26] flex items-center justify-between gap-3 border border-zinc-800/40">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold font-mono text-white">{skill}</h4>
                      <p className="text-[10px] font-mono text-zinc-400">
                        Endorsed by <span className="text-emerald-400 font-bold">{data.count}</span> scholars
                      </p>
                    </div>
                    <button
                      onClick={() => handleEndorseSkill(skill)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                        data.endorsed
                          ? 'bg-emerald-500 text-black'
                          : 'bg-[#0E131C] text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                    >
                      {data.endorsed ? 'Endorsed ✓' : '+ Endorse'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 10. RECOMMENDATIONS SECTION */}
          <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-serif text-white">Recommendations</h2>
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <button
                  onClick={() => setRecommendationsTab('received')}
                  className={`px-3 py-1 rounded-lg transition ${recommendationsTab === 'received' ? 'bg-emerald-500 text-black font-bold' : 'bg-[#141B26] text-zinc-400 hover:text-white'}`}
                >
                  Received (2)
                </button>
                <button
                  onClick={() => setRecommendationsTab('given')}
                  className={`px-3 py-1 rounded-lg transition ${recommendationsTab === 'given' ? 'bg-emerald-500 text-black font-bold' : 'bg-[#141B26] text-zinc-400 hover:text-white'}`}
                >
                  Given (1)
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {recommendations.map(rec => (
                <div key={rec.id} className="p-4 rounded-xl bg-[#141B26] space-y-2.5">
                  <div className="flex items-center gap-3">
                    <img src={rec.avatar} alt={rec.author} className="w-10 h-10 rounded-full object-cover bg-[#0E131C]" />
                    <div>
                      <h4 className="text-xs font-bold font-serif text-white">{rec.author}</h4>
                      <p className="text-[10px] font-mono text-zinc-400">{rec.title}</p>
                      <p className="text-[9px] font-mono text-zinc-500">{rec.date} · {rec.relation}</p>
                    </div>
                  </div>
                  <p className="text-xs font-sans text-zinc-300 leading-relaxed italic">
                    "{rec.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ============================================================
            RIGHT COLUMN (4 COLS): Public Profile & URL, Career Readiness,
            CV Locker, People Also Viewed, Learning Courses
           ============================================================ */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Public profile & URL edit card */}
          <div className="bg-[#0E131C] p-5 rounded-2xl shadow-xl space-y-2.5 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase text-zinc-400 font-bold tracking-wider">
                Public profile & URL
              </h3>
              <Pencil size={13} className="text-zinc-500 hover:text-white cursor-pointer" onClick={onEditProfile} />
            </div>
            <p className="text-xs font-mono text-emerald-400 truncate">
              cognisacra.io/{profileRolePrefix}/{displayName.toLowerCase().replace(/\s+/g, '-')}
            </p>
            <button 
              onClick={copyProfileLink}
              className="text-[11px] font-mono text-zinc-400 hover:text-emerald-400 transition flex items-center gap-1 cursor-pointer pt-0.5"
            >
              <Link2 size={12} />
              <span>Copy public profile link</span>
            </button>
          </div>

          {/* Mentorship & Faculty Office Hours widget */}
          {(isInstructor || userProfile.mentorshipStatus === 'offering' || userProfile.officeHours) && (
            <div className="bg-[#0E131C] p-5 rounded-2xl shadow-xl space-y-3.5 text-left border border-zinc-800/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-emerald-400" />
                  <h3 className="text-xs font-mono uppercase text-zinc-300 font-bold tracking-wider">
                    Office Hours & Mentorship
                  </h3>
                </div>
                <Pencil size={13} className="text-zinc-500 hover:text-white cursor-pointer" onClick={onEditProfile} />
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between py-1 border-b border-zinc-800/40">
                  <span className="text-zinc-400">Mentorship Status</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-bold">
                    {userProfile.mentorshipStatus === 'offering' 
                      ? 'Open for Advising' 
                      : userProfile.mentorshipStatus === 'seeking' 
                        ? 'Peer Exchange' 
                        : 'On Appointment'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-zinc-800/40">
                  <span className="text-zinc-400">Office Hours</span>
                  <span className="text-zinc-200 text-right truncate max-w-[170px]" title={userProfile.officeHours || 'Tues & Thurs, 14:00 - 16:00 GMT'}>
                    {userProfile.officeHours || 'Tues & Thurs, 14:00 - 16:00 GMT'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-zinc-400">Consultation Rate</span>
                  <span className="text-emerald-400 font-bold">
                    ${userProfile.hourlyRate ?? 85} / hr
                  </span>
                </div>
              </div>

              <button
                onClick={() => showToast('Mentorship & office hours request logged')}
                className="w-full py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-black font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calendar size={13} />
                <span>Book Faculty Slot</span>
              </button>
            </div>
          )}

          {/* Profile Strength / Career Readiness widget */}
          <div className="bg-[#0E131C] p-5 rounded-2xl shadow-xl space-y-3 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <h3 className="text-xs font-mono uppercase text-zinc-300 font-bold tracking-wider">
                  Profile Strength: All-Star
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {careerReadiness.percentage}%
              </span>
            </div>

            <p className="text-xs font-mono text-zinc-300">
              Target: <span className="font-bold text-white">{userProfile.targetCareer || (isInstructor ? 'Tenured AI Faculty' : 'Distributed Systems Architect')}</span>
            </p>

            <div className="w-full bg-[#141B26] rounded-full h-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${careerReadiness.percentage}%` }}
              />
            </div>

            {careerReadiness.neededSkills.length > 0 && (
              <div className="pt-1 space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-500">Recommended Skills to Add:</span>
                <div className="flex flex-wrap gap-1.5">
                  {careerReadiness.neededSkills.map(sk => (
                    <span key={sk} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141B26] text-emerald-300">
                      + {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CV & Resume Document Locker */}
          <div className="bg-[#0E131C] p-5 rounded-2xl shadow-xl space-y-3 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase text-zinc-400 font-bold tracking-wider">
                CV & Resume Locker
              </h3>
              <FileText size={15} className="text-emerald-400" />
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".pdf,.doc,.docx"
            />

            {resumeFile ? (
              <div className="p-3 rounded-xl bg-[#141B26] flex items-center justify-between text-xs font-mono">
                <span className="truncate text-white font-medium">{resumeFile.name}</span>
                <button onClick={() => setResumeFile(null)} className="text-zinc-500 hover:text-rose-400">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <p className="text-xs font-mono text-zinc-400">
                Official academic curriculum vitae and industry resume.
              </p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-xs font-mono text-zinc-200 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload size={13} />
                <span>Upload File</span>
              </button>
              <button
                onClick={handleDownloadCV}
                className="p-2 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-zinc-300 hover:text-white transition cursor-pointer"
                title="Download CV"
              >
                <Download size={15} />
              </button>
            </div>
          </div>

          {/* People You May Know / Scholar Network (LinkedIn Style) */}
          <div className="bg-[#0E131C] p-5 rounded-2xl shadow-xl space-y-3.5 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase text-zinc-400 font-bold tracking-wider">
                People also viewed
              </h3>
              <Users size={14} className="text-zinc-500" />
            </div>

            <div className="space-y-3.5">
              {recommendedPeers.map(peer => {
                const isConnected = connectedUsers.has(peer.id);
                return (
                  <div key={peer.id} className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <img 
                        src={peer.avatar} 
                        alt={peer.name} 
                        className="w-10 h-10 rounded-full object-cover shrink-0 bg-[#141B26]"
                      />
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold font-serif text-white hover:text-emerald-400 transition cursor-pointer">
                          {peer.name}
                        </h4>
                        <p className="text-[10px] font-mono text-zinc-400 line-clamp-1">
                          {peer.title}
                        </p>
                        <p className="text-[9px] font-mono text-zinc-500">
                          {peer.mutual} mutual connections
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleConnect(peer.id, peer.name)}
                      className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold transition shrink-0 cursor-pointer ${
                        isConnected
                          ? 'bg-zinc-800 text-zinc-400'
                          : 'bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-black'
                      }`}
                    >
                      {isConnected ? 'Pending' : 'Connect'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Contact Info Modal (LinkedIn Style) */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0E131C] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-zinc-800/40 pb-3">
              <h3 className="text-base font-bold font-serif text-white">{displayName}</h3>
              <button onClick={() => setShowContactModal(false)} className="text-zinc-400 hover:text-white p-1">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs font-mono max-h-[65vh] overflow-y-auto pr-1">
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Email Address</span>
                  <a href={`mailto:${userProfile.contact?.email || userProfile.email || 'scholar@cognisacra.edu'}`} className="text-white hover:underline">
                    {userProfile.contact?.email || userProfile.email || 'scholar@cognisacra.edu'}
                  </a>
                </div>
              </div>

              {userProfile.contact?.phone && (
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">Phone / Direct Line</span>
                    <span className="text-zinc-200">{userProfile.contact.phone}</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Globe size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Profile URL</span>
                  <span className="text-emerald-400 break-all">
                    https://cognisacra.io/{profileRolePrefix}/{displayName.toLowerCase().replace(/\s+/g, '-')}
                  </span>
                </div>
              </div>

              {userProfile.socialLinks?.linkedin && (
                <div className="flex items-start gap-3">
                  <Link2 size={16} className="text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">LinkedIn Profile</span>
                    <a href={userProfile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                      {userProfile.socialLinks.linkedin}
                    </a>
                  </div>
                </div>
              )}

              {userProfile.socialLinks?.github && (
                <div className="flex items-start gap-3">
                  <ExternalLink size={16} className="text-zinc-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">GitHub / Code Repository</span>
                    <a href={userProfile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:underline break-all">
                      {userProfile.socialLinks.github}
                    </a>
                  </div>
                </div>
              )}

              {userProfile.socialLinks?.portfolio && (
                <div className="flex items-start gap-3">
                  <Globe size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">Academic Portfolio / Scholar</span>
                    <a href={userProfile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline break-all">
                      {userProfile.socialLinks.portfolio}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Building2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Institution Affiliation</span>
                  <span className="text-zinc-200">{displayInstitution}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Geographic Location</span>
                  <span className="text-zinc-200">{displayLocation}</span>
                </div>
              </div>

              {userProfile.officeHours && (
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">Advisory & Office Hours</span>
                    <span className="text-zinc-200">{userProfile.officeHours}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-zinc-800/40 flex justify-end">
              <button 
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-mono font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blockchain Verification Modal */}
      {selectedCertificate && (
        <BlockchainVerificationModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          certificate={selectedCertificate}
        />
      )}

    </div>
  );
};

export default ProfileView;
