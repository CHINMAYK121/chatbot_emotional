
import { createContext } from 'react';

export interface User {
  name: string;
  email: string;
  profilePicture: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  updateUser: (details: Partial<Pick<User, 'name' | 'profilePicture'>>) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});
