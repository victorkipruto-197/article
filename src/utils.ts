import { Repository,Role } from "./entities"

export const  currentTimestamp =()=> Date.now()

export const checkIfAdminAndIsActive=async (repository:Repository, adminId:string):Promise<boolean>=>{
     const admin = await repository.db.getUserById(adminId)
        if (admin === undefined){
            return false 
        }
        if(!admin.isActive){
            return false 
        }
        const adminRoles = await repository.db.getUserRoles(adminId)
        if (!adminRoles.includes(Role.Admin)){
            return false 
        }

        return true
}