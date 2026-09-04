const TOKEN_KEY = "accessToken";
const USER_KEY = "user";

export interface StoredUser {
  fullName: string;
  email: string;
  roles: string[];
}

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function saveUser(
  fullName: string,
  email: string,
  roles: string[]
) {
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      fullName,
      email,
      roles,
    })
  );
}

export function getUser(): StoredUser | null {
  const user = localStorage.getItem(USER_KEY);

  return user ? JSON.parse(user) : null;
}