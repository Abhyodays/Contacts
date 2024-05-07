import { View, Text, SafeAreaView, StyleSheet, Pressable } from 'react-native'
import { Avatar, IconButton } from 'react-native-paper';
import { RootStackParamList } from '../types/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { useObject, useQuery, useRealm } from '@realm/react';
import { Person } from '../models/Person';
import { useEffect, useRef, useState } from 'react';
import ContactCard from '../components/ContactCard';
import { RowMap, SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { ListItem } from '../interfaces/ListItem';
import 'react-native-get-random-values'
import { BSON, Results } from 'realm';
import transformData from '../utilities/transformData';
import { FavoriteContact } from '../models/FavoriteContact';

interface ContactListProp {
    navigation: StackNavigationProp<RootStackParamList>
}
const ContactList = ({ navigation }: ContactListProp) => {
    const contacts = useQuery(Person)
    const [listData, setListData] = useState<ListItem[]>()
    const realm = useRealm();
    useEffect(() => {
        setListData(transformData(contacts))
    }, [contacts])
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <IconButton icon='account-search' onPress={() => {
                navigation.push("Search");
            }} />
        })
    })
    // conversion required to render swipelist 

    const goToUpdateScreen = (_id: BSON.ObjectId) => {
        const id = _id.toString();
        navigation.push('UpdateContact', { id });
    }
    // on clicking delete icon
    const removeItem = async (id: BSON.ObjectId) => {
        const contactToDelete = realm.objectForPrimaryKey(Person, id);
        if (contactToDelete) {
            try {
                realm.write(() => {
                    realm.delete(contactToDelete);
                })
            }
            catch (err) {
                console.error('Error in removing contact:', err);
            }
        }
        // removing contact from favorite list if it exits.
        const favoriteToDelete = realm.objectForPrimaryKey(FavoriteContact, id);
        if (favoriteToDelete) {
            try {
                realm.write(() => {
                    realm.delete(favoriteToDelete);
                })
            }
            catch (err) {
                console.error('Error in removing favorite contacts:', err);
            }
        }
        const changedContacts = await realm.objects(Person)
        setListData(transformData(changedContacts));
    }
    return (

        <SafeAreaView style={styles.container}>
            <SwipeListView data={listData}
                renderItem={({ item }, rowMap) => (
                    <Pressable onPress={() => {
                        rowMap[item.key].closeRow();
                        const id = item._id?.toString();
                        if (id) {
                            navigation.navigate('UpdateContact', { id });
                        }
                    }}>
                        <ContactCard {...item} />
                    </Pressable>
                )}
                renderHiddenItem={(data, rowMap) => {
                    return (
                        <View style={styles.hiddenItem}>
                            <IconButton icon='pencil' onPress={() => goToUpdateScreen(data.item._id!)} />
                            <IconButton icon='delete' iconColor='red' onPress={() => { removeItem(data.item._id!) }} />
                        </View>
                    )
                }}

                leftOpenValue={0}
                rightOpenValue={-75}
                disableRightSwipe={true}

            />
            {/* plus icon button to add contact */}
            <IconButton icon='plus' mode='contained'
                iconColor='#fff' containerColor='rebeccapurple' size={45}
                style={styles.addIcon}
                onPress={() => navigation.push('CreateContact')} />
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    addIcon: {
        position: 'absolute',
        right: 20,
        bottom: 30,
    },
    hiddenItem: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '100%',
    }
})
export default ContactList;