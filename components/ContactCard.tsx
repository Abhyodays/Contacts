import { Contact } from '../interfaces/Contact'
import { View, Text, StyleSheet, Pressable } from "react-native"
import { Avatar } from "react-native-paper"

const ContactCard = (contact: Contact) => {
    const { name, profile, phone, _id } = contact
    return (
        <View style={styles.container}>
            {profile ?
                <Avatar.Image source={{ uri: profile }} size={50} /> :
                <Avatar.Icon icon='account' size={50} />}
            <View>
                <Text style={styles.primary}>{name}</Text>
                <Text style={styles.secondary}>{phone}</Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        margin: 12,
        paddingLeft: 10,
        backgroundColor: '#fff'
    },
    primary: {
        fontWeight: '600'
    },
    secondary: {
        color: '#B4B4B8',
        fontSize: 12
    }
})
export default ContactCard