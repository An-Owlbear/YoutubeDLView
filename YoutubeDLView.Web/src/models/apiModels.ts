export interface LoginInformation {
  userId: string;
  username: string;
  accessToken: string;
  refreshToken: string;
  role: string;
}

export interface RefreshInformation {
  userId: string;
  username: string;
  accessToken: string;
}

export interface ChannelInformation {
  id: string;
  name: string;
}

export interface VideoInformation {
  id: string;
  title: string;
  description: string;
  uploadDate: string;
  length: number;
  channel: ChannelInformation
}

export interface UserAccount {
  id: string;
  username: string;
  password: boolean;
}

export interface SourceInformation {
  path: string;
}

export interface SystemInfo {
  operatingSystem: string;
  hostname: string;
  setup: string;
}

export interface ErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  traceId: string;
}