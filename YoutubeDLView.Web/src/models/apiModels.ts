export interface LoginInformation {
  userId: string;
  username: string;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshInformation {
  refreshToken: string;
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
  channelResponse: ChannelInformation
}

export interface UserAccount {
  id: string;
  username: string;
  password: boolean;
}