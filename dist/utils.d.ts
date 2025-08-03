import { Repository } from "./entities";
export declare const currentTimestamp: () => number;
export declare const checkIfAdminAndIsActive: (repository: Repository, adminId: string) => Promise<boolean>;
