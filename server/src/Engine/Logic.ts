export const dummy = '';

const b = 0n;

const printBoard = (board: bigint) => {
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const square = BigInt((rank * 8) + file);

      process.stdout.write(`${((board & (b << square)) ? 1 : 0)} `.padEnd(3));
    }

    console.log('');
  }
};

printBoard(b);
