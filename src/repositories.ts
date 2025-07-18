import { CError, CreateUserForm, Log, Role, User } from "./entities";

// export interface AdminDB{
//     getAdminById(id:String):User|undefined
// }

export interface SiteDB{
    createUser(request:CreateUserForm):Promise<User|null>
    assignRoleToUser(userId:string, role:Role):Promise<boolean>
    getUserById(userId:string):Promise<User|undefined>
    insertLog(log:Log):Promise<void>
}


export interface CCache{

}

// export interface LogsDB{
//     insertLog(log:Log):void
// }