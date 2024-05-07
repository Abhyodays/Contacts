import { NavigationContainer } from "@react-navigation/native";
import { ContactDrawer } from "./ContactDrawer";

const Router = () => {
    return (
        <NavigationContainer>
            <ContactDrawer />
        </NavigationContainer>
    )
}

export default Router;