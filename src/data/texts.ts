export interface Text {
  /** URL slug, also the name of the cover image in public/texts/. */
  slug: string;
  title: string;
  /** Title as printed on the cover. */
  arabicTitle: string;
  /** Extra title lines printed on the cover. */
  subtitle?: string;
  arabicSubtitle?: string;
  /** French title printed on the cover. */
  frenchTitle?: string;
  /** What the cover says it is, e.g. "Novel". */
  kind?: string;
  author: string;
  arabicAuthor: string;
  /** Page on this site about the author, when there is one. */
  authorHref?: string;
  /** Texts that belong together. Parts are shown in order. */
  series?: { name: string; part: number };
  cover: { file: string; width: number; height: number; alt: string };
  /** Extra context, as plain paragraphs. */
  notes?: string[];
}

const covers = "/texts";
const barzajPage = "/people/barzaj-samkough/";

export const texts: Text[] = [
  {
    slug: "an-introduction-to-the-history-of-the-circassians",
    title: "An Introduction to the History of the Circassians",
    arabicTitle: "مدخل الى تاريخ الشراكسة",
    author: "Amin Samkough",
    arabicAuthor: "أمين سمكوغ",
    authorHref: "/people/amin-samkough/",
    cover: {
      file: `${covers}/an-introduction-to-the-history-of-the-circassians.png`,
      width: 476,
      height: 676,
      alt: "Book cover with a black background. The author’s name and the title are printed in Arabic, the title in red. Below is a blue and white image of a Circassian horseman in a papakha hat and traditional coat, holding his horse’s reins.",
    },
    notes: [
      "The Amin Samkough biography says that after his death his son Barzaj issued a book of this name, as an introduction to Amin’s own “History of the Circassians”.",
    ],
  },
  {
    slug: "circassians-at-the-dawn-of-history",
    title: "Circassians at the Dawn of History",
    arabicTitle: "الشركس في فجر التاريخ",
    frenchTitle: "Histoire ancienne des Tcherkesses",
    kind: "History",
    author: "Barzaj Samkough",
    arabicAuthor: "برزج سمكوغ",
    authorHref: barzajPage,
    cover: {
      file: `${covers}/circassians-at-the-dawn-of-history.jpg`,
      width: 689,
      height: 1024,
      alt: "Green book cover with dark Arabic lettering and the French title around a gold panel. The panel shows five stylized faces above rows of symbols and ornamental daggers.",
    },
    notes: [
      "The French title on the cover, “Histoire ancienne des Tcherkesses”, means “Ancient history of the Circassians”.",
    ],
  },
  {
    slug: "love-if-only-it-were",
    title: "Love, If Only It Were",
    arabicTitle: "غرام ليته كان",
    arabicSubtitle: "(قضايا شركسية)",
    subtitle: "(Circassian issues)",
    author: "Barzaj Samkough",
    arabicAuthor: "برزج سمكوغ",
    authorHref: barzajPage,
    cover: {
      file: `${covers}/love-if-only-it-were.jpg`,
      width: 682,
      height: 1024,
      alt: "Green-tinted book cover with a portrait of a young woman wearing a white lace veil and a headdress. The title is printed in Arabic across the middle and the author’s name at the top.",
    },
  },
  {
    slug: "loss-of-alienation-part-1",
    title: "Loss of Alienation, Part 1",
    arabicTitle: "ضياع الاغتراب",
    arabicSubtitle: "رواية",
    kind: "Novel",
    author: "Barzaj Samkough",
    arabicAuthor: "برزج سمكوغ",
    authorHref: barzajPage,
    series: { name: "Loss of Alienation", part: 1 },
    cover: {
      file: `${covers}/loss-of-alienation-part-1.jpg`,
      width: 750,
      height: 1024,
      alt: "Pink book cover. The title and the word for “novel” are printed in magenta Arabic lettering at the top, and the author’s name in white at the bottom.",
    },
  },
  {
    slug: "loss-of-alienation-part-2",
    title: "Loss of Alienation, Part 2",
    arabicTitle: "ضياع الاغتراب",
    arabicSubtitle: "رواية",
    kind: "Novel",
    author: "Barzaj Samkough",
    arabicAuthor: "برزج سمكوغ",
    authorHref: barzajPage,
    series: { name: "Loss of Alienation", part: 2 },
    cover: {
      file: `${covers}/loss-of-alienation-part-2.jpg`,
      width: 750,
      height: 1024,
      alt: "Purple book cover. The title and the word for “novel” are printed in dark purple Arabic lettering at the top, and the author’s name in white at the bottom.",
    },
  },
  {
    slug: "loss-of-alienation-part-3",
    title: "Loss of Alienation, Part 3",
    arabicTitle: "ضياع الاغتراب",
    arabicSubtitle: "رواية",
    kind: "Novel",
    author: "Barzaj Samkough",
    arabicAuthor: "برزج سمكوغ",
    authorHref: barzajPage,
    series: { name: "Loss of Alienation", part: 3 },
    cover: {
      file: `${covers}/loss-of-alienation-part-3.jpg`,
      width: 750,
      height: 1024,
      alt: "Green book cover. The title and the word for “novel” are printed in dark green Arabic lettering at the top, and the author’s name in white at the bottom.",
    },
  },
];

export const getText = (slug: string) => texts.find((t) => t.slug === slug);

/** The other parts of the same series, in order. */
export const seriesParts = (text: Text) =>
  text.series
    ? texts
        .filter((t) => t.series?.name === text.series?.name)
        .sort((a, b) => a.series!.part - b.series!.part)
    : [];
