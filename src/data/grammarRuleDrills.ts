// Memory drills for SSC Grammar Rules 1-20.
// Yeh rule ke andar ki word-lists / cases ko ratne ke liye MCQ practice deta hai.

export type Drill =
  | { kind: 'classify'; title: string; prompt: string; groups: { label: string; items: string[] }[]; note?: string }
  | { kind: 'pairs'; title: string; prompt: string; pairs: [string, string][]; note?: string }
  | { kind: 'mcq'; title: string; note?: string; items: { q: string; options: string[]; answer: number; why?: string }[] };

export interface DrillQuestion {
  question: string;
  options: string[];
  answer: number;
  why?: string;
}

const S = 'Singular verb (is/was/has/does/V1+s)';
const P = 'Plural verb (are/were/have/do/V1)';

export const ruleDrills: Record<number, Drill[]> = {
  1: [
    {
      kind: 'classify',
      title: 'Subject → kaunsi verb?',
      prompt: "'{x}' subject ke saath kaunsi verb aayegi?",
      groups: [
        {
          label: S,
          items: ['He', 'She', 'It', 'Everyone', 'No one', 'Someone', 'Something', 'Anybody', 'Nothing', 'Each', 'Either', 'Neither', 'The boy', 'My sister', 'Water', 'Furniture', 'Information', 'News', 'The team', 'Rahul'],
        },
        {
          label: P,
          items: ['You', 'We', 'They', 'The boys', 'My sisters', 'Children', 'People', 'Police', 'Cattle', 'Scissors', 'Trousers', 'Belongings', 'These books', 'The teachers', 'Men', 'Women', 'Mice', 'Criteria', 'Data', 'Spectacles'],
        },
      ],
      note: "'I' ke saath am / was / have / do / V1 aata hai.",
    },
  ],
  2: [
    {
      kind: 'mcq',
      title: 'Nearest subject rule',
      note: 'Either-or / Neither-nor / Not only...but also / or → verb paas wale subject ke according.',
      items: [
        { q: 'Either Ram or his brothers ___ coming.', options: ['is', 'are'], answer: 1, why: "Nearest subject 'brothers' plural." },
        { q: 'Neither the students nor the teacher ___ present.', options: ['was', 'were'], answer: 0, why: "Nearest 'teacher' singular." },
        { q: 'Not only the boys but also the girl ___ selected.', options: ['has been', 'have been'], answer: 0, why: "Nearest 'girl' singular." },
        { q: 'Neither he nor I ___ ready.', options: ['am', 'is'], answer: 0, why: "Nearest 'I' → am." },
        { q: 'Either the manager or the clerks ___ responsible.', options: ['is', 'are'], answer: 1, why: "Nearest 'clerks' plural." },
        { q: 'Not only the teacher but also the students ___ absent.', options: ['was', 'were'], answer: 1, why: "Nearest 'students' plural." },
        { q: 'Ram or Shyam ___ done it.', options: ['has', 'have'], answer: 0, why: 'Dono singular → singular verb.' },
        { q: 'Neither the cats nor the dog ___ barking.', options: ['is', 'are'], answer: 0, why: "Nearest 'dog' singular." },
      ],
    },
  ],
  3: [
    {
      kind: 'classify',
      title: 'Connector list (Rule 3 vs and)',
      prompt: "Subject ke beech '{x}' aaye to verb kiske according aayegi?",
      groups: [
        {
          label: 'Verb PEHLE noun ke according (Rule 3)',
          items: ['as well as', 'like', 'unlike', 'but', 'besides', 'excluding', 'including', 'except', 'and not', 'along with', 'together with', 'in company of', 'accompanied by', 'in addition to', 'rather than', 'with', 'no less than', 'as much as', 'not', 'other than'],
        },
        {
          label: 'Verb dono ke according → Plural (and-type)',
          items: ['and', 'both ... and', 'as well as both?', 'N1 and N2 (divided sense)'],
        },
        {
          label: 'Verb PAAS wale (nearest) noun ke according',
          items: ['either ... or', 'neither ... nor', 'not only ... but also', 'or', 'nor'],
        },
      ],
    },
    {
      kind: 'mcq',
      title: 'Sentence drill',
      items: [
        { q: 'The teacher, along with the students, ___ going.', options: ['is', 'are'], answer: 0, why: "Pehla noun 'teacher' singular." },
        { q: 'The students, as well as the teacher, ___ present.', options: ['is', 'are'], answer: 1, why: "Pehla noun 'students' plural." },
        { q: 'Abhishek and not his parents ___ a businessman.', options: ['is', 'are'], answer: 0, why: "Pehla noun 'Abhishek' singular." },
        { q: 'He together with his friends ___ to the temple.', options: ['goes', 'go'], answer: 0, why: "Pehla noun 'He' singular." },
        { q: 'The boys besides their captain ___ practising.', options: ['is', 'are'], answer: 1, why: "Pehla noun 'boys' plural." },
        { q: 'My brother accompanied by his friends ___ arrived.', options: ['has', 'have'], answer: 0, why: "Pehla noun 'brother' singular." },
        { q: 'All the players including the coach ___ tired.', options: ['was', 'were'], answer: 1, why: "Pehla noun 'players' plural." },
        { q: 'Nobody except the twins ___ the answer.', options: ['knows', 'know'], answer: 0, why: "Pehla word 'Nobody' singular." },
      ],
    },
  ],
  4: [
    {
      kind: 'classify',
      title: 'Beech ka part: Phrase ya Clause?',
      prompt: "'{x}' — yeh phrase hai ya clause?",
      groups: [
        {
          label: 'Phrase (verb nahi hai)',
          items: ['on the wall', 'across the bridge', 'in the corner', 'with a red cover', 'of my friends', 'behind the school', 'near the river', 'under the old tree', 'along with his uncle', 'in the middle of the road', 'to win the match', 'sitting on the bench', 'written in Hindi', 'covered with dust', 'full of water', 'between the two houses', 'after the meeting', 'without any doubt', 'at the bus stop', 'made of gold'],
        },
        {
          label: 'Clause (subject + verb hai)',
          items: ['who lives next door', 'which was bought yesterday', 'that I met in Delhi', 'whom I trusted', 'whose father is a doctor', 'that were kept on the table', 'who have passed the exam', 'which the boys had broken', 'when the bell rang', 'because he was late', 'that she had written', 'who are standing outside', 'which costs a lot', 'that we saw last night', 'while the guests were eating', 'if you agree', 'whom the police arrested', 'that lies on the hill', 'who never tells a lie', 'which my mother cooked'],
        },
      ],
      note: 'Clause me apna subject + verb hota hai; phrase me nahi. Dono ko ignore karke asli subject se verb milao.',
    },
  ],
  5: [
    {
      kind: 'classify',
      title: 'Divided sense vs Unified sense',
      prompt: "'{x}' — kaunsa sense aur kaunsi verb?",
      groups: [
        {
          label: 'Divided sense → Plural verb',
          items: ['water and fire', 'poverty and development', 'time and tide', 'Ram and Shyam', 'the teacher and the student', 'gold and silver', 'the pen and the pencil', 'my brother and my sister', 'the cat and the dog', 'health and wealth (alag-alag)', 'the doctor and the nurse', 'rain and snow', 'the boy and the girl', 'the car and the bike', 'Delhi and Mumbai'],
        },
        {
          label: 'Unified sense → Singular verb',
          items: ['bread and butter', 'rice and curry', 'slow and steady', 'sum and substance', 'horse and carriage', 'soda and whisky', 'the dance and music', 'age and experience', 'drinking and driving', 'honour and glory', 'law and order', 'bag and baggage', 'time and tide (ek muhavara)', 'crown and glory', 'brick and mortar', 'trials and tribulations', 'the poet and philosopher (ek hi vyakti)'],
        },
        {
          label: 'Each/Every + N and N → Singular verb',
          items: ['Every man and woman', 'Each boy and girl', 'Every teacher and student', 'Each and every person', 'Every book and copy', 'Each pen and pencil'],
        },
      ],
      note: 'Article/possessive 1 baar → singular verb; 2 baar → plural verb.',
    },
  ],
  6: [
    {
      kind: 'classify',
      title: 'Pronoun singular hai ya plural?',
      prompt: "'{x}' ke saath kaunsi verb + pronoun?",
      groups: [
        {
          label: 'Singular (his/her, is/has)',
          items: ['Everyone', 'Everybody', 'Everything', 'Someone', 'Somebody', 'Something', 'Anyone', 'Anybody', 'Anything', 'No one', 'Nobody', 'Nothing', 'Each', 'Each of the boys', 'Either', 'Either of them', 'Neither', 'Neither of the girls', 'One', 'Whoever', 'Much', 'Little', 'Another', 'Every one of them'],
        },
        {
          label: 'Plural (their, are/have)',
          items: ['Both', 'Both of them', 'Few', 'A few', 'Many', 'Several', 'Others', 'All the boys', 'These', 'Those', 'Some people', 'Certain students'],
        },
      ],
      note: "'of + plural noun' aane par bhi each/either/neither singular hi rehte hain.",
    },
  ],
  7: [
    {
      kind: 'mcq',
      title: "'One of' structure",
      items: [
        { q: 'One of the boys ___ found guilty.', options: ['was', 'were'], answer: 0, why: "'One' singular." },
        { q: 'One of ___ students has topped.', options: ['the brightest', 'brightest'], answer: 0, why: "One of + the + superlative + plural noun." },
        { q: 'It is one of the most serious ___.', options: ['problem', 'problems'], answer: 1, why: 'One of + plural noun.' },
        { q: 'One of my friends ___ in Delhi.', options: ['lives', 'live'], answer: 0, why: 'Verb singular.' },
        { q: 'This is one of the best ___ I have read.', options: ['book', 'books'], answer: 1, why: 'Plural noun chahiye.' },
        { q: 'One of the machines ___ not working.', options: ['is', 'are'], answer: 0, why: "'One' singular." },
      ],
    },
  ],
  8: [
    {
      kind: 'classify',
      title: 'All/Some/Any ke baad kaunsa noun?',
      prompt: "'{x}' — uncountable hai ya plural countable?",
      groups: [
        {
          label: 'Uncountable → Singular verb',
          items: ['wood', 'water', 'milk', 'money', 'furniture', 'luggage', 'baggage', 'information', 'advice', 'knowledge', 'poetry', 'machinery', 'scenery', 'equipment', 'jewellery', 'traffic', 'work', 'education', 'chalk', 'bread', 'butter', 'rice', 'sugar', 'salt', 'oil', 'petrol', 'electricity', 'music', 'homework', 'news', 'stationery', 'crockery', 'hardware', 'hair', 'wine', 'coffee'],
        },
        {
          label: 'Plural countable → Plural verb',
          items: ['fruit juices', 'boys', 'students', 'books', 'apples', 'chairs', 'tables', 'bottles', 'letters', 'ideas', 'machines', 'cars', 'houses', 'players', 'files', 'coins', 'pens', 'shops', 'buildings', 'papers'],
        },
      ],
    },
  ],
  9: [
    {
      kind: 'mcq',
      title: 'Time / Money / Distance — ek unit ya alag-alag?',
      items: [
        { q: 'Five years ___ a long time to wait.', options: ['is', 'are'], answer: 0, why: 'Ek unit → singular.' },
        { q: 'Five years ___ passed since I saw her.', options: ['has', 'have'], answer: 1, why: 'Alag-alag saal beete → plural.' },
        { q: 'Ten kilometres ___ a long distance.', options: ['is', 'are'], answer: 0, why: 'Ek unit.' },
        { q: 'Twenty rupees ___ not much these days.', options: ['is', 'are'], answer: 0, why: 'Ek amount as a whole.' },
        { q: 'Twenty rupees ___ lying scattered on the floor.', options: ['was', 'were'], answer: 1, why: 'Alag-alag notes/coins → plural.' },
        { q: 'Sixty miles an hour ___ the speed limit.', options: ['is', 'are'], answer: 0, why: 'Speed ek unit.' },
        { q: 'Two kilograms of rice ___ enough.', options: ['is', 'are'], answer: 0, why: 'Weight ek unit.' },
        { q: 'Six feet ___ a good height for a player.', options: ['is', 'are'], answer: 0, why: 'Height as a whole.' },
      ],
    },
  ],
  10: [
    {
      kind: 'classify',
      title: 'Structure → verb',
      prompt: "'{x}' ke baad kaunsi verb?",
      groups: [
        {
          label: 'Singular verb',
          items: ['The number of + plural noun', 'Many a + singular noun', 'More than one + singular noun', 'A certain + singular noun', 'Many a student', 'More than one book', 'The number of students', 'The number of participants'],
        },
        {
          label: 'Plural verb',
          items: ['A number of + plural noun', 'Many + plural noun', 'A large number of + plural noun', 'A great number of + plural noun', 'A good number of + plural noun', 'Certain + plural noun', 'More books than one', 'A great many people', 'A number of teachers'],
        },
      ],
    },
    {
      kind: 'mcq',
      title: 'Sentence drill',
      items: [
        { q: 'The number of participants ___ increasing.', options: ['is', 'are'], answer: 0 },
        { q: 'A number of teachers ___ attending.', options: ['is', 'are'], answer: 1 },
        { q: 'Many a ___ has been awarded.', options: ['student', 'students'], answer: 0 },
        { q: 'More than one book ___ been lost.', options: ['has', 'have'], answer: 0 },
        { q: 'A great many people ___ supported it.', options: ['has', 'have'], answer: 1 },
        { q: 'More ___ than one have been recommended.', options: ['book', 'books'], answer: 1 },
      ],
    },
  ],
  11: [
    {
      kind: 'mcq',
      title: 'There / Adverb of place',
      items: [
        { q: 'There ___ an abandoned trolley in the road.', options: ['was', 'were'], answer: 0, why: "Real subject 'trolley' singular." },
        { q: 'Outside the temple ___ two priests.', options: ['lives', 'live'], answer: 1, why: "'two priests' plural." },
        { q: 'There ___ many reasons for his failure.', options: ['is', 'are'], answer: 1 },
        { q: 'Under the tree ___ a snake.', options: ['sits', 'sit'], answer: 0 },
        { q: 'On the table ___ some books.', options: ['lies', 'lie'], answer: 1 },
        { q: 'Here ___ the list you asked for.', options: ['is', 'are'], answer: 0 },
      ],
    },
  ],
  12: [
    {
      kind: 'classify',
      title: 'Proper noun subject → verb',
      prompt: "'{x}' subject ke saath kaunsi verb?",
      groups: [
        {
          label: 'Singular verb (proper noun)',
          items: ['Malgudi Days', 'Arabian Nights', 'Pride and Prejudice', "Gulliver's Travels", 'The United States of America', 'The West Indies', 'The United Nations', 'Billiards', 'Darts', 'Three Idiots', 'The Avengers', 'The Netherlands', 'The Philippines', 'Great Expectations', 'The Times of India'],
        },
        {
          label: 'Plural verb (common plural noun)',
          items: ['The boys', 'The days', 'The nights', 'The travels of a tourist', 'The states', 'The islands', 'The nations', 'The movies', 'The newspapers', 'The teams'],
        },
      ],
    },
  ],
  13: [
    {
      kind: 'classify',
      title: '-ics words: determiner hai ya nahi?',
      prompt: "'{x}' ke saath kaunsi verb?",
      groups: [
        {
          label: 'Singular verb (bina determiner)',
          items: ['Politics', 'Mathematics', 'Physics', 'Economics', 'Statistics', 'Ethics', 'Athletics', 'Acoustics', 'Dynamics', 'Optics', 'Mechanics', 'Civics', 'Linguistics'],
        },
        {
          label: 'Plural verb (the/my/his ke saath)',
          items: ['Their politics', 'The mathematics', 'His ethics', 'Your statistics', 'The acoustics', 'Her economics', 'The physics (of this problem)', 'Our athletics', 'The optics', 'My mathematics'],
        },
      ],
    },
  ],
  14: [
    {
      kind: 'classify',
      title: 'Hamesha Plural vs Uncountable',
      prompt: "'{x}' kaunsi category me aata hai?",
      groups: [
        {
          label: 'Always Plural → Plural verb',
          items: ['belongings', 'savings', 'congratulations', 'scissors', 'proceeds', 'earrings', 'tidings', 'thanks', 'goggles', 'spectacles', 'premises', 'surroundings', 'outskirts', 'shorts', 'pliers', 'tongs', 'jeans', 'regards', 'pantaloons', 'pyjamas', 'clothes', 'trousers', 'alms', 'wages', 'annals', 'assets', 'auspices', 'valuables', 'eatables', 'riches', 'bowels', 'troops'],
        },
        {
          label: 'Uncountable → Singular verb',
          items: ['equipment', 'furniture', 'jewellery', 'luggage', 'poetry', 'machinery', 'scenery', 'information', 'advice', 'knowledge', 'baggage', 'hair', 'news', 'chalk', 'money', 'crockery', 'hardware', 'education', 'work', 'traffic', 'stationery', 'bedding', 'clothing', 'fuel', 'evidence', 'issue'],
        },
      ],
    },
  ],
  15: [
    {
      kind: 'mcq',
      title: 'Uncountable — sahi form chuno',
      items: [
        { q: 'The room is filled with beautiful ___.', options: ['furniture', 'furnitures'], answer: 0 },
        { q: 'She wears expensive ___.', options: ['jewellery', 'jewelleries'], answer: 0 },
        { q: 'He gave me some useful ___.', options: ['advice', 'advices'], answer: 0 },
        { q: 'All the ___ was loaded in the car.', options: ['luggage', 'luggages'], answer: 0 },
        { q: 'I need more ___ about the course.', options: ['information', 'informations'], answer: 0 },
        { q: 'The ___ of the hills is beautiful.', options: ['scenery', 'sceneries'], answer: 0 },
        { q: 'He bought a ___ of furniture.', options: ['piece', 'pair'], answer: 0 },
        { q: 'The ___ on this road is heavy.', options: ['traffic', 'traffics'], answer: 0 },
      ],
    },
  ],
  16: [
    {
      kind: 'classify',
      title: 'Plural form same rehti hai ya badalti hai?',
      prompt: "'{x}' ka plural?",
      groups: [
        {
          label: 'Same form (no -s)',
          items: ['sheep', 'deer', 'swine', 'series', 'salmon', 'fish', 'innings', 'means', 'headquarters', 'aircraft', 'hovercraft', 'gallows', 'species', 'offspring', 'corps', 'crossroads'],
        },
        {
          label: 'Form badalti hai',
          items: ['child', 'man', 'woman', 'tooth', 'foot', 'mouse', 'goose', 'ox', 'leaf', 'knife', 'city', 'baby', 'hero', 'crisis', 'datum'],
        },
      ],
    },
  ],
  17: [
    {
      kind: 'classify',
      title: 'Dikhta singular, hai plural',
      prompt: "'{x}' ke saath kaunsi verb?",
      groups: [
        {
          label: 'Plural verb (are/were/have)',
          items: ['People', 'Police', 'Children', 'Poultry', 'Gentry', 'Peasantry', 'Clergy', 'Vermin', 'Cattle', 'Men', 'Women', 'Mice', 'Geese'],
        },
        {
          label: 'Singular verb (is/was/has)',
          items: ['Public (ek unit)', 'Team', 'Committee', 'Crowd', 'Jury (ek unit)', 'Army', 'Family (ek unit)', 'Government', 'Class', 'Audience (ek unit)'],
        },
      ],
      note: "'peoples' tab hi sahi jab alag-alag qaumon/nations ki baat ho.",
    },
  ],
  18: [
    {
      kind: 'pairs',
      title: 'Compound noun ka plural',
      prompt: "'{x}' ka plural kya hoga?",
      pairs: [
        ['Book shelf', 'Book shelves'],
        ['Code of conduct', 'Codes of conduct'],
        ['Step daughter', 'Step daughters'],
        ['Brother-in-law', 'Brothers-in-law'],
        ['Sister-in-law', 'Sisters-in-law'],
        ['General Manager', 'General Managers'],
        ['Commander in chief', 'Commanders in chief'],
        ['Officer in charge', 'Officers in charge'],
        ['Maid servant', 'Maid servants'],
        ['Man doctor', 'Men doctors'],
        ['Woman doctor', 'Women doctors'],
        ['Mouthful', 'Mouthfuls'],
        ['Handful', 'Handfuls'],
        ['Bagful', 'Bagfuls'],
        ['Spoonful', 'Spoonfuls'],
        ['Looker on', 'Lookers on'],
        ['Passer by', 'Passers by'],
        ['Attorney General', 'Attorneys general'],
        ['Son-in-law', 'Sons-in-law'],
        ['Runner up', 'Runners up'],
      ],
    },
  ],
  19: [
    {
      kind: 'mcq',
      title: 'Noun modifier singular',
      items: [
        { q: 'It was a ten ___ long journey.', options: ['hour', 'hours'], answer: 0, why: 'Number + noun + noun → modifier singular.' },
        { q: 'I met a forty ___ old lady.', options: ['year', 'years'], answer: 0 },
        { q: 'The boy was ten ___ old.', options: ['year', 'years'], answer: 1, why: 'Aage noun nahi hai → plural.' },
        { q: 'The journey was three ___ long.', options: ['hour', 'hours'], answer: 1, why: 'Adjective ke saath plural.' },
        { q: 'He gave me a hundred ___ note.', options: ['rupee', 'rupees'], answer: 0 },
        { q: 'This is a five ___ plan.', options: ['year', 'years'], answer: 0 },
        { q: 'She bought a two ___ packet of sugar.', options: ['kilogram', 'kilograms'], answer: 0 },
        { q: 'The wall is six ___ high.', options: ['foot', 'feet'], answer: 1 },
      ],
    },
  ],
  20: [
    {
      kind: 'pairs',
      title: 'Foreign origin nouns ka plural',
      prompt: "'{x}' ka plural kya hoga?",
      pairs: [
        ['Crisis', 'Crises'],
        ['Basis', 'Bases'],
        ['Criterion', 'Criteria'],
        ['Phenomenon', 'Phenomena'],
        ['Thesis', 'Theses'],
        ['Medium', 'Media'],
        ['Syllabus', 'Syllabi'],
        ['Axis', 'Axes'],
        ['Datum', 'Data'],
        ['Mouse', 'Mice'],
        ['Oasis', 'Oases'],
        ['Radius', 'Radii'],
        ['Locus', 'Loci'],
        ['Focus', 'Foci'],
        ['Index', 'Indices'],
        ['Formula', 'Formulae'],
        ['Curriculum', 'Curricula'],
        ['Bacterium', 'Bacteria'],
        ['Analysis', 'Analyses'],
        ['Memorandum', 'Memoranda'],
      ],
    },
  ],
};

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

