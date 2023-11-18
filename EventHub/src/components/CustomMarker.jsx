import React from "react";
import { Text, Image } from "react-native";
import { Callout, Circle, Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

momentDurationFormatSetup(moment);

function truncate(string, length) {
    if (string.length >= length) {
        return `${string.substring(0, length - 3)}...`;
    }
    return string;
}

function getTimeText(date, startTime, endTime) {
    const start = moment(`${date} ${startTime}`, "DD/MM/YYYY HH:mm");
    const end = moment(`${date} ${endTime}`, "DD/MM/YYYY HH:mm");
    const current = moment();

    if (current.isSameOrAfter(start) && current.isBefore(end)) {
        return `End in ${moment.duration(end.diff(current)).format()}`;
    } else if (current.isBefore(start)) {
        return `Start in ${moment.duration(start.diff(current)).format()}`;
    } else {
        return `Ended ${moment.duration(current.diff(end)).format()} ago`;
    }
}

function getColor(date, startTime, endTime) {
    const start = moment(`${date} ${startTime}`, "DD/MM/YYYY HH:mm");
    const end = moment(`${date} ${endTime}`, "DD/MM/YYYY HH:mm");
    const current = moment();

    if (current.isSameOrAfter(start) && current.isBefore(end)) {
        // Return green if the event is currently hosting
        return "#248A3D";
    } else if (current.isBefore(start)) {
        // Return yellow if the event is going to host
        return "#FFB340";
    } else {
        // Return red if the event ended
        return "#D70015";
    }
}

export const CustomMarker = ({
    title,
    description,
    latitude,
    longitude,
    radius,
    imageURL,
    date,
    startTime,
    endTime,
}) => {
    return (
        latitude &&
        longitude && (
            <>
                <Marker
                    coordinate={{
                        latitude: latitude,
                        longitude: longitude,
                    }}
                    // If not do so the circle will not be in the center
                    anchor={imageURL && { x: 0.5, y: 0.5 }}
                    calloutAnchor={imageURL && { x: 0.5, y: 0 }}
                >
                    {imageURL && (
                        <Image
                            source={{ uri: imageURL }}
                            style={{
                                ...styles.markerImage,
                                borderColor: getColor(date, startTime, endTime),
                            }}
                        />
                    )}
                    <Callout tooltip>
                        <View>
                            <View style={styles.bubble}>
                                <Text style={styles.title}>{truncate(title, 40)}</Text>
                                <Text
                                    style={{
                                        ...styles.time,
                                        color: getColor(date, startTime, endTime),
                                    }}
                                >
                                    {getTimeText(date, startTime, endTime)}
                                </Text>
                                <Text style={styles.description}>
                                    {truncate(description, 100)}
                                </Text>
                            </View>
                        </View>
                    </Callout>
                </Marker>
                <Circle
                    center={{
                        latitude: latitude,
                        longitude: longitude,
                    }}
                    radius={imageURL ? radius + 25 : radius}
                />
            </>
        )
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
        fontSize: 18,
        marginBottom: 5,
        fontWeight: "600",
    },
    time: {},
    description: {
        fontSize: 12,
        marginBottom: 5,
    },
    markerImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
        borderWidth: 2,
    },
});
