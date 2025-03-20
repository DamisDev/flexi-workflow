
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export type WorkMode = 
  | "full-remote" 
  | "on-site" 
  | "remote-morning" 
  | "remote-afternoon";

export interface WorkModeSelection {
  userId: string;
  date: Date;
  mode: WorkMode;
}

export interface WorkModeOption {
  id: WorkMode;
  title: string;
  description: string;
  icon: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
