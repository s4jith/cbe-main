export type Member = {
  name: string;
  role: string;
  image: string;
};

// Sourced from "Professional Photo (File responses)" — one photo per member,
// normalized into scripts/seed-assets/images/team/ by scripts/compress-images.mjs.
// Only Viswa's designation ("President") was given in the source filename; every
// other designation defaults to "Member" — edit each one in Content → Team in the
// admin. Priority (the `order` field) controls display order and is also set
// there; the numbers below are just the order the photos were provided in.
export const board: Member[] = [
  { name: "Viswa", role: "President", image: "/images/team/viswa.jpg" },
  { name: "Kalphana R", role: "Member", image: "/images/team/kalphana-r.jpg" },
  { name: "Dharaneesh Jayasundar", role: "Member", image: "/images/team/dharaneesh-jayasundar.jpg" },
  { name: "Lakshan", role: "Member", image: "/images/team/lakshan.jpg" },
  { name: "Tanushree", role: "Member", image: "/images/team/tanushree.jpg" },
  { name: "Rithika Selvaraj", role: "Member", image: "/images/team/rithika-selvaraj.jpg" },
  { name: "Rtr. Sajith", role: "Member", image: "/images/team/sajith.jpg" },
  { name: "Vignesh D", role: "Member", image: "/images/team/vignesh-d.jpg" },
  { name: "Rtr. Shwetha Yazhini", role: "Member", image: "/images/team/shwetha-yazhini.jpg" },
  { name: "Shyam S Amuthan", role: "Member", image: "/images/team/shyam-s-amuthan.jpg" },
  { name: "Devesh SR", role: "Member", image: "/images/team/devesh-sr.jpg" },
];

// No general-member roster supplied yet — add members with "General Member" set
// in Content → Team once there's a list beyond the board above.
export const generalMembers: Member[] = [];
