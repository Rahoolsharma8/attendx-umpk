import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, ArrowLeft, Home, Info, ShieldCheck, Search, 
  BookOpen, Monitor, Database, Cpu, Briefcase, Globe, Award,
  ChevronDown, History, FileText, Download, Trash2, Share2, X,
  Heart, Terminal
} from 'lucide-react';

/**
 * ATTENDX PRO - UNIVERSITY OF MIRPURKHAS (UMPK)
 * Developed by: Computer Science Department
 * Supervisor: Sarvat Nizamani
 * * NOTE: For local build, run:
 * npm install @capacitor/filesystem @capacitor/share
 */

// Subjects Configuration
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
  'AI': {
    '1': ['AI Basics', 'Python for AI', 'Discrete Math'],
    '2': ['Machine Learning', 'Neural Networks', 'Logic']
  },
  'BBA': {
    '1': ['Accounting', 'Management', 'Microeconomics'],
    '2': ['Finance', 'Marketing', 'Macroeconomics']
  },
  'English': {
    '1': ['Grammar', 'Composition', 'Literature'],
    '2': ['Communication Skills', 'Criticism', 'History']
  }
};

const generateStudents = (dept, count) => {
  const names = ["Ahmed", "Sara", "Bilal", "Dua", "Hassan", "Zainab", "Kamran", "Ayesha", "Zeeshan", "Fatima", "Usman", "Amna", "Fahad", "Iqra", "Hamza", "Maham", "Ali", "Sana", "Mustafa", "Rida"];
  return Array.from({ length: count }, (_, i) => ({
    roll: `${dept}-${(i + 1).toString().padStart(3, '0')}`,
    name: `${names[i % names.length]} ${String.fromCharCode(65 + (i % 26))}.`
  }));
};

const STUDENT_DATABASE = {
  'CS1': generateStudents('22-CS', 50), 'CS2': generateStudents('21-CS', 30), 'CS3': generateStudents('20-CS', 20), 'CS4': generateStudents('19-CS', 46),
  'IT1': generateStudents('22-IT', 30), 'IT2': generateStudents('21-IT', 20),
  'DS1': generateStudents('22-DS', 25), 'DS2': generateStudents('21-DS', 35),
  'AI1': generateStudents('22-AI', 40), 'BBA1': generateStudents('22-BBA', 45), 'English1': generateStudents('22-ENG', 30)
};

