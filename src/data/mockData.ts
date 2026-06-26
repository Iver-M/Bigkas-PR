// ── Types ────────────────────────────────────────────────────────────────────

export type Tier = 'green' | 'yellow-fluency' | 'yellow-comprehension' | 'red';
export type Language = 'Filipino' | 'English';
export type GradeLevel = 3 | 4 | 5 | 6;

export interface FluencySubskill {
  name: string;
  status: 'Strong' | 'Weak';
  isLowestBrokenRung: boolean;
}

export interface CompSubskill {
  name: string;
  parameter: 4 | 5 | 6 | 7;
  status: 'Correct' | 'Incorrect';
  isLowestBrokenRung: boolean;
}

export interface LangResult {
  tier: Tier;
  wcpm: number;
  accuracy: number;
  primaryGap: string;
  primaryDrill: string;
  fluencySubskills: FluencySubskill[];
  compSubskills: CompSubskill[];
  lastAssessed: string;
  flaggedForRecheck: boolean;
}

export interface Student {
  id: number;
  name: string;
  grade: GradeLevel;
  section: string;
  parentEmail: string;
  consentStatus: 'confirmed' | 'pending';
  enrolledDate: string;
  filipino: LangResult;
  english: LangResult;
}

export interface SchoolClass {
  name: string;
  students: number;
  filipinoGreen: number;
  englishGreen: number;
}

export interface School {
  id: number;
  name: string;
  division: string;
  studentsAssessed: number;
  totalEnrolled: number;
  filipinoGreen: number;
  englishGreen: number;
  mostCommonGap: string;
  classes: SchoolClass[];
}

export interface Passage {
  id: string;
  title: string;
  text: string;
  wordCount: number;
  estimatedSecs: number;
  conceptLoad: 'simple' | 'moderate' | 'complex';
  keywords: string[];
}

export interface CompQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  skill: 'Literal Recall' | 'Vocabulary in Context' | 'Inference' | 'Sequencing / Main Idea';
  parameter: 4 | 5 | 6 | 7;
}

// ── WCPM Benchmarks (Phil-IRI aligned, per grade) ─────────────────────────────

export const WCPM_BENCHMARKS: Record<GradeLevel, Record<Language, number>> = {
  3: { Filipino: 80,  English: 85  },
  4: { Filipino: 95,  English: 100 },
  5: { Filipino: 110, English: 115 },
  6: { Filipino: 120, English: 125 },
};

// ── Helper builders ───────────────────────────────────────────────────────────

function flu(name: string, status: 'Strong' | 'Weak', isLowestBrokenRung = false): FluencySubskill {
  return { name, status, isLowestBrokenRung };
}

function comp(
  name: string,
  parameter: 4 | 5 | 6 | 7,
  status: 'Correct' | 'Incorrect',
  isLowestBrokenRung = false
): CompSubskill {
  return { name, parameter, status, isLowestBrokenRung };
}

function lang(
  tier: Tier, wcpm: number, accuracy: number,
  primaryGap: string, primaryDrill: string,
  fluencySubskills: FluencySubskill[], compSubskills: CompSubskill[],
  lastAssessed: string, flaggedForRecheck = false
): LangResult {
  return { tier, wcpm, accuracy, primaryGap, primaryDrill, fluencySubskills, compSubskills, lastAssessed, flaggedForRecheck };
}

// ── Grade-leveled Passages ────────────────────────────────────────────────────

