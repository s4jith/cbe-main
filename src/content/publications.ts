// PDF links point at the current production site's hashed assets.
// When this redesign replaces that deployment, copy the PDFs into /public/pdfs
// and update the hrefs — tracked in DESIGN.md open questions.
const OLD = "https://www.rotaractcbegaalaxy.org/assets";

export type Publication = {
  title: string;
  cover: string;
  pdf: string;
};

export const newsletters: Publication[] = [
  { title: "July", cover: "/images/newsletters/01.webp", pdf: `${OLD}/GAALAXY%20NEWSLETTER%20-%20JULY%20EDITION-BueVVfQu.pdf` },
  { title: "August", cover: "/images/newsletters/02.webp", pdf: `${OLD}/GAALAXY%20NEWSLETTER%20-%20AUGUST%20EDITION-CuoDb_kg.pdf` },
  { title: "September", cover: "/images/newsletters/03.webp", pdf: `${OLD}/GAALAXY%20NEWSLETTER%20-%20SEPTEMBER%20EDITION-6vLv9IXm.pdf` },
  { title: "October", cover: "/images/newsletters/04.webp", pdf: `${OLD}/GAALAXY%20NEWSLETTER%20-%20OCTOBER%20EDITION-DF0nb0Wo.pdf` },
  { title: "November", cover: "/images/newsletters/05.webp", pdf: `${OLD}/GAALAXY%20NEWSLETTER%20-%20NOVEMBER%20EDITION-Dlf9tAN2.pdf` },
  { title: "December", cover: "/images/newsletters/06.webp", pdf: `${OLD}/GAALAXY%20NEWSLETTER%20-%20DECEMBER%20EDITION-PaLGxP7n.pdf` },
  { title: "January", cover: "/images/newsletters/07.webp", pdf: `${OLD}/GAALAXY%20NEWSLETTER%20-%20JANUARY%20EDITION-Bq5nK3nR.pdf` },
  { title: "February", cover: "/images/newsletters/08.webp", pdf: `${OLD}/GAALAXY%20NEWSLETTER%20-%20FEBUARY%20EDITION-Cq9xGSoH.pdf` },
  { title: "March", cover: "/images/newsletters/09.webp", pdf: `${OLD}/GAALAXY%20NEWSLETTER%20-%20MARCH%20EDITION-CUKOHYia.pdf` },
  { title: "April", cover: "/images/newsletters/10.webp", pdf: `${OLD}/GAALAXY%20NEWSLETTER%20-%20APRIL%20EDITION-Cq3vMI7g.pdf` },
  { title: "May", cover: "/images/newsletters/11.webp", pdf: `${OLD}/GAALAXY%20NEWSLETTER%20-%20MAY%20EDITION-BMZ-4BqT.pdf` },
];

export const scrapbooks: Publication[] = [
  { title: "Odyssey 20–21", cover: "/images/scrapbooks/01.webp", pdf: `${OLD}/1%20Odyssey%20Scrapbook%2020-21-DdbpPoZI.pdf` },
  { title: "Evolve 21–22", cover: "/images/scrapbooks/02.webp", pdf: `${OLD}/2%20Evolve%20Scrapbook%2021-22-Co-3L8ly.pdf` },
  { title: "Reflection 23–24", cover: "/images/scrapbooks/03.webp", pdf: `${OLD}/3%20Reflections%20Scrapbook%2023-24-CAsGsRJu.pdf` },
  { title: "Revelation 24–25", cover: "/images/scrapbooks/04.webp", pdf: `${OLD}/4%20SCRAPBOOK%20-%2024-25-Cw4WNyB2.pdf` },
  { title: "God Mode 25–26", cover: "/images/scrapbooks/05.webp", pdf: `${OLD}/5%20SCRAPBOOK%20-%2025-26-DLeLmTX0.pdf` },
];
