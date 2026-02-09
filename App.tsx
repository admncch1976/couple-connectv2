import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Layers,
  MessageSquarePlus,
  ChevronLeft,
  X,
  RefreshCcw,
  Smile,
  Music,
  Utensils,
  Laugh,
  Coffee,
  Handshake,
  Dna,
  HeartHandshake,
  Wind,
  Mic2,
  Brush,
  Moon,
  Trophy,
  ChevronRightCircle,
  Link2,
  MessageCircle,
  Shapes,
  Eye,
  EyeOff,
  User,
  Settings,
  PartyPopper,
  Gamepad2,
  Dices,
  Lightbulb,
  ArrowUp
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { View, HomeTab, CheckInModel, JoyPlan, Turn, AIInsight, DateIdea, PartnerNames, DualReflection } from './types';
import { CHECKIN_MODELS, JOY_SUGGESTIONS, FEELINGS_DATA, LOVE_LANGUAGES, FUN_DECK, EXTENDED_BIBLE_JOKES, QUIZ_QUESTIONS } from './constants';
import { geminiService } from './geminiService';

const APP_VERSION = "v2.22";

const MARRIAGE_QUOTES = [
  "Communication is the fuel that keeps the fire of your relationship burning.",
  "The goal in marriage is not to think alike, but to think together.",
  "A good marriage is the union of two good forgivers.",
  "In the middle of every difficulty lies opportunity for deeper connection.",
  "Your words are the bricks that build the home your heart lives in.",
  "Marriage is less about finding the right person and more about being the right person."
];

const PRACTICAL_TASKS = [
  { id: 'smile', icon: <Smile className="text-rose-600" />, text: "Look into each other's eyes, smile, and say 'I love you'." },
  { id: 'dish', icon: <Utensils className="text-orange-600" />, text: "Commit to making a favorite dish for each other this week." },
  { id: 'song', icon: <Music className="text-purple-600" />, text: "Pick a song that represents 'us' and sing it together right now." },
  { id: 'hug', icon: <HeartHandshake className="text-rose-600" />, text: "Give each other a lingering 30-second hug without saying a word." },
  { id: 'handshake', icon: <Handshake className="text-blue-600" />, text: "Create a secret 3-step handshake that only the two of you know." },
  { id: 'breaths', icon: <Wind className="text-cyan-600" />, text: "Take 5 deep synchronised breaths together to align your nervous systems." }
];

