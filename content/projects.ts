export type Avenue =
  | "Club Service"
  | "Community Service"
  | "Professional Service"
  | "International Service"
  | "District Priority";

export type Project = {
  title: string;
  avenue: Avenue;
  description: string;
  image: string;
};

export const avenues: {
  key: Avenue;
  slug: string;
  accent: "starlight" | "comet" | "nebula" | "cranberry";
  blurb: string;
}[] = [
  { key: "Club Service", slug: "club", accent: "starlight", blurb: "Fellowship, leadership, and the bonds that make Gaalaxy a family — from installation ceremonies to spontaneous getaways." },
  { key: "Community Service", slug: "community", accent: "cranberry", blurb: "Hands-on impact for Coimbatore — blood drives, insulin support for children, care for mothers, elders, and the homeless." },
  { key: "Professional Service", slug: "professional", accent: "comet", blurb: "Careers, skills, and self-discovery — sessions, contests, and programs that sharpen young professionals." },
  { key: "International Service", slug: "international", accent: "nebula", blurb: "Friendship without borders — exchanges, collaborations, and joint initiatives across districts and countries." },
  { key: "District Priority", slug: "district", accent: "starlight", blurb: "Initiatives aligned with RI District 3206 themes — DREAM, MannShakti, Embrace, Hi5, and beyond." },
];

