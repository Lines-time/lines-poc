import { Directus } from "@directus/sdk";

import type {
    TProject,
    TClient,
    TPerson,
    TCategory,
    TWorkUnit,
    TWorkTimeTargetBlock,
    TDailyWorkTimeTarget,
    TFreeDay,
    TVacation,
    TSettings,
    TUser,
} from "lines-types";

export const directus = new Directus<TDirectus>("/api", {});

type TDirectus = {
    Project: TProject;
    Client: TClient;
    Person: TPerson;
    WorkCategory: TCategory;
    WorkUnit: TWorkUnit;
    WorkTimeTargetBlock: TWorkTimeTargetBlock;
    DailyWorkTimeTarget: TDailyWorkTimeTarget;
    FreeDay: TFreeDay;
    Vacation: TVacation;
    Settings: TSettings;
    directus_users: TUser;
};