const App = () => {
  const [view, setView] = useState('splash');
  const [activeTab, setActiveTab] = useState('home'); 
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedSem, setSelectedSem] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [savedRecords, setSavedRecords] = useState([]);
  const [viewingRecord, setViewingRecord] = useState(null);

  const logoUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-M_6FpS3eL7Q9A7m_rY-7j0N9J2Y0U8WRA&s";

  useEffect(() => {
    const timer = setTimeout(() => setView('main'), 2800);
    const localRecords = localStorage.getItem('attendx_v5_final');
    if (localRecords) setSavedRecords(JSON.parse(localRecords));
    return () => clearTimeout(timer);
  }, []);

  const handleFinalize = () => {
    if (!selectedSubject) return alert("Subject select karna lazmi hai!");
    
    const students = STUDENT_DATABASE[selectedDept + selectedSem] || [];
    const presentRolls = students
      .filter(s => attendance[s.roll] === 'Present')
      .map(s => s.roll.split('-').pop());

    const recordId = `${selectedDept}_${selectedSem}_${selectedSubject.replace(/\s+/g, '_')}`;
    const existingIndex = savedRecords.findIndex(r => r.recordId === recordId);
    
    const newSession = {
      date: date,
      presentRolls: presentRolls.join(', '),
      totalPresent: presentRolls.length,
      totalAbsent: students.length - presentRolls.length
    };

    let updatedRecords = [...savedRecords];

    if (existingIndex !== -1) {
      const dateExists = updatedRecords[existingIndex].sessions.some(s => s.date === date);
      if(dateExists) {
        if(!window.confirm("Is date ka record pehle se maujood hai. Overwrite karein?")) return;
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
    localStorage.setItem('attendx_v5_final', JSON.stringify(updatedRecords));
    alert("Success: Record update ho gaya!");
    
    setAttendance({});
    setSelectedSubject('');
    setSelectedSem(null);
    setSelectedDept(null);
    setActiveTab('home');
  };

  const downloadRecord = async (rec) => {
    const fileContent = `Name: ${rec.dept}${rec.sem} Semester: ${rec.sem}\nSubject: ${rec.subject}\n-----------------------------------\n${rec.sessions.map(s => `Date: ${s.date}\nPresent Roll Numbers:\n${s.presentRolls}\n-----------------------------------`).join('\n')}\nAttendX Pro - UMPK CS Dept`;

    const fileName = `AttendX_${rec.dept}_Sem${rec.sem}_${rec.subject.replace(/\s+/g, '_')}.txt`;

    // Dynamic handling of Capacitor to prevent preview errors
    try {
      if (window.Capacitor && window.Capacitor.isPluginAvailable('Filesystem')) {
        const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
        const { Share } = await import('@capacitor/share');
        
        const result = await Filesystem.writeFile({
          path: fileName,
          data: fileContent,
          directory: Directory.Documents,
          encoding: Encoding.UTF8,
        });

        await Share.share({
          title: `Attendance: ${rec.subject}`,
          text: `Record for ${rec.dept} Sem ${rec.sem}`,
          url: result.uri,
        });
      } else {
        throw new Error("Capacitor not available");
      }
    } catch (e) {
      const blob = new Blob([fileContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
    }
  };

  const deleteRecord = (id) => {
    if(!window.confirm("Kya aap ye poori subject history mita dena chahte hain?")) return;
    const filtered = savedRecords.filter(r => r.recordId !== id);
    setSavedRecords(filtered);
    localStorage.setItem('attendx_v5_final', JSON.stringify(filtered));
  };

  if (view === 'splash') {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center text-center p-10 select-none overflow-hidden">
        <img src={logoUrl} alt="UMPK" className="w-32 h-32 mb-6 object-contain animate-bounce" />
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">AttendX</h1>
        <p className="text-red-800 text-[10px] tracking-[0.4em] uppercase mt-2 font-black">University of Mirpurkhas</p>
        <div className="absolute bottom-16 border-4 border-red-800 border-t-transparent w-10 h-10 rounded-full animate-spin"></div>
      </div>
    );
  }

  const PageHeader = ({ title, showBack = true, onBack }) => (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 p-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {showBack && (
          <button onClick={onBack} className="p-2 bg-slate-50 rounded-2xl active:scale-90"><ArrowLeft size={20}/></button>
        )}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-100">
             <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-black text-slate-900 text-xl tracking-tight leading-none uppercase">{title}</h2>
            <p className="text-[9px] font-bold text-red-800 uppercase tracking-widest mt-1">U.M.P.K Administration</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 max-w-[450px] mx-auto flex flex-col font-sans relative overflow-hidden text-slate-900 shadow-2xl">
      
      {activeTab === 'home' && !selectedDept && !selectedSem && (
        <div className="flex-1 flex flex-col overflow-y-auto pb-32 bg-white">
          <PageHeader title="Main Portal" showBack={false} />
          <div className="p-6">
            <div className="bg-gradient-to-br from-red-800 to-red-950 rounded-[2.5rem] p-8 text-white shadow-2xl mb-8 relative overflow-hidden">
               <h3 className="text-3xl font-black italic tracking-tight">University Panel</h3>
               <p className="text-red-100 text-[10px] mt-2 font-bold uppercase tracking-widest opacity-80 underline underline-offset-4 decoration-red-400">Select Department</p>
               <LayoutGrid className="absolute right-[-20px] bottom-[-20px] opacity-10" size={160} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'CS', name: 'CS Dept', icon: Monitor, color: 'bg-red-50 text-red-800' },
                { id: 'IT', name: 'IT Dept', icon: Globe, color: 'bg-blue-50 text-blue-700' },
                { id: 'DS', name: 'Data Science', icon: Database, color: 'bg-emerald-50 text-emerald-700' },
                { id: 'AI', name: 'AI Dept', icon: Cpu, color: 'bg-indigo-50 text-indigo-700' },
                { id: 'BBA', name: 'Business', icon: Briefcase, color: 'bg-amber-50 text-amber-700' },
                { id: 'English', name: 'English', icon: BookOpen, color: 'bg-rose-50 text-rose-700' }
              ].map((dept) => (
                <button key={dept.id} onClick={() => setSelectedDept(dept.id)} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all group">
                  <div className={`w-16 h-16 ${dept.color} rounded-3xl flex items-center justify-center shadow-inner group-hover:bg-red-800 group-hover:text-white transition-all`}><dept.icon size={28} /></div>
                  <span className="font-black text-slate-800 text-[11px] uppercase tracking-tight">{dept.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedDept && !selectedSem && (
        <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-32">
          <PageHeader title={`${selectedDept} Selection`} onBack={() => setSelectedDept(null)} />
          <div className="p-6 grid grid-cols-2 gap-4 mt-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                 <button key={num} onClick={() => setSelectedSem(num.toString())} className="bg-white p-8 rounded-[2.8rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 active:scale-95 transition-all group">
                    <span className="font-black text-4xl text-slate-900 group-hover:text-red-800">{num}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Semester</span>
                 </button>
              ))}
          </div>
        </div>
      )}

      {selectedSem && (
        <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-40">
          <PageHeader title={`${selectedDept} Sem ${selectedSem}`} onBack={() => setSelectedSem(null)} />
          <div className="p-6 space-y-6">
            <div className="bg-white p-7 rounded-[2.8rem] shadow-sm border border-slate-100 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-red-800 uppercase tracking-widest px-1">Choose Subject</label>
                  <div className="relative">
                    <select className="w-full p-4 bg-slate-50 rounded-2xl appearance-none outline-none font-black text-slate-800 text-lg border-2 border-transparent focus:border-red-100" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                      <option value="">Select Subject...</option>
                      {SUBJECT_MAP[selectedDept]?.[selectedSem]?.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                      {!SUBJECT_MAP[selectedDept]?.[selectedSem] && <option value="Core Course">Core Course</option>}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20}/>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-red-800 uppercase tracking-widest px-1">Session Date</label>
                  <input type="date" className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-black text-slate-800 text-base" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <Search size={18} className="text-slate-400" />
                <input placeholder="Search student..." className="bg-transparent text-sm w-full outline-none font-bold text-slate-600" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            <div className="space-y-3">
               {(STUDENT_DATABASE[selectedDept + selectedSem] || [])
                ?.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.roll.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(s => (
                  <div key={s.roll} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex-1 truncate pr-4">
                      <div className="text-[9px] font-black text-red-700 mb-0.5 uppercase tracking-tighter">{s.roll}</div>
                      <div className="font-extrabold text-slate-900 text-lg leading-tight">{s.name}</div>
                    </div>
                    <div className="flex gap-3">
                       <button onClick={() => setAttendance(prev => ({ ...prev, [s.roll]: 'Present' }))} className={`w-14 h-14 rounded-2xl font-black transition-all border-2 flex items-center justify-center text-xl ${attendance[s.roll] === 'Present' ? 'bg-emerald-600 border-emerald-700 text-white shadow-lg shadow-emerald-100' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>P</button>
                       <button onClick={() => setAttendance(prev => ({ ...prev, [s.roll]: 'Absent' }))} className={`w-14 h-14 rounded-2xl font-black transition-all border-2 flex items-center justify-center text-xl ${attendance[s.roll] === 'Absent' ? 'bg-rose-600 border-rose-700 text-white shadow-lg shadow-rose-100' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>A</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="fixed bottom-0 max-w-[450px] w-full p-8 bg-gradient-to-t from-white via-white/95 to-transparent flex justify-center z-40">
             <button onClick={handleFinalize} className="w-full bg-red-900 text-white py-6 rounded-[2.5rem] font-black shadow-2xl active:scale-95 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3">
               <ShieldCheck size={20} /> Authorize & Finalize Records
             </button>
          </div>
        </div>
      )}

      {activeTab === 'records' && (
        <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-32">
          <PageHeader title="Subject History" showBack={false} />
          <div className="p-6 space-y-4">
            {savedRecords.length === 0 ? (
              <div className="text-center py-20 opacity-30">
                <FileText size={60} className="mx-auto mb-4" />
                <p className="font-bold italic">No records found.</p>
              </div>
            ) : (
              savedRecords.map(rec => (
                <div key={rec.recordId} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
                   <div className="flex justify-between items-start">
                      <div onClick={() => setViewingRecord(rec)} className="flex-1">
                        <h4 className="font-black text-slate-900 leading-none">{rec.subject}</h4>
                        <p className="text-[10px] font-bold text-red-800 uppercase tracking-widest mt-1.5">{rec.dept} Sem {rec.sem} | {rec.sessions.length} Sessions</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => downloadRecord(rec)} className="p-2 text-slate-400 hover:text-emerald-600"><Download size={20}/></button>
                        <button onClick={() => deleteRecord(rec.recordId)} className="p-2 text-slate-200 hover:text-rose-600"><Trash2 size={18}/></button>
                      </div>
                   </div>
                   <button onClick={() => setViewingRecord(rec)} className="w-full bg-slate-900 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">View Full Log</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'info' && (
        <div className="flex-1 flex flex-col bg-white overflow-y-auto pb-32">
          <PageHeader title="Dev Intelligence" showBack={false} />
          <div className="p-6 space-y-8">
             <div className="bg-gradient-to-br from-red-900 to-red-950 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl text-center">
                <div className="relative z-10 flex flex-col items-center">
                   <div className="relative mb-6">
                      <div className="absolute -inset-4 bg-red-400/20 rounded-full blur-xl animate-pulse"></div>
                      <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl">
                         <BookOpen size={48} className="text-red-900" />
                      </div>
                   </div>
                   <h3 className="text-3xl font-black italic tracking-tighter mb-2">AttendX Pro</h3>
                   <div className="h-1 w-12 bg-red-400 rounded-full mb-4"></div>
                   <p className="text-[10px] font-bold text-red-200 uppercase tracking-[0.3em] leading-relaxed">"Academic excellence through smart administration."</p>
                </div>
                <div className="absolute bottom-[-20px] left-[-20px] w-40 h-40 bg-white/5 rounded-full blur-3xl animate-bounce"></div>
             </div>

             <div className="space-y-6">
                <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 relative group overflow-hidden">
                   <Terminal className="absolute top-4 right-6 text-red-900/5 animate-pulse" size={40} />
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">System Powered By</p>
                   <h2 className="text-xl font-black text-slate-900 leading-tight uppercase">Developed by <span className="text-red-800 italic">Computer Science Department</span></h2>
                   <p className="font-bold text-slate-700 text-sm mt-4">University of Mirpurkhas (UMPK)</p>
                </div>

                <div className="p-8 bg-white border-2 border-red-50 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                   <div className="w-16 h-16 bg-red-50 text-red-900 rounded-2xl flex items-center justify-center shadow-inner"><Award size={32} /></div>
                   <div>
                      <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Project Supervisor</p>
                      <h4 className="text-lg font-black text-slate-900 leading-none">Sarvat Nizamani</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">Head of Computer Science</p>
                   </div>
                </div>

                <div className="overflow-hidden py-4 border-y border-slate-50">
                   <div className="flex gap-12 whitespace-nowrap animate-marquee">
                      <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase italic"><ShieldCheck size={14}/> Secure Logic</span>
                      <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase italic"><Database size={14}/> CSV Engine</span>
                      <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase italic"><Monitor size={14}/> Responsive UI</span>
                      <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase italic"><Globe size={14}/> UMPK Network</span>
                   </div>
                </div>
             </div>

             <p className="text-[9px] text-center font-black text-slate-300 uppercase tracking-[0.4em] flex items-center justify-center gap-2 pb-10">Made with <Heart size={10} className="fill-red-800 text-red-800 animate-bounce" /> in Mirpurkhas</p>
          </div>
        </div>
      )}

      {viewingRecord && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-[400px] rounded-[3rem] p-8 space-y-6 animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                   <h3 className="font-black text-xl leading-none">Record View</h3>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{viewingRecord.subject}</p>
                </div>
                <button onClick={() => setViewingRecord(null)} className="p-2 bg-slate-50 rounded-full"><X size={18}/></button>
             </div>
             <div className="bg-slate-50 p-6 rounded-3xl font-mono text-[11px] text-slate-700 leading-relaxed overflow-y-auto max-h-[350px] whitespace-pre-wrap">
{`Name: ${viewingRecord.dept}${viewingRecord.sem} Semester: ${viewingRecord.sem}\nSubject: ${viewingRecord.subject}\n-----------------------------------\n${viewingRecord.sessions.map(s => `Date: ${s.date}\nPresent Roll Numbers:\n${s.presentRolls}\n-----------------------------------`).join('\n')}`}
             </div>
             <button onClick={() => {downloadRecord(viewingRecord); setViewingRecord(null);}} className="w-full bg-red-800 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"><Share2 size={16}/> Download & Share</button>
          </div>
        </div>
      )}

      {!selectedSem && (
        <div className="fixed bottom-0 max-w-[450px] w-full bg-white/95 backdrop-blur-2xl border-t border-slate-100 px-8 py-6 flex justify-around items-center rounded-t-[3.5rem] shadow-xl z-50">
          <button onClick={() => {setActiveTab('home'); setSelectedDept(null);}} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'home' ? 'text-red-900 scale-110' : 'text-slate-300'}`}>
            <Home size={28} fill={activeTab === 'home' ? "currentColor" : "none"} />
            <span className="text-[10px] font-black uppercase tracking-widest">Portal</span>
          </button>
          <button onClick={() => setActiveTab('records')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'records' ? 'text-red-900 scale-110' : 'text-slate-300'}`}>
            <History size={28} />
            <span className="text-[10px] font-black uppercase tracking-widest">Records</span>
          </button>
          <button onClick={() => setActiveTab('info')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'info' ? 'text-red-900 scale-110' : 'text-slate-300'}`}>
            <Info size={28} fill={activeTab === 'info' ? "currentColor" : "none"} />
            <span className="text-[10px] font-black uppercase tracking-widest">About</span>
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: inline-flex; animation: marquee 10s linear infinite; }
      `}} />
    </div> 
  );
};

export default App;
