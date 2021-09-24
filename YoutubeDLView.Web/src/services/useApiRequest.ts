import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';
import jwtDecode from 'jwt-decode';
import { useCallback, useState } from 'react';
import { RefreshInformation } from '../models/apiModels';

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

export const useApiRequest = <T>(url: string, method: Method, useAuth: boolean, data?: RequestData): [string, boolean, (requestData?: RequestData) => Promise<T | null>] => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Checks the access token and requests a new one if expired
  const checkTokens = useCallback(async () => {
    // Decodes token and checks expiration
    if (!localStorage.accessToken || !localStorage.refreshToken) throw 'Access token is null';
    const decodedAccessToken = jwtDecode<DecodedAccessToken>(localStorage.accessToken);
    if (Date.now() <= decodedAccessToken.exp * 1000) return;

    // Requests new token if expired
    try {
      const response = await axios.post('/api/auth/refresh', { refreshToken: localStorage.refreshToken });
      const data: RefreshInformation = response.data;
      localStorage.setItem('accessToken', data.accessToken);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Sends the request
  const sendRequest = useCallback(async (requestData?: RequestData) => {
    // Checks tokens if needed and prepares request
    setError('');
    setLoading(true);
    if (useAuth) await checkTokens();
    const axiosRequest: AxiosRequestConfig = {
      url: url,
      method: method,
      params: requestData?.params ?? data?.params,
      data: requestData?.body ?? data?.body,
      ...(useAuth && {
        headers: {
          'Authorization': `Bearer ${localStorage}`
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
  }, [url, method, data, useAuth, checkTokens]);

  return [error, loading, sendRequest];
};
