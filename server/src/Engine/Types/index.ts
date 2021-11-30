export interface Occupancies {
  'White': bigint;
  'Black': bigint;
}

export type BitBoardType = [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint];


export enum Pieces {
  'P' = 0,
  'N' = 1,
  'B' = 2,
  'R' = 3,
  'Q' = 4,
  'K' = 5,
  'p' = 6,
  'n' = 7,
  'b' = 8,
  'r' = 9,
  'q' = 10,
  'k' = 11
}
