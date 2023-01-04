type TDirectusCollectionProperties = {
    id: string;
};

type TDirectusJoinCollectionProperties = {
    id: number;
};

export type TProject = TDirectusCollectionProperties & {
    title: string;
    client: string;
    tracking_increment: number | null;
    workers: unknown[];
    categories: unknown[];
    color: string;
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
    use_project_colors: boolean;
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

export type TFreeDay = TDirectusCollectionProperties & {
    date: Date;
    description: string | null;
    percentage: number;
};

export type TVacation = TDirectusCollectionProperties & {
    start: Date;
    end: Date;
    worker: string;
    category: string;
    description: string;
    approved: boolean;
};

export type TSettings = {
    tracking_increment: number;
};
