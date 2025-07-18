import { EmailBody } from "./entities";

export interface Email{
    sendEmail(email:string, emailBody:EmailBody):Boolean
}