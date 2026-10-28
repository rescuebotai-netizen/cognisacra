import React, { useState, useMemo, useRef } from 'react';
import { 
    Home, Users, MessageSquare, Compass, Award, HelpCircle, Heart, Star, 
    Shield, Flame, BookOpen, Share2, Search, Plus, ThumbsUp, ThumbsDown, Calendar, 
    Send, Activity, Settings, Filter, Smile, Sparkles, Trophy, Globe, 
    UserPlus, Info, Check, MessageCircle, BarChart2, ChevronRight, 
    CheckCircle, Cloud, BookOpen as BookMarked, Download, FileText, User,
    Eye, EyeOff, Radio, Wifi, CheckCheck, X, Volume2, ShieldCheck, Zap,
    ExternalLink, AlertCircle, CheckCircle2, Code, Paperclip, Lock, Pin,
    MoreHorizontal, Trash2, Copy, Sliders, FileCode, UploadCloud, Mail
} from 'lucide-react';
import { sendMessageToAI } from '../services/geminiService';

export interface RealtimeLearner {
    id: string;
    name: string;
    avatarUrl: string;
    course: string;
    lesson: string;
    status: 'studying' | 'collaborating' | 'quiz_mode' | 'coding_lab';
    statusText: string;
    streakDays: number;
    matchScore: number;
    isOnline: boolean;
}

export interface PeerChatMessage {
    id: string;
    sender: 'me' | 'them';
    text: string;
    timestamp: string;
}

type SubView = 
    | 'home' 
    | 'communities' 
    | 'forums' 
    | 'circles' 
    | 'mentorship' 
    | 'events' 
    | 'challenges' 
    | 'prayer' 
    | 'knowledge' 
    | 'networking' 
    | 'leaderboards' 
    | 'recognition' 
    | 'ai-guide' 
    | 'analytics';

// ---------------------- TYPES & INTERFACES ----------------------
interface Post {
    id: string;
    author: string;
    avatarUrl: string;
    role: string;
    timestamp: string;
    content: string;
    likes: number;
    hasLiked?: boolean;
    comments: string[];
    showCommentBox?: boolean;
    type?: 'general' | 'testimony' | 'prayer' | 'resource';
}

export interface GroupPostComment {
    id: string;
    author: string;
    authorRole: string;
    avatar: string;
    content: string;
    date: string;
    likes: number;
    hasLiked?: boolean;
}

export interface CommunityGroupPost {
    id: string;
    author: string;
    authorRole: string; // 'Lead Instructor' | 'Institution Admin' | 'Research Fellow' | 'Learner'
    authorAvatar: string;
    date: string;
    content: string;
    likes: number;
    hasLiked?: boolean;
    dislikes: number;
    hasDisliked?: boolean;
    sharesCount: number;
    categoryTag?: string; // 'Research Proof' | 'Theological Ethics' | 'Code Lab' | 'Peer Inquiry'
    codeSnippet?: {
        language: string;
        code: string;
    };
    attachedFile?: {
        name: string;
        size: string;
        type: string;
        content: string;
    };
    comments: GroupPostComment[];
    isPinned?: boolean;
}

export interface CommunityGroupRule {
    id: string;
    title: string;
    description: string;
}

export interface Community {
    id: string;
    name: string;
    category: 'Faith & Spiritual Growth' | 'Academic Learning' | 'Professional Networks' | 'Other';
    membersCount: number;
    discussionsCount: number;
    description: string;
    isJoined: boolean;
    imageUrl: string;
    coverUrl?: string;
    privacy?: 'Public' | 'Private & Accredited';
    creator: {
        name: string;
        role: 'Institution' | 'Instructor';
        avatar: string;
        isVerified?: boolean;
    };
    pinnedAnnouncement?: string;
    rules: CommunityGroupRule[];
    posts: CommunityGroupPost[];
    featuredFiles: { name: string; size: string; date: string; downloads: number; content: string }[];
}

interface ForumThread {
    id: string;
    title: string;
    category: string;
    author: string;
    avatarUrl: string;
    repliesCount: number;
    views: number;
    pinned?: boolean;
    content: string;
    replies: { author: string; content: string; date: string; bestAnswer?: boolean }[];
    isExpanded?: boolean;
}

interface StudyCircle {
    id: string;
    name: string;
    description: string;
    goals: string;
    privacy: 'Public' | 'Private';
    members: string[];
    notes: string;
    tasks: { id: string; text: string; done: boolean }[];
    chatMessages: { sender: string; text: string; time: string }[];
}

export interface MentorReview {
    id: string;
    author: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
}

interface Mentor {
    id: string;
    name: string;
    title: string;
    organization: string;
    expertise: string[];
    avatarUrl: string;
    rating: number;
    reviews: number;
    bio?: string;
    education?: string;
    hourlyRate?: string;
    sovereignDID?: string;
    verifiedCredential?: string;
    languages?: string[];
    userRatedScore?: number;
    recentReviews?: MentorReview[];
}

interface PrayerRequest {
    id: string;
    title: string;
    author: string;
    content: string;
    prayersCount: number;
    hasPrayed?: boolean;
    spiritSupport: number;
}

interface WebinarEvent {
    id: string;
    title: string;
    speaker: string;
    date: string;
    category: 'Webinar' | 'Workshop' | 'Prayer Session' | 'Masterclass';
    description: string;
    isRegistered: boolean;
    avatarUrl: string;
}

const WhatsAppIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.3"/>
    </svg>
);

interface ResourceItem {
    id: string;
    title: string;
    author: string;
    category: string;
    downloads: number;
    hasSaved?: boolean;
    fileSize?: string;
    fileContent?: string;
    uploadedAt?: string;
}

export interface CommunityHubViewProps {
    userRole?: 'learner' | 'instructor' | 'institution';
}

