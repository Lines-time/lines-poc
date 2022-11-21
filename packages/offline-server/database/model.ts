import Dexie, { Table } from "dexie";
import { ICategory, IClient, IPerson, IProject, IWorkUnit } from "lines-types/tables";

export class LinesDatabase extends Dexie {
    public projects: Table<IProject, number>;
    public clients: Table<IClient, number>;
    public persons: Table<IPerson, number>;
    public workUnits: Table<IWorkUnit, number>;
    public categories: Table<ICategory, number>;

    public constructor() {
        super("LinesDatabase");
        this.version(1).stores({
            projects: "++id, title",
            clients: "++id, companyname, address",
            persons: "++id, firstname, lastname, email, telephone",
            workUnits: "++id, start, end, description",
            categories: "++id, name",
        });
    }
}
