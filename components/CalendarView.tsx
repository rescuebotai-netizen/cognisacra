
import React, { useState, useMemo } from 'react';
import { Course, MentorshipMeeting } from '../types';
import CalendarIcon from './icons/CalendarIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface CalendarViewProps {
    courses: Course[];
    mentorshipMeetings: MentorshipMeeting[];
}

type CalendarEventType = 'deadline' | 'quiz' | 'assessment' | 'mentorship' | 'final-exam';

interface CalendarEvent {
    date: Date;
    title: string;
    courseTitle: string;
    id: string;
    type: CalendarEventType;
}

const getEventStyle = (type: CalendarEventType) => {
    switch (type) {
        case 'deadline':
            return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700';
        case 'quiz':
            return 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-700';
        case 'assessment':
            return 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700';
        case 'mentorship':
            return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700';
        case 'final-exam':
            return 'bg-crimson/10 dark:bg-crimson/20 text-crimson dark:text-red-300 border-crimson/20 dark:border-red-500/50';
        default:
            return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600';
    }
};

const CalendarView: React.FC<CalendarViewProps> = ({ courses, mentorshipMeetings }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const events = useMemo((): CalendarEvent[] => {
        const allEvents: CalendarEvent[] = [];
        courses.forEach(course => {
            course.modules.forEach(module => {
                module.lessons.forEach(lesson => {
                    if (lesson.deadline) {
                        let type: CalendarEventType = 'deadline';
                        if (lesson.title.toLowerCase().includes('final exam')) {
                            type = 'final-exam';
                        } else if (lesson.format === 'quiz' || lesson.format === 'adaptive-quiz') {
                            type = 'quiz';
                        } else if (lesson.format === 'project') {
                            type = 'assessment';
                        }
                        allEvents.push({
                            date: new Date(lesson.deadline),
                            title: lesson.title,
                            courseTitle: course.title,
                            id: lesson.id,
                            type,
                        });
                    }
                });
            });
        });

        mentorshipMeetings.forEach(meeting => {
            allEvents.push({
                date: new Date(meeting.date),
                title: meeting.title,
                courseTitle: `With ${meeting.with}`,
                id: meeting.id,
                type: 'mentorship',
            });
        });

        return allEvents;
    }, [courses, mentorshipMeetings]);

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    const calendarDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
        }
        return days;
    }, [currentDate, startDay, daysInMonth]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };
    
    const calendarMonthId = "calendar-month-heading";

    const legendItems: { type: CalendarEventType, label: string }[] = [
        { type: 'deadline', label: 'Deadline' },
        { type: 'quiz', label: 'Quiz' },
        { type: 'assessment', label: 'Assessment' },
        { type: 'mentorship', label: 'Mentorship' },
        { type: 'final-exam', label: 'Final Exam' },
    ];

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-center">
                    <CalendarIcon className="w-8 h-8 text-blue-500" />
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white ml-3">My Calendar</h1>
                </div>
                <button className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Export Calendar (iCal)
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Previous month">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <h2 id={calendarMonthId} className="text-xl font-bold text-gray-900 dark:text-white" aria-live="polite">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Next month">
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-xs justify-center">
                    {legendItems.map(item => (
                        <div key={item.type} className="flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-2 ${getEventStyle(item.type).split(' ')[0]}`}></span>
                            <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                        </div>
                    ))}
                </div>
                <div className="overflow-x-auto">
                    <div role="grid" aria-labelledby={calendarMonthId} className="min-w-[40rem] md:min-w-full">
                        <div role="row" className="grid grid-cols-7 gap-1 text-center font-semibold text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} role="columnheader">{day}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day, index) => {
                                const dayEvents = day ? events.filter(e => e.date.toDateString() === day.toDateString()) : [];
                                const dayLabel = day ? `${day.toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric' })}${dayEvents.length > 0 ? `, ${dayEvents.length} events` : ''}` : 'Empty day';
                                return (
                                    <div 
                                        key={index} 
                                        role="gridcell"
                                        aria-label={dayLabel}
                                        className={`h-32 border border-gray-200 dark:border-gray-700 rounded-md p-2 flex flex-col ${day ? '' : 'bg-gray-50 dark:bg-gray-800/50'}`}
                                    >
                                        {day && (
                                            <>
                                                <span className={`font-semibold ${isToday(day) ? 'bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center' : ''}`}>
                                                    {day.getDate()}
                                                </span>
                                                <div className="mt-1 space-y-1 overflow-y-auto">
                                                    {dayEvents.map(event => (
                                                        <div key={event.id} className={`p-1 rounded-md text-left border-l-4 ${getEventStyle(event.type)}`}>
                                                            <p className="text-xs font-bold truncate">{event.title}</p>
                                                            <p className="text-xs opacity-80 truncate">{event.courseTitle}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
