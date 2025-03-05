export const isAuthenticated = (): boolean => {
 if (typeof window !== 'undefined') {
   return !!localStorage.getItem('token');
 }
 return false;
};

export const setAuthToken = (token: string) => {
 document.cookie = `token=${token}; path=/; secure; SameSite=Strict; max-age=3600`;
 localStorage.setItem('token', token);
};

export const clearAuthToken = () => {
 document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
 localStorage.removeItem('token');
};
