"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialMediaReplyToComments = exports.SocialMediaReviewComments = exports.SocialMediaShareToSocialMedia = exports.PublisherReleasesDeletesPost = exports.PageDesignerChecksPageStyles = exports.SalesIncludesAdsToBeAttached = exports.EditorFactChecksAndSubmitsArticleForPublishing = exports.ColumnistAddsOpinionPieces = exports.IllustratorUploadsImagesVideosFiles = exports.StaffWriterWritesArticle = exports.AdminViewAnalytics = exports.AdminMakePaymentToSubscription = exports.AdminUpdateUserPackage = exports.AdminDeleteUser = exports.AdminAssignUserRole = exports.AdminCreateUser = void 0;
const entities_1 = require("./entities");
const constants_1 = require("./constants");
const AdminCreateUser = (adminId, repository, user) => {
    /**
     * Here the organization admin sets the workflow for all articles or
     * can set for specific article.
     * adminId should be provided, this is done after authentication.
     * 2FA should be implemented for this kind of user on client side.
     * At this point concern is not how this admin Id was obtained.
     *
     */
    const admin = repository.db.getUserById(adminId);
    if (admin == undefined) {
        repository.logs.insertLog({
            usecase: "AdminCreateUser",
            status: entities_1.Status.FAILED,
            errorCode: 100,
            description: constants_1.ADMIN_NOT_FOUND,
            timestamp: 123
        });
        return {
            code: 100,
            title: constants_1.ADMIN_NOT_FOUND,
            description: "The admin was not found"
        };
    }
    else {
        if (!admin.role.includes(entities_1.Role.Admin)) {
            repository.logs.insertLog({
                usecase: "AdminCreateUser",
                status: entities_1.Status.FAILED,
                errorCode: 199,
                description: constants_1.ROLE_USER_NOT_AUTHORIZED,
                timestamp: 123
            });
            return {
                code: 199,
                title: "UnAuthorized",
                description: constants_1.ROLE_USER_NOT_AUTHORIZED
            };
        }
        if (admin.isActive) {
            const createdUser = repository.db.createUser({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: ""
            });
            repository.logs.insertLog({
                usecase: "AdminCreateUser",
                status: entities_1.Status.SUCCESS,
                errorCode: 102,
                description: `User:${createdUser.email} Role: ${createdUser.role}created successfully`,
                timestamp: 123
            });
            repository.email.sendEmail(createdUser.email, {
                subject: constants_1.EMAIL_SUBJECT_ACCOUNT_CREATED,
                cc: [admin.email],
                message: `Dear ${createdUser.firstName.toUpperCase()}\n, Your account has been created successfully, click the link below to sign in`,
                signoff: "Admin"
            });
            return createdUser;
        }
        else {
            repository.logs.insertLog({
                usecase: "AdminCreateUser",
                status: entities_1.Status.FAILED,
                errorCode: 101,
                description: constants_1.ADMIN_SUBSCRIPTION_EXPIRED,
                timestamp: 123
            });
            return {
                code: 101,
                title: constants_1.ADMIN_SUBSCRIPTION_EXPIRED
            };
        }
    }
};
exports.AdminCreateUser = AdminCreateUser;
const AdminAssignUserRole = (adminId, userId, role, repository) => {
    /**
     * Assigns different roles to users
     * Its only an admin that can assign a role to a specific user
     * The user identitity should be existing
     * Only predefined roles are included
     * One User can have multiple roles
     */
    const admin = repository.db.getUserById(adminId);
    if (admin == undefined) {
        repository.logs.insertLog({
            usecase: "AdminAssignUserRole",
            status: entities_1.Status.FAILED,
            errorCode: 102,
            description: constants_1.ADMIN_NOT_FOUND,
            timestamp: 1232
        });
        return false;
    }
    else {
        if (!admin.role.includes(entities_1.Role.Admin)) {
            repository.logs.insertLog({
                usecase: "AdminAssignUserRole",
                status: entities_1.Status.FAILED,
                errorCode: 199,
                description: constants_1.ROLE_USER_NOT_AUTHORIZED,
                timestamp: 123
            });
            return false;
        }
        if (admin.isActive) {
            repository.logs.insertLog({
                usecase: "AdminAssignUserRole",
                status: entities_1.Status.FAILED,
                errorCode: 103,
                description: constants_1.ADMIN_SUBSCRIPTION_EXPIRED,
                timestamp: 123
            });
            return false;
        }
        else {
            const user = repository.db.getUserById(userId);
            if (user != undefined) {
                repository.db.assignRoleToUser(userId, role);
                repository.logs.insertLog({
                    usecase: "AdminAssignUserRole",
                    status: entities_1.Status.SUCCESS,
                    errorCode: 104,
                    description: constants_1.ADMIN_ROLE_ASSIGN_SUCCESS,
                    timestamp: 1324
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
                repository.logs.insertLog({
                    usecase: "AdminAssignUserRole",
                    status: entities_1.Status.FAILED,
                    errorCode: 105,
                    description: constants_1.USER_NOT_FOUND,
                    timestamp: 1234
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
};
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