const club: Project[] = [
  { title: "Gaala Kudumbam", avenue: "Club Service", description: "Gaala Kudumbam was a warm, informal gathering filled with conversations, laughter, and togetherness, made even more special by celebrating Rtr. Shruthinaya's birthday.", image: "/images/projects/club/01.jpg" },
  { title: "Chill & Skill", avenue: "Club Service", description: "Chill & Skill was a lively turf-game event at Rathinam Sports Academy that got everyone active while promoting teamwork and fun.", image: "/images/projects/club/02.jpg" },
  { title: "Chaat & Chat", avenue: "Club Service", description: "Chaat & Chat was a casual, fun meetup where members enjoyed tasty chaat and connected through meaningful, personal conversations.", image: "/images/projects/club/03.jpg" },
  { title: "Yatra", avenue: "Club Service", description: "Yatra was a soulful spiritual journey to Thiruvannamalai, where members experienced the sacred Annamalaiyar Temple and the cherished tradition of Girivalam.", image: "/images/projects/club/04.jpg" },
  { title: "Turf Rush", avenue: "Club Service", description: "Turf Rush was an energetic cricket showdown where members of the Rotaract Clubs of Coimbatore Gaalaxy and HICAS came together for a spirited match at V46 Turf.", image: "/images/projects/club/05.jpg" },
  { title: "Solitaire", avenue: "Club Service", description: "Solitaire, the 15th Installation Ceremony, celebrated the leadership transition from Rtr. Samyuktha to Rtr. Srivarshan for 2025–26, witnessed by over 100 attendees at Siruthuli Hall.", image: "/images/projects/club/06.jpg" },
  { title: "Gaala Kudumbam Phase 2", avenue: "Club Service", description: "Gaala Kudumbam Phase 2 was a heartfelt farewell evening honoring our Immediate Past President as she embarked on her new journey abroad.", image: "/images/projects/club/07.jpg" },
  { title: "Desandhiri", avenue: "Club Service", description: "Desandhiri was a joyful one-day trip to Ooty, filled with music, great food, laughter, and a memorable birthday celebration for Rtn. Rtr. Jayakishore.", image: "/images/projects/club/08.jpg" },
  { title: "Aravam", avenue: "Club Service", description: "ARAVAM 2025 was a vibrant Onam celebration uniting over 200 participants through authentic traditions, lively games, music, and cultural highlights, radiating joy, unity, and festive spirit.", image: "/images/projects/club/09.jpg" },
  { title: "Gaala Kudumbam Phase 3", avenue: "Club Service", description: "Gaala Kudumbam Phase 3 was a personalised outreach initiative that rekindled member engagement by reinforcing fellowship, empathy, and the sense of family at the heart of the club.", image: "/images/projects/club/10.jpg" },
  { title: "Ctrl + S", avenue: "Club Service", description: "Ctrl + S was a members' official visit focused on organising and streamlining club records, turning documentation and teamwork into a productive, coffee-filled session.", image: "/images/projects/club/11.jpg" },
  { title: "Echoes", avenue: "Club Service", description: "Echoes was a Child Centric Month activity featuring a 'Guess Who' challenge with members' childhood photos, supported by engaging Instagram content that strengthened bonds.", image: "/images/projects/club/12.jpg" },
  { title: "Picklympics", avenue: "Club Service", description: "Picklympics was a lively pickleball-themed event that brought members together for fun, bonding, and friendly matches in an energetic atmosphere.", image: "/images/projects/club/13.jpg" },
  { title: "Ace", avenue: "Club Service", description: "ACE was an engaging General Rotaract Orientation session led by Rtr. PP Srinath, offering new insights, refreshing member knowledge, and fostering learning and growth.", image: "/images/projects/club/14.jpg" },
  { title: "Arena", avenue: "Club Service", description: "ARENA was an interactive game stall blending fun carnival games with lively engagement, creating an energetic space filled with excitement and participation for all ages.", image: "/images/projects/club/15.jpg" },
  { title: "The One", avenue: "Club Service", description: "The One was an exclusive Group 1 brunch meet where Rotaractors came together for good food, meaningful conversations, and vibrant fellowship under the guidance of Rtr. PP Hari Prasath.", image: "/images/projects/club/16.jpg" },
  { title: "Illuminate", avenue: "Club Service", description: "Illuminate was a heartfelt Diwali celebration that spread light, joy, and togetherness among the children of Anaikatti's tribal village through diya lighting, fun activities, and festive sharing.", image: "/images/projects/club/17.jpg" },
  { title: "Pitch & Catch", avenue: "Club Service", description: "PITCH & CATCH was a high-energy Pickleball evening that blended fun, fitness, and fellowship, bringing Rotaractors together for a lively sporting experience.", image: "/images/projects/club/18.jpg" },
  { title: "Connect", avenue: "Club Service", description: "The DRR Official Visit, Connect, was conducted with active participation from members, office bearers, and district representatives. The DRR reviewed activities and documentation, and offered valuable suggestions for future growth.", image: "/images/projects/club/19.jpg" },
  { title: "Gaala Genesis", avenue: "Club Service", description: "The 17th Charter Day of the Rotaract Club of Coimbatore Gaalaxy was celebrated at Party Hub, Saravanampatti, with members across batches. Reflections from past presidents highlighted the club's growth, followed by a fellowship lunch.", image: "/images/projects/club/20.jpg" },
  { title: "Thera Ulaa", avenue: "Club Service", description: "Thera Ulaa was a surprise getaway redirected from Kava Island to Chavakkad Beach. 12 members enjoyed a day filled with travel, bonding, and shared experiences — including a special birthday celebration for Rtr. Nikesh.", image: "/images/projects/club/21.jpg" },
  { title: "Ilamai Itho Itho 2.0", avenue: "Club Service", description: "Ilamai Itho Itho 2.0 is a high-energy New Year celebration jointly organised by 7 Rotaract clubs including Coimbatore Gaalaxy, celebrating unity, positivity, and an energetic start to the year ahead.", image: "/images/projects/club/22.jpg" },
  { title: "Field & Friends", avenue: "Club Service", description: "FIELD & FRIENDS was a sports and fellowship initiative organised with Rotaract Clubs of Coimbatore Cosmopolitan and Coimbatore Unicorns at Kovai Kalam. It strengthened fellowship, unity, and inter-club bonding.", image: "/images/projects/club/23.jpg" },
  { title: "Ho Ho Homies", avenue: "Club Service", description: "HO! HO! HOMIES was a festive Secret Santa and fellowship initiative featuring joyful gift exchanges, fun interactions, and festive cheer that strengthened togetherness and intra-club bonding.", image: "/images/projects/club/24.jpg" },
];