export const PASSAGES: Record<Language, Record<GradeLevel, Passage>> = {
  Filipino: {
    3: {
      id: 'fil-3-a',
      title: 'Ang Hardin ni Lola',
      text: 'Si Lola Rosa ay mayroon ng magandang hardin sa likod ng kanilang bahay. Nagtatanim siya ng kamatis, sibuyas, at kangkong. Tuwing umaga, dina-diligan niya ang lahat ng kanyang mga halaman. Tumutulong din si Miguel, ang kanyang munting apo, sa pag-aalaga ng hardin. "Ang halaman ay parang tao," sabi ni Lola Rosa. "Kailangan din nila ng pag-aalaga at pagmamahal para lumaki nang maayos." Masaya si Miguel dahil nalalaman niya kung paano pangalagaan ang bawat halaman. Minsan, ibinibigay nila ang sariwang gulay sa mga kapitbahay.',
      wordCount: 83,
      estimatedSecs: 62,
      conceptLoad: 'simple',
      keywords: ['hardin','kamatis','sibuyas','kangkong','halaman','pag-aalaga','pagmamahal','gulay','kapitbahay','Miguel','Lola'],
    },
    4: {
      id: 'fil-4-a',
      title: 'Ang Likas na Yaman ng Pilipinas',
      text: 'Ang Pilipinas ay isang bansang mayaman sa likas na yaman. Mayroon itong malawak na kagubatan na tahanan ng iba\'t ibang uri ng hayop at halaman. Ang mga karagatan nito ay puno ng isda at iba pang pagkain mula sa dagat. Ang mineral na ginto, tanso, at uling ay matatagpuan sa ilalim ng lupa. Ang mga bundok at ilog ay nagbibigay ng sariwang tubig at kuryente sa mga mamamayan. Bilang mga Pilipino, responsibilidad nating pangalagaan ang mga kayamanang ito para sa susunod na henerasyon.',
      wordCount: 83,
      estimatedSecs: 62,
      conceptLoad: 'moderate',
      keywords: ['kagubatan','karagatan','mineral','ginto','tanso','uling','bundok','ilog','mamamayan','henerasyon','kayamanan','responsibilidad'],
    },
    5: {
      id: 'fil-5-a',
      title: 'Ang Siyensya at Teknolohiya',
      text: 'Sa panahon ngayon, ang siyensya at teknolohiya ay malaking tulong sa ating pang-araw-araw na buhay. Dahil sa teknolohiya, mabilis nating nakukuha ang mga impormasyon mula sa iba\'t ibang panig ng mundo. Nakakatulong din ang mga makina at kagamitan sa pagpapabilis ng trabaho. Ang mga magsasaka ay gumagamit na ng modernong kagamitan para sa kanilang mga taniman. Ang mga doktor ay may mga advanced na kagamitan para mas maayos na magamot ang mga pasyente. Gayunpaman, hindi natin dapat kalimutan na ang teknolohiya ay isang kasangkapan lamang at ang tao pa rin ang pinakamahalaga sa lahat.',
      wordCount: 96,
      estimatedSecs: 72,
      conceptLoad: 'moderate',
      keywords: ['siyensya','teknolohiya','impormasyon','makina','kagamitan','magsasaka','taniman','doktor','pasyente','kasangkapan'],
    },
    6: {
      id: 'fil-6-a',
      title: 'Ang Kabataan Bilang Pag-asa ng Bayan',
      text: 'Si Jose Rizal ay nagsabi na ang kabataan ang pag-asa ng bayan. Ngayon, higit kailanman, ang ganitong salita ay nananatiling totoo at mahalaga. Ang mga kabataan ng Pilipinas ay may responsibilidad na maging handa para sa kinabukasan ng ating bansa. Sa pamamagitan ng edukasyon, maaaring maabot ng bawat kabataan ang kanilang mga pangarap at makapag-ambag sa pag-unlad ng bansa. Hindi lamang kailangan ng mataas na grado kundi pati na rin ang tamang pagpapahalaga sa ating kultura, kasaysayan, at kapwa tao. Ang isang batang may malasakit sa lipunan ay isang kabataang handa nang mamuno sa hinaharap.',
      wordCount: 100,
      estimatedSecs: 75,
      conceptLoad: 'complex',
      keywords: ['kabataan','Rizal','responsibilidad','edukasyon','pangarap','pag-unlad','kultura','kasaysayan','lipunan','malasakit','hinaharap'],
    },
  },
  English: {
    3: {
      id: 'eng-3-a',
      title: 'The Little Farmer',
      text: 'Maya loved helping her grandfather on their small farm. Every morning, she would wake up early to water the plants and feed the animals. Her grandfather taught her which vegetables needed more sunlight and which ones preferred the shade. "Plants are living things," Grandfather often said. "They need care and love just like people do." Maya felt proud when she saw the tomatoes turning red and the corn growing tall. She promised to be a good farmer someday and take care of the land for her family.',
      wordCount: 84,
      estimatedSecs: 63,
      conceptLoad: 'simple',
      keywords: ['farm','grandfather','vegetables','sunlight','shade','plants','tomatoes','corn','farmer','care','love','proud'],
    },
    4: {
      id: 'eng-4-a',
      title: 'The Power of Teamwork',
      text: 'The school science fair was two weeks away and Ramon\'s group had a problem. Each member wanted to build a different project. Ramon wanted to make a volcano, while his partner Cris insisted on building a solar system model. Their third member, Alice, wanted to demonstrate how plants make food from sunlight. After arguing for a whole week, their teacher suggested they combine all three ideas into one big project about the Earth and sun. They worked together and won second place at the fair. The experience taught them that teamwork is more powerful than working alone.',
      wordCount: 97,
      estimatedSecs: 73,
      conceptLoad: 'moderate',
      keywords: ['science','fair','volcano','solar','demonstrate','photosynthesis','teamwork','combine','experience','powerful'],
    },
    5: {
      id: 'eng-5-a',
      title: 'Protecting Our Oceans',
      text: 'Our oceans cover more than seventy percent of the Earth\'s surface and are home to millions of different species of plants and animals. They also produce much of the oxygen we breathe and help regulate the world\'s climate. However, human activities such as overfishing, pollution, and plastic dumping are seriously threatening ocean life. Scientists estimate that more than eight million tons of plastic enter the oceans every year. To protect our oceans, governments and communities around the world are working together to reduce pollution, limit fishing, and create protected marine areas where sea creatures can safely recover.',
      wordCount: 97,
      estimatedSecs: 73,
      conceptLoad: 'moderate',
      keywords: ['oceans','species','oxygen','climate','overfishing','pollution','plastic','scientists','marine','communities','protect'],
    },
    6: {
      id: 'eng-6-a',
      title: 'Climate Change and Our Future',
      text: 'Climate change is one of the most serious challenges facing our planet today. The average temperature of the Earth has risen by about one degree Celsius over the past century, mainly due to the burning of fossil fuels like coal, oil, and gas. This warming is causing glaciers to melt, sea levels to rise, and weather patterns to become more extreme. In the Philippines, this means stronger typhoons, longer droughts, and flooding of coastal communities. Young people today will inherit these problems, which is why scientists and leaders are urging them to take action through renewable energy, conservation, and sustainable living.',
      wordCount: 101,
      estimatedSecs: 76,
      conceptLoad: 'complex',
      keywords: ['climate','temperature','fossil','fuels','glaciers','typhoons','droughts','renewable','conservation','sustainable','inheritance'],
    },
  },
};

// ── Comprehension Questions (8 per grade/language, 2 per parameter) ────────────

