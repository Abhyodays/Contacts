import 'react-native-get-random-values';
import { BSON } from "realm";

export const generateId = ()=>{
    return new BSON.ObjectID();
}