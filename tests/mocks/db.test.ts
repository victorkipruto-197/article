import {User,Role,Package, Article, SectionType} from "../../src/entities"
export const USERS:User[] = [
    {
        id:"1",
        firstName:"firstname 1",
        lastName:"lastname1",
        email:"firstemail@gmail.com",
        profileUrl:"profiles.blogs.quwemo.com",
        role:[
            Role.Admin,Role.Customer
        ],
        package:Package.Gold,
        isActive:true
    }
]

export const ARTICLES:Article[]=[
    {
        id:"1",
        users:["1"],
        category:["local news"],
        state:0,
        sections:[
            {type:SectionType.Headline, content:"Kenya's new startups", order:0},
            {type:SectionType.Context, content:"Exploring emerging startups in Kenya", order:1}
        ],
        createdAt:123,
        lastUpdated:1234,

    }
]