import { getMoveTarget } from './Moves';
import { setBit } from './Bitwise';

export function printBoard(board: bigint) {
  console.log('');
  for (let rank = 0; rank < 8; rank++) {
    process.stdout.write(`${8 - rank} |`);
    for (let file = 0; file < 8; file++) {
      const square = (rank * 8) + file;

      process.stdout.write(` ${(board & (1n << BigInt(square))) ? '1' : '0'}`);
    }
    console.log('');
  }
  console.log('  -----------------');
  console.log('    a b c d e f g h');
  console.log(`\nBitboard In Decimal: ${board}\n`);
}

export function printMoves(moves: number[]) {
  let board = 0n;
  for (const move of moves) {
    board = setBit(board, getMoveTarget(move));
  }
  printBoard(board);
}
