import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, StyleSheet, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types/RootStackParamList';
import { useEffect, useState } from 'react';
import { IconButton, Searchbar } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
import { ListItem } from '../interfaces/ListItem';
import 'react-native-get-random-values'
import { useQuery, useRealm } from '@realm/react';
import { Person } from '../models/Person';
import transformData from '../utilities/transformData';
import ContactCard from '../components/ContactCard';
import { BSON, Results } from 'realm';

interface SearchProps {
    navigation: StackNavigationProp<RootStackParamList, 'Search'>
}
const Search = ({ navigation }: SearchProps) => {
    const realm = useRealm();
    const [searchQuery, setSearchQuery] = useState('');
    const [listData, setListData] = useState<any>([])
    useEffect(() => {
        const contacts = searchQuery === ''
            ? realm.objects(Person).filtered(`_id = $0`, new BSON.ObjectId())
            : realm.objects(Person).filtered(`name CONTAINS[c] $0 OR phone CONTAINS[c] $0`, searchQuery);
        setListData(contacts);
    }, [searchQuery])
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchBar}>
                <IconButton icon='keyboard-backspace' onPress={() => navigation.goBack()} />
                <TextInput style={styles.searchBar} placeholder='Search contacts' value={searchQuery} onChangeText={setSearchQuery} />
            </View>
            <FlatList
                data={listData}
                renderItem={({ item }) => {
                    return <ContactCard {...item} />
                }}
            />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        minHeight: '100%'
    },
    searchBar: {
        flexDirection: 'row',
        borderBottomWidth: .5,
        borderBottomColor: 'grey',

    }
})
export default Search;