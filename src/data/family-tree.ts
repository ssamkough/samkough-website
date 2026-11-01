export interface Person {
  /** Full name as known. Use "Unknown" when the name isn't known. */
  name: string;
  /** Short context line shown under the name, e.g. "Father of Amin". */
  label?: string;
  /** Date of birth, any precision ("1900", "May 1952", "12 May 1900"). */
  born?: string;
  /** Date of death. Omit when unknown. */
  died?: string;
  /** Set to true for people who are alive, so no death date is shown. */
  living?: boolean;
  /** Set to true when someone has died but the date isn't known. */
  deceased?: boolean;
  birthplace?: string;
  /** Where they died. Only shown when set. */
  deathplace?: string;
  burialPlace?: string;
  /** Set when known. Used for words like "Father" on person pages. */
  gender?: "male" | "female";
  /** Name in Arabic script, shown on the person's page. */
  arabicName?: string;
  /** Other ways the name is written, shown on the person's page. */
  otherSpellings?: string[];
  /** Paragraphs of background shown on the person's page. */
  summary?: string[];
  /**
   * Set to link the person's name in the family tree to their page. Every
   * named person has a page at /people/<name>/ whether or not this is set.
   */
  href?: string;
  /** Pages on this site that the details come from. */
  sources?: { label: string; href: string }[];
  /** Extra detail, such as conflicting sources or an unconfirmed relationship. */
  note?: string;
  /** Spouses, shown beside the person; their children hang from this person. */
  spouses?: Person[];
  children?: Person[];
}

/**
 * The Samkough lineage, starting from Amin's grandfather.
 * Anything left out is displayed as "Unknown" on the page.
 */
export const familyTree: Person = {
  name: "Unknown",
  gender: "male",
  label: "Grandfather of Amin Samkough",
  children: [
    {
      name: "Ayoub Samkough",
      gender: "male",
      label: "Father of Amin Samkough",
      died: "1911",
      deathplace: "Tripoli, Libya",
      note: "Killed in 1911 while fighting against the Italian occupation of Libya, according to the Arabic Wikipedia entry on Amin. His birth date, birthplace and burial place aren't given.",
      sources: [
        {
          label: "Arabic Wikipedia entry (translation)",
          href: "/people/amin-samkough/research/arabic-wikipedia-amin-ayyub-samkoug/",
        },
      ],
      children: [
        {
          name: "Amin Samkough",
          gender: "male",
          arabicName: "أمين سمكوغ",
          href: "/people/amin-samkough/",
          born: "1900",
          died: "May 1952",
          birthplace: "Quneitra, Syria",
          burialPlace: "Al Qabratai cemetery, Quneitra, Syria",
          spouses: [{ name: "Sadieh Hajo" }],
          note: "Sources disagree on his dates: his birth is given as 1900 or 1903, and his death as 1952 or 1953.",
          children: [
            {
              name: "Zaramouk Samkough",
              gender: "male",
              born: "4 January 1933",
              birthplace: "Mansura, Syria",
              died: "1991",
              burialPlace: "Fair Lawn Cemetery",
              spouses: [{ name: "Jean Khonako" }],
              children: [
                { name: "Adham Samkough" },
                { name: "Hannan Samkough" },
                { name: "Suzan Bazoqa" },
                { name: "Amy Oumar" },
              ],
            },
            {
              name: "Barzaj Samkough",
              gender: "male",
              arabicName: "برزج سمكوغ",
              otherSpellings: ["Burzaj"],
              summary: [
                "Barzaj Samkough is a son of Amin Samkough and the author of the books listed below. The Amin Samkough biography, which spells his name “Burzaj”, says that after his father’s death he issued a book called “An Introduction to Circassian History”, an introduction to Amin’s own “History of the Circassians”.",
                "The cover of “An Introduction to the History of the Circassians” names Amin Samkough as its author.",
              ],
              href: "/people/barzaj-samkough/",
              children: [{ name: "Radwan Samkough" }, { name: "Narina Samkough" }],
            },
            {
              name: "Bebart Samkough",
              children: [{ name: "Marj Samkough" }, { name: "Albroz Samkough" }],
            },
            {
              name: "Yanal Samkough",
              children: [{ name: "Nino Samkough" }, { name: "Sally Samkough" }, { name: "Ayham Samkough" }],
            },
          ],
        },
        {
          name: "Unknown",
          label: "Possible brother of Amin Samkough",
          note: "Unconfirmed. It isn't certain that Amin had a brother.",
        },
        {
          name: "Naljeah Samkough",
          spouses: [{ name: "Isa Libzo", gender: "male" }],
          // Listed oldest to youngest within each group; the combined birth
          // order of sons and daughters isn't known.
          children: [
            {
              name: "Nihad",
              gender: "male",
              label: "Known as Khalo Nihad",
              deceased: true,
            },
            { name: "Abdul-Hadi", gender: "male", deceased: true },
            { name: "Khalid", gender: "male", living: true },
            {
              name: "Satanai",
              gender: "female",
              label: "Known as Khalto Satanai",
              deceased: true,
            },
            {
              name: "Hatsats",
              gender: "female",
              deceased: true,
              note: "The name is also spelled Hasas.",
            },
            { name: "Khaireih", gender: "female", deceased: true },
            { name: "Hourieh", gender: "female", living: true },
            { name: "Thaneih", gender: "female", deceased: true },
            {
              name: "Afeirah",
              gender: "female",
              living: true,
              note: "The name is also spelled Afira.",
            },
          ],
        },
      ],
    },
  ],
};
