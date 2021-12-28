export function getBit(bitboard: bigint, square: number) {
  return bitboard & (1n << BigInt(square));
}

export function setBit(bitboard: bigint, square: number) {
  return bitboard |= (1n << BigInt(square));
}

export function removeBit(bitboard: bigint, square: number) {
  return bitboard &= ~(1n << BigInt(square));
}

// Counts the number of 1's on a given bitboard
export function countBits(bitboard: bigint) {
  let count = 0;

  while (bitboard > 0) {
    count++;
    bitboard &= bitboard - 1n;
  }

  return count;
}

// LS1B = Least Significant 1st Bit
export function getIndexOfLS1B(bitboard: bigint) {
  if (!bitboard)
    return -1;

  return countBits((bitboard & -bitboard) - 1n);
}

export function SetOccupancy(index: number, bitsInMask: number, attackMask: bigint) {
  let occupancy = 0n;

  for (let count = 0; count < bitsInMask; count++) {
    const square = getIndexOfLS1B(attackMask);
    attackMask = removeBit(attackMask, square);

    if (index & (1 << count)) {
      occupancy |= (1n << BigInt(square));
    }
  }

  return occupancy;
}
