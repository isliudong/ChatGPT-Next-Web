// user.ts
export interface User {
  id: string;
  token: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

export const DEFAULT_USER: User = {
  id: "",
  token: "",
  username: "",
  email: "",
  avatarUrl: "",
};

export type UserConfig = typeof DEFAULT_USER;
