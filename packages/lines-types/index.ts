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
};

export type TApi = {
    auth: {
        login: (email: string, password: string) => boolean | Promise<boolean>;
        logout: () => void;
        isAuthenticated: () => boolean | Promise<boolean>;
        getCurrentUser: () => PromiseOptional<Partial<TUser>>;
        getAuthToken: () => PromiseOptional<string>;
    };
    project: ApiGetters<TProject> & {};
    category: ApiGetters<TCategory> & {
        getForProject: (id: string) => PromiseOptional<Optional<TCategory>[]>;
    };
    workUnit: ApiSetters<TWorkUnit> & {
        getForDayAndUser: (day: Date, userId?: string) => PromiseOptional<Optional<TWorkUnit>[]>;
    };
    workTimeTargetBlock: Pick<ApiGetters<TWorkTimeTargetBlock>, "getById"> & {
        getForUser: (id: string) => PromiseOptional<Optional<TWorkTimeTargetBlock>[]>;
    };
    dailyWorkTimeTarget: Pick<ApiGetters<TDailyWorkTimeTarget>, "getById"> & {};
};

type TDirectusCollectionProperties = {
    id: string;
};

type TDirectusJoinCollectionProperties = {
    id: number;
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

export type TUser = TDirectusCollectionProperties & {
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
    workTimeTargetBlocks: (string | undefined)[];
};

export type TWorkTimeTargetBlock = TDirectusCollectionProperties & {
    start: string;
    end: string | null;
    note: string | null;
    workerId: string;
    DailyWorkTimeTargets: string[];
};

export type TDailyWorkTimeTarget = TDirectusCollectionProperties & {
    dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    start: string | null;
    end: string | null;
    duration: string;
    blockId: string;
};