export function buildDrillQuestions(drill: Drill, limit = 30): DrillQuestion[] {
  if (drill.kind === 'mcq') {
    return shuffle(drill.items).slice(0, limit).map(it => ({
      question: it.q,
      options: it.options,
      answer: it.answer,
      why: it.why,
    }));
  }

  if (drill.kind === 'pairs') {
    const all = drill.pairs;
    return shuffle(all).slice(0, limit).map(([l, r]) => {
      const decoys = shuffle(all.filter(p => p[1] !== r)).slice(0, 3).map(p => p[1]);
      const options = shuffle([r, ...decoys]);
      return {
        question: drill.prompt.replace('{x}', l),
        options,
        answer: options.indexOf(r),
        why: `${l} → ${r}`,
      };
    });
  }

  const pool = drill.groups.flatMap(g => g.items.map(item => ({ item, label: g.label })));
  const labels = drill.groups.map(g => g.label);
  return shuffle(pool).slice(0, limit).map(({ item, label }) => {
    const options = labels.length > 1 ? labels : [label, 'None of these'];
    return {
      question: drill.prompt.replace('{x}', item),
      options,
      answer: options.indexOf(label),
      why: `${item} → ${label}`,
    };
  });
}

export const hasDrills = (ruleId: number) => Boolean(ruleDrills[ruleId]?.length);