export default function App() {
  const [currentView, setCurrentView] = useState<View | 'walkthrough'>(() => {
    const savedNames = localStorage.getItem('partnerNames');
    return savedNames ? 'home' : 'onboarding';
  });
  const [homeTab, setHomeTab] = useState<HomeTab>('checkins');
  const [isFirstTime, setIsFirstTime] = useState(() => !localStorage.getItem('hasSeenWalkthrough'));
  const [showFTXOverlay, setShowFTXOverlay] = useState(false);
  
  const exportRef = useRef<HTMLDivElement>(null);
  const checkinExportRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [names, setNames] = useState<PartnerNames>(() => {
    const saved = localStorage.getItem('partnerNames');
    return saved ? JSON.parse(saved) : { p1: '', p2: '' };
  });

  const [joyCode, setJoyCode] = useState<string>(() => localStorage.getItem('activeJoyCode') || '');
  const [showSyncPanel, setShowSyncPanel] = useState(false);
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

  const [logoClicked, setLogoClicked] = useState(false);

  // Fun Zone State
  const [funSubView, setFunSubView] = useState<'menu' | 'deck' | 'jokes' | 'quiz'>('menu');
  const [funMode, setFunMode] = useState<'light' | 'deep'>('light');
  const [deckIdx, setDeckIdx] = useState(0);
  const [questionsAnsweredInSession, setQuestionsAnsweredInSession] = useState(0);
  const [showFunPrompt, setShowFunPrompt] = useState(false);
  const [funScore, setFunScore] = useState(0);
  const [jokeIdx, setJokeIdx] = useState(0);
  const [showJokeAnswer, setShowJokeAnswer] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizRevealed, setQuizRevealed] = useState(false);

  // Feelings Wheel State
  const [wheelPath, setWheelPath] = useState<string[]>([]);
  const [isZooming, setIsZooming] = useState(false);
  const [hasPickedEmotion, setHasPickedEmotion] = useState(false);

  // Love Language State
  const [pickedLoveLanguages, setPickedLoveLanguages] = useState<Record<'p1' | 'p2', string>>({ p1: '', p2: '' });

  // Practical Task State
  const [currentTaskIndex, setCurrentTaskIndex] = useState(() => Math.floor(Math.random() * PRACTICAL_TASKS.length));
  const [isShufflingTask, setIsShufflingTask] = useState(false);
  const [showPracticalInLove, setShowPracticalInLove] = useState(false);

  const currentQuote = useMemo(() => {
    return MARRIAGE_QUOTES[Math.floor(Math.random() * MARRIAGE_QUOTES.length)];
  }, []);

  const filteredDeck = useMemo(() => {
    return FUN_DECK.filter(q => q.mode === funMode);
  }, [funMode]);

  const shuffledPrompts = useMemo(() => {
    if (!selectedModel) return [];
    const step = selectedModel.steps[currentStepIndex];
    const source = (step.quickThoughts && step.quickThoughts.length > 0) 
      ? step.quickThoughts 
      : ["Feeling peaceful", "Ready to listen"];
    return [...source].sort(() => Math.random() - 0.5);
  }, [selectedModel, currentStepIndex, turn]);

  useEffect(() => {
    const key = joyCode ? `joyPlans_${joyCode}` : 'joyPlans_local';
    const saved = localStorage.getItem(key);
    if (saved) setJoyPlans(JSON.parse(saved));
    else setJoyPlans({ 'Daily': [], 'Weekly': [], 'Monthly': [], 'Annually': [], '5 Years': [] });
  }, [joyCode]);

  useEffect(() => {
    const key = joyCode ? `joyPlans_${joyCode}` : 'joyPlans_local';
    localStorage.setItem(key, JSON.stringify(joyPlans));
  }, [joyPlans, joyCode]);

  useEffect(() => {
    localStorage.setItem('partnerNames', JSON.stringify(names));
  }, [names]);

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (names.p1 && names.p2) {
      setCurrentView('home');
      if (isFirstTime) {
        setShowFTXOverlay(true);
      }
    }
  };

  const startCheckIn = (model: CheckInModel) => {
    setSelectedModel(model);
    setCurrentStepIndex(0);
    setDualNotes({});
    setTurn('p1');
    setInsight(null);
    setWheelPath([]);
    setPickedLoveLanguages({ p1: '', p2: '' });
    setHasPickedEmotion(false);
    setShowPracticalInLove(false);
    setCurrentView('checkin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep = async () => {
    if (!selectedModel) return;
    setWheelPath([]);
    setHasPickedEmotion(false);
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
            flatNotes[Number(idx)] = `${names.p1}: ${note.p1}. ${names.p2}: ${note.p2}.`;
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
    setWheelPath([]);
    setHasPickedEmotion(false);
    if (turn === 'p2') setTurn('p1');
    else {
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
    const newPlan: JoyPlan = { id: Date.now(), activity, timeInfo };
    setJoyPlans(prev => ({ ...prev, [joyTimeframe]: [...(prev[joyTimeframe] || []), newPlan] }));
    setJoyInput(''); setJoyWhen('');
  };

  const removeJoyPlan = (id: number, timeframeOverride?: string) => {
    const tf = timeframeOverride || joyTimeframe;
    setJoyPlans(prev => ({ ...prev, [tf]: (prev[tf] || []).filter(p => p.id !== id) }));
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
      const canvas = await html2canvas(ref.current, { backgroundColor: '#f0fdfa', scale: 2, useCORS: true, logging: false, windowWidth: 1000 });
      const link = document.createElement('a'); link.href = canvas.toDataURL('image/png', 1.0); link.download = `${fileName}.png`; link.click();
    } catch (err) { console.error(err); } 
    finally { setIsExporting(false); }
  };

  const goHome = () => { setCurrentView('home'); setSelectedModel(null); setCurrentStepIndex(0); setDualNotes({}); setTurn('p1'); setInsight(null); };

  const handleQuickPromptClick = (text: string) => {
    const currentNotes = dualNotes[currentStepIndex] || { p1: '', p2: '' };
    const updated = currentNotes[turn] ? `${currentNotes[turn]} ${text}` : text;
    setDualNotes({ ...dualNotes, [currentStepIndex]: { ...currentNotes, [turn]: updated } });
    textareaRef.current?.focus();
  };

  const handleGenerateCode = () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setJoyCode(newCode); localStorage.setItem('activeJoyCode', newCode); setShowSyncPanel(false);
  };

  const handleVerifyCode = () => {
    const code = codeEntryInput.trim().toUpperCase();
    if (code.length >= 4) { setJoyCode(code); localStorage.setItem('activeJoyCode', code); setShowSyncPanel(false); }
  };

  const handleLogoutCode = () => { localStorage.removeItem('activeJoyCode'); setJoyCode(''); setCodeEntryInput(''); setShowSyncPanel(false); };

  const nextFunQuestion = () => {
    setDeckIdx((prev) => (prev + 1) % filteredDeck.length);
    setQuestionsAnsweredInSession(prev => prev + 1);
    if ((questionsAnsweredInSession + 1) % 2 === 0) setShowFunPrompt(true);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLogoClicked(!logoClicked);
  };

  const shuffleTask = () => {
    setIsShufflingTask(true);
    setTimeout(() => {
      setCurrentTaskIndex(Math.floor(Math.random() * PRACTICAL_TASKS.length));
      setIsShufflingTask(false);
    }, 400);
  };

  const closeFTX = () => {
    setShowFTXOverlay(false);
    setIsFirstTime(false);
    localStorage.setItem('hasSeenWalkthrough', 'true');
  };

  const renderOnboarding = () => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
      <div className="w-20 h-20 bg-rose-900 rounded-[2.5rem] flex items-center justify-center text-white mb-8 shadow-2xl animate-float">
        <Heart fill="currentColor" size={36} />
      </div>
      <h1 className="text-4xl font-black text-slate-950 mb-2 italic serif">Couple Connect</h1>
      <p className="text-slate-600 mb-10 max-w-xs leading-relaxed font-bold">Your intentional journey starts with your names.</p>
      
      <form onSubmit={handleOnboardingSubmit} className="w-full max-w-sm space-y-5">
        <div className="space-y-2 text-left">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950 ml-1">Partner 1</label>
          <input 
            type="text" 
            required 
            placeholder="Name" 
            className="w-full px-6 py-5 bg-teal-50 border-2 border-transparent focus:border-teal-300 rounded-[1.5rem] font-black text-slate-950 outline-none transition-all placeholder:text-teal-400 shadow-sm"
            value={names.p1}
            onChange={(e) => setNames({ ...names, p1: e.target.value })}
          />
        </div>
        <div className="flex justify-center py-2 opacity-20"><Users size={20} className="text-slate-950" /></div>
        <div className="space-y-2 text-left">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950 ml-1">Partner 2</label>
          <input 
            type="text" 
            required 
            placeholder="Name" 
            className="w-full px-6 py-5 bg-rose-50 border-2 border-transparent focus:border-rose-300 rounded-[1.5rem] font-black text-slate-950 outline-none transition-all placeholder:text-rose-400 shadow-sm"
            value={names.p2}
            onChange={(e) => setNames({ ...names, p2: e.target.value })}
          />
        </div>
        <button type="submit" className="w-full py-6 bg-slate-950 text-white rounded-[1.8rem] font-black text-xl shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-95 group">
          Enter Now <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </form>
    </div>
  );

  const renderWalkthrough = () => {
    const slides = [
      { icon: <Heart size={40} />, title: "Heart Sync", desc: "Start here to connect deeply. Use the C.A.R.E, L.O.V.E, or P.E.A.C.E frameworks to check-in on your hearts.", color: "bg-rose-900" },
      { icon: <PartyPopper size={40} />, title: "Fun Zone", desc: "Build friendship and play with fun questions deck, Bible jokes, and 'How much do you know me?' quizzes.", color: "bg-orange-600" },
      { icon: <Sparkles size={40} />, title: "Joy Planner", desc: "Map out your shared life rhythm, from daily morning devos to 5-year kingdom goals.", color: "bg-teal-600" }
    ];
    return (
      <div className="min-h-screen bg-white flex flex-col p-6 animate-in slide-in-from-right duration-500">
        <div className="p-4 flex items-center justify-between mb-8 text-slate-950">
           <button onClick={() => setCurrentView('home')} className="text-slate-950 font-black uppercase tracking-widest text-[10px] hover:opacity-70">Skip</button>
           <h2 className="text-lg font-black italic serif">How to use Couple Connect</h2>
           <div className="w-10" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12">
           {slides.map((s, i) => (
             <div key={i} className="animate-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${i * 150}ms` }}>
                <div className={`w-16 h-16 ${s.color} rounded-3xl mx-auto flex items-center justify-center text-white mb-4 shadow-xl`}>{s.icon}</div>
                <h3 className="text-xl font-black text-slate-950 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-950 max-w-[280px] leading-relaxed font-bold">{s.desc}</p>
             </div>
           ))}
        </div>
        <button onClick={() => { setCurrentView('home'); localStorage.setItem('hasSeenWalkthrough', 'true'); setIsFirstTime(false); }} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-lg shadow-xl mt-10 active:scale-95 transition-all">Let's Get Syncing</button>
      </div>
    );
  };

  const renderFeelingOptions = () => {
    if (wheelPath.length === 0) return null;
    const category = wheelPath[0] as keyof typeof FEELINGS_DATA;
    const data = FEELINGS_DATA[category];

    if (wheelPath.length === 1) {
      return Object.keys(data.secondary).map(sec => (
        <button key={sec} onClick={() => setWheelPath([...wheelPath, sec])} className="bg-white border-2 border-slate-200 p-3 rounded-xl text-slate-950 font-black text-[10px] shadow-sm active:scale-95 transition-all">{sec}</button>
      ));
    }

    if (wheelPath.length === 2) {
      const secondary = wheelPath[1];
      const items = (data.secondary as any)[secondary];
      return items.map((ter: string) => (
        <button key={ter} onClick={() => { handleQuickPromptClick(`${wheelPath[0]} (${secondary} - ${ter})`); setWheelPath([]); setHasPickedEmotion(true); }} className="bg-white border-2 border-rose-200 p-3 rounded-xl text-rose-950 font-black text-[10px] shadow-sm active:scale-95 transition-all text-center">{ter}</button>
      ));
    }
    return null;
  };

  const renderCheckIn = () => {
    if (!selectedModel) return null;
    const step = selectedModel.steps[currentStepIndex];
    const speakerName = turn === 'p1' ? names.p1 : names.p2;
    const listenerName = turn === 'p1' ? names.p2 : names.p1;
    const notes = dualNotes[currentStepIndex] || { p1: '', p2: '' };
    const question = step.question.replace('[Speaker]', speakerName).replace('[Partner]', listenerName);

    // Dark background for better visibility
    const pageBg = turn === 'p1' ? 'bg-teal-600' : 'bg-rose-700'; // Partner 1 Teal, Partner 2 Dark Rose
    const cardBg = 'bg-white';
    const textAccent = turn === 'p1' ? 'text-teal-900' : 'text-rose-950';

    return (
      <div className={`min-h-screen ${pageBg} flex flex-col transition-colors duration-700`}>
        <div className={`p-4 flex items-center justify-between sticky top-0 z-40`}>
           <button onClick={handlePrevStep} className="p-2 text-white hover:opacity-70"><ChevronLeft size={24} /></button>
           <div className="flex flex-col items-center">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/20 text-white mb-0.5`}>{selectedModel.acronym}</span>
              <div className="flex gap-1.5 mt-1">
                 {selectedModel.steps.map((_, i) => (
                    <div key={i} className={`w-6 h-1 rounded-full transition-all ${i < currentStepIndex ? 'bg-white' : i === currentStepIndex ? 'bg-white/90' : 'bg-white/20'}`} />
                 ))}
              </div>
           </div>
           <div className="w-10" />
        </div>
        
        <div className="flex-1 max-w-xl mx-auto w-full px-4 py-6">
           <div className="text-center mb-6">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-2xl border-4 border-white/20">{step.emoji}</div>
              <h2 className="text-[11px] font-black text-white/80 uppercase tracking-[0.3em] mb-4">Step {currentStepIndex + 1}: {step.word}</h2>
              
              <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden border-4 border-white/10 mb-6">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Heart size={80} /></div>
                <div className={`mb-4 px-4 py-1.5 inline-block rounded-full bg-slate-100 ${textAccent} text-[10px] font-black uppercase tracking-widest`}>
                   It's {speakerName}'s Turn
                </div>
                {/* Question in Simple Bold Font as requested */}
                <h3 className="text-2xl font-black text-slate-950 leading-tight italic serif relative z-10">"{question}"</h3>
              </div>
           </div>

           <div className="space-y-6">
              {/* Feelings Wheel */}
              {(step.word === 'Connect' || step.word === 'Emotional State' || step.word === 'Observe') && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3 px-1 text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><Layers size={12} /> Feelings Navigator</p>
                    {wheelPath.length > 0 && <button onClick={() => { setWheelPath([]); setHasPickedEmotion(false); }} className="text-[10px] font-black uppercase border-b border-white">Reset</button>}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {wheelPath.length === 0 ? Object.entries(FEELINGS_DATA).map(([label, data]) => (
                      <button key={label} onClick={() => setWheelPath([label])} className={`${data.color} p-4 rounded-2xl text-slate-950 font-black text-xs shadow-xl active:scale-95 transition-all text-center border-2 border-white/20`}>{label}</button>
                    )) : (
                      <div className="col-span-2 space-y-2">
                        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">{wheelPath.map((p, i) => (
                          <div key={i} className="px-3 py-1 bg-white/20 border border-white/20 rounded-lg text-[10px] font-black text-white flex items-center gap-1 shrink-0">{p} {i < wheelPath.length - 1 && <ChevronRight size={12} />}</div>
                        ))}</div>
                        <div className="grid grid-cols-2 gap-2">{renderFeelingOptions()}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Text Box Below the Question */}
              <div className="relative group">
                <textarea 
                  ref={textareaRef} 
                  value={notes[turn]} 
                  onChange={(e) => setDualNotes({ ...dualNotes, [currentStepIndex]: { ...notes, [turn]: e.target.value } })} 
                  placeholder={`Write truthfully here, ${speakerName}...`} 
                  className="w-full bg-white border-4 border-white focus:border-slate-300 rounded-[2rem] p-8 min-h-[220px] text-slate-950 placeholder:text-slate-300 font-bold text-lg resize-none outline-none transition-all shadow-2xl" 
                />
                <div className="absolute right-6 bottom-6">
                   <div className={`px-4 py-1 bg-slate-100 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest`}>Syncing...</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                 <p className="w-full text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1 ml-2">Quick Thoughts</p>
                 {shuffledPrompts.map((p, i) => (
                    <button key={i} onClick={() => handleQuickPromptClick(p)} className="px-5 py-2.5 bg-white/10 border border-white/30 rounded-full text-[11px] font-black text-white hover:bg-white hover:text-slate-950 transition-all shadow-sm active:scale-95">{p}</button>
                 ))}
                 <button onClick={() => { setDualNotes({...dualNotes, [currentStepIndex]: {...notes, [turn]: "Feeling peaceful and connected."}}); }} className="px-6 py-2.5 bg-white text-slate-950 rounded-full text-[11px] font-black hover:scale-105 transition-all shadow-2xl">"Clear Heart" ✨</button>
              </div>
           </div>
        </div>
        
        <div className={`p-6 sticky bottom-0 z-40`}>
           <button onClick={handleNextStep} disabled={!notes[turn]} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30">
              {turn === 'p1' ? `Confirm & Next Turn` : (currentStepIndex < selectedModel.steps.length - 1 ? 'Next Step' : 'Finish Sync')}
              <ArrowRight size={24} />
           </button>
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    return (
      <div className="min-h-screen bg-teal-50 pb-24 overflow-y-auto no-scrollbar animate-in fade-in duration-1000">
        <div className="max-w-xl mx-auto px-6 py-10">
          <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border-8 border-white mb-10">
            <div ref={checkinExportRef} className="p-10 bg-white">
              <div className="flex flex-col items-center text-center mb-12">
                <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center text-rose-600 mb-6 shadow-xl border-2 border-rose-100">
                  <Heart fill="currentColor" size={48} />
                </div>
                <h2 className="text-4xl font-black text-slate-950 italic serif">{names.p1} & {names.p2}</h2>
                <div className="flex flex-col items-center gap-2 mt-4">
                   <div className="px-4 py-1.5 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-widest">{selectedModel?.acronym} Heart Sync Complete</div>
                   <div className="text-[11px] font-black text-slate-950 uppercase tracking-widest mt-1">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                </div>
              </div>

              {loadingInsight ? (
                <div className="p-16 text-center space-y-6 animate-pulse">
                  <div className="w-16 h-16 bg-rose-100 rounded-full mx-auto animate-spin flex items-center justify-center text-rose-900 border-4 border-white"><RefreshCw size={32} /></div>
                  <p className="text-base font-black text-slate-950 uppercase tracking-widest">Generating AI Wisdom...</p>
                </div>
              ) : insight ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-1000">
                  <div className="bg-teal-50 rounded-[2.5rem] p-8 border-2 border-teal-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm border border-teal-100"><Smile size={32} /></div>
                       <h3 className="text-xs font-black text-slate-950 uppercase tracking-widest">Shared Vibe</h3>
                    </div>
                    <p className="text-2xl font-black text-teal-900 italic leading-snug">"{insight.mood}"</p>
                  </div>

                  <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                    <Sparkles className="absolute -right-6 -top-6 opacity-10 w-32 h-32" />
                    <div className="flex items-center gap-4 mb-6">
                       <h3 className="text-xs font-black text-rose-300 uppercase tracking-widest">Relationship Wisdom</h3>
                    </div>
                    <p className="text-2xl font-bold italic leading-relaxed text-white/90">"{insight.encouragement}"</p>
                  </div>

                  <div className="bg-white border-4 border-dashed border-rose-100 rounded-[2.5rem] p-8">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm"><Zap size={28} fill="currentColor" /></div>
                       <h3 className="text-xs font-black text-slate-950 uppercase tracking-widest">Growth Point</h3>
                    </div>
                    <p className="text-lg font-black text-slate-950 leading-relaxed">{insight.suggestedFocus}</p>
                  </div>

                  <div className="bg-orange-50 rounded-[2.5rem] p-8 border-2 border-orange-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm border border-orange-100">{PRACTICAL_TASKS[currentTaskIndex].icon}</div>
                        <h3 className="text-xs font-black text-slate-950 uppercase tracking-widest">Sync Challenge</h3>
                      </div>
                      <button onClick={shuffleTask} className={`p-2 text-orange-400 hover:text-orange-600 transition-all ${isShufflingTask ? 'animate-spin' : ''}`}><RefreshCcw size={20} /></button>
                    </div>
                    <p className="text-xl font-black text-orange-950 italic leading-relaxed">"{PRACTICAL_TASKS[currentTaskIndex].text}"</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <button onClick={() => exportRefToImage(checkinExportRef, 'heartsync-summary')} className="flex-1 py-6 bg-white border-4 border-teal-200 text-slate-950 rounded-[2.2rem] font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-teal-50 transition-all active:scale-95">
                <Download size={24} /> Report
             </button>
             <button onClick={goHome} className="flex-1 py-6 bg-slate-950 text-white rounded-[2.2rem] font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-95">
                Dashboard <Home size={20} />
             </button>
          </div>
        </div>
      </div>
    );
  };

  const renderOverallJoySummary = () => (
    <div className="space-y-8 animate-in fade-in duration-1000">
       <div className="flex items-center justify-between mb-2">
         <h2 className="text-2xl font-black text-slate-950 serif italic">Legacy Journey</h2>
         <button onClick={() => exportRefToImage(exportRef, 'joy-roadmap')} disabled={isExporting} className="p-3 bg-white text-teal-900 border-2 border-teal-100 rounded-2xl shadow-xl hover:bg-teal-50 transition-all">
           {isExporting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download size={20} />}
         </button>
       </div>
       <div ref={exportRef} className="bg-white p-10 rounded-[3rem] border-8 border-white shadow-2xl">
         {['Daily', 'Weekly', 'Monthly', 'Annually', '5 Years'].map(tf => (
           <div key={tf} className="mb-10 last:mb-0 relative pl-8 border-l-4 border-teal-50">
             <div className="absolute -left-[14px] top-0 w-6 h-6 bg-teal-600 rounded-full border-4 border-white shadow-md flex items-center justify-center text-[10px] font-black text-white">{tf[0]}</div>
             <div className="flex items-center gap-3 mb-5">
               <h3 className="text-sm font-black text-slate-950 uppercase tracking-widest">{tf} shared rhythm</h3>
             </div>
             <div className="grid grid-cols-1 gap-3">
               {joyPlans[tf].length > 0 ? (
                 joyPlans[tf].map(p => (
                   <div key={p.id} className="bg-teal-50/50 p-5 rounded-2xl border-2 border-teal-50 flex items-center justify-between group hover:bg-teal-50 transition-colors">
                     <div>
                       <p className="text-base font-black text-slate-950">{p.activity}</p>
                       <p className="text-[11px] text-teal-700 font-black uppercase mt-1 tracking-wider">{p.timeInfo}</p>
                     </div>
                     <Sparkles size={16} className="text-teal-400 group-hover:scale-125 transition-transform" />
                   </div>
                 ))
               ) : (
                 <p className="text-xs text-slate-400 italic font-bold ml-1">No shared plans recorded...</p>
               )}
             </div>
           </div>
         ))}
       </div>
    </div>
  );

  const renderFTXOverlay = () => (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl p-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
      <div className="w-24 h-24 bg-white text-slate-900 rounded-[2.8rem] flex items-center justify-center mb-10 shadow-2xl border-4 border-white/20">
        <PartyPopper size={48} />
      </div>
      <h2 className="text-4xl font-black text-white italic serif mb-4">You're All Set!</h2>
      <p className="text-white/60 mb-12 max-w-xs text-base font-medium leading-relaxed">Your relationship dashboard is ready. Use the bottom tabs to grow together:</p>
      
      <div className="w-full max-w-sm space-y-5 mb-14">
        {[
          { icon: <Heart size={24} fill="currentColor" />, label: "Sync", desc: "Deep heart check-ins", color: "bg-rose-100 text-rose-900" },
          { icon: <PartyPopper size={24} />, label: "Fun", desc: "Games & laughter", color: "bg-orange-100 text-orange-900" },
          { icon: <Sparkles size={24} />, label: "Joy", desc: "Shared rhythms", color: "bg-teal-100 text-teal-900" }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-5 bg-white/5 p-5 rounded-[1.8rem] text-left border border-white/10 shadow-inner">
            <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center shadow-lg shrink-0`}>{item.icon}</div>
            <div>
              <h4 className="text-white font-black text-sm uppercase tracking-widest">{item.label}</h4>
              <p className="text-white/40 text-xs font-bold">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full max-w-sm space-y-5">
        <button onClick={closeFTX} className="w-full py-6 bg-white text-slate-950 rounded-[2rem] font-black text-xl shadow-2xl active:scale-95 transition-all">Start Your First Sync</button>
        <button onClick={() => { setShowFTXOverlay(false); setCurrentView('walkthrough'); }} className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] hover:text-white transition-colors underline decoration-white/20 underline-offset-8">Tutorial & Help</button>
      </div>
    </div>
  );

  const renderFunDeck = () => {
    const question = filteredDeck[deckIdx];
    return (
      <div className="animate-in slide-in-from-right-8 duration-500 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => setFunSubView('menu')} className="p-2 text-slate-950 hover:opacity-70"><ChevronLeft size={24} /></button>
          <div className="flex bg-white p-1 rounded-2xl shadow-xl border-4 border-white">
            <button onClick={() => { setFunMode('light'); setDeckIdx(0); }} className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${funMode === 'light' ? 'bg-orange-600 text-white shadow-lg' : 'text-orange-950 hover:bg-orange-50'}`}>Light</button>
            <button onClick={() => { setFunMode('deep'); setDeckIdx(0); }} className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${funMode === 'deep' ? 'bg-orange-600 text-white shadow-lg' : 'text-orange-950 hover:bg-orange-50'}`}>Deep</button>
          </div>
        </div>
        <div className="bg-white rounded-[3.5rem] border-8 border-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] p-10 text-center relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center">
          <div className="absolute top-0 left-0 w-full h-3 bg-orange-600" />
          <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-orange-600 mb-10 mx-auto shadow-inner border-2 border-orange-100 animate-bounce">
            {funMode === 'light' ? <Laugh size={40} /> : <Heart size={40} fill="currentColor" />}
          </div>
          <h3 className="text-3xl font-black text-slate-950 leading-tight serif italic px-4">"{question?.text}"</h3>
          <p className="mt-14 text-[11px] font-black text-slate-300 uppercase tracking-[0.4em]">Card {deckIdx + 1} of {filteredDeck.length}</p>
        </div>
        <button onClick={nextFunQuestion} className="w-full py-7 bg-slate-950 text-white rounded-[2.5rem] font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">Next Question <ArrowRight size={28} /></button>
        {showFunPrompt && (
          <div className="bg-orange-900 text-white p-6 rounded-[2rem] shadow-2xl animate-in zoom-in-95 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shadow-inner"><PartyPopper size={24} /></div>
              <p className="text-sm font-black uppercase tracking-widest">Enjoying the sync? One more!</p>
            </div>
            <button onClick={() => setShowFunPrompt(false)} className="p-3 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
          </div>
        )}
      </div>
    );
  };

  const renderJokes = () => {
    const joke = EXTENDED_BIBLE_JOKES[jokeIdx];
    return (
      <div className="animate-in slide-in-from-right-8 duration-500 space-y-6">
        <button onClick={() => { setFunSubView('menu'); setShowJokeAnswer(false); }} className="p-2 text-slate-950 hover:opacity-70"><ChevronLeft size={24} /></button>
        <div className="bg-white rounded-[3.5rem] border-8 border-white shadow-2xl p-10 text-center flex flex-col items-center justify-center min-h-[400px] relative">
          <div className="absolute top-0 left-0 w-full h-3 bg-yellow-400" />
          <h4 className="text-[11px] font-black text-yellow-600 uppercase tracking-[0.5em] mb-10">Pulpit Punchlines</h4>
          <h3 className="text-2xl font-black text-slate-950 italic serif leading-snug px-2 mb-12">"{joke.q}"</h3>
          {showJokeAnswer ? (
            <div className="animate-in zoom-in-95 duration-500 bg-yellow-50 p-8 rounded-[2rem] border-4 border-yellow-100 w-full shadow-inner">
              <p className="text-2xl font-black text-yellow-950">"{joke.a}"</p>
            </div>
          ) : (
            <button onClick={() => setShowJokeAnswer(true)} className="px-10 py-5 bg-yellow-400 text-yellow-950 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 hover:bg-yellow-500">Reveal Answer</button>
          )}
        </div>
        <button onClick={() => { setJokeIdx((jokeIdx + 1) % EXTENDED_BIBLE_JOKES.length); setShowJokeAnswer(false); }} className="w-full py-7 bg-slate-950 text-white rounded-[2.5rem] font-black text-xl shadow-2xl active:scale-95 flex items-center justify-center gap-4 transition-all">Another One! <RefreshCcw size={28} /></button>
      </div>
    );
  };

  const renderQuiz = () => {
    const question = QUIZ_QUESTIONS[quizIdx];
    return (
      <div className="animate-in slide-in-from-right-8 duration-500 space-y-6">
        <button onClick={() => { setFunSubView('menu'); setQuizRevealed(false); }} className="p-2 text-slate-950 hover:opacity-70"><ChevronLeft size={24} /></button>
        <div className="bg-white rounded-[3.5rem] border-8 border-white shadow-2xl p-10 text-center flex flex-col items-center justify-center min-h-[400px] relative">
          <div className="absolute top-0 left-0 w-full h-3 bg-blue-500" />
          <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.5em] mb-10">Love Accuracy</h4>
          <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-8 shadow-inner border-2 border-blue-100"><Gamepad2 size={32} /></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Question about partner:</p>
          <h3 className="text-3xl font-black text-slate-950 italic serif leading-tight px-2 mb-12">"{question}"</h3>
          
          <div className="flex items-center gap-4">
            <button onClick={() => setFunScore(s => s + 1)} className="p-5 bg-emerald-100 text-emerald-950 rounded-[1.5rem] border-4 border-emerald-50 hover:bg-emerald-200 active:scale-90 transition-all shadow-xl"><Trophy size={32} /></button>
            <button onClick={() => setQuizIdx((quizIdx + 1) % QUIZ_QUESTIONS.length)} className="px-12 py-6 bg-slate-950 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95">Correct!</button>
          </div>
          <div className="mt-10 pt-8 border-t-2 border-slate-50 w-full flex items-center justify-center gap-3">
             <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
             <p className="text-[11px] font-black uppercase tracking-widest text-slate-950">Connection Streak: {funScore}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderFunZone = () => {
    switch (funSubView) {
      case 'deck': return renderFunDeck();
      case 'jokes': return renderJokes();
      case 'quiz': return renderQuiz();
      default:
        return (
          <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <button onClick={() => setFunSubView('deck')} className="bg-white p-10 rounded-[3rem] border-8 border-white shadow-2xl flex flex-col items-center text-center group active:scale-95 transition-all">
              <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-orange-600 mb-6 group-hover:rotate-12 transition-transform shadow-inner border-2 border-orange-100"><MessageCircle size={40} /></div>
              <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tight">Question Deck</h3>
              <p className="text-sm text-slate-950 font-black mt-3 leading-relaxed opacity-60 px-2">Fresh conversation starters to help you both discover more.</p>
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setFunSubView('jokes')} className="bg-white p-8 rounded-[2.5rem] border-8 border-white shadow-xl flex flex-col items-center text-center group active:scale-95 transition-all">
                <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 mb-4 group-hover:scale-110 transition-transform shadow-inner border-2 border-yellow-100"><Laugh size={28} /></div>
                <h3 className="text-xs font-black text-slate-950 uppercase tracking-widest">Bible Jokes</h3>
              </button>
              <button onClick={() => setFunSubView('quiz')} className="bg-white p-8 rounded-[2.5rem] border-8 border-white shadow-xl flex flex-col items-center text-center group active:scale-95 transition-all">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform shadow-inner border-2 border-blue-100"><Gamepad2 size={28} /></div>
                <h3 className="text-xs font-black text-slate-950 uppercase tracking-widest">Love Quiz</h3>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-teal-50 selection:bg-rose-100 selection:text-teal-950 font-bold" onClick={() => { setLogoClicked(false); }}>
      {currentView === 'onboarding' && renderOnboarding()}
      {currentView === 'walkthrough' && renderWalkthrough()}
      
      {currentView === 'home' && (
        <>
          {showFTXOverlay && renderFTXOverlay()}
          <div className="max-w-xl mx-auto px-4 pt-6 pb-32 h-screen flex flex-col overflow-hidden">
            {!isFirstTime && (
              <div className="mb-6 px-6 py-4 bg-white/90 backdrop-blur-md border-4 border-white rounded-[1.8rem] text-center shadow-2xl shrink-0 animate-in slide-in-from-top-2">
                <p className="text-slate-950 font-black italic text-xs leading-relaxed">"{currentQuote}"</p>
              </div>
            )}

            <header className="flex items-center justify-between mb-8 shrink-0 px-2">
              <div className="flex items-center gap-4">
                <button onClick={handleLogoClick} className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all transform active:scale-90 ${logoClicked ? 'bg-rose-600 shadow-rose-200' : 'bg-slate-950 shadow-slate-300'} text-white border-4 border-white animate-soft-pulse`}>
                  <Heart fill="currentColor" size={28} />
                </button>
                {logoClicked && (
                  <div className="absolute top-20 left-6 bg-white border-8 border-white rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] p-3 z-50 animate-in fade-in zoom-in-95">
                    <button onClick={() => { setCurrentView('walkthrough'); setLogoClicked(false); }} className="flex items-center gap-3 text-sm font-black text-slate-950 whitespace-nowrap px-6 py-3 hover:bg-slate-50 rounded-2xl transition-all"><Info size={20} className="text-teal-600" /> App Tutorial</button>
                  </div>
                )}
                <div><h1 className="text-2xl md:text-3xl serif italic text-slate-950 leading-none">{names.p1} & {names.p2}</h1><p className="text-teal-700 font-black uppercase tracking-widest text-[10px] mt-2">Relationship Dashboard</p></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { if(confirm("This will clear all your local sync data and plans. Continue?")) { localStorage.clear(); window.location.reload(); } }} className="p-4 bg-white text-slate-400 hover:text-rose-600 rounded-2xl border-4 border-white shadow-xl transition-all active:scale-90"><Trash2 size={22} /></button>
              </div>
            </header>

            <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-10 px-1">
              {homeTab === 'checkins' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col gap-6">
                   <div className="flex items-center gap-3 px-2 mb-2">
                     <div className="p-3 bg-rose-100 rounded-2xl text-rose-900 border-2 border-rose-200 shadow-lg"><Heart size={22} fill="currentColor" /></div>
                     <h2 className="text-xl font-black text-slate-950 uppercase tracking-widest">Heart Sync</h2>
                   </div>
                   
                   {/* Stacked long boxes requested for mobile */}
                   <div className="flex flex-col gap-5">
                     {CHECKIN_MODELS.map((model) => (
                        <button key={model.id} onClick={() => startCheckIn(model)} className="flex flex-col bg-white rounded-[2.5rem] border-8 border-white shadow-2xl hover:border-rose-300 transition-all group overflow-hidden relative active:scale-95 text-left w-full">
                          <div className="p-8 flex items-start gap-6 relative z-10 w-full h-full">
                            <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500 bg-slate-50 rounded-3xl border-2 border-slate-100 shadow-inner">{model.emoji}</div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-xl font-black text-slate-950 serif italic leading-tight">{model.title}</h3>
                                <span className={`px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest ${model.color} border-2 border-white shadow-sm`}>{model.acronym}</span>
                              </div>
                              <p className="text-sm text-slate-950 font-black uppercase tracking-tighter opacity-40 mb-3">{model.description}</p>
                              {/* Expanded word sequence below acronym/description as requested */}
                              <p className="text-[12px] font-black text-slate-950 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 inline-block w-full">
                                {model.expanded}
                              </p>
                            </div>
                          </div>
                          <div className="w-full h-3 bg-slate-50 group-hover:bg-rose-50 transition-colors" />
                        </button>
                     ))}
                   </div>
                </div>
              )}
              
              {homeTab === 'fun' && (
                <div>
                   <div className="flex items-center gap-3 px-2 mb-8">
                     <div className="p-3 bg-orange-100 rounded-2xl text-orange-900 border-2 border-orange-200 shadow-lg"><PartyPopper size={22} fill="currentColor" /></div>
                     <h2 className="text-xl font-black text-slate-950 uppercase tracking-widest">Fun Zone</h2>
                   </div>
                   {renderFunZone()}
                </div>
              )}

              {homeTab === 'joy' && (
                <div className="space-y-6">
                   <div className="flex items-center gap-3 px-2 mb-2">
                     <div className="p-3 bg-teal-100 rounded-2xl text-teal-900 border-2 border-teal-200 shadow-lg"><Sparkles size={22} fill="currentColor" /></div>
                     <h2 className="text-xl font-black text-slate-950 uppercase tracking-widest">Joy Planner</h2>
                   </div>
                   <div className="flex items-center gap-1 p-2 bg-white border-8 border-white rounded-[2.5rem] shadow-2xl mb-8">
                     <button onClick={() => setJoySubTab('planner')} className={`flex-1 py-4 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all ${joySubTab === 'planner' ? 'bg-teal-900 text-white shadow-xl' : 'text-teal-800 hover:bg-teal-50'}`}>Planner</button>
                     <button onClick={() => setJoySubTab('summary')} className={`flex-1 py-4 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all ${joySubTab === 'summary' ? 'bg-teal-900 text-white shadow-xl' : 'text-teal-800 hover:bg-teal-50'}`}>Journey Map</button>
                   </div>
                   {joySubTab === 'planner' ? (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
                        {!showSyncPanel ? (
                           <button onClick={() => setShowSyncPanel(true)} className="w-full flex items-center justify-between bg-white p-6 rounded-[2.5rem] border-8 border-white shadow-2xl group hover:border-teal-300 transition-all">
                              <div className="flex items-center gap-4"><div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-900 shadow-inner border-2 border-teal-100"><Link2 size={24} /></div><p className="text-xs font-black uppercase text-teal-950 tracking-widest">{joyCode ? `Sync Mode: ${joyCode}` : 'Link with Partner'}</p></div>
                              <Settings size={22} className="text-teal-300 group-hover:rotate-90 transition-all" />
                           </button>
                        ) : (
                           <div className="bg-white p-8 rounded-[3rem] border-8 border-teal-50 shadow-2xl animate-in zoom-in-95">
                             <div className="flex justify-between items-center mb-8"><h4 className="text-xs font-black uppercase text-teal-950 tracking-widest">Connection Sync</h4><button onClick={() => setShowSyncPanel(false)} className="p-3 text-slate-300 hover:text-rose-600 transition-colors"><X size={32} /></button></div>
                             <div className="space-y-5">
                               <input type="text" value={codeEntryInput} onChange={(e) => setCodeEntryInput(e.target.value.toUpperCase())} placeholder="PARTNER CODE" className="w-full bg-slate-50 rounded-[1.5rem] px-8 py-6 font-black text-center text-2xl tracking-[0.3em] outline-none border-4 border-transparent focus:border-teal-300 transition-all text-slate-950 placeholder:text-slate-200 shadow-inner"/>
                               <div className="grid grid-cols-2 gap-4">
                                 <button onClick={handleVerifyCode} className="py-5 bg-teal-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl">Connect</button>
                                 <button onClick={handleGenerateCode} className="py-5 bg-slate-100 text-teal-950 rounded-2xl font-black text-xs uppercase tracking-widest">New Code</button>
                               </div>
                               {joyCode && <button onClick={handleLogoutCode} className="w-full py-4 text-rose-600 font-black text-[11px] uppercase tracking-widest mt-4 bg-rose-50 rounded-xl">Disconnect {joyCode}</button>}
                             </div>
                           </div>
                        )}

                        <div className="flex overflow-x-auto gap-3 no-scrollbar pb-2">{['Daily', 'Weekly', 'Monthly', 'Annually', '5 Years'].map(tf => (<button key={tf} onClick={() => { setJoyTimeframe(tf); setAiDateSuggestions([]); }} className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest border-4 transition-all shadow-xl ${joyTimeframe === tf ? 'bg-teal-900 text-white border-teal-900' : 'bg-white text-slate-500 border-white hover:border-teal-100'}`}>{tf}</button>))}</div>
                        
                        <div className="bg-white rounded-[3.5rem] shadow-2xl border-[12px] border-white p-10 mb-8 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-10 opacity-5 text-teal-900"><Sparkles size={160} /></div>
                          <div className="flex items-center justify-between mb-10 relative z-10">
                            <div className="flex items-center gap-5"><div className="w-16 h-16 bg-teal-50 rounded-3xl flex items-center justify-center text-teal-700 shadow-inner border-2 border-teal-100"><CalendarPlus size={32} /></div><h2 className="text-2xl font-black text-slate-950 serif italic">Plan {joyTimeframe}</h2></div>
                            <button onClick={fetchAIDateIdeas} disabled={loadingDates} className="p-4 bg-teal-950 text-white rounded-[1.5rem] shadow-2xl active:scale-90 transition-all">{loadingDates ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Zap size={24} fill="currentColor" />}</button>
                          </div>
                          <div className="space-y-5 mb-10 relative z-10">
                            <input type="text" value={joyInput} onChange={(e) => setJoyInput(e.target.value)} placeholder="Action (e.g. Prayer Walk)" className="w-full bg-slate-50 rounded-[1.5rem] px-8 py-6 text-base font-black border-4 border-transparent focus:border-teal-200 outline-none transition-all placeholder:text-slate-300 shadow-inner text-slate-950"/>
                            <input type="text" value={joyWhen} onChange={(e) => setJoyWhen(e.target.value)} placeholder="Frequency/Time" className="w-full bg-slate-50 rounded-[1.5rem] px-8 py-6 text-base font-black border-4 border-transparent focus:border-teal-200 outline-none transition-all placeholder:text-slate-300 shadow-inner text-slate-950"/>
                            <button onClick={() => addJoyPlan(joyInput, joyWhen)} disabled={!joyInput} className="w-full py-6 bg-teal-800 text-white rounded-[1.8rem] font-black text-base uppercase tracking-[0.2em] shadow-2xl active:scale-95 disabled:opacity-30 transition-all">Lock in Plan</button>
                          </div>
                        </div>

                        <div className="space-y-4">{joyPlans[joyTimeframe].map(p => (<div key={p.id} className="bg-white p-6 rounded-[2.5rem] shadow-2xl border-8 border-white flex items-center justify-between group hover:border-teal-200 transition-all"><div><p className="font-black text-slate-950 text-lg">{p.activity}</p>{p.timeInfo && <p className="text-[11px] text-teal-700 font-black uppercase tracking-[0.2em] mt-2">{p.timeInfo}</p>}</div><button onClick={() => removeJoyPlan(p.id)} className="text-slate-200 hover:text-rose-600 p-4 transition-all active:scale-75"><Trash2 size={24} /></button></div>))}</div>
                      </div>
                   ) : renderOverallJoySummary()}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {currentView === 'checkin' && renderCheckIn()}
      {currentView === 'summary' && renderSummary()}
      
      {currentView === 'home' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] max-w-[360px] bg-slate-950/98 backdrop-blur-3xl p-2.5 rounded-[3rem] flex justify-around items-center shadow-[0_40px_120px_-20px_rgba(0,0,0,0.7)] border border-white/20 z-50">
          <button onClick={() => setHomeTab('checkins')} className={`p-5 rounded-[2.2rem] transition-all flex-1 flex flex-col items-center justify-center gap-1.5 group ${homeTab === 'checkins' ? 'bg-rose-700 text-white shadow-[0_0_40px_rgba(225,29,72,0.4)] border border-white/10' : 'text-white/30 hover:text-white/80'}`}>
            <Heart size={26} fill={homeTab === 'checkins' ? "currentColor" : "none"} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sync</span>
          </button>
          <button onClick={() => { setHomeTab('fun'); setFunSubView('menu'); }} className={`p-5 rounded-[2.2rem] transition-all flex-1 flex flex-col items-center justify-center gap-1.5 group ${homeTab === 'fun' ? 'bg-orange-600 text-white shadow-[0_0_40px_rgba(234,88,12,0.4)] border border-white/10' : 'text-white/30 hover:text-white/80'}`}>
            <PartyPopper size={26} fill={homeTab === 'fun' ? "currentColor" : "none"} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Fun</span>
          </button>
          <button onClick={() => setHomeTab('joy')} className={`p-5 rounded-[2.2rem] transition-all flex-1 flex flex-col items-center justify-center gap-1.5 group ${homeTab === 'joy' ? 'bg-teal-600 text-white shadow-[0_0_40px_rgba(13,148,136,0.4)] border border-white/10' : 'text-white/30 hover:text-white/80'}`}>
            <Sparkles size={26} fill={homeTab === 'joy' ? "currentColor" : "none"} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Joy</span>
          </button>
        </div>
      )}
    </div>
  );
}