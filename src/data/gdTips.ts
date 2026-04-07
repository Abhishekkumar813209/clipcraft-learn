export interface GdTipSection {
  id: string;
  title: string;
  icon: string;
  tips: string[];
}

export const gdTips: GdTipSection[] = [
  {
    id: 'opening',
    title: 'Opening Techniques',
    icon: '🎯',
    tips: [
      'Quote opening: Start with a relevant quote — "As Mahatma Gandhi said…"',
      'Fact/statistic opening: "According to a recent study, 70% of…"',
      'Definition opening: Define the key term — "Let\'s first understand what we mean by…"',
      'Question opening: Pose a thought-provoking question to engage the group',
      'Story opening: Share a brief relevant anecdote (keep it under 15 seconds)',
      'Avoid: Don\'t start with "I think…" — it sounds weak. Use assertive openings.',
    ],
  },
  {
    id: 'body',
    title: 'During the Discussion',
    icon: '💬',
    tips: [
      'Listen actively — reference others\' points: "Building on what Priya said…"',
      'Use the PREP method: Point → Reason → Example → Point (restate)',
      'Maintain eye contact with the group, not just the moderator',
      'Speak 3-4 times in a 15-min GD — quality over quantity',
      'Use data and examples to back your arguments — be specific',
      'Don\'t interrupt — wait for a natural pause, then interject politely',
      'If someone interrupts you, calmly say "I\'d like to finish my point"',
      'Avoid extremes — acknowledge both sides, then present your stance',
      'Use transitions: "On the other hand…", "Looking at it from another angle…"',
      'Keep track of time — don\'t dominate or stay silent',
    ],
  },
  {
    id: 'closing',
    title: 'Summarization & Closing',
    icon: '🏁',
    tips: [
      'Volunteer to summarize — it shows leadership',
      'Cover all major points discussed, not just your own',
      'Be neutral in summary — "The group discussed X, Y, and Z perspectives"',
      'End with a balanced conclusion or actionable takeaway',
      'Don\'t introduce new points during summarization',
      'Keep the summary under 1 minute',
    ],
  },
  {
    id: 'body_language',
    title: 'Body Language & Voice',
    icon: '🧍',
    tips: [
      'Sit upright with confident posture — no slouching or leaning back',
      'Use hand gestures moderately to emphasize points',
      'Maintain a pleasant facial expression — avoid frowning or eye-rolling',
      'Modulate your voice — vary tone and pace to keep attention',
      'Speak at a moderate volume — loud enough to be heard, not aggressive',
      'Nod when others make good points — shows active listening',
      'Don\'t fidget, tap pens, or play with accessories',
    ],
  },
  {
    id: 'dos',
    title: 'Dos',
    icon: '✅',
    tips: [
      'Be well-read on current affairs — read newspapers daily',
      'Practice speaking on random topics for 2-3 minutes',
      'Use formal but natural language — avoid slang',
      'Acknowledge valid points from others before countering',
      'Stay calm even if someone disagrees aggressively',
      'Use inclusive language — "we", "the group", "as a society"',
      'Enter with 2-3 strong points prepared mentally',
      'Be assertive but respectful',
    ],
  },
  {
    id: 'donts',
    title: 'Don\'ts',
    icon: '❌',
    tips: [
      'Don\'t get personal — attack the argument, not the person',
      'Don\'t shout or talk over others',
      'Don\'t use fillers excessively — "umm", "like", "basically"',
      'Don\'t sit silently — even 1-2 good points matter',
      'Don\'t dominate — let others speak too',
      'Don\'t lose your temper — emotional outbursts are penalized',
      'Don\'t use offensive or politically insensitive language',
      'Don\'t go off-topic — stay relevant to the discussion theme',
      'Don\'t read from notes — it\'s a discussion, not a presentation',
    ],
  },
  {
    id: 'mistakes',
    title: 'Common Mistakes to Avoid',
    icon: '⚠️',
    tips: [
      'Starting without understanding the topic — take 10 seconds to think',
      'Making only one point and repeating it — diversify your arguments',
      'Agreeing with everything — have your own stance',
      'Being too aggressive to initiate — quality of entry matters more',
      'Ignoring counter-arguments — address them head-on',
      'Using complex vocabulary incorrectly — simplicity wins',
      'Not practicing beforehand — GD skills improve with mock sessions',
    ],
  },
  {
    id: 'evaluation',
    title: 'What Evaluators Look For',
    icon: '📋',
    tips: [
      'Content quality — depth and relevance of arguments',
      'Communication skills — clarity, grammar, vocabulary',
      'Leadership — initiating, moderating, summarizing',
      'Teamwork — listening, building on others\' points',
      'Analytical ability — structured thinking, data usage',
      'Persuasiveness — ability to convince others',
      'Body language — confidence, eye contact, posture',
      'Time management — balanced participation',
    ],
  },
];