const community: Project[] = [
  { title: "Kuruthi", avenue: "Community Service", description: "In collaboration with our parent Rotary, this blood donation drive ensured every drop collected was a step toward saving lives and building a healthier community.", image: "/images/projects/community/01.jpg" },
  { title: "Gaalaxy Unavagam", avenue: "Community Service", description: "As the sun rose on a new Rotary year, on July 1st we began our journey with a heartwarming Grocery Donation Drive titled 'Anna Poorani' at St. Joseph's Old Age Home, Podanur.", image: "/images/projects/community/02.jpg" },
  { title: "Malarum Thaaimai", avenue: "Community Service", description: "Pregnancy kits worth ₹7,000 were donated to 30+ expectant mothers from underserved communities, reinforcing our commitment to accessible, dignified healthcare for all.", image: "/images/projects/community/03.jpg" },
  { title: "Rota-lin", avenue: "Community Service", description: "Organised with the Rotaract Club of Tamil Nadu Agricultural University on 26th July 2025 at Marudham Diabetes & Thyroid Center — a compassionate initiative providing insulin needles to children with diabetes.", image: "/images/projects/community/04.jpg" },
  { title: "Malarum Thaaimai Phase II", avenue: "Community Service", description: "A breastfeeding awareness session conducted for over 30 expectant mothers, covering benefits, correct techniques for effective feeding, and practical ways to overcome common challenges.", image: "/images/projects/community/05.jpg" },
  { title: "Rota-lin Phase II", avenue: "Community Service", description: "The Rotaract Club of Coimbatore Gaalaxy, with the Rotaract Club of TNAU, held Rota-Lin Phase 2 on 20th August 2025 at Marudham Diabetes & Thyroid Centre, Kalapatti. Insulin needles were provided to children with Type 1 diabetes, supported by Rtn. Dr. Krishnan Swaminathan.", image: "/images/projects/community/06.jpg" },
  { title: "Veppam", avenue: "Community Service", description: "Veppam, a Blanket Donation Drive, spread warmth and care to the homeless by providing blankets to help them face cold nights with comfort.", image: "/images/projects/community/07.jpg" },
  { title: "Rota-lin Phase III", avenue: "Community Service", description: "ROTA-LIN Phase III, by Rotaract Club of Coimbatore Gaalaxy and Rotaract Club of TNAU, continued distributing insulin needles to children battling diabetes, spreading hope, health, and compassion.", image: "/images/projects/community/08.jpg" },
  { title: "Bubble Up", avenue: "Community Service", description: "BubbleUp, held on Global Handwashing Day, promoted hygiene awareness through the installation of handwashing stations at the Government Higher Secondary School, Pichanur.", image: "/images/projects/community/09.jpg" },
  { title: "Purple Pinkie", avenue: "Community Service", description: "Purple Pinkie, an awareness initiative on Global Polio Day, encouraged everyone to paint their pinkie purple as a symbol of vaccination and hope — spreading awareness for a polio-free world.", image: "/images/projects/community/10.jpg" },
  { title: "Rota-lin Phase IV", avenue: "Community Service", description: "ROTA-LIN Phase 4, in observance of World Diabetes Day at Madhuram Diabetes & Thyroid Centre, Kalapatti. Insulin needles were donated to children living with diabetes, along with joyful interactions and activities to make their day special.", image: "/images/projects/community/11.jpg" },
  { title: "Bake the Smoke Away", avenue: "Community Service", description: "A public health initiative to promote smoke-free environments in local bakeries across Coimbatore. The project protected staff and customers from second-hand smoke by installing no-smoking boards and engaging bakery owners.", image: "/images/projects/community/12.jpg" },
  { title: "Beyond the Ribbon", avenue: "Community Service", description: "Executed as part of the Charter Day initiative, the project supported the education of 17 children affected by AIDS, ensuring academic security and encouraging confidence, dignity, and equal opportunities.", image: "/images/projects/community/13.jpg" },
  { title: "Kaapaan", avenue: "Community Service", description: "Kaapaan installed 10 first-aid kits in traffic booths across Coimbatore, supporting traffic police in providing immediate medical help during road emergencies. A thanksgiving note was also presented to appreciate their service.", image: "/images/projects/community/14.jpg" },
  { title: "Giggles", avenue: "Community Service", description: "Giggles was a heartwarming outreach at a special school, blending joy, learning, and compassion. Interactive play, cheerful bonding, and thoughtful contributions turned simple moments into meaningful memories for young minds.", image: "/images/projects/community/15.jpg" },
];

