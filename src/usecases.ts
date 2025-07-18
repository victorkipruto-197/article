import { CError, CreateUserForm, Repository, Role, Status, User } from "./entities";
import {ADMIN_SUBSCRIPTION_EXPIRED,ADMIN_NOT_FOUND, EMAIL_SUBJECT_ACCOUNT_CREATED, ADMIN_FAILED_ASSIGN_ROLE, ADMIN_ROLE_ASSIGN_SUCCESS, EMAIL_SUBJECT_ROLE_ASSIGNED, USER_NOT_FOUND, ROLE_USER_NOT_AUTHORIZED} from "./constants"


export const AdminCreateUser = (adminId: string, repository: Repository, user: CreateUserForm): User | CError => {
    /**
     * Here the organization admin sets the workflow for all articles or 
     * can set for specific article. 
     * adminId should be provided, this is done after authentication. 
     * 2FA should be implemented for this kind of user on client side.
     * At this point concern is not how this admin Id was obtained.
     * 
     */

    const admin: User | undefined = repository.db.getUserById(adminId)

    if (admin == undefined) {
        repository.db.insertLog({
            usecase: "AdminCreateUser",
            status: Status.FAILED,
            errorCode: 100,
            description: ADMIN_NOT_FOUND,
            timestamp: 123
        })
        return {
            code: 100,
            title: ADMIN_NOT_FOUND,
            description: "The admin was not found"
        }
    }
    else {
        if(!admin.role.includes(Role.Admin)){
            repository.db.insertLog({
                usecase:"AdminCreateUser",
                status:Status.FAILED,
                errorCode:199,
                description: ROLE_USER_NOT_AUTHORIZED,
                timestamp:123
            })

            return {
                code:199,
                title:"UnAuthorized",
                description: ROLE_USER_NOT_AUTHORIZED
            }
        }
        if (admin.isActive) {

            const createdUser = repository.db.createUser({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: ""
            })
            repository.db.insertLog({
                usecase: "AdminCreateUser",
                status: Status.SUCCESS,
                errorCode: 102,
                description: `User:${createdUser.email} Role: ${createdUser.role}created successfully`,
                timestamp: 123
            })

            repository.email.sendEmail(createdUser.email, {
                subject: EMAIL_SUBJECT_ACCOUNT_CREATED,
                cc:[admin.email],
                message: `Dear ${createdUser.firstName.toUpperCase()}\n, Your account has been created successfully, click the link below to sign in`,
                signoff:"Admin"
            })
            
            return createdUser
        }
        else {
            repository.db.insertLog({
                usecase: "AdminCreateUser",
                status: Status.FAILED,
                errorCode: 101,
                description: ADMIN_SUBSCRIPTION_EXPIRED,
                timestamp: 123
            })
            return {
                code: 101,
                title: ADMIN_SUBSCRIPTION_EXPIRED
            }
        }

    }

}

export const AdminAssignUserRole = (adminId: string, userId:string, role:Role, repository:Repository):boolean => {
    /**
     * Assigns different roles to users 
     * Its only an admin that can assign a role to a specific user
     * The user identitity should be existing 
     * Only predefined roles are included 
     * One User can have multiple roles 
     */
    const admin = repository.db.getUserById(adminId)

    if (admin == undefined){
        repository.db.insertLog({
            usecase:"AdminAssignUserRole",
            status: Status.FAILED,
            errorCode: 102, 
            description: ADMIN_NOT_FOUND,
            timestamp:1232
        })

        return false
        
    }else{
        if(!admin.role.includes(Role.Admin)){
            repository.db.insertLog({
                usecase:"AdminAssignUserRole",
                status:Status.FAILED,
                errorCode:199,
                description: ROLE_USER_NOT_AUTHORIZED,
                timestamp:123
            })

            return false
        }
        if (admin.isActive){
            repository.db.insertLog({
                usecase:"AdminAssignUserRole",
                status:Status.FAILED,
                errorCode:103,
                description:ADMIN_SUBSCRIPTION_EXPIRED,
                timestamp:123
            })

            return false 
        }
        else{
           
            const user:User|undefined = repository.db.getUserById(userId)
            if (user != undefined){
                 repository.db.assignRoleToUser(userId, role)
                    repository.db.insertLog({
                        usecase:"AdminAssignUserRole",
                        status:Status.SUCCESS,
                        errorCode:104,
                        description: ADMIN_ROLE_ASSIGN_SUCCESS,
                        timestamp:1324
                    })
                repository.email.sendEmail(user.email,{
                    subject: EMAIL_SUBJECT_ROLE_ASSIGNED,
                    cc: [admin.email],
                    message: `Dear ${user.firstName.toUpperCase()}\n You have been assigned a role ${role}. `,
                    signoff:"Admin"
                })

                return true

            }else{
                repository.db.insertLog({
                    usecase:"AdminAssignUserRole",
                    status:Status.FAILED,
                    errorCode:105,
                    description:USER_NOT_FOUND,
                    timestamp:1234
                })

                repository.email.sendEmail(admin.email,{
                    subject: EMAIL_SUBJECT_ROLE_ASSIGNED,
                    message: `Dear ${admin.firstName.toUpperCase()}\n failed to assign role ${role} to user with id ${userId}. `,
                    signoff:"System"
                })

                return false
            }

        }
    }
}

export const AdminDeleteUser = (user: User) => {
    /**
     * 
     * Removes user
     */
}

export const AdminUpdateUserPackage = (user: User) => {
    /**
     * Updates user package
     */
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


