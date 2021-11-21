interface Conversion {
  [index: string]: number;
}

/**
 * Different from ConversionMap
 */
const TranslateConversions: Conversion = {
  'a': 8,
  'b': 7,
  'c': 6,
  'd': 5,
  'e': 4,
  'f': 3,
  'g': 2,
  'h': 1
};

export function Translate(start: string, target: string): string {
  const [sRank, sFile] = start.split('');
  const [eRank, eFile] = target.split('');
  if (!sRank || !eRank || !sFile || !eFile) return 'translate(0%, 0%)';

  const t1 = TranslateConversions[sRank];
  const v1 = TranslateConversions[eRank];

  if (!t1 || !v1) return 'translate(0%, 0%)';
  const xOffset = 100 * (t1 - v1);

  const t2 = Number(sFile);
  const v2 = Number(eFile);
  const yOffset = 100 * (v2 - t2);

  return `translate(${xOffset}%, ${yOffset}%)`;
}
