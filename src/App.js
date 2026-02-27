import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, ArrowLeft, Home, Info, ShieldCheck, Search, 
  BookOpen, Monitor, Database, Cpu, Briefcase, Globe, Award,
  ChevronDown, History, FileText, Trash2, Share2, X,
  Heart, Activity, Bell, Clock, UserCircle, FileSpreadsheet, PlusCircle, Settings, Sparkles
} from 'lucide-react';

/**
 * ATTENDX PRO - UNIVERSITY OF MIRPURKHAS (UMPK)
 * Developed by: Computer Science Department
 * Lead Developer: Rahool
 * Version: 31.5 (Integrated Commerce & CS Curriculums)
 */

const STATIC_DEPARTMENTS = {
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
      { name: 'Bachelor’s Degree Programmes (4 Years) (Evening)', sems: [1,2,3,4,5,6,7,8] }
    ]
  },
  'Commerce': {
    name: 'Commerce',
    icon: Database,
    color: 'bg-orange-50 text-orange-800',
    programs: [
      { name: 'Bachelor’s Degree Programmes (4 Years) (Morning)', sems: [1,2,3,4,5,6,7,8] },
      { name: 'Bachelor’s Degree Programmes (4 Years) (Evening)', sems: [1,2,3,4,5,6,7,8] }
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

const DEPARTMENT_SUBJECT_MAPS = {
  'CS': {
    '1': ['Programming Fundamentals', 'Programming Fundamentals (Lab)', 'Introduction to Info. & Communication Technologies', 'Introduction to Info. & Communication Technologies (Lab)', 'English Composition and Comprehension', 'Applied Physics', 'Financial Accounting and Financial Management', 'Pakistan Studies'],
    '2': ['Object Oriented Programming', 'Object Oriented Programming (Lab)', 'Discrete Structure', 'Digital Logic Design', 'Digital Logic Design (Lab)', 'Communication and Presentation Skills', 'Calculus and Analytical Geometry', 'Ethics', 'Islamic Studies'],
    '3': ['Data Structure and Algorithms', 'Data Structure and Algorithms (Lab)', 'Software Engineering', 'Computer Organization & Assembly Language', 'Computer Organization & Assembly Language (Lab)', 'Linear Algebra', 'Human Resource Management'],
    '4': ['Database Systems', 'Database Systems (Lab)', 'Theory of Automata', 'Probability and Statistics', 'Theory of Programming Languages', 'Differential Equations', 'Management Information System (MIS)'],
    '5': ['Computer Networks', 'Computer Networks (Lab)', 'Design and Analysis of Algorithms', 'Compiler Construction', 'Python for Data Science', 'Numerical Computing'],
    '6': ['Operating Systems', 'Operating Systems (Lab)', 'Information Security', 'Machine Learning', 'Wireless Sensor Networks', 'Technical and Business Writing'],
    '7': ['Final Year Project - I', 'Artificial Intelligence', 'Artificial Intelligence (Lab)', 'Parallel and Distributed Computing', 'Web Engineering and Technologies', 'Information Retrieval', 'Professional Practice'],
    '8': ['Final Year Project - 2', 'Speech Processing', 'Mobile Application Development', 'E-Commerce']
  },
  'Commerce': {
    '1': ['Introduction to Business', 'Micro Economics', 'Business Mathematics', 'Functional English', 'Islamic Studies', 'Principles of Accounting - I', 'Ethics'],
    '2': ['Business Statistics', 'Macro Economics', 'Computer Application in Business', 'Pakistan Studies', 'Financial Accounting', 'Business Communication'],
    '3': ['Advanced Accounting - I', 'Business Law', 'Economic Issues of Pakistan', 'Inferential Statistics', 'Introduction to Business Finance', 'Introduction to Psychology'],
    '4': ['Auditing', 'Cost Accounting', 'Advanced Accounting - II', 'Financial Institutions', 'Business Taxation', 'Technical Writing and Presentation Skills'],
    '5': ['Principles of Management', 'Principles of Marketing', 'Managerial Economics', 'Financial Management', 'Introduction to Sociology', 'Business Research Methods'],
    '6': ['Research Project Report & Viva-Voce', 'Logical and Critical Thinking', 'Principles of Risk Management and Insurance', 'Managerial Accounting', 'Human Resource Management', 'Entrepreneurship and SMEs'],
    '7': ['Corporate Finance', 'International Finance', 'Organizational Behaviour', 'Investment & Portfolio Management', 'Electronic Commerce (E-Commerce)', 'Operations Management'],
    '8': ['Strategic Management', 'Business Internship & Viva Voce', 'Treasury & Fund Management', 'Corporate Governance', 'International Business', 'Specialized Financial Institutions']
  }
};

const STUDENT_LIST = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  roll: (i + 1).toString()
}));

