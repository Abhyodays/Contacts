import { useQuery, useRealm } from '@realm/react';
import { View, Text } from 'react-native';
import { FavoriteContact } from '../models/FavoriteContact';
import { Button } from 'react-native-paper';
import 'react-native-get-random-values'
import { FlatList } from 'react-native-gesture-handler';
import ContactCard from '../components/ContactCard';

const FavoriteContacts = () => {
    const realm = useRealm();
    const favoriteContacts = useQuery(FavoriteContact).sorted('Contact.name', false);
    // const removeAll = () => {
    //     const favorites = realm.objects(FavoriteContact);
    //     favorites.map((favorite) => {
    //         realm.write(() => {
    //             realm.delete(favorite)
    //         })
    //     })
    // }
    return (
        <FlatList style={{ backgroundColor: '#fff' }}
            data={favoriteContacts}
            renderItem={({ item }) => {
                return <ContactCard {...item.Contact} />
            }} />
    )
}

export default FavoriteContacts;