import { Toasts, toast } from "@backpackapp-io/react-native-toast";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import MapView from "react-native-maps";
import { CustomMarker } from "../components/CustomMarker";
import { getData, getBinaryURL } from "../firebase/database";

const MapScreen = () => {
    const [events, setEvents] = useState([]);

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
        (async () => {
            const data = await getData("Events");
            const events = data.map((docs) => docs.data());
            for (const event of events) {
                if (event?.imagePath) {
                    event.imageURL = await getBinaryURL(event?.imagePath);
                }
            }
            setEvents(events);
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
                zoomControlEnabled={false}
            >
                {events.map((event, i) => (
                    <CustomMarker
                        key={i}
                        latitude={event?.latitude || 0}
                        longitude={event?.longitude || 0}
                        radius={event?.radius}
                        title={event?.title}
                        description={event?.description}
                        imageURL={event?.imageURL}
                        date={event?.date}
                        startTime={event?.startTime}
                        endTime={event?.endTime}
                    />
                ))}
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
