import React, { useState } from 'react';
import { 
  Layers, Shield, Users, Video, Clock, Settings, AlertTriangle, 
  Search, Plus, Check, Trash2, VolumeX, Megaphone, UserCheck, 
  HardDrive, Play, FileText, RefreshCw, Sliders, Eye, Activity,
  Lock, CheckCircle, XCircle, AlertCircle, PlusCircle, Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FullInstitutionData } from '../types';

interface InstitutionPortalViewProps {
  institutionData: FullInstitutionData;
}

interface AdminSession {
  id: string;
  title: string;
  courseName: string;
  instructor: string;
  status: 'Live' | 'Scheduled' | 'Recording_Saved';
  studentsCount: number;
  proctoringActive: boolean;
  timeUTC: string;
}

interface ProctoringLog {
  id: string;
  studentName: string;
  courseName: string;
  violationType: 'Tab Switch' | 'Face Missing' | 'Multiple Faces' | 'Ambience Noise';
  severity: 'Low' | 'Medium' | 'High';
  loggedTime: string;
  status: 'Unresolved' | 'Audit_Cleared' | 'Warning_Sent';
}

export const InstitutionPortalView: React.FC<InstitutionPortalViewProps> = ({ institutionData }) => {
  // Tabs management
  const [activeTab, setActiveTab] = useState<'control-room' | 'proctoring' | 'attendance' | 'announcements' | 'regulations'>('control-room');
  
  // Real-time notification banners
  const [systemAlert, setSystemAlert] = useState<string | null>(null);
  const triggerSystemAlert = (msg: string) => {
    setSystemAlert(msg);
    setTimeout(() => {
      setSystemAlert(null);
    }, 4500);
  };

  // State: Admin-managed Sessions
  const [sessions, setSessions] = useState<AdminSession[]>([
    { id: 'as1', title: 'Data Structures: Tree Traversals & Depth Search', courseName: 'Data Structure & Algorithms', instructor: 'Dr. Joseph Adebayo', status: 'Live', studentsCount: 42, proctoringActive: true, timeUTC: '10:00 AM' },
    { id: 'as2', title: 'State Synchronization & Dynamic Hooks', courseName: 'Advanced React & TypeScript', instructor: 'Dr. Joseph Adebayo', status: 'Scheduled', studentsCount: 58, proctoringActive: true, timeUTC: '02:00 PM' },
    { id: 'as3', title: 'Transactional Normalization & Indexes', courseName: 'Database Engineering & PostgreSQL', instructor: 'Dr. Joseph Adebayo', status: 'Scheduled', studentsCount: 31, proctoringActive: false, timeUTC: '11:00 AM' },
    { id: 'as4', title: 'Neural Networks and Deep Transformers', courseName: 'Intro to Machine Learning', instructor: 'Prof. Mariam Cole', status: 'Live', studentsCount: 75, proctoringActive: true, timeUTC: '09:00 AM' }
  ]);

  // State: Smart Proctoring violations ledger
  const [proctoringLogs, setProctoringLogs] = useState<ProctoringLog[]>([
    { id: 'p1', studentName: 'John Mwenda', courseName: 'Data Structure & Algorithms', violationType: 'Tab Switch', severity: 'Medium', loggedTime: '10:04 AM', status: 'Warning_Sent' },
    { id: 'p2', studentName: 'Sarah Mwangi', courseName: 'Advanced React & TypeScript', violationType: 'Face Missing', severity: 'High', loggedTime: '10:12 AM', status: 'Unresolved' },
    { id: 'p3', studentName: 'Emeka Obi', courseName: 'Database Engineering & PostgreSQL', violationType: 'Ambience Noise', severity: 'Low', loggedTime: '10:25 AM', status: 'Audit_Cleared' },
    { id: 'p4', studentName: 'Abdi Hassan', courseName: 'Intro to Machine Learning', violationType: 'Multiple Faces', severity: 'High', loggedTime: '10:33 AM', status: 'Unresolved' }
  ]);

  // State: Attendance database list
  const [attendanceLogs, setAttendanceLogs] = useState([
    { id: 'at1', studentName: 'John Mwenda', className: 'Tree Traversals', joinTime: '10:01 AM', status: 'Present', verifiedBy: 'Smart FaceID', attendanceScore: 100 },
    { id: 'at2', studentName: 'Sarah Mwangi', className: 'Tree Traversals', joinTime: '10:04 AM', status: 'Present', verifiedBy: 'Smart FaceID', attendanceScore: 98 },
    { id: 'at3', studentName: 'Emeka Obi', className: 'Neural Networks', joinTime: '09:12 AM', status: 'Late', verifiedBy: 'Manual Overrides', attendanceScore: 75 },
    { id: 'at4', studentName: 'Kate Henshaw', className: 'Neural Networks', joinTime: '---', status: 'Absent', verifiedBy: 'N/A', attendanceScore: 0 },
    { id: 'at5', studentName: 'Abdi Hassan', className: 'Tree Traversals', joinTime: '10:02 AM', status: 'Present', verifiedBy: 'GPS Geo-Check', attendanceScore: 100 }
  ]);

  // State: Broadcast and schedule overlays
  const [globalAnnouncement, setGlobalAnnouncement] = useState('');
  const [announcementsLog, setAnnouncementsLog] = useState([
    { id: 'ann1', message: 'All final terms exam modules must have biometric FaceID verification enabled.', postedBy: 'Dean of Information Technology', date: 'June 19, 2026', type: 'Critical' },
    { id: 'ann2', message: 'Scheduled server maintenance tomorrow at 04:00 UTC. Live sessions will remain active in sandboxed modes.', postedBy: 'System Architect', date: 'June 20, 2026', type: 'System' }
  ]);

  // Smart Security Threshold Configurations
  const [biometricLivenessRate, setBiometricLivenessRate] = useState(95);
  const [tabWarningThreshold, setTabWarningThreshold] = useState(3);
  const [requireSmartProctoringOnCreation, setRequireSmartProctoringOnCreation] = useState(true);

  // Search filter models
  const [proctoringSearch, setProctoringSearch] = useState('');
  const [attendanceSearch, setAttendanceSearch] = useState('');

  // Class scheduling wizard state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionCourse, setNewSessionCourse] = useState('Data Structure & Algorithms');
  const [newSessionInstructor, setNewSessionInstructor] = useState('Dr. Joseph Adebayo');
  const [newSessionTime, setNewSessionTime] = useState('11:00 AM');

  // Multi-modal actions handlers
  const handleToggleProctoring = (id: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === id) {
        const nextState = !s.proctoringActive;
        triggerSystemAlert(`Smart Proctoring ${nextState ? 'ENABLED' : 'DISABLED'} for class: ${s.title}`);
        return { ...s, proctoringActive: nextState };
      }
      return s;
    }));
  };

  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalAnnouncement.trim()) return;
    
    const newAnn = {
      id: `ann-${Date.now()}`,
      message: globalAnnouncement,
      postedBy: 'Campus Administrator Portal',
      date: 'Today',
      type: 'Alert'
    };
    setAnnouncementsLog([newAnn, ...announcementsLog]);
    setGlobalAnnouncement('');
    triggerSystemAlert(`Global alert broadcasted across all active virtual classrooms: "${newAnn.message}"`);
  };

  const handleTerminateSession = (id: string, name: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    triggerSystemAlert(`Administrative override: Session terminated & archived for ${name}`);
  };

  const handleAuditAction = (id: string, action: 'Audit_Cleared' | 'Warning_Sent') => {
    setProctoringLogs(prev => prev.map(log => {
      if (log.id === id) {
        return { ...log, status: action };
      }
      return log;
    }));
    triggerSystemAlert(`Violation audit updated: Status marked as ${action.replace('_', ' ')}`);
  };

  const handleExcusalAttendance = (id: string) => {
    setAttendanceLogs(prev => prev.map(att => {
      if (att.id === id) {
        return { ...att, status: 'Present', verifiedBy: 'Admin Cleared', attendanceScore: 100 };
      }
      return att;
    }));
    triggerSystemAlert(`Attendance roll resolved. Verified by Administrative Override.`);
  };

  const handleScheduleSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionTitle.trim()) return;

    const newS: AdminSession = {
      id: `as-${Date.now()}`,
      title: newSessionTitle,
      courseName: newSessionCourse,
      instructor: newSessionInstructor,
      status: 'Scheduled',
      studentsCount: 0,
      proctoringActive: requireSmartProctoringOnCreation,
      timeUTC: newSessionTime
    };

    setSessions([...sessions, newS]);
    setNewSessionTitle('');
    setShowScheduleModal(false);
    triggerSystemAlert(`Successfully scheduled virtual laboratory: "${newS.title}"`);
  };

  return (
    <div className="animate-fade-in p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen rounded-3xl space-y-6">
      
      {/* Dynamic Administrative Toast Alerts */}
      <AnimatePresence>
        {systemAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-crimson text-white text-xs font-black px-5 py-3.5 rounded-2xl shadow-2xl border border-red-500/20"
          >
            <Activity size={15} className="animate-pulse text-white" />
            <span>{systemAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Campus Portal Header Block */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-crimson/10 text-crimson text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-crimson/15">
              Campus Security & Administration
            </span>
            <span className="flex items-center gap-1.5 text-[9px] font-bold text-green-600 dark:text-green-400 uppercase bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></span>
              Live Synced
            </span>
          </div>
          <h1 className="text-2xl font-black mt-2 text-slate-900 dark:text-white uppercase tracking-tight font-serif">
            Institution Academy Portal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 uppercase font-bold tracking-wider">
            Enterprise Academic Command Center — {institutionData.name}
          </p>
        </div>

        {/* Global Stats bar */}
        <div className="flex items-center gap-6 divide-x divide-slate-200 dark:divide-slate-800">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Classrooms</span>
            <span className="text-lg font-black text-rose-600 dark:text-rose-450 mt-1 block">
              {sessions.filter(s => s.status === 'Live').length} Live Rooms
            </span>
          </div>
          <div className="text-left pl-6">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Learners Live</span>
            <span className="text-lg font-black text-slate-800 dark:text-slate-200 mt-1 block">
              {sessions.reduce((acc, current) => acc + (current.status === 'Live' ? current.studentsCount : 0), 0)} Enrolled
            </span>
          </div>
          <div className="text-left pl-6">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Integrity Status</span>
            <span className="text-lg font-black text-green-600 dark:text-green-400 mt-1 block flex items-center gap-1.5">
              <Shield size={16} /> Secure
            </span>
          </div>
        </div>
      </div>

      {/* Internal Navigation Ribbon */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-px overflow-x-auto select-none scrollbar-none">
        {[
          { id: 'control-room', label: 'Laboratory Console', icon: <Layers size={15} /> },
          { id: 'proctoring', label: 'AI Integrity Audits', icon: <Shield size={15} />, badge: proctoringLogs.filter(l => l.status === 'Unresolved').length },
          { id: 'attendance', label: 'Attendance Ledger', icon: <UserCheck size={15} /> },
          { id: 'announcements', label: 'Broadcast Center', icon: <Megaphone size={15} /> },
          { id: 'regulations', label: 'Compliance Sliders', icon: <Settings size={15} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-extrabold text-xs uppercase tracking-wider transition-all duration-300 ${
              activeTab === tab.id 
                ? 'border-crimson text-crimson' 
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="bg-crimson text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-4 text-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ACTIVE TAB VIEWS */}
      <div className="min-h-[480px]">
        {activeTab === 'control-room' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Active & Scheduled Class Laboratory Rooms
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage encryption tokens, toggle proctoring firewalls, or terminate academic channels dynamically.
                </p>
              </div>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-crimson hover:bg-red-800 text-white text-xs font-black rounded-xl uppercase tracking-wider shadow-md hover:shadow-lg transition duration-200"
              >
                <PlusCircle size={15} />
                <span>Schedule New Room</span>
              </button>
            </div>

            {/* Labs grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sessions.map(sess => (
                <div 
                  key={sess.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:border-crimson/30 transition-all duration-300"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          sess.status === 'Live'
                            ? 'bg-rose-500/10 text-rose-600 border-rose-500/25 animate-pulse'
                            : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/25'
                        }`}>
                          {sess.status === 'Live' ? '● Live Room' : 'Scheduled'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{sess.courseName}</span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug uppercase tracking-tight mt-1">
                        {sess.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                        Instructor: {sess.instructor}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Scheduled</span>
                      <span className="text-xs font-black mt-1 block">{sess.timeUTC}</span>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 dark:bg-slate-800/60"></div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-slate-550 dark:text-slate-300">
                        <Users size={14} className="text-slate-400" />
                        <span className="text-xs font-bold uppercase tracking-wider">{sess.studentsCount} Peers Live</span>
                      </div>

                      {/* Proctoring status toggle */}
                      <button
                        onClick={() => handleToggleProctoring(sess.id)}
                        className={`flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider transition ${
                          sess.proctoringActive
                            ? 'bg-green-500/10 text-green-600 border-green-500/25'
                            : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                        }`}
                        title="Force Smart proctoring protocols on this room"
                      >
                        <Shield size={12} />
                        <span>AI PROCTOR: {sess.proctoringActive ? 'ON' : 'OFF'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => triggerSystemAlert(`Administrative Audit: Accessing session decryption payload for "${sess.title}"`)}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-705 text-[11px] font-black rounded-lg uppercase tracking-wider transition"
                      >
                        Audit
                      </button>
                      <button 
                        onClick={() => handleTerminateSession(sess.id, sess.title)}
                        className="px-3 py-1.5 bg-crimson/10 hover:bg-crimson border-crimson/20 border hover:border-transparent text-crimson hover:text-white text-[11px] font-black rounded-lg uppercase tracking-wider transition"
                      >
                        Kill Room
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'proctoring' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={16} className="text-crimson" />
                  Smart AI Proctoring & Academic Integrity Logs
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Automated computer-vision & behavioral triggers flagged on user webcams/screens. Take administrative action.
                </p>
              </div>

              {/* Search integrity */}
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter integrity list..."
                  value={proctoringSearch}
                  onChange={(e) => setProctoringSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-250 dark:border-slate-850 rounded-xl bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-crimson focus:outline-none"
                />
              </div>
            </div>

            {/* Logs table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-400 font-extrabold uppercase border-b border-slate-200 dark:border-slate-800">
                      <th className="px-5 py-3">Learner Profile</th>
                      <th className="px-5 py-3">Academic Lecture</th>
                      <th className="px-5 py-3">Integrity Violation</th>
                      <th className="px-5 py-3">Telemetry Severity</th>
                      <th className="px-5 py-3">UTC Time</th>
                      <th className="px-5 py-3 text-center">Audit Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-800/80">
                    {proctoringLogs
                      .filter(log => 
                        log.studentName.toLowerCase().includes(proctoringSearch.toLowerCase()) ||
                        log.violationType.toLowerCase().includes(proctoringSearch.toLowerCase())
                      )
                      .map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                          <td className="px-5 py-4 font-black text-slate-900 dark:text-white">
                            {log.studentName}
                          </td>
                          <td className="px-5 py-4 text-slate-500 dark:text-slate-400 font-semibold">
                            {log.courseName}
                          </td>
                          <td className="px-5 py-4">
                            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                              <AlertTriangle size={12} />
                              {log.violationType}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              log.severity === 'High'
                                ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                                : log.severity === 'Medium'
                                  ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                  : 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20'
                            }`}>
                              {log.severity}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-slate-400 dark:text-slate-500 font-bold">
                            {log.loggedTime}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {log.status === 'Unresolved' ? (
                                <>
                                  <button
                                    onClick={() => handleAuditAction(log.id, 'Warning_Sent')}
                                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-black text-[10px] rounded uppercase tracking-wider transition"
                                  >
                                    Warn Learner
                                  </button>
                                  <button
                                    onClick={() => handleAuditAction(log.id, 'Audit_Cleared')}
                                    className="px-2.5 py-1 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 font-black text-[10px] rounded uppercase tracking-wider transition"
                                  >
                                    Clear Flag
                                  </button>
                                </>
                              ) : (
                                <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${
                                  log.status === 'Warning_Sent' 
                                    ? 'text-amber-500' 
                                    : 'text-green-500'
                                }`}>
                                  {log.status === 'Warning_Sent' ? (
                                    <>
                                      <VolumeX size={12} /> Warning Out
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle size={12} /> Audited & Clear
                                    </>
                                  )}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Universal Student Attendance Ledger
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Validate GPS biometric geo-location checkins or clear absentees with official clinical/academic excuses.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter student lists..."
                  value={attendanceSearch}
                  onChange={(e) => setAttendanceSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-250 dark:border-slate-850 rounded-xl bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-crimson focus:outline-none"
                />
              </div>
            </div>

            {/* Attendance checklist Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-400 font-extrabold uppercase border-b border-slate-200 dark:border-slate-800">
                      <th className="px-5 py-3">Student Name</th>
                      <th className="px-5 py-3">Virtual Lab</th>
                      <th className="px-5 py-3">Verification Mechanism</th>
                      <th className="px-5 py-3">Sync Attendance Rate</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-center">Compliance Override</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-800/80">
                    {attendanceLogs
                      .filter(att => att.studentName.toLowerCase().includes(attendanceSearch.toLowerCase()))
                      .map(att => (
                        <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                          <td className="px-5 py-4 font-black text-slate-900 dark:text-white">
                            {att.studentName}
                          </td>
                          <td className="px-5 py-4 text-slate-500 dark:text-slate-405 font-bold uppercase">
                            {att.className}
                          </td>
                          <td className="px-5 py-4 text-slate-400 dark:text-slate-500 font-semibold">
                            {att.verifiedBy}
                          </td>
                          <td className="px-5 py-4 font-mono font-bold">
                            <span className={att.attendanceScore < 50 ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}>
                              {att.attendanceScore}% Score
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              att.status === 'Present'
                                ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                                : att.status === 'Late'
                                  ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                  : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                            }`}>
                              {att.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            {att.status !== 'Present' ? (
                              <button
                                onClick={() => handleExcusalAttendance(att.id)}
                                className="px-2.5 py-1 bg-crimson hover:bg-red-800 text-white font-black text-[10px] rounded uppercase tracking-wider transition"
                              >
                                Excuse Absence
                              </button>
                            ) : (
                              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                                <CheckCircle size={12} className="text-green-500" /> Locked & Signed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Emergency & general campus broadcasts
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Instantly inject priority alert notices directly onto active learner dashboard canvases and virtual video rooms.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Broadcast creator */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Launch New Broadcast</h3>
                <form onSubmit={handleBroadcastAnnouncement} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Announcement String</label>
                    <textarea
                      rows={4}
                      value={globalAnnouncement}
                      onChange={(e) => setGlobalAnnouncement(e.target.value)}
                      placeholder="Input vital notification details to inject on student screens..."
                      className="w-full p-3 border border-slate-250 dark:border-slate-80 w-full rounded-xl bg-slate-50/50 dark:bg-slate-950 text-xs focus:ring-1 focus:ring-crimson focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-crimson hover:bg-red-800 text-white text-xs font-black rounded-xl uppercase tracking-wider shadow transition"
                  >
                    <Volume2 size={14} />
                    <span>Broadcast Instantly</span>
                  </button>
                </form>
              </div>

              {/* Broadcast active registry */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Active Alert Logs</h3>
                <div className="space-y-4">
                  {announcementsLog.map(ann => (
                    <div 
                      key={ann.id}
                      className="border border-slate-150 dark:border-slate-800/80 p-4 rounded-xl space-y-2 relative"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          ann.type === 'Critical' || ann.type === 'Alert'
                            ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                            : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                        }`}>
                          {ann.type}
                        </span>
                        <span className="text-[10px] text-slate-450 font-bold">{ann.date}</span>
                      </div>
                      <p className="text-xs font-semibold leading-relaxed text-slate-800 dark:text-slate-200">
                        "{ann.message}"
                      </p>
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 pt-1">
                        <span>Speaker: {ann.postedBy}</span>
                        <button 
                          onClick={() => {
                            setAnnouncementsLog(prev => prev.filter(a => a.id !== ann.id));
                            triggerSystemAlert("Alert dismissed from channels");
                          }}
                          className="text-crimson hover:underline"
                        >
                          Dismiss Alert
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'regulations' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Autonomous Integrity Compliance Benchmarks
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Customize AI security bounds, computer-vision proctoring parameters, and smart identity check guidelines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Proctor sliders */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-6">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Sliders size={13} />
                  Algorithmic Limits Settings
                </h3>

                {/* Slider 1 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-extrabold uppercase">
                    <span>Biometric Match Rate Threshold</span>
                    <span className="text-crimson font-black">{biometricLivenessRate}% Liveness</span>
                  </div>
                  <input
                    type="range"
                    min={85}
                    max={99}
                    value={biometricLivenessRate}
                    onChange={(e) => setBiometricLivenessRate(Number(e.target.value))}
                    className="w-full accent-crimson bg-slate-100 dark:bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">
                    Calculates Facial ID micro-expression criteria to match logged learner profiles. Greater numbers decrease false security acceptances.
                  </p>
                </div>

                {/* Slider 2 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-extrabold uppercase">
                    <span>Forbidden Tab Switch Cap</span>
                    <span className="text-crimson font-black">{tabWarningThreshold} Safe Occurrences</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={tabWarningThreshold}
                    onChange={(e) => setTabWarningThreshold(Number(e.target.value))}
                    className="w-full accent-crimson bg-slate-100 dark:bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">
                    Defines the amount of times a student can switch away from active exam browser scopes before automated proctors block exam evaluation.
                  </p>
                </div>
              </div>

              {/* Compliance toggles */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Lock size={13} /> Mandatory Verification Rules
                </h3>

                <div className="space-y-3.5">
                  {[
                    { title: "Smart Proctoring on Session Creation", desc: "Forces automated video feedback buffers to stay on for all freshly-created classroom sessions.", state: requireSmartProctoringOnCreation, toggle: () => setRequireSmartProctoringOnCreation(!requireSmartProctoringOnCreation) },
                    { title: "Require Continuous Multi-Face Detection", desc: "Instantly flag feeds if extra people step within active webcam frames during exams.", state: true, toggle: () => triggerSystemAlert("Option locked by board administrator settings.") },
                    { title: "Integrate Real-time Ambient Audio Filtering", desc: "Utilize decibel voice scanning to warn students discussing parameters aloud during evaluation tasks.", state: false, toggle: () => triggerSystemAlert("Feature requires supplementary microphone hardware tokens.") }
                  ].map((rule, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-4">
                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-slate-850 dark:text-white uppercase tracking-tight block">
                          {rule.title}
                        </span>
                        <span className="text-[10px] text-slate-400 leading-normal block">
                          {rule.desc}
                        </span>
                      </div>
                      <button
                        onClick={rule.toggle}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 focus:outline-none flex-shrink-0 ${
                          rule.state ? 'bg-crimson flex justify-end' : 'bg-slate-250 dark:bg-slate-800 flex justify-start'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-white shadow-sm"></span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SCHEDULE LAB MODAL WIZARD */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowScheduleModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            ></motion.div>

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 max-w-md w-full relative z-10 text-slate-900 dark:text-white"
            >
              <h3 className="text-base font-black uppercase tracking-tight font-serif text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Schedule Virtual Laboratory Classroom
              </h3>

              <form onSubmit={handleScheduleSession} className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Class / Seminar Topic</label>
                  <input
                    type="text"
                    required
                    value={newSessionTitle}
                    onChange={(e) => setNewSessionTitle(e.target.value)}
                    placeholder="e.g. Balances in Red-Black Binary Trees"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-80 w-full rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:ring-1 focus:ring-crimson focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Master Academic Course</label>
                  <select
                    value={newSessionCourse}
                    onChange={(e) => setNewSessionCourse(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-80 w-full rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:ring-1 focus:ring-crimson focus:outline-none"
                  >
                    <option value="Data Structure & Algorithms">Data Structure & Algorithms</option>
                    <option value="Advanced React & TypeScript">Advanced React & TypeScript</option>
                    <option value="Database Engineering & PostgreSQL">Database Engineering & PostgreSQL</option>
                    <option value="Intro to Machine Learning">Intro to Machine Learning</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Assigned Faculty Member</label>
                    <input
                      type="text"
                      required
                      value={newSessionInstructor}
                      onChange={(e) => setNewSessionInstructor(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-80 w-full rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:ring-1 focus:ring-crimson focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Scheduled UTC Time</label>
                    <input
                      type="text"
                      required
                      value={newSessionTime}
                      onChange={(e) => setNewSessionTime(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-80 w-full rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:ring-1 focus:ring-crimson focus:outline-none"
                    />
                  </div>
                </div>

                {/* Switch smart proct */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-350 uppercase">Mandate Smart AI Proctor</span>
                  <button
                    type="button"
                    onClick={() => setRequireSmartProctoringOnCreation(!requireSmartProctoringOnCreation)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 focus:outline-none flex-shrink-0 ${
                      requireSmartProctoringOnCreation ? 'bg-crimson flex justify-end' : 'bg-slate-200 dark:bg-slate-800 flex justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-sm"></span>
                  </button>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-200 text-xs font-black rounded-xl uppercase tracking-wider transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-crimson hover:bg-red-800 text-white text-xs font-black rounded-xl uppercase tracking-wider shadow transition"
                  >
                    Publish Lab Room
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