const professional: Project[] = [
  { title: "Rotaract 360", avenue: "Professional Service", description: "Rotaract 360 is a 365 days, year-long journey of knowledge, service, and leadership, a new initiative that encourages learning and growth through curated insights from the Rotary Learning Center.", image: "/images/projects/professional/01.jpg" },
  { title: "The Inner Compass", avenue: "Professional Service", description: "The Inner Compass is an online session organised in collaboration with Rotaract Club of HICET. The session focused on Self-Assessment and Personal Development to create a meaningful platform for individuals to pause, reflect, and engage in deep self-exploration.", image: "/images/projects/professional/02.jpg" },
  { title: "Ennangalil Ethirkaalam", avenue: "Professional Service", description: "Ennangalil Ethirkaalam, a session on shaping minds and building futures, was hosted on behalf of International Youth Day. The event aimed to empower school students by nurturing a positive mindset, enhancing leadership skills, and promoting personal growth.", image: "/images/projects/professional/03.jpg" },
  { title: "Patriots Play Fest", avenue: "Professional Service", description: "Patriot's Play Fest, a celebration of pride, unity, and patriotism, was organised on Independence day. The event aimed to inspire students to express their creativity and patriotic spirit through cultural performances and competitions, fostering enthusiasm, teamwork, and a sense of national pride.", image: "/images/projects/professional/04.jpg" },
  { title: "Spotlight", avenue: "Professional Service", description: "Spotlight was a nationwide short film contest organized in collaboration with JCI Coimbatore Indcity (Junior Chamber International), offering a stage for aspiring filmmakers and storytellers across India. The contest celebrates originality and social impact, empowering young talents to express their vision through powerful visual storytelling.", image: "/images/projects/professional/05.jpg" },
  { title: "Pinktober", avenue: "Professional Service", description: "PINKTOBER is an enlightening awareness session on Breast Cancer Awareness Month. The event focused on empowering individuals to detect early and defeat strongly through knowledge and prevention.", image: "/images/projects/professional/06.jpg" },
  { title: "Aviate", avenue: "Professional Service", description: "An engaging session about inner drive under World Interact Week celebrations at Government Higher Secondary School, Sundakkamuthur.", image: "/images/projects/professional/07.jpg" },
  { title: "Gear Up", avenue: "Professional Service", description: "A session to guide and motivate young Interactors towards Leadership and Growth at Government Higher Secondary School, Kulathupalayam as part of World Interact Week celebrations.", image: "/images/projects/professional/08.jpg" },
];

