export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const USERS_KEY = 'fintrack_users';
const CURRENT_USER_KEY = 'fintrack_current_user';

export function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

export function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function signup(name: string, email: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  
  // Check if email already exists
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'Email sudah terdaftar' };
  }

  const newUser: User = {
    id: Math.random().toString(36).substring(2, 15),
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  // Store password separately (in real app, this should be hashed)
  const passwords = JSON.parse(localStorage.getItem('fintrack_passwords') || '{}');
  passwords[newUser.id] = password;
  localStorage.setItem('fintrack_passwords', JSON.stringify(passwords));

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);

  return { success: true, user: newUser };
}

export function login(email: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return { success: false, error: 'Email tidak ditemukan' };
  }

  const passwords = JSON.parse(localStorage.getItem('fintrack_passwords') || '{}');
  if (passwords[user.id] !== password) {
    return { success: false, error: 'Password salah' };
  }

  setCurrentUser(user);
  return { success: true, user };
}

export function logout(): void {
  setCurrentUser(null);
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
