import { createDrawerNavigator } from "@react-navigation/drawer";
import { ContactStack } from "./ContactStack";
import FavoriteContacts from "../screens/FavoriteContacts";

const Drawer = createDrawerNavigator();

export const ContactDrawer = () => {
    return (
        <Drawer.Navigator initialRouteName='ContactListStack'>
            <Drawer.Screen name='ContactListStack' component={ContactStack}
                options={{ headerShown: false, title: 'Contact List' }} />
            <Drawer.Screen name='FavoriteContacts' component={FavoriteContacts} options={{ title: 'Favorite Contacts' }} />
        </Drawer.Navigator>
    )
}