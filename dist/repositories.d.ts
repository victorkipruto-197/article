import { CreateUserForm, Log, Role, User } from "./entities";
export interface SiteDB {
    createUser(request: CreateUserForm): User;
    assignRoleToUser(userId: string, role: Role): boolean;
    getUserById(userId: string): User | undefined;
}
export interface CCache {
}
export interface LogsDB {
    insertLog(log: Log): void;
}
