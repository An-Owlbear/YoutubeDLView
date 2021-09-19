/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Result from '../models/Result';

interface Request<T> {
  error: string;
  isLoading: boolean;
  data: T | undefined;
  refetch: () => Promise<Result<T>>;
}

interface RequestOptions {
  enabled: boolean;
  keepPrevious: boolean;
}

const defaultOptions: RequestOptions = {
  enabled: true,
  keepPrevious: false
};

// Request hook that handles common states and error handling
export const useRequest = <T>(requestFn: () => Promise<Result<T>>, requestDeps: unknown[], requestOptions?: RequestOptions): Request<T>  => {
  const options = useMemo(() => ({ ...defaultOptions, ...requestOptions }), [requestOptions]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | undefined>(undefined);

  // Sends request, handling loading, error and data states
  const sendRequest = useCallback(async () => {
    setError('');
    setIsLoading(true);

    const response = await requestFn();
    if (!response.success) setError(response.error);
    else setData(response.data);

    setIsLoading(false);
    return response;
  }, [...requestDeps]);

  // Automatically sends request if applicable
  useEffect(() => {
    if (!options.enabled) return;
    sendRequest();
  }, [...requestDeps]);

  return { error, isLoading, data, refetch: sendRequest };
};