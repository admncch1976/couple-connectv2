
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
  ExternalLink
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
  
  // Names State
  const [names, setNames] = useState<PartnerNames>(() => {
    const saved = localStorage.getItem('partnerNames');
    return saved ? JSON.parse(saved) : { p1: '', p2: '' };
  });

  // Joy Code Logic
  const [joyCode, setJoyCode] = useState<string>(() => localStorage.getItem('activeJoyCode') || '');
  const [isCodeVerified, setIsCodeVerified] = useState<boolean>(!!localStorage.getItem('activeJoyCode'));
  const [codeEntryInput, setCodeEntryInput] = useState('');

  // Check-in State
  const [selectedModel, setSelectedModel] = useState<CheckInModel | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [dualNotes, setDualNotes] = useState<Record<number, DualReflection>>({});
  const [copied, setCopied] = useState(false);
  const [turn, setTurn] = useState<Turn>('p1');
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Joy/Planning State
  const [joyTimeframe, setJoyTimeframe] = useState('Weekly');
  const [joyPlans, setJoyPlans] = useState<Record<string, JoyPlan[]>>({
    'Daily': [], 'Weekly': [], 'Monthly': [], 'Annually': [], '5 Years': []
  });
  const [joyInput, setJoyInput] = useState('');
  const [joyWhen, setJoyWhen] = useState('');
  const [aiDateSuggestions, setAiDateSuggestions] = useState<DateIdea[]>([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Calendar State
  const [activeCalendarMenu, setActiveCalendarMenu] = useState<number | null>(null);

  // Persistence per Joy Code
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

  // --- Handlers ---

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (names.p1 && names.p2) {
      setCurrentView('home');
    }
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
    if (turn === 'p2') {
      setTurn('p1');
    } else {
      if (currentStepIndex > 0) {
        setCurrentStepIndex(prev => prev - 1);
        setTurn('p2');
      } else {
        setCurrentView('home');
        setSelectedModel(null);
      }
    }
  };

  const addJoyPlan = (activity: string, timeInfo: string) => {
    if (!activity) return;
    const newPlan: JoyPlan = {
      id: Date.now(),
      activity,
      timeInfo
    };
    setJoyPlans(prev => ({
      ...prev,
      [joyTimeframe]: [...(prev[joyTimeframe] || []), newPlan]
    }));
    setJoyInput('');
    setJoyWhen('');
  };

  const removeJoyPlan = (id: number) => {
    setJoyPlans(prev => ({
      ...prev,
      [joyTimeframe]: (prev[joyTimeframe] || []).filter(p => p.id !== id)
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
      const canvas = await html2canvas(ref.current, {
        backgroundColor: '#f0fdfa',
        scale: 2,
        useCORS: true,
        windowWidth: 1000,
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${fileName}.png`;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  // --- Calendar Integration Helpers ---

  const generateGoogleCalendarLink = (plan: JoyPlan) => {
    const title = encodeURIComponent(`Joy Plan: ${plan.activity}`);
    const details = encodeURIComponent(`Shared plan between ${names.p1} and ${names.p2}. Timing: ${plan.timeInfo}`);
    const now = new Date();
    const start = now.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(now.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${start}/${end}`;
  };

  const downloadICS = (plan: JoyPlan) => {
    const title = plan.activity;
    const description = `Shared joy plan between ${names.p1} and ${names.p2}. Timing: ${plan.timeInfo}`;
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
    link.setAttribute('download', `${plan.activity.replace(/\s+/g, '-')}.ics`);
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
  };

  // --- Components ---

  const renderOnboarding = () => (
    <div className="max-w-md mx-auto px-4 py-20 flex flex-col min-h-screen">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="w-20 h-20 bg-pink-100 text-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-100">
          <Heart size={40} fill="currentColor" />
        </div>
        <h1 className="text-4xl serif italic text-teal-900 mb-4">Couple-Connect</h1>
        <p className="text-teal-600 font-medium">To personalize your journey, tell us your names.</p>
      </div>

      <form onSubmit={handleOnboardingSubmit} className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-teal-100 space-y-8 animate-in zoom-in-95 duration-500">
        <div className="space-y-6">
          <div className="relative">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 absolute -top-2 left-4 bg-white px-2">Partner 1</label>
            <input 
              required
              type="text"
              value={names.p1}
              onChange={(e) => setNames({...names, p1: e.target.value})}
              placeholder="Enter name"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-teal-900 focus:outline-none focus:border-pink-300 transition-all"
            />
          </div>
          <div className="flex justify-center text-pink-200">
            <Users size={24} />
          </div>
          <div className="relative">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 absolute -top-2 left-4 bg-white px-2">Partner 2</label>
            <input 
              required
              type="text"
              value={names.p2}
              onChange={(e) => setNames({...names, p2: e.target.value})}
              placeholder="Enter name"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-teal-900 focus:outline-none focus:border-pink-300 transition-all"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-5 bg-teal-900 text-white rounded-2xl font-black text-xl hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3"
        >
          Lets start the Check - in <ArrowRight size={24} />
        </button>
      </form>
    </div>
  );

  const renderHome = () => (
    <div className="max-w-xl mx-auto px-4 pt-12 pb-32">
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-teal-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <Heart fill="currentColor" size={28} />
          </div>
          <div>
            <h1 className="text-3xl serif italic text-teal-900 leading-tight">{names.p1} & {names.p2}</h1>
            <p className="text-teal-500 font-bold uppercase tracking-widest text-[10px]">Growing Together</p>
          </div>
        </div>
        <button 
          onClick={() => { localStorage.clear(); window.location.reload(); }} 
          className="p-3 text-slate-400 hover:text-red-500 transition-colors"
          title="Reset App"
        >
          <Trash2 size={20} />
        </button>
      </header>

      {homeTab === 'checkins' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
              <CheckCircle size={20} />
            </div>
            <h2 className="text-xl font-black text-teal-900 tracking-tight">Select a Heart Sync</h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {CHECKIN_MODELS.map(model => (
              <button 
                key={model.id}
                onClick={() => startCheckIn(model)}
                className="group relative bg-white p-8 rounded-[2.5rem] text-left border border-teal-100 shadow-xl shadow-teal-900/5 hover:scale-[1.02] active:scale-95 transition-all overflow-hidden"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${model.color}`}>
                    {model.acronym}
                  </div>
                  <div className="text-3xl">{model.emoji}</div>
                </div>
                <h3 className="text-2xl font-black text-teal-900 mb-2">{model.title}</h3>
                <p className="text-slate-500 font-medium mb-6 leading-relaxed">{model.description}</p>
                <div className="flex items-center gap-2 text-teal-900 font-black">
                  Start Session <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        renderJoyTab()
      )}
    </div>
  );

  const renderCheckIn = () => {
    if (!selectedModel) return null;
    const step = selectedModel.steps[currentStepIndex];
    const progress = (((currentStepIndex * 2) + (turn === 'p1' ? 1 : 2)) / (selectedModel.steps.length * 2)) * 100;
    const isLastTurn = currentStepIndex === selectedModel.steps.length - 1 && turn === 'p2';
    
    const currentName = turn === 'p1' ? names.p1 : names.p2;
    const currentQuestion = step.question.replace('[Name]', currentName);

    let cardClasses = turn === 'p1' ? 'bg-teal-900 border-teal-800' : 'bg-pink-600 border-pink-500';
    let iconBg = turn === 'p1' ? 'bg-teal-800/50' : 'bg-pink-700/50';

    return (
      <div className="max-w-xl mx-auto px-4 py-8 flex flex-col min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <button onClick={goHome} className="p-3 bg-white text-teal-500 rounded-2xl border border-teal-100 shadow-sm"><Home size={22} /></button>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-teal-900">{selectedModel.acronym} Phase</p>
            <p className="text-xs font-bold text-teal-500">Step {currentStepIndex + 1} of {selectedModel.steps.length}</p>
          </div>
          <div className="w-12" />
        </div>

        <div className="w-full h-2 bg-teal-100 rounded-full mb-10 overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-teal-500 to-pink-500 transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className={`rounded-[3.5rem] shadow-2xl p-10 text-center border-4 transition-all duration-500 overflow-hidden relative ${cardClasses}`}>
            <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-2xl font-black mb-6 text-white shadow-lg ${iconBg}`}>{step.letter}</div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-white/60">{step.word}</h2>
            <div className="mb-10">
              <div className="text-7xl mb-8 animate-pulse">{step.emoji}</div>
              <p className="text-3xl md:text-4xl serif italic text-white font-bold leading-tight">"{currentQuestion}"</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 mb-8 inline-flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${turn === 'p1' ? 'bg-teal-400 text-teal-900' : 'bg-pink-400 text-pink-900'}`}>{currentName.charAt(0)}</div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Listening to</p>
                <p className="text-xl font-black text-white">{currentName}</p>
              </div>
            </div>
            <div className="text-left mt-auto">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 block ml-2">{currentName}'s Reflection</label>
              <textarea
                value={dualNotes[currentStepIndex]?.[turn] || ''}
                onChange={(e) => {
                  const currentNotes = dualNotes[currentStepIndex] || { p1: '', p2: '' };
                  setDualNotes({ ...dualNotes, [currentStepIndex]: { ...currentNotes, [turn]: e.target.value } });
                }}
                placeholder={`Share something from your heart, ${currentName}...`}
                className="w-full bg-white/10 border-2 border-white/10 rounded-3xl p-6 text-white placeholder:text-white/20 focus:outline-none focus:bg-white/20 focus:border-white/30 transition-all resize-none h-40 font-medium"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <button onClick={handlePrevStep} className="flex-1 py-5 rounded-3xl font-black text-teal-700 bg-white border-2 border-teal-100 hover:bg-teal-50 transition-all">Back</button>
          <button onClick={handleNextStep} className={`flex-1 py-5 rounded-3xl font-black text-white shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 ${selectedModel.buttonColor}`}>
            {turn === 'p1' ? `Next: ${names.p2}` : isLastTurn ? 'Finish' : 'Next Step'}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    if (!selectedModel) return null;
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col min-h-screen pb-32">
        <div className="text-center mb-12 animate-in zoom-in-95 duration-1000">
          <div className="w-24 h-24 bg-teal-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-teal-100 rotate-6"><CheckCircle size={48} /></div>
          <h1 className="text-4xl serif italic text-teal-900 mb-2">United Heart Report</h1>
          <p className="text-teal-600 font-bold">A beautiful reflection of {names.p1} & {names.p2}</p>
        </div>

        {insight && (
          <div className="mb-10 bg-gradient-to-br from-pink-50 to-teal-50 p-10 rounded-[3rem] border-4 border-white shadow-2xl animate-in fade-in duration-1000">
            <div className="flex items-center gap-3 mb-6">
              <Star className="text-yellow-500" fill="currentColor" size={24} />
              <h3 className="font-black text-teal-900 uppercase tracking-tighter text-2xl">AI Wisdom For Us</h3>
            </div>
            <div className="space-y-8">
              <div><label className="text-[10px] font-black uppercase text-teal-500 tracking-widest block mb-1">Our Current Mood</label><p className="text-2xl font-black text-teal-900 tracking-tight">{insight.mood}</p></div>
              <div><label className="text-[10px] font-black uppercase text-pink-500 tracking-widest block mb-1">A Word for Us</label><p className="text-slate-700 italic font-medium leading-relaxed text-lg">"{insight.encouragement}"</p></div>
              <div className="p-6 bg-white/70 rounded-[2rem] border border-teal-100"><label className="text-[10px] font-black uppercase text-teal-900 tracking-widest block mb-2">Shared Focus Area</label><p className="text-teal-900 font-black text-xl">{insight.suggestedFocus}</p></div>
            </div>
          </div>
        )}

        {loadingInsight && (
          <div className="mb-10 bg-white p-12 rounded-[3rem] text-center border-4 border-teal-50">
            <RefreshCw className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-6" />
            <p className="text-teal-600 font-black text-xl">The AI Coach is reflecting on your hearts...</p>
          </div>
        )}

        <div className="bg-white rounded-[3.5rem] shadow-2xl border border-teal-100 overflow-hidden mb-12">
          <div className="p-10 bg-teal-50/50 border-b border-teal-100 flex items-center justify-between">
            <h3 className="text-2xl font-black text-teal-900 tracking-tight">Sharing Log: {selectedModel.acronym}</h3>
            <div className="flex gap-2">
               <button onClick={copySummary} className="p-3 bg-white text-teal-600 rounded-2xl shadow-sm border border-teal-100 hover:text-teal-900 transition-all">{copied ? <CheckCircle size={20} /> : <Copy size={20} />}</button>
              <button onClick={() => exportRefToImage(checkinExportRef, `CheckIn-${selectedModel.acronym}`)} className="p-3 bg-teal-600 text-white rounded-2xl shadow-lg border border-teal-700 hover:brightness-110 transition-all"><Download size={20} /></button>
            </div>
          </div>
          <div className="divide-y divide-teal-50">
            {selectedModel.steps.map((step, idx) => (
              <div key={idx} className="p-10 space-y-6">
                <div className="flex items-center gap-4">
                  <span className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white shadow-md ${selectedModel.buttonColor.split(' ')[0]}`}>{step.letter}</span>
                  <span className="text-2xl font-black text-teal-900 uppercase tracking-tighter">{step.word}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-teal-50/30 rounded-3xl border border-teal-50"><p className="text-[10px] font-black uppercase text-teal-400 tracking-[0.2em] mb-3">{names.p1}</p><p className="text-teal-900 font-bold leading-relaxed">{dualNotes[idx]?.p1 || 'No reflection captured.'}</p></div>
                  <div className="p-6 bg-pink-50/30 rounded-3xl border border-pink-50"><p className="text-[10px] font-black uppercase text-pink-400 tracking-[0.2em] mb-3">{names.p2}</p><p className="text-teal-900 font-bold leading-relaxed">{dualNotes[idx]?.p2 || 'No reflection captured.'}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={goHome} className="w-full py-6 rounded-[2.5rem] bg-teal-900 text-white font-black text-2xl hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-4">Finish & Return <ArrowRight size={28} /></button>
      </div>
    );
  };

  const renderJoyTab = () => (
     !isCodeVerified ? renderCodeGate() : renderJoyPlanner()
  );

  const renderCodeGate = () => (
    <div className="max-w-md mx-auto px-4 py-16 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-8 text-teal-600 shadow-lg"><Key size={40} /></div>
      <h1 className="text-3xl serif italic text-teal-900 mb-4">Secure Joy Plan</h1>
      <p className="text-teal-600 font-medium mb-10 leading-relaxed">Enter your shared JOY CODE to retrieve your plan.</p>
      <div className="space-y-6">
        <input type="text" value={codeEntryInput} onChange={(e) => setCodeEntryInput(e.target.value.toUpperCase())} placeholder="Enter Code" className="w-full bg-white border-2 border-teal-100 rounded-2xl px-6 py-4 text-center font-black text-2xl tracking-[0.3em] text-teal-900 focus:outline-none focus:border-teal-500 transition-all"/>
        <button onClick={handleVerifyCode} disabled={codeEntryInput.length < 4} className="w-full py-4 bg-teal-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl disabled:opacity-50">Retrieve My Plan</button>
        <div className="flex items-center gap-4 my-8"><div className="h-px bg-teal-100 flex-1"></div><span className="text-[10px] font-black uppercase tracking-widest text-teal-300">OR</span><div className="h-px bg-teal-100 flex-1"></div></div>
        <button onClick={handleGenerateCode} className="w-full py-4 bg-white text-teal-900 border-2 border-teal-100 rounded-2xl font-black text-lg hover:bg-teal-50 transition-all flex items-center justify-center gap-3"><RefreshCw size={20} /> Generate New Code</button>
      </div>
    </div>
  );

  const renderJoyPlanner = () => {
    const getDynamicWhenPlaceholder = () => {
      switch(joyTimeframe) {
        case 'Daily': return 'e.g. 7:00 AM or Morning Chai';
        case 'Weekly': return 'e.g. Saturday, 5:00 PM';
        case 'Monthly': return 'e.g. 15th, Afternoon';
        case 'Annually': return 'e.g. Oct 24th or Anniversary';
        case '5 Years': return 'e.g. 2028 or Long-term';
        default: return 'e.g. Saturday Morning';
      }
    };

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-8 px-2 bg-teal-100/50 p-4 rounded-3xl border border-teal-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-900 shadow-sm"><Key size={18} /></div>
            <div>
              <p className="text-[10px] font-black uppercase text-teal-500 tracking-widest">Active Joy Code</p>
              <p className="text-lg font-black text-teal-900 tracking-[0.1em]">{joyCode}</p>
            </div>
          </div>
          <button onClick={handleLogoutCode} className="p-2 text-teal-400 hover:text-red-500 transition-colors"><LogOut size={20} /></button>
        </div>

        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex overflow-x-auto gap-3 no-scrollbar pb-1">
            {['Daily', 'Weekly', 'Monthly', 'Annually', '5 Years'].map(tf => (
              <button key={tf} onClick={() => { setJoyTimeframe(tf); setAiDateSuggestions([]); }} className={`px-6 py-2.5 rounded-2xl whitespace-nowrap text-sm font-bold transition-all border shadow-sm ${joyTimeframe === tf ? 'bg-pink-600 text-white border-pink-500' : 'bg-white text-slate-500 border-teal-100 hover:bg-teal-50'}`}>{tf}</button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-teal-100/50 border border-teal-100/60 p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600"><Sparkles size={24} /></div>
              <div><h2 className="text-2xl font-extrabold text-teal-900 tracking-tight">Plan {joyTimeframe} Joy</h2><p className="text-sm text-slate-500">Detailed planning leads to joyful living.</p></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => exportRefToImage(exportRef, `JoyPlan-${joyCode}`)} disabled={isExporting} className="p-3 bg-slate-50 text-slate-700 rounded-2xl hover:bg-slate-100 transition-all border border-slate-200"><Download size={20} /></button>
              <button onClick={fetchAIDateIdeas} disabled={loadingDates} className="p-3 bg-teal-50 text-teal-700 rounded-2xl hover:bg-teal-100 transition-all disabled:opacity-50">{loadingDates ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap size={20} fill="currentColor" />}</button>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative"><input type="text" value={joyInput} onChange={(e) => setJoyInput(e.target.value)} placeholder="What activity?" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 pl-12 text-slate-700 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all font-medium" /><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /></div>
              <div className="relative"><input type="text" value={joyWhen} onChange={(e) => setJoyWhen(e.target.value)} placeholder={getDynamicWhenPlaceholder()} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 pl-12 text-slate-700 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all font-medium" /><Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /></div>
            </div>
            <button onClick={() => addJoyPlan(joyInput, joyWhen)} disabled={!joyInput} className="w-full py-4 rounded-2xl font-extrabold text-white bg-teal-800 hover:bg-teal-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2 text-lg"><Plus size={22} /> Add to Active Plan</button>
          </div>

          {aiDateSuggestions.length > 0 && (
            <div className="mb-8 p-6 bg-pink-50/50 rounded-[2rem] border border-pink-100 animate-in fade-in zoom-in-95">
              <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Zap size={14} fill="currentColor" /> AI Curated Ideas</p>
              <div className="grid grid-cols-1 gap-4">
                {aiDateSuggestions.map((idea, idx) => (
                  <button key={idx} onClick={() => { setJoyInput(idea.title); setJoyWhen('Special Date'); }} className="bg-white p-5 rounded-2xl text-left border border-pink-100 hover:shadow-md transition-all group">
                    <p className="font-bold text-teal-900 mb-1 group-hover:text-pink-600">{idea.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed mb-2">{idea.description}</p>
                    <p className="text-[10px] font-medium text-pink-400 italic">{idea.whyItWorks}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Suggestions</p>
            <div className="flex flex-wrap gap-2.5">{JOY_SUGGESTIONS[joyTimeframe]?.map((sugg, idx) => (
              <button key={idx} onClick={() => setJoyInput(sugg)} className="px-4 py-2 bg-pink-50 text-pink-700 text-sm font-bold rounded-xl hover:bg-pink-100 transition-colors border border-pink-100 shadow-sm">{sugg}</button>
            ))}</div>
          </div>
        </div>

        <div className="space-y-4">
          {joyPlans[joyTimeframe].map(plan => (
            <div key={plan.id} className="bg-white p-5 rounded-3xl shadow-sm border border-teal-100 flex flex-col group hover:shadow-md transition-all">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600"><CheckCircle size={20} /></div>
                  <div><p className="font-bold text-teal-900 text-lg">{plan.activity}</p>{plan.timeInfo && <p className="text-sm text-pink-500 font-bold flex items-center gap-1.5 mt-0.5"><Calendar size={14} /> {plan.timeInfo}</p>}</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="relative">
                    <button 
                      onClick={() => setActiveCalendarMenu(activeCalendarMenu === plan.id ? null : plan.id)}
                      className="text-teal-400 hover:text-teal-600 transition-all p-3 hover:bg-teal-50 rounded-2xl"
                      title="Add to Calendar"
                    >
                      <CalendarPlus size={20} />
                    </button>
                    {activeCalendarMenu === plan.id && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-teal-100 rounded-2xl shadow-2xl z-[60] p-2 animate-in fade-in zoom-in-95">
                        <a 
                          href={generateGoogleCalendarLink(plan)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 w-full p-3 text-sm font-bold text-teal-900 hover:bg-teal-50 rounded-xl transition-all"
                          onClick={() => setActiveCalendarMenu(null)}
                        >
                          <ExternalLink size={14} /> Google Calendar
                        </a>
                        <button 
                          onClick={() => { downloadICS(plan); setActiveCalendarMenu(null); }}
                          className="flex items-center gap-2 w-full p-3 text-sm font-bold text-teal-900 hover:bg-teal-50 rounded-xl transition-all text-left"
                        >
                          <Download size={14} /> Download iCal (.ics)
                        </button>
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
    </div>
  );
}
