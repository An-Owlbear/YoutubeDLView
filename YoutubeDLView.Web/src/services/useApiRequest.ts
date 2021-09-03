import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';
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

export interface RequestData {
  params?: unknown;
  body?: unknown;
}

export const useApiRequest = <T>(url: string, method: Method, useAuth: boolean, data?: RequestData): [string, boolean, () => Promise<T | null>] => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useAtom(sessionAtom);

  // Checks the access token and requests a new one if expired
  const checkTokens = useCallback(async () => {
    // Decodes token and checks expiration
    if (!session) throw 'Access token is null';
    const decodedAccessToken = jwtDecode<DecodedAccessToken>(session.accessToken);
    if (Date.now() <= decodedAccessToken.exp * 1000) return session;

    // Requests new token if expired
    try {
      const response = await axios.post('/api/auth/refresh', { refreshToken: session.refreshToken });
      const data: RefreshInformation = response.data;
      const newSession = { refreshToken: session.refreshToken, ...data };
      setSession(newSession);
      return newSession;
    } catch (error) {
      console.log(error);
    }
  }, [data, session]);

  // Sends the request
  const sendRequest = useCallback(async () => {
    // Checks tokens if needed and prepares request
    setError('');
    setLoading(true);
    let accessToken = session?.accessToken;
    if (useAuth) {
      const currentSession = await checkTokens();
      accessToken = currentSession?.accessToken;
    }
    const axiosRequest: AxiosRequestConfig = {
      url: url,
      method: method,
      params: data?.params,
      data: data?.body,
      ...(useAuth && {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
    };

    // Sends request and returns response and error
    try {
      const axiosResponse = await axios.request<T>(axiosRequest);
      return axiosResponse.data;
    } catch (error) {
      const message = (error as AxiosError).response?.data;
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [url, method, data, useAuth, session]);

  return [error, loading, sendRequest];
};