const international: Project[] = [
  { title: "Visionova", avenue: "International Service", description: "A collaborative webinar with Rotaract Club of Salem Gugai from RI District 2982, featuring life coach Ms. Preethi Govindan, guiding over 100 participants on effective goal setting, self-awareness, and personal growth.", image: "/images/projects/international/01.jpg" },
  { title: "Rooted in Rotaract", avenue: "International Service", description: "A green initiative in collaboration with Thaagam Foundation, planting a sapling for every member's birthday to promote sustainability and eco-conscious celebrations.", image: "/images/projects/international/02.jpg" },
  { title: "Inningsight", avenue: "International Service", description: "An inclusive sports initiative held with Thunder Hope Foundation, donating a ₹20,000 cricket kit to the Tamil Nadu Blind Cricket Team to promote accessibility in sports.", image: "/images/projects/international/03.jpg" },
  { title: "Saaral", avenue: "International Service", description: "A child safety awareness session in collaboration with My Body is My Body Foundation, educating 70+ students on body safety, child abuse prevention, and self-protection.", image: "/images/projects/international/04.jpg" },
  { title: "Yaazh Muthu", avenue: "International Service", description: "An Indo-Lankan virtual cultural and letterhead exchange with Rotaract Club of Ratnapura, RI District 3220, celebrating cross-border friendship and cultural understanding.", image: "/images/projects/international/05.jpg" },
  { title: "Gauravi", avenue: "International Service", description: "A joint initiative with Rotaract Club of Rising Ranchi from RI District 3250, to celebrate women empowerment through sapling plantations dedicated to inspiring women in Coimbatore and Ranchi.", image: "/images/projects/international/06.jpg" },
  { title: "Peshwas to Palms", avenue: "International Service", description: "An IDYE event hosting Rotaractors from RI District 3131, showcasing Coimbatore's culture, cuisine, and hospitality while strengthening inter-district friendship.", image: "/images/projects/international/07.jpg" },
  { title: "Little Bodies, Big Voices", avenue: "International Service", description: "A child safety awareness session conducted at CBM School, empowering 70+ children with knowledge on personal safety and self-protection.", image: "/images/projects/international/08.jpg" },
  { title: "Signs of Unity", avenue: "International Service", description: "An online session held on International Day of Sign Languages with Rotaract Club of Pune Sinhagad Road from RI District 3131, teaching basics of Indian Sign Language to 20+ participants.", image: "/images/projects/international/09.jpg" },
  { title: "Festive Bridges", avenue: "International Service", description: "An online cultural exchange with Rotaract Clubs of Pune Metro and Pune Royal from RI District 3131, celebrating Tamil Nadu and Maharashtra festivals to promote cultural unity.", image: "/images/projects/international/10.jpg" },
  { title: "Letters Beyond Borders", avenue: "International Service", description: "A World Post Day initiative reviving handwritten letters by sending messages of friendship to Rotaractors across India and Sri Lanka, fostering emotional connection.", image: "/images/projects/international/11.jpg" },
  { title: "Taste of Kongu", avenue: "International Service", description: "A World Food Day collaboration with Rotaract Club of RSCOE from RI District 313, showcasing Coimbatore's culinary heritage through dishes like Palipalayam Chicken and Kongu Virundhu.", image: "/images/projects/international/12.jpg" },
  { title: "Cyber Shield", avenue: "International Service", description: "A cyber-safety awareness session conducted with Rotaract Club of VISTAS and 10 other clubs from RI District 3234, educating 90+ participants on digital safety, media literacy, and responsible online behavior.", image: "/images/projects/international/13.jpg" },
  { title: "Little Stars Day Out", avenue: "International Service", description: "A Children's Day Celebration was organized in Malumichampatti Panchayat School to create an energetic and joyful experience for children through engaging activities.", image: "/images/projects/international/14.jpg" },
  { title: "Rotaract Moments 2025", avenue: "International Service", description: "ROTARACT MOMENTS 2025 was a collaborative online initiative where members shared their memories through social media to reinforce the values of service, leadership and teamwork within the clubs.", image: "/images/projects/international/15.jpg" },
];

const district: Project[] = [
  { title: "Mythiri", avenue: "District Priority", description: "Organised in collaboration with the Rotaract Club of TNAU at Helping Hearts, Poosaripalayam. The event featured a movie screening for the elderly, spreading joy, compassion, and emotional warmth. Aligns with the District Priority Project theme DREAM, under e-Embrace.", image: "/images/projects/district/01.jpg" },
  { title: "Mind Matters", avenue: "District Priority", description: "Focused on the pressures youth face to fit in while promoting individuality, stress management, and supportive communities. Organised in collaboration with the Rotaract Clubs of ICAS, Lead India Ahead, Madras Cosmos, and SBSEC, aligning with the DPP Team DREAM under MannShakti.", image: "/images/projects/district/02.jpg" },
  { title: "Annam", avenue: "District Priority", description: "A Grocery Donation involving 10 kg of rice donated to Helping Hearts, Poosaripalayam — carried out as part of the District Priority Project, reaffirming our commitment to community welfare.", image: "/images/projects/district/03.jpg" },
  { title: "Save the Stray", avenue: "District Priority", description: "An initiative fitting reflective collars on stray dogs to prevent road accidents by making strays visible at night. The project enhanced road safety, raised community awareness, and aligned with the DPP theme 'Embrace'.", image: "/images/projects/district/04.jpg" },
  { title: "IPCL 2.0", avenue: "District Priority", description: "IPCL 2.0, our flagship project, was hosted from 5th–7th September 2025 at 22 Yards, Coimbatore. This national-level para-athlete cricket tournament featured 60+ players from 14 states and 1 union territory. Rotary Downtown Tigers, Mumbai, emerged champions.", image: "/images/projects/district/05.jpg" },
  { title: "The Healing Hour", avenue: "District Priority", description: "A mental health awareness session organised in collaboration with the Rotaract Club of SKASC under the DPP Mann Shakthi initiative. The session focused on fostering mindfulness, emotional balance, and self-awareness.", image: "/images/projects/district/06.jpg" },
  { title: "NutriSense", avenue: "District Priority", description: "A Lifestyle Diet Planning Program organised in collaboration with Dreamz Trust, promoting healthy and sustainable living among tribal communities under the Hi5 District Priority Project. The initiative spread awareness about balanced nutrition and simple wellness practices.", image: "/images/projects/district/07.jpg" },
  { title: "Classics and Companions", avenue: "District Priority", description: "Conducted at Helping Hearts Old Age Home, Poosaripalayam, donating essential groceries to support residents' daily needs and ensure their comfort. Aligned with District Priority Projects under Reach Out – Senior Citizens and Annapoorani – Food.", image: "/images/projects/district/05.jpg" },
];

