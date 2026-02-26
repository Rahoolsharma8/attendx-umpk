import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, ArrowLeft, Home, Info, ShieldCheck, Search, 
  BookOpen, Monitor, Database, Cpu, Briefcase, Globe, Award,
  ChevronDown, History, FileText, Download, Trash2, Share2, X,
  Heart, Terminal, User, Edit3, List, Calendar, Sparkles, Activity, Bell
} from 'lucide-react';

/**
 * ATTENDX PRO - UNIVERSITY OF MIRPURKHAS (UMPK)
 * Version: 16.2 (Final Stable - Branding Fixed - No Italics)
 * Features: Moving Line, Global Footer, Triple-Layer Share, Offline Storage
 */

const SUBJECT_MAP = {
  'CS': {
    '1': ['ICT', 'Programming Fundamentals', 'Calculus', 'English-I', 'Physics', 'Islamic Studies'],
    '2': ['OOP', 'Discrete Structures', 'Digital Logic Design', 'English-II', 'Stats', 'Pakistan Studies'],
    '3': ['Data Structures', 'COAL', 'Software Requirement Eng.', 'Technical Writing'],
    '4': ['Operating Systems', 'Analysis of Algorithms', 'Database Systems', 'Linear Algebra']
  },
  'IT': {
    '1': ['Introduction to IT', 'Programming', 'Basic Math', 'Communication Skills'],
    '2': ['Database Systems', 'Software Engineering', 'Networking', 'Web Technologies']
  },
  'DS': {
    '1': ['Introduction to Data Science', 'Programming', 'Linear Algebra'],
    '2': ['Data Visualization', 'Statistical Modeling', 'Python for DS']
  },
  'Commerce': {
    '1': ['Financial Accounting-I', 'Introduction to Business', 'Microeconomics', 'Business Math'],
    '2': ['Financial Accounting-II', 'Macroeconomics', 'Business Communication', 'Principles of Management']
  }
};

const STUDENT_LIST = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  roll: (i + 1).toString()
}));

