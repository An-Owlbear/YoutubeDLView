import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { useAtom } from 'jotai';
import jwtDecode from 'jwt-decode';
import { useCallback, useState } from 'react';
import { RefreshInformation } from '../models/apiModels';
import { sessionAtom } from './globalStore';

interface DecodedAccessToken {
  nameid: string;
  unique_name: string;
  nbf: number;
  exp: number;
  iat: number;
  iss: string;
}

interface RequestResponse<T> {
  response: AxiosResponse<T> | null;
  error: AxiosError | null;
}

const useApiRequest = <T>(url: string, method: Method, body: unknown, useAuth: boolean): [T | null, string, boolean, () => Promise<RequestResponse<T>>] => {
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useAtom(sessionAtom);

  // Checks the access token and requests a new one if expired
  const checkTokens = useCallback(async () => {
    // Decodes token and checks expiration
    if (!session) throw 'Access token is null';
    const decodedAccessToken = jwtDecode<DecodedAccessToken>(session.accessToken);
    if (Date.now() <= decodedAccessToken.exp * 1000) return;

    // Requests new token if expired
    try {
      const response = await axios.post('/api/auth/refresh', { refreshToken: session.refreshToken });
      const data: RefreshInformation = response.data;
      setSession({ refreshToken: session.refreshToken, ...data });
    } catch (error) {
      console.log(error);
    }
  }, [body, session]);

  // Sends the request
  const sendRequest = useCallback(async () => {
    // Checks tokens if needed and prepares request
    setError('');
    setLoading(true);
    if (useAuth) await checkTokens();
    const axiosRequest: AxiosRequestConfig = {
      url: url,
      method: method,
      data: body,
      ...(useAuth && {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      })
    };

    // Sends request and returns response and error
    try {
      const axiosResponse = await axios.request<T>(axiosRequest);
      setResponse(axiosResponse.data);
      return { response: axiosResponse, error: null };
    } catch (error) {
      const message = (error as AxiosError).response?.data;
      setError(message);
      return { response: null, error: error as AxiosError };
    } finally {
      setLoading(false);
    }
  }, [url, method, body, useAuth, session]);

  return [response, error, loading, sendRequest];
};

export default useApiRequest;