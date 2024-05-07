import 'react-native-get-random-values'
import Realm, { BSON, ObjectSchema } from "realm";

export class Person extends Realm.Object<Person>{
    _id!: BSON.ObjectId;
    name!: string;
    phone!: string;
    landline?:string;
    profile?:string;

    static schema:ObjectSchema = {
        name: "Person",
        properties:{
            _id: 'objectId',
            name: {
                type: 'string',
                indexed: true
            },
            phone:{
                type:'string',
                indexed:true
            },
            landline:{
                type:'string',
                optional: true
            },
            profile:{
                type:'string',
                optional: true
            }
        },
        primaryKey:'_id'
    }
}