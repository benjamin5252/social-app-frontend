import { ReactNode } from 'react';

export interface UserObj {
  name: string;
  username: string;
  id: number;
  profilePic: string | undefined;
  followedUserId?: string | undefined;
  coverPic?: string | undefined;
  email? :string;
}

export interface UpdateUserObj {
  name: string;
  profilePic: string | undefined;
  followedUserId?: string | undefined;
  coverPic?: string | undefined;
}

export interface msgObj {
  reply: string;
  message: string;
  from: number;
  to: number;
  sendAt: number;
}

export interface ContextProviderProps {
  children: ReactNode;
}

export interface Props {
  children: ReactNode;
  // any props that come into the component
}

export interface PostObj {
  id: string;
  userId: number;
  img: string;
  name: string;
  createdAt: string;
  desc: string;
}