export const COMP_QUESTIONS: Record<Language, Record<GradeLevel, CompQuestion[]>> = {
  Filipino: {
    3: [
      // Literal Recall (param 4) × 2
      { question: 'Ano ang tinutanim ni Lola Rosa sa kanyang hardin?', options: ['Bulaklak, puno, at damo','Kamatis, sibuyas, at kangkong','Mangga, saging, at bayabas','Mais, patatas, at repolyo'], correctIndex: 1, skill: 'Literal Recall', parameter: 4 },
      { question: 'Sino ang tumutulong kay Lola Rosa sa hardin?', options: ['Ang kanyang asawa','Ang kanyang kapit-bahay','Si Miguel, ang kanyang apo','Ang kanyang anak na lalaki'], correctIndex: 2, skill: 'Literal Recall', parameter: 4 },
      // Vocabulary in Context (param 5) × 2
      { question: "Ang salitang 'dina-diligan' ay nangangahulugang...", options: ['Pinuputol ang mga halaman','Binibigyan ng tubig ang mga halaman','Inilipat sa ibang lugar ang halaman','Pinili ang mga malusog na halaman'], correctIndex: 1, skill: 'Vocabulary in Context', parameter: 5 },
      { question: "Ang 'pag-aalaga' sa kwento ay tumutukoy sa...", options: ['Paghahukay ng lupa','Pagbili ng abono','Pagtulong at pagbibigay ng pangangailangan','Pag-aalis ng damo sa hardin'], correctIndex: 2, skill: 'Vocabulary in Context', parameter: 5 },
      // Inference (param 6) × 2
      { question: 'Bakit natututo si Miguel tungkol sa pag-aalaga ng halaman?', options: ['Nabasa niya ito sa isang libro','Nagturo ang kanyang guro sa paaralan','Itinuro sa kanya ni Lola Rosa','Nakita niya ito sa telebisyon'], correctIndex: 2, skill: 'Inference', parameter: 6 },
      { question: 'Bakit masaya si Miguel sa kwento?', options: ['Nakakuha siya ng bagong laruan','Naalaman niya ang pag-aalaga ng halaman at ibinibigay nila ang gulay','Nagpunta siya sa parke kasama ang kanyang mga kaibigan','Natanggap siya ng premyo mula sa kanyang guro'], correctIndex: 1, skill: 'Inference', parameter: 6 },
      // Sequencing / Main Idea (param 7) × 2
      { question: 'Alin ang unang ginagawa ni Lola Rosa tuwing umaga?', options: ['Nagbibigay ng gulay sa kapitbahay','Nakikipag-usap kay Miguel','Dina-diligan ang mga halaman','Nagtatanim ng bagong halaman'], correctIndex: 2, skill: 'Sequencing / Main Idea', parameter: 7 },
      { question: 'Ano ang pangunahing paksa ng kwento?', options: ['Ang buhay ng isang magsasaka','Ang pag-aalaga ng hardin at ang aral na natutuhan','Ang mga gulay na pwedeng itanim','Ang pakikipagkaibigan sa mga kapitbahay'], correctIndex: 1, skill: 'Sequencing / Main Idea', parameter: 7 },
    ],
    4: [
      { question: 'Alin ang mga mineral na nabanggit sa kwento?', options: ['Pilak, bakal, at langis','Ginto, tanso, at uling','Rubi, esmeralda, at perlas','Pilak, ginto, at langis'], correctIndex: 1, skill: 'Literal Recall', parameter: 4 },
      { question: 'Saan matatagpuan ang mga mineral na binanggit sa kwento?', options: ['Sa kagubatan','Sa karagatan','Sa bundok at ilog','Sa ilalim ng lupa'], correctIndex: 3, skill: 'Literal Recall', parameter: 4 },
      { question: "Ang 'likas na yaman' ay tumutukoy sa...", options: ['Mga produktong gawa ng tao','Mga bagay na galing sa kalikasan at may pakinabang','Mga pera at ari-arian ng bansa','Mga gusali at kalsada'], correctIndex: 1, skill: 'Vocabulary in Context', parameter: 5 },
      { question: "Ang 'henerasyon' sa kwento ay nangangahulugang...", options: ['Grupo ng mga guro','Isang lugar sa Pilipinas','Grupo ng mga taong isinilang sa iisang panahon','Ang pamahalaan ng bansa'], correctIndex: 2, skill: 'Vocabulary in Context', parameter: 5 },
      { question: 'Bakit mahalaga na pangalagaan ang likas na yaman ng Pilipinas?', options: ['Para mas maganda ang tanawin','Para may maiwanan sa mga susunod na henerasyon','Para mas maraming turista ang bibisita','Para mas mayaman ang bansa agad'], correctIndex: 1, skill: 'Inference', parameter: 6 },
      { question: 'Paano mo malalaman na nagmamahal sa Pilipinas ang awtor?', options: ['Sabi niya sa kwento na mahal niya ang Pilipinas','Ipinakita niya ang ganda ng likas na yaman at tinawag kaming responsable','Pumunta siya sa lahat ng lugar sa Pilipinas','Nagsulat siya ng mahabang kwento tungkol sa bansa'], correctIndex: 1, skill: 'Inference', parameter: 6 },
      { question: 'Alin ang unang likas na yaman na nabanggit sa kwento?', options: ['Mineral','Karagatan','Kagubatan','Bundok at ilog'], correctIndex: 2, skill: 'Sequencing / Main Idea', parameter: 7 },
      { question: 'Ano ang pangunahing mensahe ng kwento?', options: ['Ang Pilipinas ay may maraming ginto at mineral','Dapat nating pangalagaan ang likas na yaman para sa susunod na henerasyon','Ang mga karagatan ng Pilipinas ay puno ng isda','Mahal na mahal ng mga Pilipino ang kanilang bansa'], correctIndex: 1, skill: 'Sequencing / Main Idea', parameter: 7 },
    ],
    5: [
      { question: 'Alin sa mga sumusunod ang nabanggit na tulong ng teknolohiya sa mga magsasaka?', options: ['Nagbibigay ng pera sa mga magsasaka','Nagbibigay ng modernong kagamitan para sa taniman','Nagtatayo ng mga gusali para sa magsasaka','Nagbibigay ng libreng pagkain sa mga magsasaka'], correctIndex: 1, skill: 'Literal Recall', parameter: 4 },
      { question: 'Sino ang nakinabang sa advanced na kagamitan ayon sa kwento?', options: ['Mga guro at estudyante','Mga magsasaka at doktor','Mga mangangalakal at negosyante','Mga sundalo at pulis'], correctIndex: 1, skill: 'Literal Recall', parameter: 4 },
      { question: "Ang 'kasangkapan' sa kwento ay nangangahulugang...", options: ['Isang uri ng makina','Isang bagay na ginagamit para sa isang layunin','Isang uri ng kagamitan sa bahay','Isang uri ng sasakyan'], correctIndex: 1, skill: 'Vocabulary in Context', parameter: 5 },
      { question: "Ang 'impormasyon' sa pangungusap ay tumutukoy sa...", options: ['Mga larawan at litrato','Mga datos, kaalaman, at balita','Mga produkto at kalakal','Mga tao at lugar'], correctIndex: 1, skill: 'Vocabulary in Context', parameter: 5 },
      { question: 'Bakit sinabi ng awtor na ang tao ay pinakamahalaga kahit may teknolohiya?', options: ['Dahil ang tao ay mas matalino kaysa sa makina','Dahil ang teknolohiya ay kasangkapan lamang at ang tao ang gumagamit at nagpapasya','Dahil ang mga makina ay madaling masira','Dahil mas mabilis ang tao kaysa sa makina'], correctIndex: 1, skill: 'Inference', parameter: 6 },
      { question: 'Ano ang maaaring mangyari kung wala ang teknolohiya ayon sa teksto?', options: ['Mas masaya ang buhay ng tao','Magiging mas mahirap at mabagal ang trabaho at pagkuha ng impormasyon','Magiging mas malusog ang lahat','Mas maraming oras ang magagamit para sa pamilya'], correctIndex: 1, skill: 'Inference', parameter: 6 },
      { question: 'Ano ang unang benepisyo ng teknolohiya na nabanggit sa kwento?', options: ['Nakakatulong sa mga magsasaka','Mabilis na pagkuha ng impormasyon','Nakakatulong sa mga doktor','Nagpapabilis ng trabaho'], correctIndex: 1, skill: 'Sequencing / Main Idea', parameter: 7 },
      { question: 'Ano ang pangunahing mensahe ng teksto?', options: ['Ang teknolohiya ay nakapipinsala sa kalikasan','Ang siyensya at teknolohiya ay tumutulong sa atin ngunit hindi nito mapupalitan ang kahalagahan ng tao','Mas maganda ang buhay ng tao noong walang teknolohiya','Ang mga makina ay mas matalino kaysa sa mga tao'], correctIndex: 1, skill: 'Sequencing / Main Idea', parameter: 7 },
    ],
    6: [
      { question: 'Sino ang binanggit sa kwento na nagsabi na ang kabataan ang pag-asa ng bayan?', options: ['Andres Bonifacio','Apolinario Mabini','Jose Rizal','Manuel Quezon'], correctIndex: 2, skill: 'Literal Recall', parameter: 4 },
      { question: 'Ayon sa kwento, paano maaaring mag-ambag ang kabataan sa pag-unlad ng bansa?', options: ['Sa pamamagitan ng pagtatrabaho sa ibang bansa','Sa pamamagitan ng edukasyon at tamang pagpapahalaga sa kultura','Sa pamamagitan ng pakikipaglaban sa digmaan','Sa pamamagitan ng pagiging sikat na artista'], correctIndex: 1, skill: 'Literal Recall', parameter: 4 },
      { question: "Ang 'malasakit' sa kwento ay nangangahulugang...", options: ['Takot at pangamba','Pagmamahal at pagmamalasakit sa kapwa','Galit at pagkabigo','Kasiyahan at saya'], correctIndex: 1, skill: 'Vocabulary in Context', parameter: 5 },
      { question: "Ano ang ibig sabihin ng 'responsibilidad' sa konteksto ng kwento?", options: ['Isang uri ng gawain sa paaralan','Ang tungkulin at pananagutang dapat gampanan ng kabataan','Isang uri ng pagkilos ng pamahalaan','Ang karapatang ibinibigay ng lipunan sa mga tao'], correctIndex: 1, skill: 'Vocabulary in Context', parameter: 5 },
      { question: 'Bakit hindi sapat ang mataas na grado lamang para maging tunay na kabataan ayon sa kwento?', options: ['Dahil ang grado ay hindi sukat ng talino','Dahil kailangan din ng tamang pagpapahalaga sa kultura, kasaysayan, at kapwa','Dahil ang mga grado ay madaling makuha','Dahil mas mahalaga ang karanasan kaysa sa pag-aaral'], correctIndex: 1, skill: 'Inference', parameter: 6 },
      { question: 'Ano ang ipinapakita ng pagbanggit sa quote ni Rizal sa simula ng kwento?', options: ['Ang awtor ay tagahanga ni Rizal','Ang mensahe ng pag-asa ng kabataan ay matagal nang kilala at nananatiling totoo hanggang ngayon','Ang kasaysayan ng Pilipinas ay mahalaga','Ang mga bayani ay mas matalino kaysa sa mga modernong tao'], correctIndex: 1, skill: 'Inference', parameter: 6 },
      { question: 'Alin ang unang dapat gawin ng kabataan ayon sa pagkakasunud-sunod ng kwento?', options: ['Mamuno sa lipunan','Maging handa sa pamamagitan ng edukasyon','Itaguyod ang kultura','Ipaglaban ang kanilang karapatan'], correctIndex: 1, skill: 'Sequencing / Main Idea', parameter: 7 },
      { question: 'Ano ang pangunahing mensahe ng kwento para sa mga kabataan?', options: ['Ang kabataan ay may malaking responsibilidad na pag-aralan nang mabuti at pangalagaan ang bansa para sa kinabukasan','Ang kabataan ay dapat sumunod lamang sa mga matatanda','Ang kabataan ay dapat lumabas ng bansa para matuto','Ang kabataan ay dapat magfocus lamang sa kanilang pag-aaral at huwag mag-isip ng iba'], correctIndex: 0, skill: 'Sequencing / Main Idea', parameter: 7 },
    ],
  },
  English: {
    3: [
      { question: 'What does Maya do every morning on the farm?', options: ['She sells vegetables at the market','She waters the plants and feeds the animals','She reads books about farming','She plays with her friends in the field'], correctIndex: 1, skill: 'Literal Recall', parameter: 4 },
      { question: 'Who taught Maya about farming?', options: ['Her mother','Her teacher at school','Her grandfather','Her older brother'], correctIndex: 2, skill: 'Literal Recall', parameter: 4 },
      { question: "The word 'preferred' in the story most likely means...", options: ['Hated very much','Liked more than something else','Needed to survive','Was afraid of'], correctIndex: 1, skill: 'Vocabulary in Context', parameter: 5 },
      { question: "What does 'living things' mean in Grandfather's quote?", options: ['Things that can move very fast','Things that can talk like humans','Things that are alive and can grow','Things that are very old and valuable'], correctIndex: 2, skill: 'Vocabulary in Context', parameter: 5 },
      { question: 'Why did Maya wake up early every morning?', options: ['She could not sleep because of noise','She wanted to watch the sunrise','She needed to take care of the farm animals and plants','Her grandfather always called her name early'], correctIndex: 2, skill: 'Inference', parameter: 6 },
      { question: 'How do you think Grandfather feels about farming?', options: ['He thinks it is boring and tiring work','He loves farming and wants to teach Maya to care for the land','He is too old and tired to farm anymore','He wants to sell the farm and move to the city'], correctIndex: 1, skill: 'Inference', parameter: 6 },
      { question: "What happened FIRST in the story?", options: ['Maya promised to be a good farmer someday','Maya felt proud seeing the tomatoes and corn','Maya helped grandfather water the plants','Maya learned which vegetables needed sunlight'], correctIndex: 2, skill: 'Sequencing / Main Idea', parameter: 7 },
      { question: 'What is the main idea of this story?', options: ['How to grow corn and tomatoes on a farm','Maya learning to love and care for her family farm','The different vegetables that can grow in sunlight','Why farmers must wake up very early every morning'], correctIndex: 1, skill: 'Sequencing / Main Idea', parameter: 7 },
    ],
    4: [
      { question: 'What did Ramon want to build for the science fair?', options: ['A solar system model','A demonstration of photosynthesis','A volcano','A weather station model'], correctIndex: 2, skill: 'Literal Recall', parameter: 4 },
      { question: 'What place did the group win at the science fair?', options: ['First place','Second place','Third place','They did not win any place'], correctIndex: 1, skill: 'Literal Recall', parameter: 4 },
      { question: "The word 'insisted' in the story means...", options: ['Agreed quickly and happily','Gave up on the idea for another','Strongly continued to say or want something','Forgot about the idea completely'], correctIndex: 2, skill: 'Vocabulary in Context', parameter: 5 },
      { question: "What does 'demonstrate' mean as used in the story?", options: ['To argue strongly about something','To show how something works','To write a report about something','To destroy something on purpose'], correctIndex: 1, skill: 'Vocabulary in Context', parameter: 5 },
      { question: "Why do you think the group argued for a whole week?", options: ['They did not understand the science assignment','Everyone thought their own idea was the best one','Their teacher gave them an impossible topic','They had too many materials available'], correctIndex: 1, skill: 'Inference', parameter: 6 },
      { question: "What lesson did Ramon's group learn from this experience?", options: ['Science fairs are very difficult to win','Teachers always give the best advice to students','Working as a team is more powerful than working alone','Volcanoes are the most interesting science topic'], correctIndex: 2, skill: 'Inference', parameter: 6 },
      { question: 'What happened AFTER the group argued for a week?', options: ['They decided to build the volcano only','Their teacher suggested they combine their three ideas','They asked their parents for extra help','They gave up on the project entirely'], correctIndex: 1, skill: 'Sequencing / Main Idea', parameter: 7 },
      { question: 'What is the main message of this story?', options: ['Science projects are the most important school activity','Teamwork and combining ideas can lead to better results than working alone','Good friends never argue with each other ever','Teachers always know best about every school project'], correctIndex: 1, skill: 'Sequencing / Main Idea', parameter: 7 },
    ],
    5: [
      { question: 'What percentage of the Earth\'s surface do oceans cover according to the text?', options: ['More than fifty percent','More than sixty percent','More than seventy percent','More than eighty percent'], correctIndex: 2, skill: 'Literal Recall', parameter: 4 },
      { question: 'How much plastic do scientists estimate enters the oceans every year?', options: ['More than five million tons','More than six million tons','More than seven million tons','More than eight million tons'], correctIndex: 3, skill: 'Literal Recall', parameter: 4 },
      { question: "The word 'regulate' in the text most likely means...", options: ['To destroy something completely','To control or keep something balanced','To create something new from scratch','To measure the size of something'], correctIndex: 1, skill: 'Vocabulary in Context', parameter: 5 },
      { question: "What does 'threatened' mean in 'seriously threatening ocean life'?", options: ['Helping ocean life grow stronger','Putting ocean life in danger','Teaching ocean creatures new skills','Counting the ocean creatures carefully'], correctIndex: 1, skill: 'Vocabulary in Context', parameter: 5 },
      { question: 'Why are governments and communities working together to protect the oceans?', options: ['To make more money from fishing activities','Because no single country can solve ocean pollution alone','To attract more tourists to the beaches','Because ocean animals are very beautiful to see'], correctIndex: 1, skill: 'Inference', parameter: 6 },
      { question: 'What can you conclude about plastic pollution in the oceans?', options: ['It is a small problem that can easily be fixed soon','It is a very serious problem that requires urgent global action','It only affects animals that live near the shore','It started only recently in the past few years'], correctIndex: 1, skill: 'Inference', parameter: 6 },
      { question: 'In what order does the text present the information?', options: ['Solutions first, then problems, then facts about oceans','Facts about oceans, then problems threatening them, then solutions','Problems first, then solutions, then facts about oceans','Solutions, then facts, then problems about oceans'], correctIndex: 1, skill: 'Sequencing / Main Idea', parameter: 7 },
      { question: 'What is the main purpose of this text?', options: ['To explain how oceans were formed on Earth','To inform readers about ocean threats and the need to protect them','To describe all the different sea creatures in the ocean','To persuade people to stop eating fish and seafood'], correctIndex: 1, skill: 'Sequencing / Main Idea', parameter: 7 },
    ],
    6: [
      { question: 'By how much has the average Earth temperature risen over the past century?', options: ['About half a degree Celsius','About one degree Celsius','About two degrees Celsius','About three degrees Celsius'], correctIndex: 1, skill: 'Literal Recall', parameter: 4 },
      { question: 'What does climate change cause in the Philippines specifically according to the text?', options: ['Colder winters and snowfall in the mountains','Stronger typhoons, longer droughts, and coastal flooding','More rainfall but fewer storms each year','Better harvests and more fertile farmland'], correctIndex: 1, skill: 'Literal Recall', parameter: 4 },
      { question: "The word 'inherit' as used in the text means...", options: ['To cause a problem for future people','To receive something passed down from those who came before','To solve a difficult problem completely','To study something in great detail'], correctIndex: 1, skill: 'Vocabulary in Context', parameter: 5 },
      { question: "What does 'sustainable' mean in 'sustainable living'?", options: ['Living in a very expensive way','Living in a way that can continue without harming the future','Living as simply and minimally as possible','Living without using any modern technology at all'], correctIndex: 1, skill: 'Vocabulary in Context', parameter: 5 },
      { question: 'Why does the text say young people must take action on climate change?', options: ['Because they are stronger and faster than older people','Because they will inherit the planet and live with the long-term consequences','Because they have more free time to work on environmental projects','Because governments and leaders have already given up on solving it'], correctIndex: 1, skill: 'Inference', parameter: 6 },
      { question: 'What does the author think about fossil fuels based on the text?', options: ['They are necessary and we cannot live without them ever','They are the main cause of rising temperatures and need to be replaced','They are safe to use as long as we use them carefully','They only affect countries with cold weather and glaciers'], correctIndex: 1, skill: 'Inference', parameter: 6 },
      { question: 'What happens FIRST in the chain of events described in the text?', options: ['Sea levels rise and coastal communities flood','Glaciers melt and weather becomes extreme','Fossil fuels are burned, causing temperature to rise','Young people are urged to use renewable energy'], correctIndex: 2, skill: 'Sequencing / Main Idea', parameter: 7 },
      { question: 'What is the central message of this text?', options: ['Climate change is happening and young people must take action through renewable energy and sustainable living','All countries should stop using fossil fuels immediately and permanently','The Philippines is the most affected country by climate change in the world','Scientists and leaders have already solved the problem of climate change together'], correctIndex: 0, skill: 'Sequencing / Main Idea', parameter: 7 },
    ],
  },
};

