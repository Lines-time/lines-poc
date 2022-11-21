export interface IRemote {
    type: "directus";
    url: string;
}

export interface IOffline {
    type: "offline";
}

export type TServer = (IOffline | IRemote) & {
    id: string;
    display_name: string;
    default?: boolean;
};

type PromiseOptional<T> = Promise<Optional<T>> | Optional<T>;
type Optional<T> = T | undefined | null;

type ApiGetters<T> = {
    getAll: () => PromiseOptional<Optional<T>[]>;
    getById: (id: string) => PromiseOptional<T>;
};

type ApiSetters<T> = {
    createOne: (data: Partial<T>) => PromiseOptional<T>;
}

export type TApi = {
    auth: {
        login: (email: string, password: string) => boolean | Promise<boolean>;
        logout: () => void;
        isAuthenticated: () => boolean | Promise<boolean>;
    };
    project: ApiGetters<TProject> & {};
    category: ApiGetters<TCategory> & {
        getForProject: (id: string) => PromiseOptional<Optional<TCategory>[]>;
    };
    workUnit: ApiSetters<TWorkUnit> & {
        getForDayAndUser: (day: Date, userId?: string) => PromiseOptional<Optional<TWorkUnit>[]>;
    };
};

type TDirectusCollectionProperties = {
    id: string;
    sort: string | null;
    user_created: string;
    user_updated: string | null;
    date_created: string;
    date_updated: string | null;
};

type TDirectusJoinCollectionProperties = {
    id: string;
};

export type TProject = TDirectusCollectionProperties & {
    title: string;
    client: string;
    workers: unknown[];
    categories: unknown[];
};

export type TClient = TDirectusCollectionProperties & {
    comanyname: string;
    address: string;
    contacts: unknown[];
    projects: unknown[];
};

export type TCategory = TDirectusCollectionProperties & {
    name: string;
    projects: string[];
};

export type TCategory_Project = TDirectusJoinCollectionProperties & {
    WorkCategory_id: string;
    Project_id: string;
};

export type TWorkUnit = TDirectusCollectionProperties & {
    start: string;
    end: string;
    worker: string;
    project: string;
    category: string;
    description: string | null;
};

export type TPerson = TDirectusCollectionProperties & {
    firstname: string;
    lastname: string;
    email: string;
    telephone: string;
    client: string;
};
