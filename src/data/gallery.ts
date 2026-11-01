export interface GalleryImage {
  file: string;
  width: number;
  height: number;
  alt: string;
  /** English caption (always shown). */
  caption: string;
  /** Original Russian caption, if the source photo has one. */
  ru?: string;
  /** Handwritten note on the photo, with its English translation. */
  note?: { text: string; lang: string; en: string };
  /** Span the full row on larger screens. */
  wide?: boolean;
}
