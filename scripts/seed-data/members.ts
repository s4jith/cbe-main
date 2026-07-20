export type Member = {
  name: string;
  role: string;
  image: string;
};

// Board of Directors 2025–26 — order mirrors the club's official listing.
export const board: Member[] = [
  { name: "Rtr. Srivarshan R R", role: "President", image: "/images/board/01.webp" },
  { name: "Rtr. IPP. Samyuktha", role: "Immediate Past President", image: "/images/board/02.webp" },
  { name: "Rtr. Susanna", role: "Secretary Administration", image: "/images/board/03.webp" },
  { name: "Rtr. Yuvaraj CR", role: "Secretary Communication", image: "/images/board/04.webp" },
  { name: "Rtn. Rtr. Jaya Kishore", role: "Vice President", image: "/images/board/05.webp" },
  { name: "Rtr. Shruthinaya", role: "Chair — All Avenues", image: "/images/board/06.webp" },
  { name: "Rtr. Mitun", role: "Treasurer", image: "/images/board/07.webp" },
  { name: "Rtr. Vippinsagar", role: "Sergeant at Arms", image: "/images/board/08.webp" },
  { name: "Rtr. Karthick Sundar", role: "Director — Club Service", image: "/images/board/09.webp" },
  { name: "Rtr. Sanjai T N", role: "Director — Community Service", image: "/images/board/10.webp" },
  { name: "Rtr. Janani K S", role: "Director — Professional Service", image: "/images/board/11.webp" },
  { name: "Rtr. Vijaya Ragavan", role: "Director — International Service", image: "/images/board/12.webp" },
  { name: "Rtr. Hari Karthik", role: "Director — District Priority Project", image: "/images/board/13.webp" },
  { name: "Rtr. Naveen", role: "RYLC & Chair — Partners in Service", image: "/images/board/14.webp" },
  { name: "Rtr. Barath Kumar", role: "Club Editor", image: "/images/board/15.webp" },
  { name: "Rtr. Kaavya Shri", role: "Chair — Public Affairs & Outreach", image: "/images/board/16.webp" },
  { name: "Rtr. PP. Sanjai", role: "Rotaract Learning Facilitator", image: "/images/board/17.webp" },
  { name: "Rtr. Dharshan", role: "Chair — District Initiatives", image: "/images/board/18.webp" },
  { name: "Rtr. Swathi", role: "Chair — TRF", image: "/images/board/19.webp" },
  { name: "Rtr. Ganesh Balaji", role: "Chair — Membership Growth & Retention", image: "/images/board/20.webp" },
  { name: "Rtr. PP. Karthick MR", role: "Club Advisor", image: "/images/board/21.webp" },
  { name: "Rtn. Rtr. MPHF. Vijay Vignesh", role: "Club Mentor", image: "/images/board/22.webp" },
  { name: "Rtr. PP. Shruthi", role: "Chair — Campus Ambassador", image: "/images/board/23.webp" },
  { name: "Rtr. Ragesh Ram", role: "Chair — Blood Donor Cell", image: "/images/board/24.webp" },
];

export const generalMembers: Member[] = [
  { name: "Rtr. Adhithan A", role: "Member", image: "/images/members/01.webp" },
  { name: "Rtr. Ajith Kumar R", role: "Member", image: "/images/members/02.webp" },
  { name: "Rtr. PP Jaishree G V", role: "Member", image: "/images/members/03.webp" },
  { name: "Rtr. Kabilesh K", role: "Member", image: "/images/members/04.webp" },
  { name: "Rtr. Nikesh S", role: "Member", image: "/images/members/05.webp" },
  { name: "Rtr. Niveda K", role: "Member", image: "/images/members/06.webp" },
  { name: "Rtr. Raghav Somasundaram P L", role: "Member", image: "/images/members/07.webp" },
  { name: "Rtr. Sree Pranesh J", role: "Member", image: "/images/members/08.webp" },
  { name: "Rtr. Ritesh P R", role: "Member", image: "/images/members/09.webp" },
  { name: "Rtr. Rithanya C", role: "Member", image: "/images/members/10.webp" },
  { name: "Rtr. Sabarish L", role: "Member", image: "/images/members/11.webp" },
  { name: "Rtr. Sakthi Prasanna R", role: "Member", image: "/images/members/12.webp" },
  { name: "Rtr. PP Sakthi Sridevi N", role: "Member", image: "/images/members/13.webp" },
  { name: "Rtr. Sriee Aswanth A C", role: "Member", image: "/images/members/14.webp" },
  { name: "Rtr. Thaqib Rehman Z", role: "Member", image: "/images/members/15.webp" },
  { name: "Rtr. Vidhya Hanumath K", role: "Member", image: "/images/members/16.webp" },
  { name: "Rtr. Vivegananth R", role: "Member", image: "/images/members/17.webp" },
  { name: "Rtr. PP Yuvaraj C U", role: "Member", image: "/images/board/25.webp" },
];

export const voices = [
  {
    name: "Rtr. Srivarshan R R",
    role: "President",
    image: "/images/board/01.webp",
    quote:
      "With immense pride and gratitude, I step into this year as the President of our club. Our journey ahead is filled with opportunities to serve, lead, and inspire. Let's embrace every challenge with courage, every project with purpose, and every moment with unity. Together, we'll script a meaningful and impactful chapter.",
  },
  {
    name: "Rtr. IPP. Samyuktha",
    role: "Immediate Past President",
    image: "/images/board/02.webp",
    quote:
      "As an Immediate Past President of Rotaract Club of Coimbatore Gaalaxy, I'm honored to have been part of a journey that brought people together, fostered service, and created lasting impact. Our club's spirit of fellowship, dedication to community service, and passion for leadership will continue to inspire and drive us forward.",
  },
  {
    name: "Rtr. PP. Yuvaraj CU",
    role: "Past President",
    image: "/images/board/25.webp",
    quote:
      "They say Rotaract builds leaders — for me, it built bridges, connecting people, perspective and purpose. From fresh out of school to kickstarting Coimbatore's first para-sports fest, welcoming our first transgender member, and partnering with every NGO I could find, this space let me turn ideas into action. Welcome to Gaalaxy — a space for everyone to grow together.",
  },
] as const;
