
import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Sparkles, 
  Home, 
  CheckCircle, 
  Copy, 
  ArrowRight,
  Plus,
  Trash2,
  Clock,
  Search,
  ChevronRight,
  Calendar,
  Zap,
  Star,
  Download,
  Key,
  RefreshCw,
  LogOut,
  Info,
  UserPlus,
  Users,
  CalendarPlus,
  ExternalLink,
  Map,
  Layers
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { View, HomeTab, CheckInModel, JoyPlan, Turn, AIInsight, DateIdea, PartnerNames, DualReflection } from './types';
import { CHECKIN_MODELS, JOY_SUGGESTIONS } from './constants';
import { geminiService } from './geminiService';

export default function App() {
  const [currentView, setCurrentView] = useState<View>(() => {
    const savedNames = localStorage.getItem('partnerNames');
    return savedNames ? 'home' : 'onboarding';
  });
  const [homeTab, setHomeTab] = useState<HomeTab>('checkins');
  const exportRef = useRef<HTMLDivElement>(null);
  const checkinExportRef = useRef<HTMLDivElement>(null);
  
  const [names, setNames] = useState<PartnerNames>(() => {
    const saved = localStorage.getItem('partnerNames');
    return saved ? JSON.parse(saved) : { p1: '', p2: '' };
  });

  const [joyCode, setJoyCode] = useState<string>(() => localStorage.getItem('activeJoyCode') || '');
  const [isCodeVerified, setIsCodeVerified] = useState<boolean>(!!localStorage.getItem('activeJoyCode'));
  const [codeEntryInput, setCodeEntryInput] = useState('');

  const [selectedModel, setSelectedModel] = useState<CheckInModel | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [dualNotes, setDualNotes] = useState<Record<number, DualReflection>>({});
  const [copied, setCopied] = useState(false);
  const [turn, setTurn] = useState<Turn>('p1');
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const [joyTimeframe, setJoyTimeframe] = useState('Weekly');
  const [joyPlans, setJoyPlans] = useState<Record<string, JoyPlan[]>>({
    'Daily': [], 'Weekly': [], 'Monthly': [], 'Annually': [], '5 Years': []
  });
  const [joyInput, setJoyInput] = useState('');
  const [joyWhen, setJoyWhen] = useState('');
  const [aiDateSuggestions, setAiDateSuggestions] = useState<DateIdea[]>([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [joySubTab, setJoySubTab] = useState<'planner' | 'summary'>('planner');

  const [activeCalendarMenu, setActiveCalendarMenu] = useState<number | string | null>(null);

  useEffect(() => {
    if (isCodeVerified && joyCode) {
      const saved = localStorage.getItem(`joyPlans_${joyCode}`);
      if (saved) setJoyPlans(JSON.parse(saved));
    }
  }, [isCodeVerified, joyCode]);

  useEffect(() => {
    if (isCodeVerified && joyCode) {
      localStorage.setItem(`joyPlans_${joyCode}`, JSON.stringify(joyPlans));
    }
  }, [joyPlans, isCodeVerified, joyCode]);

  useEffect(() => {
    localStorage.setItem('partnerNames', JSON.stringify(names));
  }, [names]);

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (names.p1 && names.p2) setCurrentView('home');
  };

  const handleGenerateCode = () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setJoyCode(newCode);
    setIsCodeVerified(true);
    localStorage.setItem('activeJoyCode', newCode);
  };

  const handleVerifyCode = () => {
    const code = codeEntryInput.trim().toUpperCase();
    if (code.length >= 4) {
      setJoyCode(code);
      setIsCodeVerified(true);
      localStorage.setItem('activeJoyCode', code);
    }
  };

  const handleLogoutCode = () => {
    localStorage.removeItem('activeJoyCode');
    setJoyCode('');
    setIsCodeVerified(false);
    setCodeEntryInput('');
  };

  const startCheckIn = (model: CheckInModel) => {
    setSelectedModel(model);
    setCurrentStepIndex(0);
    setDualNotes({});
    setTurn('p1');
    setInsight(null);
    setCurrentView('checkin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep = async () => {
    if (!selectedModel) return;
    if (turn === 'p1') {
      setTurn('p2');
    } else {
      if (currentStepIndex < selectedModel.steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
        setTurn('p1');
      } else {
        setCurrentView('summary');
        setLoadingInsight(true);
        try {
          const flatNotes: Record<number, string> = {};
          Object.entries(dualNotes).forEach(([idx, note]) => {
            const reflection = note as DualReflection;
            flatNotes[parseInt(idx)] = `${names.p1}: ${reflection.p1}. ${names.p2}: ${reflection.p2}.`;
          });
          const res = await geminiService.analyzeCheckIn(selectedModel.acronym, flatNotes);
          setInsight(res);
        } catch (error) {
          console.error("AI Insight failed", error);
        } finally {
          setLoadingInsight(false);
        }
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    if (turn === 'p2') setTurn('p1');
    else {
      if (currentStepIndex > 0) {
        setCurrentStepIndex(prev => prev + 1);
        setTurn('p2');
      } else {
        setCurrentView('home');
        setSelectedModel(null);
      }
    }
  };

  const addJoyPlan = (activity: string, timeInfo: string) => {
    if (!activity) return;
    const newPlan: JoyPlan = { id: Date.now(), activity, timeInfo };
    setJoyPlans(prev => ({
      ...prev,
      [joyTimeframe]: [...(prev[joyTimeframe] || []), newPlan]
    }));
    setJoyInput('');
    setJoyWhen('');
  };

  const removeJoyPlan = (id: number, timeframeOverride?: string) => {
    const tf = timeframeOverride || joyTimeframe;
    setJoyPlans(prev => ({
      ...prev,
      [tf]: (prev[tf] || []).filter(p => p.id !== id)
    }));
  };

  const fetchAIDateIdeas = async () => {
    setLoadingDates(true);
    try {
      const ideas = await geminiService.suggestDateIdeas(joyTimeframe);
      setAiDateSuggestions(ideas);
    } catch (error) {
      console.error("Failed to fetch date ideas", error);
    } finally {
      setLoadingDates(false);
    }
  };

  const exportRefToImage = async (ref: React.RefObject<HTMLDivElement>, fileName: string) => {
    if (!ref.current) return;
    setIsExporting(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      const canvas = await html2canvas(ref.current, {
        backgroundColor: '#f0fdfa',
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 1000,
        onclone: (clonedDoc) => {
          const el = clonedDoc.querySelector('.export-container') as HTMLElement;
          if (el) el.style.display = 'block';
        }
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png', 1.0);
      link.download = `${fileName}.png`;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const generateCalendarLink = (title: string, description: string) => {
    const encodedTitle = encodeURIComponent(title);
    const encodedDetails = encodeURIComponent(description);
    const now = new Date();
    const start = now.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(now.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&details=${encodedDetails}&dates=${start}/${end}`;
  };

  const downloadICSFile = (title: string, description: string) => {
    const now = new Date();
    const start = now.toISOString().replace(/-|:|\.\d\d\d/g, "").slice(0, 15) + 'Z';
    const end = new Date(now.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "").slice(0, 15) + 'Z';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CoupleConnect//RelationshipDashboard//EN',
      'BEGIN:VEVENT',
      `DTSTAMP:${start}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${title.replace(/\s+/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllJoyPlansICS = () => {
    const now = new Date();
    const stamp = now.toISOString().replace(/-|:|\.\d\d\d/g, "").slice(0, 15) + 'Z';
    let events: string[] = [];
    // Fix: Cast Object.entries to correct type to resolve 'unknown' type error in forEach loop.
    (Object.entries(joyPlans) as [string, JoyPlan[]][]).forEach(([timeframe, plans]) => {
      plans.forEach((plan, index) => {
        const eventStart = new Date(now.getTime() + index * 30 * 60 * 1000);
        const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000);
        const startStr = eventStart.toISOString().replace(/-|:|\.\d\d\d/g, "").slice(0, 15) + 'Z';
        const endStr = eventEnd.toISOString().replace(/-|:|\.\d\d\d/g, "").slice(0, 15) + 'Z';
        events.push([
          'BEGIN:VEVENT',
          `DTSTAMP:${stamp}`,
          `DTSTART:${startStr}`,
          `DTEND:${endStr}`,
          `SUMMARY:[${timeframe}] ${plan.activity}`,
          `DESCRIPTION:Planned Joy for ${names.p1} & ${names.p2}. Timing: ${plan.timeInfo || 'Not specified'}`,
          'END:VEVENT'
        ].join('\r\n'));
      });
    });
    if (events.length === 0) return;
    const icsContent = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CoupleConnect//RelationshipDashboard//EN', ...events, 'END:VCALENDAR'].join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Our-Full-Joy-Roadmap.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copySummary = () => {
    if (!selectedModel) return;
    let text = `Relationship Check-In (${selectedModel.acronym}) - ${new Date().toLocaleDateString()}\n\n`;
    selectedModel.steps.forEach((step, idx) => {
      text += `${step.letter} - ${step.word}: ${step.question.replace('[Name]', names.p1)} / ${step.question.replace('[Name]', names.p2)}\n`;
      const note = dualNotes[idx];
      if (note) {
        text += `${names.p1}: ${note.p1 || 'No note'}\n`;
        text += `${names.p2}: ${note.p2 || 'No note'}\n\n`;
      }
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goHome = () => {
    setCurrentView('home');
    setSelectedModel(null);
    setCurrentStepIndex(0);
    setDualNotes({});
    setTurn('p1');
    setInsight(null);
  };

  const renderOnboarding = () => (
    <div className="max-w-md mx-auto px-4 py-20 flex flex-col min-h-screen">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="w-20 h-20 bg-pink-100 text-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-100">
          <Heart size={40} fill="currentColor" />
        </div>
        <h1 className="text-4xl serif italic text-teal-900 mb-4">Couple-Connect</h1>
        <p className="text-teal-600 font-medium">Personalize your journey by entering your names.</p>
      </div>
      <form onSubmit={handleOnboardingSubmit} className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-teal-100 space-y-8 animate-in zoom-in-95 duration-500">
        <div className="space-y-6">
          <div className="relative">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 absolute -top-2 left-4 bg-white px-2">Partner 1</label>
            <input required type="text" value={names.p1} onChange={(e) => setNames({...names, p1: e.target.value})} placeholder="Enter name" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-teal-900 focus:outline-none focus:border-pink-300 transition-all"/>
          </div>
          <div className="flex justify-center text-pink-200"><Users size={24} /></div>
          <div className="relative">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 absolute -top-2 left-4 bg-white px-2">Partner 2</label>
            <input required type="text" value={names.p2} onChange={(e) => setNames({...names, p2: e.target.value})} placeholder="Enter name" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-teal-900 focus:outline-none focus:border-pink-300 transition-all"/>
          </div>
        </div>
        <button type="submit" className="w-full py-5 bg-teal-900 text-white rounded-2xl font-black text-xl hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3">
          Let's Begin <ArrowRight size={24} />
        </button>
      </form>
    </div>
  );

  const renderHome = () => (
    <div className="max-w-xl mx-auto px-4 pt-12 pb-32">
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-teal-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><Heart fill="currentColor" size={28} /></div>
          <div><h1 className="text-3xl serif italic text-teal-900 leading-tight">{names.p1} & {names.p2}</h1><p className="text-teal-500 font-bold uppercase tracking-widest text-[10px]">Growing Together</p></div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCurrentView('onboarding')} className="p-3 text-slate-400 hover:text-teal-600 transition-colors" title="Edit Names"><UserPlus size={20} /></button>
          <button onClick={() => { if(confirm("Clear all names and local plans?")) { localStorage.clear(); window.location.reload(); } }} className="p-3 text-slate-400 hover:text-red-500 transition-colors" title="Reset App"><Trash2 size={20} /></button>
        </div>
      </header>
      {homeTab === 'checkins' ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 mb-4 px-1"><div className="p-2 bg-pink-100 rounded-lg text-pink-600"><CheckCircle size={20} /></div><h2 className="text-xl font-black text-teal-900 tracking-tight">Select a Heart Sync</h2></div>
          <div className="grid grid-cols-1 gap-8">
            {CHECKIN_MODELS.map(model => {
              const isPromoted = ['care', 'love'].includes(model.id);
              return (
                <button key={model.id} onClick={() => startCheckIn(model)} className={`group relative text-left transition-all overflow-hidden ${isPromoted ? 'bg-gradient-to-br from-white to-teal-50 p-10 rounded-[3rem] border-4 border-teal-900 shadow-[0_25px_60px_rgba(13,148,136,0.18)] scale-[1.02] hover:scale-[1.05]' : 'bg-white p-8 rounded-[2.5rem] border border-teal-100 shadow-xl shadow-teal-900/5 hover:scale-[1.02]'}`}>
                  <div className="flex items-start justify-between mb-4">
                    {/* Highlighted Acronym */}
                    <div className={`px-6 py-2 rounded-full text-[14px] font-black uppercase tracking-[0.2em] shadow-md border-b-4 ${isPromoted ? 'bg-teal-900 text-teal-50 border-teal-950 scale-110' : model.color + ' border-teal-200'}`}>
                      {model.acronym}
                    </div>
                    <div className={`${isPromoted ? 'text-6xl' : 'text-4xl'} drop-shadow-sm`}>{model.emoji}</div>
                  </div>
                  <h3 className={`${isPromoted ? 'text-4xl' : 'text-2xl'} font-black text-teal-900 mb-2 tracking-tight`}>{model.title}</h3>
                  <p className={`${isPromoted ? 'text-lg' : 'text-slate-500'} font-medium mb-4 leading-relaxed opacity-80`}>{model.description}</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {model.steps.map((s, i) => (
                      <span key={i} className="text-[10px] font-black bg-teal-50 text-teal-700 px-3 py-1.5 rounded-xl border border-teal-100 flex items-center gap-1 shadow-sm">
                        <span className="text-pink-500 font-black">{s.letter}</span> {s.word}
                      </span>
                    ))}
                  </div>
                  <div className={`flex items-center gap-2 ${isPromoted ? 'text-teal-900 text-xl' : 'text-teal-700'} font-black`}>Start Session <ChevronRight size={isPromoted ? 28 : 18} className="group-hover:translate-x-2 transition-transform" /></div>
                  {isPromoted && <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Heart size={160} fill="currentColor" className="text-teal-900" /></div>}
                </button>
              );
            })}
          </div>
        </div>
      ) : renderJoyTab()}
    </div>
  );

  const renderJoyTab = () => !isCodeVerified ? renderCodeGate() : (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-1 bg-white border border-teal-100 rounded-2xl shadow-sm mb-4">
        <button onClick={() => setJoySubTab('planner')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all ${joySubTab === 'planner' ? 'bg-teal-900 text-white shadow-lg' : 'text-teal-600 hover:bg-teal-50'}`}><Plus size={18} /> Planner</button>
        <button onClick={() => setJoySubTab('summary')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all ${joySubTab === 'summary' ? 'bg-pink-600 text-white shadow-lg' : 'text-pink-600 hover:bg-pink-50'}`}><Map size={18} /> Our Roadmap</button>
      </div>
      {joySubTab === 'planner' ? renderJoyPlanner() : renderOverallJoySummary()}
    </div>
  );

  const renderOverallJoySummary = () => {
    // Fix: Explicitly cast Object.values to resolve 'unknown' type error in .some()
    const hasPlans = (Object.values(joyPlans) as JoyPlan[][]).some(arr => arr.length > 0);
    return (
      <div className="animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-teal-100 p-10 mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4"><div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 shadow-inner"><Layers size={28} /></div><div><h2 className="text-3xl font-black text-teal-900 tracking-tight">Our Joy Tapestry</h2><p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Planned Activities</p></div></div>
            <div className="flex gap-2">
              <button onClick={downloadAllJoyPlansICS} className="p-4 bg-teal-50 text-teal-700 rounded-2xl hover:bg-teal-100 transition-all border border-teal-100 shadow-sm" title="Sync All to Calendar"><CalendarPlus size={24} /></button>
              <button onClick={() => exportRefToImage(exportRef, `Full-Joy-Roadmap-${joyCode}`)} disabled={isExporting} className="p-4 bg-teal-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl disabled:opacity-50" title="Save as Image"><Download size={24} /></button>
            </div>
          </div>
          {!hasPlans ? (
            <div className="text-center py-20 border-4 border-dashed border-teal-50 rounded-[2.5rem]"><div className="text-5xl mb-4">🛶</div><p className="text-teal-900 font-black text-xl mb-2">Our map is still blank!</p><p className="text-slate-400 font-medium">Add some plans in the Planner tab.</p></div>
          ) : (
            <div className="space-y-12">
              {/* Fix: Explicitly cast Object.entries to resolve 'unknown' type error on 'plans' within the map callback */}
              {(Object.entries(joyPlans) as [string, JoyPlan[]][]).map(([tf, plans]) => plans.length > 0 && (
                <div key={tf} className="relative pl-8 border-l-4 border-teal-50 pb-4">
                  <div className="absolute -left-[10px] top-0 w-4 h-4 rounded-full bg-teal-500 border-4 border-white shadow-sm" />
                  <h3 className="text-xl font-black text-teal-900 uppercase tracking-tighter mb-6">{tf} Goals</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plans.map(p => (
                      <div key={p.id} className="bg-teal-50/50 p-6 rounded-[1.5rem] border border-teal-100 hover:bg-white transition-all group">
                        <div className="flex items-start justify-between"><div><p className="font-black text-teal-900 group-hover:text-pink-600 transition-colors">{p.activity}</p>{p.timeInfo && <p className="text-xs text-pink-500 font-bold mt-1 flex items-center gap-1"><Clock size={12} /> {p.timeInfo}</p>}</div><button onClick={() => removeJoyPlan(p.id, tf)} className="p-2 text-teal-100 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCodeGate = () => (
    <div className="max-w-md mx-auto px-4 py-16 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-8 text-teal-600 shadow-lg"><Key size={40} /></div>
      <h1 className="text-3xl serif italic text-teal-900 mb-4">Secure Joy Plan</h1>
      <p className="text-teal-600 font-medium mb-10 leading-relaxed">Enter your shared JOY CODE to retrieve your plan.</p>
      <div className="space-y-6">
        <input type="text" value={codeEntryInput} onChange={(e) => setCodeEntryInput(e.target.value.toUpperCase())} placeholder="Enter Code" className="w-full bg-white border-2 border-teal-100 rounded-2xl px-6 py-4 text-center font-black text-2xl tracking-[0.3em] text-teal-900 focus:outline-none focus:border-teal-500 transition-all"/>
        <button onClick={handleVerifyCode} disabled={codeEntryInput.length < 4} className="w-full py-4 bg-teal-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl disabled:opacity-50">Retrieve My Plan</button>
        <button onClick={handleGenerateCode} className="w-full py-4 bg-white text-teal-900 border-2 border-teal-100 rounded-2xl font-black text-lg hover:bg-teal-50 transition-all flex items-center justify-center gap-3 mt-4"><RefreshCw size={20} /> New Code</button>
      </div>
    </div>
  );

  const renderJoyPlanner = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8 px-2 bg-teal-100/50 p-4 rounded-3xl border border-teal-100 shadow-sm">
        <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-900 shadow-sm"><Key size={18} /></div><div><p className="text-[10px] font-black uppercase text-teal-500 tracking-widest">Active Joy Code</p><p className="text-lg font-black text-teal-900 tracking-[0.1em]">{joyCode}</p></div></div>
        <button onClick={handleLogoutCode} className="p-2 text-teal-400 hover:text-red-500 transition-colors font-bold flex items-center gap-1 text-xs">Switch <LogOut size={16} /></button>
      </div>
      <div className="flex overflow-x-auto gap-3 no-scrollbar pb-4">
        {['Daily', 'Weekly', 'Monthly', 'Annually', '5 Years'].map(tf => (
          <button key={tf} onClick={() => { setJoyTimeframe(tf); setAiDateSuggestions([]); }} className={`px-6 py-2.5 rounded-2xl whitespace-nowrap text-sm font-bold transition-all border shadow-sm ${joyTimeframe === tf ? 'bg-pink-600 text-white border-pink-500' : 'bg-white text-slate-500 border-teal-100 hover:bg-teal-50'}`}>{tf}</button>
        ))}
      </div>
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-teal-100 p-8 mb-8">
        <div className="flex items-center justify-between mb-8"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600"><Sparkles size={24} /></div><div><h2 className="text-2xl font-extrabold text-teal-900 tracking-tight">Plan {joyTimeframe} Joy</h2></div></div><button onClick={fetchAIDateIdeas} disabled={loadingDates} className="p-3 bg-teal-50 text-teal-700 rounded-2xl hover:bg-teal-100 transition-all disabled:opacity-50">{loadingDates ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap size={20} fill="currentColor" />}</button></div>
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative"><input type="text" value={joyInput} onChange={(e) => setJoyInput(e.target.value)} placeholder="What activity?" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 pl-12 text-slate-700 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all font-medium" /><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /></div>
            <div className="relative"><input type="text" value={joyWhen} onChange={(e) => setJoyWhen(e.target.value)} placeholder="When?" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 pl-12 text-slate-700 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all font-medium" /><Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /></div>
          </div>
          <button onClick={() => addJoyPlan(joyInput, joyWhen)} disabled={!joyInput} className="w-full py-4 rounded-2xl font-extrabold text-white bg-teal-800 hover:bg-teal-900 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2 text-lg"><Plus size={22} /> Add to Plan</button>
        </div>
        {aiDateSuggestions.length > 0 && (
          <div className="mb-8 p-6 bg-pink-50/50 rounded-[2rem] border border-pink-100 animate-in fade-in zoom-in-95">
            <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Zap size={14} fill="currentColor" /> AI Date Ideas</p>
            <div className="grid grid-cols-1 gap-4">
              {aiDateSuggestions.map((idea, idx) => (
                <button key={idx} onClick={() => { setJoyInput(idea.title); setJoyWhen('Special Date'); }} className="bg-white p-5 rounded-2xl text-left border border-pink-100 hover:shadow-md transition-all group">
                  <p className="font-bold text-teal-900 mb-1 group-hover:text-pink-600">{idea.title}</p><p className="text-xs text-slate-500 leading-relaxed mb-1">{idea.description}</p><p className="text-[10px] font-medium text-pink-400 italic">{idea.whyItWorks}</p>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2.5">{JOY_SUGGESTIONS[joyTimeframe]?.map((sugg, idx) => (<button key={idx} onClick={() => setJoyInput(sugg)} className="px-4 py-2 bg-pink-50 text-pink-700 text-sm font-bold rounded-xl hover:bg-pink-100 transition-colors border border-pink-100 shadow-sm">{sugg}</button>))}</div>
      </div>
      <div className="space-y-4">
        {joyPlans[joyTimeframe].map(plan => (
          <div key={plan.id} className="bg-white p-5 rounded-3xl shadow-sm border border-teal-100 flex flex-col group hover:shadow-md transition-all">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4"><div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600"><CheckCircle size={20} /></div><div><p className="font-bold text-teal-900 text-lg">{plan.activity}</p>{plan.timeInfo && <p className="text-sm text-pink-500 font-bold flex items-center gap-1.5 mt-0.5"><Calendar size={14} /> {plan.timeInfo}</p>}</div></div>
              <div className="flex items-center gap-1">
                <div className="relative">
                  <button onClick={(e) => { e.stopPropagation(); setActiveCalendarMenu(activeCalendarMenu === plan.id ? null : plan.id); }} className="text-teal-400 hover:text-teal-600 transition-all p-3 hover:bg-teal-50 rounded-2xl"><CalendarPlus size={20} /></button>
                  {activeCalendarMenu === plan.id && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-teal-100 rounded-2xl shadow-2xl z-[60] p-2 animate-in fade-in zoom-in-95">
                      <a href={generateCalendarLink(`Joy: ${plan.activity}`, `Timing: ${plan.timeInfo}.`)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-full p-3 text-sm font-bold text-teal-900 hover:bg-teal-50 rounded-xl transition-all" onClick={() => setActiveCalendarMenu(null)}><ExternalLink size={14} /> Google Calendar</a>
                      <button onClick={() => { downloadICSFile(plan.activity, plan.timeInfo); setActiveCalendarMenu(null); }} className="flex items-center gap-2 w-full p-3 text-sm font-bold text-teal-900 hover:bg-teal-50 rounded-xl transition-all text-left"><Download size={14} /> Download iCal (.ics)</button>
                    </div>
                  )}
                </div>
                <button onClick={() => removeJoyPlan(plan.id)} className="text-slate-200 hover:text-red-500 transition-all p-3 hover:bg-red-50 rounded-2xl"><Trash2 size={20} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCheckIn = () => {
    if (!selectedModel) return null;
    const step = selectedModel.steps[currentStepIndex];
    const progress = (((currentStepIndex * 2) + (turn === 'p1' ? 1 : 2)) / (selectedModel.steps.length * 2)) * 100;
    const currentName = turn === 'p1' ? names.p1 : names.p2;
    const currentQuestion = step.question.replace('[Name]', currentName);
    const cardClasses = turn === 'p1' ? 'bg-teal-900 border-teal-800' : 'bg-pink-600 border-pink-500';
    const iconBg = turn === 'p1' ? 'bg-teal-800/50' : 'bg-pink-700/50';

    return (
      <div className="max-w-xl mx-auto px-4 py-8 flex flex-col min-h-screen">
        <div className="flex items-center justify-between mb-8"><button onClick={goHome} className="p-3 bg-white text-teal-500 rounded-2xl border border-teal-100 shadow-sm"><Home size={22} /></button><div className="text-center"><p className="text-[10px] font-black uppercase tracking-widest text-teal-900">{selectedModel.acronym} Phase</p><p className="text-xs font-bold text-teal-500">Step {currentStepIndex + 1} of {selectedModel.steps.length}</p></div><div className="w-12" /></div>
        <div className="w-full h-2 bg-teal-100 rounded-full mb-10 overflow-hidden shadow-inner"><div className="h-full bg-gradient-to-r from-teal-500 to-pink-500 transition-all duration-700" style={{ width: `${progress}%` }} /></div>
        <div className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className={`rounded-[3.5rem] shadow-2xl p-10 text-center border-4 transition-all duration-500 overflow-hidden relative ${cardClasses}`}>
            <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-2xl font-black mb-6 text-white shadow-lg ${iconBg}`}>{step.letter}</div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-white/60">{step.word}</h2>
            <div className="mb-10">
              <div className="text-7xl mb-8 animate-pulse">{step.emoji}</div>
              {/* Question font: simple and readable as requested */}
              <p className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight px-2">"{currentQuestion}"</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 mb-8 inline-flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${turn === 'p1' ? 'bg-teal-400 text-teal-900' : 'bg-pink-400 text-pink-900'}`}>{currentName.charAt(0)}</div>
              <div className="text-left"><p className="text-[10px] font-black uppercase tracking-widest text-white/50">Listening to</p><p className="text-xl font-black text-white">{currentName}</p></div>
            </div>
            <div className="text-left mt-auto">
              <textarea value={dualNotes[currentStepIndex]?.[turn] || ''} onChange={(e) => { const currentNotes = dualNotes[currentStepIndex] || { p1: '', p2: '' }; setDualNotes({ ...dualNotes, [currentStepIndex]: { ...currentNotes, [turn]: e.target.value } }); }} placeholder={`Share something from your heart, ${currentName}...`} className="w-full bg-white/10 border-2 border-white/10 rounded-3xl p-6 text-white placeholder:text-white/20 focus:outline-none focus:bg-white/20 focus:border-white/30 transition-all resize-none h-40 font-medium"/>
            </div>
          </div>
        </div>
        <div className="mt-10 flex gap-4"><button onClick={handlePrevStep} className="flex-1 py-5 rounded-3xl font-black text-teal-700 bg-white border-2 border-teal-100 hover:bg-teal-50 transition-all">Back</button><button onClick={handleNextStep} className={`flex-1 py-5 rounded-3xl font-black text-white shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 ${selectedModel.buttonColor}`}>{turn === 'p1' ? `Next: ${names.p2}` : (currentStepIndex === selectedModel.steps.length - 1 ? 'Finish' : 'Next Step')}<ArrowRight size={20} /></button></div>
      </div>
    );
  };

  const renderSummary = () => {
    if (!selectedModel) return null;
    const sessionTitle = `${selectedModel.acronym} Heart Sync Complete`;
    const sessionDesc = `Check-in between ${names.p1} and ${names.p2}. Completed on ${new Date().toLocaleDateString()}.`;
    return (
      <div className="max-w-xl mx-auto px-4 py-12 pb-32">
        <div className="flex items-center justify-between mb-10"><button onClick={goHome} className="p-3 bg-white text-teal-500 rounded-2xl border border-teal-100 shadow-sm"><Home size={22} /></button><h2 className="text-2xl font-black text-teal-900 tracking-tight">Sync Summary</h2><div className="flex gap-2">
          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setActiveCalendarMenu(activeCalendarMenu === 'summary-cal' ? null : 'summary-cal'); }} className="p-3 bg-white text-teal-600 rounded-2xl shadow-sm border border-teal-100 hover:text-teal-900 transition-all"><CalendarPlus size={20} /></button>
            {activeCalendarMenu === 'summary-cal' && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-teal-100 rounded-2xl shadow-2xl z-[60] p-2 animate-in fade-in zoom-in-95">
                <a href={generateCalendarLink(sessionTitle, sessionDesc)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-full p-3 text-sm font-bold text-teal-900 hover:bg-teal-50 rounded-xl transition-all" onClick={() => setActiveCalendarMenu(null)}><ExternalLink size={14} /> Google Calendar</a>
                <button onClick={() => { downloadICSFile(sessionTitle, sessionDesc); setActiveCalendarMenu(null); }} className="flex items-center gap-2 w-full p-3 text-sm font-bold text-teal-900 hover:bg-teal-50 rounded-xl transition-all text-left"><Download size={14} /> Download iCal (.ics)</button>
              </div>
            )}
          </div>
          <button onClick={() => exportRefToImage(checkinExportRef, `CheckIn-${selectedModel.acronym}`)} disabled={isExporting} className="p-3 bg-teal-900 text-white rounded-2xl hover:bg-black transition-all shadow-lg disabled:opacity-50"><Download size={20} /></button>
          <button onClick={copySummary} className="p-3 bg-white text-teal-500 rounded-2xl border border-teal-100 shadow-sm">{copied ? <CheckCircle size={20} className="text-green-500" /> : <Copy size={20} />}</button>
        </div></div>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {loadingInsight ? (
            <div className="bg-white rounded-[3rem] p-12 text-center shadow-xl border border-teal-100"><div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6"><RefreshCw size={40} className="text-pink-500 animate-spin" /></div><h3 className="text-2xl font-black text-teal-900 mb-2">Generating Insights...</h3></div>
          ) : insight && (
            <div className="bg-gradient-to-br from-teal-900 to-teal-800 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden"><div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles size={120} fill="currentColor" /></div><div className="relative z-10"><div className="flex items-center gap-3 mb-6"><div className="px-3 py-1 bg-teal-400 text-teal-900 rounded-full text-[10px] font-black uppercase tracking-widest">AI Insight</div><div className="flex-1 h-px bg-white/20" /></div><div className="mb-8"><p className="text-teal-400 font-black uppercase tracking-widest text-xs mb-2">Overall Mood</p><h3 className="text-3xl serif italic font-bold leading-tight">"{insight.mood}"</h3></div><div className="mb-8"><p className="text-teal-400 font-black uppercase tracking-widest text-xs mb-2">Encouragement</p><p className="text-xl font-medium leading-relaxed opacity-90">{insight.encouragement}</p></div><div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10"><p className="text-teal-300 font-black uppercase tracking-widest text-[10px] mb-3">Focus for Growth</p><p className="text-lg font-bold flex items-start gap-3 italic"><Star size={24} className="text-pink-400 shrink-0 mt-1" fill="currentColor" />{insight.suggestedFocus}</p></div></div></div>
          )}
          <div className="space-y-6">
             <h3 className="text-xl font-black text-teal-900 px-2 flex items-center gap-2"><Layers size={20} /> Recap</h3>
             {selectedModel.steps.map((step, idx) => (
               <div key={idx} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-teal-50">
                 <div className="flex items-center gap-4 mb-6"><div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl ${selectedModel.buttonColor.split(' ')[0]}`}>{step.letter}</div><div><h4 className="font-black text-teal-900">{step.word}</h4><p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{step.emoji} Question</p></div></div>
                 <div className="space-y-4">
                   <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100"><p className="text-[10px] font-black text-teal-500 uppercase mb-2 tracking-widest">{names.p1}</p><p className="text-slate-700 italic font-medium leading-relaxed">"{dualNotes[idx]?.p1 || 'No reflection'}"</p></div>
                   <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100"><p className="text-[10px] font-black text-pink-500 uppercase mb-2 tracking-widest">{names.p2}</p><p className="text-slate-700 italic font-medium leading-relaxed">"{dualNotes[idx]?.p2 || 'No reflection'}"</p></div>
                 </div>
               </div>
             ))}
          </div>
          <button onClick={goHome} className="w-full py-6 bg-teal-900 text-white rounded-3xl font-black text-xl hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3">Done <ArrowRight size={24} /></button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-teal-50 selection:bg-pink-100 selection:text-teal-900" onClick={() => setActiveCalendarMenu(null)}>
      {currentView === 'onboarding' && renderOnboarding()}
      {currentView === 'home' && renderHome()}
      {currentView === 'checkin' && renderCheckIn()}
      {currentView === 'summary' && renderSummary()}
      {currentView === 'home' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-xs bg-teal-900/90 backdrop-blur-xl p-2 rounded-full flex justify-around items-center shadow-2xl border border-white/20 z-50">
          <button onClick={() => setHomeTab('checkins')} className={`p-4 rounded-full transition-all flex-1 flex justify-center ${homeTab === 'checkins' ? 'bg-white text-teal-900 shadow-lg' : 'text-white/60 hover:text-white'}`}><Heart size={24} fill={homeTab === 'checkins' ? "currentColor" : "none"} /></button>
          <button onClick={() => setHomeTab('joy')} className={`p-4 rounded-full transition-all flex-1 flex justify-center ${homeTab === 'joy' ? 'bg-white text-teal-900 shadow-lg' : 'text-white/60 hover:text-white'}`}><Sparkles size={24} fill={homeTab === 'joy' ? "currentColor" : "none"} /></button>
        </div>
      )}

      {/* Hidden Ref for Roadmap Export */}
      <div className="fixed -left-[10000px] top-0 pointer-events-none">
        <div ref={exportRef} className="export-container w-[1000px] bg-teal-50 p-20 rounded-[4rem] border-[20px] border-white shadow-2xl">
           <div className="text-center mb-20 border-b-8 border-teal-100 pb-16 relative">
              <div className="absolute top-0 right-0 p-8 bg-teal-900 text-white rounded-[2.5rem] font-black text-2xl tracking-widest shadow-2xl">ROADMAP: {joyCode}</div>
              <h1 className="text-8xl serif italic text-teal-900 mb-8">Couple-Connect</h1>
              <p className="text-4xl text-teal-600 font-black tracking-[0.4em] uppercase">{names.p1} & {names.p2}</p>
           </div>
           <div className="grid grid-cols-2 gap-16">
              {(Object.entries(joyPlans) as [string, JoyPlan[]][]).map(([tf, plans]) => (
                 <div key={tf} className="bg-white rounded-[4rem] p-14 border-4 border-teal-50 flex flex-col h-full">
                    <div className="flex items-center gap-6 mb-10 border-b-4 border-pink-100 pb-6"><div className="w-16 h-16 bg-teal-900 text-white rounded-[1.5rem] flex items-center justify-center text-2xl"><Calendar size={32} /></div><h3 className="text-5xl font-black text-teal-900 uppercase tracking-tighter">{tf}</h3></div>
                    {plans.length === 0 ? <p className="text-slate-200 italic text-3xl font-medium mt-4">Still dreaming...</p> : 
                      <ul className="space-y-10">{plans.map(p => (<li key={p.id} className="bg-teal-50/50 p-10 rounded-[3rem] border-2 border-teal-100"><div className="text-3xl font-black text-teal-900 mb-4 tracking-tight leading-tight">{p.activity}</div>{p.timeInfo && <div className="text-xl text-pink-600 font-black tracking-widest uppercase">{p.timeInfo}</div>}</li>))}</ul>}
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* Hidden Ref for Check-in Export */}
      <div className="fixed -left-[10000px] top-0 pointer-events-none">
        <div ref={checkinExportRef} className="export-container w-[1000px] p-24 bg-white rounded-[5rem] border-[30px] border-teal-50 shadow-2xl">
            <div className="text-center mb-24 border-b-8 border-teal-100 pb-16">
                <h1 className="text-9xl serif italic text-teal-900 mb-6">Heart Sync</h1>
                <p className="text-5xl font-black text-teal-500 tracking-[0.5em] uppercase">{selectedModel?.acronym} Report</p>
                <div className="mt-10 p-6 bg-teal-50 rounded-[2rem] inline-block font-black text-2xl text-teal-900 uppercase tracking-widest">{names.p1} & {names.p2} • {new Date().toLocaleDateString()}</div>
            </div>
            <div className="space-y-20">
               {selectedModel?.steps.map((step, idx) => (
                 <div key={idx} className="bg-white p-16 rounded-[4rem] shadow-2xl border-2 border-teal-50">
                    <div className="flex items-center gap-10 mb-14"><div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl font-black text-white ${selectedModel.buttonColor.split(' ')[0]}`}>{step.letter}</div><h2 className="text-6xl font-black text-teal-900 uppercase tracking-tighter">{step.word}</h2></div>
                    <div className="grid grid-cols-2 gap-20">
                      <div className="space-y-8 p-12 bg-teal-50 rounded-[3rem] relative"><div className="absolute -top-6 left-12 p-4 bg-teal-900 text-white rounded-xl font-black text-xl uppercase tracking-widest">{names.p1}</div><p className="text-3xl font-bold text-teal-900 italic pt-4">"{dualNotes[idx]?.p1 || 'No reflection'}"</p></div>
                      <div className="space-y-8 p-12 bg-pink-50 rounded-[3rem] relative"><div className="absolute -top-6 left-12 p-4 bg-pink-600 text-white rounded-xl font-black text-xl uppercase tracking-widest">{names.p2}</div><p className="text-3xl font-bold text-teal-900 italic pt-4">"{dualNotes[idx]?.p2 || 'No reflection'}"</p></div>
                    </div>
                 </div>
               ))}
            </div>
        </div>
      </div>
    </div>
  );
}
