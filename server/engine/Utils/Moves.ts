export function getMoveSource(move: number) {
  return move & 0x3f;
}

export function getMoveTarget(move: number) {
  return (move & 0xfc0) >> 6;
}

export function encodeMove(source: number, target: number, piece: number, promoted: number, captured: 1 | 0, double: 1 | 0, enpassant: 1 | 0, castling: 1 | 0) {
  return source | (target << 6) | (piece << 12) | (promoted << 16) | (captured << 20) | (double << 21) | (enpassant << 22) | (castling << 23);
}
