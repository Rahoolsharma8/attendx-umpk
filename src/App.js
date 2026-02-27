import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, ArrowLeft, Home, Info, ShieldCheck, Search, 
  BookOpen, Monitor, Database, Cpu, Briefcase, Globe, Award,
  ChevronDown, History, FileText, Download, Trash2, Share2, X,
  Heart, Terminal, User, Edit3, List, Calendar, Sparkles, Activity, Bell, Clock, UserCircle, FileSpreadsheet
} from 'lucide-react';

/**
 * ATTENDX PRO - UNIVERSITY OF MIRPURKHAS (UMPK)
 * Developed by: Computer Science Department
 * Lead Developer: Rahool
 * Version: 23.0 (Master Scroll Fix & Document-Only Share Logic)
 */

const DEPARTMENTS_CONFIG = {
  'CS': {
    name: 'Computer Science',
    icon: Monitor,
    color: 'bg-red-50 text-[#800000]',
    programs: [
      { name: 'Bachelor’s Degree Programmes (4 Years) (Morning)', sems: [1,2,3,4,5,6,7,8] },
      { name: 'BS (3rd Year - 5th Semester) (Morning)', sems: [5,6,7,8] },
      { name: 'Bachelor’s Degree Programmes (4 Years) (Evening)', sems: [1,2,3,4,5,6,7,8] }
    ]
  },
  'IT': {
    name: 'Information Technology',
    icon: Globe,
    color: 'bg-blue-50 text-blue-700',
    programs: [
      { name: 'Bachelor’s Degree Programmes (4 Years) (Morning)', sems: [1,2,3,4,5,6,7,8] },
      { name: 'BS (3rd Year - 5th Semester) (Morning)', sems: [5,6,7,8] },
      { name: 'Bachelor’s Degree Programmes (4 Years) (Evening)', sems: [1,2,3,4,5,6,7,8] }
    ]
  },
  'BBA': {
    name: 'Business Administration',
    icon: Briefcase,
    color: 'bg-amber-50 text-amber-700',
    programs: [
      { name: 'Bachelor’s Degree Programmes (4 Years) (Morning)', sems: [1,2,3,4,5,6,7,8] },
      { name: 'BS (3rd Year - 5th Semester) (Morning)', sems: [5,6,7,8] },
      { name: 'Bachelor’s Degree Programmes (4 Years) (Evening)', sems: [1,2,3,4,5,6,7,8] }
    ]
  },
  'Commerce': {
    name: 'Commerce',
    icon: Database,
    color: 'bg-orange-50 text-orange-800',
    programs: [
      { name: 'Bachelor’s Degree Programmes (4 Years) (Morning)', sems: [1,2,3,4,5,6,7,8] },
      { name: 'BS (3rd Year - 5th Semester) (Morning)', sems: [5,6,7,8] },
      { name: 'Bachelor’s Degree Programmes (4 Years) (Evening)', sems: [1,2,3,4,5,6,7,8] }
    ]
  },
  'Geology': {
    name: 'Geology',
    icon: Activity,
    color: 'bg-emerald-50 text-emerald-700',
    programs: [
      { name: 'Bachelor’s Degree Programmes (4 Years) (Morning)', sems: [1,2,3,4,5,6,7,8] },
      { name: 'BS (3rd Year - 5th Semester) (Morning)', sems: [5,6,7,8] }
    ]
  },
  'Education': {
    name: 'Education',
    icon: BookOpen,
    color: 'bg-purple-50 text-purple-700',
    programs: [
      { name: 'Bachelor’s Degree Programmes (4 Years) (Morning)', sems: [1,2,3,4,5,6,7,8] },
      { name: 'Master’s Degree Programmes (Weekend)', sems: [1,2,3,4] }
    ]
  },
  'AI': {
    name: 'Artificial Intelligence',
    icon: Cpu,
    color: 'bg-indigo-50 text-indigo-700',
    programs: [{ name: 'Bachelor’s Degree Programmes (4 Years) (Morning)', sems: [1,2,3,4,5,6,7,8] }]
  },
  'DS': {
    name: 'Data Science',
    icon: ShieldCheck,
    color: 'bg-teal-50 text-teal-700',
    programs: [{ name: 'Bachelor’s Degree Programmes (4 Years) (Morning)', sems: [1,2,3,4,5,6,7,8] }]
  }
};

