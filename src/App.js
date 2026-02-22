import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ClipboardCheck, 
  ChevronRight, 
  LayoutGrid,
  FileText,
  Calendar as CalendarIcon,
  ArrowLeft,
  GraduationCap,
  Download,
  Home,
  Info,
  ShieldCheck,
  Search,
  BookOpen,
  Monitor,
  Database,
  Cpu,
  Briefcase,
  Globe,
  Trash2,
  CheckCircle2,
  XCircle,
  Award,
  Zap
} from 'lucide-react';

/**
 * ATTENDX - UNIVERSITY OF MIRPURKHAS (UMPK)
 * FINAL PRODUCTION VERSION - MOBILE OPTIMIZED
 * Developed by: Department of Computer Science
 * Supervisor: HOD Sarvat Nizamani
 */

const generateStudents = (dept, count) => {
  const names = ["Ahmed", "Sara", "Bilal", "Dua", "Hassan", "Zainab", "Kamran", "Ayesha", "Zeeshan", "Fatima", "Usman", "Amna", "Fahad", "Iqra", "Hamza", "Maham", "Ali", "Sana", "Mustafa", "Rida"];
  return Array.from({ length: count }, (_, i) => ({
    roll: `${dept}-${(i + 1).toString().padStart(3, '0')}`,
    name: `${names[i % names.length]} ${String.fromCharCode(65 + (i % 26))}.`
  }));
};

const STUDENT_DATABASE = {
  'CS1': generateStudents('22-CS', 50), 'CS2': generateStudents('21-CS', 30), 'CS3': generateStudents('20-CS', 20), 'CS4': generateStudents('19-CS', 46),
  'IT1': generateStudents('22-IT', 30), 'IT2': generateStudents('21-IT', 20), 'IT3': generateStudents('20-IT', 40), 'IT4': generateStudents('19-IT', 30),
  'DS1': generateStudents('22-DS', 25), 'DS2': generateStudents('21-DS', 35), 'DS3': generateStudents('20-DS', 20), 'DS4': generateStudents('19-DS', 30),
  'AI1': generateStudents('22-AI', 40), 'AI2': generateStudents('21-AI', 30), 'AI3': generateStudents('20-AI', 20), 'AI4': generateStudents('19-AI', 35),
  'BBA1': generateStudents('22-BBA', 30), 'BBA2': generateStudents('21-BBA', 25), 'BBA3': generateStudents('20-BBA', 45), 'BBA4': generateStudents('19-BBA', 30),
  'English1': generateStudents('22-ENG', 20), 'English2': generateStudents('21-ENG', 30), 'English3': generateStudents('20-ENG', 25), 'English4': generateStudents('19-ENG', 20),
};

