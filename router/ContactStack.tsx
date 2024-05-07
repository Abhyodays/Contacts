import { DrawerActions, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import UpdateContact, { UpdateContactProp } from "../screens/UpdateContact";
import CreateContact from "../screens/CreateContact";
import { IconButton } from "react-native-paper";
import ContactList from "../screens/ContactList";
import Search from "../screens/Search";

const Stack = createStackNavigator();
export const ContactStack = () => {
    const navigation = useNavigation();
    return (
        <Stack.Navigator>
            <Stack.Screen name='ContactList' component={ContactList} options={{
                title: 'Contact List', headerLeft: () => (
                    <IconButton
                        icon="menu"
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                        style={{ marginLeft: 10 }}
                    />)
            }} />
            <Stack.Screen name='CreateContact' component={CreateContact}
                options={{ title: 'Create Contact' }} />
            <Stack.Screen name='UpdateContact' component={UpdateContact} options={{ title: 'Update Contact' }} />
            <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}