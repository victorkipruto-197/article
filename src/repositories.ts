import { CError, CreateUserForm, Log, Role, User } from "./entities";

// export interface AdminDB{
//     getAdminById(id:String):User|undefined
// }

export interface SiteDB{
    populateUserRoles():Promise<boolean>
    createUser(request:CreateUserForm):Promise<User|null>
    assignRoleToUser(userId:string, role:Role):Promise<boolean>
    getUserById(userId:string):Promise<User|undefined>
    insertLog(log:Log):Promise<void>

    getRoleById(role:Role):Promise<number|undefined>
    getUserRoles(userId:string):Promise<Role[]>
    removeUserRole(userId:string, roleId:number):Promise<boolean>
    checkUserHasRole(userId:string, roles:Role):Promise<boolean>

}


export interface CCache{

}

// export interface LogsDB{
//     insertLog(log:Log):void
// }