const SUBJECT_MAP = {
  '1': ['ICT', 'Programming Fundamentals', 'Calculus', 'English-I', 'Physics', 'Islamic Studies'],
  '2': ['OOP', 'Discrete Structures', 'Digital Logic Design', 'English-II', 'Stats', 'Pakistan Studies'],
  '3': ['Data Structures', 'COAL', 'Software Requirement Eng.', 'Technical Writing'],
  '4': ['Operating Systems', 'Analysis of Algorithms', 'Database Systems', 'Linear Algebra'],
  '5': ['Computer Networks', 'Automata Theory', 'Software Engineering'],
  '6': ['Parallel Processing', 'AI Theory', 'Mobile Dev'],
  '7': ['Cloud Computing', 'Information Security', 'FYP-1'],
  '8': ['Data Science', 'Professional Practices', 'FYP-2']
};

const STUDENT_LIST = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  roll: (i + 1).toString()
}));

const App = () => {
  const [view, setView] = useState('splash');
  const [activeTab, setActiveTab] = useState('home'); 
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedProgramObj, setSelectedProgramObj] = useState(null);
  const [selectedSem, setSelectedSem] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('2k23');
  const [isManualSubject, setIsManualSubject] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [savedRecords, setSavedRecords] = useState([]);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setView('main'), 2800);
    const localRecords = localStorage.getItem('attendx_v23_final_db');
    if (localRecords) setSavedRecords(JSON.parse(localRecords));
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFinalize = () => {
    if (!selectedSubject) return showToast("Pehle subject select karein!");
    const presentRolls = STUDENT_LIST.filter(s => attendance[s.id] === 'Present').map(s => s.id).sort((a, b) => a - b);
    
    const uniqueKey = `${selectedDept}_${selectedProgramObj?.name}_${selectedSem}_${selectedSubject.replace(/\s+/g, '_')}_${selectedBatch}`;
    const newSession = { date, presentRolls: presentRolls.join(','), totalPresent: presentRolls.length };
    
    let updatedRecords = [...savedRecords];
    const existingIndex = updatedRecords.findIndex(r => r.uniqueKey === uniqueKey);

    if (existingIndex !== -1) {
      const sessionIndex = updatedRecords[existingIndex].sessions.findIndex(s => s.date === date);
      if (sessionIndex !== -1) updatedRecords[existingIndex].sessions[sessionIndex] = newSession;
      else updatedRecords[existingIndex].sessions.push(newSession);
      updatedRecords[existingIndex].sessions.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      updatedRecords = [{ 
        uniqueKey, dept: selectedDept, program: selectedProgramObj?.name,
        sem: selectedSem, batch: selectedBatch, subject: selectedSubject, sessions: [newSession]
      }, ...updatedRecords];
    }
    
    setSavedRecords(updatedRecords);
    localStorage.setItem('attendx_v23_final_db', JSON.stringify(updatedRecords));
    showToast("Attendance Recorded Successfully!");
    setAttendance({});
    setSelectedSubject('');
    setIsManualSubject(false);
    setSelectedSem(null);
    setSelectedProgramObj(null);
    setSelectedDept(null);
    setActiveTab('home');
  };

  const formatReportContent = (rec) => {
    let content = `Name: ${rec.dept} , Semester: ${rec.sem} , Batch: ${rec.batch}\n`;
    content += `Program: ${rec.program}\n`;
    content += `Subject: ${rec.subject}\n`;
    content += `------------------------------------------\n`;
    rec.sessions.forEach(s => {
      content += `Date: ${s.date}\nPresent Roll Numbers:\n${s.presentRolls}\n`;
      content += `------------------------------------------\n`;
    });
    content += `UMPK AttendX Pro Official Report`;
    return content;
  };

  const formatCSVContent = (rec) => {
    let csv = `Date,Present Roll Numbers,Total Present\n`;
    rec.sessions.forEach(s => {
      csv += `${s.date},"${s.presentRolls}",${s.totalPresent}\n`;
    });
    return csv;
  };

  const handleShareFile = async (rec, type) => {
    const isCSV = type === 'csv';
    const content = isCSV ? formatCSVContent(rec) : formatReportContent(rec);
    const ext = isCSV ? 'csv' : 'txt';
    const mime = isCSV ? 'text/csv' : 'text/plain';
    const fileName = `Attendance_${rec.dept}_${rec.batch}_${Date.now()}.${ext}`;

    try {
      const blob = new Blob([content], { type: mime });
      const file = new File([blob], fileName, { type: mime, lastModified: Date.now() });

      // CRITICAL FIX: Removed 'text' field to prevent system from defaulting to text message share
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Attendance Document`
        });
        showToast("Opening Document Share...");
      } else {
        const encoded = encodeURIComponent(formatReportContent(rec));
        window.open(`https://wa.me/?text=${encoded}`, '_blank');
      }
    } catch (e) {
      showToast("Sharing restricted by browser.");
    }
  };

  const handleDownloadDirect = (rec, type) => {
    const isCSV = type === 'csv';
    const content = isCSV ? formatCSVContent(rec) : formatReportContent(rec);
    const ext = isCSV ? 'csv' : 'txt';
    const fileName = `Attendance_${rec.dept}_${rec.batch}.${ext}`;
    const blob = new Blob([content], { type: `${isCSV ? 'text/csv' : 'text/plain'};charset=utf-8` });
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 150);
    showToast("File Downloaded!");
  };

  const deleteRecord = (key) => {
    if(!window.confirm("Bhai, kya aap waqayi ye record mita dena chahte hain?")) return;
    const updated = savedRecords.filter(r => r.uniqueKey !== key);
    setSavedRecords(updated);
    localStorage.setItem('attendx_v23_final_db', JSON.stringify(updated));
    showToast("Deleted Permanently");
  };

  const GlobalFooter = () => (
    <div className="mt-auto pt-8 pb-14 flex flex-col items-center gap-3 bg-white w-full border-t border-slate-50 text-center">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center justify-center gap-3 text-center">
         MADE WITH <Heart size={12} className="fill-[#800000] text-[#800000] animate-pulse" /> IN MIRPURKHAS
      </p>
      <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest font-mono text-center">
         © 2026 UMPK. ALL RIGHTS RESERVED.
      </div>
    </div>
  );

  const MarqueeItem = () => (
    <>
      <span className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest"><Monitor size={16} className="text-[#800000]"/> INTELLIGENCE ENGINE</span>
      <span className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest"><Activity size={16} className="text-[#800000]"/> RESPONSIVE UI</span>
      <span className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest"><Globe size={16} className="text-[#800000]"/> UMPK NETWORK</span>
      <span className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest"><ShieldCheck size={16} className="text-[#800000]"/> SECURE ACCESS</span>
    </>
  );

  if (view === 'splash') {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center text-center p-10 select-none overflow-hidden">
        <div className="w-24 h-24 mb-6 bg-[#800000] rounded-[2.2rem] flex items-center justify-center shadow-2xl animate-bounce">
           <BookOpen size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase text-center">AttendX</h1>
        <p className="text-[#800000] text-[10px] tracking-[0.4em] uppercase mt-2 font-black text-center text-center">University of Mirpurkhas</p>
      </div>
    );
  }

  const PageHeader = ({ title, showBack = true, onBack }) => (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 p-4 md:p-5 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4 text-left">
        {showBack && (
          <button onClick={onBack} className="p-2.5 bg-slate-50 rounded-xl active:scale-90 transition-transform"><ArrowLeft size={18}/></button>
        )}
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 bg-[#800000] rounded-xl flex items-center justify-center shadow-md">
             <BookOpen size={20} className="text-white" />
          </div>
          <h2 className="font-black text-slate-900 text-lg uppercase tracking-tighter leading-none text-left">{title}</h2>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 max-w-[450px] mx-auto flex flex-col font-sans relative overflow-hidden text-slate-900 shadow-2xl border-x border-slate-200 antialiased touch-pan-y">
      {notification && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[500] bg-slate-900/95 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-10 duration-300">
          <Bell size={14} className="text-[#800000]" />
          <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{notification}</span>
        </div>
      )}

      {/* 1. DASHBOARD */}
      {activeTab === 'home' && !selectedDept && (
        <div className="flex-1 flex flex-col overflow-y-auto pb-32 bg-white animate-in fade-in duration-500 scroll-smooth">
          <PageHeader title="UMPK PORTAL" showBack={false} />
          <div className="p-5 flex-1">
            <div className="bg-gradient-to-br from-[#800000] to-[#4a0404] rounded-[2.5rem] p-8 text-white shadow-2xl mb-8 relative overflow-hidden text-left">
               <h3 className="text-3xl font-black tracking-tighter mb-1 uppercase leading-none text-left">University Panel</h3>
               <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] text-left">Select Department</p>
               <LayoutGrid className="absolute right-[-20px] bottom-[-20px] opacity-10" size={140} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(DEPARTMENTS_CONFIG).map((id) => (
                <button key={id} onClick={() => setSelectedDept(id)} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all text-center group">
                  <div className={`w-14 h-14 ${DEPARTMENTS_CONFIG[id].color} rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                    {React.createElement(DEPARTMENTS_CONFIG[id].icon, { size: 24 })}
                  </div>
                  <span className="font-black text-slate-800 text-[10px] uppercase tracking-wider text-center leading-tight">{DEPARTMENTS_CONFIG[id].name}</span>
                </button>
              ))}
            </div>
          </div>
          <GlobalFooter />
        </div>
      )}

      {/* 2. PROGRAMS */}
      {selectedDept && !selectedProgramObj && (
        <div className="flex-1 flex flex-col bg-white overflow-y-auto pb-32 animate-in slide-in-from-right-10 duration-500 text-left">
          <PageHeader title={`${selectedDept} PROGRAMS`} onBack={() => setSelectedDept(null)} />
          <div className="p-5 space-y-4">
             {DEPARTMENTS_CONFIG[selectedDept].programs.map((prog, i) => (
               <button key={i} onClick={() => setSelectedProgramObj(prog)} className="w-full bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 active:scale-95 transition-all text-left">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#800000] shadow-sm"><Clock size={20}/></div>
                  <span className="font-black text-slate-800 text-[11px] uppercase tracking-tight leading-tight text-left">{prog.name}</span>
               </button>
             ))}
          </div>
          <GlobalFooter />
        </div>
      )}

      {/* 3. SEMESTERS */}
      {selectedProgramObj && !selectedSem && (
        <div className="flex-1 flex flex-col bg-white overflow-y-auto pb-32 animate-in slide-in-from-right-10 duration-500 text-center">
          <PageHeader title={`CHOOSE SEMESTER`} onBack={() => setSelectedProgramObj(null)} />
          <div className="p-5 grid grid-cols-2 gap-4 mt-2 text-center">
              {selectedProgramObj.sems.map(num => (
                 <button key={num} onClick={() => setSelectedSem(num.toString())} className="bg-slate-50/50 p-7 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-1 active:scale-95 transition-all hover:border-[#800000] text-center">
                    <span className="font-black text-4xl text-slate-900 leading-none text-center">{num}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-center">SEMESTER</span>
                 </button>
              ))}
          </div>
          <GlobalFooter />
        </div>
      )}

      {/* 4. MARKING SHEET (FULL FIXED SCROLL) */}
      {selectedSem && (
        <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-500 bg-slate-50">
          <PageHeader title={`${selectedDept} S${selectedSem}`} onBack={() => setSelectedSem(null)} />
          
          <div className="flex-1 overflow-y-auto p-5 pb-48 space-y-4 touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="bg-white p-6 rounded-[2.2rem] shadow-sm border border-slate-100 space-y-4 text-left">
                <div className="space-y-1.5 text-left">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-black text-[#800000] uppercase tracking-widest text-left">COURSE</label>
                    <button onClick={() => { setIsManualSubject(!isManualSubject); setSelectedSubject(''); }} className="text-[8px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded-md">
                      {isManualSubject ? "LIST" : "MANUAL"}
                    </button>
                  </div>
                  <div className="relative">
                    {isManualSubject ? (
                      <input type="text" placeholder="Course Name..." className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold text-slate-800 text-base border border-transparent focus:border-[#800000]/20 shadow-inner" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} />
                    ) : (
                      <>
                        <select className="w-full p-4 bg-slate-50 rounded-xl appearance-none outline-none font-bold text-slate-800 text-base border border-transparent" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                          <option value="">Select Course...</option>
                          {(SUBJECT_MAP[selectedSem] || []).map(sub => <option key={sub} value={sub}>{sub}</option>)}
                          <option value="Special Session">Special Session</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16}/>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-black text-[#800000] uppercase tracking-widest text-left">DATE</label>
                    <input type="date" className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none font-bold text-slate-800 text-sm" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-black text-[#800000] uppercase tracking-widest text-left">BATCH</label>
                    <input type="text" placeholder="e.g. 2k23" className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none font-bold text-slate-800 text-sm" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} />
                  </div>
                </div>
            </div>

            <div className="relative text-left">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input type="text" placeholder="Filter Roll Numbers..." className="w-full p-4 pl-12 bg-white rounded-xl border border-slate-100 shadow-sm outline-none text-xs font-bold" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            <div className="space-y-2 text-left pb-10">
               {STUDENT_LIST?.filter(s => s.roll.includes(searchQuery)).map(s => (
                  <div key={s.id} className={`bg-white p-4 rounded-[1.8rem] border transition-all flex items-center justify-between shadow-sm ${attendance[s.id] === 'Present' ? 'border-emerald-200 bg-emerald-50/20' : attendance[s.id] === 'Absent' ? 'border-rose-200 bg-rose-50/20' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-4 text-left">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm transition-colors ${attendance[s.id] ? 'bg-[#800000] text-white shadow-md' : 'bg-slate-50 text-slate-300'}`}>{s.roll}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none text-left">{attendance[s.id] || 'MARK'}</div>
                    </div>
                    <div className="flex gap-2.5">
                       <button onClick={() => setAttendance(prev => ({ ...prev, [s.id]: 'Present' }))} className={`w-12 h-12 rounded-full font-black text-sm border-2 transition-all active:scale-90 ${attendance[s.id] === 'Present' ? 'bg-emerald-600 border-emerald-700 text-white shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>P</button>
                       <button onClick={() => setAttendance(prev => ({ ...prev, [s.id]: 'Absent' }))} className={`w-12 h-12 rounded-full font-black text-sm border-2 transition-all active:scale-90 ${attendance[s.id] === 'Absent' ? 'bg-rose-600 border-rose-700 text-white shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>A</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="fixed bottom-0 max-w-[450px] w-full p-8 bg-gradient-to-t from-white via-white/95 to-transparent flex justify-center z-40">
             <button onClick={handleFinalize} className="w-full bg-[#800000] text-white py-5 rounded-[2.2rem] font-black shadow-2xl active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 border-b-4 border-black/20 text-center uppercase">
               <ShieldCheck size={20} /> AUTHORIZE RECORDS
             </button>
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'records' && (
        <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-32 animate-in fade-in duration-500 text-left">
          <PageHeader title="HISTORY" showBack={false} />
          <div className="p-5 space-y-4 flex-1 text-left">
            {savedRecords.length === 0 ? (
              <div className="text-center py-24 opacity-20 flex flex-col items-center">
                <FileText size={60} className="mb-4 text-slate-400 text-center" />
                <p className="font-bold text-[10px] uppercase tracking-widest text-center">No Records Stored</p>
              </div>
            ) : (
              savedRecords.map((rec) => (
                <div key={rec.uniqueKey} className="bg-white p-5 rounded-[2.2rem] shadow-sm border border-slate-100 space-y-4 text-left">
                   <div className="flex justify-between items-start text-left">
                      <div onClick={() => setViewingRecord(rec)} className="flex-1 cursor-pointer text-left">
                        <h4 className="font-black text-slate-900 text-base leading-none tracking-tight text-left mb-2 uppercase">{rec.subject}</h4>
                        <div className="flex flex-col gap-1 text-left">
                          <p className="text-[8px] font-bold text-[#800000] uppercase tracking-widest text-left">{rec.dept} • {rec.batch}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight text-left leading-none text-left">{rec.program}</p>
                          <p className="text-[9px] font-black text-slate-800 text-left text-left">Stored Dates: {rec.sessions.length}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleShareFile(rec, 'csv')} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 active:text-emerald-600 transition-all"><FileSpreadsheet size={20}/></button>
                        <button onClick={() => deleteRecord(rec.uniqueKey)} className="p-2.5 bg-slate-50 rounded-xl text-slate-200 active:text-rose-600 transition-all"><Trash2 size={18}/></button>
                      </div>
                   </div>
                   <button onClick={() => setViewingRecord(rec)} className="w-full bg-[#800000]/5 text-[#800000] py-3.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] active:bg-[#800000] active:text-white transition-all shadow-sm text-center uppercase">OPEN MERGED SHEET</button>
                </div>
              ))
            )}
          </div>
          <GlobalFooter />
        </div>
      )}

      {/* ABOUT TAB */}
      {activeTab === 'info' && (
        <div className="flex-1 flex flex-col bg-white overflow-y-auto pb-32 animate-in fade-in duration-500 text-left overscroll-none text-center">
          <PageHeader title="INTELLIGENCE" showBack={false} />
          <div className="p-5 space-y-6 flex-1 text-center text-center">
             <div className="bg-gradient-to-br from-[#800000] to-[#4a0404] rounded-[2.5rem] p-10 text-white shadow-2xl text-center relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                   <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-[1.8rem] flex items-center justify-center mb-4 text-center">
                      <BookOpen size={40} className="text-white" />
                   </div>
                   <h3 className="text-3xl font-black tracking-tighter mb-1 uppercase leading-none text-center text-center">AttendX Pro</h3>
                   <div className="h-1 w-10 bg-white/20 rounded-full mb-3 mx-auto text-center"></div>
                   <p className="text-[9px] font-bold text-white/50 uppercase tracking-[0.3em] leading-relaxed text-center text-center uppercase">Intelligence Engine</p>
                </div>
                <Sparkles className="absolute top-10 right-10 text-white/5" size={80} />
             </div>

             <div className="space-y-4 px-1 text-left text-left">
                <div className="bg-slate-50 rounded-[2.2rem] p-8 border border-slate-100 shadow-sm text-left relative overflow-hidden text-left">
                   <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-4 text-left uppercase text-left">SYSTEM POWERED BY</p>
                   <h2 className="text-[18px] font-black text-slate-800 leading-tight uppercase tracking-tight mb-6 text-left text-left text-left">INTELLIGENT CORE SYSTEMS</h2>
                   <div className="h-[1px] w-full bg-slate-200 mb-6 opacity-50 text-left"></div>
                   <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-4 text-left uppercase text-left text-left text-left">DEVELOPED BY</p>
                   <h2 className="text-[18px] font-black text-slate-800 leading-tight uppercase tracking-tight text-left text-left text-left">DEPARTMENT OF <span className="text-[#800000]">COMPUTER SCIENCE</span></h2>
                   <div className="flex items-center gap-3 mt-5 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-left text-left text-left text-left text-left">
                      <div className="w-10 h-10 bg-[#800000] rounded-xl flex items-center justify-center text-white text-center text-center text-center text-center"><UserCircle size={24}/></div>
                      <div className="text-left text-left text-left text-left text-left">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 text-left text-left text-left text-left">Lead Developer</p>
                         <p className="font-black text-slate-900 text-base leading-none text-left uppercase text-left text-left text-left">Rahool</p>
                      </div>
                   </div>
                   <p className="font-bold text-slate-400 text-[10px] mt-6 uppercase tracking-widest text-left text-left text-left text-left">University of Mirpurkhas (UMPK)</p>
                </div>
                <div className="p-8 bg-white border border-slate-100 rounded-[2.2rem] flex items-center gap-6 shadow-sm active:bg-slate-50 transition-colors text-left text-left text-left text-left text-left">
                   <div className="w-16 h-16 bg-red-50 text-[#800000] rounded-2xl flex items-center justify-center shadow-inner text-center text-center text-center text-center"><Award size={32} /></div>
                   <div className="text-left flex-1 text-left text-left text-left text-left">
                      <p className="text-[9px] font-black text-red-300 uppercase tracking-[0.2em] mb-1 text-left text-left text-left text-left text-left">PROJECT SUPERVISOR</p>
                      <h4 className="text-xl font-black text-slate-900 leading-none tracking-tighter text-left text-left text-left text-left text-left">Sarvat Nizamani</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-relaxed text-left uppercase text-left text-left text-left text-left">HEAD OF COMPUTER SCIENCE</p>
                   </div>
                </div>
                <div className="overflow-hidden py-5 border-y border-slate-100 relative bg-slate-50/50 rounded-2xl text-left text-left text-left text-left">
                   <div className="flex gap-20 whitespace-nowrap animate-marquee">
                      <MarqueeItem />
                      <MarqueeItem />
                   </div>
                </div>
             </div>
          </div>
          <GlobalFooter />
        </div>
      )}

      {/* SHEET PREVIEW MODAL */}
      {viewingRecord && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[600] flex items-center justify-center p-4 animate-in fade-in duration-300 text-left">
          <div className="bg-white w-[94%] max-w-[360px] rounded-[3rem] p-7 space-y-6 animate-in zoom-in-95 duration-200 shadow-2xl relative text-left text-left text-left text-left">
             <div className="flex justify-between items-center border-b border-slate-50 pb-5 text-left text-left text-left text-left text-left">
                <div className="text-left text-left text-left text-left text-left">
                   <h3 className="font-black text-2xl leading-none uppercase tracking-tighter text-slate-900 text-left text-left uppercase text-left text-left text-left">Sheet Preview</h3>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 text-left text-left text-left text-left text-left">{viewingRecord.subject}</p>
                </div>
                <button onClick={() => setViewingRecord(null)} className="p-2.5 bg-slate-50 rounded-full hover:bg-red-50 hover:text-[#800000] active:scale-90 transition-all"><X size={20}/></button>
             </div>
             <div className="bg-slate-50 p-6 rounded-[2.2rem] font-mono text-[12px] text-slate-700 leading-relaxed overflow-y-auto max-h-[300px] whitespace-pre-wrap border border-slate-100 text-left uppercase uppercase text-left text-left text-left">
                {formatReportContent(viewingRecord)}
             </div>
             <div className="grid grid-cols-1 gap-3.5 text-center text-center text-center text-center">
                <button onClick={() => handleShareFile(viewingRecord, 'csv')} className="w-full bg-slate-900 text-white py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.1em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl text-center uppercase uppercase uppercase text-center">
                  <FileSpreadsheet size={18}/> SHARE CSV DOCUMENT
                </button>
                <div className="grid grid-cols-2 gap-3 text-center text-center text-center text-center text-center">
                   <button onClick={() => handleDownloadDirect(viewingRecord, 'csv')} className="w-full bg-slate-100 text-slate-600 py-3.5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.1em] flex items-center justify-center gap-2 active:bg-slate-200 transition-all text-center text-center text-center text-center text-center">
                      <Download size={16}/> CSV
                   </button>
                   <button onClick={() => handleDownloadDirect(viewingRecord, 'txt')} className="w-full bg-slate-100 text-slate-600 py-3.5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.1em] flex items-center justify-center gap-2 active:bg-slate-200 transition-all text-center text-center text-center text-center text-center">
                      <Download size={16}/> TXT
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* NAVIGATION BAR */}
      {!selectedSem && (
        <div className="fixed bottom-0 max-w-[450px] w-full bg-white/95 backdrop-blur-3xl border-t border-slate-100 px-10 py-6 flex justify-around items-center rounded-t-[3.2rem] shadow-xl z-100 text-center text-center text-center text-center text-center">
          <button onClick={() => {setActiveTab('home'); setSelectedDept(null); setSelectedProgramObj(null);}} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'home' ? 'text-[#800000] scale-110' : 'text-slate-300'} text-center text-center text-center text-center text-center`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'home' ? 'bg-red-50 shadow-sm' : 'bg-transparent'} text-center text-center text-center text-center text-center text-center`}><Home size={26} fill={activeTab === 'home' ? "currentColor" : "none"} /></div>
            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-center text-center text-center text-center text-center text-center">PORTAL</span>
          </button>
          <button onClick={() => setActiveTab('records')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'records' ? 'text-[#800000] scale-110' : 'text-slate-300'} text-center text-center text-center text-center text-center`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'records' ? 'bg-red-50 shadow-sm' : 'bg-transparent'} text-center text-center text-center text-center text-center text-center text-center`}><History size={26} /></div>
            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-center text-center text-center text-center text-center text-center text-center">RECORDS</span>
          </button>
          <button onClick={() => setActiveTab('info')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'info' ? 'text-[#800000] scale-110' : 'text-slate-300'} text-center text-center text-center text-center text-center`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'info' ? 'bg-[#800000] text-white shadow-lg' : 'bg-transparent'} text-center text-center text-center text-center text-center text-center text-center text-center`}><Info size={26} fill={activeTab === 'info' ? "currentColor" : "none"} /></div>
            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-center text-center text-center text-center text-center text-center text-center text-center text-center">ABOUT</span>
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: inline-flex; animation: marquee 20s linear infinite; }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
        body { overscroll-behavior: none; -webkit-tap-highlight-color: transparent; font-family: sans-serif; }
        * { font-style: normal !important; text-decoration: none !important; }
      `}} />
    </div> 
  );
};

const MarqueeItem = () => (
  <>
    <span className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-left text-left text-left text-left text-left text-left"><Monitor size={16} className="text-[#800000]"/> INTELLIGENCE ENGINE</span>
    <span className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-left text-left text-left text-left text-left text-left"><Activity size={16} className="text-[#800000]"/> RESPONSIVE UI</span>
    <span className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-left text-left text-left text-left text-left text-left"><Globe size={16} className="text-[#800000]"/> UMPK NETWORK</span>
    <span className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-left text-left text-left text-left text-left text-left"><ShieldCheck size={16} className="text-[#800000]"/> SECURE ACCESS</span>
  </>
);

export default App;
