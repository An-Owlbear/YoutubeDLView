import { combineReducers, createStore } from 'redux';
import { authReducer } from './authReducer';

const combinedReducers = combineReducers({
  auth: authReducer
});

export interface RootState {
  auth: string
}

export const store = createStore(combinedReducers);