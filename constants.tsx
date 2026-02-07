
import { CheckInModel } from './types';

export const LOVE_LANGUAGES = [
  { id: 'words', name: 'Words of Affirmation', emoji: '🗣️', prompt: 'Write a sticky note with 3 things you admire about them and hide it in their bag/car.' },
  { id: 'service', name: 'Acts of Service', emoji: '🧹', prompt: 'Take over one task or chore they usually do (like dishes or trash) for the next 24 hours.' },
  { id: 'gifts', name: 'Receiving Gifts', emoji: '🎁', prompt: 'Pick up their favorite small treat, snack, or a flower on your way home today.' },
  { id: 'time', name: 'Quality Time', emoji: '⏳', prompt: 'Set a 20-minute timer this evening for "No Screens" intentional conversation.' },
  { id: 'touch', name: 'Physical Touch', emoji: '🤝', prompt: 'Give them a long, intentional hug (at least 20 seconds) or offer a foot massage.' }
];

export const CHECKIN_MODELS: CheckInModel[] = [
  {
    id: 'care',
    acronym: 'C.A.R.E.',
    title: 'Daily Wellness & Repair',
    emoji: '❤️',
    color: 'bg-pink-100 text-pink-700',
    buttonColor: 'bg-pink-500 hover:bg-pink-600 shadow-pink-200',
    description: 'A gentle structure for emotional safety and practical support.',
    steps: [
      { 
        letter: 'C', word: 'Connect', emoji: '🤝', 
        question: 'How are you emotionally this week, [Name]?',
        quickThoughts: [
          'Feeling a deep sense of peace', 
          'Overwhelmed but trusting', 
          'Spiritually dry lately', 
          'Ready for some quiet rest', 
          'Energetic and kingdom-focused', 
          'Vulnerable and needing grace',
          'Feeling the weight of world news',
          'Joyful in our current season',
          'A bit disconnected from myself',
          'Rested and recharged'
        ]
      },
      { 
        letter: 'A', word: 'Appreciate', emoji: '🌟', 
        question: 'What is one thing you appreciated about me, [Name]?',
        quickThoughts: [
          'Your prayerful heart', 
          'The way you lead our home', 
          'Your patience during my stress', 
          'How you serve the church', 
          'Your infectious laughter', 
          'The small chores you handled',
          'Your words of affirmation',
          'How you listen without judging',
          'Your consistency in devotions',
          'Your support of my dreams'
        ]
      },
      { 
        letter: 'R', word: 'Repair', emoji: '🩹', 
        question: 'Is there anything that needs clearing up between us, [Name]?',
        quickThoughts: [
          'All clear and at peace', 
          'My tone of voice earlier', 
          'Feeling a bit neglected', 
          'Unmet expectations on chores', 
          'Misunderstanding about plans', 
          'Need to discuss our budget',
          'Lingering hurt from a comment',
          'Lack of quality time recently',
          'Need more emotional safety',
          'Ready to forgive and move on'
        ]
      },
      { 
        letter: 'E', word: 'Encourage', emoji: '🌻', 
        question: 'How can I specifically support you this week, [Name]?',
        quickThoughts: [
          'Pray for my work clarity', 
          'Help me find rest time', 
          'Words of affirmation today', 
          'A simple date night', 
          'Handle the kitchen tonight', 
          'Just listen while I vent',
          'Remind me of God\'s promises',
          'Give me some alone time',
          'Take a walk with me',
          'Surprise me with a treat'
        ]
      }
    ]
  },
  {
    id: 'love',
    acronym: 'L.O.V.E.',
    title: 'Connection & Listening',
    emoji: '💛',
    color: 'bg-rose-100 text-rose-700',
    buttonColor: 'bg-rose-500 hover:bg-rose-600 shadow-rose-200',
    description: 'Focuses on making each other feel valued and intentionally engaged.',
    steps: [
      { 
        letter: 'L', word: 'Listen', emoji: '👂', 
        question: 'What’s on your heart right now, [Name]?',
        quickThoughts: [
          'Concern for a family member', 
          'Excitement about a new goal', 
          'Tired from the daily grind', 
          'Dreaming about our future', 
          'A struggle with comparison', 
          'Deep gratitude for life',
          'Anxiety about upcoming changes',
          'Hope for a breakthrough',
          'Feeling a bit restless',
          'Desire for deeper community'
        ]
      },
      { 
        letter: 'O', word: 'Observe', emoji: '👁️', 
        question: 'How are you feeling — really, [Name]?',
        quickThoughts: [
          'Strong and resilient', 
          'Fragile and needing care', 
          'Content with simplicity', 
          'Eager for a new challenge', 
          'A bit lonely in the crowd', 
          'Surrounded by grace',
          'Focused on my calling',
          'Struggling to stay present',
          'Ready to surrender control',
          'Confident in our path'
        ]
      },
      { 
        letter: 'V', word: 'Value', emoji: '💎', 
        question: 'Which Love Language makes you feel most valued right now, [Name]?',
        quickThoughts: [
          'Words of Affirmation', 
          'Acts of Service', 
          'Receiving Gifts', 
          'Quality Time', 
          'Physical Touch', 
          'Deep eye contact',
          'Public recognition',
          'A surprise note',
          'Uninterrupted focus',
          'Gentle encouragement'
        ]
      },
      { 
        letter: 'E', word: 'Engage', emoji: '🗓️', 
        question: 'What can we intentionally do together this week, [Name]?',
        quickThoughts: [
          'Visit a local cafe', 
          'A long prayer walk', 
          'Cook a new recipe', 
          'Read a book together', 
          'Service at the mission', 
          'A movie marathon night',
          'Garden / Backyard time',
          'Invite friends for dinner',
          'Planning our next trip',
          'Just a quiet night in'
        ]
      }
    ]
  },
  {
    id: 'peace',
    acronym: 'P.E.A.C.E.',
    title: 'Spiritual Unity & Grace',
    emoji: '🕊️',
    color: 'bg-cyan-100 text-cyan-700',
    buttonColor: 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-200',
    description: 'Built for couples to pray, address conflict with grace, and bless each other.',
    steps: [
      { letter: 'P', word: 'Prayer', emoji: '🙏', question: 'How can I pray for you this week, [Name]?', quickThoughts: ['Clarity in decision making', 'Strength for a difficult task', 'Patience with the children', 'Healing in a relationship', 'Growth in my prayer life', 'Provision for a need', 'Spiritual discernment', 'Peace over my anxiety', 'A heart of worship', 'Opportunities to share faith'] },
      { letter: 'E', word: 'Emotional State', emoji: '🎭', question: 'Where is your soul at today, [Name]?', quickThoughts: ['Thirsting for God', 'Resting in His grace', 'A bit weary from the climb', 'Joyful and overflowing', 'Seeking still waters', 'Navigating a valley', 'On a mountaintop', 'Waiting in the middle', 'Anchored in truth', 'Feeling the Spirit\'s nudge'] },
      { letter: 'A', word: 'Appreciation', emoji: '🎁', question: 'What blessed you about our home recently, [Name]?', quickThoughts: ['The peace in our walls', 'Laughter around the table', 'Your gentle spirit', 'Shared devotion time', 'How we handled a conflict', 'The warmth of our welcome', 'Our hospitality to others', 'Sacrificial love shown', 'Growth in our kids', 'Consistency in prayer'] },
      { letter: 'C', word: 'Conflict', emoji: '⚖️', question: 'Any tension we need to address with grace, [Name]?', quickThoughts: ['Completely at peace', 'Small friction at work', 'Need to talk through a choice', 'A misunderstanding of words', 'Feeling unheard on a topic', 'Need to align our hearts', 'Grace-filled correction', 'Lingering frustration', 'Unresolved argument', 'Ready for reconciliation'] },
      { letter: 'E', word: 'Encouragement', emoji: '🗣️', question: 'What life-giving word can I speak to you, [Name]?', quickThoughts: ["You are a good steward", "God is using you", "I'm so proud of your growth", "You are deeply loved", "Your work has eternal value", "You are a light to many", "Keep pressing on", "Rest is not earned", "You are chosen and known", "I see the fruit in you"] }
    ]
  }
];

