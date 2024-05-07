import { NavigationProp, RouteProp } from '@react-navigation/native';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { RootStackParamList } from '../types/RootStackParamList';
import 'react-native-get-random-values'
import { BSON } from 'realm';
import { useObject, useQuery, useRealm } from '@realm/react';
import { Person } from '../models/Person';
import { useEffect, useState } from 'react';
import { Contact } from '../interfaces/Contact';
import { Avatar, Button, Icon, IconButton, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker'
import { generateId } from '../utilities/GenrateId';
import * as FileSystem from 'expo-file-system'
import { FavoriteContact } from '../models/FavoriteContact';

export interface UpdateContactProp {
    navigation: NavigationProp<RootStackParamList, 'UpdateContact'>,
    route: RouteProp<RootStackParamList, 'UpdateContact'>
}
const UpdateContact = ({ route, navigation }: UpdateContactProp) => {
    const regex = /^[0-9]*$/
    const realm = useRealm()
    const { id } = route.params;
    const _id = new BSON.ObjectId(id);
    const contact = useObject(Person, _id);
    const [values, setValues] = useState<Contact>(contact!)
    const [isFavorite, setFavorite] = useState<boolean>();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <IconButton icon='close' onPress={() => navigation.goBack()} />,
            // headerRight: () => <Button style={{ marginRight: 10 }} mode='contained' onPress={handleSave} disabled={isInvalidValues()}>Save</Button>
            headerRight: () => {
                return (
                    <View style={styles.headerIconContainer}>
                        <IconButton icon={isFavorite ? 'heart' : 'heart-outline'} onPress={toggleFavorite} />
                        <IconButton icon='check' onPress={handleSave} disabled={isInvalidValues()} />
                    </View>
                )
            }
        })
    })
    useEffect(() => {
        if (contact) {
            setValues({
                name: contact.name,
                phone: contact.phone,
                _id: contact._id,
                profile: contact.profile,
                landline: contact.landline
            })
            const favorite = realm.objectForPrimaryKey(FavoriteContact, contact._id);
            setFavorite(!!favorite);
        }

    }, [])
    const isInvalidValues = (): boolean => {
        const { name, phone, _id } = values;
        return name.length === 0 || phone.length === 0
    }
    const toggleFavorite = () => {
        setFavorite(!isFavorite);
    }
    // saving details in database.
    const handleSave = async () => {
        if (isInvalidValues()) return
        // console.log('saving:', values)
        if (!values._id) return;
        const profileUri = values.profile ? await storeProfileImage(values.profile, values._id) : null;
        if (profileUri == null && contact?.profile) {
            removeImage(contact.profile);
        }
        if (contact) {
            try {
                realm.write(() => {
                    contact.name = values.name;
                    contact.phone = values.phone;
                    contact.landline = values.landline;
                    contact.profile = profileUri!;
                })
                // console.log('existing contact:', contact);

                if (isFavorite) {
                    // Add to favorite contacts
                    try {
                        realm.write(() => {
                            realm.create(FavoriteContact, {
                                _id: contact._id,
                                Contact: contact,
                            });
                        });
                    }
                    catch (error) {
                        console.error('Error in adding contact in Favorite:', error)
                    }
                }
                else {
                    try {
                        const favoriteContact = realm.objectForPrimaryKey(FavoriteContact, contact._id);
                        if (favoriteContact) {
                            realm.write(() => {
                                realm.delete(favoriteContact);
                            });
                        }
                    }
                    catch (error) {
                        console.error("Error in removing contact from Favorite:", error)
                    }
                }
            }
            catch (error) {
                console.error("Error in saving data in db.:", error)
            }
        }
        navigation.navigate('ContactList')

    }


    // to pick profile photo from gallery
    const handlePickImage = async () => {
        // request for camera permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission is required to access images.");
            return;
        }
        // accessing images from gallery
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: .7
        })
        // if image picked then set profile image.
        if (!result.canceled) {
            setValues({ ...values, profile: result.assets[0].uri })
        }
    }
    const removeImage = async (path: string) => {
        const fileInfo = await FileSystem.getInfoAsync(path);
        if (fileInfo.exists && !fileInfo.isDirectory) {
            FileSystem.deleteAsync(path);
        }
    }
    // storing image in local files.
    const storeProfileImage = async (uri: string, contactId: BSON.ObjectId) => {
        try {
            const newUri = getLocalThumbnailPath();
            const oldUri = contact?.profile;
            if (oldUri) {
                removeImage(oldUri);
            }
            await FileSystem.copyAsync({
                from: uri,
                to: newUri
            });
            return newUri;
        }
        catch (error) {
            console.error('Error storing file image:', error);
            return null;
        }
    }

    const getLocalThumbnailPath = () => {
        return `${FileSystem.documentDirectory}thumbnails/${generateId().toString()}.jpg`;
    }

    return (
        <ScrollView>
            <View style={styles.container}>

                {/* Container for profile image and controls */}
                <View style={styles.iconContainer}>
                    <Pressable onPress={handlePickImage}>
                        {values.profile ?
                            <Avatar.Image style={styles.profile} source={{ uri: values.profile }} size={100} />
                            :
                            <Avatar.Icon icon='image-plus' theme={{ colors: { primary: '#E5D4FF' } }} size={100} />
                        }
                    </Pressable>
                    {(values.profile) ?
                        <View style={styles.profileControl}>
                            <Button icon='pencil-outline' onPress={handlePickImage}>Change</Button>
                            <Button icon='delete-outline' onPress={() => setValues({ ...values, profile: '' })}>Remove</Button>
                        </View>
                        :
                        <View>
                            <Button onPress={handlePickImage}>Add picture</Button>
                        </View>}

                </View>

                {/* Other input fields */}
                <TextInput style={styles.input} label={"Name"} value={values.name} onChangeText={(text) => setValues({ ...values, name: text })} mode='outlined' />
                <TextInput style={styles.input} label={"Phone"} value={values.phone}
                    onChangeText={(text) => {
                        if (!regex.test(text)) return;
                        setValues({ ...values, phone: text })
                    }

                    } mode='outlined' keyboardType='phone-pad' />
                <TextInput style={styles.input} label={"Landline"} value={values.landline}
                    onChangeText={(text) => {
                        if (!regex.test(text)) return;
                        setValues({ ...values, landline: text })
                    }
                    } mode='outlined' keyboardType='phone-pad' />
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#fff'
    },
    input: {
        width: '95%'
    },
    iconContainer: {
        margin: 20,
        alignItems: 'center'
    },
    profile: {
        // height: 100,
    },
    profileControl: {
        flexDirection: 'row',
    },
    headerIconContainer: {
        flexDirection: 'row'
    }
})

export default UpdateContact;