import { atomWithStorage } from 'jotai/utils';
import Session from '../models/Session';

export const sessionAtom = atomWithStorage<Session | null>('session', null);