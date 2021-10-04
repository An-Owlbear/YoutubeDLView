import jwtDecode from 'jwt-decode';
import Result from '../models/Result';
import {
  ChannelInformation,
  LoginInformation,
  RefreshInformation,
  UserAccount,
  VideoInformation
} from '../models/apiModels';

interface DecodedAccessToken {
  nameid: string;
  unique_name: string;
  nbf: number;
  exp: number;
  iat: number;
  iss: string;
}

const withDefaultHeaders = (options: RequestInit) => {
  return {
    ...options,
    headers: {
      'Accept': 'application/json',
      ...(options.body && {
        'Content-Type': 'application/json'
      }),
      ...options.headers,
      ...(localStorage.accessToken && {
        'Authorization': `Bearer ${localStorage.accessToken}`
      })
    }
  };
};

const preRequest = async () => {
  // Retrieves token and checks expiry date
  if (!localStorage.accessToken) return Result.ok();
  const decodedToken = jwtDecode<DecodedAccessToken>(localStorage.accessToken);
  if (Date.now() <= decodedToken.exp * 1000) return Result.ok();

  // Attempts to update access token, returning error if unsuccessful
  if (!localStorage.refreshToken) return Result.failure('Refresh token not set');
  const requestInfo = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken: localStorage.refreshToken })
  };
  const response = await fetch('/api/auth/refresh', requestInfo);
  if (!response.ok) return Result.failure(await response.text());
  const refreshInformation: RefreshInformation = await response.json();
  localStorage.accessToken = refreshInformation.accessToken;
  return Result.ok();
};

const sendRequest = async <T = undefined>(url: string, requestInit: RequestInit = { }) => {
  // Handles pre-request checks and sends request
  const preRequestResult = await preRequest();
  if (!preRequestResult.success) return Result.failure<T>(preRequestResult.error);
  const response = await fetch(url, withDefaultHeaders(requestInit));

  // Returns request result
  if (response.ok) return response.headers.get('Content-Length') !== '0' ?
    response.json().then((x: T) => Result.ok(x)) :
    Result.ok<T>();
  return response.text().then(x => Result.failure<T>(x));
};

abstract class HttpClient {
  public static GetVideo = (id: string): Promise<Result<VideoInformation>> =>
    sendRequest<VideoInformation>(`/api/videos/${id}`);

  public static GetVideos = (skip = 0, take = 30): Promise<Result<VideoInformation[]>> =>
    sendRequest<VideoInformation[]>(`/api/videos?skip=${skip}&take=${take}`);

  public static GetChannel = (id: string): Promise<Result<ChannelInformation>> =>
    sendRequest<ChannelInformation>(`/api/channels/${id}`);

  public static GetChannels = (skip = 0, take = 30): Promise<Result<ChannelInformation[]>> =>
    sendRequest<ChannelInformation[]>(`/api/channels?skip=${skip}&take=${take}`);

  public static GetChannelVideos = (id: string, skip = 0, take = 30): Promise<Result<VideoInformation[]>> =>
    sendRequest<VideoInformation[]>(`/api/channels/${id}/videos?skip=${skip}&take=${take}`);

  // Sends login request and sets tokens in localStorage
  public static Login = async (username: string, password: string): Promise<Result<LoginInformation>> => {
    const body = JSON.stringify({ username, password });
    const response = await sendRequest<LoginInformation>('/api/auth/login', { method: 'POST', body });
    if (response.success && response.data) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response;
  }

  // Sends a signup request
  public static Signup = (username: string, password: string): Promise<Result> => {
    const body = JSON.stringify({ username, password });
    return sendRequest('/api/users/setup', { method: 'POST', body });
  }

  public static GetUsers = (): Promise<Result<UserAccount[]>> => sendRequest<UserAccount[]>('/api/users');

  public static UpdateAccount = (userId: string, username: string, password: string): Promise<Result> => {
    const body = JSON.stringify({ userId, username: username ? username : null, password: password ? password : null });
    return sendRequest('/api/users/update', { method: 'PATCH', body: body });
  }
}

export default HttpClient;