const MarqueeContent = () => (
  <div className="flex gap-16 items-center px-8">
    <span className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap"><Monitor size={14} className="text-[#800000]"/> INTELLIGENCE ENGINE</span>
    <span className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap"><Activity size={14} className="text-[#800000]"/> RESPONSIVE UI</span>
    <span className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap"><Globe size={14} className="text-[#800000]"/> UMPK NETWORK</span>
    <span className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap"><ShieldCheck size={14} className="text-[#800000]"/> SECURE ACCESS</span>
  </div>
);

const MarqueeItem = () => (
  <div className="flex overflow-hidden py-3 bg-slate-50/50 border-y border-slate-100 rounded-xl">
    <div className="flex animate-marquee-smooth will-change-transform">
      <MarqueeContent />
      <MarqueeContent />
    </div>
  </div>
);

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
  const [customDepts, setCustomDepts] = useState([]);
  const [isAddingDept, setIsAddingDept] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [viewingRecord, setViewingRecord] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setView('main'), 2800);
    const localRecords = localStorage.getItem('attendx_v30_db');
    const localCustomDepts = localStorage.getItem('attendx_custom_depts');
    if (localRecords) setSavedRecords(JSON.parse(localRecords));
    if (localCustomDepts) setCustomDepts(JSON.parse(localCustomDepts));
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddCustomDept = () => {
    if (!newDeptName.trim()) return;
    const newDept = {
      id: `CUSTOM_${Date.now()}`,
      name: newDeptName.trim(),
      icon: Settings,
      color: 'bg-slate-100 text-slate-700',
      programs: [
        { name: 'Bachelor’s Degree Programmes (4 Years) (Morning)', sems: [1,2,3,4,5,6,7,8] }
      ]
    };
    const updated = [...customDepts, newDept];
    setCustomDepts(updated);
    localStorage.setItem('attendx_custom_depts', JSON.stringify(updated));
    setNewDeptName('');
    setIsAddingDept(false);
    showToast("New Department Added!");
  };

  const deleteCustomDept = (e, id) => {
    e.stopPropagation();
    const updated = customDepts.filter(d => d.id !== id);
    setCustomDepts(updated);
    localStorage.setItem('attendx_custom_depts', JSON.stringify(updated));
    showToast("Department Removed");
  };

  const handleFinalize = () => {
    if (!selectedSubject) return showToast("Please select a subject!");
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
        uniqueKey, dept: allDepts[selectedDept].name, program: selectedProgramObj?.name,
        sem: selectedSem, batch: selectedBatch, subject: selectedSubject, sessions: [newSession]
      }, ...updatedRecords];
    }
    
    setSavedRecords(updatedRecords);
    localStorage.setItem('attendx_v30_db', JSON.stringify(updatedRecords));
    showToast("Attendance Saved Successfully!");
    setAttendance({});
    setSelectedSubject('');
    setSelectedSem(null);
    setSelectedProgramObj(null);
    setSelectedDept(null);
    setActiveTab('home');
  };

  const formatReportContent = (rec) => {
    let report = `Name: ${rec.dept} , Semester: ${rec.sem} , Batch: ${rec.batch}\n`;
    report += `Program: ${rec.program}\n`;
    report += `Subject: ${rec.subject}\n`;
    report += `------------------------------------------\n`;
    
    rec.sessions.forEach(s => {
      report += `Date: ${s.date}\n`;
      report += `Present:\n`;
      report += `${s.presentRolls}\n`;
      report += `------------------------------------------\n`;
    });
    
    report += `UMPK AttendX Pro Report`;
    return report;
  };

  const handleShareFile = async (rec) => {
    const reportContent = formatReportContent(rec);
    const cleanSubject = rec.subject.replace(/\s+/g, '_');
    const fileName = `${cleanSubject}_${rec.batch}_Report.txt`;

    try {
      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
      const file = new File([blob], fileName, { type: 'text/plain' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Attendance Report: ${rec.subject}`,
          text: `UMPK Attendance Document`
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        showToast("Document Downloaded");
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      showToast("Sharing failed, downloading instead...");
      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
    }
  };

  const deleteRecord = (key) => {
    const updated = savedRecords.filter(r => r.uniqueKey !== key);
    setSavedRecords(updated);
    localStorage.setItem('attendx_v30_db', JSON.stringify(updated));
    showToast("Record Deleted");
  };

  const allDepts = { ...STATIC_DEPARTMENTS };
  customDepts.forEach(d => { allDepts[d.id] = d; });

  const PageHeader = ({ title, showBack = true, onBack }) => (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        {showBack && (
          <button onClick={onBack} className="p-2 bg-slate-50 rounded-xl active:scale-90 transition-transform outline-none focus:ring-2 focus:ring-[#800000]/20">
            <ArrowLeft size={18}/>
          </button>
        )}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#800000] rounded-xl flex items-center justify-center shadow-md">
             <BookOpen size={20} className="text-white" />
          </div>
          <h2 className="font-black text-slate-900 text-lg uppercase tracking-tighter leading-none">{title}</h2>
        </div>
      </div>
    </div>
  );

  const GlobalFooter = () => (
    <div className="mt-auto pt-8 pb-14 flex flex-col items-center gap-3 bg-white w-full border-t border-slate-50">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
          MADE WITH <Heart size={12} className="fill-[#800000] text-[#800000] animate-pulse" /> IN MIRPURKHAS
      </p>
      <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest font-mono">
          © 2026 UMPK. ALL RIGHTS RESERVED.
      </div>
    </div>
  );

  if (view === 'splash') {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center text-center p-10 select-none overflow-hidden">
        <div className="w-24 h-24 mb-6 bg-[#800000] rounded-[2.2rem] flex items-center justify-center shadow-2xl animate-bounce">
           <BookOpen size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">AttendX</h1>
        <p className="text-[#800000] text-[10px] tracking-[0.4em] uppercase mt-2 font-black">University of Mirpurkhas</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen bg-slate-50 max-w-[450px] mx-auto flex flex-col font-sans relative overflow-hidden text-slate-900 border-x border-slate-200 antialiased">
      {notification && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[500] bg-slate-900/95 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-10">
          <Bell size={14} className="text-[#800000]" />
          <span className="text-[10px] font-bold uppercase tracking-widest">{notification}</span>
        </div>
      )}

      {/* PORTAL DASHBOARD */}
      {activeTab === 'home' && !selectedDept && (
        <div className="flex-1 flex flex-col overflow-y-auto pb-32 bg-white animate-in fade-in">
          <PageHeader title="UMPK PORTAL" showBack={false} />
          <div className="p-5 flex-1">
            <div className="bg-gradient-to-br from-[#800000] to-[#4a0404] rounded-[2.5rem] p-8 text-white shadow-2xl mb-8 relative overflow-hidden">
               <h3 className="text-3xl font-black tracking-tighter mb-1 uppercase">Academic Grid</h3>
               <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Choose Department</p>
               <LayoutGrid className="absolute right-[-20px] bottom-[-20px] opacity-10" size={140} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(allDepts).map((id) => (
                <div 
                  key={id} 
                  onClick={() => setSelectedDept(id)} 
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedDept(id); }}
                  className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all group relative cursor-pointer outline-none focus:ring-2 focus:ring-[#800000]/20"
                >
                  <div className={`w-14 h-14 ${allDepts[id].color || 'bg-slate-50 text-slate-600'} rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                    {allDepts[id].icon ? React.createElement(allDepts[id].icon, { size: 24 }) : <Settings size={24}/>}
                  </div>
                  <span className="font-black text-slate-800 text-[10px] uppercase tracking-wider text-center leading-tight">{allDepts[id].name}</span>
                  {id.startsWith('CUSTOM_') && (
                    <button onClick={(e) => deleteCustomDept(e, id)} className="absolute top-3 right-3 text-slate-200 hover:text-rose-500 p-1 rounded-md active:bg-rose-50 transition-colors"><Trash2 size={14}/></button>
                  )}
                </div>
              ))}
              <button onClick={() => setIsAddingDept(true)} className="bg-slate-50 border-2 border-dashed border-slate-200 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 active:scale-95 transition-all outline-none focus:ring-2 focus:ring-slate-300">
                 <PlusCircle size={32} className="text-slate-300" />
                 <span className="font-black text-slate-400 text-[10px] uppercase tracking-wider">NEW DEPT</span>
              </button>
            </div>
          </div>
          <GlobalFooter />
        </div>
      )}

      {/* DEPARTMENT PROGRAMS */}
      {selectedDept && !selectedProgramObj && (
        <div className="flex-1 flex flex-col bg-white overflow-y-auto pb-32 animate-in slide-in-from-right-10">
          <PageHeader title={`${allDepts[selectedDept]?.name}`} onBack={() => setSelectedDept(null)} />
          <div className="p-5 space-y-4">
             {allDepts[selectedDept]?.programs.map((prog, i) => (
               <button key={i} onClick={() => setSelectedProgramObj(prog)} className="w-full bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4 active:scale-95 transition-all outline-none focus:ring-2 focus:ring-[#800000]/20">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#800000] shadow-sm"><Clock size={20}/></div>
                  <span className="font-black text-slate-800 text-[11px] uppercase tracking-tight text-left leading-tight">{prog.name}</span>
               </button>
             ))}
          </div>
          <GlobalFooter />
        </div>
      )}

      {/* SEMESTER CHOICE */}
      {selectedProgramObj && !selectedSem && (
        <div className="flex-1 flex flex-col bg-white overflow-y-auto pb-32 animate-in slide-in-from-right-10">
          <PageHeader title="Semester" onBack={() => setSelectedProgramObj(null)} />
          <div className="p-5 grid grid-cols-2 gap-4">
              {selectedProgramObj.sems.map(num => (
                 <button key={num} onClick={() => setSelectedSem(num.toString())} className="bg-slate-50 p-7 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all hover:border-[#800000] outline-none focus:ring-2 focus:ring-[#800000]/20">
                    <span className="font-black text-4xl text-slate-900 leading-none">{num}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">SEMESTER</span>
                 </button>
              ))}
          </div>
          <GlobalFooter />
        </div>
      )}

      {/* ATTENDANCE SHEET */}
      {selectedSem && (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 h-screen">
          <PageHeader title={`${allDepts[selectedDept]?.name} S${selectedSem}`} onBack={() => setSelectedSem(null)} />
          
          <div className="px-5 pt-5 pb-2 bg-white/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-[2.2rem] shadow-sm border border-slate-100 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-black text-[#800000] uppercase tracking-widest">COURSE</label>
                    <button onClick={() => { setIsManualSubject(!isManualSubject); setSelectedSubject(''); }} className="text-[8px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded-md active:scale-90 transition-transform">
                      {isManualSubject ? "LIST" : "MANUAL"}
                    </button>
                  </div>
                  <div className="relative">
                    {isManualSubject ? (
                      <input type="text" placeholder="Course Name..." className="w-full p-4 bg-slate-50 rounded-xl outline-none font-black text-slate-800 text-base" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} />
                    ) : (
                      <>
                        <select className="w-full p-4 bg-slate-50 rounded-xl appearance-none outline-none font-bold text-slate-800 text-base" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                          <option value="">Select Course...</option>
                          {/* DYNAMIC SUBJECT LOADING BASED ON DEPARTMENT */}
                          {(DEPARTMENT_SUBJECT_MAPS[selectedDept]?.[selectedSem] || []).map(sub => <option key={sub} value={sub}>{sub}</option>)}
                          <option value="Special Session">Special Session</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16}/>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[#800000] uppercase tracking-widest">BATCH</label>
                    <input type="text" className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none font-bold text-slate-800 text-sm" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[#800000] uppercase tracking-widest">DATE</label>
                    <input type="date" className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none font-bold text-slate-800 text-sm" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                </div>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input type="text" placeholder="Filter Roll Numbers..." className="w-full p-4 pl-12 bg-white rounded-xl border border-slate-100 shadow-sm outline-none text-xs font-bold" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2 pb-40">
             {STUDENT_LIST.filter(s => s.roll.includes(searchQuery)).map(s => (
                <div key={s.id} className={`bg-white p-4 rounded-[1.8rem] border transition-all flex items-center justify-between shadow-sm ${attendance[s.id] === 'Present' ? 'border-emerald-200 bg-emerald-50/20' : attendance[s.id] === 'Absent' ? 'border-rose-200 bg-rose-50/20' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm transition-colors ${attendance[s.id] ? 'bg-[#800000] text-white shadow-md' : 'bg-slate-100 text-slate-300'}`}>{s.roll}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{attendance[s.id] || 'MARK'}</div>
                  </div>
                  <div className="flex gap-2.5">
                     <button onClick={() => setAttendance(prev => ({ ...prev, [s.id]: 'Present' }))} className={`w-12 h-12 rounded-full font-black text-sm border-2 active:scale-90 ${attendance[s.id] === 'Present' ? 'bg-emerald-600 border-emerald-700 text-white shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>P</button>
                     <button onClick={() => setAttendance(prev => ({ ...prev, [s.id]: 'Absent' }))} className={`w-12 h-12 rounded-full font-black text-sm border-2 active:scale-90 ${attendance[s.id] === 'Absent' ? 'bg-rose-600 border-rose-700 text-white shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>A</button>
                  </div>
                </div>
             ))}
          </div>
          
          <div className="fixed bottom-0 max-w-[450px] w-full p-8 bg-gradient-to-t from-white via-white/95 to-transparent flex justify-center z-40">
             <button onClick={handleFinalize} className="w-full bg-[#800000] text-white py-5 rounded-[2.2rem] font-black shadow-2xl active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 border-b-4 border-black/20">
               <ShieldCheck size={20} /> AUTHORIZE RECORDS
             </button>
          </div>
        </div>
      )}

      {/* HISTORY VIEW */}
      {activeTab === 'records' && (
        <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-32 animate-in fade-in">
          <PageHeader title="HISTORY" showBack={false} />
          <div className="p-5 space-y-4 flex-1">
            {savedRecords.length === 0 ? (
              <div className="text-center py-24 opacity-20 flex flex-col items-center">
                <FileText size={60} className="mb-4 text-slate-400" />
                <p className="font-bold text-[10px] uppercase tracking-widest">No Records Stored</p>
              </div>
            ) : (
              savedRecords.map((rec) => (
                <div key={rec.uniqueKey} className="bg-white p-5 rounded-[2.2rem] shadow-sm border border-slate-100 space-y-4">
                   <div className="flex justify-between items-start">
                      <div onClick={() => setViewingRecord(rec)} className="flex-1 cursor-pointer">
                        <h4 className="font-black text-slate-900 text-base leading-none tracking-tight mb-2 uppercase">{rec.subject}</h4>
                        <div className="flex flex-col gap-1">
                          <p className="text-[8px] font-bold text-[#800000] uppercase tracking-widest">{rec.dept} • {rec.batch}</p>
                          <p className="text-[9px] font-black text-slate-800">Sessions: {rec.sessions.length}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleShareFile(rec)} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 active:text-emerald-600 transition-all active:scale-90"><Share2 size={20}/></button>
                        <button onClick={() => deleteRecord(rec.uniqueKey)} className="p-2.5 bg-slate-50 rounded-xl text-slate-200 active:text-rose-600 transition-all active:scale-90"><Trash2 size={18}/></button>
                      </div>
                   </div>
                   <button onClick={() => setViewingRecord(rec)} className="w-full bg-[#800000]/5 text-[#800000] py-3.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] active:bg-[#800000] active:text-white transition-all">OPEN MERGED SHEET</button>
                </div>
              ))
            )}
          </div>
          <GlobalFooter />
        </div>
      )}

      {/* ABOUT VIEW */}
      {activeTab === 'info' && (
        <div className="flex-1 flex flex-col bg-white overflow-y-auto pb-32 animate-in fade-in">
          <PageHeader title="INTELLIGENCE" showBack={false} />
          <div className="p-5 space-y-6 flex-1 text-center">
             <div className="bg-gradient-to-br from-[#800000] to-[#4a0404] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col items-center">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-[1.8rem] flex items-center justify-center mb-4">
                   <BookOpen size={40} className="text-white" />
                </div>
                <h3 className="text-3xl font-black tracking-tighter mb-1 uppercase">AttendX Pro</h3>
                <p className="text-[9px] font-bold text-white/50 uppercase tracking-[0.3em]">v31.5 Engine</p>
                <Sparkles size={80} className="absolute top-10 right-10 text-white/5" />
             </div>

             <div className="space-y-4 text-left">
                <div className="bg-slate-50 rounded-[2.2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                   <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-4">DEVELOPED BY</p>
                   <h2 className="text-[18px] font-black text-slate-800 leading-tight uppercase tracking-tight mb-6">DEPARTMENT OF <span className="text-[#800000]">COMPUTER SCIENCE</span></h2>
                   <div className="h-[1px] w-full bg-slate-200 mb-6 opacity-50"></div>
                   <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="w-10 h-10 bg-[#800000] rounded-xl flex items-center justify-center text-white"><UserCircle size={24}/></div>
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Lead Developer</p>
                         <p className="font-black text-slate-900 text-base leading-none uppercase">Rahool</p>
                      </div>
                   </div>
                   <p className="font-bold text-slate-400 text-[10px] mt-6 uppercase tracking-widest">University of Mirpurkhas (UMPK)</p>
                </div>
                <div className="p-8 bg-white border border-slate-100 rounded-[2.2rem] flex items-center gap-6 shadow-sm">
                   <div className="w-16 h-16 bg-red-50 text-[#800000] rounded-2xl flex items-center justify-center shadow-inner"><Award size={32} /></div>
                   <div className="flex-1">
                      <p className="text-[9px] font-black text-red-300 uppercase tracking-[0.2em] mb-1">PROJECT SUPERVISOR</p>
                      <h4 className="text-xl font-black text-slate-900 leading-none tracking-tighter">Sarvat Nizamani</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">HEAD OF COMPUTER SCIENCE</p>
                   </div>
                </div>
                
                {/* SMOOTH MARQUEE */}
                <MarqueeItem />
                
             </div>
          </div>
          <GlobalFooter />
        </div>
      )}

      {/* DEPARTMENT ADD MODAL */}
      {isAddingDept && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[700] flex items-center justify-center p-6 animate-in fade-in">
           <div className="bg-white w-full max-w-[340px] rounded-[3rem] p-8 space-y-6 animate-in zoom-in-95">
              <div className="text-center">
                 <div className="w-16 h-16 bg-slate-100 text-[#800000] rounded-2xl flex items-center justify-center mx-auto mb-4"><PlusCircle size={32}/></div>
                 <h3 className="font-black text-2xl uppercase tracking-tighter">Add Department</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Structure Designer</p>
              </div>
              <input 
                type="text" 
                placeholder="Department Name" 
                className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-black text-slate-800 text-sm focus:ring-2 focus:ring-[#800000]/20 transition-all"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
              />
              <div className="flex gap-3">
                 <button onClick={() => setIsAddingDept(false)} className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-slate-100 text-slate-500 active:scale-95 transition-transform outline-none">CANCEL</button>
                 <button onClick={handleAddCustomDept} className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-[#800000] text-white shadow-xl active:scale-95 transition-transform outline-none">CONFIRM</button>
              </div>
           </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {viewingRecord && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[600] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-[94%] max-w-[360px] rounded-[3rem] p-7 space-y-6 animate-in zoom-in-95 shadow-2xl relative flex flex-col max-h-[85vh]">
             <div className="flex justify-between items-center border-b border-slate-50 pb-5">
                <div>
                   <h3 className="font-black text-2xl leading-none uppercase tracking-tighter text-slate-900">Report Preview</h3>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">{viewingRecord.subject}</p>
                </div>
                <button onClick={() => setViewingRecord(null)} className="p-2.5 bg-slate-50 rounded-full hover:bg-red-50 hover:text-[#800000] active:scale-90 transition-all outline-none"><X size={20}/></button>
             </div>
             <div className="bg-slate-50 p-6 rounded-[2.2rem] font-mono text-[12px] text-slate-700 leading-relaxed overflow-y-auto whitespace-pre border border-slate-100 flex-1 my-4">
                {formatReportContent(viewingRecord)}
             </div>
             <button 
               onClick={() => handleShareFile(viewingRecord)} 
               className="w-full bg-slate-900 text-white py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.1em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl outline-none"
             >
               <FileText size={18}/> SHARE DOCUMENT REPORT
             </button>
          </div>
        </div>
      )}

      {/* NAVIGATION BAR */}
      {!selectedSem && (
        <div className="fixed bottom-0 max-w-[450px] w-full bg-white/95 backdrop-blur-3xl border-t border-slate-100 px-10 py-6 flex justify-around items-center rounded-t-[3.2rem] shadow-xl z-100">
          <button onClick={() => {setActiveTab('home'); setSelectedDept(null); setSelectedProgramObj(null);}} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'home' ? 'text-[#800000] scale-110' : 'text-slate-300'} outline-none`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'home' ? 'bg-red-50 shadow-sm' : 'bg-transparent'}`}><Home size={26} fill={activeTab === 'home' ? "currentColor" : "none"} /></div>
            <span className="text-[9px] font-black uppercase tracking-[0.1em]">PORTAL</span>
          </button>
          <button onClick={() => setActiveTab('records')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'records' ? 'text-[#800000] scale-110' : 'text-slate-300'} outline-none`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'records' ? 'bg-red-50 shadow-sm' : 'bg-transparent'}`}><History size={26} /></div>
            <span className="text-[9px] font-black uppercase tracking-[0.1em]">RECORDS</span>
          </button>
          <button onClick={() => setActiveTab('info')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'info' ? 'text-[#800000] scale-110' : 'text-slate-300'} outline-none`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'info' ? 'bg-[#800000] text-white shadow-lg' : 'bg-transparent'}`}><Info size={26} fill={activeTab === 'info' ? "currentColor" : "none"} /></div>
            <span className="text-[9px] font-black uppercase tracking-[0.1em]">ABOUT</span>
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-smooth {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-smooth {
          display: flex;
          animation: marquee-smooth 30s linear infinite;
        }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
        body { overscroll-behavior: none; -webkit-tap-highlight-color: transparent; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.4; }
      `}} />
    </div> 
  );
};

export default App;