// ---------------------- MAIN HUB COMPONENT ----------------------
const CommunityHubView: React.FC<CommunityHubViewProps> = ({ userRole = 'learner' }) => {
    const isInstructorOrInstitution = userRole === 'instructor' || userRole === 'institution';
    const [currentView, setCurrentView] = useState<SubView>('home');
    const [searchQuery, setSearchQuery] = useState('');

    // --- 1. USER STATS FOR ACCREDITED ENGAGEMENT ---
    const [userPoints, setUserPoints] = useState(380);
    const [userLevel, setUserLevel] = useState(3); // Level 3: Collaborator
    const [unlockedBadges, setUnlockedBadges] = useState<string[]>(['Community Builder', 'Prayer Warrior']);

    // --- REALTIME LEARNERS, VIEW-ONLY MODE & DIRECT MESSAGING ---
    const [isViewOnly, setIsViewOnly] = useState(false);
    const [viewOnlyNotice, setViewOnlyNotice] = useState<string | null>(null);
    const [activeChatPeer, setActiveChatPeer] = useState<RealtimeLearner | null>(null);
    const [isPeerTyping, setIsPeerTyping] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [peerCallActive, setPeerCallActive] = useState(false);
    const [chatThreads, setChatThreads] = useState<Record<string, PeerChatMessage[]>>({
        'learner-sarah': [
            { id: 'm1', sender: 'them', text: 'Hey Alex! Saw you were checking out the Deep Learning optimization module. How is the backprop lab going?', timestamp: '10:14 AM' },
            { id: 'm2', sender: 'me', text: 'Hey Sarah! Working through the custom gradient descent steps now.', timestamp: '10:16 AM' }
        ],
        'learner-kwame': [
            { id: 'm3', sender: 'them', text: 'Greetings brother! Let me know if you want to pair on the AWS ECS task definitions.', timestamp: 'Yesterday' }
        ],
        'learner-elena': [
            { id: 'm4', sender: 'them', text: 'Hi Alex! Just finished diagnostic quiz 4 with 90%. Have you reached module 5 yet?', timestamp: '2h ago' }
        ]
    });

    const [realtimeLearners, setRealtimeLearners] = useState<RealtimeLearner[]>([
        {
            id: 'learner-sarah',
            name: 'Sarah Chen',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
            course: 'Deep Learning & Neural Networks',
            lesson: 'Lab 3: Backpropagation & SGD',
            status: 'studying',
            statusText: 'Active in GPU Lab',
            streakDays: 14,
            matchScore: 96,
            isOnline: true
        },
        {
            id: 'learner-kwame',
            name: 'Kwame Asante',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
            course: 'Distributed Cloud Architectures',
            lesson: 'AWS ECS Task Orchestration',
            status: 'coding_lab',
            statusText: 'Terminal Live Session',
            streakDays: 8,
            matchScore: 91,
            isOnline: true
        },
        {
            id: 'learner-elena',
            name: 'Elena Rostov',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
            course: 'Bioinformatics & Molecular Data',
            lesson: 'Diagnostic Assessment 4',
            status: 'quiz_mode',
            statusText: 'Taking Quiz (7/10)',
            streakDays: 21,
            matchScore: 88,
            isOnline: true
        },
        {
            id: 'learner-david',
            name: 'David Mensah',
            avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
            course: 'Theological Tech Ethics',
            lesson: 'Module 2: Human Dignity in AI',
            status: 'collaborating',
            statusText: 'Open for Study Call',
            streakDays: 12,
            matchScore: 94,
            isOnline: true
        },
        {
            id: 'learner-amara',
            name: 'Amara Diallo',
            avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
            course: 'Full-Stack React Masterclass',
            lesson: 'State Selectors & Profiling',
            status: 'studying',
            statusText: 'Reviewing Code',
            streakDays: 5,
            matchScore: 89,
            isOnline: true
        },
        {
            id: 'learner-mateo',
            name: 'Mateo Silva',
            avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80',
            course: 'Quantum Foundations',
            lesson: 'Grover Search Simulator',
            status: 'collaborating',
            statusText: 'Co-studying with 2 peers',
            streakDays: 19,
            matchScore: 92,
            isOnline: true
        }
    ]);

    // --- 2. SOCIAL FEED STATES ---
    const [posts, setPosts] = useState<Post[]>([
        {
            id: 'p1',
            author: 'Jane Doe',
            role: 'Lead Instructor',
            avatarUrl: 'https://i.pravatar.cc/150?u=janedoe',
            timestamp: '2 hours ago',
            content: 'Just published a new guide on implementing advanced useMemo structures inside your applications. How is everyone applying state selectors this week?',
            likes: 42,
            comments: ["Applying it on my final project and it made a huge difference!", "Excellent guide, Jane!"],
            type: 'resource'
        },
        {
            id: 'p2',
            author: 'Michael Lawson',
            role: 'Kingdom Entrepreneur',
            avatarUrl: 'https://i.pravatar.cc/150?u=michael',
            timestamp: '5 hours ago',
            content: 'Gratitude Post: Launched my theological resource startup today! The mentorship here has given me the spiritual and business backing I needed to scale ethically.',
            likes: 128,
            comments: ["Amen! Wish you the best brother.", "Huge milestone!"],
            type: 'testimony'
        }
    ]);
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostType, setNewPostType] = useState<'general' | 'testimony' | 'prayer' | 'resource'>('general');
    const [newPostComment, setNewPostComment] = useState<{ [postId: string]: string }>({});

    // --- 3. COMMUNITIES SEARCH & CATEGORIES ---
    const [communities, setCommunities] = useState<Community[]>([
        {
            id: 'c1',
            name: 'Kingdom Entrepreneurship Lounge',
            category: 'Professional Networks',
            membersCount: 15200,
            discussionsCount: 120,
            description: 'Building ethical Kingdom-minded startups and corporations through shared resource masterclasses, venture blueprints, and academic mentorship.',
            isJoined: true,
            imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
            coverUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop&q=80',
            privacy: 'Public',
            creator: {
                name: 'Dr. Joseph Adebayo & Pan-African Innovation Lab',
                role: 'Institution',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
                isVerified: true
            },
            pinnedAnnouncement: 'Welcome all Fellows and Entrepreneurs! Our Week 4 Masterclass on Ethical Seed Capital Allocations & AfCFTA Decentralized Trade Rails is scheduled for Friday at 15:00 GMT. Download the Sovereign Term Sheet template from the Subject Vault below.',
            rules: [
                { id: 'r1', title: 'Kingdom Stewardship & Ethics', description: 'All proposed business ventures must align with biblical stewardship, equitable wealth creation, and transparent governance.' },
                { id: 'r2', title: 'Scholarly Proof & Rigor', description: 'Provide verifiable metrics, market data sources, or algorithmic formulations when asserting commercial viability.' },
                { id: 'r3', title: 'Constructive Dialectic', description: 'Critique business models with humility and grace. Zero ad-hominem attacks or unvetted promotional spam.' }
            ],
            posts: [
                {
                    id: 'gp-1',
                    author: 'Dr. Joseph Adebayo',
                    authorRole: 'Lead Instructor',
                    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
                    date: '2 hours ago',
                    categoryTag: 'Research Proof',
                    isPinned: true,
                    content: 'New Sovereign Venture Framework: We have finalized the algorithmic smart contract logic for dividend distribution governed by multi-sig academic validation. Feedback is requested from our peer cohort!',
                    likes: 42,
                    hasLiked: false,
                    dislikes: 1,
                    hasDisliked: false,
                    sharesCount: 15,
                    codeSnippet: {
                        language: 'Solidity',
                        code: '// CogniSacra Sovereign Profit Sharing Protocol\ncontract KingdomVentures {\n    struct Allocation {\n        address recipient;\n        uint256 basisPoints; // 1000 = 10%\n        bytes32 accreditedCredentialHash;\n    }\n    mapping(uint256 => Allocation) public cohortDistributions;\n}'
                    },
                    attachedFile: {
                        name: 'Kingdom_Venture_Term_Sheet_v2.md',
                        size: '34.2 KB',
                        type: 'text/markdown',
                        content: '# Kingdom Venture Sovereign Term Sheet\n\n## Core Principles\n- 10% Firstfruits Community Endowment Pool\n- Decentralized Governance via W3C Sovereign Credentials\n- Zero Usury & Fair Profit Splits'
                    },
                    comments: [
                        { id: 'cm-1', author: 'Sarah Chen', authorRole: 'Research Fellow', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', content: 'The basis point logic is clean. How are we handling multi-currency conversion over lightning rails?', date: '1 hour ago', likes: 6, hasLiked: false },
                        { id: 'cm-2', author: 'Kwame Asante', authorRole: 'Learner', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80', content: 'Already testing this in our local agricultural co-op node. Brilliant work Prof!', date: '35 min ago', likes: 3, hasLiked: false }
                    ]
                },
                {
                    id: 'gp-2',
                    author: 'Amara Diallo',
                    authorRole: 'Learner',
                    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
                    date: '4 hours ago',
                    categoryTag: 'Peer Inquiry',
                    content: 'Question on Customer Discovery: When interviewing local enterprise clients in Nairobi, what questions best separate polite interest from genuine willingness to adopt sovereign identity credentials?',
                    likes: 19,
                    hasLiked: false,
                    dislikes: 0,
                    hasDisliked: false,
                    sharesCount: 4,
                    comments: [
                        { id: 'cm-3', author: 'Mateo Silva', authorRole: 'Research Fellow', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80', content: 'Ask about their current data compliance fines under local GDPR/NDPR. If the pain point costs them money monthly, they will pilot immediately.', date: '3 hours ago', likes: 8, hasLiked: false }
                    ]
                }
            ],
            featuredFiles: [
                { name: 'AfCFTA_Cross_Border_Compliance_Guide.md', size: '128 KB', date: 'Oct 2026', downloads: 342, content: '# AfCFTA Cross-Border Trade & Sovereign Digital Identity\nAuthoritative research manual for Pan-African educational startups.' },
                { name: 'Sovereign_Venture_Pro_Forma_Model.csv', size: '48 KB', date: 'Oct 2026', downloads: 189, content: 'Month,Revenue,Endowment_Tithe,Research_R&D,Net_Surplus\n1,10000,1000,3000,6000\n2,18000,1800,4500,11700' }
            ]
        },
        {
            id: 'c2',
            name: 'Bible Study & Reflections',
            category: 'Faith & Spiritual Growth',
            membersCount: 8400,
            discussionsCount: 95,
            description: 'Daily devotionals, structured biblical exploration, and collaborative scripture review cycles anchored in Christ-centered epistemology.',
            isJoined: false,
            imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&auto=format&fit=crop&q=80',
            coverUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1600&auto=format&fit=crop&q=80',
            privacy: 'Public',
            creator: {
                name: 'Theological Faculty of Covenant Academy',
                role: 'Institution',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
                isVerified: true
            },
            pinnedAnnouncement: 'Reading for Week 3: Colossians 1:15-20 — Christ as the Foundation of all Knowledge and Technological Creation.',
            rules: [
                { id: 'r4', title: 'Scriptural Exegesis', description: 'Contextualize passages with proper historical and linguistic balance.' },
                { id: 'r5', title: 'Uplifting Edification', description: 'Focus all contributions on encouraging spiritual growth and practical love.' }
            ],
            posts: [
                {
                    id: 'gp-3',
                    author: 'Sister Grace Osei',
                    authorRole: 'Lead Instructor',
                    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
                    date: 'Yesterday',
                    categoryTag: 'Theological Ethics',
                    content: 'How does Proverbs 25:2 ("It is the glory of God to conceal a matter; to search out a matter is the glory of kings") inspire our inquiry into neural network latent representations and cryptographic proofs?',
                    likes: 67,
                    hasLiked: false,
                    dislikes: 0,
                    hasDisliked: false,
                    sharesCount: 22,
                    comments: [
                        { id: 'cm-4', author: 'David Mensah', authorRole: 'Learner', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80', content: 'It reveals that discovery and scientific investigation are acts of worship when done with pure motives!', date: '18 hours ago', likes: 14, hasLiked: false }
                    ]
                }
            ],
            featuredFiles: [
                { name: 'Colossians_Theological_Commentary.md', size: '64 KB', date: 'Oct 2026', downloads: 215, content: '# Colossians Theological Commentary\nChristological foundations for modern sciences.' }
            ]
        },
        {
            id: 'c3',
            name: 'Gen-AI Researchers & Innovators',
            category: 'Academic Learning',
            membersCount: 6200,
            discussionsCount: 88,
            description: 'Deep technical discussions surrounding model fine-tuning, retrieval techniques, quantizations, and sovereign ethical AI integration.',
            isJoined: false,
            imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
            coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
            privacy: 'Public',
            creator: {
                name: 'Prof. Marcus Vance',
                role: 'Instructor',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
                isVerified: true
            },
            pinnedAnnouncement: 'Benchmark Challenge: Fine-tuning 8-bit quantized models for edge smartphones in low-bandwidth African villages. Check repo in Files tab.',
            rules: [
                { id: 'r6', title: 'Reproducible Code Only', description: 'Always share complete weights config, seed, or PyTorch scripts.' },
                { id: 'r7', title: 'Zero AI Slop', description: 'Human thought and empirical evaluation must accompany model benchmarks.' }
            ],
            posts: [
                {
                    id: 'gp-4',
                    author: 'Prof. Marcus Vance',
                    authorRole: 'Lead Instructor',
                    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
                    date: '5 hours ago',
                    categoryTag: 'Code Lab',
                    content: 'Here is our optimized LoRA adapter script that reduces inference latency by 43% on edge devices while maintaining FP16 perplexity scores:',
                    likes: 85,
                    hasLiked: false,
                    dislikes: 2,
                    hasDisliked: false,
                    sharesCount: 38,
                    codeSnippet: {
                        language: 'Python',
                        code: 'import torch\nfrom peft import LoraConfig, get_peft_model\n\nlora_config = LoraConfig(\n    r=16,\n    lora_alpha=32,\n    target_modules=["q_proj", "v_proj"],\n    lora_dropout=0.05,\n    bias="none",\n    task_type="CAUSAL_LM"\n)\nmodel = get_peft_model(base_model, lora_config)'
                    },
                    attachedFile: {
                        name: 'edge_lora_quantization_benchmark.py',
                        size: '18.4 KB',
                        type: 'text/x-python',
                        content: '# Benchmark suite for edge LoRA quantized models\nimport time\nprint("Evaluating edge inference latency...")'
                    },
                    comments: [
                        { id: 'cm-5', author: 'Sarah Chen', authorRole: 'Research Fellow', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', content: 'Testing this on an Android Snapdragon node right now. Memory footprint is down to 2.8 GB!', date: '3 hours ago', likes: 11, hasLiked: false }
                    ]
                }
            ],
            featuredFiles: [
                { name: 'LoRA_Edge_Quantization_Paper.md', size: '82 KB', date: 'Oct 2026', downloads: 412, content: '# Low-Rank Adaptation for Sovereign Edge Learning Nodes' }
            ]
        },
        {
            id: 'c4',
            name: 'Sovereign Academics Networking',
            category: 'Academic Learning',
            membersCount: 3100,
            discussionsCount: 44,
            description: 'Collaborating on thesis validation, peer-review support, cryptographic ledger verification, and open-access research paper publication.',
            isJoined: true,
            imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
            coverUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1600&auto=format&fit=crop&q=80',
            privacy: 'Public',
            creator: {
                name: 'African Academy of Sciences Node',
                role: 'Institution',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
                isVerified: true
            },
            pinnedAnnouncement: 'Call for Papers: Q3 Sovereign Academic Journal submission deadline is November 15th.',
            rules: [
                { id: 'r8', title: 'Open Access Attribution', description: 'All published pre-prints must be CC-BY licensed and signed with verifiable DID.' }
            ],
            posts: [
                {
                    id: 'gp-5',
                    author: 'Elena Rostov',
                    authorRole: 'Research Fellow',
                    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
                    date: '6 hours ago',
                    categoryTag: 'Research Proof',
                    content: 'Pre-print submission ready for peer review: "Decentralized Micro-credentials as Proof-of-Competency in Cross-Continental Engineering Transfer". Seeking 2 constructive peer reviewers!',
                    likes: 29,
                    hasLiked: false,
                    dislikes: 0,
                    hasDisliked: false,
                    sharesCount: 9,
                    attachedFile: {
                        name: 'Decentralized_Microcredentials_Preprint.md',
                        size: '56.7 KB',
                        type: 'text/markdown',
                        content: '# Decentralized Micro-credentials in Pan-African Engineering\n\n## Abstract\nThis paper demonstrates that W3C cryptographic signatures reduce credential fraud by 99.4%.'
                    },
                    comments: [
                        { id: 'cm-6', author: 'Alex Turner (You)', authorRole: 'Learner', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80', content: 'I would be honored to review the W3C credential verification pipeline section!', date: '4 hours ago', likes: 5, hasLiked: false }
                    ]
                }
            ],
            featuredFiles: [
                { name: 'Peer_Review_Rubric_Standards.md', size: '24 KB', date: 'Oct 2026', downloads: 145, content: '# Sovereign Peer Review Rubric Standards\nCriteria for evaluation.' }
            ]
        }
    ]);
    const [selectedCommunityCat, setSelectedCommunityCat] = useState<'All' | 'Faith & Spiritual Growth' | 'Academic Learning' | 'Professional Networks'>('All');

    // --- COMMUNITY GROUP INTERACTION STATES (FACEBOOK GROUP STYLE) ---
    const [selectedGroup, setSelectedGroup] = useState<Community | null>(null);
    const [groupTab, setGroupTab] = useState<'feed' | 'files' | 'members' | 'rules' | 'manage'>('feed');
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [isManageGroupModalOpen, setIsManageGroupModalOpen] = useState(false);

    // Group Post Composer State
    const [groupPostContent, setGroupPostContent] = useState('');
    const [groupPostTag, setGroupPostTag] = useState<'Research Proof' | 'Theological Ethics' | 'Code Lab' | 'Peer Inquiry'>('Research Proof');
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [groupPostCodeLang, setGroupPostCodeLang] = useState('TypeScript');
    const [groupPostCode, setGroupPostCode] = useState('');
    const [groupAttachedFile, setGroupAttachedFile] = useState<{ name: string; size: string; type: string; content: string } | null>(null);
    const groupFileInputRef = useRef<HTMLInputElement>(null);
    const [isAiDraftingGroupPost, setIsAiDraftingGroupPost] = useState(false);

    // In-post comments state: Record<postId, commentText>
    const [groupCommentInputs, setGroupCommentInputs] = useState<Record<string, string>>({});

    // New Group Creation State (Instructors & Institutions only)
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupCategory, setNewGroupCategory] = useState<Community['category']>('Academic Learning');
    const [newGroupDescription, setNewGroupDescription] = useState('');
    const [newGroupPrivacy, setNewGroupPrivacy] = useState<'Public' | 'Private & Accredited'>('Public');
    const [newGroupCoverUrl, setNewGroupCoverUrl] = useState('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop&q=80');
    const [newGroupInitialRule, setNewGroupInitialRule] = useState('Maintain rigorous academic integrity and respectful scholarly dialectic.');

    // Management State (for current selected group)
    const [manageAnnouncement, setManageAnnouncement] = useState('');
    const [newRuleTitle, setNewRuleTitle] = useState('');
    const [newRuleDescription, setNewRuleDescription] = useState('');

    // --- REAL-TIME GROUP ACTION HANDLERS ---
    
    // 1. Download file or content using genuine browser Blob download
    const handleDownloadContent = (fileName: string, content: string) => {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast(`Downloaded "${fileName}" successfully.`);
    };

    // 2. Real-time Post Like
    const handleTogglePostLike = (groupId: string, postId: string) => {
        setCommunities(prev => prev.map(comm => {
            if (comm.id !== groupId) return comm;
            return {
                ...comm,
                posts: comm.posts.map(p => {
                    if (p.id !== postId) return p;
                    const nextLiked = !p.hasLiked;
                    const wasDisliked = p.hasDisliked;
                    return {
                        ...p,
                        hasLiked: nextLiked,
                        likes: nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
                        hasDisliked: nextLiked ? false : p.hasDisliked,
                        dislikes: wasDisliked && nextLiked ? Math.max(0, p.dislikes - 1) : p.dislikes
                    };
                })
            };
        }));

        setSelectedGroup(prev => {
            if (!prev || prev.id !== groupId) return prev;
            return {
                ...prev,
                posts: prev.posts.map(p => {
                    if (p.id !== postId) return p;
                    const nextLiked = !p.hasLiked;
                    const wasDisliked = p.hasDisliked;
                    return {
                        ...p,
                        hasLiked: nextLiked,
                        likes: nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
                        hasDisliked: nextLiked ? false : p.hasDisliked,
                        dislikes: wasDisliked && nextLiked ? Math.max(0, p.dislikes - 1) : p.dislikes
                    };
                })
            };
        });
    };

    // 3. Real-time Post Dislike
    const handleTogglePostDislike = (groupId: string, postId: string) => {
        setCommunities(prev => prev.map(comm => {
            if (comm.id !== groupId) return comm;
            return {
                ...comm,
                posts: comm.posts.map(p => {
                    if (p.id !== postId) return p;
                    const nextDisliked = !p.hasDisliked;
                    const wasLiked = p.hasLiked;
                    return {
                        ...p,
                        hasDisliked: nextDisliked,
                        dislikes: nextDisliked ? p.dislikes + 1 : Math.max(0, p.dislikes - 1),
                        hasLiked: nextDisliked ? false : p.hasLiked,
                        likes: wasLiked && nextDisliked ? Math.max(0, p.likes - 1) : p.likes
                    };
                })
            };
        }));

        setSelectedGroup(prev => {
            if (!prev || prev.id !== groupId) return prev;
            return {
                ...prev,
                posts: prev.posts.map(p => {
                    if (p.id !== postId) return p;
                    const nextDisliked = !p.hasDisliked;
                    const wasLiked = p.hasLiked;
                    return {
                        ...p,
                        hasDisliked: nextDisliked,
                        dislikes: nextDisliked ? p.dislikes + 1 : Math.max(0, p.dislikes - 1),
                        hasLiked: nextDisliked ? false : p.hasLiked,
                        likes: wasLiked && nextDisliked ? Math.max(0, p.likes - 1) : p.likes
                    };
                })
            };
        });
    };

    // 4. Real-time Comment Submission
    const handleAddGroupComment = (groupId: string, postId: string) => {
        const text = (groupCommentInputs[postId] || '').trim();
        if (!text) return;

        const newComment: GroupPostComment = {
            id: `cm-${Date.now()}`,
            author: 'Alex Turner (You)',
            authorRole: userRole === 'instructor' ? 'Instructor' : userRole === 'institution' ? 'Institution Admin' : 'Learner',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
            content: text,
            date: 'Just now',
            likes: 0,
            hasLiked: false
        };

        setCommunities(prev => prev.map(comm => {
            if (comm.id !== groupId) return comm;
            return {
                ...comm,
                posts: comm.posts.map(p => {
                    if (p.id !== postId) return p;
                    return {
                        ...p,
                        comments: [...p.comments, newComment]
                    };
                })
            };
        }));

        setSelectedGroup(prev => {
            if (!prev || prev.id !== groupId) return prev;
            return {
                ...prev,
                posts: prev.posts.map(p => {
                    if (p.id !== postId) return p;
                    return {
                        ...p,
                        comments: [...p.comments, newComment]
                    };
                })
            };
        });

        setGroupCommentInputs(prev => ({ ...prev, [postId]: '' }));
        addPoints(10);
        showToast('Comment published in real time (+10 XP).');
    };

    // 5. Real-time Post Share (Multi-Channel Modal)
    const handleShareGroupPost = (post: CommunityGroupPost) => {
        const shareUrl = `${window.location.origin}/community/group/${selectedGroup?.id || 'community'}/post/${post.id}`;
        openShareModal({
            title: `Post by ${post.author}: "${post.content.slice(0, 60)}..."`,
            url: shareUrl,
            category: post.categoryTag || selectedGroup?.name || 'Group Discussion',
            summary: post.content,
            type: 'Group Post',
            originalId: post.id
        });
    };

    // 6. Real-time Post Download (Full Post + Comments transcript)
    const handleDownloadGroupPost = (post: CommunityGroupPost) => {
        const transcript = `# CogniSacra Academic Community Post\n\n**Group:** ${selectedGroup?.name || 'Academic Community'}\n**Author:** ${post.author} (${post.authorRole})\n**Date:** ${post.date}\n**Category:** #${post.categoryTag || 'General'}\n**Likes:** ${post.likes} | **Dislikes:** ${post.dislikes} | **Shares:** ${post.sharesCount}\n\n---\n\n## Content\n${post.content}\n\n${post.codeSnippet ? `### Code Snippet (${post.codeSnippet.language})\n\`\`\`${post.codeSnippet.language.toLowerCase()}\n${post.codeSnippet.code}\n\`\`\`\n\n` : ''}${post.attachedFile ? `### Attached Academic Resource\n- **File Name:** ${post.attachedFile.name}\n- **Size:** ${post.attachedFile.size}\n\n` : ''}---\n\n## Peer Comments (${post.comments.length})\n${post.comments.map(c => `- **${c.author}** (${c.authorRole}) [${c.date}]:\n  ${c.content}`).join('\n\n')}\n\n---\n*Verified on CogniSacra Sovereign Knowledge Network — W3C DID Standard*`;

        handleDownloadContent(`CogniSacra_Post_${post.id}.md`, transcript);
    };

    // 7. Handle Real-Time File Attachment in Composer
    const handleGroupFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const sizeKb = (file.size / 1024).toFixed(1);
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string || `# ${file.name}\n\nAcademic file uploaded on CogniSacra platform.`;
            setGroupAttachedFile({
                name: file.name,
                size: `${sizeKb} KB`,
                type: file.type || 'text/plain',
                content: content
            });
            showToast(`Attached file: ${file.name} (${sizeKb} KB)`);
        };
        reader.readAsText(file);
    };

    // 8. Publish New Group Post in Real-Time
    const handlePublishGroupPost = () => {
        if (!selectedGroup) return;
        if (!groupPostContent.trim()) {
            showToast('Please type your post content before publishing.');
            return;
        }

        const newPost: CommunityGroupPost = {
            id: `gp-${Date.now()}`,
            author: 'Alex Turner (You)',
            authorRole: userRole === 'instructor' ? 'Lead Instructor' : userRole === 'institution' ? 'Institution Admin' : 'Learner',
            authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
            date: 'Just now',
            content: groupPostContent.trim(),
            categoryTag: groupPostTag,
            likes: 0,
            hasLiked: false,
            dislikes: 0,
            hasDisliked: false,
            sharesCount: 0,
            codeSnippet: showCodeInput && groupPostCode.trim() ? {
                language: groupPostCodeLang,
                code: groupPostCode.trim()
            } : undefined,
            attachedFile: groupAttachedFile || undefined,
            comments: []
        };

        setCommunities(prev => prev.map(comm => {
            if (comm.id !== selectedGroup.id) return comm;
            return {
                ...comm,
                discussionsCount: comm.discussionsCount + 1,
                posts: [newPost, ...comm.posts]
            };
        }));

        setSelectedGroup(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                discussionsCount: prev.discussionsCount + 1,
                posts: [newPost, ...prev.posts]
            };
        });

        // Reset composer
        setGroupPostContent('');
        setShowCodeInput(false);
        setGroupPostCode('');
        setGroupAttachedFile(null);
        addPoints(25);
        showToast('Post published live to community group (+25 XP)!');
    };

    // 9. Draft with AI in Group Post Composer
    const handleAiDraftGroupPost = async () => {
        if (!selectedGroup) return;
        setIsAiDraftingGroupPost(true);
        try {
            const prompt = `You are a scholarly research assistant on CogniSacra. Draft a concise, high-impact 2-paragraph academic discussion post for the community group "${selectedGroup.name}" under category "${groupPostTag}". Include an inquiry question and a brief theoretical or ethical rationale. Do not use generic filler words. Keep it strictly scholarly and engaging.`;
            const stream = await sendMessageToAI(prompt);
            let accumulated = '';
            for await (const chunk of stream) {
                accumulated += chunk.text;
                setGroupPostContent(accumulated);
            }
            showToast('Draft with AI completed!');
        } catch {
            setGroupPostContent(`Examining the epistemological invariants within ${selectedGroup.name}: When deploying decentralized verification rails, how do we reconcile Byzantine fault tolerances with deterministic academic peer-review latencies?\n\nLooking for perspectives from fellows who have stress-tested this under real network partitioning constraints.`);
            showToast('AI draft generated.');
        } finally {
            setIsAiDraftingGroupPost(false);
        }
    };

    // 10. Create New Community Group (Institutions and Instructors ONLY)
    const handleCreateCommunityGroup = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isInstructorOrInstitution) {
            showToast('Only verified Institutions and Instructors are authorized to create community groups.');
            return;
        }

        if (!newGroupName.trim() || !newGroupDescription.trim()) {
            showToast('Please provide both a group name and description.');
            return;
        }

        const newCommunity: Community = {
            id: `cg-${Date.now()}`,
            name: newGroupName.trim(),
            category: newGroupCategory,
            membersCount: 1,
            discussionsCount: 0,
            description: newGroupDescription.trim(),
            isJoined: true,
            imageUrl: newGroupCoverUrl,
            coverUrl: newGroupCoverUrl,
            privacy: newGroupPrivacy,
            creator: {
                name: userRole === 'institution' ? 'Covenant University Admin' : 'Dr. Joseph Adebayo',
                role: userRole === 'institution' ? 'Institution' : 'Instructor',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
                isVerified: true
            },
            pinnedAnnouncement: 'Welcome to this newly chartered academic community group! Review the group rules and introduce your research objectives.',
            rules: [
                {
                    id: `r-${Date.now()}`,
                    title: 'Academic Integrity & Rigor',
                    description: newGroupInitialRule.trim() || 'Ensure all assertions are backed by scholarly citations and ethical inquiry.'
                }
            ],
            posts: [],
            featuredFiles: []
        };

        setCommunities(prev => [newCommunity, ...prev]);
        setSelectedGroup(newCommunity);
        setIsCreateGroupModalOpen(false);
        setNewGroupName('');
        setNewGroupDescription('');
        addPoints(50);
        showToast(`Community Group "${newCommunity.name}" created and launched in real time (+50 XP)!`);
    };

    // 11. Instructor / Institution Group Management Actions
    const handlePinGroupAnnouncement = (groupId: string, text: string) => {
        if (!isInstructorOrInstitution) return;
        setCommunities(prev => prev.map(c => c.id === groupId ? { ...c, pinnedAnnouncement: text } : c));
        setSelectedGroup(prev => prev && prev.id === groupId ? { ...prev, pinnedAnnouncement: text } : prev);
        showToast('Group pinned announcement updated in real time.');
    };

    const handleDeleteGroupPost = (groupId: string, postId: string) => {
        if (!isInstructorOrInstitution) {
            showToast('Only instructors and institutions can moderate group posts.');
            return;
        }
        setCommunities(prev => prev.map(c => {
            if (c.id !== groupId) return c;
            return {
                ...c,
                discussionsCount: Math.max(0, c.discussionsCount - 1),
                posts: c.posts.filter(p => p.id !== postId)
            };
        }));
        setSelectedGroup(prev => {
            if (!prev || prev.id !== groupId) return prev;
            return {
                ...prev,
                discussionsCount: Math.max(0, prev.discussionsCount - 1),
                posts: prev.posts.filter(p => p.id !== postId)
            };
        });
        showToast('Post removed from group feed.');
    };

    const handleAddGroupRule = (groupId: string, title: string, desc: string) => {
        if (!isInstructorOrInstitution || !title.trim()) return;
        const newRule: CommunityGroupRule = {
            id: `rule-${Date.now()}`,
            title: title.trim(),
            description: desc.trim() || 'Adhere strictly to group academic conduct.'
        };
        setCommunities(prev => prev.map(c => c.id === groupId ? { ...c, rules: [...c.rules, newRule] } : c));
        setSelectedGroup(prev => prev && prev.id === groupId ? { ...prev, rules: [...prev.rules, newRule] } : prev);
        setNewRuleTitle('');
        setNewRuleDescription('');
        showToast('New Canon Rule added to group.');
    };

    const handleDeleteGroupRule = (groupId: string, ruleId: string) => {
        if (!isInstructorOrInstitution) return;
        setCommunities(prev => prev.map(c => c.id === groupId ? { ...c, rules: c.rules.filter(r => r.id !== ruleId) } : c));
        setSelectedGroup(prev => prev && prev.id === groupId ? { ...prev, rules: prev.rules.filter(r => r.id !== ruleId) } : prev);
        showToast('Canon Rule removed.');
    };

    // --- 4. EXPLICIT DISCUSSION FORUMS ---
    const [forums, setForums] = useState<ForumThread[]>([
        {
            id: 'f1',
            title: 'Is traditional relational DB better suited for enterprise Kingdom SaaS projects?',
            category: 'Questions & Answers',
            author: 'David Vance',
            avatarUrl: 'https://i.pravatar.cc/150?u=david',
            repliesCount: 3,
            views: 240,
            pinned: true,
            content: 'We are deciding whether to choose Postgres (Cloud SQL) or Firestore for a large platform. Looking for architectural tradeoffs concerning transaction safety.',
            replies: [
                { author: 'Emily White', content: 'For nested real-time chats, Firestore is amazing, but schema consistency and reporting metrics definitely favor relational databases.', date: '3 hours ago', bestAnswer: true },
                { author: 'Jane Doe', content: 'Yes! If you require complex SQL aggregations, use PostgreSQL.', date: '1 hour ago' }
            ]
        },
        {
            id: 'f2',
            title: 'Course Discussion: Section 5 of Advanced React Hooks',
            category: 'Course Discussions',
            author: 'Sarah Jenkins',
            avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
            repliesCount: 1,
            views: 110,
            content: 'I got stuck on custom reducer dependencies. Does anyone have a clean refactoring example?',
            replies: [
                { author: 'Alex Turner (You)', content: 'Try moving the state updater function outside of the component or tracking dispatch.', date: '30 min ago' }
            ]
        }
    ]);
    const [newForumTitle, setNewForumTitle] = useState('');
    const [newForumCategory, setNewForumCategory] = useState('Questions & Answers');
    const [newForumContent, setNewForumContent] = useState('');
    const [newForumReply, setNewForumReply] = useState<{ [threadId: string]: string }>({});

    // --- 5. STUDY CIRCLES STATE ---
    const [studyCircles, setStudyCircles] = useState<StudyCircle[]>([
        {
            id: 'sc1',
            name: 'React Mastery Accountability Group',
            description: 'A 4-week intensive checking in daily to finish courses, review homework, and clear obstacles.',
            goals: 'Finish React + TypeScript Curriculum with 100% homework submission.',
            privacy: 'Public',
            members: ['Alex Turner', 'Sarah Jenkins', 'Esther K.'],
            notes: 'Current study notes: Focused heavily on layout animations and responsive canvas styling during week 2.',
            tasks: [
                { id: 't1', text: 'Complete React Profiler Lesson', done: true },
                { id: 't2', text: 'Submit Midterm Prototype', done: false },
                { id: 't3', text: 'Review peer project submission', done: false }
            ],
            chatMessages: [
                { sender: 'Sarah Jenkins', text: 'Hey guys! Just completed the rendering optimization assignment.', time: '12:30 PM' },
                { sender: 'Esther K.', text: 'Awesome! Let’s hop on an audio sync tomorrow!', time: '12:45 PM' }
            ]
        }
    ]);
    const [activeCircleId, setActiveCircleId] = useState<string | null>('sc1');
    const [newCircleName, setNewCircleName] = useState('');
    const [newCircleDesc, setNewCircleDesc] = useState('');
    const [newCircleGoals, setNewCircleGoals] = useState('');
    const [newCirclePrivacy, setNewCirclePrivacy] = useState<'Public' | 'Private'>('Public');
    const [showCreateCircleForm, setShowCreateCircleForm] = useState(false);
    const [circleChatMessage, setCircleChatMessage] = useState('');

    // --- 6. MENTORSHIP MARKETPLACE ---
    const [mentorsInfo, setMentorsInfo] = useState<Mentor[]>([
        {
            id: 'm1',
            name: 'Dr. Evelyn Reed',
            title: 'Theologian & Strategic Business Advisor',
            organization: 'CogniSacra Academy',
            expertise: ['Kingdom Entrepreneurship', 'Sovereign Leadership', 'Ethics'],
            avatarUrl: 'https://i.pravatar.cc/150?u=evelyn',
            rating: 4.9,
            reviews: 142,
            bio: 'Senior Faculty Advisor specializing in ethical corporate architectures, Kingdom entrepreneurship models, and sovereign stewardship principles. Advises venture founders, researchers, and technical leaders globally.',
            education: 'Ph.D. in Moral Philosophy (Oxford), M.Div. (Princeton)',
            hourlyRate: '$120 / session (Waived for Fellows)',
            sovereignDID: 'did:ion:EiA_0x9b7f329a7c29e11048bca689914751f8b417e57c',
            verifiedCredential: 'W3C Verifiable Accreditation · Higher Education Fellow',
            languages: ['English', 'Biblical Hebrew', 'French'],
            recentReviews: [
                { id: 'r1', author: 'Brother David', avatar: 'https://i.pravatar.cc/150?u=david', rating: 5, date: '2 days ago', comment: 'Dr. Evelyn helped clarify my venture cap table and align our tokenomics with sacred principles. Essential guidance!' },
                { id: 'r2', author: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=sarah', rating: 5, date: '1 week ago', comment: 'Exceptional depth of insight. Uncompromising academic rigor combined with spiritual tenderness.' }
            ]
        },
        {
            id: 'm2',
            name: 'John Smith',
            title: 'Principal UX/UI Designer',
            organization: 'Creative AI Studios',
            expertise: ['Figma', 'Generative Design Systems', 'Visual Craft'],
            avatarUrl: 'https://i.pravatar.cc/150?u=johnsmith',
            rating: 4.8,
            reviews: 98,
            bio: 'Principal visual architect focusing on human dignity interfaces, typographic discipline, and zero-distraction spatial cognitive workflows. Former Design Director with 14 years industry mastery.',
            education: 'M.F.A. in Visual Design (Rhode Island School of Design)',
            hourlyRate: '$110 / session',
            sovereignDID: 'did:ion:EiB_0x82a94f112e847c92bda4018824f195827361a99',
            verifiedCredential: 'W3C Verifiable Credential · Master Craftsman Guild',
            languages: ['English', 'German'],
            recentReviews: [
                { id: 'r3', author: 'Alena K.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', rating: 5, date: '3 days ago', comment: 'John radically elevated our app design system. He spotted 7 micro-interaction flaws in 10 minutes.' }
            ]
        },
        {
            id: 'm3',
            name: 'Emily White',
            title: 'Lead Quantitative Analyst',
            organization: 'DataDriven Corp',
            expertise: ['Python', 'Large Language Models', 'Data Architectures'],
            avatarUrl: 'https://i.pravatar.cc/150?u=emilywhite',
            rating: 5.0,
            reviews: 164,
            bio: 'Machine learning systems engineer and distributed compute specialist. Focuses on neural network interpretability, verifiable data pipelines, and reproducible mathematical modeling.',
            education: 'M.S. in Machine Learning (MIT), B.S. in Applied Mathematics (Stanford)',
            hourlyRate: '$140 / session',
            sovereignDID: 'did:ion:EiC_0x11740928be847ca019948271049281a88472910',
            verifiedCredential: 'W3C Verifiable Credential · Applied Neural Architect',
            languages: ['English', 'Spanish', 'Mandarin'],
            recentReviews: [
                { id: 'r4', author: 'Michael Lawson', avatar: 'https://i.pravatar.cc/150?u=michael', rating: 5, date: 'Yesterday', comment: 'Emily solved our vector index latency roadblock in one consultation. Remarkable precision.' }
            ]
        }
    ]);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [viewingMentorProfile, setViewingMentorProfile] = useState<Mentor | null>(null);
    const [mentorHoverRatings, setMentorHoverRatings] = useState<Record<string, number>>({});
    const [bookingRequested, setBookingRequested] = useState(false);
    const [bookingTopic, setBookingTopic] = useState('Career Roadmap & Kingdom Alignment');
    const [bookingDay, setBookingDay] = useState('2026-06-25');
    const [scheduledSessions, setScheduledSessions] = useState<{ id: string; mentorName: string; topic: string; date: string; time: string }[]>([
        { id: 's1', mentorName: 'Dr. Evelyn Reed', topic: 'Kingdom Alignment in Business Startup', date: '2026-06-23', time: '14:00' }
    ]);

    // --- MULTI-CHANNEL SHARE MODAL & KNOWLEDGE EXCHANGE STATES ---
    const [shareModalData, setShareModalData] = useState<{
        title: string;
        url: string;
        category?: string;
        summary?: string;
        type?: string;
        originalId?: string;
    } | null>(null);
    const [selectedPeerToDm, setSelectedPeerToDm] = useState<string>('');
    const [dmShareNote, setDmShareNote] = useState<string>('');
    const [shareCopied, setShareCopied] = useState<boolean>(false);
    const [resourceCategoryFilter, setResourceCategoryFilter] = useState<string>('All');
    const [resourceSearchTerm, setResourceSearchTerm] = useState<string>('');
    const [viewingResourcePreview, setViewingResourcePreview] = useState<ResourceItem | null>(null);

    // --- 7. PRAYER ROOM ---
    const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([
        { id: 'pr1', title: 'Wisdom for Devs working on Community Impact Apps', author: 'Brother David', content: 'Please uplift our engineering circles as we design digital platforms. Let us prioritize human dignity and sacred study methods.', prayersCount: 28, spiritSupport: 12 },
        { id: 'pr2', title: 'Strengthening Theological Researchers', author: 'Esther Vance', content: 'Seeking prayer for guidance on translating rare manuscript references into the institutional digital library catalog.', prayersCount: 15, spiritSupport: 5 }
    ]);
    const [newPrayerTitle, setNewPrayerTitle] = useState('');
    const [newPrayerBody, setNewPrayerBody] = useState('');
    const [gratitudeNotes, setGratitudeNotes] = useState<string[]>([
        "Grateful for finding a study buddy who values both state hooks and prayer!",
        "Completed my AWS certificate. Praise God!"
    ]);
    const [newGratitudeText, setNewGratitudeText] = useState('');

    // --- 8. EVENTS & WEBINARS ---
    const [events, setEvents] = useState<WebinarEvent[]>([
        {
            id: 'ev1',
            title: 'Artificial Intelligence & Kingdom Wisdom Mini-Conference',
            speaker: 'Dr. Evelyn Reed & Emily White',
            date: '2026-06-22T17:00:00.000Z',
            category: 'Webinar',
            description: 'Exploring neural network alignment through the lens of ethical wisdom frameworks, deep reflection techniques, and practical data science.',
            isRegistered: false,
            avatarUrl: 'https://i.pravatar.cc/150?u=evelyn'
        },
        {
            id: 'ev2',
            title: 'Sovereign Designing with Figma: High-Fidelity Interactive Layouts',
            speaker: 'John Smith',
            date: '2026-06-24T15:00:00.000Z',
            category: 'Masterclass',
            description: 'Intense masterclass targeting typography systems, rhythmic space variations, component variables, and grid logic.',
            isRegistered: true,
            avatarUrl: 'https://i.pravatar.cc/150?u=johnsmith'
        }
    ]);

    // --- 9. KNOWLEDGE EXCHANGE FILES ---
    const [resources, setResources] = useState<ResourceItem[]>([
        { 
            id: 'r1', 
            title: 'Kingdom Startup Pitch-Deck Template v2', 
            author: 'Dr. Evelyn Reed', 
            category: 'Templates', 
            downloads: 356,
            fileSize: '2.4 MB',
            uploadedAt: 'Yesterday',
            fileContent: `# Kingdom Startup Pitch-Deck Template v2\n\nAuthor: Dr. Evelyn Reed\nInstitution: CogniSacra Sovereign Academic Network\nW3C Credential Digest: 0x9b7f329a7c29e11048bca689914751f8b417e57c\n\n## Section 1: Executive Thesis\nThis framework pairs high-integrity technology venture design with biblical ethics and sustainable Kingdom stewardship principles.\n\n## Section 2: Unit Economics & Capital Integrity\n- Zero deceptive pattern monetization\n- Transparent shareholder value allocation\n- Human dignity metrics prioritized over engagement addiction\n\n## Section 3: Technical Architecture\n- Sovereign cryptographic passport integration\n- Zero-knowledge data sovereignty standards\n\n© 2026 CogniSacra Sovereign Academic Trust.`
        },
        { 
            id: 'r2', 
            title: 'React Performance Audit Checksheet & Core Metrics', 
            author: 'Jane Doe', 
            category: 'Articles', 
            downloads: 820,
            fileSize: '1.1 MB',
            uploadedAt: '3 days ago',
            fileContent: `# React Performance Audit Checksheet & Core Metrics\n\nAuthor: Jane Doe (Lead Instructor)\nTopic: Advanced React Performance Engineering\n\n## 1. Render Profiling Checklist\n- Identify unnecessary re-renders with React Profiler flamegraphs\n- Hoist selector functions outside component bodies\n- Implement stable callback references using useMemo and useCallback\n\n## 2. Memory & Virtualization\n- Virtualize lists with more than 50 rows\n- Clean up long-running event listeners and subscriptions in useEffect returns\n\n## 3. Sovereign Performance Baseline\n- Max First Input Delay (FID): < 50ms\n- Cumulative Layout Shift (CLS): 0.00\n\nCogniSacra Academy Official Technical Vault.`
        },
        { 
            id: 'r3', 
            title: 'Theological Digitalization Ethics Proposal Paper', 
            author: 'Brother David', 
            category: 'Research Papers', 
            downloads: 145,
            fileSize: '3.8 MB',
            uploadedAt: '1 week ago',
            fileContent: `# Theological Digitalization Ethics Proposal Paper\n\nAuthor: Brother David\nSubject: Systematic Theology & Artificial Intelligence Alignment\n\n### Abstract\nAs digital systems increasingly mediate human learning, theological institutions must articulate clear frameworks protecting the sanctity of human thought, collaborative prayer, and uncompromised truth.\n\n### Key Theses\n1. Technology as Subservient Tool, not Sovereign Master\n2. Algorithmic transparency as moral imperative\n3. Sacred accountability in community networks\n\nVerified Sovereign Academic Digest.`
        }
    ]);
    const [uploadedResourceTitle, setUploadedResourceTitle] = useState('');
    const [uploadedResourceCat, setUploadedResourceCat] = useState('Templates');
    const [selectedResourceFile, setSelectedResourceFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isPublishingResource, setIsPublishingResource] = useState(false);
    const resourceFileInputRef = useRef<HTMLInputElement | null>(null);

    // --- 10. CONNECTIONS & LOUNGERS ---
    const [loungers, setLoungers] = useState<{
        id: string;
        name: string;
        title: string;
        country: string;
        mutualG: number;
        isConnected: boolean;
        whatsappNumber: string;
        avatarUrl: string;
        isOnline: boolean;
        skills: string[];
    }[]>([
        { 
            id: 'l1', 
            name: 'Alena K.', 
            title: 'UX Designer & Design Systems Lead', 
            country: 'South Africa', 
            mutualG: 5, 
            isConnected: false,
            whatsappNumber: '+27821994321',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
            isOnline: true,
            skills: ['Figma Tokens', 'Sovereign UI', 'Tailwind']
        },
        { 
            id: 'l2', 
            name: 'Ephraim J.', 
            title: 'Theological Scholar & Manuscript Archivist', 
            country: 'Kenya', 
            mutualG: 2, 
            isConnected: true,
            whatsappNumber: '+254711823901',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
            isOnline: true,
            skills: ['Systematic Theology', 'Hebrew Exegesis', 'Ethics']
        },
        { 
            id: 'l3', 
            name: 'Jonathan Wade', 
            title: 'Distributed Cloud & Infrastructure Architect', 
            country: 'Nigeria', 
            mutualG: 8, 
            isConnected: false,
            whatsappNumber: '+2348035512390',
            avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
            isOnline: true,
            skills: ['Kubernetes', 'PostgreSQL', 'Cloud SQL']
        },
        { 
            id: 'l4', 
            name: 'Grace Osei', 
            title: 'Bioinformatics Researcher & Data Scientist', 
            country: 'Ghana', 
            mutualG: 4, 
            isConnected: false,
            whatsappNumber: '+233244890123',
            avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
            isOnline: true,
            skills: ['Genomics Python', 'Phylogenetics', 'Bioethics']
        }
    ]);
    const [openWhatsAppModal, setOpenWhatsAppModal] = useState(false);
    const [whatsAppTarget, setWhatsAppTarget] = useState<{
        id: string;
        name: string;
        title: string;
        country: string;
        whatsappNumber: string;
    } | null>(null);
    const [whatsAppCustomText, setWhatsAppCustomText] = useState('');

    // --- DAY CHECK & REDIRECT STATES ---
    const [dayCheckStreak, setDayCheckStreak] = useState(4);
    const [dayCheckVerifiedToday, setDayCheckVerifiedToday] = useState(false);

    // --- PEER FEEDBACK MODAL & REDIRECT STATES ---
    const [peerReviewsCount, setPeerReviewsCount] = useState(1);
    const [showPeerReviewModal, setShowPeerReviewModal] = useState(false);
    const [selectedPeerSubmission] = useState<{
        id: string;
        studentName: string;
        projectTitle: string;
        course: string;
        contentSummary: string;
        submissionDate: string;
    }>({
        id: 'sub-301',
        studentName: 'Mateo Silva',
        projectTitle: 'Binary Search Tree Rotations & AVL Rebalancing Lab',
        course: 'Data Structures & Algorithms',
        contentSummary: 'Implemented left and right double rotations with recursive rebalance height calculations. Verified with 10,000 randomized test nodes.',
        submissionDate: 'June 19, 2026'
    });
    const [peerRubricScore, setPeerRubricScore] = useState({
        methodology: 95,
        clarity: 90,
        ethics: 100,
        codeQuality: 92
    });
    const [peerFeedbackComment, setPeerFeedbackComment] = useState('Excellent algorithmic clarity on the double rotation tree balance factors. The test suite coverage demonstrates strong rigor!');

    // --- REFLECTION SUBMISSION & HIGHLIGHT STATES ---
    const [recentReflectionId, setRecentReflectionId] = useState<string | null>(null);

    // --- RECOGNITION WALL & LEADERBOARD TABS ---
    const [recognitionSubTab, setRecognitionSubTab] = useState<'leaderboard' | 'heroes' | 'commendations'>('leaderboard');
    const [leaderboardFilter, setLeaderboardFilter] = useState<'global' | 'cohort' | 'fellowship'>('global');
    const [kudosGiven, setKudosGiven] = useState<Record<string, boolean>>({});
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4000);
    };

    // --- 11. AI SPIRITUAL GUIDE MESSAGE AGENT ---
    const [aiGuideInput, setAiGuideInput] = useState('');
    const [aiGuideLog, setAiGuideLog] = useState<{ sender: 'user' | 'assistant'; text: string; time: string }[]>([
        { sender: 'assistant', text: 'Grace and Peace, Alex! I am your CogniSacra AI Guide. I can summarize thread posts, recommend study circles, search theological archives, or offer alignment encouragement. Ask me anything.', time: '14:02' }
    ]);

    // ---------------------- LOGICAL ENGAGEMENT ACTIONS ----------------------
    const addPoints = (amount: number, badgeName?: string) => {
        setUserPoints(prev => {
            const next = prev + amount;
            // Level tier calculation placeholder
            if (next >= 500 && userLevel < 4) {
                setUserLevel(4); // Upgraded!
            }
            return next;
        });
        if (badgeName && !unlockedBadges.includes(badgeName)) {
            setUnlockedBadges([...unlockedBadges, badgeName]);
        }
    };

    const triggerViewOnlyNotice = () => {
        setViewOnlyNotice('View-Only Mode is active. Switch to Interactive Mode in the top header to post, comment, or create.');
        setTimeout(() => setViewOnlyNotice(null), 4000);
    };

    const handleSendPeerMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!chatInput.trim() || !activeChatPeer) return;

        const peerId = activeChatPeer.id;
        const userMsg: PeerChatMessage = {
            id: `msg-${Date.now()}`,
            sender: 'me',
            text: chatInput.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatThreads(prev => ({
            ...prev,
            [peerId]: [...(prev[peerId] || []), userMsg]
        }));
        setChatInput('');
        setIsPeerTyping(true);

        setTimeout(() => {
            setIsPeerTyping(false);
            const replies: Record<string, string[]> = {
                'learner-sarah': [
                    "That's spot on! In the forward pass, caching intermediate layer activations really speeds up the GPU backpropagation pass.",
                    "Awesome insight! Let me share my notes on the adaptive momentum rate with you.",
                    "I just completed that section! Let's definitely do a live study session before the midterm."
                ],
                'learner-kwame': [
                    "Great to hear! When you define the Task Execution IAM role, ensure cloudwatch:PutLogEvents is enabled.",
                    "Let's jump into the Virtual Classroom audio room later this evening to compare architectures!",
                    "That helped solve my issue with Docker network bridge too. Thanks Alex!"
                ],
                'learner-elena': [
                    "Question 8 on alignment algorithms was tricky, but reviewing the FASTA heuristics made it click!",
                    "Yes, Module 5 covers phylogenetic tree reconstruction. You are going to love the Python labs.",
                    "Let me know if you want to cross-verify quiz answers once you wrap up!"
                ]
            };
            const defaultPool = [
                `Thanks for the note, Alex! I'm currently focused on ${activeChatPeer.lesson}. Keep crushing it!`,
                "Great connection! Let's keep supporting each other's progress here on CogniSacra.",
                "Awesome thought! Let's sync up in the study circle later today."
            ];
            const peerOptions = replies[peerId] || defaultPool;
            const chosen = peerOptions[Math.floor(Math.random() * peerOptions.length)];

            const peerMsg: PeerChatMessage = {
                id: `reply-${Date.now()}`,
                sender: 'them',
                text: chosen,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setChatThreads(prev => ({
                ...prev,
                [peerId]: [...(prev[peerId] || []), peerMsg]
            }));
            addPoints(5);
        }, 1100);
    };

    // Social post handlers
    const createSocialPost = (e: React.FormEvent) => {
        e.preventDefault();
        if (isViewOnly) {
            triggerViewOnlyNotice();
            return;
        }
        if (!newPostContent.trim()) return;
        const fresh: Post = {
            id: `post-${Date.now()}`,
            author: 'Alex Turner (You)',
            role: 'Lead Developer',
            avatarUrl: 'https://i.pravatar.cc/150?u=alexturner',
            timestamp: 'Just now',
            content: newPostContent,
            likes: 0,
            comments: [],
            type: newPostType
        };
        setPosts([fresh, ...posts]);
        setNewPostContent('');
        addPoints(15);
    };

    const toggleLikePost = (postId: string) => {
        setPosts(posts.map(p => {
            if (p.id === postId) {
                const liked = !p.hasLiked;
                return {
                    ...p,
                    hasLiked: liked,
                    likes: liked ? p.likes + 1 : p.likes - 1
                };
            }
            return p;
        }));
    };

    const addPostComment = (postId: string, commentText: string) => {
        if (!commentText.trim()) return;
        setPosts(posts.map(p => {
            if (p.id === postId) {
                return {
                    ...p,
                    comments: [...p.comments, commentText]
                };
            }
            return p;
        }));
        setNewPostComment({ ...newPostComment, [postId]: '' });
        addPoints(5);
    };

    // Discussion boards handlers
    const createForumThread = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newForumTitle.trim() || !newForumContent.trim()) return;
        const fresh: ForumThread = {
            id: `f-${Date.now()}`,
            title: newForumTitle,
            category: newForumCategory,
            author: 'Alex Turner (You)',
            avatarUrl: 'https://i.pravatar.cc/150?u=alexturner',
            repliesCount: 0,
            views: 4,
            content: newForumContent,
            replies: []
        };
        setForums([fresh, ...forums]);
        setNewForumTitle('');
        setNewForumContent('');
        addPoints(25);
    };

    const addForumReply = (threadId: string) => {
        const text = newForumReply[threadId];
        if (!text || !text.trim()) return;
        setForums(forums.map(f => {
            if (f.id === threadId) {
                return {
                    ...f,
                    repliesCount: f.repliesCount + 1,
                    replies: [...f.replies, { author: 'Alex Turner (You)', content: text, date: 'Just now' }]
                };
            }
            return f;
        }));
        setNewForumReply({ ...newForumReply, [threadId]: '' });
        addPoints(10);
    };

    // Study circle handlers
    const createStudyCircle = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCircleName.trim()) return;
        const fresh: StudyCircle = {
            id: `sc-${Date.now()}`,
            name: newCircleName,
            description: newCircleDesc,
            goals: newCircleGoals,
            privacy: newCirclePrivacy,
            members: ['Alex Turner (You)'],
            notes: 'Notes starting area. Write important references here!',
            tasks: [
                { id: `t-${Date.now()}-1`, text: 'Add milestone checkpoint', done: false },
                { id: `t-${Date.now()}-2`, text: 'Schedule study room meeting', done: false }
            ],
            chatMessages: [
                { sender: 'AI Guide Support', text: 'Welcome to your brand-new, accountability-backed study circle!', time: 'Now' }
            ]
        };
        setStudyCircles([...studyCircles, fresh]);
        setActiveCircleId(fresh.id);
        setNewCircleName('');
        setNewCircleDesc('');
        setNewCircleGoals('');
        setShowCreateCircleForm(false);
        addPoints(35, 'Community Builder');
    };

    const toggleCircleTask = (circleId: string, taskId: string) => {
        setStudyCircles(studyCircles.map(sc => {
            if (sc.id === circleId) {
                return {
                    ...sc,
                    tasks: sc.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
                };
            }
            return sc;
        }));
        addPoints(2);
    };

    const appendCircleNotes = (circleId: string, updatedNotes: string) => {
        setStudyCircles(studyCircles.map(sc => {
            if (sc.id === circleId) {
                return { ...sc, notes: updatedNotes };
            }
            return sc;
        }));
    };

    const sendCircleMessage = (circleId: string) => {
        if (!circleChatMessage.trim()) return;
        setStudyCircles(studyCircles.map(sc => {
            if (sc.id === circleId) {
                return {
                    ...sc,
                    chatMessages: [...sc.chatMessages, { sender: 'Alex Turner (You)', text: circleChatMessage, time: 'Now' }]
                };
            }
            return sc;
        }));
        setCircleChatMessage('');
        addPoints(2);
    };

    // Mentorship Actions
    const bookMentorSession = () => {
        if (!selectedMentor) return;
        const freshSession = {
            id: `s-${Date.now()}`,
            mentorName: selectedMentor.name,
            topic: bookingTopic,
            date: bookingDay,
            time: '11:00'
        };
        setScheduledSessions([...scheduledSessions, freshSession]);
        setBookingRequested(true);
        setTimeout(() => {
            setBookingRequested(false);
            setSelectedMentor(null);
        }, 3000);
        addPoints(20);
    };

    // Prayer room actions
    const sendPrayerRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPrayerTitle.trim() || !newPrayerBody.trim()) return;
        const fresh: PrayerRequest = {
            id: `pr-${Date.now()}`,
            title: newPrayerTitle.trim(),
            author: 'Alex Turner (You)',
            content: newPrayerBody.trim(),
            prayersCount: 1,
            spiritSupport: 1
        };
        setPrayerRequests([fresh, ...prayerRequests]);
        setRecentReflectionId(fresh.id);
        setNewPrayerTitle('');
        setNewPrayerBody('');
        addPoints(15, 'Prayer Warrior');
        showToast('🙏 Reflection successfully submitted to the Community Wall! +15 XP.');
    };

    const supportPrayer = (prayerId: string) => {
        setPrayerRequests(prev => prev.map(p => {
            if (p.id !== prayerId) return p;
            const nextPrayed = !p.hasPrayed;
            return {
                ...p,
                hasPrayed: nextPrayed,
                prayersCount: nextPrayed ? p.prayersCount + 1 : Math.max(0, p.prayersCount - 1)
            };
        }));
        addPoints(10);
        showToast('Prayer uplifted (+10 XP).');
    };

    const submitGratitude = () => {
        if (!newGratitudeText.trim()) return;
        setGratitudeNotes(prev => [newGratitudeText.trim(), ...prev]);
        setNewGratitudeText('');
        addPoints(15);
        showToast('Gratitude note posted (+15 XP)!');
    };

    const toggleRegisterEvent = (eventId: string) => {
        setEvents(prev => prev.map(ev => {
            if (ev.id !== eventId) return ev;
            const next = !ev.isRegistered;
            showToast(next ? `Registered seat for: ${ev.title}` : `Registration cancelled for: ${ev.title}`);
            return { ...ev, isRegistered: next };
        }));
    };

    // --- PROPER WORKFLOW REDIRECT: DAY CHECK ---
    const handleVerifyDayCheck = () => {
        if (dayCheckVerifiedToday) {
            showToast(`✨ Today's devotional streak is already active (${dayCheckStreak}/7 Days). Redirecting to Prayer Room...`);
            setTimeout(() => setCurrentView('prayer'), 800);
            return;
        }
        const next = Math.min(dayCheckStreak + 1, 7);
        setDayCheckStreak(next);
        setDayCheckVerifiedToday(true);
        addPoints(50, next === 7 ? 'Theological Contributor' : undefined);
        showToast(`✨ Day ${next} Check verified! +50 XP awarded. Redirecting to Prayer & Reflection room...`);
        setTimeout(() => {
            setCurrentView('prayer');
        }, 1100);
    };

    // --- PROPER WORKFLOW REDIRECT: PEER FEEDBACK ---
    const handleOpenPeerFeedback = () => {
        setShowPeerReviewModal(true);
    };

    const handleConfirmPeerFeedback = () => {
        const nextCount = Math.min(peerReviewsCount + 1, 3);
        setPeerReviewsCount(nextCount);
        setShowPeerReviewModal(false);
        addPoints(20, nextCount === 3 ? 'Accredited Assessor' : undefined);
        showToast(`🎯 Peer review for ${selectedPeerSubmission.studentName} recorded! +20 XP awarded. Redirecting to Knowledge Exchange...`);
        setTimeout(() => {
            setCurrentView('knowledge');
        }, 1100);
    };

    // --- REAL-TIME RESOURCE FILE UPLOAD & REAL-TIME DOWNLOAD ---
    const handleResourceFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setSelectedResourceFile(f);
            if (!uploadedResourceTitle) {
                const cleanName = f.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                setUploadedResourceTitle(cleanName);
            }
        }
    };

    const submitResource = (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadedResourceTitle.trim()) return;

        setIsPublishingResource(true);
        setUploadProgress(15);

        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 95) {
                    clearInterval(interval);
                    return 95;
                }
                return prev + 30;
            });
        }, 120);

        setTimeout(() => {
            clearInterval(interval);
            setUploadProgress(100);

            const fileSizeFormatted = selectedResourceFile 
                ? `${(selectedResourceFile.size / (1024 * 1024)).toFixed(1)} MB` 
                : '1.8 MB';

            const fresh: ResourceItem = {
                id: `r-${Date.now()}`,
                title: uploadedResourceTitle.trim(),
                author: 'Alex Turner (You)',
                category: uploadedResourceCat,
                downloads: 0,
                fileSize: fileSizeFormatted,
                uploadedAt: 'Just now',
                fileContent: `# ${uploadedResourceTitle.trim()}\n\nAuthor: Alex Turner (You)\nCategory: ${uploadedResourceCat}\nUploaded: ${new Date().toLocaleDateString()}\nInstitution: CogniSacra Sovereign Academic Network\nW3C Cryptographic Digest: 0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}\n\n---\n## Sovereign Community Resource Content\n${selectedResourceFile ? `Original file: ${selectedResourceFile.name} (${fileSizeFormatted})` : 'Comprehensive academic model, code templates, and ethical peer benchmarks.'}\n\n### Key Highlights\n- Tested against CogniSacra Sovereign Standards\n- Community verified and freely accessible for accredited learners\n\nDownloaded via CogniSacra Knowledge Exchange.`
            };

            setResources([fresh, ...resources]);
            setUploadedResourceTitle('');
            setSelectedResourceFile(null);
            setIsPublishingResource(false);
            setUploadProgress(0);
            if (resourceFileInputRef.current) {
                resourceFileInputRef.current.value = '';
            }
            addPoints(25, 'Knight Contributor');
            showToast(`🚀 "${fresh.title}" published to Knowledge Exchange in real time! +25 XP awarded.`);
        }, 850);
    };

    const handleDownloadResource = (res: ResourceItem) => {
        const fileContent = res.fileContent || `# ${res.title}\n\nAuthor: ${res.author}\nCategory: ${res.category}\nDate: ${res.uploadedAt || 'June 2026'}\nW3C Sovereign Academic Hash: 0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}\n\n---\n## CogniSacra Academic Resource\nThis verified document has been retrieved from the CogniSacra Knowledge Exchange repository.\n\n### Resource Overview\n- Peer-reviewed research and synthesis\n- Production-grade code and architecture templates\n- Theological & technical ethics compliance certified\n\n© 2026 CogniSacra Sovereign Academic Trust. All rights reserved.`;

        const blob = new Blob([fileContent], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const sanitized = res.title.replace(/[^a-zA-Z0-9_-]/g, '_');
        a.download = `CogniSacra_${sanitized}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setResources(prev => prev.map(item => item.id === res.id ? { ...item, downloads: item.downloads + 1 } : item));
        addPoints(5);
        showToast(`📥 Real-time download initiated: "CogniSacra_${sanitized}.md" saved.`);
    };

    // --- REAL-TIME MENTOR RATING SYSTEM ---
    const rateMentor = (mentorId: string, stars: number) => {
        setMentorsInfo(prev => prev.map(m => {
            if (m.id === mentorId) {
                const currentTotal = m.rating * m.reviews;
                const newReviews = m.reviews + 1;
                const newRating = Number(((currentTotal + stars) / newReviews).toFixed(1));
                const newReviewItem: MentorReview = {
                    id: `rev-${Date.now()}`,
                    author: 'Alex Turner (You)',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
                    rating: stars,
                    date: 'Just now',
                    comment: `Rated ${stars} stars. Real-time sovereign alignment verified.`
                };
                const updatedMentor = {
                    ...m,
                    rating: newRating,
                    reviews: newReviews,
                    userRatedScore: stars,
                    recentReviews: [newReviewItem, ...(m.recentReviews || [])]
                };
                if (viewingMentorProfile?.id === mentorId) {
                    setViewingMentorProfile(updatedMentor);
                }
                return updatedMentor;
            }
            return m;
        }));
        addPoints(10);
        showToast(`✓ Rated mentor ${stars} / 5 stars in real time (+10 XP)! Recorded on sovereign ledger.`);
    };

    // --- MULTI-CHANNEL SHARING ENGINE (GMAIL, WHATSAPP, DIRECT MESSAGE) ---
    const openShareModal = (data: { title: string; url?: string; category?: string; summary?: string; type?: string; originalId?: string }) => {
        const fullUrl = data.url || window.location.href;
        setShareModalData({
            title: data.title,
            url: fullUrl,
            category: data.category || 'Academic Fellowship',
            summary: data.summary || data.title,
            type: data.type || 'resource',
            originalId: data.originalId
        });
        const connectedPeers = loungers.filter(l => l.isConnected);
        if (connectedPeers.length > 0) {
            setSelectedPeerToDm(connectedPeers[0].id);
        } else if (loungers.length > 0) {
            setSelectedPeerToDm(loungers[0].id);
        }
        setDmShareNote('');
        setShareCopied(false);
    };

    const handleShareGmail = () => {
        if (!shareModalData) return;
        const subject = encodeURIComponent(`[CogniSacra] ${shareModalData.title}`);
        const body = encodeURIComponent(`Greetings,\n\nI wanted to share this academic breakthrough from the CogniSacra Sovereign Knowledge Network:\n\nTitle: ${shareModalData.title}\nCategory: ${shareModalData.category}\n\nSummary:\n${shareModalData.summary}\n\nAccess link: ${shareModalData.url}\n\nVerified on W3C Sovereign Academic Trust.`);
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank');
        addPoints(5);
        showToast('Gmail composer opened (+5 XP).');
    };

    const handleShareWhatsApp = () => {
        if (!shareModalData) return;
        const text = encodeURIComponent(`*${shareModalData.title}* [${shareModalData.category}]\n\n${shareModalData.summary}\n\nExplore on CogniSacra: ${shareModalData.url}`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
        addPoints(5);
        showToast('WhatsApp share opened (+5 XP).');
    };

    const handleShareViaDm = () => {
        if (!shareModalData) return;
        if (!selectedPeerToDm) {
            showToast('Please select a learner to send direct message.');
            return;
        }
        const targetPeer = loungers.find(l => l.id === selectedPeerToDm);
        if (!targetPeer) return;

        const dmMessage = `[Shared ${shareModalData.type || 'Resource'}]: "${shareModalData.title}"\n${dmShareNote ? `Note: ${dmShareNote}\n` : ''}${shareModalData.url}`;

        setChatThreads(prev => ({
            ...prev,
            [selectedPeerToDm]: [
                ...(prev[selectedPeerToDm] || []),
                {
                    id: `dm-${Date.now()}`,
                    sender: 'me',
                    text: dmMessage,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]
        }));

        if (shareModalData.originalId) {
            setCommunities(prev => prev.map(c => ({
                ...c,
                posts: c.posts.map(p => p.id === shareModalData.originalId ? { ...p, sharesCount: p.sharesCount + 1 } : p)
            })));
            setSelectedGroup(prev => prev ? {
                ...prev,
                posts: prev.posts.map(p => p.id === shareModalData.originalId ? { ...p, sharesCount: p.sharesCount + 1 } : p)
            } : prev);
        }

        addPoints(10);
        showToast(`✓ Shared directly with ${targetPeer.name}! Message sent in real time (+10 XP).`);
        setShareModalData(null);
    };

    const handleCopyShareLink = () => {
        if (!shareModalData) return;
        navigator.clipboard?.writeText(shareModalData.url);
        setShareCopied(true);
        showToast('Permalink copied to clipboard.');
        setTimeout(() => setShareCopied(false), 2000);
    };

    // --- REAL-TIME NETWORKING & WHATSAPP INTEGRATION ---
    const toggleConnectLounger = (id: string) => {
        setLoungers(loungers.map(l => {
            if (l.id === id) {
                const val = !l.isConnected;
                if (val) {
                    addPoints(5);
                    showToast(`🤝 Connected with ${l.name}! Real-time status synced.`);
                }
                return { ...l, isConnected: val };
            }
            return l;
        }));
    };

    const handleOpenWhatsAppModal = (lounger: typeof loungers[0]) => {
        setWhatsAppTarget(lounger);
        setWhatsAppCustomText(
            `Hi ${lounger.name.split(' ')[0]}! I connected with you on the CogniSacra Sovereign Academic Network. I saw your focus on "${lounger.title}" and would love to collaborate on course projects and research!`
        );
        setOpenWhatsAppModal(true);
    };

    const handleLaunchWhatsApp = (customText?: string) => {
        if (!whatsAppTarget) return;
        const textToSend = customText || whatsAppCustomText;
        const cleanNumber = whatsAppTarget.whatsappNumber.replace(/[^0-9]/g, '');
        const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(textToSend)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        setOpenWhatsAppModal(false);
        showToast(`💬 WhatsApp session opened for ${whatsAppTarget.name}!`);
        addPoints(5);
    };

    const toggleGiveKudo = (peerId: string, peerName: string) => {
        setKudosGiven(prev => {
            const hasGiven = !prev[peerId];
            if (hasGiven) {
                addPoints(10);
                showToast(`🌟 Kudos awarded to ${peerName}! +10 XP earned.`);
            }
            return { ...prev, [peerId]: hasGiven };
        });
    };

    // AI guide conversation trigger
    const queryAiGuide = () => {
        if (!aiGuideInput.trim()) return;
        const userMsg = { sender: 'user' as const, text: aiGuideInput, time: 'Now' };
        setAiGuideLog(prev => [...prev, userMsg]);
        const q = aiGuideInput.toLowerCase();
        setAiGuideInput('');

        setTimeout(() => {
            let replyText = "I have scanned the CogniSacra Knowledge Base and Theology archives. For complex questions, I recommend booking with Dr. Evelyn Reed, or joining the Bible Study reflections community circles.";
            if (q.includes('react') || q.includes('hook') || q.includes('web')) {
                replyText = "Excellent technical search. Jane Doe is currently our top Mentor in frontend architecture. There is also an active Study Circle named 'React Mastery Accountability Group' that you are joined in! Head to the Study Circles tab to share project hurdles.";
            } else if (q.includes('prayer') || q.includes('holy') || q.includes('faith') || q.includes('devotional')) {
                replyText = "Faith & Reflections are the spiritual core of our community. In the 'Prayer & Reflection Room' page, you can access daily scripture devotionals, support peer prayers, or add to our collective Gratitude Wall.";
            } else if (q.includes('point') || q.includes('level') || q.includes('badge')) {
                replyText = "Your Kingdom Impact level depends on both technical excellence and active mentorship or prayer support. You have unlocked 'Community Builder' and 'Prayer Warrior'. Contributing files to the Knowledge Exchange tab yields a high volume of points (25 pts!).";
            }
            setAiGuideLog(prev => [...prev, { sender: 'assistant', text: replyText, time: 'Now' }]);
            addPoints(2);
        }, 1000);
    };

    // Filtered data computing
    const filteredCommunities = useMemo(() => {
        return communities.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase());
            if (selectedCommunityCat === 'All') return matchesSearch;
            return c.category === selectedCommunityCat && matchesSearch;
        });
    }, [communities, selectedCommunityCat, searchQuery]);

    const activeCircle = useMemo(() => {
        return studyCircles.find(sc => sc.id === activeCircleId);
    }, [studyCircles, activeCircleId]);

    // ---------------------- MENU NAVIGATION LIST ----------------------
    const menuItems = [
        { id: 'home', label: 'Home Feed', icon: Home, count: null },
        { id: 'communities', label: 'Browse Communities', icon: Compass, count: null },
        { id: 'forums', label: 'Discussion Forums', icon: MessageSquare, count: 5 },
        { id: 'circles', label: 'Study Circles', icon: CheckCircle, count: 'Active' },
        { id: 'mentorship', label: 'Mentorship Hub', icon: UserPlus, count: null },
        { id: 'events', label: 'Events & Webinars', icon: Calendar, count: 1 },
        { id: 'challenges', label: 'Challenges & Gamification', icon: Trophy, count: null },
        { id: 'prayer', label: 'Prayer & Reflection Room', icon: Heart, count: prayerRequests.length },
        { id: 'knowledge', label: 'Knowledge Exchange', icon: BookOpen, count: resources.length },
        { id: 'networking', label: 'Networking Lounge', icon: Users, count: 'Live' },
        { id: 'recognition', label: 'Recognition & Leaderboard', icon: Award, count: 'Podium' },
        { id: 'ai-guide', label: 'AI Spiritual Companion', icon: Sparkles, count: 'Guide' },
        { id: 'analytics', label: 'Contribution Analytics', icon: BarChart2, count: null }
    ];

    return (
        <div className="w-full max-w-full py-4 px-2 sm:px-4 lg:px-6 mt-1 text-slate-800 dark:text-slate-100">
            {/* Global Hub Toast Notification */}
            {toastMessage && (
                <div className="fixed top-6 right-6 z-50 px-4 py-3 bg-[#0E131C] text-emerald-400 font-mono text-xs rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span className="text-white font-medium">{toastMessage}</span>
                </div>
            )}

            {/* View-Only Mode Banner if Active */}
            {isViewOnly && (
                <div className="mb-4 p-3 bg-amber-500/15 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-300">
                    <div className="flex items-center gap-2 font-mono">
                        <Eye className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
                        <span><strong>View-Only Mode Active:</strong> You are currently browsing the community in read-only mode. Content creation and comment submissions are paused.</span>
                    </div>
                    <button
                        onClick={() => setIsViewOnly(false)}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-[11px] rounded-lg transition"
                    >
                        Switch to Interactive Mode
                    </button>
                </div>
            )}

            {/* View Only Toast Notification */}
            {viewOnlyNotice && (
                <div className="fixed top-6 right-6 z-50 p-4 bg-amber-500 text-black font-mono font-bold text-xs rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
                    <Eye className="w-4 h-4 shrink-0" />
                    <span>{viewOnlyNotice}</span>
                </div>
            )}

            {/* Top Hub Header Banner */}
            <div className="relative mb-6 rounded-2xl overflow-hidden bg-gradient-to-r from-red-950 via-slate-900 to-rose-950 p-6 shadow-xl border border-rose-900/40 select-none">
                <div className="absolute top-0 right-0 w-80 h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400 via-rose-500 to-slate-900 blur-2xl pointer-none"></div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center space-x-3.5">
                        <div className="p-3 bg-crimson/25 rounded-xl border border-rose-500/20 shadow-inner">
                            <Globe className="w-8 h-8 text-rose-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight text-white flex items-center gap-2">
                                CogniSacra Community Hub
                            </h1>
                            <p className="text-xs text-rose-200/80 font-mono tracking-wide mt-0.5">
                                SECRETS OF DIGITAL & SPIRITUAL COLLABORATION • KINGDOM PERSPECTIVE
                            </p>
                        </div>
                    </div>

                    {/* Mode Toggle & Level Profile Controls */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* View Only Mode Switch Button */}
                        <button
                            onClick={() => setIsViewOnly(!isViewOnly)}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                                isViewOnly 
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/10' 
                                    : 'bg-white/10 hover:bg-white/15 text-slate-200 border-white/10'
                            }`}
                            title="Toggle between Interactive and View-Only browsing"
                        >
                            {isViewOnly ? (
                                <>
                                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                                    <span>View-Only Mode</span>
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                                </>
                            ) : (
                                <>
                                    <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Interactive Mode</span>
                                </>
                            )}
                        </button>

                        {/* Level Profile Badge in Header */}
                        <div className="flex items-center space-x-3 bg-black/40 px-4 py-2 rounded-xl border border-white/10 shadow bg-opacity-95 text-xs text-slate-200">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center font-extrabold text-black font-mono ring-2 ring-white/10 text-xs">
                                L{userLevel}
                            </div>
                            <div>
                                <div className="font-extrabold text-white">Alex Turner (You)</div>
                                <div className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                                    <Sparkles className="w-2.5 h-2.5 shrink-0" />
                                    {userPoints} Points • Collaborator
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* REAL-TIME ACTIVE LEARNERS NETWORK STRIP */}
            <div className="mb-6 p-4 bg-[#0E131C] border border-zinc-800/80 rounded-2xl shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-zinc-800/60">
                    <div className="flex items-center gap-2.5">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </div>
                        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                            Live Peer Network · 18 Active Learners Online
                        </h2>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                        <span className="flex items-center gap-1.5"><Wifi size={12} className="text-emerald-400" /> Real-Time Presence</span>
                        <span>·</span>
                        <span>Click any peer to direct message</span>
                    </div>
                </div>

                {/* Horizontal Live Peers Roster */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                    {realtimeLearners.map(peer => {
                        const hasOpenThread = !!chatThreads[peer.id]?.length;
                        return (
                            <div 
                                key={peer.id}
                                className="p-3 bg-[#141B26] hover:bg-[#182130] border border-zinc-800/70 hover:border-emerald-500/40 rounded-xl transition flex flex-col justify-between group relative overflow-hidden"
                            >
                                <div className="flex items-start gap-2.5 mb-2">
                                    <div className="relative shrink-0">
                                        <img 
                                            src={peer.avatarUrl} 
                                            alt={peer.name} 
                                            className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30"
                                        />
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#141B26] rounded-full"></span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition">
                                            {peer.name}
                                        </div>
                                        <div className="text-[10px] text-zinc-400 font-mono truncate">
                                            {peer.course}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="text-[10px] font-mono text-emerald-400/90 truncate bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                        {peer.statusText}
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 pt-2 border-t border-zinc-800/50">
                                    <button
                                        onClick={() => setActiveChatPeer(peer)}
                                        className="flex-1 py-1.5 px-2 bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 font-mono font-bold text-[10px] rounded-lg transition flex items-center justify-center gap-1"
                                    >
                                        <MessageSquare size={11} />
                                        <span>Message</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setActiveChatPeer(peer);
                                            setPeerCallActive(true);
                                        }}
                                        className="py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[10px] rounded-lg transition"
                                        title="Co-study Audio Room"
                                    >
                                        <Radio size={11} className="text-amber-400" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Split Screen Community Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                
                {/* ----------------- SECTOR A: COMMUNITY MENU SIDEBAR ----------------- */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow p-4 select-none">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-3.5">
                        Menu Navigation
                    </h3>
                    <div className="space-y-1">
                        {menuItems.map(item => {
                            const IconC = item.icon;
                            const isSelected = currentView === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentView(item.id as SubView)}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium rounded-xl transition-all duration-150 ${
                                        isSelected 
                                        ? 'bg-crimson text-white font-bold shadow-md shadow-crimson/10 border-r-4 border-amber-300' 
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-700/50'
                                    }`}
                                >
                                    <div className="flex items-center space-x-2.5">
                                        <IconC className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                                        <span>{item.label}</span>
                                    </div>
                                    {item.count !== null && (
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                            isSelected 
                                            ? 'bg-white/20 text-white' 
                                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-thin border-rose-100/10'
                                        }`}>
                                            {item.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Gamification Box showing Points breakdown */}
                    <div className="mt-5 p-3.5 bg-gradient-to-br from-amber-500/10 to-rose-500/10 dark:from-amber-500/5 dark:to-rose-500/5 rounded-xl border border-rose-500/10 text-xs">
                        <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-bold mb-2">
                            <span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5 text-amber-500" /> Milestone Check</span>
                            <span className="text-amber-500">{userPoints}/500</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full" style={{ width: `${(userPoints / 500) * 100}%` }}></div>
                        </div>
                        <div className="mt-2.5 text-[10.5px] text-slate-500 dark:text-slate-400 leading-snug">
                            Unlock <span className="font-bold text-slate-700 dark:text-slate-200">Level 4: Leader</span> by contributing answers, files, or backing peer prayers (+120 Points Left).
                        </div>
                    </div>
                </div>

                {/* ----------------- SECTOR B: ACTIVE VIEW CONTENT ----------------- */}
                <div className="lg:col-span-3 space-y-6">

                    {/* 1. HOME SOCIAL FEED VIEW */}
                    {currentView === 'home' && (
                        <div className="space-y-6">
                            {/* Welcome interactive banner */}
                            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">Good Morning, Lusimadio</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Continue your deep learning session today. Here is your community status report:</p>
                                    <div className="flex flex-wrap items-center gap-3.5 mt-2 text-xs font-semibold text-slate-600 dark:text-slate-350">
                                        <span className="flex items-center gap-1.5"><span className="text-xs">✉</span> 2 New Accountability Messages</span>
                                        <span className="flex items-center gap-1.5"><span className="text-xs">💬</span> 5 Active Forum Conversations</span>
                                        <span className="flex items-center gap-1.5"><span className="text-xs">🎙</span> Webinar sessions in 3 Hours</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => setCurrentView('forums')} className="px-3.5 py-1.5 text-xs font-bold text-white bg-crimson rounded-full hover:bg-red-800 shadow transition-all">Join Discussion</button>
                                    <button onClick={() => setCurrentView('circles')} className="px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-white bg-slate-200 dark:bg-gray-700 rounded-full hover:bg-slate-300 dark:hover:bg-gray-600 border border-slate-300/10">My Study Circle</button>
                                </div>
                            </div>

                            {/* Feed Composer Form */}
                            <form onSubmit={createSocialPost} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-slate-200/60 dark:border-slate-700/60">
                                <label htmlFor="social-input" className="sr-only">Post Content</label>
                                <textarea
                                    id="social-input"
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="Share your testimonies, questions, or template links here..."
                                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-crimson focus:border-crimson text-sm resize-none text-slate-800 dark:text-slate-200"
                                    rows={3}
                                />
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-bold text-slate-400 select-none">Tag post as:</span>
                                        {(['general', 'testimony', 'prayer', 'resource'] as const).map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setNewPostType(type)}
                                                className={`px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider border transition-all ${
                                                    newPostType === type
                                                    ? 'bg-crimson border-crimson text-white'
                                                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!newPostContent.trim()}
                                        className="w-full sm:w-auto px-5 py-2 font-bold text-white bg-crimson rounded-full hover:bg-red-800 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                                    >
                                        <Send className="w-3.5 h-3.5" /> Publish
                                    </button>
                                </div>
                            </form>

                            {/* Feed log rendering */}
                            <div className="space-y-4">
                                {posts.map(post => (
                                    <div key={post.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow">
                                        <div className="flex items-start space-x-3.5">
                                            <img src={post.avatarUrl} alt={post.author} className="w-10 h-10 rounded-full object-cover select-none border border-slate-200 dark:border-slate-700" />
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <p className="font-extrabold text-slate-900 dark:text-white font-serif text-sm">{post.author}</p>
                                                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[9.5px] font-bold text-slate-500 dark:text-slate-300 select-none">{post.role}</span>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">{post.timestamp}</p>
                                                </div>
                                                {post.type && (
                                                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 text-[9px] font-extrabold uppercase tracking-widest">{post.type}</span>
                                                )}
                                                <p className="mt-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                                                {/* Interaction Row */}
                                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-705 flex justify-around">
                                                    <button 
                                                        onClick={() => toggleLikePost(post.id)} 
                                                        className={`flex items-center space-x-2 text-xs font-semibold ${post.hasLiked ? 'text-red-500' : 'text-slate-500 dark:text-slate-400 hover:text-red-500'}`}
                                                    >
                                                        <ThumbsUp className={`w-4 h-4 ${post.hasLiked ? 'fill-current' : ''}`} />
                                                        <span>{post.likes}</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setPosts(posts.map(p => p.id === post.id ? { ...p, showCommentBox: !p.showCommentBox } : p));
                                                        }} 
                                                        className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-500"
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                        <span>{post.comments.length} Comments</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => openShareModal({
                                                            title: `Post by ${post.author}`,
                                                            url: `${window.location.origin}/community/post/${post.id}`,
                                                            category: post.type || 'Fellowship Feed',
                                                            summary: post.content,
                                                            type: 'Community Post',
                                                            originalId: post.id
                                                        })}
                                                        className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-amber-500 cursor-pointer"
                                                    >
                                                        <Share2 className="w-4 h-4" />
                                                        <span>Share</span>
                                                    </button>
                                                </div>

                                                {/* Hidden or Opened Comment block */}
                                                {post.showCommentBox && (
                                                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-705 space-y-2.5">
                                                        <div className="space-y-1.5">
                                                            {post.comments.map((comment, index) => (
                                                                <div key={index} className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl text-xs space-y-0.5">
                                                                    <div className="font-bold text-slate-800 dark:text-slate-200">Community Companion</div>
                                                                    <p className="text-slate-600 dark:text-slate-300">{comment}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Add your insightful reply..."
                                                                value={newPostComment[post.id] || ''}
                                                                onChange={(e) => setNewPostComment({ ...newPostComment, [post.id]: e.target.value })}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') addPostComment(post.id, newPostComment[post.id]);
                                                                }}
                                                                className="flex-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                                                            />
                                                            <button 
                                                                onClick={() => addPostComment(post.id, newPostComment[post.id])} 
                                                                className="px-3 py-1 bg-crimson hover:bg-red-800 text-white rounded-xl text-xs font-bold"
                                                            >
                                                                Send
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 2. COMMUNITIES & FACEBOOK-STYLE GROUP EXPERIENCE */}
                    {currentView === 'communities' && (
                        <div className="space-y-6">
                            {!selectedGroup ? (
                                /* COMMUNITIES DIRECTORY VIEW */
                                <div className="space-y-6">
                                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">Academic Communities & Fellowship Groups</h2>
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase">
                                                    Live Nodes
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                Discover sovereign knowledge collectives, research fellowships, and institutional study cohorts.
                                            </p>
                                        </div>

                                        {/* Creator Authorization: Only Institutions and Instructors can create groups */}
                                        <div>
                                            {isInstructorOrInstitution ? (
                                                <button
                                                    onClick={() => setIsCreateGroupModalOpen(true)}
                                                    className="px-4 py-2.5 rounded-xl bg-crimson hover:bg-red-800 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition active:scale-95"
                                                >
                                                    <Plus size={15} />
                                                    <span>Create Community Group</span>
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500">
                                                    <Shield size={13} className="text-emerald-400" />
                                                    <span>Chartered by Verified Faculty</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Search and categories bar */}
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow flex flex-col md:flex-row gap-3">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search by community name or focus areas..."
                                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {['All', 'Faith & Spiritual Growth', 'Academic Learning', 'Professional Networks'].map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setSelectedCommunityCat(cat as any)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                                        selectedCommunityCat === cat
                                                        ? 'bg-crimson border-crimson text-white'
                                                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    {cat === 'All' ? 'All categories' : cat.split(' ')[0]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Communities list grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {filteredCommunities.map(c => (
                                            <div key={c.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-700/60 shadow hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                                                <div className="h-36 w-full relative">
                                                    <img src={c.coverUrl || c.imageUrl} alt={c.name} className="w-full h-full object-cover select-none" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                                                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                                        <span className="px-2.5 py-0.5 bg-crimson font-bold text-[9px] uppercase tracking-wider text-white rounded shadow">
                                                            {c.category}
                                                        </span>
                                                        <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md font-mono text-[9px] text-zinc-300 rounded border border-white/10">
                                                            {c.privacy || 'Public'}
                                                        </span>
                                                    </div>
                                                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                                        <img src={c.creator.avatar} alt={c.creator.name} className="w-6 h-6 rounded-full border border-white/20 object-cover" />
                                                        <span className="text-[10px] font-mono text-zinc-300 truncate max-w-[220px]">
                                                            {c.creator.name}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="p-4 flex flex-col justify-between flex-1">
                                                    <div>
                                                        <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif">{c.name}</h4>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{c.description}</p>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 mt-4 border-t border-slate-100 dark:border-slate-700">
                                                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                                            <span className="font-bold text-slate-750 dark:text-slate-250">{c.membersCount.toLocaleString()}</span> Members • <span className="font-bold text-slate-755 dark:text-slate-255">{c.posts?.length || c.discussionsCount}</span> active posts
                                                        </div>

                                                        {/* Actions: View group button next to Join Circle */}
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedGroup(c);
                                                                    setGroupTab('feed');
                                                                }}
                                                                className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#141B26] hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                                                            >
                                                                <Eye size={13} className="text-emerald-400" />
                                                                <span>View group</span>
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                    setCommunities(communities.map(item => item.id === c.id ? { 
                                                                        ...item, 
                                                                        isJoined: !item.isJoined,
                                                                        membersCount: !item.isJoined ? item.membersCount + 1 : Math.max(1, item.membersCount - 1)
                                                                    } : item));
                                                                    addPoints(c.isJoined ? -10 : 15);
                                                                    showToast(c.isJoined ? `Left ${c.name}` : `Joined ${c.name} (+15 XP)`);
                                                                }}
                                                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                                                    c.isJoined
                                                                    ? 'bg-slate-100 dark:bg-slate-750 text-slate-500 border border-slate-200 dark:border-slate-700'
                                                                    : 'bg-crimson text-white hover:bg-red-800'
                                                                }`}
                                                            >
                                                                {c.isJoined ? 'Joined ✔' : 'Join Circle'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* COGNISACRA FACEBOOK-STYLE GROUP USER INTERFACE */
                                <div className="space-y-6 animate-fade-in">
                                    {/* Back Button Navigation */}
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() => setSelectedGroup(null)}
                                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                                        >
                                            <ChevronRight size={14} className="rotate-180" />
                                            <span>Back to Communities Directory</span>
                                        </button>

                                        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                                            <span>CogniSacra Sovereign Group Node</span>
                                            <span>•</span>
                                            <span className="text-emerald-400 font-bold">W3C DID Verified</span>
                                        </div>
                                    </div>

                                    {/* Facebook Group Cover Photo Banner */}
                                    <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700/60 shadow-xl relative">
                                        {/* Cover Image */}
                                        <div className="h-56 sm:h-72 w-full relative overflow-hidden bg-slate-900">
                                            <img
                                                src={selectedGroup.coverUrl || selectedGroup.imageUrl}
                                                alt={selectedGroup.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0E131C] via-[#0E131C]/40 to-transparent"></div>

                                            {/* Top badges */}
                                            <div className="absolute top-4 left-4 flex items-center gap-2">
                                                <span className="px-3 py-1 rounded-full bg-crimson text-white font-bold text-[10px] uppercase tracking-wider shadow">
                                                    {selectedGroup.category}
                                                </span>
                                                <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 font-mono text-[10px] border border-white/10 flex items-center gap-1">
                                                    <Lock size={10} className="text-emerald-400" />
                                                    <span>{selectedGroup.privacy || 'Public'} Group</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Group Profile Header Bar Overlap (Facebook Style) */}
                                        <div className="px-6 pb-6 pt-2 bg-[#0E131C] relative border-t border-slate-800/80">
                                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 -mt-16 sm:-mt-20 relative z-10">
                                                {/* Left: Avatar Emblem & Group Titles */}
                                                <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl border-4 border-[#0E131C] overflow-hidden bg-slate-900 shadow-2xl shrink-0 relative">
                                                        <img
                                                            src={selectedGroup.imageUrl}
                                                            alt={selectedGroup.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0E131C] shadow"></span>
                                                    </div>

                                                    <div className="space-y-1.5 pt-2">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h1 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
                                                                {selectedGroup.name}
                                                            </h1>
                                                            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold flex items-center gap-1">
                                                                <ShieldCheck size={12} />
                                                                <span>Accredited</span>
                                                            </span>
                                                        </div>

                                                        <p className="text-xs text-slate-400 flex items-center gap-2 flex-wrap font-sans">
                                                            <span className="font-semibold text-slate-200">
                                                                {selectedGroup.membersCount.toLocaleString()} Members
                                                            </span>
                                                            <span>•</span>
                                                            <span>{selectedGroup.posts?.length || 0} Discussions</span>
                                                            <span>•</span>
                                                            <span className="text-slate-400">
                                                                Chartered by <strong className="text-slate-300">{selectedGroup.creator.name}</strong> ({selectedGroup.creator.role})
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Right: Group Actions */}
                                                <div className="flex items-center gap-2 flex-wrap pt-2">
                                                    <button
                                                        onClick={() => {
                                                            const newJoined = !selectedGroup.isJoined;
                                                            setCommunities(prev => prev.map(c => c.id === selectedGroup.id ? {
                                                                ...c,
                                                                isJoined: newJoined,
                                                                membersCount: newJoined ? c.membersCount + 1 : Math.max(1, c.membersCount - 1)
                                                            } : c));
                                                            setSelectedGroup(prev => prev ? {
                                                                ...prev,
                                                                isJoined: newJoined,
                                                                membersCount: newJoined ? prev.membersCount + 1 : Math.max(1, prev.membersCount - 1)
                                                            } : null);
                                                            showToast(newJoined ? `You joined ${selectedGroup.name} (+15 XP)!` : `You left ${selectedGroup.name}`);
                                                        }}
                                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md ${
                                                            selectedGroup.isJoined
                                                            ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                                                            : 'bg-crimson hover:bg-red-800 text-white'
                                                        }`}
                                                    >
                                                        {selectedGroup.isJoined ? <Check size={14} className="text-emerald-400" /> : <UserPlus size={14} />}
                                                        <span>{selectedGroup.isJoined ? 'Joined ✔' : 'Join Group'}</span>
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(window.location.href);
                                                            showToast('Invite link copied to clipboard!');
                                                        }}
                                                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                                                    >
                                                        <UserPlus size={14} />
                                                        <span>Invite Peer</span>
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            openShareModal({
                                                                title: selectedGroup.name,
                                                                url: `${window.location.origin}/community/group/${selectedGroup.id}`,
                                                                category: selectedGroup.category,
                                                                summary: selectedGroup.description,
                                                                type: 'Community Group',
                                                                originalId: selectedGroup.id
                                                            });
                                                        }}
                                                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                                                        title="Share Group"
                                                    >
                                                        <Share2 size={15} />
                                                    </button>

                                                    {/* Instructor / Institution Management Button */}
                                                    {isInstructorOrInstitution && (
                                                        <button
                                                            onClick={() => setIsManageGroupModalOpen(true)}
                                                            className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-500/30 text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer shadow-lg"
                                                        >
                                                            <Settings size={14} />
                                                            <span>Manage Group</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Facebook Group Navigation Tabs */}
                                            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
                                                {[
                                                    { id: 'feed', label: 'Discussion Feed', icon: <MessageSquare size={14} /> },
                                                    { id: 'files', label: `Subject Modules & Files (${selectedGroup.featuredFiles.length})`, icon: <FileText size={14} /> },
                                                    { id: 'members', label: `Scholars & Fellows (${selectedGroup.membersCount.toLocaleString()})`, icon: <Users size={14} /> },
                                                    { id: 'rules', label: `Group Canon & Rules (${selectedGroup.rules.length})`, icon: <Shield size={14} /> },
                                                    ...(isInstructorOrInstitution ? [{ id: 'manage', label: 'Host Governance', icon: <Sliders size={14} /> }] : [])
                                                ].map((t) => {
                                                    const isActive = groupTab === t.id;
                                                    return (
                                                        <button
                                                            key={t.id}
                                                            onClick={() => setGroupTab(t.id as any)}
                                                            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                                                                isActive
                                                                ? 'bg-crimson text-white shadow-md'
                                                                : 'bg-[#141B26] text-slate-400 hover:text-white hover:bg-slate-800'
                                                            }`}
                                                        >
                                                            <span>{t.icon}</span>
                                                            <span>{t.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* TAB 1: DISCUSSION FEED (2-Column Facebook Group Layout) */}
                                    {groupTab === 'feed' && (
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                            {/* Left/Main Column: Composer & Live Group Posts (8 cols) */}
                                            <div className="lg:col-span-8 space-y-6">
                                                {/* Pinned Announcement by Host */}
                                                {selectedGroup.pinnedAnnouncement && (
                                                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3 shadow-lg">
                                                        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
                                                            <Pin size={16} />
                                                        </div>
                                                        <div className="space-y-1 flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                                                                    Pinned Notice by {selectedGroup.creator.name}
                                                                </span>
                                                                <span className="text-[9px] font-mono text-amber-400/80">Active Pinned</span>
                                                            </div>
                                                            <p className="text-xs text-amber-100 leading-relaxed font-sans">
                                                                {selectedGroup.pinnedAnnouncement}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* CogniSacra Appropriate Post Composer ("What's on your mind, Alex?") */}
                                                <div className="bg-[#0E131C] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                                                    <div className="flex items-start gap-3">
                                                        <img
                                                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80"
                                                            alt="You"
                                                            className="w-10 h-10 rounded-full object-cover border border-emerald-500/40 shrink-0"
                                                        />
                                                        <div className="flex-1 space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs font-bold text-slate-200 font-serif">
                                                                    Alex Turner (You) <span className="text-[10px] font-mono text-slate-400 font-normal">• {userRole === 'instructor' ? 'Instructor' : userRole === 'institution' ? 'Institution Admin' : 'Fellow Learner'}</span>
                                                                </span>
                                                                {/* Category selector */}
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-[10px] font-mono text-slate-500">Category:</span>
                                                                    <select
                                                                        value={groupPostTag}
                                                                        onChange={(e: any) => setGroupPostTag(e.target.value)}
                                                                        className="bg-[#141B26] border border-slate-700 text-emerald-400 text-[11px] font-mono font-bold rounded-lg px-2 py-1 focus:outline-none"
                                                                    >
                                                                        <option value="Research Proof"># Research Proof</option>
                                                                        <option value="Theological Ethics"># Theological Ethics</option>
                                                                        <option value="Code Lab"># Code Lab</option>
                                                                        <option value="Peer Inquiry"># Peer Inquiry</option>
                                                                    </select>
                                                                </div>
                                                            </div>

                                                            <textarea
                                                                rows={3}
                                                                value={groupPostContent}
                                                                onChange={(e) => setGroupPostContent(e.target.value)}
                                                                placeholder={`Share a research breakthrough, debate an ethical premise, or pose an algorithm question to ${selectedGroup.name}...`}
                                                                className="w-full p-3 bg-[#141B26] border border-slate-800 rounded-xl text-xs font-sans text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 leading-relaxed resize-none"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Code Snippet Input Drawer (CogniSacra UX tool) */}
                                                    {showCodeInput && (
                                                        <div className="p-3 bg-[#141B26] rounded-xl border border-slate-700/60 space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1">
                                                                    <Code size={12} />
                                                                    <span>Attach Reproducible Code Snippet</span>
                                                                </span>
                                                                <select
                                                                    value={groupPostCodeLang}
                                                                    onChange={(e) => setGroupPostCodeLang(e.target.value)}
                                                                    className="bg-slate-900 border border-slate-700 text-zinc-300 text-[10px] font-mono rounded px-2 py-0.5"
                                                                >
                                                                    <option value="TypeScript">TypeScript</option>
                                                                    <option value="Python">Python</option>
                                                                    <option value="Solidity">Solidity</option>
                                                                    <option value="SQL">PostgreSQL</option>
                                                                    <option value="Rust">Rust</option>
                                                                </select>
                                                            </div>
                                                            <textarea
                                                                rows={4}
                                                                value={groupPostCode}
                                                                onChange={(e) => setGroupPostCode(e.target.value)}
                                                                placeholder="// Paste verifiable code or algorithm here..."
                                                                className="w-full p-2.5 bg-slate-950 font-mono text-[11px] text-emerald-300 rounded-lg border border-slate-800 focus:outline-none"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* File Attachment Preview */}
                                                    {groupAttachedFile && (
                                                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs font-mono">
                                                            <div className="flex items-center gap-2 text-emerald-300">
                                                                <Paperclip size={13} />
                                                                <span className="font-bold">{groupAttachedFile.name}</span>
                                                                <span className="text-[10px] text-zinc-400">({groupAttachedFile.size})</span>
                                                            </div>
                                                            <button
                                                                onClick={() => setGroupAttachedFile(null)}
                                                                className="text-rose-400 hover:text-rose-300 text-xs px-1 font-bold"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Hidden file input for real-time document attachment */}
                                                    <input
                                                        type="file"
                                                        ref={groupFileInputRef}
                                                        onChange={handleGroupFileSelect}
                                                        className="hidden"
                                                    />

                                                    {/* CogniSacra Tools Ribbon */}
                                                    <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            {/* Tool 1: Draft with AI */}
                                                            <button
                                                                type="button"
                                                                onClick={handleAiDraftGroupPost}
                                                                disabled={isAiDraftingGroupPost}
                                                                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 hover:from-emerald-500 hover:to-teal-500 hover:text-black border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                                                                title="Draft structured academic post with AI"
                                                            >
                                                                <Sparkles size={13} className={isAiDraftingGroupPost ? 'animate-spin' : ''} />
                                                                <span>{isAiDraftingGroupPost ? 'Drafting...' : 'Draft with AI'}</span>
                                                            </button>

                                                            {/* Tool 2: Code Snippet */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowCodeInput(!showCodeInput)}
                                                                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                                                                    showCodeInput 
                                                                    ? 'bg-indigo-600 text-white border-indigo-500' 
                                                                    : 'bg-[#141B26] hover:bg-slate-800 text-slate-300 border-slate-700'
                                                                }`}
                                                            >
                                                                <Code size={13} />
                                                                <span>Code Snippet</span>
                                                            </button>

                                                            {/* Tool 3: Attach File / Dataset */}
                                                            <button
                                                                type="button"
                                                                onClick={() => groupFileInputRef.current?.click()}
                                                                className="px-3 py-1.5 rounded-xl bg-[#141B26] hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer"
                                                            >
                                                                <Paperclip size={13} />
                                                                <span>Attach Resource</span>
                                                            </button>
                                                        </div>

                                                        {/* Submit Post Button */}
                                                        <button
                                                            onClick={handlePublishGroupPost}
                                                            className="px-5 py-2 rounded-xl bg-crimson hover:bg-red-800 text-white font-bold text-xs transition shadow-lg active:scale-95 flex items-center gap-1.5 cursor-pointer"
                                                        >
                                                            <Send size={13} />
                                                            <span>Post to Group</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Real-Time Group Posts Feed */}
                                                <div className="space-y-4">
                                                    {selectedGroup.posts.length === 0 ? (
                                                        <div className="text-center py-12 bg-[#0E131C] rounded-2xl border border-slate-800 space-y-2">
                                                            <p className="text-slate-400 text-xs font-medium">No posts in this community group yet.</p>
                                                            <p className="text-slate-500 text-[11px]">Be the first fellow or instructor to start a scholarly discussion!</p>
                                                        </div>
                                                    ) : null}

                                                    {selectedGroup.posts.map((post) => (
                                                        <div
                                                            key={post.id}
                                                            className="bg-[#0E131C] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4 transition hover:border-slate-700/80"
                                                        >
                                                            {/* Post Header */}
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="flex items-center gap-3">
                                                                    <img
                                                                        src={post.authorAvatar}
                                                                        alt={post.author}
                                                                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                                                                    />
                                                                    <div>
                                                                        <div className="flex items-center gap-2 flex-wrap">
                                                                            <h4 className="font-bold text-xs text-white font-serif">{post.author}</h4>
                                                                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-extrabold ${
                                                                                post.authorRole.includes('Instructor') ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                                                                                post.authorRole.includes('Institution') ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30' :
                                                                                post.authorRole.includes('Fellow') ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30' :
                                                                                'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                                                            }`}>
                                                                                {post.authorRole}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mt-0.5">
                                                                            <span>{post.date}</span>
                                                                            <span>•</span>
                                                                            <span className="text-emerald-400 font-bold">DID: {post.author.toLowerCase().replace(/\s+/g, '.')}.w3c</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    {post.categoryTag && (
                                                                        <span className="px-2.5 py-0.5 rounded-full bg-[#141B26] text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/20">
                                                                            #{post.categoryTag}
                                                                        </span>
                                                                    )}

                                                                    {/* Instructor Moderation: Delete Post */}
                                                                    {isInstructorOrInstitution && (
                                                                        <button
                                                                            onClick={() => handleDeleteGroupPost(selectedGroup.id, post.id)}
                                                                            className="text-slate-500 hover:text-rose-400 p-1 rounded transition"
                                                                            title="Moderate / Delete Post"
                                                                        >
                                                                            <Trash2 size={13} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Post Body Content */}
                                                            <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                                                                {post.content}
                                                            </p>

                                                            {/* Code Snippet Box (if present) */}
                                                            {post.codeSnippet && (
                                                                <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#07090E]">
                                                                    <div className="px-3 py-1.5 bg-[#141B26] border-b border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                                                                        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                                                            <Code size={11} /> {post.codeSnippet.language}
                                                                        </span>
                                                                        <button
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(post.codeSnippet?.code || '');
                                                                                showToast('Code copied to clipboard.');
                                                                            }}
                                                                            className="hover:text-white transition flex items-center gap-1"
                                                                        >
                                                                            <Copy size={11} /> Copy Code
                                                                        </button>
                                                                    </div>
                                                                    <pre className="p-3 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                                                                        {post.codeSnippet.code}
                                                                    </pre>
                                                                </div>
                                                            )}

                                                            {/* Attached Academic Resource Card (with real-time download) */}
                                                            {post.attachedFile && (
                                                                <div className="p-3 bg-[#141B26] rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                                                                            <FileText size={16} />
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <p className="text-xs font-mono font-bold text-white truncate">
                                                                                {post.attachedFile.name}
                                                                            </p>
                                                                            <span className="text-[10px] font-mono text-slate-400">
                                                                                {post.attachedFile.size} • Verified Academic Resource
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    <button
                                                                        onClick={() => handleDownloadContent(post.attachedFile!.name, post.attachedFile!.content)}
                                                                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-extrabold text-[11px] transition flex items-center gap-1.5 shrink-0 shadow active:scale-95 cursor-pointer"
                                                                    >
                                                                        <Download size={12} />
                                                                        <span>Download File</span>
                                                                    </button>
                                                                </div>
                                                            )}

                                                            {/* Facebook-style Action Reaction Bar */}
                                                            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                                                                <div className="flex items-center gap-2">
                                                                    {/* Like Button */}
                                                                    <button
                                                                        onClick={() => handleTogglePostLike(selectedGroup.id, post.id)}
                                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                                                                            post.hasLiked 
                                                                            ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40' 
                                                                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                                                        }`}
                                                                    >
                                                                        <ThumbsUp size={13} />
                                                                        <span>{post.likes}</span>
                                                                    </button>

                                                                    {/* Dislike Button (Explicitly Requested) */}
                                                                    <button
                                                                        onClick={() => handleTogglePostDislike(selectedGroup.id, post.id)}
                                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                                                                            post.hasDisliked 
                                                                            ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/40' 
                                                                            : 'text-slate-400 hover:text-rose-300 hover:bg-slate-800'
                                                                        }`}
                                                                    >
                                                                        <ThumbsDown size={13} />
                                                                        <span>{post.dislikes}</span>
                                                                    </button>

                                                                    {/* Comment Count / Drawer */}
                                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400">
                                                                        <MessageCircle size={13} />
                                                                        <span>{post.comments.length}</span>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    {/* Share Button */}
                                                                    <button
                                                                        onClick={() => handleShareGroupPost(post)}
                                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                                                                        title="Share Post"
                                                                    >
                                                                        <Share2 size={13} />
                                                                        <span>{post.sharesCount}</span>
                                                                    </button>

                                                                    {/* Download Post Transcript in Real Time */}
                                                                    <button
                                                                        onClick={() => handleDownloadGroupPost(post)}
                                                                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-slate-800 transition cursor-pointer"
                                                                        title="Download Post & Peer Reviews as Markdown"
                                                                    >
                                                                        <Download size={13} />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Comments Section */}
                                                            <div className="pt-2 space-y-2.5">
                                                                {post.comments.map((cm) => (
                                                                    <div key={cm.id} className="p-3 bg-[#141B26]/80 rounded-xl border border-slate-800/80 text-xs flex items-start gap-2.5">
                                                                        <img
                                                                            src={cm.avatar}
                                                                            alt={cm.author}
                                                                            className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                                                                        />
                                                                        <div className="flex-1 space-y-1">
                                                                            <div className="flex items-center justify-between">
                                                                                <div className="flex items-center gap-1.5">
                                                                                    <span className="font-bold text-white text-[11px] font-serif">{cm.author}</span>
                                                                                    <span className="text-[9px] font-mono text-slate-500 font-semibold">• {cm.authorRole}</span>
                                                                                </div>
                                                                                <span className="text-[9px] font-mono text-slate-500">{cm.date}</span>
                                                                            </div>
                                                                            <p className="text-slate-300 leading-relaxed font-sans">{cm.content}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {/* Real-time Comment Input Box */}
                                                                <div className="flex items-center gap-2 pt-1">
                                                                    <img
                                                                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80"
                                                                        alt="You"
                                                                        className="w-7 h-7 rounded-full object-cover shrink-0"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        value={groupCommentInputs[post.id] || ''}
                                                                        onChange={(e) => setGroupCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                handleAddGroupComment(selectedGroup.id, post.id);
                                                                            }
                                                                        }}
                                                                        placeholder="Write a peer comment or inquiry... (Press Enter to send)"
                                                                        className="flex-1 px-3 py-2 bg-[#141B26] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                                                                    />
                                                                    <button
                                                                        onClick={() => handleAddGroupComment(selectedGroup.id, post.id)}
                                                                        className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl transition cursor-pointer shadow active:scale-95"
                                                                    >
                                                                        Comment
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Right Column: About Group & CogniSacra Sidebar (4 cols) */}
                                            <div className="lg:col-span-4 space-y-5">
                                                {/* About This Group Card */}
                                                <div className="bg-[#0E131C] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3.5">
                                                    <h3 className="font-bold text-xs uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                                                        About this Community Group
                                                    </h3>
                                                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                                                        {selectedGroup.description}
                                                    </p>

                                                    <div className="space-y-2 pt-2 text-xs font-mono">
                                                        <div className="flex items-center gap-2 text-slate-400">
                                                            <Globe size={13} className="text-emerald-400 shrink-0" />
                                                            <span>{selectedGroup.privacy || 'Public'} Group · Anyone can read discussions</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-400">
                                                            <Users size={13} className="text-emerald-400 shrink-0" />
                                                            <span>{selectedGroup.membersCount.toLocaleString()} Verified Fellows & Scholars</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-400">
                                                            <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                                                            <span>Managed by {selectedGroup.creator.name}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Group Canon & Rules Card */}
                                                <div className="bg-[#0E131C] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
                                                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                                        <h3 className="font-bold text-xs uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1.5">
                                                            <Shield size={13} className="text-emerald-400" />
                                                            <span>Group Canon & Rules</span>
                                                        </h3>
                                                        {isInstructorOrInstitution && (
                                                            <button
                                                                onClick={() => {
                                                                    const title = prompt("Enter new rule title:");
                                                                    if (title) {
                                                                        const desc = prompt("Enter rule description:") || "";
                                                                        handleAddGroupRule(selectedGroup.id, title, desc);
                                                                    }
                                                                }}
                                                                className="text-[10px] font-mono text-emerald-400 hover:underline font-bold"
                                                            >
                                                                + Add Rule
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="space-y-3">
                                                        {selectedGroup.rules.map((rule, idx) => (
                                                            <div key={rule.id} className="text-xs space-y-0.5">
                                                                <h5 className="font-bold text-white font-serif flex items-center justify-between">
                                                                    <span>{idx + 1}. {rule.title}</span>
                                                                    {isInstructorOrInstitution && (
                                                                        <button
                                                                            onClick={() => handleDeleteGroupRule(selectedGroup.id, rule.id)}
                                                                            className="text-slate-500 hover:text-rose-400 text-[10px]"
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    )}
                                                                </h5>
                                                                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                                                                    {rule.description}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Featured Group Files & Downloads Card */}
                                                <div className="bg-[#0E131C] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
                                                    <h3 className="font-bold text-xs uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-1.5">
                                                        <FileText size={13} className="text-emerald-400" />
                                                        <span>Subject Documents Vault</span>
                                                    </h3>

                                                    <div className="space-y-2.5">
                                                        {selectedGroup.featuredFiles.map((file, idx) => (
                                                            <div key={idx} className="p-2.5 bg-[#141B26] rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                                                                <div className="min-w-0">
                                                                    <p className="text-xs font-mono font-bold text-white truncate">
                                                                        {file.name}
                                                                    </p>
                                                                    <span className="text-[10px] font-mono text-slate-500">
                                                                        {file.size} • {file.downloads} downloads
                                                                    </span>
                                                                </div>

                                                                <button
                                                                    onClick={() => handleDownloadContent(file.name, file.content)}
                                                                    className="p-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-black transition cursor-pointer"
                                                                    title="Download file in real time"
                                                                >
                                                                    <Download size={13} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Active Fellows in Group Live */}
                                                <div className="bg-[#0E131C] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
                                                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                                        <h3 className="font-bold text-xs uppercase font-mono tracking-wider text-slate-400">
                                                            Scholars Active Now
                                                        </h3>
                                                        <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                                                            Live
                                                        </span>
                                                    </div>

                                                    <div className="space-y-2">
                                                        {[
                                                            { name: 'Sarah Chen', role: 'Research Fellow', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80' },
                                                            { name: 'Kwame Asante', role: 'Learner', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80' },
                                                            { name: 'Elena Rostov', role: 'Research Fellow', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80' },
                                                            { name: 'David Mensah', role: 'Learner', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80' }
                                                        ].map((m, i) => (
                                                            <div key={i} className="flex items-center justify-between text-xs">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="relative">
                                                                        <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover" />
                                                                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-[#0E131C]"></span>
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-slate-200 text-xs">{m.name}</p>
                                                                        <span className="text-[9px] font-mono text-slate-500">{m.role}</span>
                                                                    </div>
                                                                </div>
                                                                <span className="text-[10px] font-mono text-slate-500">Active</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* TAB 2: FILES & SUBJECT VAULT */}
                                    {groupTab === 'files' && (
                                        <div className="bg-[#0E131C] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                                                <div>
                                                    <h3 className="text-base font-bold font-serif text-white">Subject Modules & Group Documents Vault</h3>
                                                    <p className="text-xs text-slate-400 mt-0.5">Authoritative lecture notes, verifiable term sheets, and reproducible code repositories.</p>
                                                </div>

                                                <button
                                                    onClick={() => groupFileInputRef.current?.click()}
                                                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl font-mono transition flex items-center gap-1.5 shrink-0"
                                                >
                                                    <Plus size={14} /> Upload to Group Vault
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {selectedGroup.featuredFiles.map((file, idx) => (
                                                    <div key={idx} className="p-4 bg-[#141B26] rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                                                                <FileCode size={20} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="text-xs font-mono font-bold text-white truncate">{file.name}</h4>
                                                                <p className="text-[10px] font-mono text-slate-400 mt-0.5">Size: {file.size} • Published: {file.date} • {file.downloads} Downloads</p>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => handleDownloadContent(file.name, file.content)}
                                                            className="px-3.5 py-2 bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-black rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                                                        >
                                                            <Download size={13} />
                                                            <span>Get</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* TAB 3: SCHOLARS & FELLOWS */}
                                    {groupTab === 'members' && (
                                        <div className="bg-[#0E131C] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                                            <div className="border-b border-slate-800 pb-4">
                                                <h3 className="text-base font-bold font-serif text-white">Community Scholars & Enrolled Fellows</h3>
                                                <p className="text-xs text-slate-400 mt-0.5">{selectedGroup.membersCount.toLocaleString()} total verified members in this academic group.</p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                {[
                                                    { name: selectedGroup.creator.name, role: selectedGroup.creator.role, avatar: selectedGroup.creator.avatar, badge: 'Charter Host' },
                                                    { name: 'Sarah Chen', role: 'Research Fellow', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', badge: 'Active' },
                                                    { name: 'Kwame Asante', role: 'Learner', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', badge: 'Active' },
                                                    { name: 'Elena Rostov', role: 'Research Fellow', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', badge: 'Active' },
                                                    { name: 'David Mensah', role: 'Learner', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80', badge: 'Active' },
                                                    { name: 'Amara Diallo', role: 'Learner', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80', badge: 'Active' },
                                                    { name: 'Mateo Silva', role: 'Research Fellow', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80', badge: 'Active' },
                                                    { name: 'Alex Turner (You)', role: userRole === 'instructor' ? 'Instructor' : 'Learner', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80', badge: 'You' }
                                                ].map((m, idx) => (
                                                    <div key={idx} className="p-3.5 bg-[#141B26] rounded-xl border border-slate-800 flex items-center justify-between">
                                                        <div className="flex items-center gap-2.5">
                                                            <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full object-cover" />
                                                            <div>
                                                                <p className="font-bold text-xs text-white truncate max-w-[130px]">{m.name}</p>
                                                                <span className="text-[10px] font-mono text-slate-400">{m.role}</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                            {m.badge}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* TAB 4: GROUP CANON & RULES */}
                                    {groupTab === 'rules' && (
                                        <div className="bg-[#0E131C] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                                            <div className="border-b border-slate-800 pb-4">
                                                <h3 className="text-base font-bold font-serif text-white">Community Canon & Academic Integrity Standards</h3>
                                                <p className="text-xs text-slate-400 mt-0.5">These binding guidelines are enforced by the charter host to protect intellectual honesty and mutual edification.</p>
                                            </div>

                                            <div className="space-y-4">
                                                {selectedGroup.rules.map((rule, idx) => (
                                                    <div key={rule.id} className="p-4 bg-[#141B26] rounded-2xl border border-slate-800 space-y-1.5">
                                                        <h4 className="text-sm font-bold text-white font-serif flex items-center gap-2">
                                                            <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono text-xs">
                                                                {idx + 1}
                                                            </span>
                                                            <span>{rule.title}</span>
                                                        </h4>
                                                        <p className="text-xs text-slate-300 leading-relaxed font-sans pl-8">
                                                            {rule.description}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* TAB 5: HOST GOVERNANCE (Instructors & Institutions Only) */}
                                    {groupTab === 'manage' && isInstructorOrInstitution && (
                                        <div className="bg-[#0E131C] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                                            <div className="border-b border-slate-800 pb-4">
                                                <h3 className="text-base font-bold font-serif text-white">Host Administration & Real-Time Governance</h3>
                                                <p className="text-xs text-slate-400 mt-0.5">Authorized controls for {selectedGroup.creator.name}. Changes take effect immediately across all nodes.</p>
                                            </div>

                                            {/* Pinned Announcement Editor */}
                                            <div className="p-4 bg-[#141B26] rounded-2xl border border-slate-800 space-y-3">
                                                <label className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                                                    <Pin size={13} className="text-amber-400" />
                                                    <span>Update Pinned Announcement</span>
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    defaultValue={selectedGroup.pinnedAnnouncement || ''}
                                                    onChange={(e) => setManageAnnouncement(e.target.value)}
                                                    placeholder="Enter pinned notice for all group fellows..."
                                                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                                                />
                                                <button
                                                    onClick={() => handlePinGroupAnnouncement(selectedGroup.id, manageAnnouncement || selectedGroup.pinnedAnnouncement || '')}
                                                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl font-mono transition"
                                                >
                                                    Save & Broadcast Pinned Notice
                                                </button>
                                            </div>

                                            {/* Add New Rule */}
                                            <div className="p-4 bg-[#141B26] rounded-2xl border border-slate-800 space-y-3">
                                                <label className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                                                    <Shield size={13} className="text-emerald-400" />
                                                    <span>Charter New Canon Rule</span>
                                                </label>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                    <input
                                                        type="text"
                                                        value={newRuleTitle}
                                                        onChange={(e) => setNewRuleTitle(e.target.value)}
                                                        placeholder="Rule Title"
                                                        className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={newRuleDescription}
                                                        onChange={(e) => setNewRuleDescription(e.target.value)}
                                                        placeholder="Rule Description"
                                                        className="sm:col-span-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => handleAddGroupRule(selectedGroup.id, newRuleTitle, newRuleDescription)}
                                                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl font-mono transition"
                                                >
                                                    Enact Rule
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* 3. DISCUSSION FORUMS VIEW */}
                    {currentView === 'forums' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow">
                                <h2 className="text-xl font-bold font-serif">Discussion Boards & Forums</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Get fast solutions, share theological insights, and collaborate side-by-side with peer researchers.</p>
                                
                                {/* Forum Category list indicators */}
                                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                                    {['General Discussion', 'Course Discussions', 'Questions & Answers', 'Success Stories'].map(fcat => (
                                        <span key={fcat} className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 rounded-md font-bold tracking-wide">
                                            {fcat}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Create Forum thread block */}
                            <form onSubmit={createForumThread} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow space-y-3">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">Start a New Forum Thread</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="sm:col-span-2">
                                        <input
                                            type="text"
                                            value={newForumTitle}
                                            onChange={(e) => setNewForumTitle(e.target.value)}
                                            placeholder="What is your question or topic?"
                                            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                                        />
                                    </div>
                                    <div>
                                        <select
                                            value={newForumCategory}
                                            onChange={(e) => setNewForumCategory(e.target.value)}
                                            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-dashed dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-350"
                                        >
                                            <option>Questions & Answers</option>
                                            <option>Course Discussions</option>
                                            <option>General Discussion</option>
                                            <option>Success Stories</option>
                                        </select>
                                    </div>
                                </div>
                                <textarea
                                    value={newForumContent}
                                    onChange={(e) => setNewForumContent(e.target.value)}
                                    placeholder="Provide background context, logs, code, or quotes to get accurate peer feedback."
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs resize-none"
                                    rows={3}
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={!newForumTitle.trim() || !newForumContent.trim()}
                                        className="px-5 py-1.5 text-xs font-bold text-white bg-crimson rounded-full hover:bg-red-800 disabled:bg-slate-300"
                                    >
                                        Publish Thread
                                    </button>
                                </div>
                            </form>

                            {/* Thread listings */}
                            <div className="space-y-4">
                                {forums.map(t => (
                                    <div key={t.id} className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow overflow-hidden">
                                        <div 
                                            onClick={() => setForums(forums.map(item => item.id === t.id ? { ...item, isExpanded: !item.isExpanded } : item))} 
                                            className="p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/10 flex items-start justify-between gap-3"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    {t.pinned && <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">PINNED</span>}
                                                    <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-305 font-bold px-2 py-0.5 rounded">{t.category}</span>
                                                </div>
                                                <h4 className="text-sm font-bold text-slate-805 dark:text-slate-150 leading-snug">{t.title}</h4>
                                                <div className="flex items-center space-x-2 text-[10.5px] text-slate-400">
                                                    <span>By {t.author}</span>
                                                    <span>•</span>
                                                    <span>{t.views} views</span>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="text-xs font-extrabold text-crimson dark:text-rose-400">{t.repliesCount} Replies</span>
                                                <p className="text-[10px] text-slate-400">Click to view</p>
                                            </div>
                                        </div>

                                        {/* Thread expanded details */}
                                        {t.isExpanded && (
                                            <div className="p-4 bg-slate-50/50 dark:bg-slate-905/30 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs">
                                                <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-slate-200/30">
                                                    <p className="font-semibold text-slate-500 text-[10.5px] mb-1">Original Query:</p>
                                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{t.content}</p>
                                                </div>

                                                {/* Replies list */}
                                                <div className="space-y-3.5 pl-3 border-l-2 border-slate-300">
                                                    {t.replies.map((rep, rIdx) => (
                                                        <div key={rIdx} className="bg-white dark:bg-gray-900 p-3 rounded-xl border border-slate-100 text-xs">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="font-extrabold text-slate-800 dark:text-slate-200">{rep.author}</span>
                                                                <div className="flex items-center gap-1">
                                                                    {rep.bestAnswer && (
                                                                        <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded text-[9.5px] font-bold">BEST ANSWER ✔</span>
                                                                    )}
                                                                    <span className="text-[10px] text-slate-400">{rep.date}</span>
                                                                </div>
                                                            </div>
                                                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{rep.content}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Submit reply */}
                                                <div className="flex gap-2.5 pt-2">
                                                    <input
                                                        type="text"
                                                        value={newForumReply[t.id] || ''}
                                                        onChange={(e) => setNewForumReply({ ...newForumReply, [t.id]: e.target.value })}
                                                        placeholder="Post your feedback into this thread..."
                                                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl text-xs"
                                                    />
                                                    <button
                                                        onClick={() => addForumReply(t.id)}
                                                        className="px-4 py-1.5 text-xs font-bold text-white bg-crimson hover:bg-red-800 rounded-xl"
                                                    >
                                                        Reply
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 4. CLINU STUDY CIRCLES VIEW */}
                    {currentView === 'circles' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div>
                                    <h2 className="text-xl font-bold font-serif">Study Circles Room</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Form close accountability circles checking in weekly to secure target performance.</p>
                                </div>
                                <button
                                    onClick={() => setShowCreateCircleForm(!showCreateCircleForm)}
                                    className="px-4 py-1.5 text-xs font-bold text-white bg-crimson rounded-full hover:bg-red-800 flex items-center gap-1"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Launch Study Circle
                                </button>
                            </div>

                            {/* Create Study circle form modal or inline */}
                            {showCreateCircleForm && (
                                <form onSubmit={createStudyCircle} className="bg-white dark:bg-gray-800 p-5 rounded-xl border-2 border-dashed border-rose-500/30 shadow-lg space-y-3 text-xs">
                                    <h3 className="font-serif font-bold text-slate-900 dark:text-white text-sm">Configure Core Study Circle Specs</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-slate-500 font-bold mb-1">Study Circle Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={newCircleName}
                                                onChange={(e) => setNewCircleName(e.target.value)}
                                                placeholder="e.g. AI Ethics Daily Check-In"
                                                className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg dark:bg-slate-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-slate-500 font-bold mb-1">Privacy Level</label>
                                            <select
                                                value={newCirclePrivacy}
                                                onChange={(e) => setNewCirclePrivacy(e.target.value as any)}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg dark:bg-slate-900"
                                            >
                                                <option>Public</option>
                                                <option>Private</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-slate-500 font-bold mb-1">Milestones & Study Goals</label>
                                        <textarea
                                            value={newCircleGoals}
                                            onChange={(e) => setNewCircleGoals(e.target.value)}
                                            placeholder="Specify the learning plan output goals..."
                                            className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg dark:bg-slate-900"
                                            rows={2}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-500 font-bold mb-1">Aesthetic Description</label>
                                        <input
                                            type="text"
                                            value={newCircleDesc}
                                            onChange={(e) => setNewCircleDesc(e.target.value)}
                                            placeholder="A short brief explaining the spiritual/learning vibe."
                                            className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg dark:bg-slate-900"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 text-xs">
                                        <button type="button" onClick={() => setShowCreateCircleForm(false)} className="px-3.5 py-1.5 font-bold bg-slate-100 rounded">Cancel</button>
                                        <button type="submit" className="px-4 py-1.5 font-bold text-white bg-crimson rounded hover:bg-red-800">Boot Circle</button>
                                    </div>
                                </form>
                            )}

                            {/* Circle selector row */}
                            <div className="flex gap-2 overflow-x-auto pb-1 select-none">
                                {studyCircles.map(sc => (
                                    <button
                                        key={sc.id}
                                        onClick={() => setActiveCircleId(sc.id)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                                            activeCircleId === sc.id
                                            ? 'bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-500/40 ring-1 ring-crimson'
                                            : 'bg-white dark:bg-gray-800 text-slate-500 border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        {sc.name}
                                    </button>
                                ))}
                            </div>

                            {/* Accountability Workspace layout */}
                            {activeCircle ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow text-xs">
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="pb-3 border-b">
                                            <div className="flex justify-between">
                                                <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">{activeCircle.name}</h3>
                                                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{activeCircle.privacy} Room</span>
                                            </div>
                                            <p className="text-slate-500 mt-1">{activeCircle.description}</p>
                                        </div>

                                        {/* Accountability goals */}
                                        <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl space-y-1">
                                            <div className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> Shared Commitments</div>
                                            <p className="text-slate-600 dark:text-slate-300">{activeCircle.goals}</p>
                                        </div>

                                        {/* Task checklist */}
                                        <div className="space-y-2">
                                            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                <span>Active Peer Checkpoints</span>
                                                <span className="text-[10.5px] text-slate-400">
                                                    Score: {activeCircle.tasks.filter(t => t.done).length}/{activeCircle.tasks.length} Completed
                                                </span>
                                            </div>
                                            <div className="space-y-1.5">
                                                {activeCircle.tasks.map(t => (
                                                    <div 
                                                        key={t.id} 
                                                        onClick={() => toggleCircleTask(activeCircle.id, t.id)}
                                                        className="flex items-center space-x-2 p-2.5 rounded-lg border bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-100/50 cursor-pointer transition-all"
                                                    >
                                                        <input 
                                                            type="checkbox" 
                                                            checked={t.done} 
                                                            readOnly
                                                            className="rounded text-crimson focus:ring-crimson" 
                                                        />
                                                        <span className={`${t.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300 font-medium'}`}>{t.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Shared Notes Area */}
                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 block">Shared Notes Workspace (Persistent memory)</label>
                                            <textarea
                                                value={activeCircle.notes}
                                                onChange={(e) => appendCircleNotes(activeCircle.id, e.target.value)}
                                                className="w-full p-2.5 bg-slate-50 dark:bg-slate-905 border border-slate-200 rounded-lg focus:ring-1 text-xs"
                                                rows={3}
                                            />
                                        </div>
                                    </div>

                                    {/* Sidebar Live Group chat inside circle */}
                                    <div className="border-t md:border-t-0 md:border-l pt-4 md:pt-0 pl-0 md:pl-4 flex flex-col justify-between h-[360px]">
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-white pb-2 border-b">Live Circle Chat</h4>
                                            <div className="space-y-3.5 overflow-y-auto h-[260px] pr-1 py-1 text-xs">
                                                {activeCircle.chatMessages.map((msg, index) => (
                                                    <div key={index} className="space-y-0.5">
                                                        <div className="flex justify-between text-[10.5px] text-slate-400 font-bold">
                                                            <span>{msg.sender}</span>
                                                            <span>{msg.time}</span>
                                                        </div>
                                                        <p className="bg-slate-50 dark:bg-slate-900 border px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300">{msg.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5 pt-2 border-t">
                                            <input
                                                type="text"
                                                value={circleChatMessage}
                                                onChange={(e) => setCircleChatMessage(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') sendCircleMessage(activeCircle.id);
                                                }}
                                                placeholder="Say something to the group..."
                                                className="flex-1 px-2.5 py-1.5 bg-slate-100 rounded border border-slate-200"
                                            />
                                            <button 
                                                onClick={() => sendCircleMessage(activeCircle.id)}
                                                className="px-2.5 py-1.5 bg-crimson hover:bg-red-800 text-white rounded font-bold"
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-slate-400 text-xs py-8">Select or create a study circle accountability room to begin.</p>
                            )}
                        </div>
                    )}

                    {/* 5. MENTORSHIP HUB VIEW */}
                    {currentView === 'mentorship' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div>
                                    <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">Acredited Spiritual & Technical Mentors</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Connect with industry principals who provide alignment roadmap checks, code reviews, and theological mentoring.</p>
                                </div>
                                <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span>Real-Time Sovereign Rating Ledger</span>
                                </div>
                            </div>

                            {/* Mentors list cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {mentorsInfo.map(m => (
                                    <div key={m.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl text-center border border-slate-200 dark:border-slate-700/70 overflow-hidden flex flex-col justify-between items-center shadow relative group hover:border-crimson/50 transition-all">
                                        <div className="absolute top-3 right-3 flex items-center text-amber-500 font-extrabold text-xs bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                            <Star className="w-3.5 h-3.5 fill-current mr-1 text-amber-400" />
                                            <span>{m.rating}</span>
                                        </div>
                                        <div className="flex flex-col items-center w-full">
                                            <img src={m.avatarUrl} alt={m.name} className="w-20 h-20 rounded-full object-cover border-2 border-crimson/40 ring-4 ring-slate-100 dark:ring-slate-700 bg-slate-100 flex-shrink-0 shadow-sm" />
                                            <h4 className="mt-3.5 text-base font-bold font-serif text-slate-900 dark:text-white leading-tight">{m.name}</h4>
                                            <p className="text-xs text-slate-400 mt-0.5">{m.title}</p>
                                            <span className="text-[10px] text-slate-500 dark:text-slate-350 bg-slate-100 dark:bg-slate-700/60 rounded px-2 py-0.5 mt-1 font-semibold">{m.organization}</span>
                                            
                                            {/* Real-time Star Rating widget */}
                                            <div className="mt-3 py-1 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-1">
                                                <span className="text-[10px] text-zinc-400 font-mono mr-1">Rate:</span>
                                                {[1, 2, 3, 4, 5].map((star) => {
                                                    const isHovered = (mentorHoverRatings[m.id] || 0) >= star;
                                                    const isFilled = isHovered || Math.round(m.rating) >= star;
                                                    return (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onMouseEnter={() => setMentorHoverRatings(prev => ({ ...prev, [m.id]: star }))}
                                                            onMouseLeave={() => setMentorHoverRatings(prev => ({ ...prev, [m.id]: 0 }))}
                                                            onClick={() => rateMentor(m.id, star)}
                                                            className="p-0.5 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                                                            title={`Rate ${star} star${star > 1 ? 's' : ''} in real time`}
                                                        >
                                                            <Star className={`w-3.5 h-3.5 ${isFilled ? 'fill-current text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                                                        </button>
                                                    );
                                                })}
                                                <span className="text-[10px] font-mono text-zinc-400 ml-1">({m.reviews})</span>
                                            </div>

                                            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                                                {m.expertise.map(skill => (
                                                    <span key={skill} className="px-2 py-0.5 text-[9.5px] font-extrabold bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 rounded border border-rose-100/10">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action buttons: View Profile & Book Consultation */}
                                        <div className="mt-5 w-full flex items-center gap-2">
                                            <button
                                                onClick={() => setViewingMentorProfile(m)}
                                                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                                                title="View detailed mentor profile, reviews, and credentials"
                                            >
                                                <User size={13} />
                                                <span>View Profile</span>
                                            </button>
                                            <button
                                                onClick={() => setSelectedMentor(m)}
                                                className="flex-1 py-2 bg-crimson hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                <UserPlus size={13} />
                                                <span>Book Session</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Booking session modal panel */}
                            {selectedMentor && (
                                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border-2 border-crimson/50 shadow-lg space-y-4 text-xs animate-fade-in">
                                    <h3 className="font-serif font-bold text-slate-900 dark:text-white text-base">
                                        Schedule 1-on-1 Consultation Session with {selectedMentor.name}
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-slate-500 font-bold mb-1">Target Topic</label>
                                            <select
                                                value={bookingTopic}
                                                onChange={(e) => setBookingTopic(e.target.value)}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded dark:bg-slate-900"
                                            >
                                                <option>Career Roadmap & Kingdom Alignment</option>
                                                <option>Theological Alignment Strategy</option>
                                                <option>Technical Architectural Code Review</option>
                                                <option>Ethics & Deep Learning</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-slate-500 font-bold mb-1">Select Consultation Day</label>
                                            <input
                                                type="date"
                                                value={bookingDay}
                                                onChange={(e) => setBookingDay(e.target.value)}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                                            />
                                        </div>
                                    </div>

                                    {bookingRequested ? (
                                        <div className="p-3 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-center rounded">
                                            ✔ Consultation Requested! Confirmed on dashboard.
                                        </div>
                                    ) : (
                                        <div className="flex justify-end gap-2 text-xs">
                                            <button onClick={() => setSelectedMentor(null)} className="px-3.5 py-1.5 font-bold bg-slate-100 rounded">Cancel</button>
                                            <button onClick={bookMentorSession} className="px-4 py-1.5 font-bold text-white bg-crimson rounded">Confirm Booking</button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Mentorship upcoming list */}
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow text-xs">
                                <h3 className="font-serif font-bold text-slate-900 dark:text-white text-sm mb-3">Scheduled Mentorship Dashboard</h3>
                                <div className="space-y-2">
                                    {scheduledSessions.map(sess => (
                                        <div key={sess.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 text-slate-600 dark:text-slate-300">
                                            <div>
                                                <span className="font-bold text-slate-800 dark:text-white text-sm">{sess.mentorName}</span>
                                                <p className="text-[11px] text-slate-405 mt-0.5">Topic: {sess.topic}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-bold text-rose-700 dark:text-rose-400">{sess.date}</span>
                                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">At {sess.time} GMT</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 6. EVENTS & WEBINARS DISCOVERY */}
                    {currentView === 'events' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow">
                                <h2 className="text-xl font-bold font-serif">Community Events & Masterclasses</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Participate in live weekly sessions discussing neural ethics, architecture design, or career alignment.</p>
                            </div>

                            <div className="space-y-4">
                                {events.map(ev => (
                                    <div key={ev.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-205 shadow flex flex-col md:flex-row gap-5 items-start">
                                        <div className="flex md:flex-col items-center gap-2 shrink-0 text-center bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200/50 w-full md:w-28">
                                            <span className="text-xs font-mono font-bold text-slate-500 uppercase">{ev.category}</span>
                                            <span className="text-xl font-black font-serif text-crimson dark:text-rose-400">
                                                {new Date(ev.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                                            </span>
                                            <span className="text-[10.5px] text-slate-400 font-semibold">17:00 GMT</span>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <h4 className="text-lg font-bold font-serif text-slate-900 dark:text-white leading-tight">{ev.title}</h4>
                                            <div className="flex items-center text-xs text-slate-550 select-none">
                                                <img src={ev.avatarUrl} className="w-5 h-5 rounded-full object-cover mr-1.5" alt="" />
                                                <span className="font-semibold text-slate-700 dark:text-slate-350">Led by {ev.speaker}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{ev.description}</p>
                                            
                                            <div className="pt-2 flex flex-wrap gap-2 text-xs">
                                                <button
                                                    onClick={() => toggleRegisterEvent(ev.id)}
                                                    className={`px-4 py-1.5 rounded-full font-bold transition-all ${
                                                        ev.isRegistered
                                                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                                        : 'bg-crimson text-white hover:bg-red-800'
                                                    }`}
                                                >
                                                    {ev.isRegistered ? 'Registered ✔' : 'Register Seat'}
                                                </button>
                                                {ev.isRegistered && (
                                                    <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full font-semibold select-none border border-slate-200/20">
                                                        Added to Calendar
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 7. CHALLENGES & GAMIFICATION VIEW */}
                    {currentView === 'challenges' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow text-center sm:text-left">
                                <h2 className="text-xl font-bold font-serif">Missions & Gamification Board</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Accelerate contributions and solidify skills by enrolling in custom community missions.</p>
                            </div>

                            {/* Challenges Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-250 shadow flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="px-2 py-0.5 bg-amber-500/15 text-amber-500 border border-amber-500/20 rounded font-bold uppercase text-[9px] tracking-wider">7-DAY FAITH & DEVOTION MISSION</span>
                                            <span className="text-amber-500 font-bold text-xs">+100pts</span>
                                        </div>
                                        <h4 className="text-base font-bold font-serif text-slate-900 dark:text-white">The Devotional Learner Loop</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-350 leading-relaxed">Publish study circle check-ins and prayers seven days consecutively to earn the exclusive "Theological Contributor" bronze badge.</p>
                                        
                                        <div className="pt-2">
                                            <div className="flex justify-between text-[11px] text-slate-405 font-bold mb-1">
                                                <span>Mission Progress</span>
                                                <span className="font-mono text-amber-400 font-bold">{dayCheckStreak}/7 Days</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                                <div 
                                                    className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full transition-all duration-500" 
                                                    style={{ width: `${Math.round((dayCheckStreak / 7) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleVerifyDayCheck} 
                                        className={`mt-4 px-4 py-2 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                                            dayCheckVerifiedToday 
                                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                                                : 'bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white shadow-md shadow-rose-600/20 active:scale-95'
                                        }`}
                                    >
                                        <CheckCircle2 size={13} />
                                        <span>{dayCheckVerifiedToday ? `Verified Today (${dayCheckStreak}/7) · View Prayer Room` : 'Verify Day Check (+50 XP)'}</span>
                                    </button>
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-250 shadow flex flex-col justify-between container">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="px-2 py-0.5 bg-blue-500/15 text-blue-500 border border-blue-500/20 rounded font-bold uppercase text-[9px] tracking-wider">PEER REVIEW MISSION</span>
                                            <span className="text-cyan-400 font-bold text-xs">+60pts</span>
                                        </div>
                                        <h4 className="text-base font-bold font-serif text-slate-900 dark:text-white">Accredited Peer Assessor</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-350 leading-relaxed">Review and score three homework submissions in the 'Knowledge Exchange' template logs to secure higher community trust standing.</p>
                                        
                                        <div className="pt-2">
                                            <div className="flex justify-between text-[11px] text-slate-405 font-bold mb-1">
                                                <span>Reviews Completed</span>
                                                <span className="font-mono text-cyan-400 font-bold">{peerReviewsCount}/3 Submissions</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                                <div 
                                                    className="bg-gradient-to-r from-blue-400 to-cyan-500 h-full rounded-full transition-all duration-500" 
                                                    style={{ width: `${Math.round((peerReviewsCount / 3) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleOpenPeerFeedback} 
                                        className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-bold text-xs transition shadow-md shadow-cyan-600/20 active:scale-95 flex items-center justify-center gap-1.5"
                                    >
                                        <Award size={13} />
                                        <span>Submit Peer Feedback (+20 XP)</span>
                                    </button>
                                </div>
                            </div>

                            {/* Badge collection view */}
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow text-xs">
                                <h3 className="font-serif font-bold text-slate-900 dark:text-white text-sm mb-4">ALEX TURNER’S UNLOCKED ACCREDITATION BADGES</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                    {[
                                        { name: 'Community Builder', desc: 'Launched a custom accountability study group', icon: Users, color: 'from-amber-400 to-amber-600' },
                                        { name: 'Prayer Warrior', desc: 'Supported 10+ peer requests under reflections', icon: Heart, color: 'from-rose-400 to-red-600' },
                                        { name: 'Knight Contributor', desc: 'Uploaded theological resource models', icon: BookOpen, color: 'from-blue-400 to-indigo-600' },
                                        { name: 'Sovereign Leader', desc: 'Gave mentorship feedback to 5 peers', icon: Shield, color: 'from-emerald-400 to-teal-600' }
                                    ].map(b => {
                                        const unlocked = unlockedBadges.includes(b.name);
                                        const BIcon = b.icon;
                                        return (
                                            <div key={b.name} className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all duration-300 ${unlocked ? 'bg-gradient-to-br from-slate-50 to-white dark:from-slate-905 dark:to-slate-900 border-rose-500/20' : 'opacity-40 bg-slate-105 border-slate-200'}`}>
                                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${b.color} flex items-center justify-center text-white font-bold shadow-md`}>
                                                    <BIcon className="w-5 h-5" />
                                                </div>
                                                <span className="font-extrabold text-[11px] text-slate-800 dark:text-white leading-tight">{b.name}</span>
                                                <p className="text-[10px] text-slate-400 leading-snug">{b.desc}</p>
                                                {!unlocked && <span className="bg-slate-100 text-[8.5px] font-bold px-1.5 py-0.2 rounded text-slate-500">LOCKED</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 8. PRAYER & REFLECTION ROOM UNIQUE DIFFERENTIATOR */}
                    {currentView === 'prayer' && (
                        <div className="space-y-6">
                            {/* Intro devotions block */}
                            <div className="bg-gradient-to-r from-rose-950/90 to-slate-900 text-white p-5 rounded-2xl border border-rose-900/30 select-none">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-350 border border-rose-500/30 rounded font-bold uppercase text-[9px] tracking-wider">DAILY SCRIPTURE DEVOTIONAL</span>
                                        <h3 className="text-lg font-bold font-serif text-white mt-1.5">"As iron sharpens iron, so one person sharpens another."</h3>
                                        <p className="text-xs text-rose-200/80 mt-1 italic font-mono">— Proverbs 27:17 • Kingdom Learning Wisdom</p>
                                    </div>
                                    <span className="text-2xl">📖</span>
                                </div>
                            </div>

                            {/* Send prayer request box */}
                            <form onSubmit={sendPrayerRequest} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow space-y-3 font-xs">
                                <h3 className="font-serif font-bold text-slate-900 dark:text-white text-sm">Add a Devotional Reflection or Prayer Request</h3>
                                <div className="grid grid-cols-1 gap-2.5">
                                    <input
                                        type="text"
                                        required
                                        value={newPrayerTitle}
                                        onChange={(e) => setNewPrayerTitle(e.target.value)}
                                        placeholder="e.g. Seeking Guidance for Theological Coding Project"
                                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded text-xs"
                                    />
                                    <textarea
                                        required
                                        value={newPrayerBody}
                                        onChange={(e) => setNewPrayerBody(e.target.value)}
                                        placeholder="Uplift our community, share a breakthrough testimony, or ask for accountability checks..."
                                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded text-xs resize-none"
                                        rows={3}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" disabled={!newPrayerTitle.trim() || !newPrayerBody.trim()} className="px-5 py-2 text-xs font-bold text-white bg-crimson rounded-full">
                                        Submit Reflection
                                    </button>
                                </div>
                            </form>

                            {/* Active prayers log board */}
                            <div className="space-y-3.5">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-serif font-bold text-slate-900 dark:text-white text-base">Shared Prayer & Reflection Records</h3>
                                    <span className="text-xs font-mono text-zinc-400">{prayerRequests.length} Active Devotions</span>
                                </div>
                                {prayerRequests.map(pr => {
                                    const isNewlySubmitted = recentReflectionId === pr.id;
                                    return (
                                        <div 
                                            key={pr.id} 
                                            className={`p-4.5 rounded-xl border shadow-sm flex justify-between items-start transition-all duration-300 ${
                                                isNewlySubmitted 
                                                    ? 'bg-emerald-950/20 border-emerald-500/60 ring-2 ring-emerald-500/30 dark:bg-emerald-950/30' 
                                                    : 'bg-white dark:bg-gray-800 border-slate-220 dark:border-slate-700/80'
                                            }`}
                                        >
                                            <div className="space-y-1.5 flex-1 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white font-serif">{pr.title}</h4>
                                                    {isNewlySubmitted && (
                                                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/40 animate-pulse">
                                                            ✨ Newly Submitted
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-bold">Reflected by {pr.author}</p>
                                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{pr.content}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <button
                                                    onClick={() => supportPrayer(pr.id)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                                                        pr.hasPrayed
                                                        ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                                                        : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-900 dark:border-slate-700'
                                                    }`}
                                                >
                                                    <span>🙏 Prayed</span>
                                                    <span className="font-extrabold">{pr.prayersCount}</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Gratitude Sticky wall */}
                            <div className="bg-amber-50 dark:bg-slate-900/60 p-5 rounded-xl border border-amber-200/40 text-xs">
                                <h3 className="font-serif font-bold text-amber-900 dark:text-amber-300 text-sm mb-3">Community Gratitude Wall</h3>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={newGratitudeText}
                                        onChange={(e) => setNewGratitudeText(e.target.value)}
                                        placeholder="Add your note of thanks..."
                                        className="flex-1 px-3 py-1.5 bg-white border border-amber-200 rounded text-xs text-slate-700"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') submitGratitude();
                                        }}
                                    />
                                    <button onClick={submitGratitude} className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold">Stick Post-It</button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                                    {gratitudeNotes.map((note, index) => (
                                        <div key={index} className="p-3 bg-white/95 text-slate-700 rounded-lg border-l-4 border-amber-500 shadow-sm relative leading-relaxed">
                                            <p className="font-medium text-xs">{note}</p>
                                            <span className="absolute bottom-1 right-2 text-[9px] text-amber-500 font-bold opacity-60 uppercase font-mono">GRATEFUL</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 9. KNOWLEDGE EXCHANGE TEMPLATE FILES */}
                    {currentView === 'knowledge' && (
                        <div className="space-y-6">
                            {/* Hero Header & Metrics Strip */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                                                Sovereign Repository v2.4
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2.5">
                                            <BookOpen className="text-crimson w-6 h-6" />
                                            <span>Knowledge Exchange Vault</span>
                                        </h2>
                                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                                            Acquire, audit, and publish community-guided startup cheat sheets, reproducible engineering templates, and theological research papers signed by verified faculty.
                                        </p>
                                    </div>

                                    <button 
                                        onClick={() => {
                                            const formEl = document.getElementById('resource-publish-section');
                                            formEl?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="px-4 py-2 bg-crimson hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer self-start md:self-auto shrink-0 active:scale-95"
                                    >
                                        <UploadCloud size={15} />
                                        <span>Publish Resource (+25 XP)</span>
                                    </button>
                                </div>

                                {/* Metric Strip */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 font-mono text-xs">
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                                        <span className="text-[10px] text-zinc-400 uppercase block">Indexed Assets</span>
                                        <span className="text-base font-bold text-slate-800 dark:text-white">2,480+ Files</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                                        <span className="text-[10px] text-zinc-400 uppercase block">Peer Downloads</span>
                                        <span className="text-base font-bold text-emerald-400">14.2k Dispatches</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                                        <span className="text-[10px] text-zinc-400 uppercase block">Tamper Resistance</span>
                                        <span className="text-base font-bold text-blue-400">100% W3C Hash</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                                        <span className="text-[10px] text-zinc-400 uppercase block">Faculty Authors</span>
                                        <span className="text-base font-bold text-amber-400">340+ Verified</span>
                                    </div>
                                </div>
                            </div>

                            {/* Search and Category Filters */}
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow flex flex-col md:flex-row md:items-center justify-between gap-3">
                                {/* Category Pills */}
                                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-mono text-xs">
                                    {['All', 'Templates', 'Research Papers', 'Articles', 'Cheat Sheets'].map((cat) => {
                                        const count = cat === 'All' 
                                            ? resources.length 
                                            : resources.filter(r => r.category.toLowerCase() === cat.toLowerCase()).length;
                                        return (
                                            <button
                                                key={cat}
                                                onClick={() => setResourceCategoryFilter(cat)}
                                                className={`px-3 py-1.5 rounded-xl transition cursor-pointer font-semibold shrink-0 text-xs flex items-center gap-1.5 ${
                                                    resourceCategoryFilter === cat
                                                        ? 'bg-crimson text-white shadow-sm'
                                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-white'
                                                }`}
                                            >
                                                <span>{cat}</span>
                                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                                    resourceCategoryFilter === cat ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-zinc-400'
                                                }`}>
                                                    {count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Search Bar */}
                                <div className="relative w-full md:w-72">
                                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                                    <input
                                        type="text"
                                        value={resourceSearchTerm}
                                        onChange={(e) => setResourceSearchTerm(e.target.value)}
                                        placeholder="Search title, author, keyword..."
                                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-crimson"
                                    />
                                    {resourceSearchTerm && (
                                        <button 
                                            onClick={() => setResourceSearchTerm('')} 
                                            className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-200 text-xs"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Real-time File Upload Workspace Form */}
                            <form 
                                id="resource-publish-section" 
                                onSubmit={submitResource} 
                                className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow space-y-4 text-xs"
                            >
                                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700/60">
                                    <h3 className="font-serif font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                                        <UploadCloud className="w-4 h-4 text-crimson" />
                                        <span>Publish a Community Resource Document</span>
                                    </h3>
                                    <span className="text-[10.5px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                        Cryptographic W3C Attestation
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="sm:col-span-2">
                                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Resource Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={uploadedResourceTitle}
                                            onChange={(e) => setUploadedResourceTitle(e.target.value)}
                                            placeholder="e.g. Distributed Consensus & Cryptographic Ethics Blueprint"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-xl dark:bg-slate-900 dark:border-slate-700 text-xs text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Category</label>
                                        <select
                                            value={uploadedResourceCat}
                                            onChange={(e) => setUploadedResourceCat(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-xl dark:bg-slate-900 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs"
                                        >
                                            <option>Templates</option>
                                            <option>Research Papers</option>
                                            <option>Articles</option>
                                            <option>Cheat Sheets</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Hidden file input and interactive dropzone */}
                                <input
                                    type="file"
                                    ref={resourceFileInputRef}
                                    onChange={handleResourceFileSelect}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.md,.txt"
                                />

                                <div 
                                    onClick={() => resourceFileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                                        selectedResourceFile 
                                            ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/20' 
                                            : 'border-slate-300 hover:border-crimson dark:border-slate-700 hover:dark:border-rose-500/50 bg-slate-50/50 dark:bg-slate-900/30'
                                    }`}
                                >
                                    {selectedResourceFile ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <FileText className="w-8 h-8 text-emerald-400 shrink-0" />
                                            <div className="text-left">
                                                <div className="text-xs font-bold text-slate-800 dark:text-white">{selectedResourceFile.name}</div>
                                                <div className="text-[10px] font-mono text-zinc-400">
                                                    {(selectedResourceFile.size / (1024 * 1024)).toFixed(2)} MB · Ready for real-time publishing
                                                </div>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedResourceFile(null);
                                                    if (resourceFileInputRef.current) resourceFileInputRef.current.value = '';
                                                }}
                                                className="ml-2 p-1 text-slate-400 hover:text-red-400"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Cloud className="w-7 h-7 mx-auto mb-1 text-slate-400 group-hover:text-rose-500" />
                                            <span className="text-xs font-semibold text-crimson dark:text-rose-400 hover:underline">
                                                Click to browse local PDF / MD / ZIP / DOCX resource file
                                            </span>
                                            <p className="text-[10px] text-slate-400 mt-0.5">Maximum size: 25MB • Reads metadata and generates cryptographic W3C passport signature</p>
                                        </>
                                    )}
                                </div>

                                {/* Animated real-time upload progress bar */}
                                {isPublishingResource && (
                                    <div className="space-y-1.5 p-3 bg-slate-900 rounded-xl border border-rose-500/20">
                                        <div className="flex justify-between items-center text-[10px] font-mono">
                                            <span className="text-zinc-300">Publishing to Sovereign Knowledge Exchange...</span>
                                            <span className="text-emerald-400 font-bold">{uploadProgress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                            <div 
                                                className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full transition-all duration-150"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end gap-2 pt-1">
                                    <button 
                                        type="submit" 
                                        disabled={!uploadedResourceTitle.trim() || isPublishingResource} 
                                        className="px-6 py-2 text-xs font-bold text-white bg-crimson hover:bg-red-800 disabled:opacity-50 rounded-xl transition shadow-md shadow-crimson/20 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <UploadCloud size={14} />
                                        <span>{isPublishingResource ? 'Publishing...' : 'Publish Resource Model (+25 XP)'}</span>
                                    </button>
                                </div>
                            </form>

                            {/* Resource Card Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {resources
                                    .filter(r => {
                                        const matchesCat = resourceCategoryFilter === 'All' || r.category.toLowerCase() === resourceCategoryFilter.toLowerCase();
                                        const matchesSearch = !resourceSearchTerm || 
                                            r.title.toLowerCase().includes(resourceSearchTerm.toLowerCase()) || 
                                            r.author.toLowerCase().includes(resourceSearchTerm.toLowerCase()) || 
                                            r.category.toLowerCase().includes(resourceSearchTerm.toLowerCase());
                                        return matchesCat && matchesSearch;
                                    })
                                    .map(res => {
                                        const isTemplate = res.category.toLowerCase().includes('template');
                                        const isPaper = res.category.toLowerCase().includes('paper');
                                        const isCheat = res.category.toLowerCase().includes('cheat');
                                        const badgeColor = isTemplate 
                                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                                            : isPaper 
                                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                                                : isCheat 
                                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                                        const fileExt = isPaper ? 'PDF' : isTemplate ? 'MD' : isCheat ? 'CHEAT' : 'DOCX';

                                        return (
                                            <div 
                                                key={res.id} 
                                                className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/70 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-crimson/40 transition-all duration-200 group relative"
                                            >
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-md bg-slate-900 text-white border border-slate-700">
                                                                .{fileExt}
                                                            </span>
                                                            <span className={`text-[10.5px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                                                                {res.category}
                                                            </span>
                                                        </div>
                                                        <span className="text-[10px] font-mono text-zinc-400">{res.fileSize || '1.8 MB'}</span>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white font-serif leading-snug group-hover:text-crimson transition-colors line-clamp-2">
                                                            {res.title}
                                                        </h4>
                                                        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                                                            <span className="flex items-center gap-1 font-medium">
                                                                <User size={12} className="text-zinc-400" />
                                                                <span>{res.author}</span>
                                                            </span>
                                                            <span className="font-mono text-[10px] text-zinc-500">{res.uploadedAt || 'June 2026'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-[10px] font-mono text-zinc-400 space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <span>W3C Digest:</span>
                                                            <span className="text-emerald-400 font-bold">0x9b7f...e57c</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-zinc-500">
                                                            <span>Security:</span>
                                                            <span className="text-slate-300">Sovereign Signed</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                                                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                                                        <Activity size={12} className="text-emerald-400" />
                                                        <span>{res.downloads}</span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            onClick={() => setViewingResourcePreview(res)}
                                                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition text-xs font-bold cursor-pointer"
                                                            title="Preview document content in real time"
                                                        >
                                                            <Eye size={13} />
                                                        </button>
                                                        <button
                                                            onClick={() => openShareModal({
                                                                title: res.title,
                                                                url: `${window.location.origin}/community/knowledge/${res.id}`,
                                                                category: res.category,
                                                                summary: `Academic resource by ${res.author} (${res.fileSize || '1.8 MB'})`,
                                                                type: 'Knowledge Resource',
                                                                originalId: res.id
                                                            })}
                                                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition text-xs font-bold cursor-pointer"
                                                            title="Share resource via Gmail, WhatsApp, or Direct Message"
                                                        >
                                                            <Share2 size={13} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownloadResource(res)}
                                                            className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/30 rounded-xl font-bold transition flex items-center gap-1.5 text-xs active:scale-95 shadow-sm cursor-pointer"
                                                            title="Download genuine academic file in real time"
                                                        >
                                                            <Download size={13} />
                                                            <span>Get</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}

                    {/* 10. NETWORKING LOUNGE VIEW */}
                    {currentView === 'networking' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow">
                                <h2 className="text-xl font-bold font-serif">Networking Lounge</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Browse members directory, search by profession, skills, or country, and expand your corporate web.</p>
                            </div>

                            {/* Real-time Directory Layout Connection Roster */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {loungers.map(l => (
                                    <div key={l.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/70 text-center flex flex-col justify-between items-center shadow-sm hover:border-emerald-500/40 transition group">
                                        <div className="flex flex-col items-center w-full">
                                            <div className="relative">
                                                <img 
                                                    src={l.avatarUrl} 
                                                    alt={l.name} 
                                                    className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500/40 shadow-sm"
                                                />
                                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#141B26] rounded-full animate-pulse" title="Active in Real Time" />
                                            </div>

                                            <h4 className="mt-3 font-bold font-serif text-slate-900 dark:text-white leading-tight flex items-center justify-center gap-1">
                                                <span>{l.name}</span>
                                            </h4>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">{l.title}</p>
                                            
                                            <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                                <span>Active in Lounge · {l.country}</span>
                                            </div>

                                            {/* Skills chips */}
                                            <div className="mt-2.5 flex flex-wrap justify-center gap-1">
                                                {l.skills.map((s, idx) => (
                                                    <span key={idx} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 rounded text-[9.5px] font-mono">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-4 w-full flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                                            <button
                                                onClick={() => toggleConnectLounger(l.id)}
                                                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                                                    l.isConnected
                                                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                                                    : 'bg-crimson text-white hover:bg-red-800 shadow-sm'
                                                }`}
                                            >
                                                {l.isConnected ? (
                                                    <>
                                                        <Check size={12} className="text-emerald-400" />
                                                        <span>Connected</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus size={12} />
                                                        <span>Connect</span>
                                                    </>
                                                )}
                                            </button>

                                            {/* Official WhatsApp Launch Button */}
                                            <button
                                                onClick={() => handleOpenWhatsAppModal(l)}
                                                className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1 active:scale-95"
                                                title={`Start WhatsApp Chat with ${l.name}`}
                                            >
                                                <WhatsAppIcon size={14} className="text-black shrink-0" />
                                                <span>WhatsApp</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 11 & 12. UNIFIED RECOGNITION WALL & SOVEREIGN LEADERBOARD */}
                    {(currentView === 'recognition' || currentView === 'leaderboards') && (
                        <div className="space-y-6">
                            {/* Hero Header with Sub-tabs */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Award className="w-5 h-5 text-amber-500" />
                                        <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                                            Sovereign Recognition Wall & Leaderboards
                                        </h2>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        Celebrating peer mentorship, devotional fidelity, code audit mastery, and accredited community leadership.
                                    </p>
                                </div>

                                <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                                    <button
                                        onClick={() => setRecognitionSubTab('leaderboard')}
                                        className={`px-3.5 py-1.5 rounded-lg font-bold font-mono transition ${
                                            recognitionSubTab === 'leaderboard'
                                                ? 'bg-crimson text-white shadow'
                                                : 'text-slate-500 dark:text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        🏆 Sovereign Podium
                                    </button>
                                    <button
                                        onClick={() => setRecognitionSubTab('heroes')}
                                        className={`px-3.5 py-1.5 rounded-lg font-bold font-mono transition ${
                                            recognitionSubTab === 'heroes'
                                                ? 'bg-crimson text-white shadow'
                                                : 'text-slate-500 dark:text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        👑 Featured Heroes
                                    </button>
                                </div>
                            </div>

                            {/* TAB A: SOVEREIGN LEADERBOARD WITH PODIUM */}
                            {recognitionSubTab === 'leaderboard' && (
                                <div className="space-y-6">
                                    {/* TOP 3 PODIUM */}
                                    <div className="bg-gradient-to-b from-[#141B26] to-[#0E131C] p-6 rounded-2xl border border-amber-500/20 shadow-xl">
                                        <div className="text-center mb-6">
                                            <span className="px-3 py-1 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider">
                                                Weekly Sovereign Vanguard
                                            </span>
                                            <h3 className="text-lg font-bold font-serif text-white mt-2">
                                                Top Academic & Spiritual Contributors
                                            </h3>
                                        </div>

                                        {/* 3-Tier Podium Grid */}
                                        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto items-end pt-4">
                                            {/* 2nd Place: Silver */}
                                            <div className="flex flex-col items-center">
                                                <div className="relative mb-2">
                                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-700 ring-4 ring-slate-400/60 overflow-hidden flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80" alt="Esther Vance" className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="absolute -top-2 -right-1 text-xl">🥈</span>
                                                </div>
                                                <span className="text-xs font-bold text-white text-center truncate max-w-[100px]">Esther Vance</span>
                                                <span className="text-[10px] text-zinc-400">Peer Mentor</span>
                                                <span className="mt-1 font-mono text-xs font-extrabold text-slate-300">940 PTS</span>
                                                <div className="w-full h-24 bg-gradient-to-t from-slate-800 to-slate-700/70 border-t-2 border-slate-300 rounded-t-xl mt-3 flex items-center justify-center font-mono font-black text-slate-300 text-lg">
                                                    #2
                                                </div>
                                            </div>

                                            {/* 1st Place: Gold Crown */}
                                            <div className="flex flex-col items-center -mt-6">
                                                <div className="relative mb-2">
                                                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-amber-900/60 ring-4 ring-amber-400 overflow-hidden flex items-center justify-center text-white font-bold text-base shadow-xl shadow-amber-500/20">
                                                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80" alt="Dr. Alan Grant" className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl">👑</span>
                                                </div>
                                                <span className="text-sm font-bold text-amber-300 text-center truncate max-w-[130px]">Dr. Alan Grant</span>
                                                <span className="text-[10px] text-amber-200/80">Theology Scholar</span>
                                                <span className="mt-1 font-mono text-xs font-extrabold text-amber-400">1,240 PTS</span>
                                                <div className="w-full h-36 bg-gradient-to-t from-amber-950/80 to-amber-700/60 border-t-2 border-amber-300 rounded-t-xl mt-3 flex items-center justify-center font-mono font-black text-amber-200 text-2xl shadow-inner">
                                                    #1
                                                </div>
                                            </div>

                                            {/* 3rd Place: Bronze */}
                                            <div className="flex flex-col items-center">
                                                <div className="relative mb-2">
                                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-950 ring-4 ring-amber-700/70 overflow-hidden flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80" alt="Chris G." className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="absolute -top-2 -right-1 text-xl">🥉</span>
                                                </div>
                                                <span className="text-xs font-bold text-white text-center truncate max-w-[100px]">Chris G.</span>
                                                <span className="text-[10px] text-zinc-400">Contributor</span>
                                                <span className="mt-1 font-mono text-xs font-extrabold text-amber-600">820 PTS</span>
                                                <div className="w-full h-20 bg-gradient-to-t from-amber-950/90 to-amber-900/60 border-t-2 border-amber-700 rounded-t-xl mt-3 flex items-center justify-center font-mono font-black text-amber-600 text-lg">
                                                    #3
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Leaderboard Table with Filter Tabs */}
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-slate-700/70 overflow-hidden shadow">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                            <div className="font-serif font-bold text-slate-800 dark:text-white text-sm">
                                                Community Ranking Roster
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-mono">
                                                {(['global', 'cohort', 'fellowship'] as const).map(tab => (
                                                    <button
                                                        key={tab}
                                                        onClick={() => setLeaderboardFilter(tab)}
                                                        className={`px-3 py-1 rounded-lg font-bold capitalize transition ${
                                                            leaderboardFilter === tab
                                                                ? 'bg-crimson text-white'
                                                                : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-white border border-slate-200 dark:border-slate-700'
                                                        }`}
                                                    >
                                                        {tab === 'global' ? 'All Global Peers' : tab === 'cohort' ? 'My Cohort' : 'Fellowship'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-12 px-4 py-3 bg-slate-100/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 text-[10.5px] font-mono font-bold text-slate-400">
                                            <span className="col-span-2 sm:col-span-1">RANK</span>
                                            <span className="col-span-6 sm:col-span-7">PEER CONTRIBUTOR</span>
                                            <span className="col-span-2 text-center hidden sm:block">STATUS</span>
                                            <span className="col-span-4 sm:col-span-2 text-right">COGNIPOINTS</span>
                                        </div>

                                        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                            {[
                                                { id: 'p1', rank: '1 👑', name: 'Dr. Alan Grant', role: 'Theology & Ethics Scholar', pts: 1240, badge: 'Gold Laureate', isMe: false },
                                                { id: 'p2', rank: '2 🥈', name: 'Esther Vance', role: 'Active Peer Mentor', pts: 940, badge: 'Silver Scholar', isMe: false },
                                                { id: 'p3', rank: '3 🥉', name: 'Chris G.', role: 'Academic Contributor', pts: 820, badge: 'Bronze Mentor', isMe: false },
                                                { id: 'p4', rank: '4', name: 'Alex Turner (You)', role: 'Web Masterclass Lead', pts: userPoints, badge: 'Collaborator', isMe: true },
                                                { id: 'p5', rank: '5', name: 'Sarah Chen', role: 'GPU Labs Research Fellow', pts: 490, badge: 'Practitioner', isMe: false },
                                                { id: 'p6', rank: '6', name: 'Kwame Asante', role: 'Cloud Infrastructure Dev', pts: 440, badge: 'Contributor', isMe: false }
                                            ].map(r => (
                                                <div 
                                                    key={r.id} 
                                                    className={`grid grid-cols-12 px-4 py-3.5 items-center transition ${
                                                        r.isMe 
                                                            ? 'bg-rose-50/60 dark:bg-rose-950/20 border-l-4 border-crimson' 
                                                            : 'hover:bg-slate-50/50 dark:hover:bg-slate-900/20'
                                                    }`}
                                                >
                                                    <span className="col-span-2 sm:col-span-1 font-mono font-extrabold text-slate-600 dark:text-zinc-300">{r.rank}</span>
                                                    <div className="col-span-6 sm:col-span-7 flex items-center gap-2.5 min-w-0">
                                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold font-mono text-xs shrink-0">
                                                            {r.name.slice(0, 2)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-bold text-slate-800 dark:text-white truncate flex items-center gap-1.5">
                                                                <span>{r.name}</span>
                                                                {r.isMe && (
                                                                    <span className="px-1.5 py-0.2 bg-crimson text-white rounded text-[9px] font-mono">YOU</span>
                                                                )}
                                                            </div>
                                                            <p className="text-[10px] text-slate-400 truncate">{r.role}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-2 text-center hidden sm:block">
                                                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-zinc-300 rounded font-mono text-[9.5px]">
                                                            {r.badge}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-4 sm:col-span-2 text-right flex items-center justify-end gap-2">
                                                        <span className="font-mono font-extrabold text-rose-600 dark:text-rose-400">{r.pts} PTS</span>
                                                        {!r.isMe && (
                                                            <button
                                                                onClick={() => toggleGiveKudo(r.id, r.name)}
                                                                className={`p-1.5 rounded-lg border transition ${
                                                                    kudosGiven[r.id]
                                                                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                                                        : 'text-slate-400 hover:text-amber-400 border-transparent hover:border-amber-500/20'
                                                                }`}
                                                                title="Award Kudos (+10 XP)"
                                                            >
                                                                <Star size={13} className={kudosGiven[r.id] ? 'fill-current text-amber-400' : ''} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB B: FEATURED HEROES & MENTORS */}
                            {recognitionSubTab === 'heroes' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-slate-900 to-rose-950 p-6 rounded-2xl border-2 border-amber-400 text-white shadow-lg relative overflow-hidden select-none">
                                        <div className="absolute top-2 right-2 text-3xl opacity-20 font-serif font-black">HERO</div>
                                        <span className="px-2.5 py-0.5 bg-amber-400 text-black border border-amber-300 rounded font-black uppercase text-[9px] tracking-widest">
                                            FEATURED PEER HERO
                                        </span>
                                        <div className="mt-4 flex items-center space-x-3.5">
                                            <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-amber-400 overflow-hidden flex items-center justify-center font-bold text-base shrink-0">
                                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80" alt="Esther Vance" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="text-base font-extrabold font-serif text-amber-300">Esther Vance</h4>
                                                <p className="text-xs text-rose-200/80 mt-1 leading-relaxed">
                                                    Assisted over 12 students in resolving TypeScript recursive types and hosted consecutive Bible Study reflections.
                                                </p>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="px-2 py-0.5 bg-white/10 rounded font-mono text-[10px] text-amber-300 border border-white/10">
                                                        W3C Sovereign Peer Certificate #889
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-slate-900 to-blue-950 p-6 rounded-2xl border-2 border-cyan-400 text-white shadow-lg relative overflow-hidden select-none">
                                        <div className="absolute top-2 right-2 text-3xl opacity-20 font-serif font-black">LEADER</div>
                                        <span className="px-2.5 py-0.5 bg-cyan-400 text-black border border-cyan-300 rounded font-black uppercase text-[9px] tracking-widest">
                                            TOP MENTOR PLATINUM
                                        </span>
                                        <div className="mt-4 flex items-center space-x-3.5">
                                            <div className="w-14 h-14 rounded-full bg-slate-850 border-2 border-cyan-400 overflow-hidden flex items-center justify-center font-bold text-base shrink-0">
                                                <img src="https://i.pravatar.cc/150?u=janedoe" alt="Jane Doe" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="text-base font-extrabold font-serif text-cyan-300">Jane Doe</h4>
                                                <p className="text-xs text-sky-200/80 mt-1 leading-relaxed">
                                                    Consistently rated 4.9/5 stars for deep codebase audits, helping academic circles draft optimized system engines.
                                                </p>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="px-2 py-0.5 bg-white/10 rounded font-mono text-[10px] text-cyan-300 border border-white/10">
                                                        Senior Faculty Assessor
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 13. COGNISACRA AI GUIDE PROMPT SERVICE */}
                    {currentView === 'ai-guide' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-205 shadow overflow-hidden flex flex-col justify-between h-[450px]">
                            {/* AI Guide Header */}
                            <div className="bg-gradient-to-r from-red-950 to-slate-900 p-4 text-white flex items-center justify-between border-b border-rose-900/20">
                                <div className="flex items-center space-x-2">
                                    <div className="p-1.5 bg-crimson/20 rounded border border-rose-500/30">
                                        <Sparkles className="w-5 h-5 text-rose-400 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-bold text-sm">CogniSacra AI Spiritual & Tech Guide</h3>
                                        <p className="text-[10px] text-rose-200/80">Continuous theological and development alignment support</p>
                                    </div>
                                </div>
                            </div>

                            {/* Message log */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
                                {aiGuideLog.map((log, index) => (
                                    <div key={index} className={`flex ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl border shadow-sm leading-relaxed ${
                                            log.sender === 'user'
                                            ? 'bg-crimson text-white border-crimson'
                                            : 'bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 border-slate-200'
                                        }`}>
                                            <p>{log.text}</p>
                                            <span className="text-[9px] opacity-60 block mt-1 text-right font-mono">{log.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Prompt Input row */}
                            <div className="p-3.5 bg-slate-50 dark:bg-slate-905 border-t flex gap-2">
                                <label htmlFor="ai-guide-query" className="sr-only">Ask AI Guide</label>
                                <input
                                    id="ai-guide-query"
                                    type="text"
                                    value={aiGuideInput}
                                    onChange={(e) => setAiGuideInput(e.target.value)}
                                    placeholder="e.g. Recommend a study circle for React hooks, or ask faith questions..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') queryAiGuide();
                                    }}
                                    className="flex-1 px-3 py-2 bg-white border border-slate-205 rounded-xl text-xs text-slate-700"
                                />
                                <button
                                    onClick={queryAiGuide}
                                    className="px-4 py-2 bg-crimson hover:bg-red-800 text-white rounded-xl font-bold text-xs"
                                >
                                    Query AI
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 14. CONTRIBUTION ANALYTICS DASHBOARD */}
                    {currentView === 'analytics' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow">
                                <h2 className="text-xl font-bold font-serif">Contribution Analytics</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time charts tracking your spiritual collaboration and technical engagement scores with the community.</p>
                            </div>

                            {/* Metrics gauges */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-slate-205 shadow-sm text-center space-y-1">
                                    <div className="text-2xl font-black font-serif text-rose-700">86%</div>
                                    <div className="font-bold text-slate-700 dark:text-slate-200">Kingdom Impact Level</div>
                                    <p className="text-[10px] text-slate-400 leading-snug">Continuous metric tracking prayer supports, comments, and file download metrics.</p>
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-slate-205 shadow-sm text-center space-y-1">
                                    <div className="text-2xl font-black font-serif text-blue-700">14 Active</div>
                                    <div className="font-bold text-slate-700 dark:text-slate-200">Study Connections</div>
                                    <p className="text-[10px] text-slate-400 leading-snug">Calculated by mutual groups, mentors assigned, and study circle partnerships.</p>
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-slate-205 shadow-sm text-center space-y-1">
                                    <div className="text-2xl font-black font-serif text-amber-600">380 PTS</div>
                                    <div className="font-bold text-slate-700 dark:text-slate-200">Weekly Achievement Score</div>
                                    <p className="text-[10px] text-slate-400 leading-snug">Verified reward tokens. Spend points to schedule elite peer reviews.</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* REAL-TIME PEER DIRECT MESSENGER DRAWER */}
            {activeChatPeer && (
                <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-[#0E131C] border border-emerald-500/40 rounded-2xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
                    {/* Header */}
                    <div className="p-3.5 bg-[#141B26] border-b border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative shrink-0">
                                <img 
                                    src={activeChatPeer.avatarUrl} 
                                    alt={activeChatPeer.name} 
                                    className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/40"
                                />
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#141B26] rounded-full"></span>
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <h3 className="text-xs font-bold text-white truncate font-mono">{activeChatPeer.name}</h3>
                                    <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">LIVE</span>
                                </div>
                                <p className="text-[10px] text-zinc-400 font-mono truncate">{activeChatPeer.course}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPeerCallActive(!peerCallActive)}
                                className={`p-1.5 rounded-lg text-xs transition ${
                                    peerCallActive ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                                }`}
                                title={peerCallActive ? 'Leave Audio Call' : 'Start Audio Co-Study'}
                            >
                                <Radio size={14} className={peerCallActive ? 'animate-pulse' : ''} />
                            </button>
                            <button
                                onClick={() => setActiveChatPeer(null)}
                                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                                title="Close Messenger"
                            >
                                <X size={15} />
                            </button>
                        </div>
                    </div>

                    {/* Audio call banner if connected */}
                    {peerCallActive && (
                        <div className="px-3 py-2 bg-emerald-500/15 border-b border-emerald-500/30 flex items-center justify-between text-[11px] font-mono text-emerald-300">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                <span>Audio Co-Study Huddle Active (00:34)</span>
                            </div>
                            <button
                                onClick={() => setPeerCallActive(false)}
                                className="text-rose-400 hover:text-rose-300 font-bold"
                            >
                                End
                            </button>
                        </div>
                    )}

                    {/* Quick suggestion study prompts */}
                    <div className="px-3 py-2 bg-[#090C11] border-b border-zinc-800/60 overflow-x-auto flex gap-1.5 no-scrollbar">
                        {[
                            "Hey! Want to co-work?",
                            "How did you solve Lab 3?",
                            "Let's compare quiz answers!",
                            "Can you share study notes?"
                        ].map((prompt, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setChatInput(prompt);
                                }}
                                className="whitespace-nowrap px-2.5 py-1 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-[10px] font-mono transition shrink-0"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    {/* Messages stream */}
                    <div className="flex-1 p-3.5 overflow-y-auto space-y-3 font-mono text-xs bg-[#0A0E17]/60">
                        <div className="text-center my-1">
                            <span className="text-[10px] text-zinc-500 bg-zinc-900/80 px-2.5 py-0.5 rounded-full border border-zinc-800">
                                End-to-end encrypted peer channel
                            </span>
                        </div>

                        {(chatThreads[activeChatPeer.id] || [
                            { id: 'init', sender: 'them', text: `Hi Alex! Connected in real-time. I'm currently on ${activeChatPeer.lesson}. Feel free to ask anything!`, timestamp: 'Just now' }
                        ]).map((msg) => (
                            <div 
                                key={msg.id} 
                                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[82%] p-2.5 rounded-xl space-y-1 ${
                                    msg.sender === 'me'
                                        ? 'bg-emerald-500 text-black font-semibold rounded-br-none shadow-md shadow-emerald-500/10'
                                        : 'bg-[#182130] text-zinc-100 border border-zinc-800/80 rounded-bl-none'
                                }`}>
                                    <p className="text-xs leading-relaxed">{msg.text}</p>
                                    <div className={`flex items-center justify-end gap-1 text-[9px] ${msg.sender === 'me' ? 'text-black/70' : 'text-zinc-500'}`}>
                                        <span>{msg.timestamp}</span>
                                        {msg.sender === 'me' && <CheckCheck size={11} className="text-black" />}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Peer Typing Indicator */}
                        {isPeerTyping && (
                            <div className="flex justify-start items-center gap-2 text-zinc-400 text-[11px] font-mono">
                                <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                                <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                <span className="text-zinc-400">{activeChatPeer.name.split(' ')[0]} is typing...</span>
                            </div>
                        )}
                    </div>

                    {/* Chat Input Bar */}
                    <form onSubmit={handleSendPeerMessage} className="p-2.5 bg-[#141B26] border-t border-zinc-800 flex items-center gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder={`Message ${activeChatPeer.name.split(' ')[0]} in real-time...`}
                            className="flex-1 bg-[#0E131C] border border-zinc-700/60 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60"
                        />
                    </form>
                </div>
            )}

            {/* --- INTERACTIVE PEER REVIEW MODAL (PROPER WORKFLOW REDIRECT) --- */}
            {showPeerReviewModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0E131C] border border-zinc-700/80 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in duration-200">
                        {/* Modal Header */}
                        <div className="p-5 bg-gradient-to-r from-blue-950/80 to-[#141B26] border-b border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-cyan-400">
                                    <Award size={18} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold font-serif text-white">Accredited Peer Assessment Form</h3>
                                    <p className="text-[11px] font-mono text-zinc-400">Review homework & contribute to community trust ledger</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowPeerReviewModal(false)}
                                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5 space-y-4 text-xs font-mono">
                            {/* Selected Peer Submission Card */}
                            <div className="p-3.5 bg-[#141B26] rounded-xl border border-zinc-800 space-y-1.5">
                                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                                    <span className="text-cyan-400 font-bold">STUDENT SUBMISSION</span>
                                    <span>{selectedPeerSubmission.submissionDate}</span>
                                </div>
                                <div className="text-sm font-bold text-white font-serif">{selectedPeerSubmission.projectTitle}</div>
                                <div className="text-[11px] text-slate-300">Author: {selectedPeerSubmission.studentName} · {selectedPeerSubmission.course}</div>
                                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans pt-1">
                                    "{selectedPeerSubmission.contentSummary}"
                                </p>
                            </div>

                            {/* Scoring Rubric */}
                            <div className="space-y-3">
                                <div className="text-xs font-bold text-white font-serif flex items-center justify-between">
                                    <span>Peer Assessment Rubric</span>
                                    <span className="text-cyan-400 font-mono font-bold">
                                        Aggregate Score: {Math.round((peerRubricScore.methodology + peerRubricScore.clarity + peerRubricScore.ethics + peerRubricScore.codeQuality) / 4)}/100
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-2.5 bg-[#141B26] rounded-xl border border-zinc-800/80 space-y-1">
                                        <div className="flex justify-between text-[11px] text-zinc-300 font-semibold">
                                            <span>Methodology & Depth</span>
                                            <span className="text-cyan-400">{peerRubricScore.methodology}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="60"
                                            max="100"
                                            value={peerRubricScore.methodology}
                                            onChange={(e) => setPeerRubricScore({ ...peerRubricScore, methodology: Number(e.target.value) })}
                                            className="w-full accent-cyan-400"
                                        />
                                    </div>

                                    <div className="p-2.5 bg-[#141B26] rounded-xl border border-zinc-800/80 space-y-1">
                                        <div className="flex justify-between text-[11px] text-zinc-300 font-semibold">
                                            <span>Clarity & Documentation</span>
                                            <span className="text-cyan-400">{peerRubricScore.clarity}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="60"
                                            max="100"
                                            value={peerRubricScore.clarity}
                                            onChange={(e) => setPeerRubricScore({ ...peerRubricScore, clarity: Number(e.target.value) })}
                                            className="w-full accent-cyan-400"
                                        />
                                    </div>

                                    <div className="p-2.5 bg-[#141B26] rounded-xl border border-zinc-800/80 space-y-1">
                                        <div className="flex justify-between text-[11px] text-zinc-300 font-semibold">
                                            <span>Ethics & Kingdom Alignment</span>
                                            <span className="text-emerald-400">{peerRubricScore.ethics}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="60"
                                            max="100"
                                            value={peerRubricScore.ethics}
                                            onChange={(e) => setPeerRubricScore({ ...peerRubricScore, ethics: Number(e.target.value) })}
                                            className="w-full accent-emerald-400"
                                        />
                                    </div>

                                    <div className="p-2.5 bg-[#141B26] rounded-xl border border-zinc-800/80 space-y-1">
                                        <div className="flex justify-between text-[11px] text-zinc-300 font-semibold">
                                            <span>Code Architecture</span>
                                            <span className="text-cyan-400">{peerRubricScore.codeQuality}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="60"
                                            max="100"
                                            value={peerRubricScore.codeQuality}
                                            onChange={(e) => setPeerRubricScore({ ...peerRubricScore, codeQuality: Number(e.target.value) })}
                                            className="w-full accent-cyan-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Constructive Critique Note */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-300">Constructive Feedback & Recommendation</label>
                                <textarea
                                    rows={3}
                                    value={peerFeedbackComment}
                                    onChange={(e) => setPeerFeedbackComment(e.target.value)}
                                    placeholder="Provide actionable praise or architectural recommendations..."
                                    className="w-full p-3 bg-[#141B26] border border-zinc-800 rounded-xl text-zinc-200 text-xs focus:outline-none focus:border-cyan-500/60 resize-none font-sans"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-[#141B26] border-t border-zinc-800 flex items-center justify-between">
                            <span className="text-[11px] font-mono text-zinc-400">
                                Reward: <strong className="text-emerald-400">+20 XP</strong> & Trust Badge Progress
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowPeerReviewModal(false)}
                                    className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmPeerFeedback}
                                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-600/20 transition active:scale-95 flex items-center gap-1.5"
                                >
                                    <CheckCircle2 size={13} />
                                    <span>Submit Review & Redirect (+20 XP)</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- IN-APP WHATSAPP LAUNCH MODAL --- */}
            {openWhatsAppModal && whatsAppTarget && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0E131C] border border-zinc-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in duration-200">
                        {/* WhatsApp Header */}
                        <div className="p-5 bg-gradient-to-r from-[#0d522c] to-[#141B26] border-b border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-[#25D366] text-black">
                                    <WhatsAppIcon size={20} className="text-black" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold font-serif text-white">Academic WhatsApp Connect</h3>
                                    <p className="text-[10px] font-mono text-emerald-400">Verified Sovereign Learner Network</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setOpenWhatsAppModal(false)}
                                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* WhatsApp Body */}
                        <div className="p-5 space-y-4 text-xs font-mono">
                            <div className="flex items-center gap-3 p-3 bg-[#141B26] rounded-xl border border-zinc-800">
                                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-emerald-500/40 flex items-center justify-center font-bold text-sm text-white">
                                    {whatsAppTarget.name.slice(0, 2)}
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm font-serif">{whatsAppTarget.name}</div>
                                    <div className="text-[11px] text-zinc-400">{whatsAppTarget.title} · {whatsAppTarget.country}</div>
                                    <div className="text-[10px] text-emerald-400 font-mono mt-0.5">{whatsAppTarget.whatsappNumber}</div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-300">Customized Collaboration Intro</label>
                                <textarea
                                    rows={4}
                                    value={whatsAppCustomText}
                                    onChange={(e) => setWhatsAppCustomText(e.target.value)}
                                    className="w-full p-3 bg-[#141B26] border border-zinc-800 rounded-xl text-zinc-200 text-xs focus:outline-none focus:border-emerald-500/60 resize-none font-sans leading-relaxed"
                                />
                            </div>

                            {/* Quick Subject Chips */}
                            <div className="space-y-1.5">
                                <span className="text-[10px] text-zinc-400">Quick Academic Subjects:</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {[
                                        "Pair on Course Midterm Project",
                                        "Daily Devotional Study Check-in",
                                        "Discuss Sovereign Architecture Thesis"
                                    ].map((chip, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setWhatsAppCustomText(`Hi ${whatsAppTarget.name.split(' ')[0]}! I'd love to connect on CogniSacra regarding "${chip}". Let me know when you're free to collaborate!`);
                                            }}
                                            className="px-2 py-1 bg-[#141B26] hover:bg-zinc-800 text-[10px] font-mono text-zinc-300 hover:text-white rounded-lg border border-zinc-700/60 transition"
                                        >
                                            {chip}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp Footer */}
                        <div className="p-4 bg-[#141B26] border-t border-zinc-800 flex items-center justify-end gap-2">
                            <button
                                onClick={() => setOpenWhatsAppModal(false)}
                                className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleLaunchWhatsApp()}
                                className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition active:scale-95 flex items-center gap-2"
                            >
                                <WhatsAppIcon size={15} className="text-black shrink-0" />
                                <span>Launch WhatsApp Chat</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL 1: CHARTER NEW COMMUNITY GROUP (INSTITUTIONS & INSTRUCTORS ONLY) --- */}
            {isCreateGroupModalOpen && isInstructorOrInstitution && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0E131C] border border-zinc-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in duration-200 text-xs font-mono">
                        {/* Header */}
                        <div className="p-5 bg-gradient-to-r from-crimson/30 via-[#141B26] to-[#0E131C] border-b border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-crimson text-white">
                                    <Users size={18} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold font-serif text-white">Charter New Community Group</h3>
                                    <p className="text-[10px] text-emerald-400">Host: {userRole === 'institution' ? 'Accredited Institution' : 'Verified Instructor'}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCreateGroupModalOpen(false)}
                                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body Form */}
                        <form onSubmit={handleCreateCommunityGroup} className="p-5 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-300">Group Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    placeholder="e.g. Distributed Consensus & Cryptographic Ethics"
                                    className="w-full p-2.5 bg-[#141B26] border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500/60"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-zinc-300">Focus Category</label>
                                    <select
                                        value={newGroupCategory}
                                        onChange={(e: any) => setNewGroupCategory(e.target.value)}
                                        className="w-full p-2.5 bg-[#141B26] border border-zinc-800 rounded-xl text-emerald-400 text-xs focus:outline-none"
                                    >
                                        <option value="Academic Learning">Academic Learning</option>
                                        <option value="Faith & Spiritual Growth">Faith & Spiritual Growth</option>
                                        <option value="Professional Networks">Professional Networks</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-zinc-300">Privacy Setting</label>
                                    <select
                                        value={newGroupPrivacy}
                                        onChange={(e: any) => setNewGroupPrivacy(e.target.value)}
                                        className="w-full p-2.5 bg-[#141B26] border border-zinc-800 rounded-xl text-zinc-200 text-xs focus:outline-none"
                                    >
                                        <option value="Public">Public (Open to All Fellows)</option>
                                        <option value="Private & Accredited">Private & Accredited</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-300">Mission & Purpose</label>
                                <textarea
                                    rows={3}
                                    required
                                    value={newGroupDescription}
                                    onChange={(e) => setNewGroupDescription(e.target.value)}
                                    placeholder="Describe the scholarly mission, weekly meeting rhythms, and intended research deliverables..."
                                    className="w-full p-2.5 bg-[#141B26] border border-zinc-800 rounded-xl text-zinc-200 text-xs focus:outline-none focus:border-emerald-500/60 resize-none font-sans"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-300">Initial Canon Rule</label>
                                <input
                                    type="text"
                                    value={newGroupInitialRule}
                                    onChange={(e) => setNewGroupInitialRule(e.target.value)}
                                    placeholder="e.g. Zero plagiarism; cite all empirical formulations with W3C credentials."
                                    className="w-full p-2.5 bg-[#141B26] border border-zinc-800 rounded-xl text-zinc-300 text-xs focus:outline-none"
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateGroupModalOpen(false)}
                                    className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-crimson hover:bg-red-800 text-white font-extrabold text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center gap-2"
                                >
                                    <Plus size={14} />
                                    <span>Charter & Launch Group Live</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL 2: MANAGE SELECTED COMMUNITY GROUP (INSTITUTIONS & INSTRUCTORS ONLY) --- */}
            {isManageGroupModalOpen && selectedGroup && isInstructorOrInstitution && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0E131C] border border-zinc-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in duration-200 text-xs font-mono">
                        {/* Header */}
                        <div className="p-5 bg-gradient-to-r from-emerald-500/20 via-[#141B26] to-[#0E131C] border-b border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-emerald-500 text-black">
                                    <Settings size={18} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold font-serif text-white">Group Administration Console</h3>
                                    <p className="text-[10px] text-emerald-400 font-mono">{selectedGroup.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsManageGroupModalOpen(false)}
                                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar">
                            {/* Pinned Notice Section */}
                            <div className="p-3.5 bg-[#141B26] rounded-2xl border border-zinc-800 space-y-2">
                                <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                    <Pin size={13} />
                                    <span>Broadcast Pinned Notice</span>
                                </label>
                                <textarea
                                    rows={2}
                                    defaultValue={selectedGroup.pinnedAnnouncement || ''}
                                    onChange={(e) => setManageAnnouncement(e.target.value)}
                                    placeholder="Enter pinned notice to broadcast at the top of group feed..."
                                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white resize-none"
                                />
                                <button
                                    onClick={() => handlePinGroupAnnouncement(selectedGroup.id, manageAnnouncement || selectedGroup.pinnedAnnouncement || '')}
                                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] rounded-lg transition"
                                >
                                    Update Notice
                                </button>
                            </div>

                            {/* Add Canon Rule */}
                            <div className="p-3.5 bg-[#141B26] rounded-2xl border border-zinc-800 space-y-2">
                                <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                                    <Shield size={13} />
                                    <span>Enact Canon Rule</span>
                                </label>
                                <input
                                    type="text"
                                    value={newRuleTitle}
                                    onChange={(e) => setNewRuleTitle(e.target.value)}
                                    placeholder="Rule Title"
                                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                                />
                                <input
                                    type="text"
                                    value={newRuleDescription}
                                    onChange={(e) => setNewRuleDescription(e.target.value)}
                                    placeholder="Rule Explanation"
                                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                                />
                                <button
                                    onClick={() => handleAddGroupRule(selectedGroup.id, newRuleTitle, newRuleDescription)}
                                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[11px] rounded-lg transition"
                                >
                                    Add Rule
                                </button>
                            </div>

                            {/* Current Rules */}
                            <div className="space-y-2">
                                <span className="text-[11px] font-bold text-zinc-300">Active Group Rules:</span>
                                {selectedGroup.rules.map((r, i) => (
                                    <div key={r.id} className="p-2.5 bg-[#141B26] rounded-xl border border-zinc-800 flex items-center justify-between text-[11px]">
                                        <div>
                                            <span className="font-bold text-white">{i + 1}. {r.title}</span>
                                            <p className="text-zinc-400 text-[10px] mt-0.5">{r.description}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteGroupRule(selectedGroup.id, r.id)}
                                            className="text-rose-400 hover:text-rose-300 text-xs px-2"
                                            title="Delete rule"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-[#141B26] border-t border-zinc-800 flex items-center justify-end">
                            <button
                                onClick={() => setIsManageGroupModalOpen(false)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL 3: COMPREHENSIVE MENTOR PROFILE MODAL --- */}
            {viewingMentorProfile && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0E131C] border border-zinc-700/80 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in duration-200 text-xs">
                        {/* Header Banner */}
                        <div className="p-6 bg-gradient-to-r from-rose-950/40 via-[#141B26] to-[#0E131C] border-b border-zinc-800 flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <img 
                                    src={viewingMentorProfile.avatarUrl} 
                                    alt={viewingMentorProfile.name} 
                                    className="w-16 h-16 rounded-full object-cover border-2 border-crimson ring-4 ring-zinc-800 shadow-md"
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold font-serif text-white">{viewingMentorProfile.name}</h3>
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-[9.5px] border border-emerald-500/30 flex items-center gap-1 font-bold">
                                            <ShieldCheck size={11} /> Verified Principal
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-300 font-medium">{viewingMentorProfile.title}</p>
                                    <p className="text-[11px] text-zinc-400 font-mono">{viewingMentorProfile.organization}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewingMentorProfile(null)}
                                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar">
                            {/* Real-time Rating Summary & Live Star Rating Bar */}
                            <div className="p-4 rounded-2xl bg-[#141B26] border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl font-bold text-amber-400 flex items-center gap-1">
                                        <Star className="fill-current text-amber-400 w-6 h-6" />
                                        <span>{viewingMentorProfile.rating}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-zinc-400 uppercase block">Verified Ratings</span>
                                        <span className="text-xs text-white font-bold">{viewingMentorProfile.reviews} Peer Reviews</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-zinc-800">
                                    <span className="text-[10px] text-zinc-400 mr-1">Rate in Real Time:</span>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => rateMentor(viewingMentorProfile.id, star)}
                                            className="p-0.5 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                                            title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                        >
                                            <Star className={`w-4 h-4 ${Math.round(viewingMentorProfile.rating) >= star ? 'fill-current text-amber-400' : 'text-zinc-600'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Bio & Academic Philosophy */}
                            <div className="space-y-1.5">
                                <h4 className="text-xs font-bold font-serif text-white tracking-wide uppercase">Faculty Biography & Philosophy</h4>
                                <p className="text-xs text-zinc-300 leading-relaxed font-sans bg-[#141B26] p-3.5 rounded-xl border border-zinc-800/80">
                                    {viewingMentorProfile.bio || 'Principal academic advisor committed to ethical kingdom leadership, technical rigor, and sovereign research stewardship.'}
                                </p>
                            </div>

                            {/* Credentials Strip */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                                <div className="p-3 rounded-xl bg-[#141B26] border border-zinc-800 space-y-1">
                                    <span className="text-[10px] text-zinc-400 uppercase block font-bold">Academic Degrees</span>
                                    <span className="text-zinc-200">{viewingMentorProfile.education || 'Ph.D., Advanced Research Faculty'}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-[#141B26] border border-zinc-800 space-y-1">
                                    <span className="text-[10px] text-zinc-400 uppercase block font-bold">Sovereign W3C Credential</span>
                                    <span className="text-emerald-400 font-bold">{viewingMentorProfile.sovereignDID?.slice(0, 24)}...</span>
                                </div>
                            </div>

                            {/* Expertise Tracks */}
                            <div className="space-y-1.5">
                                <h4 className="text-xs font-bold font-serif text-white tracking-wide uppercase">Core Consultation Domains</h4>
                                <div className="flex flex-wrap gap-2">
                                    {viewingMentorProfile.expertise.map(skill => (
                                        <span key={skill} className="px-3 py-1 rounded-lg bg-rose-950/30 text-rose-300 border border-rose-800/30 text-xs font-mono font-semibold">
                                            {skill}
                                        </span>
                                    ))}
                                    {viewingMentorProfile.languages?.map(lang => (
                                        <span key={lang} className="px-3 py-1 rounded-lg bg-blue-950/30 text-blue-300 border border-blue-800/30 text-xs font-mono font-semibold">
                                            🗣️ {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Testimonials / Recent Reviews */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold font-serif text-white tracking-wide uppercase">Recent Fellow Feedback & Ratings</h4>
                                <div className="space-y-2">
                                    {(viewingMentorProfile.recentReviews && viewingMentorProfile.recentReviews.length > 0) ? (
                                        viewingMentorProfile.recentReviews.map(rev => (
                                            <div key={rev.id} className="p-3 rounded-xl bg-[#141B26] border border-zinc-800 flex items-start gap-3">
                                                <img src={rev.avatar} alt={rev.author} className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-white">{rev.author}</span>
                                                        <div className="flex items-center text-amber-400 text-[10px]">
                                                            {[...Array(rev.rating)].map((_, i) => (
                                                                <Star key={i} size={10} className="fill-current text-amber-400" />
                                                            ))}
                                                            <span className="text-zinc-500 ml-1.5 font-mono">{rev.date}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-zinc-300 font-sans leading-relaxed">{rev.comment}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-zinc-500 p-3 bg-[#141B26] rounded-xl text-center">No reviews yet. Be the first to rate this mentor!</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-[#141B26] border-t border-zinc-800 flex items-center justify-between gap-3">
                            <button
                                onClick={() => openShareModal({
                                    title: `Academic Mentor: ${viewingMentorProfile.name}`,
                                    url: `${window.location.origin}/community/mentor/${viewingMentorProfile.id}`,
                                    category: viewingMentorProfile.organization,
                                    summary: `${viewingMentorProfile.title} · ${viewingMentorProfile.expertise.join(', ')}`,
                                    type: 'Mentor Profile',
                                    originalId: viewingMentorProfile.id
                                })}
                                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                            >
                                <Share2 size={13} />
                                <span>Share Profile</span>
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setViewingMentorProfile(null)}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-zinc-300 rounded-xl font-bold text-xs transition cursor-pointer"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedMentor(viewingMentorProfile);
                                        setViewingMentorProfile(null);
                                    }}
                                    className="px-5 py-2 bg-crimson hover:bg-red-800 text-white rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer"
                                >
                                    <UserPlus size={13} />
                                    <span>Book Consultation Now</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL 4: KNOWLEDGE RESOURCE DOCUMENT PREVIEW MODAL --- */}
            {viewingResourcePreview && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0E131C] border border-zinc-700/80 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in duration-200 text-xs">
                        {/* Header */}
                        <div className="p-5 bg-gradient-to-r from-blue-950/40 via-[#141B26] to-[#0E131C] border-b border-zinc-800 flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-mono text-[9px] uppercase font-bold border border-blue-500/30">
                                        {viewingResourcePreview.category}
                                    </span>
                                    <span className="text-[10px] font-mono text-zinc-400">{viewingResourcePreview.fileSize || '1.8 MB'}</span>
                                    <span className="text-[10px] font-mono text-emerald-400">· W3C Verified</span>
                                </div>
                                <h3 className="text-base font-bold font-serif text-white">{viewingResourcePreview.title}</h3>
                                <p className="text-[11px] text-zinc-400">Author: {viewingResourcePreview.author} · Uploaded {viewingResourcePreview.uploadedAt || 'June 2026'}</p>
                            </div>
                            <button
                                onClick={() => setViewingResourcePreview(null)}
                                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Document Content View */}
                        <div className="p-5 max-h-[60vh] overflow-y-auto no-scrollbar space-y-3 font-mono text-xs">
                            <div className="p-4 rounded-xl bg-slate-900 border border-zinc-800 text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans text-xs select-text">
                                {viewingResourcePreview.fileContent || `# ${viewingResourcePreview.title}\n\nDocument preview loading...`}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-[#141B26] border-t border-zinc-800 flex items-center justify-between gap-3">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(viewingResourcePreview.fileContent || viewingResourcePreview.title);
                                    showToast('Document text copied to clipboard!');
                                }}
                                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-zinc-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                            >
                                <Copy size={13} />
                                <span>Copy Text</span>
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => openShareModal({
                                        title: viewingResourcePreview.title,
                                        url: `${window.location.origin}/community/knowledge/${viewingResourcePreview.id}`,
                                        category: viewingResourcePreview.category,
                                        summary: `Academic resource by ${viewingResourcePreview.author}`,
                                        type: 'Knowledge Resource',
                                        originalId: viewingResourcePreview.id
                                    })}
                                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-zinc-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Share2 size={13} />
                                    <span>Share</span>
                                </button>
                                <button
                                    onClick={() => {
                                        handleDownloadResource(viewingResourcePreview);
                                        setViewingResourcePreview(null);
                                    }}
                                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                                >
                                    <Download size={13} />
                                    <span>Download Document</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL 5: MULTI-CHANNEL SHARE MODAL (GMAIL, WHATSAPP, DIRECT MESSAGE) --- */}
            {shareModalData && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0E131C] border border-zinc-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in duration-200 text-xs">
                        {/* Header */}
                        <div className="p-5 bg-gradient-to-r from-emerald-500/20 via-[#141B26] to-[#0E131C] border-b border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-emerald-500 text-black">
                                    <Share2 size={18} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold font-serif text-white">Share Academic Breakthrough</h3>
                                    <p className="text-[10px] text-emerald-400 font-mono">Multi-Channel Dissemination Gateway</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShareModalData(null)}
                                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar">
                            {/* Resource Card Preview */}
                            <div className="p-3.5 rounded-2xl bg-[#141B26] border border-zinc-800 space-y-1.5">
                                <span className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">Item Being Shared</span>
                                <h4 className="text-sm font-bold font-serif text-white line-clamp-1">{shareModalData.title}</h4>
                                <p className="text-[11px] text-zinc-300 line-clamp-2 leading-relaxed">{shareModalData.summary}</p>
                            </div>

                            {/* 3 Channels: Gmail, WhatsApp, and Connected Peer DM */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-zinc-300 block">Select Sharing Destination</label>

                                {/* External Channels: Gmail & WhatsApp */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleShareGmail}
                                        className="p-3 rounded-xl bg-[#141B26] hover:bg-[#1A2332] border border-zinc-800 hover:border-red-500/50 transition flex items-center gap-2.5 cursor-pointer text-left group"
                                    >
                                        <div className="p-2 rounded-lg bg-red-500/10 text-red-400 group-hover:bg-red-500 group-hover:text-white transition">
                                            <Mail size={16} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-white">Gmail</div>
                                            <div className="text-[10px] text-zinc-400 font-mono">Compose email link</div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={handleShareWhatsApp}
                                        className="p-3 rounded-xl bg-[#141B26] hover:bg-[#1A2332] border border-zinc-800 hover:border-emerald-500/50 transition flex items-center gap-2.5 cursor-pointer text-left group"
                                    >
                                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition">
                                            <WhatsAppIcon size={16} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-white">WhatsApp</div>
                                            <div className="text-[10px] text-zinc-400 font-mono">Send via WhatsApp chat</div>
                                        </div>
                                    </button>
                                </div>

                                {/* Direct Message to Connected Platform Learner */}
                                <div className="p-4 rounded-2xl bg-[#141B26] border border-zinc-800 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MessageCircle size={15} className="text-blue-400" />
                                            <span className="text-xs font-bold text-white">Direct Message to Connected Peer</span>
                                        </div>
                                        <span className="text-[10px] text-emerald-400 font-mono font-bold">+10 XP</span>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10.5px] font-mono text-zinc-400 block">Choose Connected Learner:</label>
                                        <select
                                            value={selectedPeerToDm}
                                            onChange={(e) => setSelectedPeerToDm(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl bg-[#0E131C] border border-zinc-700 text-xs text-white focus:outline-none focus:border-blue-500"
                                        >
                                            {loungers.map(l => (
                                                <option key={l.id} value={l.id}>
                                                    {l.name} {l.isConnected ? '(Connected Peer)' : '(Peer in Network)'} — {l.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10.5px] font-mono text-zinc-400 block">Add Recommendation Note (Optional):</label>
                                        <input
                                            type="text"
                                            value={dmShareNote}
                                            onChange={(e) => setDmShareNote(e.target.value)}
                                            placeholder="e.g. Check out this proof — relevant to our final module!"
                                            className="w-full px-3 py-2 rounded-xl bg-[#0E131C] border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <button
                                        onClick={handleShareViaDm}
                                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                                    >
                                        <Send size={13} />
                                        <span>Send Direct Message to Peer</span>
                                    </button>
                                </div>

                                {/* Copy Link Fallback */}
                                <div className="pt-2">
                                    <label className="text-[10.5px] font-mono text-zinc-400 block mb-1">Direct Permalink:</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={shareModalData.url}
                                            className="flex-1 px-3 py-2 rounded-xl bg-[#141B26] border border-zinc-800 text-xs font-mono text-zinc-300 truncate"
                                        />
                                        <button
                                            onClick={handleCopyShareLink}
                                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition shrink-0 flex items-center gap-1.5 cursor-pointer"
                                        >
                                            {shareCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                                            <span>{shareCopied ? 'Copied!' : 'Copy Link'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-[#141B26] border-t border-zinc-800 flex items-center justify-end">
                            <button
                                onClick={() => setShareModalData(null)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityHubView;
