import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo } from '@expo/vector-icons'; 
import { SafeAreaView } from "react-native";
import MapScreen from "../screens/MapScreen";
import ListScreen from "../screens/ListScreen";

const Tab = createBottomTabNavigator();

const BottomTabs = () => {

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "orange"}}>
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: "white",
                    tabBarInactiveTintColor: "gray",
                    tabBarStyle: {
                        backgroundColor: "orange",
                        height:55,
                        paddingBottom: 2,
                        borderTopWidth: 0,
                    },
                    tabBarLabelStyle: {
                        fontSize: 13,
                        marginTop: 0
                    },
                    headerStyle: {
                        backgroundColor: "orange",
                        borderStyle: "solid",
                        shadowColor: "transparent",
                        height: 43.5,
                    },
                    headerTitleStyle: {
                        fontWeight: "bold",
                        fontSize: 20,
                        color: "white",
                    },
                    headerTintColor: "white",
                    // unmountOnBlur: true,
                }}
                initialRouteName="Event Map"
                headershadowVisible={false}
                sceneContainerStyle={{
                    backgroundColor: "white",
                }}
            >
                <Tab.Screen 
                    name="Event Map" 
                    options={{
                        tabBarIcon: ({focused}) => (
                            <Entypo name="map" size={28} color={focused ? "white" : "gray"} />
                        ),
                        // headerTitle: () => (
                        //     <Text style={{color: "white", fontSize: 20, fontWeight: "bold"}}>Custom title</Text>
                        // ),
                        // headerShown: true,
                    }}
                >
                    {() => <MapScreen/>}
                </Tab.Screen>

                <Tab.Screen 
                    name="Event List" 
                    options={{
                        tabBarIcon: ({focused}) => (
                            <Entypo name="list" size={36} color={focused ? "white" : "gray"} />
                        ),
                        // headerTitle: () => (
                        //     <Text style={{color: "white", fontSize: 20, fontWeight: "bold"}}>Custom title</Text>
                        // ),
                        headerShown: false,
                    }}
                >
                    {() => <ListScreen/>}
                </Tab.Screen>

            </Tab.Navigator>
        </SafeAreaView>
    )
}

export default BottomTabs;