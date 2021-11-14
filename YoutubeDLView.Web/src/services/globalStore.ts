import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import Session from '../models/Session';
import SnackbarData from '../models/SnackbarData';

export const sessionAtom = atomWithStorage<Session | null>('session', null);

export const drawerOpenAtom = atom<boolean>(false);

export const snackbarAtom = atom<SnackbarData>({ type: 'info', message: '' });