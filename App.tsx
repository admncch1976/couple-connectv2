
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Heart, 
  Sparkles, 
  ArrowRight,
  Trash2,
  Zap,
  Download,
  Info,
  X,
  RefreshCcw,
  Laugh,
  Trophy,
  Link2,
  MessageCircle,
  Settings,
  PartyPopper,
  Gamepad2,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Target,
  UserCheck,
  CalendarPlus,
  PlusCircle,
  CheckCircle2,
  Star,
  MapPin,
  Palmtree,
  Frown,
  BrainCircuit,
  Home,
  AlertCircle
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { View, HomeTab, CheckInModel, JoyPlan, Turn, AIInsight, DateIdea, PartnerNames, DualReflection, CustomQuizQuestion } from './types';
import { CHECKIN_MODELS, FUN_DECK, EXTENDED_BIBLE_JOKES, FEELINGS_DATA, JOY_SUGGESTIONS, LOVE_DUEL_EDITION } from './constants';
import { geminiService } from './geminiService';

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
  const [turn, setTurn] = useState<Turn>('p1');
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [activePracticalPrompt, setActivePracticalPrompt] = useState('');
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [joyTimeframe, setJoyTimeframe] = useState('Weekly');
  const [joyPlans, setJoyPlans] = useState<Record<string, JoyPlan[]>>({
    'Daily': [], 'Weekly': [], 'Monthly': [], 'Annually': [], '5 Years': []
  });
  const [joyInput, setJoyInput] = useState('');
  const [joyWhen, setJoyWhen] = useState('');
  const [loadingDates, setLoadingDates] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [joySubTab, setJoySubTab] = useState<'planner' | 'summary'>('planner');

  const [logoClicked, setLogoClicked] = useState(false);

  // Feelings Wheel State
  const [showFeelingsWheel, setShowFeelingsWheel] = useState(false);
  const [selectedMainFeeling, setSelectedMainFeeling] = useState<string | null>(null);

  // Fun Zone State
  const [funSubView, setFunSubView] = useState<'menu' | 'deck' | 'jokes' | 'duel-setup' | 'duel-play' | 'duel-menu'>('menu');
  const [deckIdx, setDeckIdx] = useState(0);
  const [jokeIdx, setJokeIdx] = useState(0);
  const [showJokeAnswer, setShowJokeAnswer] = useState(false);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [funTurn, setFunTurn] = useState<Turn>('p1');
  
  // Custom Duel State
  const [duelType, setDuelType] = useState<'custom' | 'likes-dislikes'>('likes-dislikes');
  const [setupTurn, setSetupTurn] = useState<Turn>('p1');
  const [customQs, setCustomQs] = useState<{ p1: CustomQuizQuestion[], p2: CustomQuizQuestion[] }>({ p1: [], p2: [] });
  const [setupStep, setSetupStep] = useState(0);
  const [draftQ, setDraftQ] = useState('');
  const [draftA, setDraftA] = useState('');
  const [duelRound, setDuelRound] = useState(0);
  const [duelRevealed, setDuelRevealed] = useState(false);
  const [duelGuess, setDuelGuess] = useState('');
  const [duelStreak, setDuelStreak] = useState(0);
  const [duelFeedback, setDuelFeedback] = useState('');

  const MARRIAGE_QUOTES = [
    "Communication is the fuel that keeps the fire of your relationship burning.",
    "The goal in marriage is not to think alike, but to think together.",
    "A good marriage is the union of two good forgivers.",
    "Your words are the bricks that build the home your heart lives in."
  ];

  const currentQuote = useMemo(() => MARRIAGE_QUOTES[Math.floor(Math.random() * MARRIAGE_QUOTES.length)], []);
  const filteredDeck = FUN_DECK.filter(q => q.mode === 'light');

  useEffect(() => {
    localStorage.setItem('partnerNames', JSON.stringify(names));
  }, [names]);

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (names.p1 && names.p2) {
      setCurrentView('home');
      if (isFirstTime) setShowFTXOverlay(true);
    }
  };

  const startCheckIn = (model: CheckInModel) => {
    setSelectedModel(model);
    setCurrentStepIndex(0);
    setDualNotes({});
    setTurn('p1');
    setInsight(null);
    setApiError(null);
    setActivePracticalPrompt(model.practicalPrompt || '');
    setCurrentView('checkin');
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
        goHome();
      }
    }
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startAiAnalysis = async () => {
    if (!selectedModel) return;
    setCurrentView('ai-insight');
    setLoadingInsight(true);
    setApiError(null);
    try {
      const flatNotes: Record<number, string> = {};
      (Object.entries(dualNotes) as [string, DualReflection][]).forEach(([idx, note]) => {
        flatNotes[Number(idx)] = `${names.p1}: ${note.p1}. ${names.p2}: ${note.p2}.`;
      });
      const res = await geminiService.analyzeCheckIn(selectedModel.acronym, flatNotes);
      setInsight(res);
    } catch (error: any) { 
      console.error(error);
      setApiError(error.message || "An unexpected error occurred. Please try again.");
    } finally { 
      setLoadingInsight(false); 
    }
  };

  const refreshPracticalPrompt = async () => {
    if (!selectedModel) return;
    setLoadingPrompt(true);
    setApiError(null);
    try {
      const newPrompt = await geminiService.generatePracticalPrompt(selectedModel.acronym);
      setActivePracticalPrompt(newPrompt);
    } catch (e: any) {
      console.error(e);
      setApiError("Could not fetch a new prompt. Using previous one.");
    } finally {
      setLoadingPrompt(false);
    }
  };

  const addJoyPlan = (activity: string, time: string) => {
    if (!activity) return;
    const newPlan: JoyPlan = { id: Date.now(), activity, timeInfo: time };
    setJoyPlans(prev => ({ ...prev, [joyTimeframe]: [...(prev[joyTimeframe] || []), newPlan] }));
    setJoyInput(''); setJoyWhen('');
  };

  const removeJoyPlan = (id: number) => {
    setJoyPlans(prev => ({ ...prev, [joyTimeframe]: (prev[joyTimeframe] || []).filter(p => p.id !== id) }));
  };

  const addScore = (player: Turn, pts: number) => {
    setScores(prev => ({ ...prev, [player]: prev[player] + pts }));
  };

  const handleAddCustomQ = () => {
    if (!draftA) return;
    const qText = duelType === 'custom' ? draftQ : LOVE_DUEL_EDITION[setupStep].question;
    const newQ = { question: qText, answer: draftA };
    const currentList = customQs[setupTurn];
    const updated = { ...customQs, [setupTurn]: [...currentList, newQ] };
    setCustomQs(updated);
    setDraftQ('');
    setDraftA('');
    if (setupStep < 4) {
      setSetupStep(s => s + 1);
    } else if (setupTurn === 'p1') {
      setSetupTurn('p2');
      setSetupStep(0);
    } else {
      setFunSubView('duel-play');
      setFunTurn('p1'); 
      setDuelRound(0);
      setDuelStreak(0);
    }
  };

  const handleDuelResult = (isCorrect: boolean) => {
    if (isCorrect) {
      addScore(funTurn, 20);
      setDuelStreak(s => s + 1);
      setDuelFeedback(Math.random() > 0.5 ? "You really know me! 💞" : "In sync again! 🔥");
      if (duelStreak + 1 === 3) {
         addScore(funTurn, 15); // Bonus
         setDuelFeedback("3 Correct Streak! Bonus +15 points! 🏆");
      }
    } else {
      setDuelStreak(0);
      setDuelFeedback(Math.random() > 0.5 ? "Plot twist! 😄" : "Still discovering each other… 💭");
    }
    
    setDuelRevealed(true);
  };

  const proceedDuelRound = () => {
    setDuelRevealed(false);
    setDuelGuess('');
    setDuelFeedback('');
    if (duelRound < 4) {
      setDuelRound(r => r + 1);
    } else if (funTurn === 'p1') {
      setFunTurn('p2'); 
      setDuelRound(0);
      setDuelStreak(0);
    } else {
      setFunSubView('menu');
    }
  };

  const fetchAIDateIdeas = async () => {
    setLoadingDates(true);
    try {
      const ideas = await geminiService.suggestDateIdeas(joyTimeframe);
      if (ideas.length > 0) addJoyPlan(ideas[0].title, ideas[0].description.slice(0, 50));
    } catch (e) { console.error(e); } finally { setLoadingDates(false); }
  };

  const exportRefToImage = async (ref: React.RefObject<HTMLDivElement>, name: string) => {
    if (!ref.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(ref.current, { backgroundColor: '#f0fdfa', scale: 2 });
      const link = document.createElement('a');
      link.download = `soul-sync-${name}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (e) { console.error(e); } finally { setIsExporting(false); }
  };

  const goHome = () => { setCurrentView('home'); setSelectedModel(null); setApiError(null); };
  const closeFTX = () => { setShowFTXOverlay(false); setIsFirstTime(false); localStorage.setItem('hasSeenWalkthrough', 'true'); };

  const FeelingsWheelOverlay = () => {
    const handlePickFeeling = (feeling: string) => {
      const currentVal = dualNotes[currentStepIndex]?.[turn] || '';
      const newVal = currentVal ? `${currentVal}, I feel ${feeling}` : `I feel ${feeling}`;
      setDualNotes({
        ...dualNotes,
        [currentStepIndex]: {
          ...(dualNotes[currentStepIndex] || { p1: '', p2: '' }),
          [turn]: newVal
        }
      });
      setSelectedMainFeeling(null);
      setShowFeelingsWheel(false);
    };

    return (
      <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border-8 border-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-slate-950 serif italic">Feelings Wheel</h3>
            <button onClick={() => { setShowFeelingsWheel(false); setSelectedMainFeeling(null); }} className="p-2 bg-slate-100 rounded-full text-slate-950 active:scale-90 transition-all"><X size={24} /></button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
            {!selectedMainFeeling ? (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(FEELINGS_DATA).map(([feeling, data]) => (
                  <button key={feeling} onClick={() => setSelectedMainFeeling(feeling)} className={`${data.color} p-6 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-lg active:scale-95 transition-all border-4 border-transparent hover:border-black/10`}>
                    <span className="text-3xl mb-2">{data.emoji}</span>
                    <span className="text-sm font-black uppercase tracking-widest leading-none">{feeling}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <button onClick={() => setSelectedMainFeeling(null)} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-950 mb-2 active:scale-95"><ChevronLeft size={16}/> Back to Main</button>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${FEELINGS_DATA[selectedMainFeeling as keyof typeof FEELINGS_DATA].color} rounded-xl flex items-center justify-center text-xl shadow-inner`}>{FEELINGS_DATA[selectedMainFeeling as keyof typeof FEELINGS_DATA].emoji}</div>
                  <h4 className="text-2xl font-black text-slate-950 serif italic">{selectedMainFeeling}</h4>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(FEELINGS_DATA[selectedMainFeeling as keyof typeof FEELINGS_DATA].secondary).map(([sec, subList]) => (
                    <div key={sec} className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 shadow-sm">
                      <p className="text-[10px] font-black uppercase text-slate-950 mb-3 tracking-widest border-b-2 border-slate-200 pb-1">{sec}</p>
                      <div className="flex flex-wrap gap-2">
                        {subList.map(sub => (
                          <button key={sub} onClick={() => handlePickFeeling(`${selectedMainFeeling} (${sec}: ${sub})`)} className="px-4 py-2 bg-white rounded-xl text-[11px] font-black text-slate-950 border-2 border-slate-200 hover:border-black active:scale-95 transition-all shadow-sm">{sub}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ScoreBoard = () => (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className={`p-5 rounded-[2.5rem] border-4 transition-all ${funTurn === 'p1' ? 'bg-teal-900 text-white border-white shadow-xl' : 'bg-white text-slate-950 border-slate-100 shadow-sm'}`}>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{names.p1}</p>
        <p className="text-2xl font-black">{scores.p1} <span className="text-xs opacity-50">pts</span></p>
      </div>
      <div className={`p-5 rounded-[2.5rem] border-4 transition-all ${funTurn === 'p2' ? 'bg-rose-900 text-white border-white shadow-xl' : 'bg-white text-slate-950 border-slate-100 shadow-sm'}`}>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{names.p2}</p>
        <p className="text-2xl font-black">{scores.p2} <span className="text-xs opacity-50">pts</span></p>
      </div>
    </div>
  );

  const renderFunZone = () => {
    const isP1Fun = funTurn === 'p1';
    const speaker = isP1Fun ? names.p1 : names.p2;
    
    const header = (title: string) => (
      <div className="flex items-center justify-between mb-4 px-1">
        <button onClick={() => setFunSubView('menu')} className="p-2 bg-white rounded-xl shadow-md text-slate-950 border border-slate-100 active:scale-95 transition-all"><ChevronLeft size={20}/></button>
        <h2 className="text-sm font-black text-slate-950 uppercase tracking-widest">{title}</h2>
        <div className="w-10" />
      </div>
    );

    switch (funSubView) {
      case 'deck':
        const q = filteredDeck[deckIdx];
        return (
          <div className="animate-in slide-in-from-right duration-500">
            {header("Let's Know More")}
            <ScoreBoard />
            <div className="bg-white rounded-[2.5rem] border-8 border-white shadow-2xl p-10 text-center min-h-[340px] flex flex-col items-center justify-center">
              <div className={`px-6 py-1 ${isP1Fun ? 'bg-teal-900' : 'bg-rose-900'} text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg`}>Asking {speaker}</div>
              <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-8 font-sans">"{q?.text}"</h3>
              
              <div className="space-y-4 w-full">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rate the response quality:</p>
                <div className="grid grid-cols-1 gap-3">
                  <button onClick={() => { addScore(funTurn, 5); setDeckIdx((deckIdx + 1) % filteredDeck.length); setFunTurn(isP1Fun ? 'p2' : 'p1'); }} className="flex items-center justify-between px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-950 hover:bg-slate-100 active:scale-95 transition-all group"><span className="text-[10px] font-black uppercase tracking-widest">Low Effort</span><span className="flex items-center gap-1 font-black text-xs text-slate-400 group-hover:text-slate-950">+5 <Star size={14} /></span></button>
                  <button onClick={() => { addScore(funTurn, 10); setDeckIdx((deckIdx + 1) % filteredDeck.length); setFunTurn(isP1Fun ? 'p2' : 'p1'); }} className={`flex items-center justify-between px-6 py-4 ${isP1Fun ? 'bg-teal-50 border-teal-100' : 'bg-rose-50 border-rose-100'} rounded-2xl text-slate-950 hover:opacity-80 active:scale-95 transition-all group`}><span className="text-[10px] font-black uppercase tracking-widest">Good Share</span><span className="flex items-center gap-1 font-black text-xs text-slate-950">+10 <Star size={14} fill="currentColor" /></span></button>
                  <button onClick={() => { addScore(funTurn, 20); setDeckIdx((deckIdx + 1) % filteredDeck.length); setFunTurn(isP1Fun ? 'p2' : 'p1'); }} className={`flex items-center justify-between px-6 py-5 ${isP1Fun ? 'bg-teal-900' : 'bg-rose-900'} text-white rounded-2xl active:scale-95 transition-all group shadow-xl`}><span className="text-[10px] font-black uppercase tracking-widest">Deep Connection</span><span className="flex items-center gap-1 font-black text-xs">+20 <Star size={16} fill="currentColor" /></span></button>
                </div>
                <button onClick={() => { setDeckIdx((deckIdx + 1) % filteredDeck.length); setFunTurn(isP1Fun ? 'p2' : 'p1'); }} className="w-full py-3 text-slate-300 hover:text-slate-400 text-[10px] font-black uppercase tracking-widest mt-4">Skip Question</button>
              </div>
            </div>
          </div>
        );
      case 'jokes':
        const joke = EXTENDED_BIBLE_JOKES[jokeIdx];
        return (
          <div className="animate-in slide-in-from-right duration-500">
            {header("Crack Each Other Up")}
            <ScoreBoard />
            <div className="bg-white rounded-[2.5rem] border-8 border-white shadow-2xl p-10 text-center min-h-[340px] flex flex-col items-center justify-center">
              <p className="text-[10px] font-black text-slate-950 mb-6 uppercase tracking-widest">{speaker} reads aloud:</p>
              <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-8 font-sans">"{joke.q}"</h3>
              {showJokeAnswer ? (
                <div className="animate-in zoom-in-95 bg-yellow-50 p-8 rounded-[2rem] border-4 border-yellow-100 w-full mb-8 shadow-inner"><p className="text-2xl font-bold text-slate-900 font-sans">"{joke.a}"</p></div>
              ) : (
                <button onClick={() => setShowJokeAnswer(true)} className="px-10 py-5 bg-yellow-400 text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Reveal Punchline</button>
              )}
              {showJokeAnswer && (
                <div className="grid grid-cols-2 gap-4 w-full">
                  <button onClick={() => { addScore('p1', 20); setShowJokeAnswer(false); setJokeIdx((jokeIdx + 1) % EXTENDED_BIBLE_JOKES.length); setFunTurn(funTurn === 'p1' ? 'p2' : 'p1'); }} className="py-4 bg-teal-900 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl active:scale-95 transition-all">{names.p1} Laughed</button>
                  <button onClick={() => { addScore('p2', 20); setShowJokeAnswer(false); setJokeIdx((jokeIdx + 1) % EXTENDED_BIBLE_JOKES.length); setFunTurn(funTurn === 'p1' ? 'p2' : 'p1'); }} className="py-4 bg-rose-900 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl active:scale-95 transition-all">{names.p2} Laughed</button>
                  <button onClick={() => { setShowJokeAnswer(false); setJokeIdx((jokeIdx + 1) % EXTENDED_BIBLE_JOKES.length); setFunTurn(funTurn === 'p1' ? 'p2' : 'p1'); }} className="col-span-2 py-4 bg-slate-100 text-slate-950 rounded-2xl font-black text-[10px] uppercase active:scale-95 transition-all">Next Joke</button>
                </div>
              )}
            </div>
          </div>
        );
      case 'duel-menu':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            {header("Love Duel Menu")}
            <div className="grid grid-cols-1 gap-5">
               <button onClick={() => { setDuelType('likes-dislikes'); setFunSubView('duel-setup'); setSetupTurn('p1'); setSetupStep(0); setCustomQs({p1:[], p2:[]}); }} className="bg-white p-8 rounded-[3rem] border-8 border-white shadow-2xl flex items-center gap-6 text-left active:scale-[0.98] transition-all group">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-900 shadow-inner border border-blue-200"><Palmtree size={32}/></div>
                  <div className="flex-1"><h3 className="text-lg font-black text-slate-950 serif italic">Likes, Dislikes & Vacation</h3><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Structured 5-question edition</p></div>
                  <ChevronRight size={24} className="text-slate-200" />
               </button>
               <button onClick={() => { setDuelType('custom'); setFunSubView('duel-setup'); setSetupTurn('p1'); setSetupStep(0); setCustomQs({p1:[], p2:[]}); }} className="bg-white p-8 rounded-[3rem] border-8 border-white shadow-2xl flex items-center gap-6 text-left active:scale-[0.98] transition-all group">
                  <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-900 shadow-inner border border-teal-200"><Settings size={32}/></div>
                  <div className="flex-1"><h3 className="text-lg font-black text-slate-950 serif italic">Custom Edition</h3><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">You write the secret questions</p></div>
                  <ChevronRight size={24} className="text-slate-200" />
               </button>
            </div>
          </div>
        );
      case 'duel-setup':
        const setter = setupTurn === 'p1' ? names.p1 : names.p2;
        const isP1Setup = setupTurn === 'p1';
        const setupQ = duelType === 'likes-dislikes' ? LOVE_DUEL_EDITION[setupStep] : null;
        
        return (
          <div className="animate-in fade-in duration-500">
            {header(`${duelType === 'custom' ? 'Custom' : 'Likes & Dislikes'} Duel Setup`)}
            <div className={`bg-white rounded-[3rem] border-8 border-white shadow-2xl p-8 ${isP1Setup ? 'shadow-teal-900/10' : 'shadow-rose-900/10'}`}>
              <div className="flex items-center gap-5 mb-10">
                <div className={`p-4 ${isP1Setup ? 'bg-teal-900' : 'bg-rose-900'} text-white rounded-2xl shadow-xl border-4 border-white`}><ShieldCheck size={28} /></div>
                <div><h4 className="text-xl font-black text-slate-950 serif italic">{setter}'s turn to hide truths!</h4><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Question {setupStep + 1} of 5</p></div>
              </div>
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-950 ml-1 opacity-40">The Question</label>
                  {duelType === 'custom' ? (
                    <input type="text" value={draftQ} onChange={e => setDraftQ(e.target.value)} placeholder="e.g. My favorite memory of us?" className="w-full p-6 bg-slate-50 rounded-2xl font-black text-slate-950 border-4 border-transparent focus:border-slate-100 outline-none shadow-inner text-lg" />
                  ) : (
                    <div className="p-6 bg-slate-50 rounded-2xl border-4 border-slate-100 shadow-inner"><p className="text-lg font-bold text-slate-900 font-sans tracking-tight">"{setupQ?.question}"</p></div>
                  )}
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-950 ml-1 opacity-40">Your Secret Answer</label>
                  {duelType === 'likes-dislikes' && setupQ?.options ? (
                    <div className="grid grid-cols-1 gap-3">
                      {setupQ.options.map((opt, i) => (
                        <button key={i} onClick={() => setDraftA(opt)} className={`p-5 rounded-2xl text-left font-bold transition-all border-4 flex justify-between items-center ${draftA === opt ? (isP1Setup ? 'bg-teal-900 text-white border-teal-900' : 'bg-rose-900 text-white border-rose-900') : 'bg-white text-slate-950 border-slate-50 shadow-sm'}`}>
                          <span>{opt}</span>
                          {draftA === opt && <CheckCircle2 size={18} />}
                        </button>
                      ))}
                      <div className="relative mt-2">
                        <input type="text" value={setupQ.options.includes(draftA) ? '' : draftA} onChange={e => setDraftA(e.target.value)} placeholder="Something else..." className={`w-full p-5 rounded-2xl font-bold border-4 focus:outline-none transition-all ${!setupQ.options.includes(draftA) && draftA ? (isP1Setup ? 'border-teal-900' : 'border-rose-900') : 'border-slate-50 bg-slate-50'}`} />
                      </div>
                    </div>
                  ) : (
                    <input type="password" value={draftA} onChange={e => setDraftA(e.target.value)} placeholder="Secret true answer..." className="w-full p-6 bg-slate-50 rounded-2xl font-black text-slate-950 border-4 border-transparent focus:border-slate-100 outline-none shadow-inner text-lg" />
                  )}
                </div>
                <button onClick={handleAddCustomQ} disabled={(duelType === 'custom' && !draftQ) || !draftA} className={`w-full py-7 ${isP1Setup ? 'bg-teal-900' : 'bg-rose-900'} text-white rounded-[2.2rem] font-black text-sm uppercase tracking-widest shadow-2xl disabled:opacity-30 active:scale-95 transition-all border-4 border-white/20`}>Save & {setupStep < 4 ? 'Next' : 'Hand to Partner'}</button>
              </div>
              <p className="mt-8 text-[11px] font-black text-rose-600 text-center uppercase animate-soft-pulse">🔒 Private session! Keep answers secret! 🤫</p>
            </div>
          </div>
        );
      case 'duel-play':
        const duelAnswering = isP1Fun ? names.p1 : names.p2;
        const targetQSet = isP1Fun ? customQs.p2 : customQs.p1;
        const duelQ = targetQSet[duelRound];
        const structuredQ = duelType === 'likes-dislikes' ? LOVE_DUEL_EDITION[duelRound] : null;
        
        return (
          <div className="animate-in slide-in-from-right duration-500">
            {header("The Love Duel")}
            <ScoreBoard />
            <div className={`bg-white rounded-[3.5rem] border-8 border-white shadow-2xl p-10 text-center min-h-[460px] flex flex-col items-center relative overflow-hidden ${isP1Fun ? 'shadow-teal-900/10' : 'shadow-rose-900/10'}`}>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Round {duelRound + 1} of 5</p>
              
              <div className="flex flex-col items-center mb-8">
                <div className={`px-5 py-1.5 ${isP1Fun ? 'bg-teal-50 text-teal-950' : 'bg-rose-50 text-rose-950'} rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-white shadow-sm mb-4`}>{duelAnswering}'s Guess</div>
                <h3 className="text-2xl font-bold text-slate-900 leading-tight font-sans tracking-tight">"{duelQ?.question}"</h3>
              </div>

              {!duelRevealed ? (
                <div className="w-full space-y-6">
                  {duelType === 'likes-dislikes' && structuredQ?.options ? (
                    <div className="grid grid-cols-1 gap-3">
                      {structuredQ.options.map((opt, i) => (
                        <button key={i} onClick={() => { setDuelGuess(opt); handleDuelResult(opt === duelQ.answer); }} className="w-full p-5 bg-slate-50 border-4 border-slate-50 rounded-2xl font-bold text-slate-950 hover:bg-slate-100 active:scale-95 transition-all text-left">
                          {opt}
                        </button>
                      ))}
                      <div className="mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Wait, is it something else?</div>
                      <div className="flex gap-2">
                        <input type="text" value={structuredQ.options.includes(duelGuess) ? '' : duelGuess} onChange={e => setDuelGuess(e.target.value)} placeholder="Type a guess..." className="flex-1 p-5 bg-slate-50 rounded-2xl font-bold text-slate-950 border-4 border-transparent focus:border-slate-100 outline-none shadow-inner" />
                        <button onClick={() => handleDuelResult(duelGuess.trim().toLowerCase() === duelQ.answer.trim().toLowerCase())} className={`p-5 ${isP1Fun ? 'bg-teal-900' : 'bg-rose-900'} text-white rounded-2xl active:scale-95 transition-all shadow-xl`}><ArrowRight size={20}/></button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full space-y-6">
                      <input type="text" value={duelGuess} onChange={e => setDuelGuess(e.target.value)} placeholder="Type your guess..." className="w-full p-6 bg-slate-50 rounded-2xl font-black text-slate-950 border-4 border-transparent focus:border-slate-100 outline-none mb-2 shadow-inner text-lg" />
                      <button onClick={() => handleDuelResult(duelGuess.trim().toLowerCase() === duelQ.answer.trim().toLowerCase())} className={`w-full py-7 ${isP1Fun ? 'bg-teal-900' : 'bg-rose-900'} text-white rounded-[2.2rem] font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all border-4 border-white/20`}>Reveal Truth</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full animate-in zoom-in-95">
                  <div className={`p-8 rounded-[2.5rem] border-4 mb-8 shadow-inner ${duelFeedback.includes("Streak") ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-slate-100'}`}>
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Secret Answer Was:</p>
                    <p className="text-2xl font-bold text-slate-900 font-sans italic mb-4">"{duelQ?.answer}"</p>
                    <p className={`text-sm font-black uppercase tracking-widest ${duelFeedback.includes("Incorrect") ? 'text-rose-600' : 'text-emerald-600 animate-bounce'}`}>{duelFeedback}</p>
                  </div>
                  <button onClick={proceedDuelRound} className={`w-full py-7 ${isP1Fun ? 'bg-teal-900' : 'bg-rose-900'} text-white rounded-[2.2rem] font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all border-4 border-white/20`}>{duelRound < 4 ? 'Next Question' : `Complete ${duelAnswering}'s Round`}</button>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6 animate-in fade-in duration-700 pb-10">
            <div className="flex justify-between items-center bg-slate-950 text-white p-6 rounded-[2.5rem] shadow-2xl mb-2">
              <div><p className="text-[10px] font-black uppercase tracking-widest opacity-60">Session Points</p><p className="text-xl font-black serif italic">{names.p1}: {scores.p1} | {names.p2}: {scores.p2}</p></div>
              <Trophy size={32} className="text-yellow-400" />
            </div>

            <button onClick={() => setFunSubView('deck')} className="bg-white p-6 rounded-[2.5rem] border-4 border-white shadow-xl flex items-center gap-5 group w-full text-left active:scale-[0.98] transition-all">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-950 shadow-inner border border-orange-200"><MessageCircle size={28}/></div>
              <div className="flex-1"><h3 className="text-lg font-black text-slate-950 uppercase tracking-tight leading-none mb-1">Let's Know More</h3><p className="text-[11px] font-black text-slate-950 opacity-60">Discovery questions with quality scoring.</p></div>
              <ChevronRight size={24} className="text-slate-200" />
            </button>

            <div className="grid grid-cols-2 gap-5">
              <button onClick={() => setFunSubView('jokes')} className="bg-white p-6 rounded-[2.5rem] border-4 border-white shadow-xl flex flex-col items-center text-center group active:scale-[0.98] transition-all">
                <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-900 mb-3 shadow-inner border border-yellow-200"><Laugh size={28}/></div>
                <h3 className="text-[11px] font-black text-slate-950 uppercase tracking-widest leading-tight">Crack Each Other Up</h3>
              </button>
              <button onClick={() => { setFunSubView('duel-menu'); }} className="bg-white p-6 rounded-[2.5rem] border-4 border-white shadow-xl flex flex-col items-center text-center group active:scale-[0.98] transition-all">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-900 mb-3 shadow-inner border border-blue-200"><Gamepad2 size={28}/></div>
                <h3 className="text-[11px] font-black text-slate-950 uppercase tracking-widest leading-tight">Love Duel</h3>
              </button>
            </div>
          </div>
        );
    }
  };

  const renderCheckIn = () => {
    if (!selectedModel) return null;
    const step = selectedModel.steps[currentStepIndex];
    const speakerName = turn === 'p1' ? names.p1 : names.p2;
    const partnerName = turn === 'p1' ? names.p2 : names.p1;
    const currentNotes = dualNotes[currentStepIndex] || { p1: '', p2: '' };
    const textValue = currentNotes[turn] || '';
    const progress = ((currentStepIndex * 2 + (turn === 'p2' ? 1 : 0)) / (selectedModel.steps.length * 2)) * 100;

    const isP1 = turn === 'p1';
    const mainColorClass = isP1 ? 'bg-teal-900' : 'bg-rose-900';
    const buttonClass = isP1 ? 'bg-teal-700 hover:bg-teal-800 shadow-teal-900/20' : 'bg-rose-700 hover:bg-rose-800 shadow-rose-900/20';
    
    const handleQuickPromptClick = (p: string) => {
      const currentVal = dualNotes[currentStepIndex]?.[turn] || '';
      const newVal = currentVal ? `${currentVal}, ${p}` : p;
      setDualNotes({ ...dualNotes, [currentStepIndex]: { ...currentNotes, [turn]: newVal } });
      if (textareaRef.current) textareaRef.current.focus();
    };

    return (
      <div className={`fixed inset-0 z-[150] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-500 ${isP1 ? 'bg-teal-50' : 'bg-rose-50'}`}>
        <div className="max-w-xl mx-auto px-6 py-8 min-h-screen flex flex-col">
          {showFeelingsWheel && <FeelingsWheelOverlay />}
          
          <header className="flex items-center justify-between mb-8">
            <button onClick={handlePrevStep} className="p-3 bg-white text-slate-950 rounded-2xl border-4 border-white shadow-xl active:scale-95 transition-all"><ChevronLeft size={20} /></button>
            <div className="text-center">
              <h2 className="text-xl font-black text-slate-950 serif italic leading-none">{selectedModel.acronym}</h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Session Active</p>
            </div>
            <button onClick={goHome} className="p-3 bg-white text-slate-950 rounded-2xl border-4 border-white shadow-xl active:scale-95 transition-all"><X size={20} /></button>
          </header>

          <div className={`${mainColorClass} text-white px-8 py-6 rounded-[3rem] shadow-2xl border-8 border-white flex items-center justify-between mb-10 transform -rotate-1`}>
            <div className="flex items-center gap-5">
               <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 backdrop-blur-sm shadow-inner">
                 <Heart size={28} fill="currentColor" />
               </div>
               <div>
                 <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-60 mb-0.5">CURRENT TURN</p>
                 <h3 className="text-2xl font-black serif italic leading-none">{speakerName}</h3>
               </div>
            </div>
            <div className="px-5 py-2 bg-white/10 rounded-full border border-white/20 text-[11px] font-black uppercase tracking-widest backdrop-blur-sm">
              Step {currentStepIndex + 1}
            </div>
          </div>

          <div className="w-full bg-white/50 h-3 rounded-full mb-12 overflow-hidden shadow-inner border border-white/40">
            <div className={`h-full transition-all duration-700 ${isP1 ? 'bg-teal-600' : 'bg-rose-600'}`} style={{ width: `${progress}%` }} />
          </div>

          <div className="flex-1 space-y-8">
            <div className="text-center px-4">
              <div className={`w-14 h-14 ${mainColorClass} text-white rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl border-4 border-white`}>
                <span className="text-2xl">{step.emoji}</span>
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">{step.word}</h3>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-10 font-sans tracking-tight">
                {step.question.replace('[Partner]', partnerName)}
              </h1>

              {(currentStepIndex === 0 || step.word === 'Emotional State') && (
                <button 
                  onClick={() => setShowFeelingsWheel(true)} 
                  className={`${isP1 ? 'text-teal-900 border-teal-100 hover:bg-teal-50' : 'text-rose-900 border-rose-100 hover:bg-rose-50'} flex items-center gap-3 bg-white border-2 px-8 py-4 rounded-[2rem] shadow-lg mx-auto text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all mb-10`}
                >
                  <Target size={20} /> Use Feelings Wheel
                </button>
              )}
            </div>

            <div className={`bg-white rounded-[3.5rem] border-8 border-white shadow-2xl p-10 space-y-10 flex flex-col relative overflow-hidden`}>
               <div className="relative">
                 <textarea 
                  ref={textareaRef} 
                  value={textValue} 
                  onChange={(e) => setDualNotes({ ...dualNotes, [currentStepIndex]: { ...currentNotes, [turn]: e.target.value } })} 
                  placeholder={`Write your heart out, ${speakerName}...`} 
                  className={`w-full min-h-[180px] bg-slate-50 rounded-[2rem] p-8 text-slate-900 font-medium text-xl border-4 border-transparent focus:border-slate-100 outline-none resize-none placeholder:text-slate-200 shadow-inner transition-all font-sans`} 
                 />
                 <div className={`absolute bottom-6 right-8 ${isP1 ? 'text-teal-900/10' : 'text-rose-900/10'}`}><MessageCircle size={32} fill="currentColor" /></div>
               </div>
               
               <div className="space-y-6">
                  <div className="flex items-center justify-between px-1">
                    <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${isP1 ? 'text-teal-900/40' : 'text-rose-900/40'}`}>Need a starting point?</p>
                    <Star size={14} className={isP1 ? 'text-teal-200' : 'text-rose-200'} />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {(step.quickThoughts || []).map((p, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleQuickPromptClick(p)} 
                        className={`${isP1 ? 'bg-teal-50/50 text-teal-950 border-teal-100 hover:bg-teal-100' : 'bg-rose-50/50 text-rose-950 border-rose-100 hover:bg-rose-100'} px-6 py-4 rounded-2xl text-[11px] font-bold tracking-tight transition-all border-2 active:scale-95 shadow-sm`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          <div className="mt-12 pb-12">
            <button 
              onClick={handleNextStep} 
              disabled={!textValue.trim()} 
              className={`w-full py-8 text-white rounded-[3rem] font-black text-2xl shadow-2xl flex items-center justify-center gap-5 active:scale-95 disabled:opacity-40 disabled:grayscale transition-all border-8 border-white/20 ${buttonClass}`}
            >
              {isP1 ? `Continue to ${names.p2}` : (currentStepIndex < selectedModel.steps.length - 1 ? 'Save & Next Step' : 'View Session Summary')} 
              <ArrowRight size={28} />
            </button>
            <p className="text-center mt-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Synchronizing with love
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    if (!selectedModel) return null;
    return (
      <div className="max-w-xl mx-auto px-6 py-10 min-h-screen flex flex-col animate-in fade-in duration-1000">
        <header className="flex items-center justify-between mb-12">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-white rounded-2xl border-4 border-white shadow-xl text-rose-600"><CheckCircle2 size={24}/></div>
             <div>
                <h2 className="text-2xl font-black text-slate-950 serif italic leading-none">Session Summary</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Reflection complete</p>
             </div>
           </div>
           <button onClick={goHome} className="p-3 bg-white text-slate-950 rounded-2xl border-4 border-white shadow-xl active:scale-95 transition-all"><X size={20} /></button>
        </header>

        <div className="space-y-10 pb-24">
          {/* 1. Practical Connection Task (TOP - Fun box, light bg, dark text) */}
          <div className="bg-amber-50 rounded-[3.5rem] p-10 shadow-xl border-8 border-white flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-24 h-24 bg-amber-100/50 rounded-full -ml-12 -mt-12 group-hover:scale-110 transition-transform" />
            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-md border-4 border-amber-100">
              <Sparkles size={40} className="text-amber-600" />
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-4 text-amber-900/60">PRACTICAL CONNECTION TASK</h3>
            
            {loadingPrompt ? (
              <div className="flex items-center gap-3 py-6"><RefreshCcw className="animate-spin text-amber-600" /> <p className="text-amber-900/40 text-sm font-black italic">Seeking inspiration...</p></div>
            ) : (
              <p className="text-2xl font-black serif italic text-slate-900 leading-relaxed px-2 mb-8">"{activePracticalPrompt}"</p>
            )}
            
            <button 
              onClick={refreshPracticalPrompt}
              disabled={loadingPrompt}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl border-2 border-amber-100 hover:border-amber-200 transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest text-amber-900 shadow-sm"
            >
              <RefreshCcw size={16} className={loadingPrompt ? 'animate-spin' : ''} /> New Idea?
            </button>
          </div>

          {/* 2. Detailed Responses Summary */}
          <div ref={checkinExportRef} className="bg-white p-10 rounded-[4rem] border-8 border-white shadow-2xl space-y-12">
             <div className="text-center border-b-4 border-slate-50 pb-10">
               <div className="w-16 h-16 bg-slate-950 text-white rounded-[1.8rem] flex items-center justify-center mx-auto mb-4 shadow-xl border-4 border-white">
                  <span className="text-3xl">{selectedModel.emoji}</span>
               </div>
               <h2 className="text-4xl font-black text-slate-950 serif italic mb-3">{selectedModel.acronym}</h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {selectedModel.title}</p>
             </div>
             {selectedModel.steps.map((step, idx) => (
               <div key={idx} className="space-y-6">
                 <div className="flex items-center gap-4"><span className="text-3xl filter grayscale-0">{step.emoji}</span><h4 className="text-[11px] font-black text-slate-950 uppercase tracking-widest border-b-2 border-rose-100 pb-1">{step.word}</h4></div>
                 <div className="grid grid-cols-1 gap-6 ml-10">
                   <div className="space-y-2"><p className="text-[9px] font-black text-teal-900 uppercase tracking-widest opacity-60">{names.p1}</p><p className="text-slate-950 font-black italic text-base leading-relaxed font-sans">{dualNotes[idx]?.p1 || 'Silence'}</p></div>
                   <div className="space-y-2"><p className="text-[9px] font-black text-rose-900 uppercase tracking-widest opacity-60">{names.p2}</p><p className="text-slate-950 font-black italic text-base leading-relaxed font-sans">{dualNotes[idx]?.p2 || 'Silence'}</p></div>
                 </div>
               </div>
             ))}
          </div>

          <div className="grid grid-cols-1 gap-5">
            <button onClick={startAiAnalysis} className="w-full py-8 bg-rose-600 text-white rounded-[2.5rem] font-black text-xl shadow-2xl flex items-center justify-center gap-5 active:scale-95 transition-all border-4 border-white group">
               <BrainCircuit size={28} className="group-hover:rotate-12 transition-transform" /> Deep Dive AI Analysis
            </button>
            <div className="grid grid-cols-1 gap-4">
              <button onClick={() => exportRefToImage(checkinExportRef, 'sync-card')} className="w-full py-5 bg-white text-slate-950 border-4 border-white rounded-[1.8rem] font-black text-base shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"><Download size={20}/> Save Reflection Card</button>
              <button onClick={goHome} className="w-full py-6 bg-slate-100 text-slate-600 rounded-[1.8rem] font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all"><Home size={20}/> Return to Dashboard</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAIInsightView = () => {
    if (!selectedModel) return null;
    return (
      <div className="max-w-xl mx-auto px-6 py-10 min-h-screen flex flex-col animate-in slide-in-from-right duration-700">
        <header className="flex items-center justify-between mb-12">
           <button onClick={() => setCurrentView('summary')} className="p-3 bg-white text-slate-950 rounded-2xl border-4 border-white shadow-xl active:scale-95 transition-all"><ChevronLeft size={20} /></button>
           <h2 className="text-2xl font-black text-slate-950 serif italic leading-none">AI Coach Deep Dive</h2>
           <div className="w-12" />
        </header>

        {loadingInsight ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-12">
            <div className="relative">
              <div className="w-32 h-32 border-[12px] border-rose-100 border-t-rose-600 rounded-full animate-spin shadow-inner" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <BrainCircuit size={48} className="text-rose-600 animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-4">
              <p className="text-3xl font-black text-slate-950 italic serif">Reading between the lines...</p>
              <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em]">Connecting your hearts through AI</p>
            </div>
          </div>
        ) : apiError ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-8 animate-in zoom-in-95">
            <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center border-4 border-rose-100 shadow-xl">
              <AlertCircle size={48} />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-950 serif italic">Sync Interrupted</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{apiError}</p>
            </div>
            <button onClick={startAiAnalysis} className="px-10 py-5 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest active:scale-95 flex items-center gap-3">
              <RefreshCcw size={20} /> Retry Deep Dive
            </button>
          </div>
        ) : (
          <div className="space-y-10 pb-24">
            {insight && (
              <div className="bg-white rounded-[4rem] border-[10px] border-white shadow-2xl p-10 space-y-12 animate-in zoom-in-95 duration-1000">
                <div className="flex items-center gap-6 mb-2">
                  <div className="w-20 h-20 bg-slate-950 text-white rounded-[2.2rem] flex items-center justify-center shadow-2xl transform -rotate-3 border-4 border-white"><Zap size={40} fill="currentColor" /></div>
                  <div><h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">THE OVERALL VIBE</h3><p className="text-3xl font-black text-slate-950 serif italic">{insight.mood}</p></div>
                </div>
                
                <div className="space-y-8">
                  <div className="bg-rose-50/50 p-10 rounded-[3rem] border-4 border-rose-100 shadow-inner relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 text-rose-100"><Heart size={64} fill="currentColor" /></div>
                    <p className="text-[11px] font-black text-rose-950 uppercase tracking-[0.3em] mb-4 opacity-60">HEART WORDS</p>
                    <p className="text-slate-950 font-black italic text-2xl leading-relaxed font-sans relative z-10">"{insight.encouragement}"</p>
                  </div>
                  
                  <div className="bg-teal-50/50 p-10 rounded-[3rem] border-4 border-teal-100 shadow-inner relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 text-teal-100"><Sparkles size={64} fill="currentColor" /></div>
                    <p className="text-[11px] font-black text-teal-950 uppercase tracking-[0.3em] mb-4 opacity-60">GROWTH PATHWAY</p>
                    <p className="text-slate-950 font-black text-xl leading-relaxed font-sans relative z-10">{insight.suggestedFocus}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <button onClick={() => setCurrentView('summary')} className="w-full py-6 bg-white text-slate-950 border-4 border-white rounded-[2rem] font-black text-xl shadow-xl active:scale-95 transition-all">Back to Responses</button>
              <button onClick={goHome} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl shadow-2xl active:scale-95 transition-all">Back to Dashboard</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-teal-50 selection:bg-rose-200 selection:text-slate-950 font-bold text-slate-950" onClick={() => setLogoClicked(false)}>
      {currentView === 'onboarding' && (
        <div className="min-h-screen flex items-center justify-center p-6 bg-white animate-in fade-in duration-700">
          <div className="w-full max-w-sm">
            <div className="w-24 h-24 bg-rose-950 rounded-[2.8rem] flex items-center justify-center text-white mb-10 mx-auto shadow-2xl animate-float"><Heart fill="currentColor" size={40}/></div>
            <h1 className="text-4xl font-black text-slate-950 text-center serif italic mb-3">Couple Connect</h1>
            <p className="text-slate-950 text-center mb-12 text-[10px] font-black opacity-80 uppercase tracking-[0.3em]">Intentional Unity</p>
            <form onSubmit={handleOnboardingSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-950 ml-2 uppercase tracking-widest opacity-60">Partner 1</label>
                <input type="text" required value={names.p1} onChange={e => setNames({...names, p1: e.target.value})} placeholder="Your name" className="w-full bg-slate-50 rounded-[1.8rem] px-8 py-5 font-black text-slate-950 outline-none border-4 border-transparent focus:border-teal-100 transition-all shadow-inner text-lg" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-950 ml-2 uppercase tracking-widest opacity-60">Partner 2</label>
                <input type="text" required value={names.p2} onChange={e => setNames({...names, p2: e.target.value})} placeholder="Beloved's name" className="w-full bg-slate-50 rounded-[1.8rem] px-8 py-5 font-black text-slate-950 outline-none border-4 border-transparent focus:border-rose-100 transition-all shadow-inner text-lg" />
              </div>
              <button type="submit" className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all">Start Journey <ArrowRight size={24}/></button>
            </form>
          </div>
        </div>
      )}
      
      {currentView === 'home' && (
        <div className="max-w-xl mx-auto px-4 pt-6 pb-32 h-screen flex flex-col overflow-hidden">
          {showFTXOverlay && (
            <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-3xl p-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
              <div className="w-24 h-24 bg-white text-slate-950 rounded-[3rem] flex items-center justify-center mb-8 shadow-2xl"><PartyPopper size={48}/></div>
              <h2 className="text-5xl font-black text-white italic serif mb-4">You're Synced!</h2>
              <p className="text-white/70 mb-12 max-w-xs text-sm font-black leading-relaxed">Welcome to your shared space. Grow, laugh, and plan together.</p>
              <button onClick={closeFTX} className="w-full py-7 bg-white text-slate-950 rounded-[2.5rem] font-black text-xl shadow-2xl active:scale-95 transition-all">Enter Rituals</button>
            </div>
          )}

          <header className="flex items-center justify-between mb-8 shrink-0 px-2">
            <div className="flex items-center gap-5">
              <button onClick={(e) => { e.stopPropagation(); setLogoClicked(!logoClicked); }} className={`w-14 h-14 rounded-[1.8rem] flex items-center justify-center shadow-2xl transition-all ${logoClicked ? 'bg-rose-600' : 'bg-slate-950'} text-white border-4 border-white active:scale-95`}>
                <Heart fill="currentColor" size={28} />
              </button>
              {logoClicked && (
                <div className="absolute top-24 left-6 bg-white border-8 border-white rounded-[2.5rem] shadow-2xl p-3 z-50 animate-in zoom-in-95">
                  <button onClick={() => { if(confirm("Clear all rituals?")) { localStorage.clear(); window.location.reload(); } }} className="flex items-center gap-4 text-sm font-black text-slate-950 px-8 py-4 hover:bg-slate-50 rounded-2xl transition-all"><Trash2 size={24} className="text-rose-600" /> Factory Reset</button>
                </div>
              )}
              <div><h1 className="text-2xl serif italic text-slate-950 leading-none">{names.p1} & {names.p2}</h1><p className="text-slate-950 font-black uppercase tracking-widest text-[10px] mt-1 opacity-50">Dashboard</p></div>
            </div>
            <div className="p-3 bg-white text-slate-950 rounded-[1.2rem] border-4 border-white shadow-xl text-[10px] font-black uppercase tracking-widest">Score: {scores.p1 + scores.p2}</div>
          </header>

          <div className="mb-6 px-8 py-4 bg-white border-4 border-white rounded-[2rem] text-center shadow-lg shrink-0 animate-in slide-in-from-top-2">
            <p className="text-slate-950 font-black italic text-[11px] leading-relaxed">"{currentQuote}"</p>
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-10">
            {homeTab === 'checkins' && (
              <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-3 px-2 mb-2">
                   <div className="p-3 bg-rose-100 rounded-2xl text-rose-950 border-2 border-rose-200 shadow-sm"><Heart size={20} fill="currentColor" /></div>
                   <h2 className="text-base font-black text-slate-950 uppercase tracking-[0.2em]">Sync Rituals</h2>
                </div>
                {CHECKIN_MODELS.map(model => (
                  <div key={model.id} className="bg-white rounded-[2.8rem] border-8 border-white shadow-2xl transition-all text-left relative overflow-hidden flex flex-col group">
                    <div className="p-8 flex items-start gap-6">
                      <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center text-4xl bg-slate-50 rounded-2xl border-2 border-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-500">{model.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-2xl font-black text-slate-950 serif italic">{model.title}</h3>
                          <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${model.color} border-2 border-white shadow-sm`}>{model.acronym}</span>
                        </div>
                        <p className="text-[13px] font-black text-slate-950 leading-relaxed mb-6 opacity-60">
                          {model.expanded}
                        </p>
                        <button onClick={() => startCheckIn(model)} className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all text-white border-4 border-white/20 ${model.buttonColor}`}>
                          Start Session <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {homeTab === 'fun' && renderFunZone()}

            {homeTab === 'joy' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-3 px-2 mb-2">
                   <div className="p-3 bg-teal-100 rounded-2xl text-teal-950 border-2 border-teal-200 shadow-sm"><Sparkles size={20} fill="currentColor" /></div>
                   <h2 className="text-base font-black text-slate-950 uppercase tracking-[0.2em]">Joy Planner</h2>
                </div>
                <div className="flex items-center gap-1 p-2 bg-white border-4 border-white rounded-[2.5rem] shadow-xl mb-4">
                   <button onClick={() => setJoySubTab('planner')} className={`flex-1 py-3 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all ${joySubTab === 'planner' ? 'bg-slate-950 text-white shadow-xl' : 'text-slate-950 hover:bg-teal-50'}`}>Planner</button>
                   <button onClick={() => setJoySubTab('summary')} className={`flex-1 py-3 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all ${joySubTab === 'summary' ? 'bg-slate-950 text-white shadow-xl' : 'text-slate-950 hover:bg-teal-50'}`}>Roadmap</button>
                </div>
                {joySubTab === 'planner' ? (
                  <div className="space-y-8 pb-10">
                    {!showSyncPanel ? (
                      <button onClick={() => setShowSyncPanel(true)} className="w-full flex items-center justify-between bg-white p-5 rounded-[2rem] border-8 border-white shadow-2xl group active:scale-95 transition-all shadow-teal-900/5">
                        <div className="flex items-center gap-5"><div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-950 shadow-inner border-2 border-teal-100"><Link2 size={24} /></div><p className="text-[11px] font-black uppercase text-slate-950 tracking-[0.2em]">{joyCode ? `ID: ${joyCode}` : 'Link Partner'}</p></div>
                        <Settings size={24} className="text-slate-200" />
                      </button>
                    ) : (
                      <div className="bg-white p-8 rounded-[2.5rem] border-8 border-teal-50 shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-8"><h4 className="text-[11px] font-black uppercase text-slate-950 tracking-[0.2em]">Partner Sync</h4><button onClick={() => setShowSyncPanel(false)} className="active:scale-95"><X size={32}/></button></div>
                        <input type="text" value={codeEntryInput} onChange={(e) => setCodeEntryInput(e.target.value.toUpperCase())} placeholder="INPUT CODE" className="w-full bg-slate-50 rounded-2xl px-6 py-5 font-black text-center text-2xl tracking-[0.3em] mb-6 outline-none border-4 border-transparent focus:border-teal-200 text-slate-950 shadow-inner" />
                        <div className="grid grid-cols-2 gap-4"><button onClick={() => { if(codeEntryInput.length >= 4) { setJoyCode(codeEntryInput); localStorage.setItem('activeJoyCode', codeEntryInput); setShowSyncPanel(false); }}} className="py-4 bg-slate-950 text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-xl">Connect</button><button onClick={() => { const code = Math.random().toString(36).substring(2, 8).toUpperCase(); setJoyCode(code); localStorage.setItem('activeJoyCode', code); setShowSyncPanel(false); }} className="py-4 bg-slate-100 text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">New</button></div>
                      </div>
                    )}
                    <div className="flex overflow-x-auto gap-3 no-scrollbar pb-2 px-1">{['Daily', 'Weekly', 'Monthly', 'Annually', '5 Years'].map(tf => (<button key={tf} onClick={() => { setJoyTimeframe(tf); }} className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border-4 transition-all shadow-lg shrink-0 ${joyTimeframe === tf ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-950 border-white active:scale-95'}`}>{tf}</button>))}</div>
                    <div className="bg-white rounded-[3rem] shadow-2xl border-[10px] border-white p-8 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-5"><div className="w-16 h-16 bg-teal-50 rounded-[1.8rem] flex items-center justify-center text-teal-950 shadow-inner border-2 border-teal-100"><CalendarPlus size={32} /></div><h2 className="text-xl font-black text-slate-950 serif italic">Sync {joyTimeframe}</h2></div>
                         <button onClick={fetchAIDateIdeas} disabled={loadingDates} className="p-3 bg-slate-950 text-white rounded-2xl shadow-2xl active:scale-95 transition-all">{loadingDates ? <RefreshCcw className="w-6 h-6 animate-spin" /> : <Zap size={24} fill="currentColor" />}</button>
                      </div>
                      <div className="space-y-4">
                        <input type="text" value={joyInput} onChange={e => setJoyInput(e.target.value)} placeholder="What activity?" className="w-full bg-slate-50 rounded-xl px-6 py-4 text-sm font-black border-4 border-transparent focus:border-teal-100 outline-none text-slate-950 shadow-inner" />
                        <input type="text" value={joyWhen} onChange={e => setJoyWhen(e.target.value)} placeholder="Frequency/When?" className="w-full bg-slate-50 rounded-xl px-6 py-4 text-sm font-black border-4 border-transparent focus:border-teal-100 outline-none text-slate-950 shadow-inner" />
                        
                        <div className="space-y-2 pt-2">
                           <p className="text-[9px] font-black uppercase text-slate-950 opacity-40 ml-1">Suggestions for {joyTimeframe}</p>
                           <div className="flex flex-wrap gap-2">
                             {(JOY_SUGGESTIONS[joyTimeframe] || []).map((idea, i) => (
                               <button key={i} onClick={() => setJoyInput(idea)} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-950 rounded-xl text-[9px] font-black transition-all border-2 border-transparent active:scale-95 shadow-sm">{idea}</button>
                             ))}
                           </div>
                        </div>

                        <button onClick={() => addJoyPlan(joyInput, joyWhen)} disabled={!joyInput} className="w-full py-4 bg-teal-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all disabled:opacity-30 mt-4 border-4 border-white/10">Lock Vision</button>
                      </div>
                    </div>
                    <div className="space-y-4">{joyPlans[joyTimeframe].map(p => (<div key={p.id} className="bg-white p-5 rounded-[2rem] shadow-xl border-4 border-white flex items-center justify-between animate-in fade-in slide-in-from-right duration-300"><div><p className="font-black text-slate-950 text-base leading-tight mb-1">{p.activity}</p><p className="text-[9px] text-teal-800 font-black uppercase tracking-widest">{p.timeInfo}</p></div><button onClick={() => removeJoyPlan(p.id)} className="text-slate-200 hover:text-rose-600 p-2 active:scale-95 transition-all"><Trash2 size={20} /></button></div>))}</div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in duration-700 pb-10">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <h2 className="text-2xl font-black text-slate-950 serif italic">Legacy Roadmap</h2>
                      <button onClick={() => exportRefToImage(exportRef, 'roadmap')} disabled={isExporting} className="p-3 bg-white text-slate-950 border-4 border-white rounded-2xl shadow-xl active:scale-95 transition-all">{isExporting ? <RefreshCcw className="w-6 h-6 animate-spin" /> : <Download size={22} />}</button>
                    </div>
                    <div ref={exportRef} className="bg-white p-10 rounded-[3rem] border-8 border-white shadow-2xl">
                      {['Daily', 'Weekly', 'Monthly', 'Annually', '5 Years'].map(tf => (
                        <div key={tf} className="mb-10 last:mb-0 pl-6 border-l-4 border-slate-100">
                          <h3 className="text-[11px] font-black text-slate-950 uppercase tracking-[0.2em] mb-4 opacity-50">{tf} Rhythm</h3>
                          <div className="grid grid-cols-1 gap-3">
                            {joyPlans[tf].length > 0 ? joyPlans[tf].map(p => (
                              <div key={p.id} className="bg-slate-50 p-4 rounded-xl border-2 border-slate-100 shadow-sm">
                                <p className="text-sm font-black text-slate-950">{p.activity}</p>
                                <p className="text-[9px] text-teal-800 font-black uppercase tracking-widest mt-1">{p.timeInfo}</p>
                              </div>
                            )) : <p className="text-xs text-slate-400 font-black italic opacity-40">No vision cast...</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {currentView === 'home' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] max-w-[340px] bg-slate-950 p-1.5 rounded-[2.8rem] flex justify-around items-center shadow-2xl border-4 border-white z-50 shadow-slate-950/40">
          <button onClick={() => setHomeTab('checkins')} className={`p-4 rounded-[2.5rem] transition-all flex-1 flex flex-col items-center justify-center group ${homeTab === 'checkins' ? 'bg-rose-700 text-white shadow-xl' : 'text-white/40 hover:text-white/80'}`}>
            <Heart size={20} fill={homeTab === 'checkins' ? "currentColor" : "none"} />
            <span className="text-[9px] font-black uppercase tracking-widest mt-1">Sync</span>
          </button>
          <button onClick={() => { setHomeTab('fun'); setFunSubView('menu'); }} className={`p-4 rounded-[2.5rem] transition-all flex-1 flex flex-col items-center justify-center group ${homeTab === 'fun' ? 'bg-orange-600 text-white shadow-xl' : 'text-white/40 hover:text-white/80'}`}>
            <PartyPopper size={20} fill={homeTab === 'fun' ? "currentColor" : "none"} />
            <span className="text-[9px] font-black uppercase tracking-widest mt-1">Fun</span>
          </button>
          <button onClick={() => setHomeTab('joy')} className={`p-4 rounded-[2.5rem] transition-all flex-1 flex flex-col items-center justify-center group ${homeTab === 'joy' ? 'bg-teal-600 text-white shadow-xl' : 'text-white/40 hover:text-white/80'}`}>
            <Sparkles size={20} fill={homeTab === 'joy' ? "currentColor" : "none"} />
            <span className="text-[9px] font-black uppercase tracking-widest mt-1">Joy</span>
          </button>
        </div>
      )}

      {currentView === 'checkin' && renderCheckIn()}
      {currentView === 'summary' && renderSummary()}
      {currentView === 'ai-insight' && renderAIInsightView()}
    </div>
  );
}