// ── Demo fluency results (used in assessment flow simulation) ─────────────────

export const DEMO_FLUENCY_RESULTS: Record<Language, { wcpm: number; accuracy: number; fluencySubskills: FluencySubskill[] }> = {
  Filipino: {
    wcpm: 72,
    accuracy: 82,
    fluencySubskills: [
      flu('Decoding / Phonics', 'Weak', true),
      flu('Syllable Blending', 'Weak', false),
      flu('Sight Words', 'Strong', false),
      flu('Pacing & Accuracy', 'Strong', false),
    ],
  },
  English: {
    wcpm: 88,
    accuracy: 86,
    fluencySubskills: [
      flu('Decoding / Phonics', 'Strong', false),
      flu('Syllable Blending', 'Weak', true),
      flu('Sight Words', 'Weak', false),
      flu('Pacing & Accuracy', 'Strong', false),
    ],
  },
};

// ── Seeded Student Roster (Grade 4 — Section Rizal) ───────────────────────────

export const MOCK_STUDENTS: Student[] = [
  {
    id: 1, name: 'Juan dela Cruz', grade: 4, section: 'Rizal',
    parentEmail: 'jdelacruz.parent@email.com', consentStatus: 'confirmed', enrolledDate: 'Jun 1, 2026',
    filipino: lang('red', 62, 68, 'Decoding / Phonics', 'Phonics drills · letter-sound mapping',
      [flu('Decoding / Phonics','Weak',true), flu('Syllable Blending','Weak'), flu('Sight Words','Weak'), flu('Pacing & Accuracy','Weak')],
      [comp('Literal Recall',4,'Incorrect'), comp('Vocabulary in Context',5,'Incorrect'), comp('Inference',6,'Incorrect'), comp('Sequencing / Main Idea',7,'Incorrect')],
      'Jun 24, 2026', true),
    english: lang('red', 58, 65, 'Decoding / Phonics', 'Phonics drills · letter-sound mapping',
      [flu('Decoding / Phonics','Weak',true), flu('Syllable Blending','Weak'), flu('Sight Words','Weak'), flu('Pacing & Accuracy','Weak')],
      [comp('Literal Recall',4,'Incorrect'), comp('Vocabulary in Context',5,'Incorrect'), comp('Inference',6,'Incorrect'), comp('Sequencing / Main Idea',7,'Incorrect')],
      'Jun 24, 2026', true),
  },
  {
    id: 2, name: 'Maria Santos', grade: 4, section: 'Rizal',
    parentEmail: 'msantos.parent@email.com', consentStatus: 'confirmed', enrolledDate: 'Jun 1, 2026',
    filipino: lang('green', 98, 97, 'None', 'Enrichment reading · independent reading log',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Strong'), flu('Sight Words','Strong'), flu('Pacing & Accuracy','Strong')],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Correct'), comp('Inference',6,'Correct'), comp('Sequencing / Main Idea',7,'Correct')],
      'Jun 24, 2026'),
    english: lang('yellow-comprehension', 104, 94, 'Inference', 'Inference exercises · think-aloud strategy',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Strong'), flu('Sight Words','Strong'), flu('Pacing & Accuracy','Strong')],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Correct'), comp('Inference',6,'Incorrect',true), comp('Sequencing / Main Idea',7,'Incorrect')],
      'Jun 24, 2026'),
  },
  {
    id: 3, name: 'Carlo Reyes', grade: 4, section: 'Rizal',
    parentEmail: 'creyes.parent@email.com', consentStatus: 'confirmed', enrolledDate: 'Jun 1, 2026',
    filipino: lang('yellow-fluency', 78, 83, 'Syllable Blending', 'Blending drills · syllable segmentation',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Weak',true), flu('Sight Words','Weak'), flu('Pacing & Accuracy','Weak')],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Correct'), comp('Inference',6,'Correct'), comp('Sequencing / Main Idea',7,'Correct')],
      'Jun 23, 2026'),
    english: lang('red', 68, 72, 'Syllable Blending', 'Blending drills · syllable segmentation',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Weak',true), flu('Sight Words','Weak'), flu('Pacing & Accuracy','Weak')],
      [comp('Literal Recall',4,'Incorrect'), comp('Vocabulary in Context',5,'Incorrect'), comp('Inference',6,'Incorrect'), comp('Sequencing / Main Idea',7,'Incorrect')],
      'Jun 23, 2026', true),
  },
  {
    id: 4, name: 'Ana Bautista', grade: 4, section: 'Rizal',
    parentEmail: 'abautista.parent@email.com', consentStatus: 'confirmed', enrolledDate: 'Jun 1, 2026',
    filipino: lang('green', 102, 96, 'None', 'Enrichment reading · independent reading log',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Strong'), flu('Sight Words','Strong'), flu('Pacing & Accuracy','Strong')],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Correct'), comp('Inference',6,'Correct'), comp('Sequencing / Main Idea',7,'Correct')],
      'Jun 23, 2026'),
    english: lang('green', 108, 95, 'None', 'Enrichment reading · independent reading log',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Strong'), flu('Sight Words','Strong'), flu('Pacing & Accuracy','Strong')],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Correct'), comp('Inference',6,'Correct'), comp('Sequencing / Main Idea',7,'Correct')],
      'Jun 23, 2026'),
  },
  {
    id: 5, name: 'Luis Garcia', grade: 4, section: 'Rizal',
    parentEmail: 'lgarcia.parent@email.com', consentStatus: 'confirmed', enrolledDate: 'Jun 1, 2026',
    filipino: lang('yellow-comprehension', 97, 92, 'Sequencing / Main Idea', 'Sequencing drills · story mapping',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Strong'), flu('Sight Words','Strong'), flu('Pacing & Accuracy','Strong')],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Correct'), comp('Inference',6,'Correct'), comp('Sequencing / Main Idea',7,'Incorrect',true)],
      'Jun 22, 2026'),
    english: lang('yellow-fluency', 82, 85, 'Sight Words', 'Sight word flashcard drills · high-frequency word practice',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Strong'), flu('Sight Words','Weak',true), flu('Pacing & Accuracy','Weak')],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Correct'), comp('Inference',6,'Correct'), comp('Sequencing / Main Idea',7,'Correct')],
      'Jun 22, 2026'),
  },
  {
    id: 6, name: 'Sofia Mendoza', grade: 4, section: 'Rizal',
    parentEmail: 'smendoza.parent@email.com', consentStatus: 'confirmed', enrolledDate: 'Jun 1, 2026',
    filipino: lang('red', 68, 71, 'Decoding / Phonics', 'Phonics drills · letter-sound mapping',
      [flu('Decoding / Phonics','Weak',true), flu('Syllable Blending','Weak'), flu('Sight Words','Weak'), flu('Pacing & Accuracy','Weak')],
      [comp('Literal Recall',4,'Incorrect'), comp('Vocabulary in Context',5,'Incorrect'), comp('Inference',6,'Incorrect'), comp('Sequencing / Main Idea',7,'Incorrect')],
      'Jun 22, 2026', true),
    english: lang('yellow-comprehension', 101, 93, 'Vocabulary in Context', 'Vocabulary exercises · word-meaning context',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Strong'), flu('Sight Words','Strong'), flu('Pacing & Accuracy','Strong')],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Incorrect',true), comp('Inference',6,'Incorrect'), comp('Sequencing / Main Idea',7,'Incorrect')],
      'Jun 22, 2026'),
  },
  {
    id: 7, name: 'Marco Villanueva', grade: 4, section: 'Rizal',
    parentEmail: 'mvillanueva.parent@email.com', consentStatus: 'confirmed', enrolledDate: 'Jun 1, 2026',
    filipino: lang('green', 105, 98, 'None', 'Enrichment reading · independent reading log',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Strong'), flu('Sight Words','Strong'), flu('Pacing & Accuracy','Strong')],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Correct'), comp('Inference',6,'Correct'), comp('Sequencing / Main Idea',7,'Correct')],
      'Jun 21, 2026'),
    english: lang('yellow-fluency', 84, 86, 'Pacing & Accuracy', 'Repeated reading · timed reading practice',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Strong'), flu('Sight Words','Strong'), flu('Pacing & Accuracy','Weak',true)],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Correct'), comp('Inference',6,'Correct'), comp('Sequencing / Main Idea',7,'Correct')],
      'Jun 21, 2026'),
  },
  {
    id: 8, name: 'Lea Ramos', grade: 4, section: 'Rizal',
    parentEmail: 'lramos.parent@email.com', consentStatus: 'confirmed', enrolledDate: 'Jun 1, 2026',
    filipino: lang('yellow-fluency', 74, 80, 'Decoding / Phonics', 'Phonics drills · decodable readers',
      [flu('Decoding / Phonics','Weak',true), flu('Syllable Blending','Weak'), flu('Sight Words','Strong'), flu('Pacing & Accuracy','Weak')],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Correct'), comp('Inference',6,'Correct'), comp('Sequencing / Main Idea',7,'Correct')],
      'Jun 21, 2026'),
    english: lang('red', 61, 67, 'Decoding / Phonics', 'Phonics drills · letter-sound mapping',
      [flu('Decoding / Phonics','Weak',true), flu('Syllable Blending','Weak'), flu('Sight Words','Weak'), flu('Pacing & Accuracy','Weak')],
      [comp('Literal Recall',4,'Incorrect'), comp('Vocabulary in Context',5,'Incorrect'), comp('Inference',6,'Incorrect'), comp('Sequencing / Main Idea',7,'Incorrect')],
      'Jun 21, 2026', true),
  },
  {
    id: 9, name: 'Paolo Torres', grade: 4, section: 'Rizal',
    parentEmail: 'ptorres.parent@email.com', consentStatus: 'confirmed', enrolledDate: 'Jun 1, 2026',
    filipino: lang('green', 100, 96, 'None', 'Enrichment reading · independent reading log',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Strong'), flu('Sight Words','Strong'), flu('Pacing & Accuracy','Strong')],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Correct'), comp('Inference',6,'Correct'), comp('Sequencing / Main Idea',7,'Correct')],
      'Jun 20, 2026'),
    english: lang('green', 106, 95, 'None', 'Enrichment reading · independent reading log',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Strong'), flu('Sight Words','Strong'), flu('Pacing & Accuracy','Strong')],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Correct'), comp('Inference',6,'Correct'), comp('Sequencing / Main Idea',7,'Correct')],
      'Jun 20, 2026'),
  },
  {
    id: 10, name: 'Nina Cruz', grade: 4, section: 'Rizal',
    parentEmail: 'ncruz.parent@email.com', consentStatus: 'confirmed', enrolledDate: 'Jun 1, 2026',
    filipino: lang('red', 66, 72, 'Syllable Blending', 'Blending drills · onset-rime activities',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Weak',true), flu('Sight Words','Weak'), flu('Pacing & Accuracy','Weak')],
      [comp('Literal Recall',4,'Incorrect'), comp('Vocabulary in Context',5,'Incorrect'), comp('Inference',6,'Incorrect'), comp('Sequencing / Main Idea',7,'Incorrect')],
      'Jun 20, 2026', true),
    english: lang('red', 60, 68, 'Syllable Blending', 'Blending drills · onset-rime activities',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Weak',true), flu('Sight Words','Weak'), flu('Pacing & Accuracy','Weak')],
      [comp('Literal Recall',4,'Incorrect'), comp('Vocabulary in Context',5,'Incorrect'), comp('Inference',6,'Incorrect'), comp('Sequencing / Main Idea',7,'Incorrect')],
      'Jun 20, 2026', true),
  },
  {
    id: 11, name: 'Diego Aquino', grade: 4, section: 'Rizal',
    parentEmail: 'daquino.parent@email.com', consentStatus: 'confirmed', enrolledDate: 'Jun 1, 2026',
    filipino: lang('yellow-comprehension', 96, 94, 'Inference', 'Inference exercises · prediction activities',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Strong'), flu('Sight Words','Strong'), flu('Pacing & Accuracy','Strong')],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Correct'), comp('Inference',6,'Incorrect',true), comp('Sequencing / Main Idea',7,'Correct')],
      'Jun 19, 2026'),
    english: lang('green', 108, 96, 'None', 'Enrichment reading · independent reading log',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Strong'), flu('Sight Words','Strong'), flu('Pacing & Accuracy','Strong')],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Correct'), comp('Inference',6,'Correct'), comp('Sequencing / Main Idea',7,'Correct')],
      'Jun 19, 2026'),
  },
  {
    id: 12, name: 'Rosa Navarro', grade: 4, section: 'Rizal',
    parentEmail: 'rnavarro.parent@email.com', consentStatus: 'confirmed', enrolledDate: 'Jun 1, 2026',
    filipino: lang('green', 103, 97, 'None', 'Enrichment reading · independent reading log',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Strong'), flu('Sight Words','Strong'), flu('Pacing & Accuracy','Strong')],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Correct'), comp('Inference',6,'Correct'), comp('Sequencing / Main Idea',7,'Correct')],
      'Jun 19, 2026'),
    english: lang('yellow-comprehension', 102, 93, 'Sequencing / Main Idea', 'Sequencing drills · story mapping',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Strong'), flu('Sight Words','Strong'), flu('Pacing & Accuracy','Strong')],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Correct'), comp('Inference',6,'Correct'), comp('Sequencing / Main Idea',7,'Incorrect',true)],
      'Jun 19, 2026'),
  },
  {
    id: 13, name: 'Lito Fernandez', grade: 4, section: 'Rizal',
    parentEmail: 'lfernandez.parent@email.com', consentStatus: 'pending', enrolledDate: 'Jun 2, 2026',
    filipino: lang('red', 65, 70, 'Decoding / Phonics', 'Phonics drills · letter-sound mapping',
      [flu('Decoding / Phonics','Weak',true), flu('Syllable Blending','Weak'), flu('Sight Words','Weak'), flu('Pacing & Accuracy','Weak')],
      [comp('Literal Recall',4,'Incorrect'), comp('Vocabulary in Context',5,'Incorrect'), comp('Inference',6,'Incorrect'), comp('Sequencing / Main Idea',7,'Incorrect')],
      'Jun 18, 2026', true),
    english: lang('yellow-comprehension', 98, 91, 'Literal Recall', 'Recall drills · retelling activities',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Strong'), flu('Sight Words','Strong'), flu('Pacing & Accuracy','Strong')],
      [comp('Literal Recall',4,'Incorrect',true), comp('Vocabulary in Context',5,'Incorrect'), comp('Inference',6,'Correct'), comp('Sequencing / Main Idea',7,'Correct')],
      'Jun 18, 2026'),
  },
  {
    id: 14, name: 'Carla Magsaysay', grade: 4, section: 'Rizal',
    parentEmail: 'cmagsaysay.parent@email.com', consentStatus: 'confirmed', enrolledDate: 'Jun 1, 2026',
    filipino: lang('yellow-fluency', 76, 82, 'Sight Words', 'Sight word flashcard drills · high-frequency word practice',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Strong'), flu('Sight Words','Weak',true), flu('Pacing & Accuracy','Weak')],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Correct'), comp('Inference',6,'Correct'), comp('Sequencing / Main Idea',7,'Correct')],
      'Jun 18, 2026'),
    english: lang('green', 105, 96, 'None', 'Enrichment reading · independent reading log',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Strong'), flu('Sight Words','Strong'), flu('Pacing & Accuracy','Strong')],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Correct'), comp('Inference',6,'Correct'), comp('Sequencing / Main Idea',7,'Correct')],
      'Jun 18, 2026'),
  },
  {
    id: 15, name: 'Ben Ocampo', grade: 4, section: 'Rizal',
    parentEmail: 'bocampo.parent@email.com', consentStatus: 'confirmed', enrolledDate: 'Jun 1, 2026',
    filipino: lang('yellow-comprehension', 96, 93, 'Vocabulary in Context', 'Vocabulary exercises · semantic mapping',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Strong'), flu('Sight Words','Strong'), flu('Pacing & Accuracy','Strong')],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Incorrect',true), comp('Inference',6,'Incorrect'), comp('Sequencing / Main Idea',7,'Correct')],
      'Jun 17, 2026'),
    english: lang('yellow-fluency', 80, 84, 'Pacing & Accuracy', 'Repeated reading · timed reading practice',
      [flu('Decoding / Phonics','Strong'), flu('Syllable Blending','Strong'), flu('Sight Words','Strong'), flu('Pacing & Accuracy','Weak',true)],
      [comp('Literal Recall',4,'Correct'), comp('Vocabulary in Context',5,'Correct'), comp('Inference',6,'Correct'), comp('Sequencing / Main Idea',7,'Correct')],
      'Jun 17, 2026'),
  },
];