const App = () => {
  const [view, setView] = useState('splash');
  const [activeTab, setActiveTab] = useState('home'); 
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedSem, setSelectedSem] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isManualSubject, setIsManualSubject] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [savedRecords, setSavedRecords] = useState([]);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setView('main'), 2800);
    const localRecords = localStorage.getItem('attendx_offline_final');
    if (localRecords) setSavedRecords(JSON.parse(localRecords));
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFinalize = () => {
    if (!selectedSubject) return showToast("Please select a course!");
    const presentRolls = STUDENT_LIST.filter(s => attendance[s.id] === 'Present').map(s => s.id).sort((a, b) => a - b);
    const recordId = `${selectedDept}_${selectedSem}_${selectedSubject.replace(/\s+/g, '_')}`;
    const existingIndex = savedRecords.findIndex(r => r.recordId === recordId);
    const newSession = { date, presentRolls: presentRolls.join(','), totalPresent: presentRolls.length, totalAbsent: 100 - presentRolls.length };
    let updatedRecords = [...savedRecords];
    if (existingIndex !== -1) {
      updatedRecords[existingIndex].sessions = [...updatedRecords[existingIndex].sessions.filter(s => s.date !== date), newSession];
    } else {
      updatedRecords = [{ recordId, dept: selectedDept, sem: selectedSem, subject: selectedSubject, sessions: [newSession] }, ...updatedRecords];
    }
    setSavedRecords(updatedRecords);
    localStorage.setItem('attendx_offline_final', JSON.stringify(updatedRecords));
    showToast("Attendance Saved Locally!");
    setAttendance({});
    setSelectedSubject('');
    setIsManualSubject(false);
    setSelectedSem(null);
    setSelectedDept(null);
    setActiveTab('home');
  };

  const formatReportContent = (rec) => {
    let content = `Name: ${rec.dept}${rec.sem} Semester: ${rec.sem}\nSubject: ${rec.subject}\n------------------------------------------\n-----\n`;
    rec.sessions.forEach(s => {
      content += `Date: ${s.date}\nPresent Roll Numbers:\n${s.presentRolls}\n------------------------------------------\n-----\n`;
    });
    return content;
  };

  const handleDownloadOnly = (rec) => {
    const fileContent = formatReportContent(rec);
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AttendX_${rec.dept}${rec.sem}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    showToast("File Saved To Device!");
  };

  const handleShareSystem = async (rec) => {
    const fileContent = formatReportContent(rec);
    const fileName = `Attendance_${rec.dept}${rec.sem}.txt`;
    try {
      if (navigator.canShare && navigator.canShare({ files: [new File([fileContent], fileName, { type: 'text/plain' })] })) {
        await navigator.share({ files: [new File([fileContent], fileName, { type: 'text/plain' })], title: `Attendance Log`, text: `UMPK Attendance Report` });
        return;
      } 
      if (navigator.share) {
        await navigator.share({ title: `Attendance Log`, text: fileContent });
        return;
      }
      window.open(`https://wa.me/?text=${encodeURIComponent(fileContent)}`, '_blank');
      showToast("Redirecting to WhatsApp...");
    } catch (e) {
      showToast("Sharing failed.");
    }
  };

  const deleteRecord = (id) => {
    if(!window.confirm("Bhai, kya aap waqayi ye history mita dena chahte hain?")) return;
    const filtered = savedRecords.filter(r => r.recordId !== id);
    setSavedRecords(filtered);
    localStorage.setItem('attendx_offline_final', JSON.stringify(filtered));
    showToast("Deleted Permanently");
  };

  const GlobalFooter = () => (
    <div className="mt-auto pt-6 pb-12 flex flex-col items-center gap-3 bg-white w-full border-t border-slate-50">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center justify-center gap-3">
         MADE WITH <Heart size={12} className="fill-[#800000] text-[#800000] animate-pulse" /> IN MIRPURKHAS
      </p>
      <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest font-mono">
         © 2026 UMPK. ALL RIGHTS RESERVED.
      </div>
    </div>
  );

  if (view === 'splash') {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center text-center p-10 overflow-hidden">
        <div className="w-24 h-24 mb-6 bg-[#800000] rounded-[2.2rem] flex items-center justify-center shadow-2xl animate-bounce">
           <BookOpen size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">AttendX</h1>
        <p className="text-[#800000] text-[10px] tracking-[0.4em] uppercase mt-2 font-black">University of Mirpurkhas</p>
      </div>
    );
  }

  const PageHeader = ({ title, showBack = true, onBack }) => (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 p-4 md:p-5 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4 text-left">
        {showBack && (
          <button onClick={onBack} className="p-2.5 bg-slate-50 rounded-xl active:scale-90 transition-transform"><ArrowLeft size={18}/></button>
        )}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#800000] rounded-xl flex items-center justify-center shadow-md">
             <BookOpen size={20} className="text-white" />
          </div>
          <h2 className="font-black text-slate-900 text-lg uppercase tracking-tighter">{title}</h2>
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

      {/* DASHBOARD */}
      {activeTab === 'home' && !selectedDept && !selectedSem && (
        <div className="flex-1 flex flex-col overflow-y-auto pb-32 bg-white animate-in fade-in duration-500 scroll-smooth">
          <PageHeader title="UMPK PORTAL" showBack={false} />
          <div className="p-5 flex-1">
            <div className="bg-gradient-to-br from-[#800000] to-[#4a0404] rounded-[2.5rem] p-8 text-white shadow-2xl mb-8 relative overflow-hidden text-left">
               <h3 className="text-3xl font-black tracking-tighter mb-1">University Panel</h3>
               <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Select Department</p>
               <LayoutGrid className="absolute right-[-20px] bottom-[-20px] opacity-10" size={140} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['CS DEPT', 'IT DEPT', 'DATA SCIENCE', 'COMMERCE', 'AI DEPT', 'BBA DEPT'].map((name, i) => (
                <button key={i} onClick={() => setSelectedDept(name.split(' ')[0])} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all">
                  <div className="w-14 h-14 bg-red-50 text-[#800000] rounded-[1.5rem] flex items-center justify-center"><Monitor size={24} /></div>
                  <span className="font-black text-slate-800 text-[10px] uppercase tracking-wider">{name}</span>
                </button>
              ))}
            </div>
          </div>
          <GlobalFooter />
        </div>
      )}

      {/* SEMESTERS */}
      {selectedDept && !selectedSem && (
        <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-32 animate-in slide-in-from-right-10 duration-500">
          <PageHeader title={`${selectedDept} DEPT`} onBack={() => setSelectedDept(null)} />
          <div className="p-5 grid grid-cols-2 gap-4 mt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                 <button key={num} onClick={() => setSelectedSem(num.toString())} className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-1 active:scale-95 transition-all hover:border-[#800000] text-center">
                    <span className="font-black text-4xl text-slate-900 leading-none">{num}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">SEMESTER</span>
                 </button>
              ))}
          </div>
          <GlobalFooter />
        </div>
      )}

      {/* MARKING SHEET */}
      {selectedSem && (
        <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-48 animate-in slide-in-from-right-10 duration-500 text-left">
          <PageHeader title={`${selectedDept} S${selectedSem}`} onBack={() => setSelectedSem(null)} />
          <div className="p-5 space-y-5">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-black text-[#800000] uppercase tracking-widest">COURSE</label>
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
                          {SUBJECT_MAP[selectedDept]?.[selectedSem]?.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                          <option value="Special Session">Special Session</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16}/>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-[#800000] uppercase tracking-widest">DATE</label>
                  <input type="date" className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none font-bold text-slate-800 text-sm" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input type="text" placeholder="Search Roll Number..." className="w-full p-4 pl-12 bg-white rounded-xl border border-slate-100 shadow-sm outline-none text-xs font-bold" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="space-y-2">
               {STUDENT_LIST?.filter(s => s.roll.includes(searchQuery)).map(s => (
                  <div key={s.id} className={`bg-white p-4 rounded-[1.8rem] border transition-all flex items-center justify-between ${attendance[s.id] === 'Present' ? 'border-emerald-200 bg-emerald-50/20' : attendance[s.id] === 'Absent' ? 'border-rose-200 bg-rose-50/20' : 'border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm transition-colors ${attendance[s.id] ? 'bg-[#800000] text-white shadow-md' : 'bg-slate-50 text-slate-300'}`}>{s.roll}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{attendance[s.id] || 'MARK'}</div>
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
             <button onClick={handleFinalize} className="w-full bg-[#800000] text-white py-5 rounded-[2.2rem] font-black shadow-2xl active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 border-b-4 border-black/20">
               <ShieldCheck size={20} /> AUTHORIZE RECORDS
             </button>
          </div>
        </div>
      )}

      {/* RECORDS LIST */}
      {activeTab === 'records' && (
        <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-32 animate-in fade-in duration-500 text-left">
          <PageHeader title="HISTORY" showBack={false} />
          <div className="p-5 space-y-4 flex-1">
            {savedRecords.length === 0 ? (
              <div className="text-center py-24 opacity-20 flex flex-col items-center">
                <FileText size={60} className="mb-4 text-slate-400" />
                <p className="font-bold text-[10px] uppercase tracking-widest">No Records Stored</p>
              </div>
            ) : (
              savedRecords.map(rec => (
                <div key={rec.recordId} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 space-y-4 text-left">
                   <div className="flex justify-between items-start">
                      <div onClick={() => setViewingRecord(rec)} className="flex-1 cursor-pointer">
                        <h4 className="font-black text-slate-900 text-base leading-none tracking-tight text-left">{rec.subject}</h4>
                        <p className="text-[9px] font-bold text-[#800000] uppercase tracking-widest mt-2">{rec.dept} Sem {rec.sem}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleShareSystem(rec)} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 active:text-[#800000] transition-all"><Share2 size={20}/></button>
                        <button onClick={() => deleteRecord(rec.recordId)} className="p-2.5 bg-slate-50 rounded-xl text-slate-200 active:text-rose-600 transition-all"><Trash2 size={18}/></button>
                      </div>
                   </div>
                   <button onClick={() => setViewingRecord(rec)} className="w-full bg-[#800000]/5 text-[#800000] py-3.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] active:bg-[#800000] active:text-white transition-all shadow-sm">VIEW LOGS</button>
                </div>
              ))
            )}
          </div>
          <GlobalFooter />
        </div>
      )}

      {/* ABOUT SECTION */}
      {activeTab === 'info' && (
        <div className="flex-1 flex flex-col bg-white overflow-y-auto pb-32 animate-in fade-in duration-500 text-left">
          <PageHeader title="INTELLIGENCE" showBack={false} />
          <div className="p-5 space-y-6 flex-1">
             <div className="bg-gradient-to-br from-[#800000] to-[#4a0404] rounded-[2.5rem] p-10 text-white shadow-2xl text-center relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                   <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-[1.8rem] flex items-center justify-center mb-4">
                      <BookOpen size={40} className="text-white" />
                   </div>
                   <h3 className="text-3xl font-black tracking-tighter mb-1 uppercase">AttendX Pro</h3>
                   <div className="h-1 w-10 bg-white/20 rounded-full mb-3 mx-auto"></div>
                   <p className="text-[9px] font-bold text-white/50 uppercase tracking-[0.3em] leading-relaxed text-center">Intelligence Engine</p>
                </div>
                <Sparkles className="absolute top-10 right-10 text-white/5" size={80} />
             </div>

             <div className="space-y-4 px-1">
                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 shadow-sm text-left relative overflow-hidden">
                   <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-4">SYSTEM POWERED BY</p>
                   <h2 className="text-[18px] font-black text-slate-800 leading-tight uppercase tracking-tight text-left">
                    DEVELOPED BY THE <span className="text-[#800000]">DEPARTMENT OF COMPUTER SCIENCE</span>
                   </h2>
                   <p className="font-bold text-slate-500 text-sm mt-5 tracking-tight text-left">University of Mirpurkhas (UMPK)</p>
                </div>

                <div className="p-8 bg-white border border-slate-100 rounded-[2rem] flex items-center gap-6 shadow-sm active:bg-slate-50 transition-colors">
                   <div className="w-16 h-16 bg-red-50 text-[#800000] rounded-2xl flex items-center justify-center shadow-inner"><Award size={32} /></div>
                   <div className="text-left flex-1">
                      <p className="text-[9px] font-black text-red-300 uppercase tracking-[0.2em] mb-1">PROJECT SUPERVISOR</p>
                      <h4 className="text-xl font-black text-slate-900 leading-none tracking-tighter">Sarvat Nizamani</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-relaxed text-left">HEAD OF COMPUTER SCIENCE</p>
                   </div>
                </div>

                {/* MOVING LINE (Marquee) RE-ADDED CORRECTLY */}
                <div className="overflow-hidden py-5 border-y border-slate-100 relative bg-slate-50/50 rounded-2xl">
                   <div className="flex gap-20 whitespace-nowrap animate-marquee">
                      <span className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest"><Monitor size={16} className="text-[#800000]"/> INTELLIGENCE ENGINE</span>
                      <span className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest"><Activity size={16} className="text-[#800000]"/> RESPONSIVE UI</span>
                      <span className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest"><Globe size={16} className="text-[#800000]"/> UMPK NETWORK</span>
                      <span className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest"><ShieldCheck size={16} className="text-[#800000]"/> SECURE ACCESS</span>
                   </div>
                </div>
             </div>
          </div>
          <GlobalFooter />
        </div>
      )}

      {/* SHEET PREVIEW MODAL */}
      {viewingRecord && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[600] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-[94%] max-w-[360px] rounded-[3rem] p-7 space-y-6 animate-in zoom-in-95 duration-200 shadow-2xl relative text-left">
             <div className="flex justify-between items-center border-b border-slate-50 pb-5">
                <div className="text-left">
                   <h3 className="font-black text-2xl leading-none uppercase tracking-tighter text-slate-900">Sheet Preview</h3>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">{viewingRecord.subject}</p>
                </div>
                <button onClick={() => setViewingRecord(null)} className="p-2.5 bg-slate-50 rounded-full hover:bg-red-50 hover:text-[#800000] transition-all"><X size={20}/></button>
             </div>
             <div className="bg-slate-50 p-6 rounded-[2rem] font-mono text-[13px] text-slate-700 leading-relaxed overflow-y-auto max-h-[300px] whitespace-pre-wrap border border-slate-100">
                {formatReportContent(viewingRecord)}
             </div>
             <div className="grid grid-cols-1 gap-3.5">
                <button onClick={() => handleShareSystem(viewingRecord)} className="w-full bg-slate-900 text-white py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.1em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl">
                  <Share2 size={18}/> SHARE ON WHATSAPP
                </button>
                <button onClick={() => handleDownloadOnly(viewingRecord)} className="w-full bg-[#800000] text-white py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.1em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl">
                  <Download size={18}/> SAVE AS .TXT FILE
                </button>
             </div>
          </div>
        </div>
      )}

      {/* NAVIGATION BAR */}
      {!selectedSem && (
        <div className="fixed bottom-0 max-w-[450px] w-full bg-white/95 backdrop-blur-3xl border-t border-slate-100 px-8 py-5 flex justify-around items-center rounded-t-[3.2rem] shadow-xl z-[100]">
          <button onClick={() => {setActiveTab('home'); setSelectedDept(null);}} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'home' ? 'text-[#800000] scale-110' : 'text-slate-300'}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'home' ? 'bg-red-50 shadow-sm' : 'bg-transparent'}`}><Home size={26} fill={activeTab === 'home' ? "currentColor" : "none"} /></div>
            <span className="text-[9px] font-black uppercase tracking-[0.1em]">PORTAL</span>
          </button>
          <button onClick={() => setActiveTab('records')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'records' ? 'text-[#800000] scale-110' : 'text-slate-300'}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'records' ? 'bg-red-50 shadow-sm' : 'bg-transparent'}`}><History size={26} /></div>
            <span className="text-[9px] font-black uppercase tracking-[0.1em]">RECORDS</span>
          </button>
          <button onClick={() => setActiveTab('info')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'info' ? 'text-[#800000] scale-110' : 'text-slate-300'}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'info' ? 'bg-[#800000] text-white shadow-lg' : 'bg-transparent'}`}><Info size={26} fill={activeTab === 'info' ? "currentColor" : "none"} /></div>
            <span className="text-[9px] font-black uppercase tracking-[0.1em]">ABOUT</span>
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: inline-flex; animation: marquee 14s linear infinite; }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
        body { overscroll-behavior: none; -webkit-tap-highlight-color: transparent; font-family: sans-serif; }
        * { font-style: normal !important; }
      `}} />
    </div> 
  );
};

export default App;
