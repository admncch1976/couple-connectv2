
import { CheckInModel, FunQuestion, BibleJoke } from './types';

export const LOVE_LANGUAGES = [
  { id: 'words', name: 'Words of Affirmation', emoji: '🗣️', prompt: 'Write a sticky note with 3 things you admire about them and hide it in their bag/car.' },
  { id: 'service', name: 'Acts of Service', emoji: '🧹', prompt: 'Take over one task or chore they usually do (like dishes or trash) for the next 24 hours.' },
  { id: 'gifts', name: 'Receiving Gifts', emoji: '🎁', prompt: 'Pick up their favorite small treat, snack, or a flower on your way home today.' },
  { id: 'time', name: 'Quality Time', emoji: '⏳', prompt: 'Set a 20-minute timer this evening for "No Screens" intentional conversation.' },
  { id: 'touch', name: 'Physical Touch', emoji: '🤝', prompt: 'Give them a long, intentional hug (at least 20 seconds) or offer a foot massage.' }
];

export const JOY_SUGGESTIONS: Record<string, string[]> = {
  'Daily': ['Pray together', '20-min walk', 'Shared dessert', 'Daily long hug', 'Text appreciation', 'Morning coffee talk'],
  'Weekly': ['Date night out', 'Meal planning', 'Board game night', 'Unplugged evening', 'Extended worship'],
  'Monthly': ['Try new cuisine', 'Outdoor adventure', 'Day trip', 'Double date', 'Budget check-in dinner'],
  'Annually': ['Weekend getaway', 'Vision setting retreat', 'Anniversary trip', 'Big project together'],
  '5 Years': ['Major home goal', 'Spiritual pilgrimage', 'Legacy investment', 'Career milestone celebration']
};

export const FUN_DECK: FunQuestion[] = [
  { id: 1, mode: 'light', text: "If our relationship had a movie title, what would it be?" },
  { id: 2, mode: 'light', text: "What’s one habit of mine that secretly makes you smile?" },
  { id: 3, mode: 'light', text: "If we were a Bible-era couple, who would we be?" },
  { id: 4, mode: 'light', text: "What’s the weirdest thing we both enjoy?" },
  { id: 5, mode: 'light', text: "Who apologizes first usually?" },
  { id: 6, mode: 'light', text: "What’s one inside joke only we understand?" },
  { id: 7, mode: 'light', text: "If we had a couple superpower, what would it be?" },
  { id: 8, mode: 'light', text: "What song describes us right now?" }
];

export const LOVE_DUEL_EDITION = [
  {
    question: "My dream vacation looks like...",
    options: ["🏖️ Beach and relaxation", "🏔️ Mountains and nature", "🏙️ Exploring a new city"],
    allowCustom: true
  },
  {
    question: "One thing I really dislike is...",
    options: ["Being rushed", "Loud crowded places", "Last-minute plan changes"],
    allowCustom: true
  },
  {
    question: "My favorite way to spend a free Saturday is...",
    options: ["Staying home and unwinding", "Going out for food or coffee", "Doing something adventurous"],
    allowCustom: true
  },
  {
    question: "I secretly enjoy when you...",
    options: ["Surprise me", "Compliment me", "Plan something thoughtful"],
    allowCustom: true
  },
  {
    question: "If we could book a trip tomorrow, I would choose...",
    options: ["A spiritual retreat", "A romantic getaway", "A fun road trip"],
    allowCustom: true
  }
];

export const EXTENDED_BIBLE_JOKES: BibleJoke[] = [
  { q: "Why didn’t Noah ever go fishing?", a: "Because he only had two worms. 🪱😄" },
  { q: "Why was Moses so good at browsing?", a: "He had the best tablets. 📜" },
  { q: "Why didn’t Jonah trust the ocean?", a: "Because he had been swallowed by peer pressure before. 🐋" },
  { q: "Why did Adam feel lonely?", a: "Because he was incomplete without his better rib. 🦴" },
  { q: "Why did the disciples make terrible secret agents?", a: "Because they were always spreading the Word. 😄" },
  { q: "Why did the Israelites wander 40 years?", a: "Because even Google Maps said “Recalculating…” 🗺️" },
  { q: "Who was the best female financier in the Bible?", a: "Pharaoh's daughter. She went down to the bank of the Nile and drew out a little prophet!" },
  { q: "Why didn't they play cards on the Ark?", a: "Because Noah was standing on the deck!" }
];

