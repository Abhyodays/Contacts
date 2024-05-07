import { BSON } from "realm"

export type RootStackParamList={
    ContactList:undefined,
    CreateContact:undefined,
    FavoriteContact:undefined,
    UpdateContact: {id:string},
    Search:undefined
}