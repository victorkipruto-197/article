import { Email } from "./drivers";
import { CCache, LogsDB, SiteDB } from "./repositories";
export declare enum Role {
    Admin = "admin",
    Publisher = "publisher",
    Sales = "sales",
    SocialMediaManager = "social_media_manager",
    Editor = "editor",
    PageDesigner = "page_designer",
    Illustrator = "illustrator",
    StaffWriter = "staff_writer",
    Columnist = "columnist",
    Customer = "customer"
}
export declare const Workflow: string[];
export declare enum SectionType {
    Headline = 0,
    SubHeadline = 1,
    ByLine = 2,
    Dateline = 3,
    Lead = 4,
    Context = 5,
    MainContent_SubHeading = 6,
    MainContent_Paragraph = 7,
    MainContent_Quotes = 8,
    MainContent_Statistics = 9,
    Call_To_Action = 10,
    Author_Bio = 11,
    Sources = 12,
    Image = 13,
    Video = 14,
    File = 15
}
export declare enum Package {
    Gold = 0,
    Silver = 1,
    Bronze = 2,
    Custom = 3,
    Staff = 4
}
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileUrl: string;
    role: Role[];
    package: Package;
    isActive: boolean;
}
export interface Note {
    user: User;
    content: string;
    taggedUsers: User[];
}
export interface Styling {
    font: string;
    fontColor: string;
    backgroundColor: string;
}
export interface Section {
    type: SectionType;
    content: string;
    order: number;
    style?: Styling;
}
export interface Commentary {
    id: string;
    title: string;
    description: string;
    link: string;
}
export interface Article {
    id: string;
    users: string[];
    category: string[];
    state: number;
    sections: Section[];
    createdAt: number;
    lastUpdated: number;
    notes?: Note[];
    commentaries?: Commentary[];
}
export interface CreateUserForm {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
}
export interface CError {
    code: number;
    title: string;
    description?: string;
}
export interface Repository {
    cache?: CCache;
    db: SiteDB;
    logs: LogsDB;
    email: Email;
}
export declare enum Status {
    SUCCESS = "success",
    FAILED = "failed"
}
export interface Log {
    usecase: string;
    status: Status;
    errorCode?: number;
    description?: string;
    timestamp: number;
}
export interface EmailBody {
    subject: string;
    cc?: string[];
    bcc?: string[];
    message: string;
    signoff: string;
}