const App = () => {
  const [view, setView] = useState('splash');
  const [activeTab, setActiveTab] = useState('home'); 
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const logoUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-M_6FpS3eL7Q9A7m_rY-7j0N9J2Y0U8WRA&s";

  useEffect(() => {
    const timer = setTimeout(() => setView('main'), 2800);
    return () => clearTimeout(timer);
  }, []);

  const generateReport = (record) => {
    const students = STUDENT_DATABASE[record.className] || [];
    let report = `UNIVERSITY OF MIRPURKHAS (UMPK)\nOFFICIAL ATTENDANCE LOG\n------------------------------------\nSubject: ${record.subject}\nClass: ${record.className}\nDate: ${record.date}\n------------------------------------\nRoll No    | Name               | Status\n`;
    students.forEach(s => {
      report += `${s.roll.padEnd(10)} | ${s.name.padEnd(18)} | ${record.data[s.roll] || 'Absent'}\n`;
    });
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AttendX_Report_${record.className}_${record.date}.txt`;
    a.click();
  };

  const handleSubmission = () => {
    if (!subject) return alert("Error: Subject title is mandatory.");
    const students = STUDENT_DATABASE[selectedClass];
    const finalData = {};
    students.forEach(s => finalData[s.roll] = attendance[s.roll] || 'Absent');
    const newRecord = { id: Date.now(), className: selectedClass, subject, date, data: finalData };
    setRecords([newRecord, ...records]);
    generateReport(newRecord);
    alert("Success: Attendance finalized and report generated.");
    setAttendance({});
    setSubject('');
    setSelectedClass(null);
    setSelectedDept(null);
    setActiveTab('home');
  };

  if (view === 'splash') {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center text-center p-10 select-none overflow-hidden">
        <img src={logoUrl} alt="UMPK" className="w-32 h-32 mb-6 object-contain animate-bounce" />
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">AttendX</h1>
        <p className="text-red-800 text-[10px] tracking-[0.4em] uppercase mt-2 font-black">University of Mirpurkhas</p>
        <div className="absolute bottom-16 flex flex-col items-center gap-2">
            <div className="w-10 h-10 border-4 border-red-800 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const PageHeader = ({ title, showBack = true, onBack }) => (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 p-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        {showBack && (
          <button onClick={onBack} className="p-2 bg-slate-50 rounded-2xl active:scale-90 transition-transform">
            <ArrowLeft size={20} className="text-slate-700" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
          <div>
            <h2 className="font-black text-slate-900 text-xl tracking-tight leading-none">{title}</h2>
            <p className="text-[9px] font-bold text-red-800 uppercase tracking-widest mt-1">Faculty Records Management</p>
          </div>
        </div>
      </div>
    </div>
  );

  const departments = [
    { id: 'CS', name: 'CS Dept', icon: Monitor, color: 'bg-red-50 text-red-800' },
    { id: 'IT', name: 'IT Dept', icon: Globe, color: 'bg-blue-50 text-blue-700' },
    { id: 'DS', name: 'Data Science', icon: Database, color: 'bg-emerald-50 text-emerald-700' },
    { id: 'AI', name: 'AI Dept', icon: Cpu, color: 'bg-indigo-50 text-indigo-700' },
    { id: 'BBA', name: 'Business', icon: Briefcase, color: 'bg-amber-50 text-amber-700' },
    { id: 'English', name: 'English', icon: BookOpen, color: 'bg-rose-50 text-rose-700' }
  ];

  return (
    <div className="min-h-screen bg-white max-w-[450px] mx-auto flex flex-col font-sans relative overflow-hidden text-slate-900 touch-pan-y shadow-2xl">
      
      {activeTab === 'home' && !selectedDept && !selectedClass && (
        <div className="flex-1 flex flex-col overflow-y-auto pb-32">
          <PageHeader title="UMPK AttendX" showBack={false} />
          <div className="p-6">
            <div className="bg-gradient-to-br from-red-800 to-red-950 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-red-200/50 mb-8 relative overflow-hidden">
               <div className="relative z-10">
                 <img src={logoUrl} alt="UMPK" className="w-12 h-12 mb-4 bg-white rounded-xl p-1 shadow-md object-contain" />
                 <h3 className="text-3xl font-black italic tracking-tight leading-tight">Main Dashboard</h3>
                 <p className="text-red-100 text-[10px] mt-2 font-bold uppercase tracking-widest opacity-80 underline decoration-red-400 decoration-2 underline-offset-4">Select Department</p>
               </div>
               <LayoutGrid className="absolute right-[-20px] bottom-[-20px] opacity-10" size={160} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {departments.map((dept) => (
                <button 
                  key={dept.id} 
                  onClick={() => setSelectedDept(dept.id)}
                  className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center gap-3 active:scale-95 active:bg-slate-50 transition-all group"
                >
                  <div className={`w-16 h-16 ${dept.color} rounded-3xl flex items-center justify-center shadow-inner group-hover:bg-red-800 group-hover:text-white transition-all`}>
                    <dept.icon size={28} />
                  </div>
                  <span className="font-black text-slate-800 tracking-tight text-[11px] uppercase">{dept.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedDept && !selectedClass && (
        <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-32">
          <PageHeader title={`${selectedDept} Selection`} onBack={() => setSelectedDept(null)} />
          <div className="p-6 grid grid-cols-2 gap-4 mt-4">
              {[1, 2, 3, 4].map(num => {
               const id = `${selectedDept}${num}`;
               const count = STUDENT_DATABASE[id]?.length || 0;
               return (
                 <button 
                    key={id}
                    onClick={() => setSelectedClass(id)}
                    className="bg-white p-8 rounded-[2.8rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 active:scale-95 transition-all group hover:border-red-400"
                 >
                    <span className="font-black text-4xl text-slate-900 group-hover:text-red-800 transition-colors">{id}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{count} Students</span>
                 </button>
               );
              })}
          </div>
        </div>
      )}

      {selectedClass && (
        <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-40">
          <PageHeader title={selectedClass} onBack={() => setSelectedClass(null)} />
          <div className="p-6 space-y-6">
            <div className="bg-white p-7 rounded-[2.8rem] shadow-sm border border-slate-100 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-red-800 uppercase tracking-widest px-1">Subject Title</label>
                  <input 
                    placeholder="Enter Subject Name..."
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-black text-slate-800 text-lg placeholder:text-slate-300"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-red-800 uppercase tracking-widest px-1">Session Date</label>
                  <input 
                    type="date"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-black text-slate-800 text-base"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <Search size={18} className="text-slate-400" />
                <input 
                    placeholder="Search profile..." 
                    className="bg-transparent text-sm w-full outline-none font-bold text-slate-600"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="space-y-3">
               {STUDENT_DATABASE[selectedClass]
                ?.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.roll.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(s => (
                  <div key={s.roll} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between active:bg-slate-50 transition-all">
                    <div className="flex-1 truncate pr-4">
                      <div className="text-[9px] font-black text-red-700 mb-0.5 uppercase tracking-tighter">{s.roll}</div>
                      <div className="font-extrabold text-slate-900 text-lg leading-tight">{s.name}</div>
                    </div>
                    <div className="flex gap-3">
                       <button 
                        onClick={() => setAttendance(prev => ({ ...prev, [s.roll]: 'Present' }))}
                        className={`w-14 h-14 rounded-2xl font-black transition-all border-2 flex items-center justify-center text-xl ${attendance[s.roll] === 'Present' ? 'bg-emerald-600 border-emerald-700 text-white shadow-lg shadow-emerald-100' : 'bg-slate-50 border-slate-100 text-slate-300 hover:border-emerald-200'}`}
                       >P</button>
                       <button 
                        onClick={() => setAttendance(prev => ({ ...prev, [s.roll]: 'Absent' }))}
                        className={`w-14 h-14 rounded-2xl font-black transition-all border-2 flex items-center justify-center text-xl ${attendance[s.roll] === 'Absent' ? 'bg-rose-600 border-rose-700 text-white shadow-lg shadow-rose-100' : 'bg-slate-50 border-slate-100 text-slate-300 hover:border-rose-200'}`}
                       >A</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="fixed bottom-0 max-w-[450px] w-full p-8 bg-gradient-to-t from-white via-white/95 to-transparent flex justify-center z-40">
             <button onClick={handleSubmission} className="w-full bg-red-900 text-white py-6 rounded-[2.5rem] font-black shadow-2xl active:scale-95 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3">
               <ShieldCheck size={20} /> Authorize & Finalize Records
             </button>
          </div>
        </div>
      )}

      {activeTab === 'info' && (
        <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-32 text-center">
          <PageHeader title="Platform Intelligence" showBack={false} />
          <div className="p-6">
             <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                   <img src={logoUrl} alt="Logo" className="w-24 h-24 mb-6 object-contain" />
                   <h3 className="text-2xl font-black text-red-900 mb-2 tracking-tight">AttendX Development</h3>
                   <div className="w-16 h-1 bg-red-800 rounded-full mb-8"></div>
                   
                   <div className="space-y-10 text-slate-600 font-medium leading-relaxed">
                      <p className="text-sm px-2">
                        This digital ecosystem has been engineered by the 
                        <span className="text-red-900 font-bold block mt-1 tracking-widest uppercase text-base leading-tight">Department of Computer Science</span>
                        for the University of Mirpurkhas (UMPK) as a dedicated administrative automation tool.
                      </p>
                      
                      <div className="p-10 bg-red-50 rounded-[3rem] border border-red-100 shadow-inner relative">
                        <Award size={36} className="text-red-800 mx-auto mb-4 opacity-30" />
                        <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.4em] mb-3 leading-none">Supervisor</p>
                        <p className="text-2xl font-black text-slate-950 tracking-tight mb-1">HOD Sarvat Nizamani</p>
                        <p className="text-[10px] text-red-900 font-black uppercase tracking-widest">Head of CS Department</p>
                      </div>

                      <div className="pt-4 px-6 border-t border-slate-50">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] mb-3">Core Objective</p>
                        <p className="text-xs italic text-slate-500 leading-relaxed font-bold">
                          "To modernize academic governance through robust, user-centric technological architecture."
                        </p>
                      </div>
                   </div>
                </div>
                <BookOpen className="absolute right-[-40px] bottom-[-40px] text-red-50 opacity-40" size={200} />
             </div>
          </div>
        </div>
      )}

      {/* --- PERSISTENT BOTTOM NAVIGATION --- */}
      {!selectedClass && (
        <div className="fixed bottom-0 max-w-[450px] w-full bg-white/95 backdrop-blur-2xl border-t border-slate-100 px-16 py-6 flex justify-around items-center rounded-t-[3.5rem] shadow-[0_-15px_45px_rgba(0,0,0,0.1)] z-50">
          <button onClick={() => {setActiveTab('home'); setSelectedDept(null);}} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'home' ? 'text-red-900 scale-110' : 'text-slate-300'}`}>
            <Home size={28} fill={activeTab === 'home' ? "currentColor" : "none"} />
            <span className="text-[10px] font-black uppercase tracking-widest">Portal</span>
          </button>
          <button onClick={() => setActiveTab('info')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'info' ? 'text-red-900 scale-110' : 'text-slate-300'}`}>
            <Info size={28} fill={activeTab === 'info' ? "currentColor" : "none"} />
            <span className="text-[10px] font-black uppercase tracking-widest">About</span>
          </button>
        </div>
      )}
    </div> 
  );
};

export default App;