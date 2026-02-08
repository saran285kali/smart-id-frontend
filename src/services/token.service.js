const TOKEN_KEY = "authToken";

const tokenService = {
    set: (token) => {
        localStorage.setItem(TOKEN_KEY, token);
    },
    get: () => {
        return localStorage.getItem(TOKEN_KEY);
    },
    clear: () => {
        localStorage.removeItem(TOKEN_KEY);
    }
};

export default tokenService;
