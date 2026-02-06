
import { CheckInModel } from './types';

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
        question: 'What is one thing I appreciated about you this week, [Name]?',
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
        question: 'What made you feel valued (or not) this week, [Name]?',
        quickThoughts: [
          'Our shared prayer time', 
          'A thoughtful text from you', 
          'When you took the kids out', 
          'Your eye contact while I spoke', 
          'A dismissive comment (ouch)', 
          'When you defended me',
          'Shared chores in the evening',
          'Your physical touch',
          'When you noticed my effort',
          'When you asked for my advice'
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
      'Unplugged Sabbath Rhythm 📵', 
      'Missional Service Project 🎁', 
      'Couples Bible Study Session 📜', 
      'Nature Hike & Deep Connection 🌳', 
      'Marriage-Building Podcast & Talk 🎧', 
      'Friday Fast & Reflection 🤲', 
      'Intentional Neighbor Blessing 🏡', 
      'Washing Each Other\'s Feet (Ritual) 🌊',
      'Community Worship Night 🎸'
    ],
    times: ['Every Sunday', 'Mid-Week Reset', 'Friday Evening', 'Saturday Sabbath', 'Weekend Morning', 'Tuesday Life Group', 'Thursday Outreach', 'Every 7 Days']
  },
  'Monthly': {
    activities: [
      'Marriage Mentor Brunch 👥', 
      'Full Day of Silence & Rest 🤫', 
      'Weekend Reconnection Getaway 🏖️', 
      'Life Vision & Kingdom Budget Review 💰', 
      'Local NGO / Mercy Ministry Sewa 🏥', 
      'Gospel Feast with Seekers 🍽️', 
      'Spiritual Formation Workshop 🏫', 
      'Monthly Legacy Letter Writing ✉️', 
      'Pilgrimage to a Heritage Church 🏛️', 
      'Creative Date: Clay/Art/Music 🎨',
      'Couples Communion Prayer 🍷',
      'Prayer Vigil / All-Night Worship 🌙'
    ],
    times: ['1st Saturday', 'Payday Vision Meet', 'Last Sunday', 'Monthly Anniversary', 'Every 15th', 'Full Moon Walk', 'Quarterly Reflection']
  },
  'Annually': {
    activities: [
      '3-Day Silent Reconnection Retreat 🏔️', 
      'Mission Exposure / Field Trip ✈️', 
      'Vow Renewal & Anniversary Feast 💍', 
      'Regional Christian Conference 🏟️', 
      'Personal Spiritual Audit 📝', 
      'Hosting a Neighborhood Agape Meal 🍗', 
      'Advent / Passion Week Journey 🕯️', 
      'Short-Term Theological Course 🎓', 
      'Family Camp / Convocation ⛺', 
      'Stewardship Goal Celebration 📈',
      'Christmas Caroling Fellowship 🎄',
      'Easter Sunrise Worship 🌅'
    ],
    times: ['January Reset', 'Lenten Season', 'Resurrection Sunday', 'Monsoon Retreat', 'Wedding Anniversary', 'Advent Season', 'End-of-Year Thanksgiving']
  },
  '5 Years': {
    activities: [
      'Adopting a Global Mission Field 🗺️', 
      'Launching a Missional Habit 🚀', 
      'Kingdom-Focused Savings Goal 💎', 
      'Sponsoring a Rural Church Plant 🏗️', 
      'Legacy Planning & Mentoring 📜', 
      'Full Theological Certification 🎓', 
      'Starting a Couples Ministry 👫', 
      'Building our Family "Bethel" 🏠', 
      'Bible Translation Support 🌍', 
      'Deepening Community Leadership 🎖️',
      'Establishing a Heritage Fund 🏦'
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