export interface JoySuggestionSet {
  activities: string[];
  times: string[];
}

export const JOY_SUGGESTIONS: Record<string, JoySuggestionSet> = {
  'Daily': {
    activities: [
      'Morning Devos & Specialty Brew ☕', 
      'Slow Grace-Filled Walk 🚶‍♂️', 
      'Evening Prayer & Decompression 🌙', 
      'Reading a Spirit-Led Book 📖', 
      'Words of Affirmation Swap ✨', 
      'Shared Journaling: Gospel Joy 📝', 
      'Unplugged Table Fellowship 🍽️', 
      'Intercessory DM / Text for each other 📲', 
      'Listening to a Worship Session 🎶', 
      'Kudumba Prarthana (Legacy Prayer) 🙏', 
      'Quiet Contemplation / Meditation 🧘',
      'Daily Grace Check-in 🗣️'
    ],
    times: ['Sunrise / 6 AM', 'Before the Hustle', 'Mid-Morning Break', 'Afternoon Refresh', 'Sundown / 6:30 PM', 'Post-Dinner Unwind', 'Bedtime Ritual', '10 Minutes of Silence', 'During Commute']
  },
  'Weekly': {
    activities: [
      'Sunday Service & Brunch ⛪', 
      'Life Group / Small Group Hang 🤝', 
      'Coffee & Theology Date ☕', 
      'Unplugged Sabbath Rhythm 洒落', 
      'Missional Service Project 洒落', 
      'Couples Bible Study Session 洒落', 
      'Nature Hike & Deep Connection 洒落', 
      'Marriage-Building Podcast & Talk 洒落', 
      'Friday Fast & Reflection 洒落', 
      'Intentional Neighbor Blessing 洒落', 
      'Washing Each Other\'s Feet (Ritual) 洒落',
      'Community Worship Night 洒落'
    ],
    times: ['Every Sunday', 'Mid-Week Reset', 'Friday Evening', 'Saturday Sabbath', 'Weekend Morning', 'Tuesday Life Group', 'Thursday Outreach', 'Every 7 Days']
  },
  'Monthly': {
    activities: [
      'Marriage Mentor Brunch 洒落', 
      'Full Day of Silence & Rest 洒落', 
      'Weekend Reconnection Getaway 洒落', 
      'Life Vision & Kingdom Budget Review 洒落', 
      'Local NGO / Mercy Ministry Sewa 洒落', 
      'Gospel Feast with Seekers 洒落', 
      'Spiritual Formation Workshop 洒落', 
      'Monthly Legacy Letter Writing 洒落', 
      'Pilgrimage to a Heritage Church 洒落', 
      'Creative Date: Clay/Art/Music 洒落',
      'Couples Communion Prayer 洒落',
      'Prayer Vigil / All-Night Worship 洒落'
    ],
    times: ['1st Saturday', 'Payday Vision Meet', 'Last Sunday', 'Monthly Anniversary', 'Every 15th', 'Full Moon Walk', 'Quarterly Reflection']
  },
  'Annually': {
    activities: [
      '3-Day Silent Reconnection Retreat 洒落', 
      'Mission Exposure / Field Trip 洒落', 
      'Vow Renewal & Anniversary Feast 洒落', 
      'Regional Christian Conference 洒落', 
      'Personal Spiritual Audit 洒落', 
      'Hosting a Neighborhood Agape Meal 洒落', 
      'Advent / Passion Week Journey 洒落', 
      'Short-Term Theological Course 洒落', 
      'Family Camp / Convocation 洒落', 
      'Stewardship Goal Celebration 洒落',
      'Christmas Caroling Fellowship 洒落',
      'Easter Sunrise Worship 洒落'
    ],
    times: ['January Reset', 'Lenten Season', 'Resurrection Sunday', 'Monsoon Retreat', 'Wedding Anniversary', 'Advent Season', 'End-of-Year Thanksgiving']
  },
  '5 Years': {
    activities: [
      'Adopting a Global Mission Field 洒落', 
      'Launching a Missional Habit 洒落', 
      'Kingdom-Focused Savings Goal 洒落', 
      'Sponsoring a Rural Church Plant 洒落', 
      'Legacy Planning & Mentoring 洒落', 
      'Full Theological Certification 洒落', 
      'Starting a Couples Ministry 洒落', 
      'Building our Family "Bethel" 洒落', 
      'Bible Translation Support 洒落', 
      'Deepening Community Leadership 洒落',
      'Establishing a Heritage Fund 洒落'
    ],
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
