export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Item {
  _id: string;
  userId: string;
  type: 'note' | 'link';
  title: string;
  content: string;
  url?: string;
  tags: string[];
  isPublic: boolean;
  shareId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}