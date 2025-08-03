import { CError, CreateUserForm, Repository, Role, Status, User } from "./entities";
import { ADMIN_SUBSCRIPTION_EXPIRED, ADMIN_NOT_FOUND, EMAIL_SUBJECT_ACCOUNT_CREATED, ADMIN_FAILED_ASSIGN_ROLE, ADMIN_ROLE_ASSIGN_SUCCESS, EMAIL_SUBJECT_ROLE_ASSIGNED, USER_NOT_FOUND, ROLE_USER_NOT_AUTHORIZED } from "./constants"

import { checkIfAdminAndIsActive, currentTimestamp } from "./utils";
import { Package } from "qarticle";


export const AdminCreateUserUseCase = async (adminId: string, repository: Repository, user: CreateUserForm): Promise<User | CError> => {
    /**
     * Here the organization admin sets the workflow for all articles or 
     * can set for specific article. 
     * adminId should be provided, this is done after authentication. 
     * 2FA should be implemented for this kind of user on client side.
     * At this point concern is not how this admin Id was obtained.
     * 
     */

    const admin: User | undefined = await repository.db.getUserById(adminId)

    if (admin == undefined) {
        repository.db.insertLog({
            usecase: "AdminCreateUser",
            status: Status.FAILED,
            errorCode: 100,
            description: ADMIN_NOT_FOUND,
            timestamp: currentTimestamp()
        })
        return {
            code: 100,
            title: ADMIN_NOT_FOUND,
            description: "The admin was not found"
        }
    }
    else {
        const userRoles = await repository.db.getUserRoles(adminId)
        if (!userRoles.includes(Role.Admin)) {
            repository.db.insertLog({
                usecase: "AdminCreateUser",
                status: Status.FAILED,
                errorCode: 199,
                description: ROLE_USER_NOT_AUTHORIZED,
                timestamp: currentTimestamp()
            })

            return {
                code: 199,
                title: "UnAuthorized",
                description: ROLE_USER_NOT_AUTHORIZED
            }
        }
        if (admin.isActive) {

            const createdUser = await repository.db.createUser({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: ""
            })
            if (createdUser != null) {
                repository.db.insertLog({
                    usecase: "AdminCreateUser",
                    status: Status.SUCCESS,
                    errorCode: 102,
                    description: `User:${createdUser.email} Role: ${createdUser.role}created successfully`,
                    timestamp: currentTimestamp()
                })

                repository.email.sendEmail(createdUser.email, {
                    subject: EMAIL_SUBJECT_ACCOUNT_CREATED,
                    cc: [admin.email],
                    message: `Dear ${createdUser.firstName.toUpperCase()}\n, Your account has been created successfully, click the link below to sign in`,
                    signoff: "Admin"
                })

                return createdUser
            }
            else return {
                code: 198,
                title: "Fail to create user",
                description: "Failed to insert user"
            }

        }
        else {
            repository.db.insertLog({
                usecase: "AdminCreateUser",
                status: Status.FAILED,
                errorCode: 101,
                description: ADMIN_SUBSCRIPTION_EXPIRED,
                timestamp: currentTimestamp()
            })
            return {
                code: 101,
                title: ADMIN_SUBSCRIPTION_EXPIRED
            }
        }

    }

}
export const PopulateDBWithRoles = async (repository: Repository): Promise<boolean> => {
    return repository.db.populateUserRoles()
}

export const GetRoleByIdUseCase = async (repository: Repository, role: Role): Promise<number | undefined> => {

    const response = await repository.db.getRoleById(role)

    if (response == undefined) {
        repository.db.insertLog({
            usecase: "GetRoleByIdUseCase",
            status: Status.FAILED,
            errorCode: 110,
            description: `Specified role ${role} does not exist`,
            timestamp: currentTimestamp()
        })
        return undefined
    } else {
        repository.db.insertLog({
            usecase: "GetRoleByIdUseCase",
            status: Status.SUCCESS,
            errorCode: 111,
            description: `GET:${role}`,
            timestamp: currentTimestamp()
        })
        return response
    }
}

