import jwtDecode from 'jwt-decode';
import Result from '../models/Result';
import { RefreshInformation, VideoInformation } from '../models/apiModels';

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

const sendRequest = async <T>(url: string, requestInit: RequestInit) => {
  // Handles pre-request checks and sends request
  const preRequestResult = await preRequest();
  if (!preRequestResult.success) return Result.failure<T>(preRequestResult.error);
  const response = await fetch(url, withDefaultHeaders(requestInit));
  if (response.ok) return response.json().then((x: T) => Result.ok(x));
  return response.text().then(x => Result.failure<T>(x));
};

abstract class HttpClient {
  public static GetVideo = (id: string): Promise<Result<VideoInformation>> =>
    sendRequest<VideoInformation>(`/api/videos/${id}`, { });

  public static GetVideos = (skip = 0, take = 30): Promise<Result<VideoInformation[]>> =>
    sendRequest<VideoInformation[]>(`/api/videos?skip=${skip}&take=${take}`, { });
}

export default HttpClient;