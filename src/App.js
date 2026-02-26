import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, ArrowLeft, Home, Info, ShieldCheck, Search, 
  BookOpen, Monitor, Database, Cpu, Briefcase, Globe, Award,
  ChevronDown, History, FileText, Download, Trash2, Share2, X,
  Heart, Terminal, User, Edit3, List, Calendar, Sparkles, Activity, Bell
} from 'lucide-react';

/**
 * ATTENDX PRO - UNIVERSITY OF MIRPURKHAS (UMPK)
 * Developed by: Computer Science Department
 * Version: 11.0 (Final Stable Build with Share & Copyright)
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
    '2': ['Financial Accounting-II', 'Macroeconomics', 'Business Communication', 'Principles of Management'],
    '3': ['Cost Accounting', 'Business Law', 'Statistics for Business'],
    '4': ['Auditing', 'Income Tax Law', 'Financial Management']
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
    const localRecords = localStorage.getItem('attendx_permanent_storage');
    if (localRecords) setSavedRecords(JSON.parse(localRecords));
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFinalize = () => {
    if (!selectedSubject) return showToast("Please select a subject!");
    
    const presentRolls = STUDENT_LIST
      .filter(s => attendance[s.id] === 'Present')
      .map(s => s.id)
      .sort((a, b) => a - b);

    const recordId = `${selectedDept}_${selectedSem}_${selectedSubject.replace(/\s+/g, '_')}`;
    const existingIndex = savedRecords.findIndex(r => r.recordId === recordId);
    
    const newSession = {
      date: date,
      presentRolls: presentRolls.join(','),
      totalPresent: presentRolls.length,
      totalAbsent: 100 - presentRolls.length
    };

    let updatedRecords = [...savedRecords];

    if (existingIndex !== -1) {
      const dateExists = updatedRecords[existingIndex].sessions.some(s => s.date === date);
      if(dateExists) {
        // Using a confirmation state would be better, but for simplicity keeping logic direct
        updatedRecords[existingIndex].sessions = updatedRecords[existingIndex].sessions.filter(s => s.date !== date);
      }
      updatedRecords[existingIndex].sessions.push(newSession);
      updatedRecords[existingIndex].sessions.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      updatedRecords = [{
        recordId,
        dept: selectedDept,
        sem: selectedSem,
        subject: selectedSubject,
        sessions: [newSession]
      }, ...updatedRecords];
    }

    setSavedRecords(updatedRecords);
    localStorage.setItem('attendx_permanent_storage', JSON.stringify(updatedRecords));
    showToast("Attendance Recorded Successfully!");
    
    setAttendance({});
    setSelectedSubject('');
    setIsManualSubject(false);
    setSelectedSem(null);
    setSelectedDept(null);
    setActiveTab('home');
  };

  const formatReportContent = (rec) => {
    let content = `Name: ${rec.dept}${rec.sem} Semester: ${rec.sem}\n`;
    content += `Subject: ${rec.subject}\n`;
    content += `------------------------------------------\n`;
    content += `-----\n`;
    rec.sessions.forEach(s => {
      content += `Date: ${s.date}\n`;
      content += `Present Roll Numbers:\n`;
      content += `${s.presentRolls}\n`;
      content += `------------------------------------------\n`;
      content += `-----\n`;
    });
    return content;
  };

  const downloadAndShare = async (rec) => {
    const fileContent = formatReportContent(rec);
    const fileName = `Attendance_${rec.dept}${rec.sem}_${rec.subject.replace(/\s+/g, '_')}.txt`;

    // Try native share first
    if (navigator.share) {
      try {
        const file = new File([fileContent], fileName, { type: 'text/plain' });
        await navigator.share({
          files: [file],
          title: `Attendance: ${rec.subject}`,
          text: `Official Attendance Log for ${rec.dept} Semester ${rec.sem}`,
        });
        return;
      } catch (err) {
        console.log("Sharing failed, falling back to download.");
      }
    }

    // Fallback to Download
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast("Report Downloaded Successfully!");
  };

  const deleteRecord = (id) => {
    const filtered = savedRecords.filter(r => r.recordId !== id);
    setSavedRecords(filtered);
    localStorage.setItem('attendx_permanent_storage', JSON.stringify(filtered));
    showToast("Record Deleted");
  };

  if (view === 'splash') {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center text-center p-10 select-none overflow-hidden">
        <div className="w-32 h-32 mb-6 bg-[#800000] rounded-[2.8rem] flex items-center justify-center shadow-2xl animate-bounce">
           <BookOpen size={64} className="text-white" />
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">AttendX</h1>
        <p className="text-[#800000] text-[10px] tracking-[0.4em] uppercase mt-2 font-black">University of Mirpurkhas</p>
        <div className="absolute bottom-16 border-4 border-[#800000] border-t-transparent w-10 h-10 rounded-full animate-spin"></div>
      </div>
    );
  }

  const PageHeader = ({ title, showBack = true, onBack }) => (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 p-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4 text-left">
        {showBack && (
          <button onClick={onBack} className="p-2 bg-slate-50 rounded-2xl active:scale-90 transition-transform"><ArrowLeft size={20}/></button>
        )}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#800000] rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
             <BookOpen size={24} className="text-white" />
          </div>
          <div className="text-left">
            <h2 className="font-black text-slate-900 text-2xl tracking-tighter leading-none uppercase">{title}</h2>
            <p className="text-[9px] font-bold text-[#800000] uppercase tracking-widest mt-1">U.M.P.K ADMIN</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 max-w-[450px] mx-auto flex flex-col font-sans relative overflow-hidden text-slate-900 shadow-2xl border-x border-slate-200 text-center">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-10 duration-300">
          <Bell size={18} className="text-[#800000]" />
          <span className="text-sm font-bold uppercase tracking-widest">{notification}</span>
        </div>
      )}

      {/* 1. PORTAL DASHBOARD */}
      {activeTab === 'home' && !selectedDept && !selectedSem && (
        <div className="flex-1 flex flex-col overflow-y-auto pb-32 bg-white animate-in fade-in duration-500">
          <PageHeader title="UMPK PORTAL" showBack={false} />
          <div className="p-6">
            <div className="bg-gradient-to-br from-[#800000] to-[#4a0404] rounded-[3rem] p-10 text-white shadow-2xl mb-10 relative overflow-hidden group">
               <h3 className="text-4xl font-black italic tracking-tighter text-left mb-2">University Panel</h3>
               <p className="text-white/60 text-[11px] font-black uppercase tracking-[0.25em] text-left underline underline-offset-8 decoration-white/30 decoration-2">
                 SELECT DEPARTMENT
               </p>
               <div className="absolute right-[-20px] bottom-[-20px] opacity-10 flex gap-2">
                  <div className="w-16 h-16 border-4 border-white rounded-xl"></div>
                  <div className="w-16 h-16 border-4 border-white rounded-xl"></div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { id: 'CS', name: 'CS DEPT', icon: Monitor, color: 'bg-red-50 text-[#800000]' },
                { id: 'IT', name: 'IT DEPT', icon: Globe, color: 'bg-blue-50 text-blue-700' },
                { id: 'DS', name: 'DATA SCIENCE', icon: Database, color: 'bg-emerald-50 text-emerald-700' },
                { id: 'Commerce', name: 'COMMERCE', icon: Briefcase, color: 'bg-orange-50 text-orange-800' },
                { id: 'AI', name: 'AI DEPT', icon: Cpu, color: 'bg-indigo-50 text-indigo-700' },
                { id: 'BBA', name: 'BBA DEPT', icon: Briefcase, color: 'bg-amber-50 text-amber-700' }
              ].map((dept) => (
                <button key={dept.id} onClick={() => setSelectedDept(dept.id)} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center gap-4 active:scale-95 transition-all group">
                  <div className={`w-16 h-16 ${dept.color} rounded-3xl flex items-center justify-center shadow-inner group-hover:bg-[#800000] group-hover:text-white transition-all`}><dept.icon size={30} /></div>
                  <span className="font-black text-slate-800 text-[11px] uppercase tracking-widest">{dept.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. SEMESTER SELECTION */}
      {selectedDept && !selectedSem && (
        <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-32 animate-in slide-in-from-right-10 duration-500">
          <PageHeader title={`${selectedDept} SELECTION`} onBack={() => setSelectedDept(null)} />
          <div className="p-6 grid grid-cols-2 gap-4 mt-4 text-center">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                 <button key={num} onClick={() => setSelectedSem(num.toString())} className="bg-white p-8 rounded-[2.8rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 active:scale-95 transition-all group hover:border-[#800000]">
                    <span className="font-black text-4xl text-slate-900 group-hover:text-[#800000] transition-colors">{num}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">SEMESTER</span>
                 </button>
              ))}
          </div>
        </div>
      )}

      {/* 3. ATTENDANCE SHEET */}
      {selectedSem && (
        <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-44 animate-in slide-in-from-right-10 duration-500 text-left">
          <PageHeader title={`${selectedDept} S${selectedSem}`} onBack={() => setSelectedSem(null)} />
          <div className="p-6 space-y-6">
            <div className="bg-white p-7 rounded-[2.8rem] shadow-sm border border-slate-100 space-y-5">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-[#800000] uppercase tracking-widest">SUBJECT SELECTION</label>
                    <button onClick={() => { setIsManualSubject(!isManualSubject); setSelectedSubject(''); }} className="text-[9px] font-black text-blue-600 uppercase flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                      {isManualSubject ? <List size={10}/> : <Edit3 size={10}/>}
                      {isManualSubject ? "SHOW LIST" : "MANUAL TYPE"}
                    </button>
                  </div>
                  <div className="relative">
                    {isManualSubject ? (
                      <input type="text" placeholder="Type Subject Name..." className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-black text-slate-800 text-lg border-2 border-transparent focus:border-[#800000]/20 shadow-inner" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} />
                    ) : (
                      <>
                        <select className="w-full p-4 bg-slate-50 rounded-2xl appearance-none outline-none font-black text-slate-800 text-lg border-2 border-transparent focus:border-[#800000]/20" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                          <option value="">Select Course...</option>
                          {SUBJECT_MAP[selectedDept]?.[selectedSem]?.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                          {!SUBJECT_MAP[selectedDept]?.[selectedSem] && <option value="Special Session">Special Session</option>}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20}/>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#800000] uppercase tracking-widest px-1">SESSION DATE</label>
                  <div className="relative">
                    <input type="date" className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-black text-slate-800 text-base" value={date} onChange={(e) => setDate(e.target.value)} />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                  </div>
                </div>
            </div>

            <div className="relative mb-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" placeholder="Search Roll No..." className="w-full p-4 pl-12 bg-white rounded-2xl border border-slate-100 shadow-sm outline-none text-sm font-bold" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            <div className="space-y-3">
               {STUDENT_LIST?.filter(s => s.roll.includes(searchQuery)).map(s => (
                  <div key={s.id} className={`bg-white p-6 rounded-[2.5rem] border transition-all shadow-sm flex items-center justify-between ${attendance[s.id] === 'Present' ? 'border-emerald-200 bg-emerald-50/20' : attendance[s.id] === 'Absent' ? 'border-rose-200 bg-rose-50/20' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                         <User size={20} className="text-[#800000]" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Roll No</div>
                        <div className="font-black text-slate-900 text-xl leading-none">{s.roll}</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                       <button onClick={() => setAttendance(prev => ({ ...prev, [s.id]: 'Present' }))} className={`w-14 h-14 rounded-2xl font-black transition-all border-2 flex items-center justify-center text-xl ${attendance[s.id] === 'Present' ? 'bg-emerald-600 border-emerald-700 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>P</button>
                       <button onClick={() => setAttendance(prev => ({ ...prev, [s.id]: 'Absent' }))} className={`w-14 h-14 rounded-2xl font-black transition-all border-2 flex items-center justify-center text-xl ${attendance[s.id] === 'Absent' ? 'bg-rose-600 border-rose-700 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>A</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="fixed bottom-0 max-w-[450px] w-full p-8 bg-gradient-to-t from-white via-white/95 to-transparent flex justify-center z-40">
             <button onClick={handleFinalize} className="w-full bg-red-900 text-white py-6 rounded-[2.5rem] font-black shadow-2xl active:scale-95 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3">
               <ShieldCheck size={20} /> Authorize & Save Records
             </button>
          </div>
        </div>
      )}

      {activeTab === 'records' && (
        <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-32 animate-in fade-in duration-500 text-left">
          <PageHeader title="ATTENDANCE LOGS" showBack={false} />
          <div className="p-6 space-y-4">
            {savedRecords.length === 0 ? (
              <div className="text-center py-20 opacity-30 flex flex-col items-center">
                <FileText size={60} className="mb-4 text-slate-200" />
                <p className="font-bold text-sm uppercase tracking-tighter text-slate-400">No logs found in local storage.</p>
              </div>
            ) : (
              savedRecords.map(rec => (
                <div key={rec.recordId} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
                   <div className="flex justify-between items-start">
                      <div onClick={() => setViewingRecord(rec)} className="flex-1 cursor-pointer">
                        <h4 className="font-black text-slate-900 leading-none">{rec.subject}</h4>
                        <p className="text-[10px] font-bold text-[#800000] uppercase tracking-widest mt-1.5">{rec.dept} Sem {rec.sem} | {rec.sessions.length} Session(s)</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => downloadAndShare(rec)} className="p-2 text-slate-400 hover:text-emerald-600 transition-all active:scale-90"><Share2 size={20}/></button>
                        <button onClick={() => deleteRecord(rec.recordId)} className="p-2 text-slate-200 hover:text-rose-600 transition-all active:scale-90"><Trash2 size={18}/></button>
                      </div>
                   </div>
                   <button onClick={() => setViewingRecord(rec)} className="w-full bg-slate-900 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-md text-center">Open Log History</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. ABOUT SECTION */}
      {activeTab === 'info' && (
        <div className="flex-1 flex flex-col bg-white overflow-y-auto pb-32 animate-in fade-in duration-500">
          <PageHeader title="INTELLIGENCE TEAM" showBack={false} />
          <div className="p-6 space-y-8">
             <div className="bg-gradient-to-br from-[#800000] to-[#4a0404] rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl text-center">
                <div className="relative z-10 flex flex-col items-center">
                   <div className="w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] flex items-center justify-center shadow-2xl mb-6">
                      <BookOpen size={48} className="text-white" />
                   </div>
                   <h3 className="text-4xl font-black italic tracking-tighter mb-2">AttendX Pro</h3>
                   <div className="h-1 w-12 bg-white/20 rounded-full mb-4"></div>
                   <p className="text-[11px] font-bold text-white/50 uppercase tracking-[0.4em] leading-relaxed italic">Academic Intelligence Engine</p>
                </div>
                <Sparkles className="absolute top-10 right-10 text-white/5" size={100} />
             </div>

             <div className="space-y-6 text-left px-2">
                <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 relative overflow-hidden group shadow-sm">
                   <div className="flex justify-between items-start mb-6">
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em]">SYSTEM POWERED BY</p>
                      <Terminal size={20} className="text-[#800000]/20" />
                   </div>
                   <h2 className="text-2xl font-black text-slate-800 leading-tight uppercase tracking-tight">
                    DEVELOPED BY <span className="text-[#800000] italic">COMPUTER SCIENCE DEPARTMENT</span>
                   </h2>
                   <p className="font-bold text-slate-500 text-lg mt-6 flex items-center gap-2 tracking-tight">
                     University of Mirpurkhas (UMPK)
                   </p>
                </div>

                <div className="p-10 bg-white border border-slate-100 rounded-[3rem] flex items-center gap-8 shadow-sm">
                   <div className="w-24 h-24 bg-red-50 text-[#800000] rounded-[2rem] flex items-center justify-center shadow-inner group-hover:bg-[#800000] transition-all">
                      <Award size={40} />
                   </div>
                   <div className="flex-1">
                      <p className="text-[10px] font-black text-red-300 uppercase tracking-[0.2em] mb-2">PROJECT SUPERVISOR</p>
                      <h4 className="text-3xl font-black text-slate-900 leading-none tracking-tighter">Sarvat Nizamani</h4>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-3 leading-relaxed">HEAD OF COMPUTER SCIENCE</p>
                   </div>
                </div>

                <div className="overflow-hidden py-6 border-y border-slate-100 relative bg-slate-50/50 rounded-2xl">
                   <div className="flex gap-20 whitespace-nowrap animate-marquee">
                      <span className="flex items-center gap-4 text-[12px] font-black text-slate-400 uppercase italic tracking-widest"><Monitor size={18} className="text-[#800000]"/> INTELLIGENCE ENGINE</span>
                      <span className="flex items-center gap-4 text-[12px] font-black text-slate-400 uppercase italic tracking-widest"><Activity size={18} className="text-[#800000]"/> RESPONSIVE UI</span>
                      <span className="flex items-center gap-4 text-[12px] font-black text-slate-400 uppercase italic tracking-widest"><Globe size={18} className="text-[#800000]"/> UMPK NETWORK</span>
                      <span className="flex items-center gap-4 text-[12px] font-black text-slate-400 uppercase italic tracking-widest"><ShieldCheck size={18} className="text-[#800000]"/> SECURE ACCESS</span>
                   </div>
                </div>
             </div>

             <div className="mt-6 flex flex-col items-center gap-4 pb-12">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center justify-center gap-3">
                   MADE WITH <Heart size={14} className="fill-[#800000] text-[#800000] animate-pulse" /> IN MIRPURKHAS
                </p>
                {/* COPYRIGHT FOOTER */}
                <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">
                   © 2026 UMPK. All Rights Reserved.
                </div>
             </div>
          </div>
        </div>
      )}

      {/* LOG PREVIEW MODAL */}
      {viewingRecord && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300 text-left">
          <div className="bg-white w-full max-w-[420px] rounded-[3.5rem] p-10 space-y-8 animate-in zoom-in-95 duration-200 shadow-2xl relative">
             <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                <div>
                   <h3 className="font-black text-4xl leading-none italic uppercase tracking-tighter text-slate-900">Sheet Preview</h3>
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3">{viewingRecord.subject}</p>
                </div>
                <button onClick={() => setViewingRecord(null)} className="p-3 bg-slate-50 rounded-full hover:bg-red-50 hover:text-[#800000] transition-all active:scale-90"><X size={24}/></button>
             </div>
             
             <div className="bg-slate-50 p-8 rounded-[2.5rem] font-mono text-[14px] text-slate-700 leading-relaxed overflow-y-auto max-h-[420px] whitespace-pre-wrap shadow-inner border border-slate-100">
                {formatReportContent(viewingRecord)}
             </div>
             
             <button onClick={() => {downloadAndShare(viewingRecord); setViewingRecord(null);}} className="w-full bg-[#800000] text-white py-6 rounded-[2.5rem] font-black text-[14px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all shadow-red-900/20">
                <Share2 size={22}/> DOWNLOAD & SHARE
             </button>
          </div>
        </div>
      )}

      {/* NAVIGATION BAR */}
      {!selectedSem && (
        <div className="fixed bottom-0 max-w-[450px] w-full bg-white/95 backdrop-blur-2xl border-t border-slate-100 px-10 py-6 flex justify-around items-center rounded-t-[3.5rem] shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.05)] z-50">
          <button onClick={() => {setActiveTab('home'); setSelectedDept(null);}} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'home' ? 'text-[#800000] scale-110' : 'text-slate-300'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'home' ? 'bg-red-50' : 'bg-transparent'}`}>
                <Home size={28} fill={activeTab === 'home' ? "currentColor" : "none"} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">PORTAL</span>
          </button>
          <button onClick={() => setActiveTab('records')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'records' ? 'text-[#800000] scale-110' : 'text-slate-300'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'records' ? 'bg-red-50' : 'bg-transparent'}`}>
                <History size={28} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">RECORDS</span>
          </button>
          <button onClick={() => setActiveTab('info')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'info' ? 'text-[#800000] scale-110' : 'text-slate-300'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'info' ? 'bg-[#800000] text-white shadow-lg' : 'bg-transparent'}`}>
                <Info size={28} fill={activeTab === 'info' ? "currentColor" : "none"} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">ABOUT</span>
          </button>
        </div>
      )}

      {/* MARQUEE & SCROLLBAR STYLES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: inline-flex; animation: marquee 15s linear infinite; }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
      `}} />
    </div> 
  );
};

export default App;
