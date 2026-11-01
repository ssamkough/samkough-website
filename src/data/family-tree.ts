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
  birthplace?: string;
  /** Where they died. Only shown when set. */
  deathplace?: string;
  burialPlace?: string;
  /** Page on this site about the person. Links their name. */
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
  label: "Grandfather of Amin Samkough",
  children: [
    {
      name: "Ayoub Samkough",
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
              born: "4 January 1933",
              birthplace: "Mansura, Syria",
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
        { name: "Naljea Samkough" },
      ],
    },
  ],
};
