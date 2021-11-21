import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConversionMap } from 'src/Utils';

export interface ChessState {
  dragging: string | null;
  pieces: Array<string[]>;
  pendingAnimation: null | {
    start: string;
    to: string;
  };
}

const initialState: ChessState = {
  dragging: null,
  pendingAnimation: null,
  pieces: [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ],
};

export const chessSlice = createSlice({
  name: 'chess',
  initialState,
  reducers: {
    setDragging: (state, { payload }: PayloadAction<string | null>) => {
      state.dragging = payload;
    },
    setAnimation: (state, { payload }: PayloadAction<{ start: string, to: string } | null>) => {
      // Skip if no piece is being dragged
      if (!state.dragging) return;

      // Skip if piece is not moving to a new position
      if (payload && state.dragging === payload.to) return;

      state.pendingAnimation = payload;
    },
    movePiece: (state, { payload }: PayloadAction<{ start: string, to: string }>) => {
      const [sRank, sFile] = payload.start.split('');
      const [eRank, eFile] = payload.to.split('');
      if (!sRank || !eRank || !sFile || !eFile) return;

      // Rank Conversion
      const s1 = ConversionMap(sRank) as number;
      const s2 = Number(sFile);

      // String Parsing
      const e1 = ConversionMap(eRank) as number;
      const e2 = Number(eFile);

      if (!s1 || !s2 || !e1 || !e2) return;

      // Piece Moving
      state.pieces[e2 - 1]![e1 - 1] = state.pieces[s2 - 1]![s1 - 1] as string;
      state.pieces[s2 - 1]![s1 - 1] = '-';
      return;
    }
  },
});

export const { setDragging, setAnimation, movePiece } = chessSlice.actions;

export default chessSlice.reducer;
