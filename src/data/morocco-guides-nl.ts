import rawData from './morocco-guides-nl.json';
import { MoroccoGuide } from './morocco-guides';

export const MOROCCO_GUIDES_NL: MoroccoGuide[] = rawData as MoroccoGuide[];

export function getGuideNlBySlug(slug: string): MoroccoGuide | undefined {
  return MOROCCO_GUIDES_NL.find((g) => g.slug === slug);
}
