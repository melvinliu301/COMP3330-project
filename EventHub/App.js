import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useState, useEffect } from "react";
import BottomTabs from "./src/components/BottomTabs";
import LoginRegisterScreens from "./src/screens/LoginRegisterScreens";
import { NavigationContainer } from "@react-navigation/native";
import { auth } from "./src/firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs(); //Ignore all log notifications

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                {user ? <BottomTabs /> : <LoginRegisterScreens />}
            </NavigationContainer>
        </GestureHandlerRootView>
    );
};

export default App;