export const CHECKIN_MODELS: CheckInModel[] = [
  {
    id: 'care',
    acronym: 'C.A.R.E.',
    title: 'Wellness & Repair',
    expanded: 'Connect • Appreciate • Repair • Encourage',
    emoji: '❤️',
    color: 'bg-rose-100 text-rose-950',
    buttonColor: 'bg-rose-900 hover:bg-rose-950',
    description: 'Framework for deep emotional safety.',
    practicalPrompt: 'Exchange a 20-second hug before the night ends to physically sync your nervous systems.',
    steps: [
      { 
        letter: 'C', word: 'Connect', emoji: '🤝', 
        question: 'How are you feeling emotionally today?',
        quickThoughts: ['Vulnerable', 'Peaceful', 'Anxious', 'Disconnected', 'Overwhelmed', 'Content', 'Lonley', 'Loved']
      },
      { 
        letter: 'A', word: 'Appreciate', emoji: '🌟', 
        question: 'What is one specific thing you appreciated about [Partner] this week?',
        quickThoughts: ['Your patience', 'Helping with chores', 'Listening to me', 'Your steady love', 'Making me laugh', 'Small acts of kindness']
      },
      { 
        letter: 'R', word: 'Repair', emoji: '🩹', 
        question: 'Is there any lingering hurt or tension we should clear up?',
        quickThoughts: ['Feeling unheard', 'A comment that stung', 'Lack of quality time', 'Chore imbalance', 'None - feeling clear']
      },
      { 
        letter: 'E', word: 'Encourage', emoji: '🌻', 
        question: 'What does your heart need most from me in the coming days?',
        quickThoughts: ['A focused date', 'Physical touch', 'Words of affirmation', 'Help with life tasks', 'Grace for my mood']
      }
    ]
  },
  {
    id: 'love',
    acronym: 'L.O.V.E.',
    title: 'Connection & Listening',
    expanded: 'Listen • Observe • Value • Engage',
    emoji: '💛',
    color: 'bg-yellow-100 text-yellow-950',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
    description: 'Focus on feeling deeply valued.',
    practicalPrompt: 'Write one "Thank You" note for a small thing your partner did today and leave it where they can find it tomorrow morning.',
    steps: [
      { 
        letter: 'L', word: 'Listen', emoji: '👂', 
        question: 'What has been the most difficult thing for you to share lately?',
        quickThoughts: ['A hidden fear', 'Stress at work', 'Personal struggle', 'Relationship worry', 'A big dream']
      },
      { 
        letter: 'O', word: 'Observe', emoji: '👁️', 
        question: 'What beauty or growth have you seen in yourself or us recently?',
        quickThoughts: ['Better communication', 'Resilience', 'New shared hobby', 'Spiritual depth', 'Healthier habits']
      },
      { 
        letter: 'V', word: 'Value', emoji: '💎', 
        question: 'When did you feel most valued or seen by me this week?',
        quickThoughts: ['That long conversation', 'When you stood up for me', 'The surprise coffee', 'A quiet moment together']
      },
      { 
        letter: 'E', word: 'Engage', emoji: '🗓️', 
        question: 'What is one fun or deep way we can engage with each other tomorrow?',
        quickThoughts: ['Cooking together', 'Prayer walk', 'Late night talk', 'Board games', 'Dreaming of the future']
      }
    ]
  },
  {
    id: 'peace',
    acronym: 'P.E.A.C.E.',
    title: 'Spiritual Unity',
    expanded: 'Prayer • Emotional State • Appreciation • Conflict • Encouragement',
    emoji: '🕊️',
    color: 'bg-cyan-100 text-cyan-950',
    buttonColor: 'bg-cyan-900 hover:bg-cyan-950',
    description: 'Pray and bless each other truthfully.',
    practicalPrompt: 'Select a Bible verse together and commit to memorizing or reflecting on it as a couple this week.',
    steps: [
      { letter: 'P', word: 'Prayer', emoji: '🙏', question: 'How can I specifically be praying for you this week?', quickThoughts: ['Clarity in work', 'Emotional strength', 'Physical healing', 'Patience with kids', 'Spiritual growth'] },
      { letter: 'E', word: 'Emotional State', emoji: '🎭', question: 'What "weather" is your soul experiencing right now?', quickThoughts: ['Stormy/Restless', 'Sunny/Joyful', 'Foggy/Uncertain', 'Quiet/Restful', 'Dry/Thirsty'] },
      { letter: 'A', word: 'Appreciation', emoji: '🎁', question: 'Where have you seen God’s grace through [Partner] lately?', quickThoughts: ['Your gentle spirit', 'Faithfulness', 'How you serve us', 'Your integrity', 'Your prayers'] },
      { letter: 'C', word: 'Conflict', emoji: '⚖️', question: 'Is there anything blocking the peace in our home right now?', quickThoughts: ['Unmet expectations', 'Financial stress', 'Communication gaps', 'Nothing - at peace'] },
      { letter: 'E', word: 'Encouragement', emoji: '🗣️', question: 'What word of life do you want to speak over our future?', quickThoughts: ['"God is for us"', '"We are a team"', '"Rest is coming"', '"Joy is our portion"'] }
    ]
  }
];

