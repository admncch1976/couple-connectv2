
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
  Link2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { View, HomeTab, CheckInModel, JoyPlan, Turn, AIInsight, DateIdea, PartnerNames, DualReflection } from './types';
import { CHECKIN_MODELS, JOY_SUGGESTIONS, FEELINGS_DATA } from './constants';
import { geminiService } from './geminiService';

const MARRIAGE_QUOTES = [
  "Communication is the fuel that keeps the fire of your relationship burning. Without it, your relationship goes cold.",
  "The goal in marriage is not to think alike, but to think together.",
  "A good marriage is the union of two good forgivers.",
  "In the middle of every difficulty lies opportunity for deeper connection.",
  "Your words are the bricks that build the home your heart lives in.",
  "Marriage is less about finding the right person and more about being the right person.",
  "The greatest weakness of most humans is their hesitancy to tell others how much they love them while they are still alive."
];

const BIBLE_JOKES = [
  { q: "Who was the best female financier in the Bible?", a: "Pharaoh's daughter. She went down to the bank of the Nile and drew out a little prophet!" },
  { q: "Why didn't they play cards on the Ark?", a: "Because Noah was standing on the deck!" },
  { q: "Who was the greatest financier in the Bible?", a: "Noah. He was floating his stock while everyone else was in liquidation!" },
  { q: "What kind of man was Boaz before he married Ruth?", a: "Ruthless!" },
  { q: "Why couldn't Jonah trust the ocean?", a: "Because he knew there was something fishy about it!" }
];

const PRACTICAL_TASKS = [
  { id: 'smile', icon: <Smile className="text-pink-400" />, text: "Look into each other's eyes, smile, and say 'I love you'." },
  { id: 'dish', icon: <Utensils className="text-orange-400" />, text: "Commit to making a favorite dish for each other this week." },
  { id: 'song', icon: <Music className="text-purple-400" />, text: "Pick a song that represents 'us' and sing it together right now." },
  { id: 'jokes', icon: <Laugh className="text-yellow-400" />, text: "Tell jokes to each other until the other person can't help but laugh." },
  { id: 'hug', icon: <HeartHandshake className="text-rose-400" />, text: "Give each other a lingering 30-second hug without saying a word." },
  { id: 'handshake', icon: <Handshake className="text-blue-400" />, text: "Create a secret 3-step handshake that only the two of you know." },
  { id: 'coffee', icon: <Coffee className="text-amber-600" />, text: "Make a surprise cup of tea or coffee for your partner exactly how they like it." },
  { id: 'breaths', icon: <Wind className="text-cyan-400" />, text: "Take 5 deep synchronised breaths together to align your nervous systems." },
  { id: 'whisper', icon: <Mic2 className="text-indigo-400" />, text: "Whisper one secret compliment in your partner's ear that you've never said before." },
  { id: 'poem', icon: <Brush className="text-green-400" />, text: "Write a two-line poem for each other on a scrap of paper or a napkin." },
  { id: 'massage', icon: <Moon className="text-slate-500" />, text: "Give each other a 1-minute back or neck massage to release today's tension." },
  { id: 'memory', icon: <Star className="text-yellow-500" />, text: "Share a specific memory of a time you felt deeply proud of your partner." },
  { id: 'forehead', icon: <Dna className="text-pink-500" />, text: "Stand forehead-to-forehead for one minute and breathe in silence." }
];

