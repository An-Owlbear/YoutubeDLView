/*eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

const getHookParams = <T>(param1: string | T[] | undefined, param2: T[] | undefined): [string, T[] | undefined] => {
  if (typeof param1 === 'string') return [param1 as string, param2];
  return ['', param1];
};

export function useList<T>(key: string, fromValue: T[] | undefined): T[]
export function useList<T>(fromValue: T[] | undefined): T[]
export function useList<T>(param1: string | T[] | undefined, param2?: T[] | undefined): T[] {
  const [key, fromValue] = getHookParams(param1, param2);
  return useListHook(key, fromValue);
}

const useListHook = <T>(key: string, fromValue: T[] | undefined): T[] => {
  const [values, setValues] = useState<T[]>([]);

  useEffect(() => {
    setValues([]);
  }, [key]);

  useEffect(() => {
    if (fromValue) setValues([...values, ...fromValue]);
  }, [fromValue]);

  return values;
};