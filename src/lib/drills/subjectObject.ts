import { DrillQ, DrillMeta, shuffle } from './types';

interface Sent {
  s: string;            // subject
  v: string;            // verb
  o: string[];          // object(s) — indirect + direct where applicable
  other?: string[];     // adverb / prepositional phrase / complement
  text: string;
}

const mk = (text: string, s: string, v: string, o: string[], other: string[] = []): Sent => ({ text, s, v, o, other });

/** Active / Passive aur Narration type sentences — subject & object identification ke liye. */
const SENTENCES: Sent[] = [
  mk('Ravi writes a letter every morning.', 'Ravi', 'writes', ['a letter'], ['every morning']),
  mk('The teacher punished the naughty boy.', 'The teacher', 'punished', ['the naughty boy']),
  mk('She has completed her homework.', 'She', 'has completed', ['her homework']),
  mk('They were building a new bridge.', 'They', 'were building', ['a new bridge']),
  mk('The police arrested two thieves last night.', 'The police', 'arrested', ['two thieves'], ['last night']),
  mk('My mother cooks delicious food daily.', 'My mother', 'cooks', ['delicious food'], ['daily']),
  mk('The gardener is watering the plants.', 'The gardener', 'is watering', ['the plants']),
  mk('Rita gave me a beautiful gift.', 'Rita', 'gave', ['me', 'a beautiful gift']),
  mk('The manager sent the workers a notice.', 'The manager', 'sent', ['the workers', 'a notice']),
  mk('Someone has stolen my bicycle.', 'Someone', 'has stolen', ['my bicycle']),
  mk('The committee will announce the results tomorrow.', 'The committee', 'will announce', ['the results'], ['tomorrow']),
  mk('The students are learning grammar rules.', 'The students', 'are learning', ['grammar rules']),
  mk('He had finished the project before Monday.', 'He', 'had finished', ['the project'], ['before Monday']),
  mk('The chef prepared a special dish for the guests.', 'The chef', 'prepared', ['a special dish'], ['for the guests']),
  mk('Our team won the final match easily.', 'Our team', 'won', ['the final match'], ['easily']),
  mk('The postman delivers letters in the morning.', 'The postman', 'delivers', ['letters'], ['in the morning']),
  mk('Nobody answered my question.', 'Nobody', 'answered', ['my question']),
  mk('The company has launched a new product.', 'The company', 'has launched', ['a new product']),
  mk('The carpenter is making a wooden table.', 'The carpenter', 'is making', ['a wooden table']),
  mk('Sita taught the children a new song.', 'Sita', 'taught', ['the children', 'a new song']),
  mk('The driver was repairing his car.', 'The driver', 'was repairing', ['his car']),
  mk('The principal awarded him a scholarship.', 'The principal', 'awarded', ['him', 'a scholarship']),
  mk('The farmers sold their crops in the market.', 'The farmers', 'sold', ['their crops'], ['in the market']),
  mk('The boy broke the window with a ball.', 'The boy', 'broke', ['the window'], ['with a ball']),
  mk('The doctor advised the patient complete rest.', 'The doctor', 'advised', ['the patient', 'complete rest']),
  mk('She said to me, "I am reading a book."', 'She', 'said', ['to me'], ['"I am reading a book."']),
  mk('He told his brother that the train had left.', 'He', 'told', ['his brother'], ['that the train had left']),
  mk('The captain ordered the soldiers to fire.', 'The captain', 'ordered', ['the soldiers'], ['to fire']),
  mk('Mohan asked me where I lived.', 'Mohan', 'asked', ['me'], ['where I lived']),
  mk('The mother requested her son to study hard.', 'The mother', 'requested', ['her son'], ['to study hard']),
  mk('The old man narrated an interesting story.', 'The old man', 'narrated', ['an interesting story']),
  mk('The children have planted many trees.', 'The children', 'have planted', ['many trees']),
  mk('Our neighbours invited us to the party.', 'Our neighbours', 'invited', ['us'], ['to the party']),
  mk('The magician showed the audience a trick.', 'The magician', 'showed', ['the audience', 'a trick']),
  mk('The government banned single-use plastic.', 'The government', 'banned', ['single-use plastic']),
  mk('The engineer designed a strong dam.', 'The engineer', 'designed', ['a strong dam']),
  mk('The tailor stitched my shirt yesterday.', 'The tailor', 'stitched', ['my shirt'], ['yesterday']),
  mk('The class monitor collected the notebooks.', 'The class monitor', 'collected', ['the notebooks']),
  mk('The soldiers defended the border bravely.', 'The soldiers', 'defended', ['the border'], ['bravely']),
  mk('Anita bought her friend a birthday cake.', 'Anita', 'bought', ['her friend', 'a birthday cake']),
  mk('The peon rang the bell twice.', 'The peon', 'rang', ['the bell'], ['twice']),
  mk('The scientists discovered a new planet.', 'The scientists', 'discovered', ['a new planet']),
  mk('He will send you the documents.', 'He', 'will send', ['you', 'the documents']),
  mk('The clerk typed the report quickly.', 'The clerk', 'typed', ['the report'], ['quickly']),
  mk('The audience appreciated her performance.', 'The audience', 'appreciated', ['her performance']),
  mk('The washerman has ironed the clothes.', 'The washerman', 'has ironed', ['the clothes']),
  mk('The girl was singing a melodious song.', 'The girl', 'was singing', ['a melodious song']),
  mk('The shopkeeper offered us a discount.', 'The shopkeeper', 'offered', ['us', 'a discount']),
  mk('The librarian issued him three books.', 'The librarian', 'issued', ['him', 'three books']),
  mk('The workers had cleaned the whole hall.', 'The workers', 'had cleaned', ['the whole hall']),
  mk('The coach is training the new players.', 'The coach', 'is training', ['the new players']),
  mk('Rahul told his mother a lie.', 'Rahul', 'told', ['his mother', 'a lie']),
  mk('The court sentenced the accused to jail.', 'The court', 'sentenced', ['the accused'], ['to jail']),
  mk('The village headman solved the dispute.', 'The village headman', 'solved', ['the dispute']),
  mk('The nurse gave the child an injection.', 'The nurse', 'gave', ['the child', 'an injection']),
  mk('Everyone must obey the traffic rules.', 'Everyone', 'must obey', ['the traffic rules']),
  mk('The wind blew away the roof of the hut.', 'The wind', 'blew away', ['the roof of the hut']),
  mk('The peon opened the gate for the visitors.', 'The peon', 'opened', ['the gate'], ['for the visitors']),
  mk('My father has purchased a new car.', 'My father', 'has purchased', ['a new car']),
  mk('The examiner will check the answer sheets.', 'The examiner', 'will check', ['the answer sheets']),
];

