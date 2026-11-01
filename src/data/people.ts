import { familyTree, type Person } from "./family-tree";
import { texts, type Text } from "./texts";

export const isNamed = (person: Person) => person.name !== "Unknown";

export const slugify = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** The page for a person, or undefined when their name isn't known. */
export const personPath = (person: Person) =>
  isNamed(person) ? `/people/${slugify(person.name)}/` : undefined;

export interface PersonRecord {
  person: Person;
  slug: string;
  /** Their parent in the family tree. */
  parent?: Person;
  /** Spouses listed on this person, or the person they are a spouse of. */
  spouses: Person[];
  children: Person[];
  siblings: Person[];
  /** Books on the Texts pages written by this person. */
  works: Text[];
}

function collect(): PersonRecord[] {
  const records: PersonRecord[] = [];

  const add = (record: Omit<PersonRecord, "slug" | "works">) => {
    if (!isNamed(record.person)) return;
    records.push({
      ...record,
      slug: slugify(record.person.name),
      works: texts.filter((text) => text.author === record.person.name),
    });
  };

  const walk = (person: Person, parent?: Person, siblings: Person[] = []) => {
    const spouses = person.spouses ?? [];
    const children = person.children ?? [];
    add({ person, parent, spouses, children, siblings });
    for (const spouse of spouses) {
      add({ person: spouse, spouses: [person], children: [], siblings: [] });
    }
    for (const child of children) {
      walk(
        child,
        person,
        children.filter((other) => other !== child),
      );
    }
  };

  walk(familyTree);

  const slugs = records.map((record) => record.slug);
  const duplicate = slugs.find((slug, i) => slugs.indexOf(slug) !== i);
  if (duplicate) {
    throw new Error(`Two people in the family tree share the page "${duplicate}".`);
  }
  return records;
}

export const people = collect();

export const getPersonRecord = (slug: string) =>
  people.find((record) => record.slug === slug);