export const AdminRemoveUserRoleUseCase = async (repository: Repository, adminId: string, userId: string, role: Role): Promise<boolean> => {

    const admin = await repository.db.getUserById(adminId)
    if (admin == undefined) {
        repository.db.insertLog({
            usecase: "AdminRemoveUserRoleUseCase",
            status: Status.FAILED,
            errorCode: 102,
            description: ADMIN_NOT_FOUND,
            timestamp: currentTimestamp()
        })

        return false
    }
    else {

        const roles = await repository.db.getUserRoles(adminId)
        if (!roles.includes(Role.Admin)) {
            repository.db.insertLog({
                usecase: "AdminRemoveUserRoleUseCase",
                status: Status.FAILED,
                errorCode: 102,
                description: ROLE_USER_NOT_AUTHORIZED,
                timestamp: currentTimestamp()
            })

            return false
        }
        if (!admin.isActive) {
            repository.db.insertLog({
                usecase: "AdminRemoveUserRoleUseCase",
                status: Status.FAILED,
                errorCode: 102,
                description: ADMIN_SUBSCRIPTION_EXPIRED,
                timestamp: currentTimestamp()
            })
            return false
        }
    }

    const user = await repository.db.getUserById(userId)

    if (user === undefined) {
        repository.db.insertLog({
            usecase: "RemoveUserRoleUseCase",
            status: Status.FAILED,
            errorCode: 114,
            description: `User not found ${userId}`,
            timestamp: currentTimestamp()
        })

        return false
    }

    else {
        const userHasRole = await repository.db.checkUserHasRole(userId, role)

        if (userHasRole) {
            const roleId = await repository.db.getRoleById(role)
            const removeStatus = await repository.db.removeUserRole(userId, roleId!)
            if (removeStatus) {
                repository.db.insertLog({
                    usecase: "RemoveUserRoleUseCase",
                    status: Status.SUCCESS,
                    description: `Role ${role} successfully removed for user ${userId}`,
                    timestamp: currentTimestamp()

                })

                return removeStatus
            } else {
                repository.db.insertLog({
                    usecase: "RemoveUserRoleUseCase",
                    status: Status.FAILED,
                    description: `Failed to remove role ${role} for user ${user}`,
                    timestamp: currentTimestamp()
                })

                repository.email.sendEmail("admin@quwemo.com", {
                    subject: "Error in removing user role",
                    cc: ["siteadmins@quwemo.com"],
                    message: `Dear Admin\n Failed to remove role ${role} for user ${user}`,
                    signoff: "Admin"
                })
                return false
            }
        }
        else {
            repository.db.insertLog({
                usecase: "RemoveUserRoleUseCase",
                status: Status.FAILED,
                description: `User ${user} does not have role ${role}`,
                timestamp: currentTimestamp()

            })
            return false
        }
    }
}

export const CheckUserHasRoleUseCase = async (repository: Repository, userId: string, role: Role): Promise<boolean> => {
    const user = await repository.db.getUserById(userId)
    if (user === undefined) {
        repository.db.insertLog({
            usecase: "CheckUserHasRoleUseCase",
            status: Status.FAILED,
            errorCode: 115,
            description: `User not found ${userId}`,
            timestamp: currentTimestamp()
        })

        return false
    } else {
        const userRoles = await repository.db.getUserRoles(userId)
        if (userRoles.includes(role)) {
            repository.db.insertLog({
                usecase: "CheckUserHasRoleUseCase",
                status: Status.SUCCESS,
                errorCode: 116,
                description: `User ${user} has a role ${role}`,
                timestamp: currentTimestamp()
            })

            return true
        } else {
            repository.db.insertLog({
                usecase: "CheckUserHasRoleUseCase",
                status: Status.FAILED,
                errorCode: 116,
                description: `User ${user} has a no role ${role}`,
                timestamp: currentTimestamp()
            })
            return false
        }
    }
}
export const GetUserRolesUseCase = async (repository: Repository, userId: string): Promise<Role[]> => {

    const user = await repository.db.getUserById(userId)
    if (user === undefined) {
        repository.db.insertLog({
            usecase: "GetUserRolesUseCase",
            status: Status.FAILED,
            errorCode: 112,
            description: `GET:${userId}`,
            timestamp: currentTimestamp()
        })

        return []
    } else {
        const roles = repository.db.getUserRoles(userId)
        repository.db.insertLog({
            usecase: "GetUserRolesUseCase",
            status: Status.SUCCESS,
            errorCode: 113,
            description: `USER: ${userId}; ROLES: ${roles}`,
            timestamp: currentTimestamp()
        })
        return roles
    }
}
export const AdminAssignUserRole = async (adminId: string, userId: string, role: Role, repository: Repository): Promise<boolean> => {
    /**
     * Assigns different roles to users 
     * Its only an admin that can assign a role to a specific user
     * The user identitity should be existing 
     * Only predefined roles are included 
     * One User can have multiple roles 
     */
    const admin = await repository.db.getUserById(adminId)

    if (admin == undefined) {
        repository.db.insertLog({
            usecase: "AdminAssignUserRole",
            status: Status.FAILED,
            errorCode: 102,
            description: ADMIN_NOT_FOUND,
            timestamp: 1232
        })

        return false

    } else {
        const adminRoles = await repository.db.getUserRoles(adminId)
        if (!adminRoles.includes(Role.Admin)) {
            repository.db.insertLog({
                usecase: "AdminAssignUserRole",
                status: Status.FAILED,
                errorCode: 199,
                description: ROLE_USER_NOT_AUTHORIZED,
                timestamp: currentTimestamp()
            })

            return false
        }
        if (!admin.isActive) {
            repository.db.insertLog({
                usecase: "AdminAssignUserRole",
                status: Status.FAILED,
                errorCode: 103,
                description: ADMIN_SUBSCRIPTION_EXPIRED,
                timestamp: currentTimestamp()
            })

            return false
        }
        else {

            const user: User | undefined = await repository.db.getUserById(userId)

            if (user != undefined) {
                const userRoles = await repository.db.getUserRoles(userId)
                // console.log(role)
                if (userRoles.includes(role)){
                    repository.db.insertLog({
                        usecase:"AdminAssignUserRole",
                        status:Status.FAILED,
                        errorCode:102,
                        description: `User: ${userId} already has a role ${role}`,
                        timestamp: currentTimestamp()
                    })
                    return false;
                }
                repository.db.assignRoleToUser(userId, role)
                repository.db.insertLog({
                    usecase: "AdminAssignUserRole",
                    status: Status.SUCCESS,
                    errorCode: 104,
                    description: ADMIN_ROLE_ASSIGN_SUCCESS,
                    timestamp: currentTimestamp()
                })
                repository.email.sendEmail(user.email, {
                    subject: EMAIL_SUBJECT_ROLE_ASSIGNED,
                    cc: [admin.email],
                    message: `Dear ${user.firstName.toUpperCase()}\n You have been assigned a role ${role}. `,
                    signoff: "Admin"
                })

                return true

            } else {
                repository.db.insertLog({
                    usecase: "AdminAssignUserRole",
                    status: Status.FAILED,
                    errorCode: 105,
                    description: USER_NOT_FOUND,
                    timestamp: currentTimestamp()
                })

                repository.email.sendEmail(admin.email, {
                    subject: EMAIL_SUBJECT_ROLE_ASSIGNED,
                    message: `Dear ${admin.firstName.toUpperCase()}\n failed to assign role ${role} to user with id ${userId}. `,
                    signoff: "System"
                })

                return false
            }

        }
    }
}

