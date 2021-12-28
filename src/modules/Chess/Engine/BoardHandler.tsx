import { ChessState, useAppDispatch, setPieces } from '@redux';
import { Socket } from 'socket.io-client';

export const addBoardListeners = (
  socket: Socket,
  _pieces: ChessState['pieces'],
  dispatch: ReturnType<typeof useAppDispatch>,
) => {
  socket.on('recieve', (msg) => {
    console.log(msg);
  });

  socket.on('setPieces', (pieces) => {
    dispatch(setPieces(pieces));
  });
};

export const removeBoardListeners = (socket: Socket) => {
  socket.removeListener('recieve');
};
