import { Toasts, toast } from "@backpackapp-io/react-native-toast";
import * as Location from "expo-location";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import { CustomMarker } from "../components/CustomMarker";

const MapScreen = () => {
    // Request for location service
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                toast("Location Permission Denied", {
                    duration: 3000,
                });
                return;
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                style={{
                    width: "100%",
                    height: "100%",
                }}
                // HKU coordinates
                initialRegion={{
                    latitude: 22.283138717812534,
                    longitude: 114.13652991004479,
                    latitudeDelta: 0.0005,
                    longitudeDelta: 0.0005,
                }}
                provider="google"
                pitchEnabled={false}
                loadingEnabled
                rotateEnabled={false}
                minZoomLevel={17}
                maxZoomLevel={18}
                showsUserLocation={true}
                showsBuildings={false}
                toolbarEnabled={false}
            >
                <CustomMarker
                    latitude={22.283416047623675}
                    longitude={114.13811859533348}
                    radius={30}
                    title="Joint Hall Mass Dance"
                    description="Hallmates are provided with the opportunity to show their efforts in the teamtrains and enjoy themselves throughout the whole process."
                />
                <CustomMarker
                    latitude={22.2827980530834}
                    longitude={114.13692501232464}
                    radius={10}
                    title="Engineering Society Welfare Booth"
                    description="Grab your welfare pack if you are from enginnering faculty!"
                />
            </MapView>
            <Toasts />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default MapScreen;
