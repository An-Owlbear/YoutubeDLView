/* eslint-disable react-hooks/exhaustive-deps */
import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Result from '../models/Result';
import { ErrorResponse } from '../models/apiModels';
import { snackbarAtom } from './globalStore';

interface Request<T> {
  error: string;
  isLoading: boolean;
  data: T | undefined;
  refetch: () => Promise<Result<T>>;
}

interface RequestOptions {
  enabled?: boolean;
  errorHandler?: (error: string) => void
}

const useDefaultErrorHandler = () => {
  const [, setSnackbarData] = useAtom(snackbarAtom);
  return (error: string) => {
    setSnackbarData({ type: 'error', message: error });
  };
};

const parseError = (error: string): ErrorResponse | undefined => {
  try {
    return JSON.parse(error);
  } catch (e) {
    return undefined;
  }
};

const defaultOptions: RequestOptions = {
  enabled: true,
};

// Request hook that handles common states and error handling
export const useRequest = <T>(requestFn: () => Promise<Result<T>>, requestDeps: unknown[], requestOptions?: RequestOptions): Request<T>  => {
  const options = useMemo(() => ({ ...defaultOptions, ...requestOptions }), [requestOptions]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | undefined>(undefined);
  const defaultErrorHandler = useDefaultErrorHandler();

  // Sends request, handling loading, error and data states
  const sendRequest = useCallback(async () => {
    setError('');
    setIsLoading(true);

    const response = await requestFn();
    if (!response.success) setError(response.error);
    setData(response.data);

    setIsLoading(false);
    return response;
  }, [...requestDeps]);

  // Automatically sends request if applicable
  useEffect(() => {
    if (!options.enabled) return;
    sendRequest();
  }, [...requestDeps, options.enabled]);

  // Automatically handles the error
  useEffect(() => {
    if (!error) return;
    const errorString = parseError(error)?.detail ?? error;
    if (options.errorHandler) options.errorHandler(errorString);
    else defaultErrorHandler(errorString);
  }, [error]);

  return { error, isLoading, data, refetch: sendRequest };
};