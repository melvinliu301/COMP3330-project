import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import BottomTabs from "./src/components/BottomTabs";
import { NavigationContainer } from "@react-navigation/native";

const App = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                <BottomTabs />
            </NavigationContainer>
        </GestureHandlerRootView>
    );
};

export default App;
