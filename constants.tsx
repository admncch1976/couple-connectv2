import { CheckInModel, FunQuestion, BibleJoke } from './types';

export const LOVE_LANGUAGES = [
  { id: 'words', name: 'Words of Affirmation', emoji: '🗣️', prompt: 'Write a sticky note with 3 things you admire about them and hide it in their bag/car.' },
  { id: 'service', name: 'Acts of Service', emoji: '🧹', prompt: 'Take over one task or chore they usually do (like dishes or trash) for the next 24 hours.' },
  { id: 'gifts', name: 'Receiving Gifts', emoji: '🎁', prompt: 'Pick up their favorite small treat, snack, or a flower on your way home today.' },
  { id: 'time', name: 'Quality Time', emoji: '⏳', prompt: 'Set a 20-minute timer this evening for "No Screens" intentional conversation.' },
  { id: 'touch', name: 'Physical Touch', emoji: '🤝', prompt: 'Give them a long, intentional hug (at least 20 seconds) or offer a foot massage.' }
];

export const FUN_DECK: FunQuestion[] = [
  // Light Mode
  { id: 1, mode: 'light', text: "If our relationship had a movie title, what would it be?" },
  { id: 2, mode: 'light', text: "What’s one habit of mine that secretly makes you smile?" },
  { id: 3, mode: 'light', text: "If we were a Bible-era couple, who would we be?" },
  { id: 4, mode: 'light', text: "What’s the weirdest thing we both enjoy?" },
  { id: 5, mode: 'light', text: "Who apologizes first usually?" },
  { id: 6, mode: 'light', text: "What’s one inside joke only we understand?" },
  { id: 7, mode: 'light', text: "If we had a couple superpower, what would it be?" },
  { id: 8, mode: 'light', text: "What song describes us right now?" },
  // Deep Mode
  { id: 101, mode: 'deep', text: "When do you feel most connected to me?" },
  { id: 102, mode: 'deep', text: "What small thing I do makes you feel valued?" },
  { id: 103, mode: 'deep', text: "What’s one dream we haven’t spoken about yet?" },
  { id: 104, mode: 'deep', text: "When do you feel most supported by me?" },
  { id: 105, mode: 'deep', text: "What do you think God is building in us right now?" }
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

export const QUIZ_QUESTIONS = [
  "What is my comfort food?",
  "What stresses me the most?",
  "My dream vacation?",
  "What makes me feel most loved?",
  "What is my hidden fear?",
  "What’s my favorite worship song?",
  "If I had a free day, what would I do?"
];

export const CHECKIN_MODELS: CheckInModel[] = [
  {
    id: 'care',
    acronym: 'C.A.R.E.',
    title: 'Wellness & Repair',
    expanded: 'Connect • Appreciate • Repair • Encourage',
    emoji: '❤️',
    color: 'bg-rose-100 text-rose-900',
    buttonColor: 'bg-rose-900 hover:bg-rose-950 shadow-rose-200',
    description: 'Framework for deep emotional safety.',
    steps: [
      { 
        letter: 'C', word: 'Connect', emoji: '🤝', 
        question: '[Speaker], how are you feeling emotionally — truthfully?',
        quickThoughts: ['Feeling alone together', 'Spiritually dry/empty', 'Deeply at peace', 'Overwhelmed by life', 'Resentment building', 'Vulnerable & needing grace', 'Disconnected from us', 'Quietly struggling']
      },
      { 
        letter: 'A', word: 'Appreciate', emoji: '🌟', 
        question: '[Speaker], what is one specific thing you appreciated about [Partner]?',
        quickThoughts: ['How you handled my mood', 'Your patience with me', 'Small chores you took on', 'Not giving up on me', 'Your listening heart', 'Your prayer for us', 'How you prioritize me', 'Your steady presence']
      },
      { 
        letter: 'R', word: 'Repair', emoji: '🩹', 
        question: '[Speaker], is there a lingering hurt or tension with [Partner] to clear up?',
        quickThoughts: ['A comment that stung', 'Feeling unappreciated', 'My own reactive tone', 'Financial anxiety/stress', 'Lack of physical touch', 'Unmet chore expectations', 'Feeling unheard recently', 'Completely clear & happy']
      },
      { 
        letter: 'E', word: 'Encourage', emoji: '🌻', 
        question: '[Speaker], what does your heart need from [Partner] this week?',
        quickThoughts: ['Just to be held in silence', 'Words of affirmation', 'Help with mental load', 'A focused date night', 'Pray with me tonight', 'A small surprise/treat', 'Tell me you are proud', 'Space to just be myself']
      }
    ]
  },
  {
    id: 'love',
    acronym: 'L.O.V.E.',
    title: 'Connection & Listening',
    expanded: 'Listen • Observe • Value • Engage',
    emoji: '💛',
    color: 'bg-yellow-100 text-yellow-900',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700 shadow-yellow-200',
    description: 'Focus on feeling deeply valued.',
    steps: [
      { 
        letter: 'L', word: 'Listen', emoji: '👂', 
        question: '[Speaker], what is a "secret fear" or dream you want to share with [Partner]?',
        quickThoughts: ['Fear of being a burden', 'A dream I felt silly about', 'Stress about our future', 'Past wound resurfacing', 'Gospel-centered hope', 'Feeling stuck in a rut']
      },
      { 
        letter: 'O', word: 'Observe', emoji: '👁️', 
        question: '[Speaker], looking inward, what has been weighing on your soul?',
        quickThoughts: ['Strong & resilient', 'Fragile & easily triggered', 'Content with simplicity', 'Restless & searching', 'Surrounded by grace', 'Exhausted by the hustle']
      },
      { 
        letter: 'V', word: 'Value', emoji: '💎', 
        question: '[Speaker], which Love Language from [Partner] do you crave most right now?',
        quickThoughts: ['Words: "I see you"', 'Service: "Let me help"', 'Gifts: "I thought of you"', 'Time: "No distractions"', 'Touch: "I am here"', 'Deep eye contact']
      },
      { 
        letter: 'E', word: 'Engage', emoji: '🗓️', 
        question: '[Speaker], what is one intentional way you and [Partner] can reunite this week?',
        quickThoughts: ['A slow prayer walk', 'Cooking a meal together', 'Reading a book out loud', 'Unplugged movie night', 'Visit a new local spot', 'A whole night of rest']
      }
    ]
  },
  {
    id: 'peace',
    acronym: 'P.E.A.C.E.',
    title: 'Spiritual Unity',
    expanded: 'Prayer • Emotional State • Appreciation • Conflict • Encouragement',
    emoji: '🕊️',
    color: 'bg-cyan-100 text-cyan-900',
    buttonColor: 'bg-cyan-900 hover:bg-cyan-950 shadow-cyan-200',
    description: 'Pray and bless each other truthfully.',
    steps: [
      { letter: 'P', word: 'Prayer', emoji: '🙏', question: '[Speaker], what is the deepest prayer request on your heart for [Partner] to hold?', quickThoughts: ['Clarity in my calling', 'Healing for a hidden hurt', 'Strength for my weakness', 'Provision for a specific need', 'Peace over my anxiety', 'A hunger for the Word'] },
      { letter: 'E', word: 'Emotional State', emoji: '🎭', question: '[Speaker], describe your spiritual "weather" today.', quickThoughts: ['Mountaintop/Joyful', 'In the Valley/Dark', 'Thirsting for Living Water', 'Waiting/Season of Silence', 'Resting in His Grace', 'Tired of the Battle'] },
      { letter: 'A', word: 'Appreciation', emoji: '🎁', question: '[Speaker], how did you see God working through [Partner] this week?', quickThoughts: ['Your gentle response', 'How you sacrificialy love', 'The way you serve our home', 'Your consistency in prayer', 'Your integrity at work', 'Your kindness to others'] },
      { letter: 'C', word: 'Conflict', emoji: '⚖️', question: '[Speaker], is there any "root of bitterness" with [Partner] we need to pull out together?', quickThoughts: ['Comparison with others', 'Small irritations building', 'Feeling unheard/dismissed', 'A misunderstanding of intent', 'Need to align our hearts', 'Completely at peace'] },
      { letter: 'E', word: 'Encouragement', emoji: '🗣️', question: '[Speaker], what blessing or scripture truth can you speak over [Partner]?', quickThoughts: ['"God is for you"', '"I am so proud of you"', '"You are chosen & loved"', '"Your labor is not in vain"', '"I see Christ in you"', '"Rest is your portion"'] }
    ]
  }
];

export interface JoySuggestionSet {
  activities: string[];
  times: string[];
}

export const JOY_SUGGESTIONS: Record<string, JoySuggestionSet> = {
  'Daily': {
    activities: ['Morning Devos ☕', 'Slow Grace Walk 🚶‍♂️', 'Evening Prayer 🌙', 'Reading Together 📖', 'Affirmation Swap ✨', 'Shared Journaling 📝', 'Unplugged Table 🍽️', 'Intercessory Texts 📲', 'Worship Session 🎶', 'Kudumba Prarthana 🙏', 'Quiet Meditation 🧘', 'Daily Grace Check-in 🗣️'],
    times: ['Sunrise / 6 AM', 'Before the Hustle', 'Mid-Morning Break', 'Afternoon Refresh', 'Sundown / 6:30 PM', 'Post-Dinner Unwind', 'Bedtime Ritual', '10 Minutes of Silence', 'During Commute']
  },
  'Weekly': {
    activities: ['Sunday Service ⛪', 'Life Group Hang 🤝', 'Coffee Theology Date ☕', 'Unplugged Sabbath 📵', 'Missional Service 🎁', 'Couples Bible Study 📜', 'Nature Hike 🌳', 'Marriage Podcast 🎧', 'Friday Fast 🤲', 'Neighbor Blessing 🏡', 'Washing Feet 🌊', 'Worship Night 🎸'],
    times: ['Every Sunday', 'Mid-Week Reset', 'Friday Evening', 'Saturday Sabbath', 'Weekend Morning', 'Tuesday Life Group', 'Thursday Outreach', 'Every 7 Days']
  },
  'Monthly': {
    activities: ['Mentor Brunch 👥', 'Full Day Silence 🤫', 'Weekend Getaway 🏖️', 'Vision & Budget 💰', 'Mercy Ministry 🏥', 'Gospel Feast 🍽️', 'Spiritual Workshop 🏫', 'Legacy Letters ✉️', 'Church Pilgrimage 🏛️', 'Creative Art Date 🎨', 'Couples Communion 🍷', 'Prayer Vigil 🌙'],
    times: ['1st Saturday', 'Payday Vision Meet', 'Last Sunday', 'Monthly Anniversary', 'Every 15th', 'Full Moon Walk', 'Quarterly Reflection']
  },
  'Annually': {
    activities: ['3-Day Retreat 🏔️', 'Mission Field Trip ✈️', 'Vow Renewal 💍', 'Regional Conference 🏟️', 'Spiritual Audit 📝', 'Neighborhood Agape 🍗', 'Advent Journey 🕯️', 'Theology Course 🎓', 'Family Camp ⛺', 'Stewardship Goal 📈', 'Christmas Caroling 🎄', 'Easter Sunrise Worship 🌅'],
    times: ['January Reset', 'Lenten Season', 'Resurrection Sunday', 'Monsoon Retreat', 'Wedding Anniversary', 'Advent Season', 'End-of-Year Thanksgiving']
  },
  '5 Years': {
    activities: ['Global Mission Field 🗺️', 'Missional Habit 🚀', 'Kingdom Savings 💎', 'Church Sponsoring 🏗️', 'Legacy Mentoring 📜', 'Theology Cert 🎓', 'Couples Ministry 👫', 'Building Our Bethel 🏠', 'Bible Translation 🌍', 'Community Lead 🎖️', 'Heritage Fund 🏦'],
    times: ['By Year 2', 'Target: Year 3', 'Completion: Year 5', 'Next Decade Goal', 'Five-Year Milestone', 'Future Legacy Date']
  }
};

export const FEELINGS_DATA = {
  Happy: {
    color: 'bg-yellow-400',
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
    color: 'bg-blue-400',
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
    color: 'bg-red-400',
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
    color: 'bg-orange-400',
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
    color: 'bg-green-400',
    secondary: {
      Repelled: ['Hesitant', 'Nauseated'],
      Awful: ['Terrible', 'Detestable'],
      Disappointed: ['Revolted', 'Appalled'],
      Disapproving: ['Judgmental', 'Embarrassed']
    }
  },
  Surprised: {
    color: 'bg-purple-400',
    secondary: {
      Startled: ['Shocked', 'Dismayed'],
      Confused: ['Disillusioned', 'Perplexed'],
      Amazed: ['Astonished', 'Awestruck'],
      Excited: ['Eager', 'Energetic']
    }
  },
  Bad: {
    color: 'bg-slate-400',
    secondary: {
      Bored: ['Indifferent', 'Apathetic'],
      Busy: ['Pressured', 'Rushed'],
      Stressed: ['Overwhelmed', 'Out of control'],
      Tired: ['Sleepy', 'Unfocussed']
    }
  }
};