const joinOr = (a: string[]) => a.join(' + ');

function make(sent: Sent, askObject: boolean, i: number): DrillQ {
  const correct = askObject ? joinOr(sent.o) : sent.s;
  const pool: { text: string; role: string }[] = [
    { text: sent.s, role: 'subject' },
    { text: joinOr(sent.o), role: 'object' },
    { text: sent.v, role: 'verb' },
    ...(sent.other || []).map((x) => ({ text: x, role: 'extra' })),
  ];
  if (sent.o.length > 1) {
    pool.push({ text: sent.o[1], role: 'direct-only' });
    pool.push({ text: sent.o[0], role: 'indirect-only' });
  }
  const wrong = shuffle(pool.filter((p) => p.text !== correct)).slice(0, 3);
  const chosen = shuffle([{ text: correct, role: askObject ? 'object' : 'subject' }, ...wrong]);

  const whyFor = (p: { text: string; role: string }) => {
    if (p.text === correct)
      return askObject
        ? `✅ Sahi — "${p.text}" par kaam ho raha hai. Verb "${sent.v}" se poocho "kya/kisko?" → jawab "${p.text}" = Object.${sent.o.length > 1 ? ` (Indirect object = "${sent.o[0]}", Direct object = "${sent.o[1]}")` : ''}`
        : `✅ Sahi — kaam karne wala "${p.text}" hai. Verb "${sent.v}" se poocho "kaun?" → jawab "${p.text}" = Subject.`;
    switch (p.role) {
      case 'subject': return `❌ "${p.text}" Subject hai (kaam karne wala), Object nahi. Object ke liye verb se "kya/kisko?" poocha jaata hai.`;
      case 'object': return `❌ "${p.text}" Object hai (jis par kaam hua), Subject nahi. Subject ke liye verb se "kaun?" poocho.`;
      case 'verb': return `❌ "${p.text}" verb (kriya) hai — na subject na object.`;
      case 'direct-only': return `❌ Ye sirf Direct object hai; poora object "${joinOr(sent.o)}" hai (indirect "${sent.o[0]}" bhi include hoga).`;
      case 'indirect-only': return `❌ Ye sirf Indirect object hai (jise diya gaya); Direct object "${sent.o[1]}" bhi shaamil hoga.`;
      default: return `❌ "${p.text}" adverbial / prepositional part hai (kab, kaha, kaise batata hai) — subject ya object nahi.`;
    }
  };

  return {
    id: `so-${i}`,
    context: sent.text,
    question: askObject ? 'Is sentence ka Object kaun sa hai?' : 'Is sentence ka Subject kaun sa hai?',
    options: chosen.map((c) => c.text),
    correctIndex: chosen.findIndex((c) => c.text === correct),
    why: chosen.map(whyFor),
    solution: `Subject = "${sent.s}" (kaun? → kaam karne wala), Verb = "${sent.v}", Object = "${joinOr(sent.o)}" (kya/kisko? → jis par kaam hua).${sent.o.length > 1 ? ` Yaha do object hain — Indirect: "${sent.o[0]}", Direct: "${sent.o[1]}".` : ''} Passive banate waqt object hi subject ban jaata hai.`,
    tag: askObject ? 'Object' : 'Subject',
  };
}

const ALL: DrillQ[] = SENTENCES.flatMap((s, i) => [make(s, false, i * 2), make(s, true, i * 2 + 1)]);

export const subjectObjectDrill: DrillMeta = {
  key: 'subject-object',
  label: 'Identify Subject & Object',
  emoji: '🎯',
  blurb: `Active/Passive & Narration sentences se ${ALL.length} MCQs · har option flip hoke Hinglish reason`,
  total: ALL.length,
  notes: [
    'Subject = verb se "kaun?" poocho — kaam karne wala.',
    'Object = verb se "kya / kisko?" poocho — jis par kaam hota hai.',
    'Do object ho sakte hain: Indirect (person — me, him, the children) + Direct (thing — a gift, a song).',
    'Passive banane par Object subject ban jaata hai aur Subject "by + objective case" me jaata hai.',
  ],
  build: (limit, from, to) => shuffle(ALL.slice(from ? from - 1 : 0, to ?? ALL.length)).slice(0, limit),
};
