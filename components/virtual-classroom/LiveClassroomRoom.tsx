import React, { useState, useEffect, useRef } from 'react';
import { 
  Video as VideoIcon, VideoOff, Mic, MicOff, ScreenShare, Hand, 
  Smile, MessageSquare, Users, Settings, PhoneOff, Sparkles, Send, 
  Check, ArrowRight, Layers, Volume2, ShieldAlert, Award, Grid, PenTool, Eraser,
  Play, Pause, Plus, Trash, CheckSquare, BarChart3, HelpCircle, Download,
  Radio, Shield, Copy, AlertCircle, Share2, Users2, Circle, ArrowUpRight, CheckCircle2,
  Calendar, FileText, PlayCircle, Clock, FolderOpen, Search, PlusCircle, Sparkle, Lock, Unlock, UploadCloud,
  Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClassSession } from './types';
import { MeetingsSchedulerSection } from './MeetingsSchedulerSection';
import { RecordingsInsightsSection } from './RecordingsInsightsSection';
import { TranscriptsInsightsSection } from './TranscriptsInsightsSection';
import { MaterialsSubjectVaultSection } from './MaterialsSubjectVaultSection';
import { AttendanceGridSection } from './AttendanceGridSection';
import { sendMessageToAI } from '../../services/geminiService';

interface LiveClassroomRoomProps {
  session: ClassSession;
  onLeave: () => void;
  userRole?: 'learner' | 'instructor' | 'institution';
}

interface Poll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  isLocked: boolean;
  isPublished: boolean;
}

interface BreakoutRoom {
  id: string;
  name: string;
  assignedUsers: string[];
  status: 'Idle' | 'Active' | 'Closed';
}

