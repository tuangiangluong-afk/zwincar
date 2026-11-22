import rawData from './morocco-guides-es.json';
import { MoroccoGuide } from './morocco-guides';

export const MOROCCO_GUIDES_ES: MoroccoGuide[] = rawData as MoroccoGuide[];

export function getGuideEsBySlug(slug: string): MoroccoGuide | undefined {
  return MOROCCO_GUIDES_ES.find((g) => g.slug === slug);
}