// ── Schools (Analytics) ───────────────────────────────────────────────────────

export const MOCK_SCHOOLS: School[] = [
  {
    id: 1, name: 'Mabini Elementary School', division: 'NCR — Manila',
    studentsAssessed: 312, totalEnrolled: 380,
    filipinoGreen: 38, englishGreen: 29, mostCommonGap: 'Decoding / Phonics',
    classes: [
      { name: 'Grade 3 — Pag-asa', students: 42, filipinoGreen: 31, englishGreen: 22 },
      { name: 'Grade 4 — Rizal', students: 38, filipinoGreen: 40, englishGreen: 31 },
      { name: 'Grade 5 — Mabini', students: 40, filipinoGreen: 44, englishGreen: 35 },
      { name: 'Grade 6 — Bonifacio', students: 45, filipinoGreen: 38, englishGreen: 28 },
    ],
  },
  {
    id: 2, name: 'Rizal Elementary School', division: 'NCR — Quezon City',
    studentsAssessed: 289, totalEnrolled: 320,
    filipinoGreen: 54, englishGreen: 41, mostCommonGap: 'Inference',
    classes: [
      { name: 'Grade 3 — Kalayaan', students: 39, filipinoGreen: 46, englishGreen: 33 },
      { name: 'Grade 4 — Bayan', students: 37, filipinoGreen: 54, englishGreen: 40 },
      { name: 'Grade 5 — Luzon', students: 41, filipinoGreen: 56, englishGreen: 45 },
      { name: 'Grade 6 — Pilipinas', students: 44, filipinoGreen: 59, englishGreen: 46 },
    ],
  },
  {
    id: 3, name: 'Bonifacio Elementary School', division: 'Region IV-A — Laguna',
    studentsAssessed: 274, totalEnrolled: 310,
    filipinoGreen: 47, englishGreen: 33, mostCommonGap: 'Syllable Blending',
    classes: [
      { name: 'Grade 3 — Gumamela', students: 38, filipinoGreen: 39, englishGreen: 26 },
      { name: 'Grade 4 — Rosal', students: 36, filipinoGreen: 47, englishGreen: 33 },
      { name: 'Grade 5 — Sampaguita', students: 40, filipinoGreen: 50, englishGreen: 38 },
      { name: 'Grade 6 — Waling-waling', students: 43, filipinoGreen: 53, englishGreen: 40 },
    ],
  },
];

