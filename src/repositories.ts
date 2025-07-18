import { CError, CreateUserForm, Log, Role, User } from "./entities";

// export interface AdminDB{
//     getAdminById(id:String):User|undefined
// }

export interface SiteDB{
    createUser(request:CreateUserForm):User
    assignRoleToUser(userId:string, role:Role):boolean
    getUserById(userId:string):User|undefined
    insertLog(log:Log):void
}


export interface CCache{

}

// export interface LogsDB{
//     insertLog(log:Log):void
// }