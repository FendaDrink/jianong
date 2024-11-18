const TokenKey = 'planning-system-token';
const username = 'planning-system-username'

export const getToken = () => localStorage.getItem(TokenKey);

export const setToken = (token: string,user:string) => {
    localStorage.setItem(TokenKey, token);
    localStorage.setItem(username, user);
}

export const removeToken = () => {
    localStorage.removeItem(username);
    localStorage.removeItem(TokenKey);
}