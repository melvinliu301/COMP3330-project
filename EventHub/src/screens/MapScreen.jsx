import { Toasts, toast } from "@backpackapp-io/react-native-toast";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import MapView from "react-native-maps";
import { CustomMarker } from "../components/CustomMarker";
import { getData, getBinaryURL } from "../firebase/database";
import { FAB } from "react-native-elements";

const MapScreen = () => {
    const [events, setEvents] = useState([]);

    const fetchEvents = async () => {
        const data = await getData("Events");
        const events = data.map((docs) => docs.data());
        for (const event of events) {
            if (event?.imagePath) {
                event.imageURL = await getBinaryURL(event?.imagePath);
            }
        }
        setEvents(events);
    };

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
        fetchEvents();
    }, []);

    return (
        <View style={styles.container}>
            <FAB
                style={styles.fab}
                color="#FFA500"
                icon={{ name: "refresh", color: "#FFFFFF" }}
                onPress={() => fetchEvents()}
            ></FAB>
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
                showsIndoorLevelPicker={false}
                zoomControlEnabled={false}
            >
                {events.map((event, i) => (
                    <CustomMarker
                        key={i}
                        latitude={event?.latitude}
                        longitude={event?.longitude}
                        radius={event?.radius}
                        title={event?.title}
                        description={event?.description}
                        imageURL={event?.imageURL}
                        date={event?.date}
                        startTime={event?.startTime}
                        endTime={event?.endTime}
                        verified={event?.verified}
                    />
                ))}
            </MapView>
            <Toasts />
        </View>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        bottom: 10,
        left: 10,
        zIndex: 10000,
    },
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default MapScreen;