export default function App() {
  const [currentView, setCurrentView] = useState<View | 'post-onboarding-choice' | 'walkthrough'>(() => {
    const savedNames = localStorage.getItem('partnerNames');
    return savedNames ? 'home' : 'onboarding';
  });
  const [homeTab, setHomeTab] = useState<HomeTab>('checkins');
  const [isFirstTime, setIsFirstTime] = useState(() => !localStorage.getItem('hasSeenWalkthrough'));
  const exportRef = useRef<HTMLDivElement>(null);
  const checkinExportRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
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

  const [logoClicked, setLogoClicked] = useState(false);

  // Feelings Wheel State
  const [wheelPath, setWheelPath] = useState<string[]>([]);
  const [isZooming, setIsZooming] = useState(false);
  const [hasPickedEmotion, setHasPickedEmotion] = useState(false);

  // Practical Task & Jokes State
  const [currentTaskIndex, setCurrentTaskIndex] = useState(() => Math.floor(Math.random() * PRACTICAL_TASKS.length));
  const [isShufflingTask, setIsShufflingTask] = useState(false);
  const [currentBibleJokeIndex, setCurrentBibleJokeIndex] = useState(0);
  const [jokeScores, setJokeScores] = useState({ p1: 0, p2: 0 });
  const [showJokeAnswer, setShowJokeAnswer] = useState(false);

  const currentQuote = useMemo(() => {
    return MARRIAGE_QUOTES[Math.floor(Math.random() * MARRIAGE_QUOTES.length)];
  }, []);

  const shuffledPrompts = useMemo(() => {
    if (!selectedModel) return [];
    const step = selectedModel.steps[currentStepIndex];
    const source = (step.quickThoughts && step.quickThoughts.length > 0) 
      ? step.quickThoughts 
      : ["Feeling peaceful", "A bit stressed", "Grateful", "Ready to listen"];
    
    return [...source].sort(() => Math.random() - 0.5).slice(0, 8);
  }, [selectedModel, currentStepIndex, turn]);

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
    if (names.p1 && names.p2) {
      setCurrentView('post-onboarding-choice');
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLogoClicked(!logoClicked);
  };

  const dismissWalkthrough = () => {
    localStorage.setItem('hasSeenWalkthrough', 'true');
    setIsFirstTime(false);
    setCurrentView('home');
  };

  const startCheckIn = (model: CheckInModel) => {
    setSelectedModel(model);
    setCurrentStepIndex(0);
    setDualNotes({});
    setTurn('p1');
    setInsight(null);
    setWheelPath([]);
    setHasPickedEmotion(false);
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
          (Object.entries(dualNotes) as unknown as [number, DualReflection][]).forEach(([idx, note]) => {
            flatNotes[idx] = `${names.p1}: ${note.p1}. ${names.p2}: ${note.p2}.`;
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

  const handleQuickPromptClick = (text: string) => {
    const currentNotes = dualNotes[currentStepIndex] || { p1: '', p2: '' };
    const existing = currentNotes[turn];
    const updated = existing ? `${existing} ${text}` : text;
    setDualNotes({ ...dualNotes, [currentStepIndex]: { ...currentNotes, [turn]: updated } });
    textareaRef.current?.focus();
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

  const shuffleTask = () => {
    setIsShufflingTask(true);
    setTimeout(() => {
      let nextIndex = Math.floor(Math.random() * PRACTICAL_TASKS.length);
      while (nextIndex === currentTaskIndex && PRACTICAL_TASKS.length > 1) {
        nextIndex = Math.floor(Math.random() * PRACTICAL_TASKS.length);
      }
      setCurrentTaskIndex(nextIndex);
      setCurrentBibleJokeIndex(0);
      setJokeScores({ p1: 0, p2: 0 });
      setShowJokeAnswer(false);
      setIsShufflingTask(false);
    }, 300);
  };

  const renderFeelingsWheel = () => {
    const currentDepth = wheelPath.length;
    let options: string[] = [];
    let title = hasPickedEmotion ? "Select any other dominant emotion?" : "Choose a core feeling";
    let instruction = hasPickedEmotion ? "You can keep selecting or use the Next button to move on." : "Select the most accurate category below to begin.";
    let categoryColor = turn === 'p1' ? 'bg-teal-700' : 'bg-pink-500';

    if (currentDepth === 0) {
      options = Object.keys(FEELINGS_DATA);
    } else if (currentDepth === 1) {
      const core = wheelPath[0] as keyof typeof FEELINGS_DATA;
      options = Object.keys(FEELINGS_DATA[core].secondary);
      title = `${core}`;
      instruction = "Narrow it down. Which one resonates most?";
      categoryColor = FEELINGS_DATA[core].color;
    } else if (currentDepth === 2) {
      const core = wheelPath[0] as keyof typeof FEELINGS_DATA;
      const secondary = wheelPath[1] as string;
      options = (FEELINGS_DATA[core].secondary as any)[secondary];
      title = `${secondary}`;
      instruction = "Final choice. Pick the exact emotion.";
      categoryColor = FEELINGS_DATA[core].color;
    }

    const handleSelect = (opt: string) => {
      setIsZooming(true);
      setTimeout(() => {
        if (currentDepth < 2) {
          setWheelPath([...wheelPath, opt]);
        } else {
          const finalEmotion = `Feeling ${opt} (${wheelPath.join(' > ')})`;
          handleQuickPromptClick(finalEmotion);
          setWheelPath([]); // Reset to core for multi-selection
          setHasPickedEmotion(true);
        }
        setIsZooming(false);
      }, 200);
    };

    return (
      <div className="relative mb-8 overflow-hidden">
        <div className="flex flex-col items-center mb-6 text-center px-4">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1 leading-relaxed">{instruction}</p>
           <h3 className="text-xl font-black text-white flex items-center gap-2 flex-wrap justify-center">
             {currentDepth > 0 && <span className="opacity-40">{wheelPath.join(' → ')}</span>}
             {title}
           </h3>
           {currentDepth > 0 && (
             <button 
              onClick={() => setWheelPath(wheelPath.slice(0, -1))}
              className="mt-2 text-[10px] font-black text-white/40 hover:text-white flex items-center gap-1 transition-all"
             >
               <ChevronLeft size={12} /> Go back one level
             </button>
           )}
        </div>
        
        {/* Circular Hub Layout */}
        <div className={`relative flex items-center justify-center min-h-[320px] transition-all duration-300 transform ${isZooming ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}>
           <div className="absolute w-64 h-64 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm animate-soft-pulse" />
           
           <div className="relative w-full max-w-sm flex flex-wrap justify-center items-center gap-2 p-6">
              {options.map((opt, i) => {
                const colors = FEELINGS_DATA[opt as keyof typeof FEELINGS_DATA]?.color || categoryColor;
                return (
                  <button
                    key={`${currentDepth}-${opt}`}
                    onClick={() => handleSelect(opt)}
                    className={`px-5 py-3 rounded-[2rem] text-xs font-black transition-all active:scale-90 border border-white/10 shadow-xl ${colors} text-white hover:scale-105 hover:brightness-110 animate-in zoom-in-50 duration-300`}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {opt}
                  </button>
                );
              })}
           </div>
        </div>

        {currentDepth > 0 && (
          <div className="mt-4 flex justify-center animate-in fade-in slide-in-from-top-2">
            <button 
              onClick={() => { handleQuickPromptClick(`Feeling ${wheelPath[wheelPath.length-1]}`); setWheelPath([]); setHasPickedEmotion(true); }}
              className="px-6 py-2.5 bg-white/10 border border-white/10 rounded-full text-[11px] font-black text-white hover:bg-white/20 transition-all flex items-center gap-2"
            >
              Choose "{wheelPath[wheelPath.length-1]}" <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderOnboarding = () => (
    <div className="max-w-md mx-auto px-4 py-16 flex flex-col min-h-screen">
      <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="w-20 h-20 bg-pink-100 text-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-100 animate-float">
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
          <div className="flex justify-center text-pink-200"><Users size={24} className="animate-float-delayed" /></div>
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

  const renderPostOnboardingChoice = () => (
    <div className="max-w-md mx-auto px-4 py-20 flex flex-col justify-center min-h-screen animate-in fade-in zoom-in-95 duration-500">
      <h2 className="text-3xl serif italic text-teal-900 text-center mb-10">Welcome, {names.p1} & {names.p2}!</h2>
      <div className="space-y-6">
        <button 
          onClick={() => { setHomeTab('checkins'); setCurrentView(isFirstTime ? 'walkthrough' : 'home'); }}
          className="w-full p-8 bg-white border-2 border-pink-100 rounded-[2.5rem] text-left hover:border-pink-500 transition-all group shadow-xl"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-pink-100 text-pink-600 rounded-2xl group-hover:bg-pink-600 group-hover:text-white transition-all"><Heart size={28} className="group-hover:animate-float" /></div>
            <h3 className="text-2xl font-black text-teal-900">Start Heart Sync</h3>
          </div>
          <p className="text-slate-500 font-medium leading-relaxed">Structured frameworks for emotional connection and AI-powered relationship coaching.</p>
        </button>

        <button 
          onClick={() => { setHomeTab('joy'); setCurrentView(isFirstTime ? 'walkthrough' : 'home'); }}
          className="w-full p-8 bg-white border-2 border-teal-100 rounded-[2.5rem] text-left hover:border-teal-900 transition-all group shadow-xl"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-teal-100 text-teal-600 rounded-2xl group-hover:bg-teal-900 group-hover:text-white transition-all"><Sparkles size={28} className="group-hover:animate-float-delayed" /></div>
            <h3 className="text-2xl font-black text-teal-900">Open Joy Planner</h3>
          </div>
          <p className="text-slate-500 font-medium leading-relaxed">Map out shared dreams and habits with your partner.</p>
        </button>

        <div className="text-center pt-8">
          <button onClick={() => setCurrentView('walkthrough')} className="text-teal-600 font-black uppercase tracking-widest text-xs flex items-center gap-2 mx-auto hover:gap-4 transition-all">
            <Info size={16} /> How it works
          </button>
        </div>
      </div>
    </div>
  );

  const renderWalkthrough = () => (
    <div className="max-w-md mx-auto px-4 py-16 flex flex-col items-center min-h-screen animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white/80 backdrop-blur-xl border border-teal-100 rounded-[3rem] p-10 shadow-2xl relative">
        <button onClick={dismissWalkthrough} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-all"><X size={24} /></button>
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-teal-900 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl animate-float"><Sparkles size={36} /></div>
          <h2 className="text-3xl font-black text-teal-900">Simple Connections</h2>
          <p className="text-slate-500 font-medium mt-2">Intentional tools for your marriage.</p>
        </div>
        
        <div className="space-y-10">
          <div className="flex gap-5">
            <div className="shrink-0 w-12 h-12 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Heart size={24} fill="currentColor" className="animate-soft-pulse" />
            </div>
            <div>
              <h4 className="font-black text-teal-900 mb-1 text-lg">Heart Sync</h4>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">Ask questions honestly to each other. Choose from different formats to keep your conversations deep and fresh.</p>
            </div>
          </div>
          
          <div className="flex gap-5">
            <div className="shrink-0 w-12 h-12 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Calendar size={24} className="animate-float-delayed" />
            </div>
            <div>
              <h4 className="font-black text-teal-900 mb-1 text-lg">Joy Planner</h4>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">Plan together with a unique **Joy Code** that connects you both. Create healthy rhythms for dates, chores, and shared dreams.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={dismissWalkthrough}
          className="w-full mt-14 py-5 bg-teal-900 text-white rounded-[2rem] font-black text-xl hover:bg-black transition-all shadow-xl active:scale-95"
        >
          Let's Go
        </button>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="max-w-xl mx-auto px-4 pt-8 pb-32">
      {!isFirstTime && (
        <div className="mb-10 px-6 py-4 bg-white/60 backdrop-blur-sm border border-teal-100 rounded-2xl text-center shadow-sm animate-in fade-in slide-in-from-top-4 duration-1000">
          <p className="text-teal-900 font-medium italic text-sm leading-relaxed">"{currentQuote}"</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-teal-400 mt-2">— Marriage Wisdom</p>
        </div>
      )}

      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4 relative">
          <button 
            onClick={handleLogoClick}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all transform active:scale-95 ${logoClicked ? 'bg-pink-500' : 'bg-teal-900'} text-white hover:opacity-90 animate-soft-pulse`}
          >
            <Heart fill="currentColor" size={28} />
          </button>
          
          {logoClicked && (
            <div className="absolute top-16 left-0 bg-white border border-teal-100 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
              <button 
                onClick={() => { setCurrentView('post-onboarding-choice'); setLogoClicked(false); }}
                className="flex items-center gap-2 text-sm font-black text-teal-900 whitespace-nowrap px-2 py-1 hover:text-pink-600 transition-all"
              >
                <ChevronLeft size={16} /> Change Mode
              </button>
            </div>
          )}
          
          <div>
            <h1 className="text-3xl serif italic text-teal-900 leading-tight">{names.p1} & {names.p2}</h1>
            <p className="text-teal-500 font-bold uppercase tracking-widest text-[10px]">Relationship Dashboard</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => setCurrentView('walkthrough')} className="p-3 text-slate-400 hover:text-teal-600 transition-colors" title="Guide"><Info size={20} /></button>
          <button onClick={() => setCurrentView('onboarding')} className="p-3 text-slate-400 hover:text-teal-600 transition-colors" title="Settings"><UserPlus size={20} /></button>
          <button onClick={() => { if(confirm("Clear data and start over?")) { localStorage.clear(); window.location.reload(); } }} className="p-3 text-slate-400 hover:text-red-500 transition-colors" title="Reset"><Trash2 size={20} /></button>
        </div>
      </header>

      {homeTab === 'checkins' ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="p-2 bg-pink-100 rounded-lg text-pink-600"><Heart size={20} fill="currentColor" className="animate-float" /></div>
            <h2 className="text-xl font-black text-teal-900 tracking-tight">Heart Sync</h2>
          </div>
          <div className="grid grid-cols-1 gap-8">
            {CHECKIN_MODELS.map(model => {
              const isPromoted = ['care', 'love'].includes(model.id);
              return (
                <button key={model.id} onClick={() => startCheckIn(model)} className={`group relative text-left transition-all overflow-hidden ${isPromoted ? 'bg-gradient-to-br from-white to-pink-50 p-10 rounded-[3rem] border-4 border-pink-900 shadow-[0_25px_60px_rgba(236,72,153,0.18)] scale-[1.02] hover:scale-[1.05]' : 'bg-white p-8 rounded-[2.5rem] border border-pink-100 shadow-xl shadow-pink-900/5 hover:scale-[1.02]'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-6 py-2 rounded-full text-[14px] font-black uppercase tracking-[0.2em] shadow-md border-b-4 ${isPromoted ? 'bg-pink-900 text-pink-50 border-pink-950 scale-110' : model.color + ' border-pink-200'}`}>
                      {model.acronym}
                    </div>
                    <div className={`${isPromoted ? 'text-6xl' : 'text-4xl'} drop-shadow-sm group-hover:animate-float`}>{model.emoji}</div>
                  </div>
                  <h3 className={`${isPromoted ? 'text-4xl' : 'text-2xl'} font-black text-teal-900 mb-2 tracking-tight`}>{model.title}</h3>
                  <p className={`${isPromoted ? 'text-lg' : 'text-slate-500'} font-medium mb-4 leading-relaxed opacity-80`}>{model.description}</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {model.steps.map((s, i) => (
                      <span key={i} className="text-[10px] font-black bg-pink-50 text-pink-700 px-3 py-1.5 rounded-xl border border-pink-100 flex items-center gap-1 shadow-sm">
                        <span className="text-teal-500 font-black">{s.letter}</span> {s.word}
                      </span>
                    ))}
                  </div>
                  <div className={`flex items-center gap-2 ${isPromoted ? 'text-pink-900 text-xl' : 'text-pink-700'} font-black`}>Start Sync <ChevronRight size={isPromoted ? 28 : 18} className="group-hover:translate-x-2 transition-transform" /></div>
                  {isPromoted && <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Heart size={160} fill="currentColor" className="text-pink-900" /></div>}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="p-2 bg-teal-100 rounded-lg text-teal-600"><Sparkles size={20} fill="currentColor" className="animate-float-delayed" /></div>
            <h2 className="text-xl font-black text-teal-900 tracking-tight">Joy Planner</h2>
          </div>
          <div className="flex items-center gap-2 p-1 bg-white border border-teal-100 rounded-2xl shadow-sm mb-4">
            <button onClick={() => setJoySubTab('planner')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all ${joySubTab === 'planner' ? 'bg-teal-900 text-white shadow-lg' : 'text-teal-600 hover:bg-teal-50'}`}><Plus size={18} /> Planner</button>
            <button onClick={() => setJoySubTab('summary')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all ${joySubTab === 'summary' ? 'bg-teal-600 text-white shadow-lg' : 'text-teal-600 hover:bg-teal-50'}`}><Map size={18} /> Our Roadmap</button>
          </div>
          {joySubTab === 'planner' ? renderJoyPlanner() : renderOverallJoySummary()}
        </div>
      )}
    </div>
  );

  const renderOverallJoySummary = () => {
    const hasPlans = (Object.values(joyPlans) as JoyPlan[][]).some(arr => arr.length > 0);
    return (
      <div className="animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-white rounded-[3rem] shadow-2xl border-4 border-teal-900 p-10 mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4"><div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shadow-inner"><Layers size={28} className="animate-float" /></div><div><h2 className="text-3xl font-black text-teal-900 tracking-tight">Our Joy Tapestry</h2><p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Shared Roadmap</p></div></div>
            <button onClick={() => exportRefToImage(exportRef, `Roadmap-${joyCode}`)} disabled={isExporting} className="p-4 bg-teal-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl disabled:opacity-50"><Download size={24} /></button>
          </div>
          {!hasPlans ? (
            <div className="text-center py-20 border-4 border-dashed border-teal-50 rounded-[2.5rem]"><div className="text-5xl mb-4 animate-float">🛶</div><p className="text-teal-900 font-black text-xl mb-2">Our map is still blank!</p></div>
          ) : (
            <div className="space-y-12">
              {(Object.entries(joyPlans) as [string, JoyPlan[]][]).map(([tf, plans]) => plans.length > 0 && (
                <div key={tf} className="relative pl-8 border-l-4 border-teal-50 pb-4">
                  <div className="absolute -left-[10px] top-0 w-4 h-4 rounded-full bg-teal-500 border-4 border-white shadow-sm" />
                  <h3 className="text-xl font-black text-teal-900 uppercase tracking-tighter mb-6">{tf} Goals</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plans.map(p => (
                      <div key={p.id} className="bg-teal-50/50 p-6 rounded-[1.5rem] border border-teal-100 hover:bg-white transition-all group">
                        <div className="flex items-start justify-between"><div><p className="font-black text-teal-900">{p.activity}</p>{p.timeInfo && <p className="text-xs text-teal-500 font-bold mt-1 flex items-center gap-1"><Clock size={12} /> {p.timeInfo}</p>}</div><button onClick={() => removeJoyPlan(p.id, tf)} className="p-2 text-teal-100 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></div>
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

  const renderJoyPlanner = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8 px-2 bg-teal-100/50 p-4 rounded-3xl border border-teal-100 shadow-sm">
        <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-900 shadow-sm animate-float"><Key size={18} /></div><div><p className="text-[10px] font-black uppercase text-teal-500 tracking-widest">Active Joy Code</p><p className="text-lg font-black text-teal-900 tracking-[0.1em]">{joyCode || 'No Code Set'}</p></div></div>
        <button onClick={handleLogoutCode} className="p-2 text-teal-400 hover:text-red-500 transition-colors font-bold flex items-center gap-1 text-xs">{joyCode ? 'Switch' : 'Set Code'} <LogOut size={16} /></button>
      </div>
      {!isCodeVerified ? (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-teal-100 text-center animate-in zoom-in-95">
             <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><Key size={32} className="animate-float" /></div>
             <h3 className="text-2xl font-black text-teal-900 mb-4">Set Your Shared Joy Code</h3>
             <div className="space-y-4">
                <input type="text" value={codeEntryInput} onChange={(e) => setCodeEntryInput(e.target.value.toUpperCase())} placeholder="ENTER CODE" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-center font-black text-2xl tracking-[0.2em] text-teal-900 focus:outline-none focus:border-teal-500 transition-all"/>
                <button onClick={handleVerifyCode} disabled={codeEntryInput.length < 4} className="w-full py-4 bg-teal-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl disabled:opacity-50">Join Room</button>
                <button onClick={handleGenerateCode} className="w-full py-4 bg-white text-teal-900 border-2 border-teal-100 rounded-2xl font-black text-lg hover:bg-teal-50 transition-all flex items-center justify-center gap-3"><RefreshCw size={20} /> Generate New</button>
             </div>
          </div>
          
          <div className="bg-teal-900 text-white p-8 rounded-[2.5rem] shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-4">
             <div className="flex items-center gap-3 mb-4">
               <Info size={24} className="text-teal-400" />
               <h4 className="font-black text-xl">What is a Joy Code?</h4>
             </div>
             <ul className="space-y-4">
               <li className="flex gap-4 items-start">
                 <div className="shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Link2 size={16} className="text-teal-400" /></div>
                 <p className="text-sm font-medium leading-relaxed">It's a simple, unique code that **connects both of you** in this digital space.</p>
               </li>
               <li className="flex gap-4 items-start">
                 <div className="shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Zap size={16} className="text-teal-400" /></div>
                 <p className="text-sm font-medium leading-relaxed">By using the same code, you can **plan together** and see each other's updates in real-time.</p>
               </li>
               <li className="flex gap-4 items-start">
                 <div className="shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Sparkles size={16} className="text-teal-400" /></div>
                 <p className="text-sm font-medium leading-relaxed">Codes are **random and unique** to your partnership—your private roadmap.</p>
               </li>
             </ul>
          </div>
        </div>
      ) : (
        <>
          <div className="flex overflow-x-auto gap-3 no-scrollbar pb-4">
            {['Daily', 'Weekly', 'Monthly', 'Annually', '5 Years'].map(tf => (
              <button key={tf} onClick={() => { setJoyTimeframe(tf); setAiDateSuggestions([]); }} className={`px-6 py-2.5 rounded-2xl whitespace-nowrap text-sm font-bold transition-all border shadow-sm ${joyTimeframe === tf ? 'bg-teal-900 text-white border-teal-950' : 'bg-white text-slate-500 border-teal-100 hover:bg-teal-50'}`}>{tf}</button>
            ))}
          </div>
          
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-teal-100 p-8 mb-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600">
                  <Sparkles size={24} className="animate-float" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-teal-900 tracking-tight">Plan {joyTimeframe} Joy</h2>
                </div>
              </div>
              <button onClick={fetchAIDateIdeas} disabled={loadingDates} className="p-3 bg-teal-50 text-teal-700 rounded-2xl hover:bg-teal-100 transition-all disabled:opacity-50">
                {loadingDates ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap size={20} fill="currentColor" />}
              </button>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input type="text" value={joyInput} onChange={(e) => setJoyInput(e.target.value)} placeholder="Activity (e.g. Prayer Walk)" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 pl-12 text-slate-700 focus:outline-none focus:ring-4 focus:ring-teal-100 transition-all font-medium" />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                </div>
                <div className="relative">
                  <input type="text" value={joyWhen} onChange={(e) => setJoyWhen(e.target.value)} placeholder="Time/Date/Year" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 pl-12 text-slate-700 focus:outline-none focus:ring-4 focus:ring-teal-100 transition-all font-medium" />
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                </div>
              </div>
              <button onClick={() => addJoyPlan(joyInput, joyWhen)} disabled={!joyInput} className="w-full py-4 rounded-2xl font-extrabold text-white bg-teal-800 hover:bg-teal-900 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2 text-lg">
                <Plus size={22} /> Add to Plan
              </button>
            </div>

            {/* Structured Ideas Section - Mix n Match */}
            <div className="mb-4">
               <p className="text-[10px] font-black text-teal-400 uppercase tracking-[0.2em] mb-4">Biblical & Cultural Ideas</p>
               <div className="grid grid-cols-2 gap-4">
                  {/* Activities Column */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase text-teal-900 opacity-30 mb-1 ml-1">Activities</p>
                    <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-1.5 p-1">
                       {JOY_SUGGESTIONS[joyTimeframe]?.activities.map((act, idx) => (
                         <button 
                            key={idx} 
                            onClick={() => setJoyInput(act)}
                            className={`w-full text-left p-2.5 rounded-xl border text-[11px] font-bold transition-all active:scale-95 ${joyInput === act ? 'bg-teal-900 text-white border-teal-950 shadow-md' : 'bg-white text-teal-900 border-teal-50 hover:border-pink-200 hover:bg-pink-50/30'}`}
                         >
                           {act}
                         </button>
                       ))}
                    </div>
                  </div>

                  {/* Times Column */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase text-teal-900 opacity-30 mb-1 ml-1">Suggested Times</p>
                    <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-1.5 p-1">
                       {JOY_SUGGESTIONS[joyTimeframe]?.times.map((time, idx) => (
                         <button 
                            key={idx} 
                            onClick={() => setJoyWhen(time)}
                            className={`w-full text-left p-2.5 rounded-xl border text-[11px] font-medium italic transition-all active:scale-95 ${joyWhen === time ? 'bg-pink-600 text-white border-pink-700 shadow-md' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-teal-200 hover:bg-teal-50/30'}`}
                         >
                           {time}
                         </button>
                       ))}
                    </div>
                  </div>
               </div>
            </div>

            {aiDateSuggestions.length > 0 && (
              <div className="mb-8 p-6 bg-teal-50/50 rounded-[2rem] border border-teal-100 animate-in fade-in zoom-in-95 mt-8">
                <p className="text-[10px] font-black text-teal-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Zap size={14} fill="currentColor" /> AI Date Ideas</p>
                <div className="grid grid-cols-1 gap-4">
                  {aiDateSuggestions.map((idea, idx) => (
                    <button key={idx} onClick={() => { setJoyInput(idea.title); setJoyWhen('Special Date'); }} className="bg-white p-5 rounded-2xl text-left border border-teal-100 hover:shadow-md transition-all group">
                      <p className="font-bold text-teal-900 mb-1 group-hover:text-teal-600">{idea.title}</p><p className="text-xs text-slate-500 leading-relaxed mb-1">{idea.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {joyPlans[joyTimeframe].map(plan => (
              <div key={plan.id} className="bg-white p-5 rounded-3xl shadow-sm border border-teal-100 flex items-center justify-between hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 group-hover:bg-teal-900 group-hover:text-white transition-all">
                    <CheckCircle size={20} className="animate-soft-pulse" />
                  </div>
                  <div>
                    <p className="font-bold text-teal-900 text-lg">{plan.activity}</p>
                    {plan.timeInfo && <p className="text-sm text-teal-500 font-bold mt-0.5">{plan.timeInfo}</p>}
                  </div>
                </div>
                <button onClick={() => removeJoyPlan(plan.id)} className="text-slate-200 hover:text-red-500 transition-all p-3 hover:bg-red-50 rounded-2xl">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderCheckIn = () => {
    if (!selectedModel) return null;
    const step = selectedModel.steps[currentStepIndex];
    const progress = (((currentStepIndex * 2) + (turn === 'p1' ? 1 : 2)) / (selectedModel.steps.length * 2)) * 100;
    const currentName = turn === 'p1' ? names.p1 : names.p2;
    const currentQuestion = step.question.replace('[Name]', currentName);
    
    // Partner 1 = Teal Theme, Partner 2 = Pink Theme
    const cardClasses = turn === 'p1' ? 'bg-teal-900 border-teal-800' : 'bg-pink-600 border-pink-500';
    const iconBg = turn === 'p1' ? 'bg-teal-800/50' : 'bg-pink-700/50';
    const accentColor = turn === 'p1' ? 'teal' : 'pink';
    const isLastAction = turn === 'p2' && currentStepIndex === selectedModel.steps.length - 1;

    const isEmotionalQuestion = currentQuestion.toLowerCase().includes('emotionally') || 
                               currentQuestion.toLowerCase().includes('soul') || 
                               currentQuestion.toLowerCase().includes('feeling — really');

    const currentNoteText = dualNotes[currentStepIndex]?.[turn] || '';
    const isNoteEntered = currentNoteText.trim().length > 0;

    return (
      <div className="max-w-xl mx-auto px-4 py-6 flex flex-col min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <button onClick={handlePrevStep} className={`p-2.5 bg-white text-${accentColor}-600 rounded-xl border border-${accentColor}-100 shadow-sm flex items-center gap-1 font-bold text-xs`}>
            <ChevronLeft size={16} /> Back
          </button>
          <div className="text-center">
            <p className={`text-[9px] font-black uppercase tracking-widest text-${accentColor}-900/40`}>{selectedModel.acronym} Heart Sync</p>
            <p className={`text-[10px] font-black text-${accentColor}-500`}>Step {currentStepIndex + 1} of {selectedModel.steps.length}</p>
          </div>
          <button onClick={goHome} className={`p-2.5 bg-white text-${accentColor}-400 rounded-xl border border-${accentColor}-100 shadow-sm`}><Home size={18} /></button>
        </div>

        <div className={`w-full h-1.5 bg-${accentColor}-100 rounded-full mb-8 overflow-hidden`}>
          <div className={`h-full bg-gradient-to-r from-${accentColor}-500 to-${accentColor}-400 transition-all duration-700`} style={{ width: `${progress}%` }} />
        </div>

        <div className="flex-1 flex flex-col">
          <div 
            key={`${currentStepIndex}-${turn}`}
            className={`rounded-[2.5rem] shadow-2xl p-8 flex flex-col border-4 transition-all duration-500 overflow-hidden relative animate-in fade-in slide-in-from-bottom-10 duration-500 ${cardClasses}`}
          >
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
               <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${turn === 'p1' ? 'bg-teal-400 text-teal-900' : 'bg-pink-200 text-pink-900'}`}>{currentName.charAt(0)}</div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 leading-none">Listening to</p>
                    <p className="text-base font-black text-white">{currentName}</p>
                  </div>
               </div>
               <button 
                  onClick={handleNextStep} 
                  className={`px-6 py-2.5 rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 border text-xs ${isNoteEntered ? 'bg-white text-teal-900 border-white scale-105 shadow-white/20' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
               >
                {isLastAction ? 'Finish' : 'Next'} <ArrowRight size={14} className={isNoteEntered ? 'translate-x-1' : ''} />
               </button>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black text-white shadow-lg ${iconBg} animate-float`}>{step.letter}</div>
                   <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">{step.word}</h2>
                </div>
                {isEmotionalQuestion && (
                  <button 
                    onClick={() => { setWheelPath([]); setHasPickedEmotion(false); }} 
                    className="p-2 bg-white/10 rounded-full text-white/40 hover:text-white transition-all"
                    title="Reset Wheel"
                  >
                    <RefreshCcw size={16} />
                  </button>
                )}
              </div>
              
              <div className="mb-6">
                <p className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight text-left italic">"{currentQuestion}"</p>
              </div>

              {isEmotionalQuestion ? renderFeelingsWheel() : (
                <div className="mb-6">
                   <div className="flex flex-wrap gap-2">
                      {shuffledPrompts.map((p, idx) => (
                        <button key={idx} onClick={() => handleQuickPromptClick(p)} className="px-3 py-1.5 bg-white/5 hover:bg-white/15 border border-white/5 rounded-xl text-white text-[10px] font-bold transition-all whitespace-nowrap active:scale-95">
                          {p}
                        </button>
                      ))}
                   </div>
                </div>
              )}

              <div className="text-left mt-auto flex-1 flex flex-col gap-6">
                <textarea 
                  ref={textareaRef}
                  value={currentNoteText} 
                  onChange={(e) => { 
                    const currentNotes = dualNotes[currentStepIndex] || { p1: '', p2: '' }; 
                    setDualNotes({ ...dualNotes, [currentStepIndex]: { ...currentNotes, [turn]: e.target.value } }); 
                  }} 
                  placeholder={`Speak from your heart, ${currentName}... or share more details here.`} 
                  className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all resize-none min-h-[160px] h-full font-medium text-sm leading-relaxed"
                />

                <button 
                  onClick={handleNextStep} 
                  className={`w-full py-5 rounded-3xl font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-3 shadow-2xl ${isNoteEntered ? 'bg-white text-teal-900 scale-[1.02] shadow-white/10' : 'bg-white/10 text-white/50 border-2 border-white/5 hover:bg-white/15'}`}
                >
                  {isLastAction ? 'Finalize Sync' : 'Go to Next Step'} <ArrowRight size={22} className={isNoteEntered ? 'translate-x-1 animate-soft-pulse' : ''} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    if (!selectedModel) return null;
    const task = PRACTICAL_TASKS[currentTaskIndex];
    const isJokeTask = task.id === 'jokes';

    const handleJokeScore = (target: 'p1' | 'p2') => {
      setJokeScores(prev => ({ ...prev, [target]: prev[target] + 1 }));
    };

    const nextJoke = () => {
      setCurrentBibleJokeIndex((prev) => (prev + 1) % BIBLE_JOKES.length);
      setShowJokeAnswer(false);
    };

    return (
      <div className="max-w-xl mx-auto px-4 py-12 pb-32">
        <div className="flex items-center justify-between mb-10"><button onClick={goHome} className="p-3 bg-white text-pink-500 rounded-2xl border border-pink-100 shadow-sm"><Home size={22} className="animate-float" /></button><h2 className="text-2xl font-black text-teal-900 tracking-tight">Sync Summary</h2><div className="flex gap-2">
          <button onClick={() => exportRefToImage(checkinExportRef, `CheckIn-${selectedModel.acronym}`)} disabled={isExporting} className="p-3 bg-pink-900 text-white rounded-2xl hover:bg-black transition-all shadow-lg disabled:opacity-50"><Download size={20} /></button>
          <button onClick={copySummary} className="p-3 bg-white text-pink-500 rounded-2xl border border-pink-100 shadow-sm">{copied ? <CheckCircle size={20} className="text-green-500 animate-soft-pulse" /> : <Copy size={20} />}</button>
        </div></div>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Practical Love Task Section */}
          <div className="bg-white rounded-[3rem] p-10 border-4 border-pink-50 shadow-xl overflow-hidden relative">
            <div className="absolute -right-8 -top-8 p-12 text-pink-100 opacity-20 transform rotate-12"><Sparkles size={120} fill="currentColor" /></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-100 text-pink-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                <Zap size={14} fill="currentColor" /> Practical Connection Task
              </div>
              <h3 className="text-3xl serif italic text-teal-900 mb-8">Ready to act on your love?</h3>
              
              <div className={`flex flex-col items-center gap-6 transition-all duration-300 ${isShufflingTask ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}>
                <div className="w-20 h-20 rounded-3xl bg-pink-50 border-2 border-pink-100 flex items-center justify-center shadow-inner animate-float">
                  {React.cloneElement(task.icon as React.ReactElement, { size: 40 })}
                </div>
                <p className="text-xl text-teal-900 font-bold leading-relaxed max-w-sm">"{task.text}"</p>
                
                {/* Conditional Jokes UI */}
                {isJokeTask && (
                  <div className="w-full bg-yellow-50/50 border-2 border-yellow-100 rounded-[2.5rem] p-8 mt-4 animate-in zoom-in-95">
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <Laugh size={24} className="text-yellow-600 animate-soft-pulse" />
                      <h4 className="font-black text-yellow-800 text-lg">Crack Each Other Up</h4>
                    </div>
                    
                    <div className="mb-8 p-6 bg-white rounded-3xl shadow-sm min-h-[140px] flex flex-col justify-center border border-yellow-100">
                      <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-2">Bible Joke #{currentBibleJokeIndex + 1}</p>
                      <p className="text-lg font-bold text-teal-900 mb-4 leading-tight">{BIBLE_JOKES[currentBibleJokeIndex].q}</p>
                      
                      {showJokeAnswer ? (
                         <p className="text-lg font-black italic text-pink-600 animate-in fade-in slide-in-from-top-2">{BIBLE_JOKES[currentBibleJokeIndex].a}</p>
                      ) : (
                         <button 
                            onClick={() => setShowJokeAnswer(true)}
                            className="text-xs font-black text-yellow-600 uppercase tracking-widest hover:text-yellow-700 underline underline-offset-4"
                          >
                           Show the Punchline
                         </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <button onClick={() => handleJokeScore('p1')} className="p-4 bg-teal-900 text-white rounded-2xl shadow-lg active:scale-95 transition-all">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Smile size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{names.p1} Laughed!</span>
                        </div>
                        <p className="text-2xl font-black">{jokeScores.p1}</p>
                      </button>
                      <button onClick={() => handleJokeScore('p2')} className="p-4 bg-pink-600 text-white rounded-2xl shadow-lg active:scale-95 transition-all">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Smile size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{names.p2} Laughed!</span>
                        </div>
                        <p className="text-2xl font-black">{jokeScores.p2}</p>
                      </button>
                    </div>

                    <button 
                      onClick={nextJoke}
                      className="w-full py-4 bg-white border-2 border-yellow-200 text-yellow-700 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-yellow-100 transition-all mb-4 shadow-sm"
                    >
                      <ChevronRightCircle size={20} /> Next Bible Joke
                    </button>

                    <div className="pt-4 border-t border-yellow-100">
                       <div className="flex items-center justify-center gap-2">
                         <Trophy size={16} className="text-yellow-600" />
                         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-yellow-600">Laughter Leaderboard</span>
                       </div>
                       <p className="text-xs font-bold text-yellow-800 mt-1">
                         {jokeScores.p1 > jokeScores.p2 ? `${names.p1} is winning!` : jokeScores.p2 > jokeScores.p1 ? `${names.p2} is winning!` : "It's a giggle draw!"}
                       </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 w-full">
                  <button 
                    onClick={shuffleTask}
                    className="flex items-center justify-center gap-2 py-3 px-6 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all active:scale-95"
                  >
                    <RefreshCw size={16} className={isShufflingTask ? 'animate-spin' : ''} /> Try another task
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loadingInsight ? (
            <div className="bg-white rounded-[3rem] p-12 text-center shadow-xl border border-pink-100"><div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-float"><RefreshCw size={40} className="text-pink-500 animate-spin" /></div><h3 className="text-2xl font-black text-teal-900 mb-2">Generating Insights...</h3></div>
          ) : insight && (
            <div className="bg-gradient-to-br from-pink-900 to-pink-800 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden"><div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles size={120} fill="currentColor" className="animate-float" /></div><div className="relative z-10"><div className="flex items-center gap-3 mb-6"><div className="px-3 py-1 bg-pink-400 text-pink-900 rounded-full text-[10px] font-black uppercase tracking-widest">AI Insight</div><div className="flex-1 h-px bg-white/20" /></div><div className="mb-8"><p className="text-pink-400 font-black uppercase tracking-widest text-xs mb-2">Overall Mood</p><h3 className="text-3xl serif italic font-bold leading-tight">"{insight.mood}"</h3></div><div className="mb-8"><p className="text-pink-400 font-black uppercase tracking-widest text-xs mb-2">Encouragement</p><p className="text-xl font-medium leading-relaxed opacity-90">{insight.encouragement}</p></div><div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10"><p className="text-pink-300 font-black uppercase tracking-widest text-[10px] mb-3">Focus for Growth</p><p className="text-lg font-bold flex items-start gap-3 italic"><Star size={24} className="text-teal-400 shrink-0 mt-1 animate-soft-pulse" fill="currentColor" />{insight.suggestedFocus}</p></div></div></div>
          )}
          <div className="space-y-6">
             {selectedModel.steps.map((step, idx) => (
               <div key={idx} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-pink-50">
                 <div className="flex items-center gap-4 mb-6"><div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl ${selectedModel.buttonColor.split(' ')[0]} animate-float`}>{step.letter}</div><div><h4 className="font-black text-teal-900">{step.word}</h4></div></div>
                 <div className="space-y-4">
                   <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100"><p className="text-[10px] font-black text-teal-500 uppercase mb-2 tracking-widest">{names.p1}'s Reflection</p><p className="text-slate-700 italic font-medium leading-relaxed">"{dualNotes[idx]?.p1 || 'No reflection'}"</p></div>
                   <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100"><p className="text-[10px] font-black text-pink-500 uppercase mb-2 tracking-widest">{names.p2}'s Reflection</p><p className="text-slate-700 italic font-medium leading-relaxed">"{dualNotes[idx]?.p2 || 'No reflection'}"</p></div>
                 </div>
               </div>
             ))}
          </div>
          <button onClick={goHome} className="w-full py-6 bg-teal-900 text-white rounded-[2.5rem] font-black text-xl hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3">Complete & Go Home <ArrowRight size={24} /></button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-teal-50 selection:bg-pink-100 selection:text-teal-900" onClick={() => { setLogoClicked(false); }}>
      {currentView === 'onboarding' && renderOnboarding()}
      {currentView === 'post-onboarding-choice' && renderPostOnboardingChoice()}
      {currentView === 'walkthrough' && renderWalkthrough()}
      {currentView === 'home' && renderHome()}
      {currentView === 'checkin' && renderCheckIn()}
      {currentView === 'summary' && renderSummary()}
      
      {currentView === 'home' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-xs bg-slate-900/95 backdrop-blur-xl p-2 rounded-full flex justify-around items-center shadow-2xl border border-white/20 z-50">
          <button 
            onClick={() => setHomeTab('checkins')} 
            className={`p-3 rounded-full transition-all flex-1 flex flex-col items-center justify-center gap-1 group ${homeTab === 'checkins' ? 'bg-pink-600 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
          >
            <Heart size={20} fill={homeTab === 'checkins' ? "currentColor" : "none"} className={homeTab === 'checkins' ? 'animate-float' : 'group-hover:animate-soft-pulse'} />
            <span className="text-[9px] font-black uppercase tracking-widest">Sync</span>
          </button>
          <button 
            onClick={() => setHomeTab('joy')} 
            className={`p-3 rounded-full transition-all flex-1 flex flex-col items-center justify-center gap-1 group ${homeTab === 'joy' ? 'bg-teal-600 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
          >
            <Sparkles size={20} fill={homeTab === 'joy' ? "currentColor" : "none"} className={homeTab === 'joy' ? 'animate-float-delayed' : 'group-hover:animate-soft-pulse'} />
            <span className="text-[9px] font-black uppercase tracking-widest">Planner</span>
          </button>
        </div>
      )}

      {/* Hidden Export Refs */}
      <div className="fixed -left-[10000px] top-0 pointer-events-none">
        <div ref={exportRef} className="export-container w-[1000px] bg-teal-50 p-20 rounded-[4rem]">
           <h1 className="text-6xl serif italic text-teal-900 mb-8">Couple-Connect Roadmap</h1>
           <p className="text-2xl text-teal-600 mb-10">{names.p1} & {names.p2}</p>
        </div>
        <div ref={checkinExportRef} className="export-container w-[1000px] p-24 bg-white rounded-[5rem]">
           <h1 className="text-8xl serif italic text-teal-900 mb-6">Heart Sync Report</h1>
        </div>
      </div>
    </div>
  );
}
