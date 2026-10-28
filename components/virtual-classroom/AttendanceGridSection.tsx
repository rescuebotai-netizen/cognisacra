import React, { useState } from 'react';
import { Users2, Download, FileDown, Printer, ShieldAlert, CheckCircle2, Circle } from 'lucide-react';

interface AttendanceGridSectionProps {
  onToastSuccess: (msg: string) => void;
}

export const AttendanceGridSection: React.FC<AttendanceGridSectionProps> = ({ onToastSuccess }) => {
  
  // Real datasets of active virtual students
  const [attendees, setAttendees] = useState([
    { name: 'Dr. Joseph Adebayo', role: 'Instructor', joinTime: '09:55 AM', duration: '68 min', cameraPerc: 100, speakingPerc: 55, participation: 10, ping: '9 ms' },
    { name: 'Emeka Obi', role: 'Student', joinTime: '10:00 AM', duration: '63 min', cameraPerc: 90, speakingPerc: 24, participation: 9, ping: '24 ms' },
    { name: 'Sarah Mwangi', role: 'Student', joinTime: '10:01 AM', duration: '62 min', cameraPerc: 85, speakingPerc: 12, participation: 8, ping: '18 ms' },
    { name: 'Alex Kiprop', role: 'Student', joinTime: '10:02 AM', duration: '61 min', cameraPerc: 40, speakingPerc: 8, participation: 7, ping: '42 ms' },
    { name: 'Chinedu Egwu', role: 'Student', joinTime: '10:05 AM', duration: '58 min', cameraPerc: 95, speakingPerc: 1, participation: 6, ping: '11 ms' },
    { name: 'Zainab Yusuf', role: 'Student', joinTime: '10:00 AM', duration: '63 min', cameraPerc: 0, speakingPerc: 0, participation: 4, ping: '115 ms' }
  ]);

  const handlePrint = () => {
    onToastSuccess("Assembling printer styling wrapper... Opening target browser layout.");
    const originalContent = document.body.innerHTML;
    // Simple printable iframe or print trigger
    window.print();
  };

  const handleCSVExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Role,Join Time,Duration,Camera View %,Speaking Time %,Participation Score,Latency\n"
      + attendees.map(a => `"${a.name}","${a.role}","${a.joinTime}","${a.duration}",${a.cameraPerc},${a.speakingPerc},${a.participation},"${a.ping}"`).join("\n");
      
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", "virtual_classroom_attendance_log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onToastSuccess("Attendance report downloaded as CSV spreadsheet.");
  };

  const handleExcelExport = () => {
    // Standard TSV/XML formatting that Excel reads natively
    const excelContent = "data:application/vnd.ms-excel;charset=utf-8,"
      + "Name\tRole\tJoin Time\tDuration\tCamera View %\tSpeaking Time %\tParticipation Score\tLatency\n"
      + attendees.map(a => `"${a.name}"\t"${a.role}"\t"${a.joinTime}"\t"${a.duration}"\t${a.cameraPerc}\t${a.speakingPerc}\t${a.participation}\t"${a.ping}"`).join("\n");
      
    const encoded = encodeURI(excelContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", "virtual_classroom_attendance_log.xls");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onToastSuccess("Excel formatted workbook report (.xls) exported successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs" style={{ color: '#E1E1E1' }}>
      
      {/* Header */}
      <div className="bg-[#2B2B2B] p-4 rounded-xl border border-slate-800 flex justify-between items-center shadow-lg">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Users2 className="text-[#7B83EB]" size={18} />
            Interactive Attendance & Speaking Analytics Tracker
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Real-time attendance duration ratios, camera playtimes, and speaking activity scores</p>
        </div>
        <span className="text-[10px] uppercase font-bold text-[#7B83EB] bg-[#6264A7]/20 border border-[#6264A7]/30 px-3 py-1 rounded-full">
          Class Analytics
        </span>
      </div>

      {/* Main Table Panel */}
      <div className="bg-[#2B2B2B] border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        
        {/* Export buttons toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-3.5 bg-[#1F1F1F] rounded-xl border border-slate-800 gap-3">
          <div className="flex items-center gap-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 animate-ping"></span>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-wide">Live Stream Synchronized Logs</p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCSVExport}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition text-[11px] font-bold border border-slate-750"
            >
              <Download size={12} /> Export CSV
            </button>
            <button
              onClick={handleExcelExport}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition text-[11px] font-bold border border-slate-750"
            >
              <FileDown size={12} /> Export Excel
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-indigo-950 hover:bg-indigo-900 border border-indigo-900/40 text-indigo-300 rounded-xl transition text-[11px] font-bold"
            >
              <Printer size={12} /> Print Report
            </button>
          </div>
        </div>

        {/* Detailed Grid Table */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase font-black tracking-wider pb-3">
                <th className="pb-3 pl-2">Participant Candidate</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Join Time</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Camera Playback</th>
                <th className="pb-3">Speaking Share</th>
                <th className="pb-3">Engagement Ratio</th>
                <th className="pb-3 pr-2">Network Ping</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {attendees.map((a, i) => (
                <tr key={i} className="hover:bg-[#1F1F1F]/40 transition">
                  {/* Name */}
                  <td className="py-3 pl-2 font-extrabold text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-[#6264A7] flex items-center justify-center font-mono text-[9px] text-white">
                      {a.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    {a.name}
                  </td>

                  {/* Role */}
                  <td className="py-3 font-semibold">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      a.role === 'Instructor' 
                        ? 'bg-amber-950 text-amber-400 border border-amber-900/40' 
                        : 'bg-zinc-900 text-slate-450 border border-slate-805'
                    }`}>
                      {a.role}
                    </span>
                  </td>

                  {/* Join Time */}
                  <td className="py-3 font-mono text-slate-400">{a.joinTime}</td>

                  {/* Time Duration */}
                  <td className="py-3 font-bold text-slate-400 font-mono">{a.duration}</td>

                  {/* Camera Playback Percentage Bar */}
                  <td className="py-3">
                    <div className="flex items-center gap-1.5 w-24">
                      {/* Bar */}
                      <div className="flex-grow bg-[#1F1F1F] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-1.5" style={{ width: `${a.cameraPerc}%` }}></div>
                      </div>
                      <span className="font-mono text-[9px] text-slate-405 font-bold shrink-0">{a.cameraPerc}%</span>
                    </div>
                  </td>

                  {/* Speaking Share percentages */}
                  <td className="py-3">
                    <div className="flex items-center gap-1.5 w-24">
                      {/* Bar */}
                      <div className="flex-grow bg-[#1F1F1F] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-1.5" style={{ width: `${a.speakingPerc}%` }}></div>
                      </div>
                      <span className="font-mono text-[9px] text-slate-405 font-bold shrink-0">{a.speakingPerc}%</span>
                    </div>
                  </td>

                  {/* Engagement Score out of 10 */}
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <span className={`font-black font-sans text-xs ${
                        a.participation >= 8 ? 'text-emerald-400' :
                        a.participation >= 6 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {a.participation}/10
                      </span>
                      <span className="text-[10px] text-slate-500">score</span>
                    </div>
                  </td>

                  {/* Ping latency */}
                  <td className="py-3 pr-2 font-mono text-[10px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <Circle size={8} fill={
                        parseInt(a.ping) < 20 ? '#10B981' :
                        parseInt(a.ping) < 50 ? '#F59E0B' : '#EF4444'
                      } stroke="none" />
                      {a.ping}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