export const LiveClassroomRoom: React.FC<LiveClassroomRoomProps> = ({ session, onLeave, userRole: parentRole = 'learner' }) => {
  const isInstructorRole = parentRole === 'instructor' || parentRole === 'institution';
  // Navigation & panels
  const [activeSidePanel, setActiveSidePanel] = useState<'chat' | 'participants' | 'polls' | 'breakout' | 'analytics' | 'lobby' | 'none'>('chat');
  const [isWhiteboardActive, setIsWhiteboardActive] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const userRole: 'instructor' | 'learner' = isInstructorRole ? 'instructor' : 'learner';

  // Microsoft Teams-Inspired layout states
  const [currentMeetingTab, setCurrentMeetingTab] = useState<'stage' | 'meetings' | 'recordings' | 'notes' | 'files' | 'attendance' | 'settings'>('stage');
  const [galleryParticipantsCount, setGalleryParticipantsCount] = useState<2 | 4 | 9 | 25 | 49>(9);
  const [activeLayoutView, setActiveLayoutView] = useState<'gallery' | 'speaker'>('gallery');
  
  // Schedule Form states
  const [newClassTitle, setNewClassTitle] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [newClassCourse, setNewClassCourse] = useState('Data Structure & Algorithms');
  const [newClassDate, setNewClassDate] = useState('2026-06-25');
  const [newClassTimeStart, setNewClassTimeStart] = useState('10:00');
  const [newClassTimeEnd, setNewClassTimeEnd] = useState('11:00');
  const [newClassTimezone, setNewClassTimezone] = useState('GMT+1 (Lagos)');
  const [newClassRecurring, setNewClassRecurring] = useState<'none' | 'weekly' | 'monthly'>('none');
  const [newClassInvitees, setNewClassInvitees] = useState('Emeka Obi, Sarah Mwangi, Alex Kiprop');
  const [newClassRecordingEnabled, setNewClassRecordingEnabled] = useState(true);
  const [newClassNotesEnabled, setNewClassNotesEnabled] = useState(true);
  const [newClassTranscriptEnabled, setNewClassTranscriptEnabled] = useState(true);

  // File system upload states
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: 'Trees_And_AVL_Rotations_SlideDeck.pptx', size: '14.2 MB', uploadDate: 'June 18, 2026', version: 'v1.1', type: 'ppt' },
    { name: 'Complexity_Anatomy_Guidebook.pdf', size: '4.8 MB', uploadDate: 'June 17, 2026', version: 'v1.0', type: 'pdf' },
    { name: 'Binary_Search_Rotator_Suite.zip', size: '2.5 MB', uploadDate: 'June 15, 2026', version: 'v2.0', type: 'zip' },
  ]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [fileUploadProg, setFileUploadProg] = useState(0);
  const [selectedPreviewFile, setSelectedPreviewFile] = useState<string | null>(null);

  // Live notes search / detail states
  const [selectedRecordingDetail, setSelectedRecordingDetail] = useState<string | null>(null);
  const [transcriptSearchTerm, setTranscriptSearchTerm] = useState('');
  const [liveTranscriptItems, setLiveTranscriptItems] = useState([
    { id: 't1', time: '00:01', speaker: 'Dr. Joseph Adebayo', text: 'Welcome everyone to advanced tree traversal optimizations and balanced tree mechanisms.' },
    { id: 't2', time: '00:32', speaker: 'Emeka Obi', text: 'Can you explain why balance factors of -2 and +1 trigger right-left double rotations instead of a simple single shift?' },
    { id: 't3', time: '01:15', speaker: 'Dr. Joseph Adebayo', text: 'Excellent query! An AVL tree needs double rotations when the parent node and the child node have opposing balance weight directions.' },
    { id: 't4', time: '02:04', speaker: 'Sarah Mwangi', text: 'Ah, so the left rotation balances the child subclass, and the right rotation settles the ancestor node!' },
    { id: 't5', time: '02:45', speaker: 'Dr. Joseph Adebayo', text: 'Precisely, Sarah! This achieves absolute balance factor margins and keeps search lookups consistently at log(n) height constraints.' },
    { id: 't6', time: '03:10', speaker: 'Alex Kiprop', text: 'Wow, dynamic memoization caches could save a dramatic amount of CPU cycles as well!' }
  ]);

  // Screen sharing choices
  const [screenShareSource, setScreenShareSource] = useState<'none' | 'entire' | 'application' | 'tab'>('none');
  const [showScreenShareModal, setShowScreenShareModal] = useState(false);

  // Recording states
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'paused'>('recording');
  const [recordingSeconds, setRecordingSeconds] = useState(252); // Starts after 4m 12s

  // Webcam stream
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Drawing Whiteboard canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawingColor, setDrawingColor] = useState('#635BFF');
  const [brushWidth, setBrushWidth] = useState(3);
  const [whiteboardTool, setWhiteboardTool] = useState<'pencil' | 'node' | 'arrow'>('pencil');
  const [isDrawing, setIsDrawing] = useState(false);
  const drawingPathRef = useRef<{ x: number; y: number } | null>(null);

  // Emojis floating array
  const [reactions, setReactions] = useState<{ id: string; emoji: string; x: number; y: number }[]>([]);

  // Discussion & Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: '1', author: 'Alex Kiprop', text: 'Good morning Dr. Adebayo! Dynamic arrays can expand natively, right?', date: '10:04 AM', idAI: false },
    { id: '2', author: 'Mariama Diallo', text: 'Yes, looking forward to complexity analysis!', date: '10:05 AM', idAI: false }
  ]);

  // Simulated live captions translation
  const captionsData = [
    { chunk: "We are initializing the platform design guidelines.", es: "Estamos inicializando las pautas de diseño de la plataforma.", sw: "Tunaanzisha miongozo ya muundo wa jukwaa." },
    { chunk: "Every component is bound to dynamic states.", es: "Cada componente está ligado a estados dinámicos.", sw: "Kila sehemu imefungwa kwa hali zenye nguvu." },
    { chunk: "Let's explore space optimization algorithms.", es: "Exploremos algoritmos de optimización de espacio.", sw: "Hebu tuchunguze algoriti za uboreshaji vya nafasi." },
    { chunk: "Inserting nodes in AVL trees takes O(log n) logarithmic time.", es: "Insertar nodos en árboles AVL toma tiempo logarítmico O(log n).", sw: "Kuingiza nodi kwenye miti ya AVL huchukua muda wa logi O(log n)." }
  ];
  const [currentCaptionIdx, setCurrentCaptionIdx] = useState(0);
  const [currentLang, setCurrentLang] = useState<'en' | 'es' | 'sw'>('en');

  // AI Live Notes State
  const [aiLiveNotes, setAiLiveNotes] = useState<string[]>([]);
  const [isNotesLoading, setIsNotesLoading] = useState(false);

  // State for active speakers (highlight borders with glowing visual rings)
  const [activeSpeaker, setActiveSpeaker] = useState<string>('Dr. Joseph Adebayo');

  // Participants list state
  const [participants, setParticipants] = useState([
    { id: 'p1', name: 'Dr. Joseph Adebayo', role: 'Instructor', isMicOn: true, isCamOn: true, handRaised: false, quality: 'Excellent', speakSeconds: 198, latency: '12ms' },
    { id: 'p2', name: 'Emeka Obi', role: 'Student', isMicOn: false, isCamOn: true, handRaised: false, quality: 'Excellent', speakSeconds: 45, latency: '34ms' },
    { id: 'p3', name: 'Sarah Mwangi', role: 'Student', isMicOn: true, isCamOn: false, handRaised: false, quality: 'Good', speakSeconds: 32, latency: '82ms' },
    { id: 'p4', name: 'Alex Kiprop', role: 'Student', isMicOn: true, isCamOn: true, handRaised: false, quality: 'Good', speakSeconds: 41, latency: '54ms' },
    { id: 'p5', name: 'Mariama Diallo', role: 'Student', isMicOn: false, isCamOn: false, handRaised: false, quality: 'Excellent', speakSeconds: 12, latency: '28ms' }
  ]);

  // Dynamic Lobby state
  const [waitingLobby, setWaitingLobby] = useState([
    { id: 'w1', name: 'Kamau Thuku', requestTime: '10:06 AM', reason: 'Late admission context' },
    { id: 'w2', name: 'Zahra Omar', requestTime: '10:08 AM', reason: 'Re-authenticating' }
  ]);

  // Dynamic Polls state
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: 'poll-1',
      question: 'What is the standard time complexity for AVL tree single-rotations?',
      options: [
        { id: 'opt-1', text: 'O(1) - Constant pointer changes', votes: 4 },
        { id: 'opt-2', text: 'O(log n) - Tree traversal height', votes: 1 },
        { id: 'opt-3', text: 'O(n) - Linear node shifting', votes: 0 }
      ],
      isLocked: false,
      isPublished: true
    },
    {
      id: 'poll-2',
      question: 'Which Hook optimizes expensive dynamic processing loops in React?',
      options: [
        { id: 'opt-4', text: 'useMemo', votes: 2 },
        { id: 'opt-5', text: 'useEffect', votes: 0 },
        { id: 'opt-6', text: 'useState', votes: 1 }
      ],
      isLocked: false,
      isPublished: false
    }
  ]);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '']);
  const [hasVotedFor, setHasVotedFor] = useState<{ [key: string]: string }>({});

  // Breakout Rooms State
  const [breakoutRooms, setBreakoutRooms] = useState<BreakoutRoom[]>([
    { id: 'br-1', name: 'Room Alpha (BST Traversals)', assignedUsers: ['Emeka Obi', 'Sarah Mwangi'], status: 'Idle' },
    { id: 'br-2', name: 'Room Beta (React Performance)', assignedUsers: ['Alex Kiprop', 'Mariama Diallo'], status: 'Idle' }
  ]);
  const [breakoutPhase, setBreakoutPhase] = useState<'idle' | 'assigning' | 'active'>('idle');
  const [breakoutTimer, setBreakoutTimer] = useState(600); // 10 minutes session
  const [breakoutRoomsCount, setBreakoutRoomsCount] = useState(2);

  // Security toggles
  const [isMeetingLocked, setIsMeetingLocked] = useState(false);
  const [isWaitingRoomEnabled, setIsWaitingRoomEnabled] = useState(true);
  const [showWatermark, setShowWatermark] = useState(false);

  // Invite modal notification trigger
  const [isInviteCopied, setIsInviteCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger floating on-screen notification toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Synchronized speaking timers & periodic state rotation
  useEffect(() => {
    // Clock duration ticker
    const timer = setInterval(() => {
      if (recordingStatus === 'recording') {
        setRecordingSeconds(prev => prev + 1);
      }
    }, 1000);

    // Caption cycle ticker
    const captionsTimer = setInterval(() => {
      setCurrentCaptionIdx((prev) => (prev + 1) % captionsData.length);
    }, 5500);

    // Active talker simulation ticker
    const activeTalkerTimer = setInterval(() => {
      const availableSpeakers = ['Dr. Joseph Adebayo', 'Alex Kiprop', 'Sarah Mwangi', 'Emeka Obi'];
      // Keep instructor as speaking 65% of the time, others rotate
      if (Math.random() > 0.4) {
        setActiveSpeaker('Dr. Joseph Adebayo');
        setParticipants(prev => prev.map(p => {
          if (p.name === 'Dr. Joseph Adebayo') {
            return { ...p, speakSeconds: p.speakSeconds + 2 };
          }
          return p;
        }));
      } else {
        const speaker = availableSpeakers[Math.floor(Math.random() * availableSpeakers.length)];
        setActiveSpeaker(speaker);
        setParticipants(prev => prev.map(p => {
          if (p.name === speaker) {
            return { ...p, speakSeconds: p.speakSeconds + 2 };
          }
          return p;
        }));
        // Simulate speech captions dynamically
        if (Math.random() > 0.7 && speaker !== 'Dr. Joseph Adebayo') {
          triggerToast(`${speaker} has unmuted to offer input.`);
        }
      }
    }, 2500);

    return () => {
      clearInterval(timer);
      clearInterval(captionsTimer);
      clearInterval(activeTalkerTimer);
    };
  }, [recordingStatus]);

  // Web camera activation effect
  useEffect(() => {
    if (isCameraOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn("Could not access real device webcam:", err);
          setIsCameraOn(false);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOn]);

  // Convert digital timer format helper
  const getFormattedTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSecs % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  // Spawn Emojis reactions handler
  const triggerEmoji = (emoji: string) => {
    const rx = {
      id: Math.random().toString(),
      emoji,
      x: 25 + Math.random() * 50, // Center stage placement percentage 
      y: 80
    };
    setReactions(prev => [...prev, rx]);
    setShowEmojiPanel(false);

    // Fade out after 2.5s
    setTimeout(() => {
      setReactions(prev => prev.filter(item => item.id !== rx.id));
    }, 2500);
  };

  // Whiteboard drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = drawingColor;
    ctx.lineWidth = brushWidth;
    ctx.lineCap = 'round';

    if (whiteboardTool === 'pencil') {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
      drawingPathRef.current = { x, y };
    } else if (whiteboardTool === 'node') {
      // Draw standard B-Tree Node automatically
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = drawingColor;
      ctx.stroke();

      // Add a random node number inside
      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(Math.floor(Math.random() * 89) + 10), x, y);
    } else if (whiteboardTool === 'arrow') {
      // Draw directed arrow linkages automatically
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 50, y + 50);
      ctx.stroke();

      // Draw arrow head
      ctx.beginPath();
      ctx.moveTo(x + 50, y + 50);
      ctx.lineTo(x + 40, y + 50);
      ctx.lineTo(x + 50, y + 40);
      ctx.closePath();
      ctx.fillStyle = drawingColor;
      ctx.fill();
    }
  };

  const drawLine = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || whiteboardTool !== 'pencil') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    drawingPathRef.current = { x, y };
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    drawingPathRef.current = null;
  };

  const clearWhiteboard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    triggerToast("Whiteboard dry erased.");
  };

  // Mock screen sharing trigger
  const triggerScreenSharing = (source: 'entire' | 'application' | 'tab') => {
    setScreenShareSource(source);
    setIsScreenSharing(true);
    setShowScreenShareModal(false);
    triggerToast(`Screen sharing launched: ${source} view.`);
  };

  const stopScreenSharing = () => {
    setIsScreenSharing(false);
    setScreenShareSource('none');
    triggerToast("Screen sharing halted.");
  };

  // Post chat messaging
  const submitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput) return;

    const authorLabel = userRole === 'instructor' ? 'Dr. Joseph Adebayo (You)' : 'You (Learner)';
    const userMsg = {
      id: Math.random().toString(),
      author: authorLabel,
      text: chatInput,
      date: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      idAI: false
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Trigger AI live notes trigger if specific command is detected
    if (chatInput.toLowerCase().includes('generate notes') || chatInput.toLowerCase().includes('summarize')) {
      generateLiveNotesWithAI();
    }
  };

  // Ask Gemini to summarize Chat or Lecture Notes
  const generateLiveNotesWithAI = async () => {
    setIsNotesLoading(true);
    triggerToast("Gemini AI digesting lesson context...");
    try {
      const chatTranscripts = chatMessages.map(m => `${m.author}: "${m.text}"`).join('\n');
      const prompt = `Based on a live lecture titled "${session.title}" (Course: ${session.courseName}) and the following chat query logs:\n${chatTranscripts}\nProvide 3 highly concise bullet points summarizing key action items and critical discussion topic decisions. Prefix with an elegant greeting.`;
      
      const stream = await sendMessageToAI(prompt);
      let gatheredText = '';
      for await (const chunk of stream) {
        gatheredText += chunk.text;
      }

      // Convert response into structured list array
      const list = gatheredText.split('\n').filter(line => line.trim().length > 0);
      setAiLiveNotes(list.length > 0 ? list : [
        "Dynamic Array boundaries are allocated natively in linear O(n) memory grids.",
        "BST height balancing should prioritize AVL right-left pointer rotations.",
        "Action: Submit BALANCED tree nodes exercise by Friday."
      ]);
      triggerToast("AI outlined minutes generated successfully!");
    } catch (e) {
      console.error(e);
      setAiLiveNotes([
        "Double rotations occur when parent & child balance factors have opposing signs.",
        "Constant pointer adjustments utilize O(1) time, ensuring zero dynamic indexing overhead.",
        "Action item: CompleteBST balancing algorithms before weekend review."
      ]);
    } finally {
      setIsNotesLoading(false);
    }
  };

  // Moderate Participants
  const toggleParticipantMic = (id: string) => {
    setParticipants(prev => prev.map(p => {
      if (p.id === id) {
        const nextState = !p.isMicOn;
        triggerToast(`${p.name} mic toggled ${nextState ? 'ON' : 'MUTED'} by moderator.`);
        return { ...p, isMicOn: nextState };
      }
      return p;
    }));
  };

  const toggleParticipantCam = (id: string) => {
    setParticipants(prev => prev.map(p => {
      if (p.id === id) {
        const nextState = !p.isCamOn;
        triggerToast(`${p.name} camera forced ${nextState ? 'ACTIVE' : 'OFF'} by moderator.`);
        return { ...p, isCamOn: nextState };
      }
      return p;
    }));
  };

  const kickParticipant = (id: string, name: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
    triggerToast(`${name} was expelled from the virtual session.`);
  };

  const muteAllParticipants = () => {
    setParticipants(prev => prev.map(p => {
      if (p.role === 'Student') return { ...p, isMicOn: false };
      return p;
    }));
    triggerToast("Moderator issued global MUTE ALL Command.");
  };

  // Manage Waiting lobby queue admittances
  const admitLobbyUser = (id: string, name: string) => {
    setWaitingLobby(prev => prev.filter(w => w.id !== id));
    const newStudent = {
      id: Math.random().toString(),
      name,
      role: 'Student',
      isMicOn: false,
      isCamOn: true,
      handRaised: false,
      quality: 'Excellent',
      speakSeconds: 0,
      latency: '41ms'
    };
    setParticipants(prev => [...prev, newStudent]);
    triggerToast(`${name} admitted into the classroom meeting.`);
  };

  const denyLobbyUser = (id: string, name: string) => {
    setWaitingLobby(prev => prev.filter(w => w.id !== id));
    triggerToast(`${name} was denied admission.`);
  };

  // Manage Poll answers submitting
  const createPoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPollQuestion || newPollOptions.some(opt => !opt.trim())) {
      triggerToast("Please provide the question and at least 2 options.");
      return;
    }

    const newPoll: Poll = {
      id: `poll-${Date.now()}`,
      question: newPollQuestion,
      options: newPollOptions.map((v, i) => ({ id: `opt-${Date.now()}-${i}`, text: v, votes: 0 })),
      isLocked: false,
      isPublished: false
    };

    setPolls(prev => [...prev, newPoll]);
    setNewPollQuestion('');
    setNewPollOptions(['', '']);
    triggerToast("New interactive classroom Poll drafted.");
  };

  const publishPoll = (id: string) => {
    setPolls(prev => prev.map(p => {
      if (p.id === id) {
        triggerToast("Poll launched! Students prompted to submit choices.");
        return { ...p, isPublished: true };
      }
      return p;
    }));
  };

  const voteOnPoll = (pollId: string, optionId: string) => {
    if (hasVotedFor[pollId]) {
      triggerToast("You have already voted on this specific question!");
      return;
    }

    setPolls(prev => prev.map(p => {
      if (p.id === pollId) {
        return {
          ...p,
          options: p.options.map(opt => {
            if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
            return opt;
          })
        };
      }
      return p;
    }));

    setHasVotedFor(prev => ({ ...prev, [pollId]: optionId }));
    triggerToast("Your vote was cast successfully.");

    // Simulate extra dynamic student responses to keep the environment interactive!
    setTimeout(() => {
      setPolls(pList => pList.map(p => {
        if (p.id === pollId) {
          const randomIndex = Math.floor(Math.random() * p.options.length);
          return {
            ...p,
            options: p.options.map((opt, idx) => {
              if (idx === randomIndex) return { ...opt, votes: opt.votes + 2 };
              return opt;
            })
          };
        }
        return p;
      }));
      triggerToast("Dynamic responses incoming from peer student audience...");
    }, 1500);
  };

  // Manage Breakout rooms split workflows
  const initiateBreakouts = () => {
    setBreakoutPhase('assigning');
    triggerToast(`Dividing peer audience into ${breakoutRoomsCount} breakout rooms...`);
    
    setTimeout(() => {
      setBreakoutPhase('active');
      setBreakoutTimer(600); // Reset timer to 10m
      setBreakoutRooms(prev => prev.map(rm => ({ ...rm, status: 'Active' })));
      triggerToast("Breakout rooms are live! Virtual groups active.");
    }, 2800);
  };

  const endBreakouts = () => {
    setBreakoutPhase('idle');
    setBreakoutRooms(prev => prev.map(rm => ({ ...rm, status: 'Closed' })));
    triggerToast("Breakout sessions terminated. Gathering students back.");
  };

  // Attendance spreadsheet copy triggers
  const downloadAttendanceCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Role,Status,Speak Seconds,Latency\n"
      + participants.map(p => `"${p.name}","${p.role}","Present",${p.speakSeconds},"${p.latency}"`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_report_${session.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Attendance report spreadsheet generated for download.");
  };

  // Copy invitation text
  const copyInvitePayload = () => {
    const inviteText = `CogniSacra Virtual Class Link\nClass: ${session.title}\nCourse: ${session.courseName}\nInstructor: ${session.instructor}\nURL: https://ai.studio/build/virtual-classroom-channel/${session.id}\nPasscode: COGNI-SACRA-2026`;
    navigator.clipboard.writeText(inviteText);
    setIsInviteCopied(true);
    triggerToast("Invite details copied to system clipboard.");
    setTimeout(() => setIsInviteCopied(false), 2500);
  };

  return (
    <div id="live-classroom-room" className="fixed inset-0 z-50 bg-slate-950 flex flex-col h-screen text-slate-100 font-sans select-none overflow-hidden">
      
      {/* Dynamic Toast Alerts on Stage */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 bg-indigo-600 font-semibold border border-indigo-400 text-white text-xs px-4 py-2.5 rounded-xl shadow-glass flex items-center gap-2"
          >
            <Radio size={14} className="animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Sharing Source Modal Selection */}
      <AnimatePresence>
        {showScreenShareModal && (
          <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl"
            >
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <ScreenShare className="text-indigo-400" size={18} /> Choice of Screen Sharing Mode
              </h2>
              <div className="grid grid-cols-1 gap-3 mb-6">
                <button
                  onClick={() => triggerScreenSharing('entire')}
                  className="flex items-center justify-between p-3.5 bg-slate-800 hover:bg-slate-700/80 rounded-xl text-left transition border border-slate-700/50"
                >
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Entire Desktop Sandbox</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Stream your continuous system views and tabs.</p>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-500" />
                </button>
                <button
                  onClick={() => triggerScreenSharing('application')}
                  className="flex items-center justify-between p-3.5 bg-slate-800 hover:bg-slate-700/80 rounded-xl text-left transition border border-slate-700/50"
                >
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Active Application Canvas</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Limit sharing to terminal codes or React window compilers.</p>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-500" />
                </button>
                <button
                  onClick={() => triggerScreenSharing('tab')}
                  className="flex items-center justify-between p-3.5 bg-slate-800 hover:bg-slate-700/80 rounded-xl text-left transition border border-slate-700/50"
                >
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Vite Browser Tab</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Share audio loops & clean static document layouts.</p>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-500" />
                </button>
              </div>

              <div className="flex justify-end gap-2 text-xs">
                <button
                  onClick={() => setShowScreenShareModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      
      {/* 1. Header Toolbar */}
      {/* 1. Header Toolbar */}
      <div className="px-5 h-16 flex items-center justify-between shadow-sm z-30 bg-[#0E131C] border-b border-zinc-800 text-white select-none">
        
        {/* Left session indicators */}
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold truncate tracking-wide max-w-sm text-white">{session.title}</h1>
              <span className={`font-extrabold uppercase text-[9px] px-2 py-0.5 rounded border ${
                userRole === 'instructor' 
                  ? 'bg-crimson/15 text-rose-300 border-rose-500/30' 
                  : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              }`}>
                {userRole === 'instructor' ? 'Instructor Broadcast Stage' : 'Accredited Learner Feed'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono uppercase">{session.courseName}</p>
          </div>
        </div>

        {/* Center Role Badge (Strict Role Display - No simulation toggle) */}
        <div className="hidden sm:flex items-center gap-2">
          {userRole === 'instructor' ? (
            <div className="px-3 py-1 rounded-xl bg-crimson/15 border border-rose-500/30 text-rose-300 font-mono text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
              <Radio size={12} className="text-rose-400 animate-pulse" />
              <span>FACULTY BROADCAST CONSOLE · LIVE</span>
            </div>
          ) : (
            <div className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
              <Wifi size={12} className="text-emerald-400" />
              <span>LEARNER EXPERIENCE · 1080P SYNC</span>
            </div>
          )}
        </div>

        {/* Navigation Info actions */}
        <div className="flex items-center gap-3">
          {/* Quick Stats */}
          <div className="hidden md:flex items-center gap-3 text-[11px] font-mono">
            <span className="px-2.5 py-1 rounded-lg border flex items-center gap-1.5 font-bold bg-[#141B26] text-zinc-300 border-zinc-700/60">
              <Clock size={12} className="text-amber-400 animate-pulse" />
              {getFormattedTime(recordingSeconds)}
            </span>
            <span className="px-2.5 py-1 rounded-lg border font-bold uppercase tracking-wide flex items-center gap-1.5 bg-[#141B26] text-red-400 border-zinc-700/60">
              <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-ping"></span>
              REC {recordingStatus.toUpperCase()}
            </span>
          </div>

          <button
            id="btn-leave-classroom"
            onClick={onLeave}
            className="flex items-center gap-1.5 px-4 h-9 text-xs font-extrabold bg-red-600 hover:bg-red-700 rounded-xl transition text-white shadow shadow-red-500/20 active:scale-95"
          >
            <PhoneOff size={13} />
            <span>{userRole === 'instructor' ? 'End Broadcast' : 'Leave Class'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Space Content Grid */}
      <div className="flex-1 flex overflow-hidden relative bg-[#0B0E14]">
        
        {/* LEFTSIDE BAR (Role-Exclusive Classroom Navigation) */}
        <div id="teams-meeting-sidebar" className="w-14 md:w-56 bg-[#0E131C] border-r border-zinc-800 text-zinc-300 flex flex-col shrink-0 z-20 select-none">
          <div className="p-3.5 border-b border-zinc-800 hidden md:flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold tracking-wider text-rose-400">
            <Layers size={13} />
            <span>{userRole === 'instructor' ? 'Instructor Hub' : 'Learner Hub'}</span>
          </div>

          <div className="flex-grow p-2 space-y-1 overflow-y-auto no-scrollbar">
            {(userRole === 'instructor' 
              ? [
                  { id: 'stage', label: 'Monitor Stage Feed', icon: <VideoIcon size={14} /> },
                  { id: 'meetings', label: 'Calendar Scheduler', icon: <Calendar size={14} /> },
                  { id: 'recordings', label: 'Archives & AI Minutes', icon: <PlayCircle size={14} /> },
                  { id: 'notes', label: 'Lessons Transcript', icon: <FileText size={14} /> },
                  { id: 'files', label: 'Subject Document Vault', icon: <FolderOpen size={14} /> },
                  { id: 'attendance', label: 'Attendance Ledger', icon: <Users2 size={14} /> }
                ]
              : [
                  { id: 'stage', label: 'Live Lecture Stage', icon: <VideoIcon size={14} /> },
                  { id: 'notes', label: 'Live Transcript & Notes', icon: <FileText size={14} /> },
                  { id: 'recordings', label: 'Classroom Archives', icon: <PlayCircle size={14} /> },
                  { id: 'files', label: 'Subject Document Vault', icon: <FolderOpen size={14} /> }
                ]
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentMeetingTab(tab.id as any);
                  if (tab.id !== 'stage') {
                    setIsWhiteboardActive(false);
                  }
                  triggerToast(`Workspace: ${tab.label}`);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl transition ${
                  currentMeetingTab === tab.id
                    ? 'bg-crimson text-white shadow shadow-crimson/20 border border-rose-500/30'
                    : 'hover:bg-[#141B26] text-zinc-400 hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="hidden md:inline truncate">{tab.label}</span>
              </button>
            ))}

            <div className="pt-2 border-t border-zinc-800"></div>

            <button
              onClick={() => {
                setIsWhiteboardActive(!isWhiteboardActive);
                setCurrentMeetingTab('stage');
                triggerToast(isWhiteboardActive ? "Closed drawing canvas" : "Interactive drawing Whiteboard enabled.");
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl transition ${
                isWhiteboardActive && currentMeetingTab === 'stage'
                  ? 'bg-amber-600/25 text-amber-400 border border-amber-500/30' 
                  : 'hover:bg-[#141B26] text-zinc-400 hover:text-white'
              }`}
            >
              <PenTool size={14} />
              <span className="hidden md:inline truncate font-mono">Whiteboard Canvas</span>
            </button>

            <button
              onClick={() => {
                setActiveSidePanel(activeSidePanel === 'chat' ? 'none' : 'chat');
                triggerToast("Gemini Instructor assistance active.");
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-black rounded-xl transition ${
                userRole === 'instructor' ? 'hover:bg-rose-50 text-slate-600 hover:text-slate-900' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              } ${
                activeSidePanel === 'chat' 
                  ? (userRole === 'instructor' ? 'bg-crimson/15 text-crimson font-heavy border border-crimson/25' : 'bg-[#505290]/30 text-white font-heavy border border-[#6264A7]/20') 
                  : ''
              }`}
            >
              <Sparkles className="text-amber-400 animate-pulse" size={14} />
              <span className="hidden md:inline truncate">Professor AI</span>
            </button>

            <button
              onClick={() => {
                setActiveSidePanel(activeSidePanel === 'polls' ? 'none' : 'polls');
                triggerToast("Polls launcher panel active.");
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-black rounded-xl transition ${
                userRole === 'instructor' ? 'hover:bg-rose-50 text-slate-600 hover:text-slate-900' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              } ${
                activeSidePanel === 'polls' 
                  ? (userRole === 'instructor' ? 'bg-crimson/15 text-crimson font-heavy border border-crimson/25' : 'bg-[#505290]/30 text-white font-heavy border border-[#6264A7]/20') 
                  : ''
              }`}
            >
              <CheckSquare size={14} />
              <span className="hidden md:inline truncate">Launch Poll</span>
            </button>

            <button
              onClick={() => {
                setActiveSidePanel(activeSidePanel === 'breakout' ? 'none' : 'breakout');
                triggerToast("Breakout rooms console active.");
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-black rounded-xl transition ${
                userRole === 'instructor' ? 'hover:bg-rose-50 text-slate-600 hover:text-slate-900' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              } ${
                activeSidePanel === 'breakout' 
                  ? (userRole === 'instructor' ? 'bg-crimson/15 text-crimson font-heavy border border-crimson/25' : 'bg-[#505290]/30 text-white font-heavy border border-[#6264A7]/20') 
                  : ''
              }`}
            >
              <Layers size={14} />
              <span className="hidden md:inline truncate">Breakout Laboratories</span>
            </button>
          </div>

          <div className={`p-3 border-t hidden md:block text-center text-[9px] font-mono font-bold uppercase tracking-widest ${userRole === 'instructor' ? 'border-slate-100 text-slate-400' : 'border-slate-800 text-slate-600'}`}>
            Teams v2.50
          </div>
        </div>

        {/* Meeting Stage Area */}
        <div className={`flex-1 flex flex-col p-4 overflow-y-auto relative no-scrollbar ${userRole === 'instructor' ? 'bg-slate-100' : 'bg-[#1F1F1F]'}`}>
          
          {/* RENDER DETAILED WORKSHEETS BASED ON SIDEBAR SELECTION */}
          {currentMeetingTab === 'meetings' && (
            <MeetingsSchedulerSection onScheduleSuccess={(msg) => triggerToast(msg)} />
          )}

          {currentMeetingTab === 'recordings' && (
            <RecordingsInsightsSection onToastSuccess={(msg) => triggerToast(msg)} />
          )}

          {currentMeetingTab === 'notes' && (
            <TranscriptsInsightsSection onToastSuccess={(msg) => triggerToast(msg)} />
          )}

          {currentMeetingTab === 'files' && (
            <MaterialsSubjectVaultSection onToastSuccess={(msg) => triggerToast(msg)} />
          )}

          {currentMeetingTab === 'attendance' && (
            <AttendanceGridSection onToastSuccess={(msg) => triggerToast(msg)} />
          )}

          {currentMeetingTab === 'stage' && (
            <>
          
          {/* Top layout line: Live Scrolling Capions & Announcements */}
          <div className="bg-slate-900/60 backdrop-blur border border-slate-800/80 py-2.5 px-4 rounded-2xl mb-4 max-w-2xl mx-auto flex items-center justify-between gap-4 w-full text-slate-100 shadow-md">
            <p className="text-[11px] text-indigo-100 truncate flex-1 font-semibold">
              <span className="font-extrabold uppercase mr-2 text-[10px] text-amber-400 tracking-wider">LIVE TRANSLATION:</span>
              "{currentLang === 'en' ? captionsData[currentCaptionIdx].chunk : currentLang === 'es' ? captionsData[currentCaptionIdx].es : captionsData[currentCaptionIdx].sw}"
            </p>
            <div className="flex gap-1">
              {(['en', 'es', 'sw'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setCurrentLang(l);
                    triggerToast(`Captions set to ${l.toUpperCase()}`);
                  }}
                  className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md transition ${
                    currentLang === l ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* If breakout state is active on stage */}
          {breakoutPhase === 'active' && (
            <div className="bg-slate-900 border border-slate-700 text-slate-200 py-2 px-4 rounded-xl mb-4 text-center max-w-xl mx-auto flex items-center justify-between w-full">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1 animate-pulse">
                <Layers size={13} /> BREAKOUT ROOM ACTIVE
              </span>
              <span className="text-xs font-mono font-bold">Time left: {Math.floor(breakoutTimer / 60)}m {breakoutTimer % 60}s</span>
              {userRole === 'instructor' && (
                <button 
                  onClick={endBreakouts} 
                  className="text-[10px] bg-red-600 hover:bg-red-700 text-white font-extrabold px-2 py-1 rounded"
                >
                  End Session
                </button>
              )}
            </div>
          )}

          {/* Interactive Screen Grid or Whiteboard */}
          {isWhiteboardActive ? (
            <div className="flex-1 flex flex-col rounded-2xl bg-white border border-slate-200/80 p-4 shadow-xl text-slate-800 min-h-[350px]">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 mb-3 text-slate-900">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-indigo-600">
                  <PenTool size={14} /> Shared Digital Lecturing Whiteboard
                </span>
                
                {/* Canvas Drawing tools bar */}
                <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                  
                  {/* Tool Selection */}
                  <div className="flex border-r border-slate-200 pr-2 gap-1">
                    <button
                      onClick={() => {
                        setWhiteboardTool('pencil');
                        triggerToast("Free-hand pencil mode.");
                      }}
                      className={`p-1.5 rounded text-xs flex items-center gap-1 font-bold transition ${
                        whiteboardTool === 'pencil' ? 'bg-slate-900 text-white' : 'hover:bg-slate-200 text-slate-600'
                      }`}
                      title="Freehand Pencil"
                    >
                      <PenTool size={13} /> Pencil
                    </button>
                    <button
                      onClick={() => {
                        setWhiteboardTool('node');
                        triggerToast("B-Tree helper node stamp activated! Click the canvas to auto-render balanced nodes.");
                      }}
                      className={`p-1.5 rounded text-xs flex items-center gap-1 font-bold transition ${
                        whiteboardTool === 'node' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200 text-slate-600'
                      }`}
                      title="Stamp Tree Node"
                    >
                      <Circle size={13} /> Stamp Node
                    </button>
                    <button
                      onClick={() => {
                        setWhiteboardTool('arrow');
                        triggerToast("Linkage pointer stamp activated! Click to draw pointer linkages.");
                      }}
                      className={`p-1.5 rounded text-xs flex items-center gap-1 font-bold transition ${
                        whiteboardTool === 'arrow' ? 'bg-slate-900 text-white' : 'hover:bg-slate-200 text-slate-600'
                      }`}
                      title="Stamp Pointer Line"
                    >
                      <ArrowUpRight size={13} /> Draw Pointer
                    </button>
                  </div>

                  {/* Color Selectors */}
                  <div className="flex gap-1 pb-[1px]">
                    {['#635BFF', '#16C784', '#FF5B5B', '#FFD200', '#000000'].map((col) => (
                      <button
                        key={col}
                        onClick={() => setDrawingColor(col)}
                        className="w-5 h-5 rounded-full border border-slate-200 transition shrink-0"
                        style={{ backgroundColor: col, transform: drawingColor === col ? 'scale(1.15)' : 'none' }}
                      />
                    ))}
                  </div>

                  {/* Size togglers */}
                  <div className="flex bg-slate-200/50 rounded p-[2px]">
                    {([1, 3, 6] as const).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setBrushWidth(sz)}
                        className={`px-2 py-0.5 text-[9px] font-bold rounded ${brushWidth === sz ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                      >
                        {sz === 1 ? 'Thin' : sz === 3 ? 'Medium' : 'Thick'}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={clearWhiteboard}
                    className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-[10px] font-extrabold border border-red-200"
                  >
                    <Eraser size={12} /> Dry Erase Screen
                  </button>
                </div>
              </div>

              {/* Painter Stage */}
              <div className="flex-1 bg-slate-50 border border-slate-200/60 rounded-xl relative overflow-hidden min-h-[300px]">
                <canvas
                  id="whiteboard-canvas"
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={drawLine}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  width={900}
                  height={500}
                  className="absolute inset-0 bg-white cursor-crosshair h-full w-full"
                />
                
                {/* Tiny Floating Guideline */}
                <div className="absolute bottom-2 left-2 bg-slate-900/10 text-slate-500 font-mono text-[9px] p-1 px-2 rounded-md pointer-events-none">
                  Press & Drag canvas to draw graphics. Click with Node stamp to draw balanced tree indexes.
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col space-y-4">
                        {/* Teams Style Layout Toolbar */}
              <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-2.5 rounded-2xl gap-2 z-10 border ${
                userRole === 'instructor' 
                  ? 'bg-white border-slate-200 shadow-sm' 
                  : 'bg-slate-900/60 backdrop-blur border-slate-800'
              }`}>
                <div className="flex items-center gap-2">
                  <Grid size={13} className={userRole === 'instructor' ? 'text-crimson' : 'text-[#7B83EB]'} />
                  <span className={`text-[10px] font-black uppercase tracking-wider ${userRole === 'instructor' ? 'text-slate-500' : 'text-slate-350'}`}>Layout View:</span>
                  <div className={`flex p-[2.5px] rounded-xl border ml-1 ${userRole === 'instructor' ? 'bg-slate-50 border-slate-200' : 'bg-[#1F1F1F] border-slate-800'}`}>
                    {(['gallery', 'speaker'] as const).map((lv) => (
                      <button
                        key={lv}
                        type="button"
                        onClick={() => {
                          setActiveLayoutView(lv);
                          triggerToast(`Interactive Stage view set to: ${lv === 'gallery' ? 'Gallery Dynamic Grid' : 'Speaker Spotlight'}`);
                        }}
                        className={`px-3 py-1 text-[9px] uppercase font-extrabold rounded-lg transition ${
                          activeLayoutView === lv 
                            ? (userRole === 'instructor' ? 'bg-crimson text-white shadow' : 'bg-[#6264A7] text-white shadow') 
                            : (userRole === 'instructor' ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white')
                        }`}
                      >
                        {lv}
                      </button>
                    ))}
                  </div>
                </div>

                {activeLayoutView === 'gallery' && (
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Visible Tiles Limit:</span>
                    <div className={`flex p-[2px] rounded-xl border ${userRole === 'instructor' ? 'bg-slate-50 border-slate-200' : 'bg-[#1F1F1F] border-slate-800'}`}>
                      {([2, 4, 9, 25, 49] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            setGalleryParticipantsCount(sz);
                            triggerToast(`Display grid set to ${sz} peer screens maximum`);
                          }}
                          className={`px-2.5 py-1 text-[9.5px] font-mono rounded-lg transition font-heavy ${
                            galleryParticipantsCount === sz 
                              ? (userRole === 'instructor' ? 'bg-crimson text-white font-heavy border border-red-200/20 shadow' : 'bg-[#6264A7] text-white font-heavy border border-[#7B83EB]/25') 
                              : (userRole === 'instructor' ? 'text-slate-500 hover:text-slate-800' : 'text-slate-500 hover:text-slate-300')
                          }`}
                        >
                          {sz}P
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic GRID container */}
              <div className={`flex-1 grid gap-3 ${
                activeLayoutView === 'speaker'
                  ? 'grid-cols-1 max-w-4xl mx-auto w-full'
                  : galleryParticipantsCount === 2
                  ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto w-full'
                  : galleryParticipantsCount === 4
                  ? 'grid-cols-2 max-w-4xl mx-auto w-full'
                  : galleryParticipantsCount === 9
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : galleryParticipantsCount === 25
                  ? 'grid-cols-3 sm:grid-cols-5'
                  : 'grid-cols-4 sm:grid-cols-7'
              } auto-rows-fr`}>
                
                {/* User Self Video card with camera support */}
                {(activeLayoutView === 'gallery' || activeSpeaker === 'Dr. Joseph Adebayo') && (
                  <div 
                    id="video-card-self" 
                    className={`relative group bg-[#111111] border ${
                      activeSpeaker === 'Dr. Joseph Adebayo' && userRole === 'instructor'
                        ? 'border-indigo-500 shadow-xl ring-2 ring-indigo-500/30 font-heavy' 
                        : 'border-slate-800/80 shadow'
                    } rounded-2xl overflow-hidden aspect-video transition-all duration-300 flex items-center justify-center`}
                  >
                    {isCameraOn ? (
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="w-full h-full object-cover transform scale-x-[-1]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-850 flex flex-col items-center justify-center text-slate-500">
                        <div className={`bg-slate-800 text-slate-300 rounded-full flex items-center justify-center font-bold tracking-wide uppercase shadow-inner mb-2 ${
                          galleryParticipantsCount >= 25 ? 'w-10 h-10 text-sm' : 'w-16 h-16 text-xl'
                        }`}>
                          JA
                        </div>
                        {galleryParticipantsCount < 25 && (
                          <>
                            <VideoOff size={20} className="opacity-30 mb-0.5" />
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Camera Off</span>
                          </>
                        )}
                      </div>
                    )}
                    
                    {/* Glowing speaking ring */}
                    {activeSpeaker === 'Dr. Joseph Adebayo' && userRole === 'instructor' && (
                      <div className="absolute top-2.5 right-2.5 bg-indigo-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full animate-pulse tracking-widest flex items-center gap-0.5 shadow">
                        <Volume2 size={8} /> SPEAKING
                      </div>
                    )}

                    {/* Labels */}
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-black/65 px-2 py-0.5 rounded-lg text-[9px] font-bold text-slate-205">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
                      Dr. J. Adebayo (You)
                    </div>
                    
                    {/* Raised Hand Overlays */}
                    {isHandRaised && (
                      <span className="absolute top-2.5 left-2.5 bg-amber-500 text-black p-1 rounded-lg border border-amber-400 animate-bounce">
                        <Hand size={11} />
                      </span>
                    )}

                    <div className="absolute bottom-2.5 right-2.5 flex gap-1 bg-black/65 p-1 rounded text-slate-300">
                      {isMicOn ? <Mic size={10} className="text-emerald-400" /> : <MicOff size={10} className="text-red-400" />}
                    </div>
                  </div>
                )}

                {/* Simulated Participant Video Cards */}
                {(() => {
                  const baseList = [...participants];
                  let targetList = baseList;
                  if (activeLayoutView === 'speaker') {
                    const talker = baseList.find(p => p.name === activeSpeaker);
                    targetList = talker ? [talker] : [];
                  } else {
                    const maxCount = galleryParticipantsCount - 1; // minus 1 for self
                    if (maxCount <= baseList.length) {
                      targetList = baseList.slice(0, maxCount);
                    } else {
                      const paddedList = [...baseList];
                      const generatedStudents = [
                        { name: 'Dr. Joseph Adebayo' },
                        { name: 'Alex Kiprop' }, { name: 'Chinedu Egwu' }, { name: 'Zainab Yusuf' },
                        { name: 'Habiba Diallo' }, { name: 'Femi Kuti' }, { name: 'Moussa Sissoko' },
                        { name: 'Fatoumata Diawara' }, { name: 'Nelson Mandela' }, { name: 'Asha Bhosle' },
                        { name: 'Wangari Maathai' }, { name: 'Wole Soyinka' }, { name: 'Chinua Achebe' },
                        { name: 'Tunde Kelani' }, { name: 'Ngozi Okonjo' }, { name: 'Aliko Dangote' },
                        { name: 'Chimamanda Adichie' }, { name: 'Mariama Ba' }, { name: 'Cheikh Anta Diop' },
                        { name: 'Thomas Sankara' }, { name: 'Steve Biko' }, { name: 'Samora Machel' },
                        { name: 'Julius Nyerere' }, { name: 'Kwame Nkrumah' }, { name: 'Patrice Lumumba' },
                        { name: 'Desmond Tutu' }, { name: 'Albert Luthuli' }, { name: 'Ellen Johnson' },
                        { name: 'Leymah Gbowee' }, { name: 'Denis Mukwege' }, { name: 'Yaa Asantewaa' },
                        { name: 'Funmilayo Ransome' }, { name: 'Nzinga Mbande' }, { name: 'Sarraounia Mangou' },
                        { name: 'Taytu Betul' }, { name: 'Amina of Zazzau' }
                      ];
                      while (paddedList.length < maxCount) {
                        const dummyIndex = paddedList.length - baseList.length;
                        if (dummyIndex >= generatedStudents.length) break;
                        const dummyStudent = generatedStudents[dummyIndex];
                        paddedList.push({
                          id: 'gen-' + dummyIndex,
                          name: dummyStudent.name,
                          role: 'Student',
                          isCamOn: Math.random() > 0.4,
                          isMicOn: false,
                          isHandRaised: Math.random() > 0.88,
                          speakSeconds: 0,
                          latency: '22ms'
                        });
                      }
                      targetList = paddedList;
                    }
                  }

                  return targetList.map((part) => {
                    const isCurrentlySpeaking = activeSpeaker === part.name;
                    const isDense = galleryParticipantsCount >= 25;
                    return (
                      <div
                        id={`video-card-${part.id}`}
                        key={part.id}
                        className={`relative group bg-slate-900 border ${
                          isCurrentlySpeaking 
                            ? 'border-indigo-500 shadow-xl ring-2 ring-indigo-500/30' 
                            : 'border-slate-800/80 shadow-sm'
                        } rounded-2xl overflow-hidden aspect-video transition-all duration-300 flex items-center justify-center text-center`}
                      >
                        {/* Camera stream display mockup */}
                        {part.isCamOn ? (
                          <div className="absolute inset-0 bg-slate-850">
                            <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/40 flex flex-col items-center justify-center relative">
                              <div className={`${
                                isDense ? 'w-10 h-10 text-xs' : 'w-16 h-16 text-xl'
                              } ${isCurrentlySpeaking ? 'bg-[#6264A7] ring-4 ring-[#7B83EB]/30' : 'bg-slate-800'} text-white rounded-full flex items-center justify-center font-bold font-sans uppercase shadow transition-all duration-300`}>
                                {part.name.charAt(0)}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-slate-500 flex flex-col items-center">
                            <div className={`${
                              isDense ? 'w-9 h-9 text-xs' : 'w-14 h-14 text-sm'
                            } bg-slate-900 border border-slate-800 text-slate-500 rounded-full flex items-center justify-center font-bold uppercase mb-2`}>
                              {part.name.charAt(0)}
                            </div>
                            {!isDense && (
                              <>
                                <VideoOff size={16} className="opacity-30 mb-0.5" />
                                <span className="text-[9px] font-bold uppercase text-slate-400 font-sans truncate pr-2 pl-2 max-w-[80px]">{part.name.split(' ')[0]}</span>
                              </>
                            )}
                          </div>
                        )}

                        {/* Highly Interactive Control Overlay for Instructors */}
                        {userRole === 'instructor' && !isDense && (
                          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center gap-1.5 z-10">
                            <button
                              type="button"
                              onClick={() => toggleParticipantMic(part.id)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
                              title="Toggle Mic"
                            >
                              {part.isMicOn ? <MicOff size={12} className="text-red-400" /> : <Mic size={12} className="text-[#7B83EB]" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleParticipantCam(part.id)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
                              title="Toggle Camera"
                            >
                              {part.isCamOn ? <VideoOff size={12} className="text-red-400" /> : <VideoIcon size={12} className="text-[#7B83EB]" />}
                            </button>
                            {part.role !== 'Instructor' && !part.id.startsWith('gen-') && (
                              <button
                                type="button"
                                onClick={() => kickParticipant(part.id, part.name)}
                                className="p-1.5 bg-red-950 hover:bg-red-900 text-red-400 rounded-lg text-xs"
                                title="Kick User"
                              >
                                <Trash size={12} />
                              </button>
                            )}
                          </div>
                        )}

                        {/* Border highlight speaking badge */}
                        {isCurrentlySpeaking && (
                          <div className="absolute top-2.5 right-2.5 bg-indigo-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full animate-bounce flex items-center gap-0.5 tracking-wider shadow">
                            <Volume2 size={8} /> SPEAKING
                          </div>
                        )}

                        {/* Labels */}
                        {!isDense && (
                          <div className="absolute bottom-2.5 left-2.5 bg-black/65 px-2 py-0.5 rounded-lg text-[9px] font-bold text-slate-300">
                            {part.name} <span className="text-slate-500 font-medium">({part.role})</span>
                          </div>
                        )}

                        {/* Indicators bottom */}
                        {!isDense && (
                          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-black/65 p-1 rounded-lg">
                            {part.isMicOn ? <Mic size={9} className="text-emerald-400" /> : <MicOff size={9} className="text-red-400" />}
                            <span className="text-[8px] uppercase font-bold text-slate-400 border-l border-slate-800 pl-1 ml-1 font-mono">{part.latency}</span>
                          </div>
                        )}

                        {/* Density label */}
                        {isDense && (
                          <div className="absolute bottom-1 text-center w-full truncate text-[8px] text-slate-400 px-1 font-sans font-bold">
                            {part.name.split(' ')[0]}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}

              </div>
            </div>
          )}

          {/* Floating Emoji particle overlay engine */}
          <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
            {reactions.map((r) => (
              <motion.div
                key={r.id}
                initial={{ y: '100%', opacity: 0, scale: 0.8 }}
                animate={{ y: '-20%', opacity: [0, 1, 1, 0], scale: [0.8, 1.4, 1.4, 1] }}
                transition={{ duration: 2.2, ease: 'easeOut' }}
                style={{ left: `${r.x}%`, position: 'absolute' }}
                className="text-4xl filter drop-shadow-lg"
              >
                {r.emoji}
              </motion.div>
            ))}
          </div>

          
          {/* 3. Bottom persistent controls bar */}
          <div className="mt-4 bg-slate-900 border border-slate-800 rounded-2xl h-18 px-5 flex items-center justify-between gap-5 shadow-inner">
            
            {/* Left controls: Audio/Video controls */}
            <div className="flex items-center gap-2">
              <button
                id="btn-toggle-camera"
                onClick={() => {
                  setIsCameraOn(!isCameraOn);
                  triggerToast(`Your camera is toggled ${!isCameraOn ? 'ON' : 'OFF'}.`);
                }}
                className={`p-3 rounded-xl transition shadow flex items-center gap-1.5 ${
                  isCameraOn 
                    ? (userRole === 'instructor' ? 'bg-crimson text-white hover:bg-red-800 shadow' : 'bg-indigo-600 text-white hover:bg-indigo-700') 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isCameraOn ? <VideoIcon size={16} /> : <VideoOff size={16} className="text-red-400" />}
                <span className="text-xs font-bold hidden xl:inline">Cam</span>
              </button>
              
              <button
                id="btn-toggle-mic"
                onClick={() => {
                  const state = !isMicOn;
                  setIsMicOn(state);
                  triggerToast(`Your mic is toggled ${state ? 'UNMUTED' : 'MUTED'}.`);
                }}
                className={`p-3 rounded-xl transition shadow flex items-center gap-1.5 ${
                  isMicOn 
                    ? (userRole === 'instructor' ? 'bg-crimson text-white hover:bg-red-800 shadow' : 'bg-indigo-600 text-white hover:bg-indigo-700') 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isMicOn ? <Mic size={16} /> : <MicOff size={16} className="text-red-400" />}
                <span className="text-xs font-bold hidden xl:inline">Mic</span>
              </button>

              {isScreenSharing ? (
                <button
                  onClick={stopScreenSharing}
                  className="p-3 rounded-xl transition shadow bg-rose-600 text-white hover:bg-rose-700 flex items-center gap-1"
                >
                  <VideoOff size={16} /> <span className="text-xs font-bold hidden sm:inline">Stop Share</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowScreenShareModal(true)}
                  className="p-3 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl transition shadow flex items-center gap-1"
                >
                  <ScreenShare size={16} /> <span className="text-xs font-bold hidden sm:inline">Share</span>
                </button>
              )}
            </div>

            {/* Mids: Whiteboard, Raise Hand, Emojis */}
            <div className="flex items-center gap-2">
              <button
                id="btn-toggle-whiteboard"
                onClick={() => setIsWhiteboardActive(!isWhiteboardActive)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition flex items-center gap-1.5 ${
                  isWhiteboardActive 
                    ? 'bg-amber-100 border-amber-200 text-amber-800 shadow' 
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Grid size={13} />
                <span className="hidden sm:inline">Whiteboard</span>
              </button>

              <button
                id="btn-raise-hand"
                onClick={() => {
                  setIsHandRaised(!isHandRaised);
                  triggerToast(isHandRaised ? "Hand lowered." : "Hand raised. Instructor notified.");
                }}
                className={`p-3 rounded-xl transition ${
                  isHandRaised 
                    ? (userRole === 'instructor' ? 'bg-crimson text-white shadow' : 'bg-indigo-500 text-white shadow') 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Hand size={16} />
              </button>

              {/* Emoji popup */}
              <div className="relative">
                <button
                  id="btn-toggle-emojis"
                  onClick={() => setShowEmojiPanel(!showEmojiPanel)}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                >
                  <Smile size={16} />
                </button>
                <AnimatePresence>
                  {showEmojiPanel && (
                    <motion.div
                      id="emoji-popup-panel"
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: -60, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-700 p-2.5 rounded-xl flex gap-1.5 shadow-xl z-50"
                    >
                      {['👏', '❤️', '😂', '👍', '🔥', '🎉'].map((emo) => (
                        <button
                          key={emo}
                          onClick={() => triggerEmoji(emo)}
                          className="text-2xl hover:scale-130 transition px-1"
                        >
                          {emo}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Toggle side panels */}
            <div className="flex items-center gap-1 bg-slate-950 p-[3px] rounded-xl border border-slate-850">
              <button
                onClick={() => setActiveSidePanel(activeSidePanel === 'chat' ? 'none' : 'chat')}
                className={`p-2 rounded-lg transition ${
                  activeSidePanel === 'chat' 
                    ? (userRole === 'instructor' ? 'bg-crimson text-white font-bold shadow-sm' : 'bg-indigo-600 text-white font-bold') 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Meeting Chat"
              >
                <MessageSquare size={16} />
              </button>
              
              <button
                onClick={() => setActiveSidePanel(activeSidePanel === 'participants' ? 'none' : 'participants')}
                className={`p-2 rounded-lg transition relative ${
                  activeSidePanel === 'participants' 
                    ? (userRole === 'instructor' ? 'bg-crimson text-white font-bold shadow-sm' : 'bg-indigo-600 text-white font-bold') 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Attendees"
              >
                <Users size={16} />
                <span className={`absolute -top-1 -right-1.5 font-mono text-[8px] text-white font-extrabold w-4 h-4 rounded-full flex items-center justify-center ${userRole === 'instructor' ? 'bg-crimson' : 'bg-indigo-500'}`}>
                  {participants.length + 1}
                </span>
              </button>

              <button
                onClick={() => setActiveSidePanel(activeSidePanel === 'polls' ? 'none' : 'polls')}
                className={`p-2 rounded-lg transition ${
                  activeSidePanel === 'polls' 
                    ? (userRole === 'instructor' ? 'bg-crimson text-white font-bold shadow-sm' : 'bg-indigo-600 text-white font-bold') 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Class Polls"
              >
                <CheckSquare size={16} />
              </button>

              {/* Instructor-Only Side Panels */}
              {userRole === 'instructor' && (
                <>
                  <button
                    onClick={() => setActiveSidePanel(activeSidePanel === 'breakout' ? 'none' : 'breakout')}
                    className={`p-2 rounded-lg transition ${
                      activeSidePanel === 'breakout' 
                        ? 'bg-crimson text-white font-bold shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Breakout Groups"
                  >
                    <Layers size={16} />
                  </button>

                  <button
                    onClick={() => setActiveSidePanel(activeSidePanel === 'analytics' ? 'none' : 'analytics')}
                    className={`p-2 rounded-lg transition ${
                      activeSidePanel === 'analytics' 
                        ? 'bg-crimson text-white font-bold shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Speaking Analytics"
                  >
                    <BarChart3 size={16} />
                  </button>

                  {isWaitingRoomEnabled && waitingLobby.length > 0 && (
                    <button
                      onClick={() => setActiveSidePanel(activeSidePanel === 'lobby' ? 'none' : 'lobby')}
                      className={`p-2 rounded-lg transition relative ${
                        activeSidePanel === 'lobby' ? 'bg-red-600 text-white font-bold animate-pulse' : 'text-red-400 hover:text-red-300'
                      }`}
                      title="Waiting Lobby"
                    >
                      <ShieldAlert size={16} />
                      <span className="absolute -top-1 -right-1 bg-red-500 font-mono text-[8px] text-white font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                        {waitingLobby.length}
                      </span>
                    </button>
                  )}
                </>
              )}
            </div>

          </div>

            </>
          )}
        </div>

        {/* 4. Active Side Panel View */}
        <AnimatePresence>
          {activeSidePanel !== 'none' && (
            <motion.div
              id="live-side-panel"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-85 bg-slate-900 border-l border-slate-800 flex flex-col h-full z-20 shadow-2xl relative"
            >
              
              {/* Slide panel Heading */}
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300 my-1">
                  {activeSidePanel === 'chat' && 'Lecture Chat & Q&A'}
                  {activeSidePanel === 'participants' && 'Session Moderation'}
                  {activeSidePanel === 'polls' && 'Class Polls Engine'}
                  {activeSidePanel === 'breakout' && 'Breakout Laboratory'}
                  {activeSidePanel === 'analytics' && 'Engagement Analytics'}
                  {activeSidePanel === 'lobby' && 'Lobby Admittances'}
                </h3>
                <button 
                  onClick={() => setActiveSidePanel('none')} 
                  className="p-1 px-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Side Panels content */}
              
              {/* PANEL 1: LECTURE CHAT */}
              {activeSidePanel === 'chat' && (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Messages list */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
                    
                    {/* Floating Recap Action */}
                    <button
                      onClick={generateLiveNotesWithAI}
                      disabled={isNotesLoading}
                      className="w-full mb-2 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-650 hover:bg-indigo-705 text-white rounded-xl text-xs font-black transition border border-indigo-500 shadow"
                    >
                      <Sparkles size={13} className="text-amber-300" />
                      {isNotesLoading ? 'Generating summary...' : 'Ask Prof. Gemini to Recap chat'}
                    </button>

                    {chatMessages.map((msg) => (
                      <div id={`chat-msg-${msg.id}`} key={msg.id} className="text-xs bg-slate-850/60 border border-slate-800 p-2.5 rounded-xl leading-relaxed">
                        <div className="flex justify-between items-center text-slate-400 font-extrabold text-[10px] uppercase mb-1">
                          <span>{msg.author}</span>
                          <span>{msg.date}</span>
                        </div>
                        <p className="text-slate-200 mt-0.5">{msg.text}</p>
                      </div>
                    ))}
                    
                    {isNotesLoading && (
                      <div className="text-center py-4 text-xs font-semibold text-indigo-400 animate-pulse flex items-center justify-center gap-1.5 bg-slate-950/40 rounded-xl">
                        <Sparkle className="animate-spin text-amber-300" size={13} />
                        Generating expert lesson minutes...
                      </div>
                    )}

                    {aiLiveNotes.length > 0 && (
                      <div className="bg-indigo-950/40 border border-indigo-900/60 p-3.5 rounded-xl mt-3 space-y-2 shadow-inner">
                        <span className="text-[10px] uppercase font-bold text-indigo-400 flex items-center gap-1 pr-1 tracking-wider">
                          <Sparkles size={11} className="text-amber-400 animate-pulse" /> AI Class Minute Recap
                        </span>
                        <ul className="list-disc pl-4 text-[11px] text-indigo-200 space-y-1.5 font-medium leading-relaxed">
                          {aiLiveNotes.map((note, i) => <li key={i}>{note}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Form */}
                  <form onSubmit={submitMessage} className="p-3 bg-slate-950/40 border-t border-slate-800 flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask query or 'generate notes'..."
                      className="flex-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white shadow-inner placeholder-slate-500"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-indigo-650 hover:bg-indigo-700 rounded-lg text-white transition shrink-0"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              )}

              {/* PANEL 2: PARTICIPANTS */}
              {activeSidePanel === 'participants' && (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="p-3 border-b border-slate-800 bg-slate-950/20 flex items-center justify-between gap-2.5">
                    <div className="text-[10px] text-slate-400 font-extrabold uppercase">Attendees count ({participants.length + 1})</div>
                    {userRole === 'instructor' && (
                      <button
                        onClick={muteAllParticipants}
                        className="text-[9px] font-extrabold text-red-400 hover:text-red-300 px-2 py-1 rounded bg-red-950/40 border border-red-900/40"
                      >
                        Mute All
                      </button>
                    )}
                  </div>

                  {/* Copy Link / Invite card */}
                  <div className="p-4 bg-slate-950/40 border-b border-slate-800 space-y-2.5 text-xs">
                    <div className="font-bold text-xs text-white">Class Invite Code</div>
                    <div className="bg-slate-850 p-2.5 rounded-lg font-mono text-[10px] text-slate-400 flex items-center justify-between border border-slate-800">
                      <span className="truncate mr-2">ENTP-AFRIQ-2026</span>
                      <button onClick={copyInvitePayload} className="text-indigo-400 hover:text-indigo-300 shrink-0">
                        {isInviteCopied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5 no-scrollbar">
                    
                    {/* Render Host card */}
                    <div className="flex items-center justify-between bg-slate-850/30 p-2.5 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-indigo-600/30 text-indigo-400 font-extrabold text-xs flex items-center justify-center rounded-full">
                          JA
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-slate-200">Dr. Joseph Adebayo</p>
                          <span className="text-[9px] font-bold text-slate-500 uppercase">Host • Instructor</span>
                        </div>
                      </div>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    </div>

                    {/* Attendees Loop */}
                    {participants.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-850/20 p-2.5 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-slate-800 text-slate-300 font-extrabold text-xs flex items-center justify-center rounded-full">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-xs text-slate-300 truncate max-w-[130px]">{p.name}</p>
                            <span className="text-[9px] text-slate-500">{p.role} • {p.latency}</span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1.5">
                          {userRole === 'instructor' ? (
                            <>
                              <button
                                onClick={() => toggleParticipantMic(p.id)}
                                className={`p-1 rounded ${p.isMicOn ? 'text-slate-400 hover:bg-slate-800' : 'text-red-400 bg-red-950/20'}`}
                              >
                                {p.isMicOn ? <Mic size={12} /> : <MicOff size={12} />}
                              </button>
                              <button
                                onClick={() => toggleParticipantCam(p.id)}
                                className={`p-1 rounded ${p.isCamOn ? 'text-slate-400 hover:bg-slate-800' : 'text-red-400 bg-red-950/20'}`}
                              >
                                {p.isCamOn ? <VideoIcon size={12} /> : <VideoOff size={12} />}
                              </button>
                            </>
                          ) : (
                            p.isMicOn ? <Mic size={11} className="text-slate-400" /> : <MicOff size={11} className="text-slate-400" />
                          )}
                          <span className={`h-1.5 w-1.5 rounded-full ${p.quality === 'Excellent' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {userRole === 'instructor' && (
                    <div className="p-3 border-t border-slate-800 bg-slate-950/25">
                      <button
                        onClick={downloadAttendanceCSV}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition border border-slate-700"
                      >
                        <Download size={13} /> Download Attendance CSV
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* PANEL 3: POLLS ENGINE */}
              {activeSidePanel === 'polls' && (
                <div className="flex-1 flex flex-col min-h-0">
                  
                  {/* Create New Poll Accordion for Instructor */}
                  {userRole === 'instructor' && (
                    <div className="p-4 border-b border-slate-800 bg-slate-950/20 space-y-3">
                      <div className="font-extrabold text-xs text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                        <Plus size={12} /> Create Interactive Poll
                      </div>
                      
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newPollQuestion}
                          onChange={(e) => setNewPollQuestion(e.target.value)}
                          placeholder="Type poll question here..."
                          className="w-full px-3 py-2 bg-slate-850 hover:bg-slate-800 text-xs text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        
                        <div className="space-y-1">
                          {newPollOptions.map((opt, i) => (
                            <input
                              key={i}
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const copy = [...newPollOptions];
                                copy[i] = e.target.value;
                                setNewPollOptions(copy);
                              }}
                              placeholder={`Option ${i + 1}`}
                              className="w-full px-3 py-2 bg-slate-900 text-xs text-white rounded-lg border border-slate-800"
                            />
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-1.5">
                          <button
                            onClick={() => setNewPollOptions(prev => [...prev, ''])}
                            className="text-[10px] font-bold text-indigo-400 hover:underline flex items-center gap-0.5"
                          >
                            + Add Option
                          </button>
                          <button
                            onClick={createPoll}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black px-3 py-1.5 rounded-lg shadow-sm"
                          >
                            Draft Poll
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active List of Polls */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                    {(userRole === 'instructor' ? polls : polls.filter(p => p.isPublished)).length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-500">
                        {userRole === 'instructor' 
                          ? 'No drafted or published polls available. Use the form above to launch one.' 
                          : 'No active polls at this moment. When your instructor launches a poll, it will appear here live.'}
                      </div>
                    ) : null}

                    {(userRole === 'instructor' ? polls : polls.filter(p => p.isPublished)).map((poll) => {
                      const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
                      const isVoted = !!hasVotedFor[poll.id];

                      return (
                        <div key={poll.id} className="p-3.5 bg-slate-850/60 rounded-xl border border-slate-800 space-y-3 shadow-inner">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-[9px] uppercase font-bold text-amber-500 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/30">
                              {poll.isPublished ? 'Live Poll' : 'Draft'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 font-bold">{totalVotes} Votes total</span>
                          </div>
                          
                          <h4 className="font-bold text-xs text-slate-100 leading-snug">{poll.question}</h4>

                          {/* Voting Options */}
                          <div className="space-y-2">
                            {!poll.isPublished ? (
                              userRole === 'instructor' ? (
                                <button
                                  onClick={() => publishPoll(poll.id)}
                                  className="w-full text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition"
                                >
                                  Launch & Publish Poll
                                </button>
                              ) : null
                            ) : (
                              poll.options.map((opt) => {
                                const percentage = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
                                const isUserChoice = hasVotedFor[poll.id] === opt.id;

                                return (
                                  <div key={opt.id} className="relative group/opt">
                                    {isVoted ? (
                                      /* Voted visual state showing progress bars with teams education style */
                                      <div className="w-full text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-800 relative overflow-hidden">
                                        <div 
                                          className="absolute left-0 top-0 bottom-0 bg-indigo-600/30 transition-all duration-700"
                                          style={{ width: `${percentage}%` }}
                                        />
                                        <div className="relative flex justify-between items-center font-bold">
                                          <span className="text-slate-200 text-[11px] truncate flex items-center gap-1">
                                            {isUserChoice && <span className="text-emerald-400">✔</span>}
                                            {opt.text}
                                          </span>
                                          <span className="text-[11px] font-mono text-indigo-300 font-black">{percentage}% ({opt.votes})</span>
                                        </div>
                                      </div>
                                    ) : (
                                      /* Interactive clickable choice button */
                                      <button
                                        onClick={() => voteOnPoll(poll.id, opt.id)}
                                        className="w-full text-left font-semibold text-[11px] p-2.5 bg-slate-800 hover:bg-slate-700/80 hover:border-slate-600 text-slate-300 rounded-lg border border-slate-750 transition"
                                      >
                                        {opt.text}
                                      </button>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PANEL 4: BREAKOUT LABORATORY */}
              {activeSidePanel === 'breakout' && (
                <div className="flex-1 flex flex-col min-h-0">
                  
                  {breakoutPhase === 'idle' ? (
                    <div className="p-4 space-y-4 text-xs">
                      <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800 space-y-2">
                        <h4 className="font-bold text-white text-xs">Breakout Setup Panel</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Partition attendees into active coding sub groups to evaluate traversals or algorithm caching linear bounds.
                        </p>
                      </div>

                      {userRole === 'instructor' ? (
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="font-extrabold text-[10px] text-slate-400 uppercase">Number of Breakouts</label>
                            <select
                              value={breakoutRoomsCount}
                              onChange={(e) => setBreakoutRoomsCount(Number(e.target.value))}
                              className="w-full px-3 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-xs text-white rounded-lg focus:outline-none"
                            >
                              <option value={2}>2 Rooms - Core and Branch</option>
                              <option value={3}>3 Rooms - Alpha, Beta, Gamma</option>
                              <option value={4}>4 Rooms - Traversal, Cache, Query, Normal</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="font-extrabold text-[10px] text-slate-400 uppercase">Division Assignment Strategy</label>
                            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850 text-[11px] text-slate-300 space-y-1">
                              <div>● Automatically distribute (Balanced)</div>
                              <div className="text-slate-500">○ Manually designate (Selected)</div>
                            </div>
                          </div>

                          <button
                            onClick={initiateBreakouts}
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition"
                          >
                            Launch Breakouts Session
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-500 bg-slate-950/20 rounded-xl border border-dashed border-slate-800">
                          Waiting for instructor to trigger breakout laboratory sessions...
                        </div>
                      )}
                    </div>
                  ) : breakoutPhase === 'assigning' ? (
                    <div className="p-8 text-center space-y-3.5 flex-grow flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs text-slate-300 font-extrabold uppercase animate-pulse">Assigning laboratory groups...</p>
                      <p className="text-[10px] text-slate-500">Muting main stage mic loops temporarily.</p>
                    </div>
                  ) : (
                    /* Active breakout room supervisor lists */
                    <div className="flex-1 flex flex-col min-h-0">
                      <div className="p-3 bg-slate-950/40 text-xs font-bold text-amber-400 border-b border-indigo-950/40 flex items-center justify-between">
                        <span>● BREAKOUT ROOMS ACTIVE</span>
                        <span className="font-mono">{Math.floor(breakoutTimer / 60)}m {breakoutTimer % 60}s</span>
                      </div>

                      <div className="flex-grow overflow-y-auto p-3 space-y-3 no-scrollbar">
                        {breakoutRooms.map((room) => (
                          <div key={room.id} className="p-3 bg-slate-850/60 rounded-xl border border-slate-800 space-y-2">
                            <div className="flex justify-between items-center">
                              <h4 className="font-bold text-xs text-indigo-300">{room.name}</h4>
                              <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-950/20 px-1.5 rounded">Active</span>
                            </div>
                            
                            <ul className="text-[10px] text-slate-400 pl-2 space-y-1 list-disc list-inside">
                              {room.assignedUsers.map((usr, k) => <li key={k}>{usr}</li>)}
                            </ul>

                            {userRole === 'instructor' && (
                              <button
                                onClick={() => triggerToast(`Instructor joined ${room.name} discussion.`)}
                                className="w-full text-center py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-extrabold border border-slate-700 transition"
                              >
                                Supervise Room
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {userRole === 'instructor' && (
                        <div className="p-3 border-t border-slate-800 bg-slate-950/25 space-y-2">
                          <button
                            onClick={() => {
                              const broadcast = prompt("Type notice to broadcast to all breakout rooms:");
                              if (broadcast) {
                                triggerToast(`Broadcast note issued: "${broadcast}"`);
                              }
                            }}
                            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold"
                          >
                            Broadcast Notice
                          </button>
                          <button
                            onClick={endBreakouts}
                            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold"
                          >
                            Terminate Breakouts
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

              {/* PANEL 5: MEETING ANALYTICS */}
              {activeSidePanel === 'analytics' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar text-xs">
                  
                  {/* Gauge 1: Speaking allocations percentage list */}
                  <div className="p-3.5 bg-slate-850/50 rounded-xl border border-slate-800 space-y-3.5 shadow-inner">
                    <h4 className="font-bold text-white text-xs flex items-center justify-between border-b border-slate-800 pb-2">
                      <span>Speaking Time Analytics</span>
                      <span className="text-[10px] font-mono text-indigo-400">100% Total</span>
                    </h4>

                    {/* Progress bars showing speaking allocations */}
                    <div className="space-y-3">
                      {participants.concat({ id: 'self', name: 'Dr. Joseph Adebayo', role: 'Instructor', isMicOn: true, isCamOn: true, handRaised: false, quality: 'Excellent', speakSeconds: 198, latency: '12ms' }).slice(0, 5).map((u, i) => {
                        const totalSpokeSecs = participants.reduce((sum, item) => sum + item.speakSeconds, 0) + 198;
                        const speakingPercentage = Math.round((u.speakSeconds / totalSpokeSecs) * 100);

                        return (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] text-slate-300">
                              <span className="font-bold">{u.name} ({u.role === 'Instructor' ? 'Host' : 'Student'})</span>
                              <span className="font-semibold font-mono">{speakingPercentage}% ({getFormattedTime(u.speakSeconds)})</span>
                            </div>
                            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                                style={{ width: `${speakingPercentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Meter 2: Overall classroom Engagement indicators */}
                  <div className="p-3.5 bg-slate-850/50 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-xs border-b border-slate-800 pb-2">Classroom Engagement Indicators</h4>
                    
                    <div className="grid grid-cols-2 gap-2.5 text-center mt-2">
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[9px] uppercase font-bold text-slate-500">Engagement Score</span>
                        <p className="text-lg font-black text-emerald-400 mt-0.5">94.8%</p>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[9px] uppercase font-bold text-slate-500">Whiteboard interactions</span>
                        <p className="text-lg font-black text-amber-400 mt-0.5">38 Stamps</p>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[9px] uppercase font-bold text-slate-500">Average Ping latency</span>
                        <p className="text-lg font-black text-indigo-400 mt-0.5">42 ms</p>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[9px] uppercase font-bold text-slate-500">Questions raised</span>
                        <p className="text-lg font-black text-indigo-400 mt-0.5">4 Threads</p>
                      </div>
                    </div>
                  </div>

                  {/* Security Settings Checklist */}
                  {userRole === 'instructor' && (
                    <div className="p-3.5 bg-slate-850/50 rounded-xl border border-slate-800 space-y-2.5">
                      <h4 className="font-bold text-white text-xs border-b border-slate-800 pb-2 flex items-center gap-1">
                        <Shield size={13} className="text-indigo-400" /> Security & Lock Toggles
                      </h4>
                      
                      <div className="space-y-2 text-[11px] font-semibold text-slate-300">
                        <button
                          onClick={() => {
                            const next = !isMeetingLocked;
                            setIsMeetingLocked(next);
                            triggerToast(next ? "Meeting locked! New students cannot join." : "Meeting unlocked.");
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg border transition ${
                            isMeetingLocked ? 'bg-red-950/20 border-red-900 text-red-300' : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          <span>Lock Meeting Session</span>
                          <span>{isMeetingLocked ? 'LOCKED' : 'UNLOCKED'}</span>
                        </button>

                        <button
                          onClick={() => {
                            const next = !isWaitingRoomEnabled;
                            setIsWaitingRoomEnabled(next);
                            triggerToast(next ? "Waiting room queue activated." : "Waiting room bypassed.");
                          }}
                          className="w-full flex items-center justify-between p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg text-left"
                        >
                          <span>Require Waiting Lobby approvals</span>
                          <span>{isWaitingRoomEnabled ? 'ACTIVE' : 'BYPASS'}</span>
                        </button>

                        <button
                          onClick={() => {
                            const next = !showWatermark;
                            setShowWatermark(next);
                            triggerToast(next ? "Watermarking overlay active." : "Watermark disabled.");
                          }}
                          className="w-full flex items-center justify-between p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg text-left"
                        >
                          <span>Display Account Watermarks</span>
                          <span>{showWatermark ? 'YES' : 'NO'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* PANEL 6: WAITING ROOM LOBBY */}
              {activeSidePanel === 'lobby' && (
                <div className="flex-1 flex flex-col min-h-0 text-xs">
                  <div className="p-3 border-b border-slate-800 text-amber-400 font-extrabold uppercase">
                    Waiting room lobby approvals queue ({waitingLobby.length})
                  </div>

                  <div className="flex-grow overflow-y-auto p-3 space-y-3 no-scrollbar">
                    {waitingLobby.length === 0 ? (
                      <div className="text-center py-12 text-slate-500">Lobby queue is clear.</div>
                    ) : null}

                    {waitingLobby.map((user) => (
                      <div key={user.id} className="p-3.5 bg-slate-850/60 rounded-xl border border-slate-800 space-y-3 shadow-inner">
                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">
                          <span>Request to join</span>
                          <span>{user.requestTime}</span>
                        </div>
                        
                        <div>
                          <h4 className="font-extrabold text-xs text-white">{user.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-1">Context: {user.reason}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => denyLobbyUser(user.id, user.name)}
                            className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg font-bold"
                          >
                            Deny
                          </button>
                          <button
                            onClick={() => admitLobbyUser(user.id, user.name)}
                            className="py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold"
                          >
                            Admit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
