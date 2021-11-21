interface LetterConversions {
  [index: string]: number;
}

interface NumberConversions {
  [index: number]: string;
}

const fwdMap: LetterConversions = {
  'a': 1,
  'b': 2,
  'c': 3,
  'd': 4,
  'e': 5,
  'f': 6,
  'g': 7,
  'h': 8
};

const revMap: NumberConversions = {
  1: 'a',
  2: 'b',
  3: 'c',
  4: 'd',
  5: 'e',
  6: 'f',
  7: 'g',
  8: 'h'
};

export function ConversionMap(key: string | number): string | number | null {
  if (typeof key === 'string')
    return Number(fwdMap[key]);

  if (typeof key === 'number')
    return revMap[key] as string;

  return null;
}