// ── Parameter frequency for analytics ────────────────────────────────────────

export const PARAM_FREQUENCY = {
  Filipino: [
    { param: 'Decoding / Phonics',       count: 87, parameter: 1 },
    { param: 'Syllable Blending',         count: 64, parameter: 2 },
    { param: 'Sight Words',               count: 52, parameter: 3 },
    { param: 'Literal Recall',            count: 71, parameter: 4 },
    { param: 'Vocabulary in Context',     count: 83, parameter: 5 },
    { param: 'Inference',                 count: 94, parameter: 6 },
    { param: 'Sequencing / Main Idea',    count: 61, parameter: 7 },
  ],
  English: [
    { param: 'Decoding / Phonics',        count: 72, parameter: 1 },
    { param: 'Syllable Blending',         count: 58, parameter: 2 },
    { param: 'Sight Words',               count: 44, parameter: 3 },
    { param: 'Literal Recall',            count: 65, parameter: 4 },
    { param: 'Vocabulary in Context',     count: 78, parameter: 5 },
    { param: 'Inference',                 count: 99, parameter: 6 },
    { param: 'Sequencing / Main Idea',    count: 55, parameter: 7 },
  ],
};

// ── Assessment cycles (for progress over time) ────────────────────────────────

export const ASSESSMENT_CYCLES = [
  { cycle: 'Pretest', filipinoGreen: 28, filipinoYellow: 34, filipinoRed: 38, englishGreen: 21, englishYellow: 31, englishRed: 48 },
  { cycle: 'Midterm', filipinoGreen: 38, filipinoYellow: 36, filipinoRed: 26, englishGreen: 31, englishYellow: 34, englishRed: 35 },
  { cycle: 'Posttest', filipinoGreen: 51, filipinoYellow: 31, filipinoRed: 18, englishGreen: 42, englishYellow: 33, englishRed: 25 },
];

