import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClassSession } from './types';

interface AcademicCalendarProps {
  sessions: ClassSession[];
  onAddSession: (newSession: ClassSession) => void;
  onJoinSession: (session: ClassSession) => void;
  userRole?: 'learner' | 'instructor' | 'institution';
}

export const AcademicCalendar: React.FC<AcademicCalendarProps> = ({ sessions, onAddSession, onJoinSession, userRole = 'learner' }) => {
  const isInstructor = userRole === 'instructor' || userRole === 'institution';
  const [viewType, setViewType] = useState<'week' | 'month' | 'agenda'>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('Data Structure & Algorithms');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00');
  const [newDuration, setNewDuration] = useState('60');

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(currentDate);
    const day = d.getDay();
    const diff = d.getDate() - day + i;
    return new Date(d.setDate(diff));
  });

  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const handlePrevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const handleNextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    onAddSession({
      id: Math.random().toString(),
      title: isInstructor ? newTitle : `1-on-1 Office: ${newTitle}`,
      courseName: newCourse,
      instructor: 'Dr. Joseph Adebayo',
      dateTime: `${newDate || currentDate.toISOString().split('T')[0]}T${newTime}:00`,
      duration: `${newDuration} min`,
      isLive: false,
      isOfficeHour: !isInstructor,
    } as any);

    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div id="academic-calendar" className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
            <CalendarIcon className="text-indigo-600 w-5 h-5" />
            Class Schedule & Booking
          </h2>
          <p className="text-sm text-slate-500">Plan courses, reschedule slots, and join upcoming live sessions</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="btn-agenda"
            onClick={() => setViewType('agenda')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              viewType === 'agenda' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Agenda
          </button>
          <button
            id="btn-week"
            onClick={() => setViewType('week')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              viewType === 'week' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Week
          </button>
          {isInstructor ? (
            <button
              id="btn-add-class"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition shadow-sm ml-2"
            >
              <Plus size={14} /> Schedule New Lecture
            </button>
          ) : (
            <button
              id="btn-book-office-hours"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition shadow-sm ml-2"
            >
              <Plus size={14} /> Book Office Hours
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
        <div className="flex items-center gap-2">
          <button id="btn-prev-week" onClick={handlePrevWeek} className="p-1 hover:bg-slate-200 rounded text-slate-600">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-semibold text-slate-800">
            {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
            {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <button id="btn-next-week" onClick={handleNextWeek} className="p-1 hover:bg-slate-200 rounded text-slate-600">
            <ChevronRight size={18} />
          </button>
        </div>
        <button
          id="btn-today"
          onClick={() => setCurrentDate(new Date())}
          className="px-2.5 py-1 text-xs border border-slate-200 font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded"
        >
          Today
        </button>
      </div>

      {viewType === 'agenda' ? (
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No scheduled classes.</div>
          ) : (
            sessions.map((session) => {
              const sDate = new Date(session.dateTime);
              return (
                <div
                  id={`agenda-item-${session.id}`}
                  key={session.id}
                  className="flex items-center justify-between bg-slate-50 hover:bg-indigo-50/10 p-4 rounded-xl border border-slate-100 transition duration-150"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-lg">
                      <CalendarIcon size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm leading-tight">{session.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <span className="font-medium text-indigo-600">{session.courseName}</span>
                        <span>•</span>
                        <span>Dr. Adebayo</span>
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 mt-1.5 font-medium">
                        <Clock size={12} />
                        {sDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} •{' '}
                        {sDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} ({session.duration})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {session.isLive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded-full animate-pulse">
                        ● LIVE NOW
                      </span>
                    ) : null}
                    <button
                      id={`btn-join-agenda-${session.id}`}
                      onClick={() => onJoinSession(session)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                        session.isLive
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 animate-bounce'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {session.isLive ? 'Join Live Class' : 'Enter Classroom'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="p-2.5 text-left text-xs font-semibold text-slate-500 w-20">Time</th>
                {weekDates.map((date, idx) => (
                  <th key={idx} className="p-2.5 text-center text-xs font-semibold text-slate-700">
                    <div className="text-[11px] uppercase font-bold text-slate-400">{daysOfWeek[idx]}</div>
                    <div className="text-sm font-bold mt-0.5 text-slate-800">{date.getDate()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot, timeIdx) => (
                <tr key={timeIdx} className="border-b border-indigo-50/50 hover:bg-slate-50/20">
                  <td className="p-2 text-xs font-bold text-slate-400 font-mono align-top pt-3">{slot}</td>
                  {weekDates.map((date, dayIdx) => {
                    const matched = sessions.filter((s) => {
                      const sDate = new Date(s.dateTime);
                      return sDate.getDay() === dayIdx && sDate.getHours().toString().padStart(2, '0') === slot.split(':')[0];
                    });

                    return (
                      <td key={dayIdx} className="p-1 min-h-[60px] border-r border-indigo-50/30 align-top">
                        {matched.map((session) => (
                          <div
                            id={`cal-session-${session.id}`}
                            key={session.id}
                            onClick={() => onJoinSession(session)}
                            className={`p-2 rounded-lg cursor-pointer transition select-none ${
                              session.isLive
                                ? 'bg-gradient-to-r from-red-500 to-indigo-600 text-white hover:shadow-md'
                                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900'
                            }`}
                          >
                            <h5 className="text-[11px] font-bold leading-tight truncate">{session.title}</h5>
                            <p className="text-[9px] opacity-90 truncate mt-0.5 font-medium">{session.courseName}</p>
                            <div className="flex items-center gap-0.5 mt-1 text-[9px] opacity-80 truncate">
                              <Clock size={8} /> {session.duration}
                            </div>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Booking Form Dialog */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              id="add-class-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-100"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CalendarIcon className={isInstructor ? "text-indigo-600" : "text-emerald-600"} size={18} />
                {isInstructor ? 'Schedule Live Class session' : 'Book Tutoring Office Hours'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    {isInstructor ? 'Classroom Subject *' : 'Tutoring Discussion Topic *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={isInstructor ? "e.g. Dynamic Programming Optimization" : "e.g. Help on AVL single rotations"}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Course Track</label>
                  <select
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                  >
                    <option value="Data Structure & Algorithms">Data Structure & Algorithms</option>
                    <option value="Advanced React & TypeScript">Advanced React & TypeScript</option>
                    <option value="Database Engineering & PostgreSQL">Database Engineering & PostgreSQL</option>
                    <option value="AI-Powered Platform Architecture">AI-Powered Platform Architecture</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Date</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Time Slot</label>
                    <select
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none"
                    >
                      {timeSlots.map((ts) => (
                        <option key={ts} value={ts}>
                          {ts}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Duration</label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                  >
                    <option value="30">30 Minutes</option>
                    <option value="60">60 Minutes</option>
                    <option value="90">90 Minutes</option>
                    <option value="120">120 Minutes</option>
                  </select>
                </div>
                <div className="flex gap-2 justify-end pt-3">
                  <button
                    type="button"
                    id="btn-cancel-add"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-semibold border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="btn-submit-add"
                    className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Confirm Booking
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
