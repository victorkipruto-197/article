"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialMediaReplyToComments = exports.SocialMediaReviewComments = exports.SocialMediaShareToSocialMedia = exports.PublisherReleasesDeletesPost = exports.PageDesignerChecksPageStyles = exports.SalesIncludesAdsToBeAttached = exports.EditorFactChecksAndSubmitsArticleForPublishing = exports.ColumnistAddsOpinionPieces = exports.IllustratorUploadsImagesVideosFiles = exports.StaffWriterWritesArticle = exports.AdminViewAnalytics = exports.AdminMakePaymentToSubscription = exports.AdminUpdateUserPackage = exports.AdminDeleteUser = exports.AdminAssignUserRole = exports.GetUserRolesUseCase = exports.CheckUserHasRoleUseCase = exports.RemoveUserRoleUseCase = exports.GetRoleByIdUseCase = exports.PopulateDBWithRoles = exports.AdminCreateUser = void 0;
const entities_1 = require("./entities");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const AdminCreateUser = (adminId, repository, user) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * Here the organization admin sets the workflow for all articles or
     * can set for specific article.
     * adminId should be provided, this is done after authentication.
     * 2FA should be implemented for this kind of user on client side.
     * At this point concern is not how this admin Id was obtained.
     *
     */
    const admin = yield repository.db.getUserById(adminId);
    if (admin == undefined) {
        repository.db.insertLog({
            usecase: "AdminCreateUser",
            status: entities_1.Status.FAILED,
            errorCode: 100,
            description: constants_1.ADMIN_NOT_FOUND,
            timestamp: (0, utils_1.currentTimestamp)()
        });
        return {
            code: 100,
            title: constants_1.ADMIN_NOT_FOUND,
            description: "The admin was not found"
        };
    }
    else {
        if (!admin.role.includes(entities_1.Role.Admin)) {
            repository.db.insertLog({
                usecase: "AdminCreateUser",
                status: entities_1.Status.FAILED,
                errorCode: 199,
                description: constants_1.ROLE_USER_NOT_AUTHORIZED,
                timestamp: (0, utils_1.currentTimestamp)()
            });
            return {
                code: 199,
                title: "UnAuthorized",
                description: constants_1.ROLE_USER_NOT_AUTHORIZED
            };
        }
        if (admin.isActive) {
            const createdUser = yield repository.db.createUser({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: ""
            });
            if (createdUser != null) {
                repository.db.insertLog({
                    usecase: "AdminCreateUser",
                    status: entities_1.Status.SUCCESS,
                    errorCode: 102,
                    description: `User:${createdUser.email} Role: ${createdUser.role}created successfully`,
                    timestamp: (0, utils_1.currentTimestamp)()
                });
                repository.email.sendEmail(createdUser.email, {
                    subject: constants_1.EMAIL_SUBJECT_ACCOUNT_CREATED,
                    cc: [admin.email],
                    message: `Dear ${createdUser.firstName.toUpperCase()}\n, Your account has been created successfully, click the link below to sign in`,
                    signoff: "Admin"
                });
                return createdUser;
            }
            else
                return {
                    code: 198,
                    title: "Fail to create user",
                    description: "Failed to insert user"
                };
        }
        else {
            repository.db.insertLog({
                usecase: "AdminCreateUser",
                status: entities_1.Status.FAILED,
                errorCode: 101,
                description: constants_1.ADMIN_SUBSCRIPTION_EXPIRED,
                timestamp: (0, utils_1.currentTimestamp)()
            });
            return {
                code: 101,
                title: constants_1.ADMIN_SUBSCRIPTION_EXPIRED
            };
        }
    }
});
exports.AdminCreateUser = AdminCreateUser;
const PopulateDBWithRoles = (repository) => __awaiter(void 0, void 0, void 0, function* () {
    return repository.db.populateUserRoles();
});
exports.PopulateDBWithRoles = PopulateDBWithRoles;
const GetRoleByIdUseCase = (repository, role) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield repository.db.getRoleById(role);
    if (response == undefined) {
        repository.db.insertLog({
            usecase: "GetRoleByIdUseCase",
            status: entities_1.Status.FAILED,
            errorCode: 110,
            description: `Specified role ${role} does not exist`,
            timestamp: (0, utils_1.currentTimestamp)()
        });
        return undefined;
    }
    else {
        repository.db.insertLog({
            usecase: "GetRoleByIdUseCase",
            status: entities_1.Status.SUCCESS,
            errorCode: 111,
            description: `GET:${role}`,
            timestamp: (0, utils_1.currentTimestamp)()
        });
        return response;
    }
});
exports.GetRoleByIdUseCase = GetRoleByIdUseCase;
const RemoveUserRoleUseCase = (repository, userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield repository.db.getUserById(userId);
    if (user === undefined) {
        repository.db.insertLog({
            usecase: "RemoveUserRoleUseCase",
            status: entities_1.Status.FAILED,
            errorCode: 114,
            description: `User not found ${userId}`,
            timestamp: (0, utils_1.currentTimestamp)()
        });
        return false;
    }
    else {
        const userHasRole = yield repository.db.checkUserHasRole(userId, role);
        if (userHasRole) {
            const removeStatus = yield repository.db.removeUserRole(userId, role);
            if (removeStatus) {
                repository.db.insertLog({
                    usecase: "RemoveUserRoleUseCase",
                    status: entities_1.Status.SUCCESS,
                    description: `Role ${role} successfully removed for user ${userId}`,
                    timestamp: (0, utils_1.currentTimestamp)()
                });
                return removeStatus;
            }
            else {
                repository.db.insertLog({
                    usecase: "RemoveUserRoleUseCase",
                    status: entities_1.Status.FAILED,
                    description: `Failed to remove role ${role} for user ${user}`,
                    timestamp: (0, utils_1.currentTimestamp)()
                });
                repository.email.sendEmail("admin@quwemo.com", {
                    subject: "Error in removing user role",
                    cc: ["siteadmins@quwemo.com"],
                    message: `Dear Admin\n Failed to remove role ${role} for user ${user}`,
                    signoff: "Admin"
                });
                return false;
            }
        }
        else {
            repository.db.insertLog({
                usecase: "RemoveUserRoleUseCase",
                status: entities_1.Status.FAILED,
                description: `User ${user} does not have role ${role}`,
                timestamp: (0, utils_1.currentTimestamp)()
            });
            return false;
        }
    }
});
exports.RemoveUserRoleUseCase = RemoveUserRoleUseCase;
const CheckUserHasRoleUseCase = (repository, userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield repository.db.getUserById(userId);
    if (user === undefined) {
        repository.db.insertLog({
            usecase: "CheckUserHasRoleUseCase",
            status: entities_1.Status.FAILED,
            errorCode: 115,
            description: `User not found ${userId}`,
            timestamp: (0, utils_1.currentTimestamp)()
        });
        return false;
    }
    else {
        const userRoles = yield repository.db.getUserRoles(userId);
        if (userRoles.includes(role)) {
            repository.db.insertLog({
                usecase: "CheckUserHasRoleUseCase",
                status: entities_1.Status.SUCCESS,
                errorCode: 116,
                description: `User ${user} has a role ${role}`,
                timestamp: (0, utils_1.currentTimestamp)()
            });
            return true;
        }
        else {
            repository.db.insertLog({
                usecase: "CheckUserHasRoleUseCase",
                status: entities_1.Status.FAILED,
                errorCode: 116,
                description: `User ${user} has a no role ${role}`,
                timestamp: (0, utils_1.currentTimestamp)()
            });
            return false;
        }
    }
});
exports.CheckUserHasRoleUseCase = CheckUserHasRoleUseCase;
const GetUserRolesUseCase = (repository, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield repository.db.getUserById(userId);
    if (user === undefined) {
        repository.db.insertLog({
            usecase: "GetUserRolesUseCase",
            status: entities_1.Status.FAILED,
            errorCode: 112,
            description: `GET:${userId}`,
            timestamp: (0, utils_1.currentTimestamp)()
        });
        return [];
    }
    else {
        const roles = repository.db.getUserRoles(userId);
        repository.db.insertLog({
            usecase: "GetUserRolesUseCase",
            status: entities_1.Status.SUCCESS,
            errorCode: 113,
            description: `USER: ${userId}; ROLES: ${roles}`,
            timestamp: (0, utils_1.currentTimestamp)()
        });
        return roles;
    }
});
exports.GetUserRolesUseCase = GetUserRolesUseCase;
const AdminAssignUserRole = (adminId, userId, role, repository) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * Assigns different roles to users
     * Its only an admin that can assign a role to a specific user
     * The user identitity should be existing
     * Only predefined roles are included
     * One User can have multiple roles
     */
    const admin = yield repository.db.getUserById(adminId);
    if (admin == undefined) {
        repository.db.insertLog({
            usecase: "AdminAssignUserRole",
            status: entities_1.Status.FAILED,
            errorCode: 102,
            description: constants_1.ADMIN_NOT_FOUND,
            timestamp: 1232
        });
        return false;
    }
    else {
        const adminRoles = yield repository.db.getUserRoles(adminId);
        if (!adminRoles.includes(entities_1.Role.Admin)) {
            repository.db.insertLog({
                usecase: "AdminAssignUserRole",
                status: entities_1.Status.FAILED,
                errorCode: 199,
                description: constants_1.ROLE_USER_NOT_AUTHORIZED,
                timestamp: (0, utils_1.currentTimestamp)()
            });
            return false;
        }
        if (!admin.isActive) {
            repository.db.insertLog({
                usecase: "AdminAssignUserRole",
                status: entities_1.Status.FAILED,
                errorCode: 103,
                description: constants_1.ADMIN_SUBSCRIPTION_EXPIRED,
                timestamp: (0, utils_1.currentTimestamp)()
            });
            return false;
        }
        else {
            const user = yield repository.db.getUserById(userId);
            if (user != undefined) {
                repository.db.assignRoleToUser(userId, role);
                repository.db.insertLog({
                    usecase: "AdminAssignUserRole",
                    status: entities_1.Status.SUCCESS,
                    errorCode: 104,
                    description: constants_1.ADMIN_ROLE_ASSIGN_SUCCESS,
                    timestamp: (0, utils_1.currentTimestamp)()
                });
                repository.email.sendEmail(user.email, {
                    subject: constants_1.EMAIL_SUBJECT_ROLE_ASSIGNED,
                    cc: [admin.email],
                    message: `Dear ${user.firstName.toUpperCase()}\n You have been assigned a role ${role}. `,
                    signoff: "Admin"
                });
                return true;
            }
            else {
                repository.db.insertLog({
                    usecase: "AdminAssignUserRole",
                    status: entities_1.Status.FAILED,
                    errorCode: 105,
                    description: constants_1.USER_NOT_FOUND,
                    timestamp: (0, utils_1.currentTimestamp)()
                });
                repository.email.sendEmail(admin.email, {
                    subject: constants_1.EMAIL_SUBJECT_ROLE_ASSIGNED,
                    message: `Dear ${admin.firstName.toUpperCase()}\n failed to assign role ${role} to user with id ${userId}. `,
                    signoff: "System"
                });
                return false;
            }
        }
    }
});
exports.AdminAssignUserRole = AdminAssignUserRole;
const AdminDeleteUser = (user) => {
    /**
     *
     * Removes user
     */
};
exports.AdminDeleteUser = AdminDeleteUser;
const AdminUpdateUserPackage = (user) => {
    /**
     * Updates user package
     */
};
exports.AdminUpdateUserPackage = AdminUpdateUserPackage;
const AdminMakePaymentToSubscription = (user) => {
    /**
     *
     *
     */
};
exports.AdminMakePaymentToSubscription = AdminMakePaymentToSubscription;
const AdminViewAnalytics = (user) => {
    /**
     *
     */
};
exports.AdminViewAnalytics = AdminViewAnalytics;
const StaffWriterWritesArticle = (user) => {
    /**
     * By writing an article an entry is created on the database
     * A default state of Writing is assigned to the article
     * Writer should save the article
     * Once completed, the article is to be submitted to the next workflow
     */
};
exports.StaffWriterWritesArticle = StaffWriterWritesArticle;
const IllustratorUploadsImagesVideosFiles = (user) => {
    /**
     *
     * Upload images, files videos to support article
     */
};
exports.IllustratorUploadsImagesVideosFiles = IllustratorUploadsImagesVideosFiles;
const ColumnistAddsOpinionPieces = (user) => {
    /***
     * Writes opinion pieces or recuring commentary on specific topics
     */
};
exports.ColumnistAddsOpinionPieces = ColumnistAddsOpinionPieces;
const EditorFactChecksAndSubmitsArticleForPublishing = (user) => {
    /**
     * Staff writer after submitting gets to the editor depending on the workflow
     * Editor add any other materials to the article, images , videos or files
     * Check facts and illustrations
     */
};
exports.EditorFactChecksAndSubmitsArticleForPublishing = EditorFactChecksAndSubmitsArticleForPublishing;
const SalesIncludesAdsToBeAttached = (user) => {
    /**
     * Sales manager attaches needed ads and promotions to the web page
     */
};
exports.SalesIncludesAdsToBeAttached = SalesIncludesAdsToBeAttached;
const PageDesignerChecksPageStyles = (user) => {
    /**
     * Checks the page styles brands aligns page sections
     */
};
exports.PageDesignerChecksPageStyles = PageDesignerChecksPageStyles;
const PublisherReleasesDeletesPost = (user) => {
    /**
     * Final step, publisher releases the post to be live, or deletes its
     */
};
exports.PublisherReleasesDeletesPost = PublisherReleasesDeletesPost;
const SocialMediaShareToSocialMedia = (user) => {
    /**
     * Published article, shared to social media
     */
};
exports.SocialMediaShareToSocialMedia = SocialMediaShareToSocialMedia;
const SocialMediaReviewComments = (user) => {
    /**
     * Review comments on shared blog
     */
};
exports.SocialMediaReviewComments = SocialMediaReviewComments;
const SocialMediaReplyToComments = (user) => {
    /**
     * Part of user engagement is to reply to user comments
     */
};
exports.SocialMediaReplyToComments = SocialMediaReplyToComments;
