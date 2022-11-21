type ID = number | string; // offline server has number as id, directus a string or a number, depending on the configuration

export interface IProject {
    id: ID;
    title: string;
    /**
     * the client id
     */
    client: string;
}

export interface IClient {
    id: ID;
    companyname: string;
    address: string;
    /**
     * an array of join table ids
     */
    contacts: ID[];
    /**
     * an array of join table ids
     */
    projects: ID[];
}

export interface IPerson {
    id: ID;
    firstname: string;
    lastname: string;
    email: string;
    telephone: string;
    /**
     * id of the client this person belongs to
     */
    client: ID;
}

export interface IWorkUnit {
    id: ID;
    start: string;
    end: string;
    description: string | null;
    /**
     * id of the project being worked on
     */
    project: ID;
    /**
     * id of the category being worked on
     */
    category: ID;
    /**
     * id of the user who is working
     */
    worker: ID;
}

export interface ICategory {
    id: ID;
    name: string;
    /**
     * an array of join table ids
     */
    projects: ID[];
}

export interface ICategory_Project {
    id: ID;
    WorkCategory_id: ID;
    Project_id: ID;
}
