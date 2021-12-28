import { combineReducers } from 'redux';

import user from './slices/user';
import chess from './slices/chess';

const rootReducer = combineReducers({
  user,
  chess,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