export const AdminDeleteUser = async (repository:Repository, adminId:string, userId:string):Promise<boolean> => {
    /**
     * 
     * Removes user
     */

   const adminStatus = await checkIfAdminAndIsActive(repository, adminId)
   if(!adminStatus) return false 
    const user = await repository.db.getUserById(userId)
    if (user === undefined){
        return false 
    }

    return repository.db.deleteUser(userId)


    
}

export const AdminUpdateUserPackage = async (repository:Repository, adminId:string, userId:string, usrPackage:Package):Promise<boolean> => {
    /**
     * Updates user package
     */

    const adminStatus = await checkIfAdminAndIsActive(repository, adminId)
    if(!adminStatus) return false 

    return true
}

export const AdminMakePaymentToSubscription = (user: User) => {
    /**
     * 
     * 
     */
}

export const AdminViewAnalytics = (user: User) => {
    /**
     * 
     */
}
export const StaffWriterWritesArticle = (user: User) => {
    /**
     * By writing an article an entry is created on the database 
     * A default state of Writing is assigned to the article 
     * Writer should save the article 
     * Once completed, the article is to be submitted to the next workflow
     */

}


export const IllustratorUploadsImagesVideosFiles = (user: User) => {
    /**
     * 
     * Upload images, files videos to support article
     */
}

export const ColumnistAddsOpinionPieces = (user: User) => {
    /***
     * Writes opinion pieces or recuring commentary on specific topics
     */
}

export const EditorFactChecksAndSubmitsArticleForPublishing = (user: User) => {
    /**
     * Staff writer after submitting gets to the editor depending on the workflow 
     * Editor add any other materials to the article, images , videos or files
     * Check facts and illustrations
     */
}

export const SalesIncludesAdsToBeAttached = (user: User) => {
    /**
     * Sales manager attaches needed ads and promotions to the web page
     */
}
export const PageDesignerChecksPageStyles = (user: User) => {
    /**
     * Checks the page styles brands aligns page sections 
     */
}

export const PublisherReleasesDeletesPost = (user: User) => {
    /**
     * Final step, publisher releases the post to be live, or deletes its
     */
}

export const SocialMediaShareToSocialMedia = (user: User) => {
    /**
     * Published article, shared to social media
     */
}


export const SocialMediaReviewComments = (user: User) => {
    /**
     * Review comments on shared blog
     */
}

export const SocialMediaReplyToComments = (user: User) => {
    /**
     * Part of user engagement is to reply to user comments
     */
}


