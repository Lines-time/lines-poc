export const offline = (server: TServer): TApi => {
    return {
        auth: {
            login: () => {
                return true;
            },
            logout: () => {},
            isAuthenticated: () => true,
        },
    };
};
