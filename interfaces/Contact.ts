import { BSON } from "realm"

export interface Contact{
    _id?:BSON.ObjectId,
    name: string,
    phone: string,
    landline?:string,
    profile?:string
}