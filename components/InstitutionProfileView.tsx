import React, { useState } from 'react';
import { FullInstitutionData, CommunityPost, UserRole, Course } from '../types';
import CourseCard from './CourseCard';
import { 
  Building2, MapPin, Globe, Phone, Mail, ExternalLink, 
  CheckCircle2, Share2, Plus, Pencil, ThumbsUp, MessageSquare, 
  Repeat2, Video, GraduationCap, Users, Clock, Award, 
  ShieldCheck, HelpCircle, ArrowUpRight, Search, Bookmark,
  Calendar, Check, Camera, Compass, Send, Sparkles, Filter,
  BookOpen, BarChart3, Briefcase
} from 'lucide-react';

interface InstitutionProfileViewProps {
  institutionData: FullInstitutionData;
  onNavigate: (view: 'institution-profile-editing') => void;
  userRole?: UserRole;
  onSelectCourse?: (course: Course) => void;
}

export type InstitutionTab = 'home' | 'about' | 'posts' | 'courses' | 'faculty' | 'campuses';

export const InstitutionProfileView: React.FC<InstitutionProfileViewProps> = ({
  institutionData,
  onNavigate,
  userRole = 'institution',
  onSelectCourse
}) => {
  const { 
    name, 
    profile, 
    branding, 
    programs, 
    courses, 
    communityPosts: initialCommunityPosts,
    analytics,
    learners
  } = institutionData;

  const [activeTab, setActiveTab] = useState<InstitutionTab>('home');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(48250);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(initialCommunityPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Faculty connect mock
  const [connectedFaculty, setConnectedFaculty] = useState<Set<string>>(new Set());

  // Affiliated institutions follow state
  const [followedInstitutions, setFollowedInstitutions] = useState<Set<string>>(new Set());

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1);
    showToast(isFollowing ? `Unfollowed ${name}` : `Following ${name}. Updates will appear in your feed.`);
  };

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes: likedPosts.has(postId) ? Math.max(0, p.likes - 1) : p.likes + 1 };
      }
      return p;
    }));
  };

  const handleAddPost = () => {
    if (!newPostContent.trim()) return;
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: `${name} Official`,
      avatarUrl: branding.logoUrl,
      timestamp: 'Just now · 🌐',
      content: newPostContent.trim(),
      likes: 1,
      comments: 0
    };
    setCommunityPosts([newPost, ...communityPosts]);
    setNewPostContent('');
    showToast('Campus update published to page feed');
  };

  const copyPageLink = () => {
    const institutionUrl = `https://cognisacra.io/institution/${name.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(institutionUrl);
    setCopiedLink(true);
    showToast('Public institution page URL copied to clipboard');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const toggleFacultyConnect = (id: string, facultyName: string) => {
    setConnectedFaculty(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast(`Withdrew request to ${facultyName}`);
      } else {
        next.add(id);
        showToast(`Connected with ${facultyName}`);
      }
      return next;
    });
  };

  const toggleFollowAffiliate = (id: string, affiliateName: string) => {
    setFollowedInstitutions(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast(`Unfollowed ${affiliateName}`);
      } else {
        next.add(id);
        showToast(`Following ${affiliateName}`);
      }
      return next;
    });
  };

  const tabs: { id: InstitutionTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'posts', label: 'Posts' },
    { id: 'courses', label: `Programs & Courses (${courses.length})` },
    { id: 'faculty', label: `People & Faculty (${profile.faculty?.length || 4})` },
    { id: 'campuses', label: `Campuses (${profile.locations?.length || 2})` },
  ];

  // Faculty data
  const facultyMembers = profile.faculty && profile.faculty.length > 0 ? profile.faculty : [
    {
      id: 'f-1',
      name: 'Prof. Isabella Al-Fara',
      role: 'Chair of Computer Science & Distributed Systems',
      department: 'School of Intelligent Systems',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
      publications: 42,
      coursesCount: 6
    },
    {
      id: 'f-2',
      name: 'Dr. Kwame Nkrumah',
      role: 'Associate Dean of Engineering & Robotics',
      department: 'School of Engineering',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      publications: 28,
      coursesCount: 4
    },
    {
      id: 'f-3',
      name: 'Prof. Maryam Al-Mansoor',
      role: 'Head of Agronomy & Sustainable Bio-Infrastructure',
      department: 'Department of Agricultural Sciences',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80',
      publications: 35,
      coursesCount: 5
    },
    {
      id: 'f-4',
      name: 'Dr. Linus Vance',
      role: 'Director of Algorithmic Mathematics & Cryptography',
      department: 'Institute for Sovereign Computation',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
      publications: 19,
      coursesCount: 3
    }
  ];

  // Alumni insights mock
  const alumniLocations = [
    { location: 'Nairobi, Kenya', count: 3420, percent: 45 },
    { location: 'Johannesburg, South Africa', count: 1850, percent: 24 },
    { location: 'Lagos, Nigeria', count: 1210, percent: 16 },
    { location: 'London, United Kingdom', count: 680, percent: 9 },
    { location: 'San Francisco, United States', count: 450, percent: 6 },
  ];

  const alumniFunctions = [
    { function: 'Engineering & Software', count: 2840, percent: 38 },
    { function: 'Research & Education', count: 1950, percent: 26 },
    { function: 'Operations & Project Management', count: 1200, percent: 16 },
    { function: 'Consulting & Strategy', count: 910, percent: 12 },
    { function: 'Healthcare & Biotechnology', count: 600, percent: 8 },
  ];

  // Affiliated institutions
  const similarInstitutions = [
    { id: 'inst-1', name: 'University of Cape Town', type: 'Higher Education · Cape Town, SA', followers: '184K', avatar: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&q=80' },
    { id: 'inst-2', name: 'Ashesi University', type: 'Higher Education · Berekuso, Ghana', followers: '62K', avatar: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100&q=80' },
    { id: 'inst-3', name: 'Makerere University', type: 'Higher Education · Kampala, Uganda', followers: '95K', avatar: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&q=80' }
  ];

  return (
    <div className="w-full space-y-4 animate-fade-in pb-16 text-zinc-100">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#141B26] text-emerald-400 font-mono text-xs shadow-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={15} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================
          TOP HERO CARD (AUTHENTIC LINKEDIN UNIVERSITY / COMPANY PAGE)
         ============================================================ */}
      <div className="bg-[#0E131C] rounded-2xl shadow-xl overflow-hidden relative text-left">
        
        {/* Banner Cover */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-[#141B26]">
          <img 
            src={profile.bannerUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80'} 
            alt={`${name} Banner`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" />
          
          {userRole === 'institution' ? (
            <button 
              onClick={() => onNavigate('institution-profile-editing')}
              className="absolute top-4 right-4 px-3.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md text-xs font-mono font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Pencil size={13} />
              <span>Edit Page</span>
            </button>
          ) : (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-emerald-400 font-mono text-[11px] font-bold flex items-center gap-1.5 border border-emerald-500/30">
              <ShieldCheck size={13} />
              <span>Official Institutional Partner</span>
            </div>
          )}
        </div>

        {/* Intro Details Container */}
        <div className="px-6 pb-4 pt-0 relative">
          
          {/* Overlapping Square Institution Logo */}
          <div className="flex justify-between items-end -mt-16 sm:-mt-20 mb-4">
            <div className="p-1.5 rounded-2xl bg-[#0E131C] ring-4 ring-[#0E131C] shadow-2xl">
              <img 
                src={branding.logoUrl} 
                alt={`${name} logo`}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-contain bg-white/5 p-2"
              />
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={copyPageLink}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-zinc-300 hover:text-white text-xs font-mono font-semibold transition flex items-center gap-1.5 cursor-pointer"
                title="Share institution page"
              >
                <Share2 size={14} />
                <span className="hidden sm:inline">{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Identity & Mission (LinkedIn page style) */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight flex items-center gap-2">
                <span>{name}</span>
                <CheckCircle2 size={20} className="text-emerald-400 fill-emerald-500/20" />
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold uppercase">
                Verified Higher Institution
              </span>
            </div>

            <p className="text-sm font-sans text-zinc-200 leading-snug max-w-3xl">
              {profile.tagline || 'Pioneering sovereign higher education, high-yield STEM simulation laboratories, and accredited continental learning credentials.'}
            </p>

            {/* Institution Metadata Line */}
            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs font-mono text-zinc-400 pt-1">
              <span className="flex items-center gap-1 text-zinc-300">
                <Building2 size={13} className="text-emerald-400" />
                <span>Higher Education & Research</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-zinc-500" />
                <span>{profile.locations?.[0]?.address || 'Nairobi, Kenya'}</span>
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">
                {followerCount.toLocaleString()} followers
              </span>
              <span>•</span>
              <span className="text-zinc-400">
                {learners?.length || 240}+ students enrolled
              </span>
            </div>

            {/* Primary Action Buttons (LinkedIn Page Style) */}
            <div className="mt-4 pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={toggleFollow}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  isFollowing
                    ? 'bg-[#141B26] text-emerald-400 hover:bg-[#1A2332]'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20'
                }`}
              >
                {isFollowing ? <Check size={14} /> : <Plus size={14} />}
                <span>{isFollowing ? 'Following' : '+ Follow'}</span>
              </button>

              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-zinc-200 hover:text-white font-mono text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Globe size={13} />
                  <span>Visit website</span>
                  <ExternalLink size={12} className="text-zinc-500" />
                </a>
              )}

              {profile.supportLinks?.applicationPortal && (
                <a
                  href={profile.supportLinks.applicationPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-mono text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <GraduationCap size={13} />
                  <span>Admissions Portal</span>
                </a>
              )}
            </div>

          </div>

          {/* LinkedIn Page Navigation Tabs */}
          <div className="mt-6 pt-2 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-zinc-800/40">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-[#141B26]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* ============================================================
          2-COLUMN LINKEDIN BODY (8 COLS MAIN + 4 COLS SIDEBAR)
         ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Main Column (8 COLS) */}
        <div className="lg:col-span-8 space-y-4 text-left">
          
          {/* TAB: HOME OR ABOUT */}
          {(activeTab === 'home' || activeTab === 'about') && (
            <>
              {/* Overview / About Card */}
              <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold font-serif text-white">Overview</h2>
                  <button onClick={() => onNavigate('institution-profile-editing')} className="text-zinc-400 hover:text-white p-1">
                    <Pencil size={14} />
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-sans text-zinc-300 leading-relaxed whitespace-pre-line">
                  {profile.about || `${name} is an internationally recognized higher learning institution dedicated to fostering scientific excellence, technological sovereignty, and societal transformation. Offering comprehensive accredited degree tracks and micro-credentials recognized by continental education authorities.`}
                </p>

                {/* Structured Organization Details (LinkedIn Company details) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-zinc-800/40 text-xs font-mono">
                  <div className="space-y-0.5">
                    <span className="text-zinc-500 text-[10px] uppercase">Website</span>
                    <p className="text-emerald-400 truncate">{profile.website || 'https://cognisacra.edu'}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-zinc-500 text-[10px] uppercase">Industry</span>
                    <p className="text-zinc-300">Higher Education & Scientific Research</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-zinc-500 text-[10px] uppercase">Institution Type</span>
                    <p className="text-zinc-300">Accredited Sovereign University</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-zinc-500 text-[10px] uppercase">Headquarters</span>
                    <p className="text-zinc-300">{profile.locations?.[0]?.name || 'Nairobi Central Campus'}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-zinc-500 text-[10px] uppercase">Accreditation</span>
                    <p className="text-emerald-300 font-semibold">SETA / NQF / Sovereign Ledger Level 8</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-zinc-500 text-[10px] uppercase">Students & Alumni</span>
                    <p className="text-zinc-300">{followerCount.toLocaleString()} community members</p>
                  </div>
                </div>
              </div>

              {/* Programs Spotlight */}
              {programs && programs.length > 0 && (
                <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold font-serif text-white flex items-center gap-2">
                      <GraduationCap size={16} className="text-emerald-400" />
                      <span>Accredited Academic Tracks</span>
                    </h3>
                    <button onClick={() => setActiveTab('courses')} className="text-xs font-mono text-emerald-400 hover:underline">
                      See all ({programs.length})
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {programs.map(prog => (
                      <div key={prog.id} className="p-4 rounded-xl bg-[#141B26] space-y-2 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                            {prog.type}
                          </span>
                          <h4 className="text-xs font-bold font-serif text-white pt-1">{prog.title}</h4>
                          <p className="text-[11px] text-zinc-400 line-clamp-2 pt-0.5">{prog.description}</p>
                        </div>
                        <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-zinc-500 border-t border-zinc-800/40">
                          <span>NQF Accredited</span>
                          <span className="text-emerald-400 font-bold">Inquire Now →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB: POSTS & UPDATES */}
          {(activeTab === 'home' || activeTab === 'posts') && (
            <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-serif text-white">Campus Updates & Announcements</h3>
                  <p className="text-xs font-mono text-zinc-400">Official broadcasts from institution leadership</p>
                </div>
              </div>

              {/* LinkedIn Post Composer for Admins */}
              <div className="p-4 rounded-xl bg-[#141B26] space-y-3">
                <textarea
                  rows={2}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share a campus update, research breakthrough, or scholarship announcement..."
                  className="w-full p-3 bg-[#0E131C] text-xs font-mono text-zinc-100 placeholder-zinc-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none transition"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500">Posting as {name} Administrator</span>
                  <button
                    onClick={handleAddPost}
                    disabled={!newPostContent.trim()}
                    className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition disabled:opacity-40"
                  >
                    Post Update
                  </button>
                </div>
              </div>

              {/* Feed Items (LinkedIn style) */}
              <div className="space-y-3 pt-1">
                {communityPosts.map(post => {
                  const isLiked = likedPosts.has(post.id);
                  return (
                    <div key={post.id} className="p-4 rounded-xl bg-[#141B26] space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={post.avatarUrl || branding.logoUrl} 
                          alt={post.author} 
                          className="w-9 h-9 rounded-lg object-contain bg-[#0E131C] p-1"
                        />
                        <div>
                          <h4 className="text-xs font-bold font-serif text-white flex items-center gap-1">
                            <span>{post.author}</span>
                            <CheckCircle2 size={12} className="text-emerald-400" />
                          </h4>
                          <p className="text-[10px] font-mono text-zinc-500">{post.timestamp}</p>
                        </div>
                      </div>

                      <p className="text-xs font-sans text-zinc-200 leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>

                      <div className="flex items-center gap-4 pt-2 border-t border-zinc-800/40 text-[11px] font-mono text-zinc-400">
                        <button 
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-1 transition ${isLiked ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'}`}
                        >
                          <ThumbsUp size={13} className={isLiked ? 'fill-emerald-400' : ''} /> 
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-emerald-400 transition">
                          <MessageSquare size={13} /> 
                          <span>{post.comments} comments</span>
                        </button>
                        <button onClick={copyPageLink} className="flex items-center gap-1 hover:text-emerald-400 transition">
                          <Repeat2 size={13} /> 
                          <span>Repost</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: COURSES & PROGRAMS */}
          {activeTab === 'courses' && (
            <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-serif text-white">Academic Course Catalog</h3>
                  <p className="text-xs font-mono text-zinc-400">Official curricula, laboratory modules, and accredited certifications</p>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  {courses.length} Active Courses
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                {courses.map(course => (
                  <div key={course.id} className="p-4 rounded-xl bg-[#141B26] space-y-2 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                        <span className="uppercase text-emerald-400 font-bold">{course.level || 'Academic Track'}</span>
                        <span>{course.duration || '12 Weeks'}</span>
                      </div>
                      <h4 className="text-xs font-bold font-serif text-white line-clamp-1">{course.title}</h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-2">{course.description}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-zinc-800/40">
                      <span className="text-emerald-400 font-bold">{course.price === 0 ? 'Scholarship Funded' : `$${course.price}`}</span>
                      <span className="text-zinc-400">★ {course.rating || 4.9}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PEOPLE & FACULTY DIRECTORY + ALUMNI INSIGHTS (Iconic LinkedIn University Feature) */}
          {activeTab === 'faculty' && (
            <div className="space-y-4">
              
              {/* Faculty Directory */}
              <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-serif text-white">Distinguished Faculty & Researchers</h3>
                    <p className="text-xs font-mono text-zinc-400">Leading researchers, professors, and lab supervisors</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {facultyMembers.map(member => {
                    const isConnected = connectedFaculty.has(member.id);
                    return (
                      <div key={member.id} className="p-4 rounded-xl bg-[#141B26] space-y-3 flex flex-col justify-between">
                        <div className="flex items-start gap-3">
                          <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full object-cover bg-[#0E131C] shrink-0" />
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold font-serif text-white">{member.name}</h4>
                            <p className="text-[11px] font-mono text-emerald-400">{member.role}</p>
                            <p className="text-[10px] font-mono text-zinc-400">{member.department}</p>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-zinc-800/40">
                          <span className="text-zinc-500 text-[10px]">{member.publications} Publications</span>
                          <button
                            onClick={() => toggleFacultyConnect(member.id, member.name)}
                            className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
                              isConnected
                                ? 'bg-zinc-800 text-zinc-400'
                                : 'bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-black'
                            }`}
                          >
                            {isConnected ? 'Pending' : '+ Connect'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Alumni Insights (Where they live & What they do) */}
              <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-serif text-white">Alumni Insights</h3>
                    <p className="text-xs font-mono text-zinc-400">Based on 12,400+ graduates tracked across global industry networks</p>
                  </div>
                  <BarChart3 size={16} className="text-emerald-400" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  {/* Where they live */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">Where they live</h4>
                    <div className="space-y-2">
                      {alumniLocations.map(item => (
                        <div key={item.location} className="space-y-1">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-zinc-300">{item.location}</span>
                            <span className="text-emerald-400 font-bold">{item.count.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-[#141B26] h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${item.percent}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What they do */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">What they do</h4>
                    <div className="space-y-2">
                      {alumniFunctions.map(item => (
                        <div key={item.function} className="space-y-1">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-zinc-300">{item.function}</span>
                            <span className="text-emerald-400 font-bold">{item.count.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-[#141B26] h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${item.percent}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB: CAMPUSES */}
          {activeTab === 'campuses' && (
            <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-4">
              <h3 className="text-base font-bold font-serif text-white">Campus Locations & Laboratories</h3>
              <div className="space-y-3.5">
                {(profile.locations && profile.locations.length > 0 ? profile.locations : [
                  { id: 'c-1', name: 'Nairobi Central Campus', address: 'University Way, Nairobi, Kenya', type: 'Primary Research Campus' },
                  { id: 'c-2', name: 'Mombasa Coastal Maritime Tech Hub', address: 'Old Town Pier Road, Mombasa', type: 'Specialized STEM Sandbox & Distributed Node' }
                ]).map(loc => (
                  <div key={loc.id} className="p-4 rounded-xl bg-[#141B26] flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-[#0E131C] text-emerald-400 shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold font-serif text-white">{loc.name}</h4>
                        <p className="text-xs font-mono text-zinc-300">{loc.address}</p>
                        <p className="text-[10px] font-mono text-zinc-500">{loc.type || 'Academic Branch'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => showToast(`Directions loaded for ${loc.name}`)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-black text-xs font-mono font-semibold transition shrink-0 cursor-pointer"
                    >
                      Get directions
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar (4 COLS) */}
        <div className="lg:col-span-4 space-y-4 text-left">
          
          {/* Institutional Affiliations & Accreditation */}
          <div className="bg-[#0E131C] p-5 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase text-zinc-400 font-bold tracking-wider">
                Accreditation & Trust
              </h3>
              <ShieldCheck size={16} className="text-emerald-400" />
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#141B26] space-y-1">
                <span className="text-[10px] text-zinc-500 block uppercase">Regulatory Body</span>
                <p className="text-white font-bold">SETA / NQF Level 8 Framework</p>
                <p className="text-[10px] text-emerald-400">Full Institutional Sovereign Charter</p>
              </div>

              <div className="p-3 rounded-xl bg-[#141B26] space-y-1">
                <span className="text-[10px] text-zinc-500 block uppercase">Cryptographic Registry</span>
                <p className="text-white font-bold">CogniSacra Sovereign Ledger</p>
                <p className="text-[10px] text-zinc-400">Immutable on-chain credential registry</p>
              </div>
            </div>
          </div>

          {/* Similar Higher Institutions (LinkedIn style) */}
          <div className="bg-[#0E131C] p-5 rounded-2xl shadow-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase text-zinc-400 font-bold tracking-wider">
                Similar Institutions
              </h3>
              <Building2 size={14} className="text-zinc-500" />
            </div>

            <div className="space-y-3">
              {similarInstitutions.map(inst => {
                const isFollowed = followedInstitutions.has(inst.id);
                return (
                  <div key={inst.id} className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <img src={inst.avatar} alt={inst.name} className="w-10 h-10 rounded-lg object-cover bg-[#141B26] shrink-0" />
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold font-serif text-white hover:text-emerald-400 transition cursor-pointer">
                          {inst.name}
                        </h4>
                        <p className="text-[10px] font-mono text-zinc-400 line-clamp-1">{inst.type}</p>
                        <p className="text-[9px] font-mono text-zinc-500">{inst.followers} followers</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFollowAffiliate(inst.id, inst.name)}
                      className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold transition shrink-0 cursor-pointer ${
                        isFollowed 
                          ? 'bg-zinc-800 text-zinc-400' 
                          : 'bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-black'
                      }`}
                    >
                      {isFollowed ? 'Following' : '+ Follow'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact & Support */}
          <div className="bg-[#0E131C] p-5 rounded-2xl shadow-xl space-y-3">
            <h3 className="text-xs font-mono uppercase text-zinc-400 font-bold tracking-wider">
              Administration Office
            </h3>
            <div className="space-y-2 text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-emerald-400" />
                <span className="truncate">{profile.supportLinks?.inquiriesEmail || 'admissions@cognisacra.edu'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={13} className="text-emerald-400" />
                <span className="truncate">{profile.website || 'https://cognisacra.edu'}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default InstitutionProfileView;
