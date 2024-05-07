import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Contact } from '../interfaces/Contact';
import { Button, IconButton, TextInput } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/RootStackParamList';
import { useRealm } from '@realm/react';
import { generateId } from '../utilities/GenrateId';
import { Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import 'react-native-get-random-values';
import { BSON } from 'realm';
import { ScrollView } from 'react-native-gesture-handler';

interface CreateContactProps {
    navigation: StackNavigationProp<RootStackParamList>
}
const CreateContact = ({ navigation }: CreateContactProps) => {
    const regex = /^[0-9]*$/
    const realm = useRealm();
    const [values, setValues] = useState<Contact>({
        name: '',
        phone: '',
        landline: '',
        profile: ''
    })
    const [profileImage, setProfileImage] = useState<string | null>(null);

    // method to verify input values
    const isInvalidValues = (): boolean => {
        const { name, phone } = values;
        return name.length === 0 || phone.length === 0
    }
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <IconButton icon='close' onPress={() => navigation.goBack()} />,
            headerRight: () => <Button style={{ marginRight: 10 }} mode='contained' onPress={handleSave} disabled={isInvalidValues()}>Save</Button>
        })
    })

    // saving details in database.
    const handleSave = async () => {
        if (isInvalidValues()) return
        // console.log('saving:', values)
        const id = generateId();
        const profileUri = profileImage ? await storeProfileImage(profileImage, id) : null;

        try {
            realm.write(() => {
                realm.create('Person',
                    {
                        ...values,
                        _id: id,
                        profile: profileUri
                    })
            })
        }
        catch (error) {
            console.error("Error in saving data in db.:", error)
        }
        setValues({
            name: '',
            phone: '',
            landline: '',
        })
        setProfileImage(null);

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
            setProfileImage(result.assets[0].uri)
        }
    }

    // storing image in local files.
    const storeProfileImage = async (uri: string, contactId: BSON.ObjectId) => {
        try {
            const newUri = getLocalThumbnailPath(contactId);
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

    const getLocalThumbnailPath = (contactId: BSON.ObjectId) => {
        return `${FileSystem.documentDirectory}thumbnails/${contactId}-thumbnail.jpg`;
    }

    return (
        <ScrollView>
            <View style={styles.container}>

                {/* Container for profile image and controls */}
                <View style={styles.iconContainer}>
                    <Pressable onPress={handlePickImage}>
                        {profileImage != null ?
                            <Avatar.Image style={styles.profile} source={{ uri: profileImage }} size={100} />
                            :
                            <Avatar.Icon icon='image-plus' theme={{ colors: { primary: '#E5D4FF' } }} size={100} />
                        }
                    </Pressable>
                    {profileImage != null ?
                        <View style={styles.profileControl}>
                            <Button icon='pencil-outline' onPress={handlePickImage}>Change</Button>
                            <Button icon='delete-outline' onPress={() => setProfileImage(null)}>Remove</Button>
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
    }
})
export default CreateContact;