import { Email } from "./drivers"
import { CCache, SiteDB } from "./repositories"

export enum Role {
    Admin="admin",
    Publisher="publisher",
    Sales="sales",
    SocialMediaManager="social_media_manager",
    Editor="editor",
    PageDesigner="page_designer",
    Illustrator="illustrator",
    StaffWriter="staff_writer",
    Columnist="columnist",
    Customer="customer"
    
}

export const Workflow:string[]= [
    "writing",
    "illustration",
    "columnary",
    "editorial",
    "sales",
    "pagedesign",
    "publishing",
    "social_media",
    "archiving",
    "deleted"
]

export enum SectionType {
    Headline,
    SubHeadline,
    ByLine,
    Dateline,
    Lead,
    Context,
    MainContent_SubHeading,
    MainContent_Paragraph,
    MainContent_Quotes,
    MainContent_Statistics,
    Call_To_Action,
    Author_Bio,
    Sources,
    Image,
    Video,
    File,
    

}

export enum Package{
    Gold,
    Silver,
    Bronze, 
    Custom,
    Staff
}
export interface User {
    id:string,
    firstName: string
    lastName: string
    email: string
    profileUrl: string
    role: Role[]
    package:Package
    isActive:boolean


}

export interface Note{
    user:User
    content: string
    taggedUsers: User[]
}

export interface Styling {
    font: string,
    fontColor: string,
    backgroundColor: string,
}

export interface Section {
    type: SectionType
    content: string
    order: number
    style?: Styling

}

export interface Commentary{
    id:string
    title:string 
    description:string
    link:string 
}

export interface Article {
    id: string
    users: string[]
    category:string[]
    state: number
    sections: Section[]
    createdAt: number
    lastUpdated:number
    notes?:Note[]
    commentaries?:Commentary[]
}

export interface CreateUserForm{
    firstName:string
    lastName?:string
    email:string
    password:string
}

export interface CError{
    code:number
    title:string
    description?:string 

}

export interface Repository{
    cache?: CCache
    db: SiteDB
    email:Email
}

export enum Status{
    SUCCESS="success",
    FAILED="failed"
}
export interface Log{
    usecase:string
    status:Status
    errorCode?:number
    description?:string 
    timestamp:number
}

export interface EmailBody{
    subject:string,
    cc?:string[]
    bcc?:string[]
    message:string
    signoff:string
}