// ── Tier Config ────────────────────────────────────────────────────────────────

export const TIER_CONFIG: Record<Tier, {
  label: string;
  sublabel?: string;
  icon: string;
  bgClass: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  lightBg: string;
  borderClass: string;
  textClass: string;
  hex: string;
  emoji: string;
}> = {
  green: {
    label: 'On Track', icon: '✓', emoji: '🟢',
    bgClass: 'bg-emerald-500', hex: '#10B981',
    badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-800', badgeBorder: 'border-emerald-200',
    lightBg: 'bg-emerald-50', borderClass: 'border-emerald-200', textClass: 'text-emerald-700',
  },
  'yellow-fluency': {
    label: 'Yellow — Fluency', sublabel: 'Fluency focus', icon: '~', emoji: '🟡',
    bgClass: 'bg-amber-400', hex: '#F59E0B',
    badgeBg: 'bg-amber-100', badgeText: 'text-amber-800', badgeBorder: 'border-amber-200',
    lightBg: 'bg-amber-50', borderClass: 'border-amber-200', textClass: 'text-amber-700',
  },
  'yellow-comprehension': {
    label: 'Yellow — Comprehension', sublabel: 'Comprehension focus', icon: '~', emoji: '🟡',
    bgClass: 'bg-amber-400', hex: '#F59E0B',
    badgeBg: 'bg-amber-100', badgeText: 'text-amber-800', badgeBorder: 'border-amber-200',
    lightBg: 'bg-amber-50', borderClass: 'border-amber-200', textClass: 'text-amber-700',
  },
  red: {
    label: 'Needs Support', icon: '!', emoji: '🔴',
    bgClass: 'bg-rose-500', hex: '#F43F5E',
    badgeBg: 'bg-rose-100', badgeText: 'text-rose-800', badgeBorder: 'border-rose-200',
    lightBg: 'bg-rose-50', borderClass: 'border-rose-200', textClass: 'text-rose-700',
  },
};
