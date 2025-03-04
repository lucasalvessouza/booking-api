export const isAuthenticated = (): boolean => {
 if (typeof window !== 'undefined') {
   return !!localStorage.getItem('token');
 }
 return false;
};

export const setAuthToken = (token: string) => {
 localStorage.setItem('token', token);
};

export const clearAuthToken = () => {
 localStorage.removeItem('token');
};
