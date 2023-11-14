import React from "react";
import { Text } from "react-native";
import { Callout, Circle, Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";

function truncate(string) {
    if (string.length >= 100) {
        return `${string.substring(0, 97)}...`;
    }
    return string;
}

export const CustomMarker = ({ title, description, latitude, longitude, radius }) => {
    return (
        <>
            <Marker
                coordinate={{
                    latitude: latitude,
                    longitude: longitude,
                }}
            >
                <Callout tooltip>
                    <View>
                        <View style={styles.bubble}>
                            <Text style={styles.title}>{title}</Text>
                            <Text>{truncate(description)}</Text>
                        </View>
                    </View>
                </Callout>
            </Marker>
            <Circle
                center={{
                    latitude: latitude,
                    longitude: longitude,
                }}
                radius={radius}
            />
        </>
    );
};

const styles = StyleSheet.create({
    bubble: {
        flexDirection: "column",
        alignSelf: "flex-start",
        backgroundColor: "#fff",
        borderRadius: 6,
        borderColor: "#ccc",
        borderWidth: 0.5,
        padding: 15,
        width: 200,
    },
    title: {
        fontSize: 16,
        marginBottom: 5,
    },
});
