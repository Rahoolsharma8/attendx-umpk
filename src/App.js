import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, ArrowLeft, Home, Info, ShieldCheck, Search, 
  BookOpen, Monitor, Database, Cpu, Briefcase, Globe, Award 
} from 'lucide-react';

// Mobile Plugins (Ab ye kaam karenge kyunke package.json fix ho gayi hai)
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

/**
 * ATTENDX - UNIVERSITY OF MIRPURKHAS (UMPK)
 * FINAL PRODUCTION VERSION - LOGO & DOWNLOAD FIXED
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

  useEffect(() => {
    const timer = setTimeout(() => setView('main'), 2800);
    return () => clearTimeout(timer);
  }, []);

  // --- FILE SAVE & SHARE LOGIC ---
  const generateReport = async (record) => {
    const students = STUDENT_DATABASE[record.className] || [];
    let report = `UNIVERSITY OF MIRPURKHAS (UMPK)\nOFFICIAL ATTENDANCE LOG\n------------------------------------\nSubject: ${record.subject}\nClass: ${record.className}\nDate: ${record.date}\n------------------------------------\nRoll No    | Name                | Status\n`;
    students.forEach(s => {
      report += `${s.roll.padEnd(10)} | ${s.name.padEnd(18)} | ${record.data[s.roll] || 'Absent'}\n`;
    });

    try {
      const fileName = `AttendX_${record.className}_${Date.now()}.txt`;
      
      // File save karna storage mein
      const result = await Filesystem.writeFile({
        path: fileName,
        data: report,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      // WhatsApp/Email Share option
      await Share.share({
        title: 'AttendX Report',
        text: `Attendance for ${record.className} - ${record.subject}`,
        url: result.uri,
      });

    } catch (e) {
      // Browser fallback (PC ke liye)
      const blob = new Blob([report], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AttendX_Report_${record.className}.txt`;
      a.click();
    }
  };

  const handleSubmission = () => {
    if (!subject) return alert("Error: Subject title is mandatory.");
    const students = STUDENT_DATABASE[selectedClass];
    const finalData = {};
    students.forEach(s => finalData[s.roll] = attendance[s.roll] || 'Absent');
    const newRecord = { id: Date.now(), className: selectedClass, subject, date, data: finalData };
    setRecords([newRecord, ...records]);
    
    // Save aur Share ko trigger karega
    generateReport(newRecord);
    
    alert("Success: Attendance finalized and share menu opened.");
    setAttendance({});
    setSubject('');
    setSelectedClass(null);
    setSelectedDept(null);
    setActiveTab('home');
  };

  // Splash Screen (Offline Logo fix)
  if (view === 'splash') {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center text-center p-10 select-none overflow-hidden">
        <div className="w-32 h-32 mb-6 bg-red-800 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
             <BookOpen size={60} className="text-white" />
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">AttendX</h1>
        <p className="text-red-800 text-[10px] tracking-[0.4em] uppercase mt-2 font-black">University of Mirpurkhas</p>
      </div>
    );
  }

  const PageHeader = ({ title, showBack = true, onBack }) => (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 p-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {showBack && (
          <button onClick={onBack} className="p-2 bg-slate-50 rounded-2xl active:scale-90 transition-transform">
            <ArrowLeft size={20} className="text-slate-700" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-800 rounded-lg flex items-center justify-center">
             <BookOpen size={16} className="text-white" />
          </div>
          <h2 className="font-black text-slate-900 text-xl tracking-tight leading-none">{title}</h2>
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
    <div className="min-h-screen bg-white max-w-[450px] mx-auto flex flex-col font-sans relative overflow-hidden text-slate-900 shadow-2xl">
      
      {activeTab === 'home' && !selectedDept && !selectedClass && (
        <div className="flex-1 flex flex-col overflow-y-auto pb-32">
          <PageHeader title="UMPK AttendX" showBack={false} />
          <div className="p-6">
            <div className="bg-gradient-to-br from-red-800 to-red-950 rounded-[2.5rem] p-8 text-white shadow-2xl mb-8 relative overflow-hidden">
               <h3 className="text-3xl font-black italic tracking-tight">Main Dashboard</h3>
               <p className="text-red-100 text-[10px] mt-2 font-bold uppercase tracking-widest opacity-80 underline underline-offset-4">Select Department</p>
               <LayoutGrid className="absolute right-[-20px] bottom-[-20px] opacity-10" size={160} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {departments.map((dept) => (
                <button key={dept.id} onClick={() => setSelectedDept(dept.id)} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all">
                  <div className={`w-16 h-16 ${dept.color} rounded-3xl flex items-center justify-center shadow-inner`}>
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
              {[1, 2, 3, 4].map(num => (
                 <button key={num} onClick={() => setSelectedClass(`${selectedDept}${num}`)} className="bg-white p-8 rounded-[2.8rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 active:scale-95 transition-all">
                    <span className="font-black text-4xl text-slate-900">{selectedDept}{num}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{STUDENT_DATABASE[`${selectedDept}${num}`]?.length || 0} Students</span>
                 </button>
              ))}
          </div>
        </div>
      )}

      {selectedClass && (
        <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-40">
          <PageHeader title={selectedClass} onBack={() => setSelectedClass(null)} />
          <div className="p-6 space-y-6">
            <div className="bg-white p-7 rounded-[2.8rem] shadow-sm border border-slate-100 space-y-5">
                <input placeholder="Enter Subject Name..." className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-black text-slate-800 text-lg" value={subject} onChange={(e) => setSubject(e.target.value)} />
                <input type="date" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-black text-slate-800" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <Search size={18} className="text-slate-400" />
                <input placeholder="Search profile..." className="bg-transparent text-sm w-full outline-none font-bold text-slate-600" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
                       <button onClick={() => setAttendance(prev => ({ ...prev, [s.roll]: 'Present' }))} className={`w-14 h-14 rounded-2xl font-black transition-all border-2 flex items-center justify-center text-xl ${attendance[s.roll] === 'Present' ? 'bg-emerald-600 border-emerald-700 text-white shadow-lg shadow-emerald-100' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>P</button>
                       <button onClick={() => setAttendance(prev => ({ ...prev, [s.roll]: 'Absent' }))} className={`w-14 h-14 rounded-2xl font-black transition-all border-2 flex items-center justify-center text-xl ${attendance[s.roll] === 'Absent' ? 'bg-rose-600 border-rose-700 text-white shadow-lg shadow-rose-100' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>A</button>
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
          <PageHeader title="Intelligence" showBack={false} />
          <div className="p-6">
             <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                   <div className="w-24 h-24 mb-6 bg-red-800 rounded-3xl flex items-center justify-center">
                      <BookOpen size={48} className="text-white" />
                   </div>
                   <h3 className="text-2xl font-black text-red-900 mb-2 tracking-tight">AttendX Development</h3>
                   <div className="w-16 h-1 bg-red-800 rounded-full mb-8"></div>
                   
                   <div className="space-y-10 text-slate-600 font-medium leading-relaxed">
                      <p className="text-sm px-2">
                        Engineered by the <span className="text-red-900 font-bold block mt-1 uppercase text-base">Department of Computer Science</span> for UMPK.
                      </p>
                      
                      <div className="p-10 bg-red-50 rounded-[3rem] border border-red-100 shadow-inner">
                        <Award size={36} className="text-red-800 mx-auto mb-4 opacity-30" />
                        <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.4em] mb-3">Supervisor</p>
                        <p className="text-2xl font-black text-slate-950 tracking-tight">HOD Sarvat Nizamani</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {!selectedClass && (
        <div className="fixed bottom-0 max-w-[450px] w-full bg-white/95 backdrop-blur-2xl border-t border-slate-100 px-16 py-6 flex justify-around items-center rounded-t-[3.5rem] shadow-xl z-50">
          <button onClick={() => {setActiveTab('home'); setSelectedDept(null);}} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'home' ? 'text-red-900 scale-110' : 'text-slate-300'}`}>
            <Home size={28} fill={activeTab === 'home' ? "currentColor" : "none"} />
            <span className="text-[10px] font-black uppercase">Portal</span>
          </button>
          <button onClick={() => setActiveTab('info')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'info' ? 'text-red-900 scale-110' : 'text-slate-300'}`}>
            <Info size={28} fill={activeTab === 'info' ? "currentColor" : "none"} />
            <span className="text-[10px] font-black uppercase">About</span>
          </button>
        </div>
      )}
    </div> 
  );
};

export default App;
