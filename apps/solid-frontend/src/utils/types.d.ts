interface IRemote {
    type: "directus";
    url: string;
}

interface IOffline {
    type: "offline";
}

type TServer = (IOffline | IRemote) & {
    id: string;
    display_name: string;
    default?: boolean;
};

type TApi = {
    auth: {
        login: (email: string, password: string) => boolean | Promise<boolean>;
        logout: () => void;
    };
};