export const projects: Project[] = [...club, ...community, ...professional, ...international, ...district];

export const flagship = [
  {
    title: "VANCHI",
    tag: "Flagship since 2019",
    image: "/images/flagship/05.webp",
    description:
      "VANCHI is the flagship initiative of the Rotaract Club of Coimbatore Gaalaxy, launched in 2019–20 as a community development outreach focused on uplifting tribal communities. The first two editions were dedicated to the betterment of the Irula tribe across Sadivayal village and Karamadai, reaching over 30 beneficiaries in each phase. Today, VANCHI stands at the intersection of leadership, sustainability, and impact — transitioning into a Rotary Youth Leadership Awards (RYLA) experience while staying rooted in service.",
    stat: "30+ beneficiaries per phase",
  },
  {
    title: "IPCL 2.0",
    tag: "National para-sports",
    image: "/images/flagship/01.webp",
    description:
      "A national-level para-athlete cricket tournament hosted 5th–7th September 2025 at 22 Yards, Coimbatore — 60+ players from 14 states and 1 union territory. Rotary Downtown Tigers, Mumbai, emerged champions, with Kolkata Thunder Warriors and Chennai Super Greens as runner-ups. An event celebrating empowerment, inclusivity, and unity through sports.",
    stat: "60+ players · 14 states",
  },
  {
    title: "ROTA-LIN",
    tag: "Year-long healthcare",
    image: "/images/flagship/04.webp",
    description:
      "A year-long compassionate initiative with the Rotaract Club of TNAU, providing essential insulin needles to children battling diabetes. Four phases and counting — easing the physical, emotional, and financial challenges faced by young diabetic patients and their families.",
    stat: "4 phases completed",
  },
  {
    title: "PETTI KADAI",
    tag: "Social entrepreneurship",
    image: "/images/flagship/03.webp",
    description:
      "A heartfelt community project on 14th July 2024 at the Sulur Housing Unit — empowering Mrs. Viji and Mr. Therasanathan, a differently-abled couple, through entrepreneurship. The club set up a small business for the wheelchair cricket player and his wife, turning determination into dignity and independent income.",
    stat: "1 family, lasting change",
  },
] as const;

// Home hero strip — best-foot-forward project cards.
export const heroStrip = [
  { title: "IPCL 2.0", stat: "60+ para-athletes, 14 states", image: "/images/flagship/01.webp" },
  { title: "VANCHI", stat: "Tribal upliftment since 2019", image: "/images/flagship/05.webp" },
  { title: "SAYBOO", stat: "227 registrations", image: "/images/flagship/02.webp" },
  { title: "PETTI KADAI", stat: "Entrepreneurship with dignity", image: "/images/flagship/03.webp" },
  { title: "ROTA-LIN", stat: "Insulin support, 4 phases", image: "/images/flagship/04.webp" },
  { title: "ARAVAM", stat: "200+ at Onam celebration", image: "/images/projects/club/09.jpg" },
] as const;
