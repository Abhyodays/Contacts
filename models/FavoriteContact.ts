import { Person } from './Person'
import 'react-native-get-random-values';
import Realm,{BSON, ObjectSchema} from 'realm'

export class FavoriteContact extends Realm.Object<FavoriteContact>{
    _id!:BSON.ObjectId
    Contact !: Person
    
    static schema:ObjectSchema = {
        name:"FavoriteContact",
        properties:{
            _id: 'objectId',
            Contact: 'Person'
        },
        primaryKey: '_id'
    }
}