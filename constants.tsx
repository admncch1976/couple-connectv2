
import { CheckInModel } from './types';

export const CHECKIN_MODELS: CheckInModel[] = [
  {
    id: 'care',
    acronym: 'C.A.R.E.',
    title: 'Simple & Warm',
    emoji: '❤️',
    color: 'bg-pink-100 text-pink-700',
    buttonColor: 'bg-pink-500 hover:bg-pink-600 shadow-pink-200',
    description: 'Best for weekly 15-minute check-ins.',
    steps: [
      { letter: 'C', word: 'Connect', emoji: '🤝', question: 'How are you emotionally this week, [Name]?' },
      { letter: 'A', word: 'Appreciate', emoji: '🌟', question: 'What is one thing I appreciated about you this week, [Name]?' },
      { letter: 'R', word: 'Repair', emoji: '🩹', question: 'Is there anything that needs clearing up between us, [Name]?' },
      { letter: 'E', word: 'Encourage', emoji: '🌻', question: 'How can I specifically support you this week, [Name]?' }
    ]
  },
  {
    id: 'love',
    acronym: 'L.O.V.E.',
    title: 'Very Easy to Remember',
    emoji: '💛',
    color: 'bg-rose-100 text-rose-700',
    buttonColor: 'bg-rose-500 hover:bg-rose-600 shadow-rose-200',
    description: 'Gentle and non-intimidating. Great for couples.',
    steps: [
      { letter: 'L', word: 'Listen', emoji: '👂', question: 'What’s on your heart right now, [Name]?' },
      { letter: 'O', word: 'Observe', emoji: '👁️', question: 'How are you feeling — really, [Name]?' },
      { letter: 'V', word: 'Value', emoji: '💎', question: 'What made you feel valued (or not) this week, [Name]?' },
      { letter: 'E', word: 'Engage', emoji: '🗓️', question: 'What can we intentionally do together this week, [Name]?' }
    ]
  },
  {
    id: 'alive',
    acronym: 'A.L.I.V.E.',
    title: 'Deeper Growth Model',
    emoji: '🔥',
    color: 'bg-fuchsia-100 text-fuchsia-700',
    buttonColor: 'bg-fuchsia-500 hover:bg-fuchsia-600 shadow-fuchsia-200',
    description: 'Best for monthly deeper conversations.',
    recommended: 'Monthly',
    steps: [
      { letter: 'A', word: 'Appreciation', emoji: '💖', question: 'What did you love about us this month, [Name]?' },
      { letter: 'L', word: 'Learning', emoji: '🧠', question: 'What have you learned about me lately, [Name]?' },
      { letter: 'I', word: 'Issues', emoji: '🌩️', question: 'Any tension or unspoken frustration, [Name]?' },
      { letter: 'V', word: 'Vision', emoji: '🔭', question: 'Are we aligned in our current direction, [Name]?' },
      { letter: 'E', word: 'Intimacy', emoji: '💞', question: 'Do you feel emotionally close to me, [Name]?' }
    ]
  },
  {
    id: 'peace',
    acronym: 'P.E.A.C.E.',
    title: 'Faith-Based Check-In',
    emoji: '🕊️',
    color: 'bg-cyan-100 text-cyan-700',
    buttonColor: 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-200',
    description: 'Ideal for couples who value spiritual depth.',
    steps: [
      { letter: 'P', word: 'Prayer', emoji: '🙏', question: 'How can I pray for you this week, [Name]?' },
      { letter: 'E', word: 'Emotional State', emoji: '🎭', question: 'Where is your soul at today, [Name]?' },
      { letter: 'A', word: 'Appreciation', emoji: '🎁', question: 'What blessed you about our home recently, [Name]?' },
      { letter: 'C', word: 'Conflict', emoji: '⚖️', question: 'Any tension we need to address with grace, [Name]?' },
      { letter: 'E', word: 'Encouragement', emoji: '🗣️', question: 'What life-giving word can I speak to you, [Name]?' }
    ]
  }
];

export const JOY_SUGGESTIONS: Record<string, string[]> = {
  'Daily': [
    'Morning Masala Chai & Manna ☕', 
    'Couple Devotional & Intercession 🙏', 
    'Reading a Proverb together 📖',
    'Post-Dinner Prayer Walk 🚶', 
    'Encouraging Bible Verse Swap 🕊️', 
    'Bedtime Gratitude & Grace Share ✨', 
    'Helping with household chores together 🍳'
  ],
  'Weekly': [
    'Sunday Church Service & Fellowship ⛪', 
    'LRS Seminar Study/Discussion ✍️',
    'Friday Night Bible & Biryani 🍛', 
    'Long Drive to a Highway Dhaba 🚗',
    'Street Food (Chaat) & Connection Date 🍝', 
    'Washing each other\'s feet (John 13) 🌊',
    'Home Worship & Samosa Date 🎶'
  ],
  'Monthly': [
    'Marriage Enrichment Workshop 🏫',
    'LRS Seminar In-Person Meetup 🤝',
    'Weekend Hill Station Getaway ⛰️', 
    'Saree/Kurta Shopping spree 🛍️', 
    'Serving at an Orphanage or Shelter 🎁', 
    'Candle-light Dinner with Prayer Focus 🕯️', 
    'Couple\'s Ayurvedic Spa Day 🧖‍♂️'
  ],
  'Annually': [
    'Marriage Enrichment Retreat 🌿', 
    'Pilgrimage to Holy Land/Sites 🕋', 
    'Church Family Camp ⛺',
    'Big International Family Vacation ✈️', 
    'Marriage Anniversary Renewal Ceremony 👰', 
    'Traditional Gold/Legacy Gift Investment 💍'
  ],
  '5 Years': [
    'Building our "Bethel" Dream Home 🏠', 
    'Designing a Kingdom Legacy Business 💼', 
    'Child Education & Mission Fund 💰', 
    'Hosting a Grand Family Thanksgiving 👨‍👩‍👧‍👦',
    'Debt-Free Celebration Milestone 📉',
    'Sponsoring a Major Ministry Project 🌍'
  ]
};