export const FEELINGS_DATA = {
  Happy: {
    color: 'bg-yellow-400 text-black',
    emoji: '😊',
    secondary: {
      Playful: ['Cheeky', 'Free'],
      Content: ['Joyful', 'Satisfied'],
      Interested: ['Curious', 'Inquisitive'],
      Proud: ['Successful', 'Confident'],
      Accepted: ['Respected', 'Valued'],
      Powerful: ['Courageous', 'Creative'],
      Peaceful: ['Loving', 'Thankful'],
      Trusting: ['Sensitive', 'Intimate'],
      Optimistic: ['Hopeful', 'Inspired']
    }
  },
  Sad: {
    color: 'bg-blue-400 text-black',
    emoji: '😢',
    secondary: {
      Lonely: ['Isolated', 'Abandoned'],
      Vulnerable: ['Fragile', 'Victimized'],
      Despairing: ['Heartbroken', 'Powerless'],
      Guilty: ['Remorseful', 'Ashamed'],
      Depressed: ['Empty', 'Inferior'],
      Hurt: ['Embarrassed', 'Disappointed']
    }
  },
  Angry: {
    color: 'bg-red-500 text-white',
    emoji: '😠',
    secondary: {
      'Let down': ['Betrayed', 'Resentful'],
      Humiliated: ['Disrespected', 'Ridiculed'],
      Bitter: ['Indignant', 'Violated'],
      Mad: ['Furious', 'Jealous'],
      Aggressive: ['Provoked', 'Hostile'],
      Frustrated: ['Infuriated', 'Annoyed'],
      Distant: ['Withdrawn', 'Numb'],
      Critical: ['Skeptical', 'Dismissive']
    }
  },
  Fearful: {
    color: 'bg-orange-500 text-white',
    emoji: '😨',
    secondary: {
      Scared: ['Helpless', 'Frightened'],
      Anxious: ['Overwhelmed', 'Worried'],
      Insecure: ['Inadequate', 'Inferior'],
      Weak: ['Worthless', 'Insignificant'],
      Rejected: ['Excluded', 'Persecuted'],
      Threatened: ['Nervous', 'Exposed']
    }
  },
  Disgusted: {
    color: 'bg-emerald-500 text-white',
    emoji: '🤢',
    secondary: {
      Repelled: ['Hesitant', 'Nauseated'],
      Awful: ['Terrible', 'Detestable'],
      Disappointed: ['Revolted', 'Appalled'],
      Disapproving: ['Judgmental', 'Embarrassed']
    }
  },
  Surprised: {
    color: 'bg-purple-500 text-white',
    emoji: '😲',
    secondary: {
      Startled: ['Shocked', 'Dismayed'],
      Confused: ['Disillusioned', 'Perplexed'],
      Amazed: ['Astonished', 'Awestruck'],
      Excited: ['Eager', 'Energetic']
    }
  },
  Bad: {
    color: 'bg-slate-500 text-white',
    emoji: '😑',
    secondary: {
      Bored: ['Indifferent', 'Apathetic'],
      Busy: ['Pressured', 'Rushed'],
      Stressed: ['Overwhelmed', 'Out of control'],
      Tired: ['Sleepy', 'Unfocussed']
    }
  }
};
