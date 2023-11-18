import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Callout, Circle, Marker } from "react-native-maps";
import { VerifyLabel } from "../components/VerifyLabel";

momentDurationFormatSetup(moment);

const EventStatus = {
    StartingSoon: 1,
    OnGoing: 2,
    Ended: 3,
};

function truncate(string, length) {
    if (string.length >= length) {
        return `${string.substring(0, length - 3)}...`;
    }
    return string;
}

function getStatus(date, startTime, endTime) {
    const start = moment(`${date} ${startTime}`, "DD/MM/YYYY HH:mm");
    const end = moment(`${date} ${endTime}`, "DD/MM/YYYY HH:mm");
    const current = moment();

    if (current.isSameOrAfter(start) && current.isBefore(end)) {
        return EventStatus.OnGoing;
    } else if (current.isBefore(start)) {
        return EventStatus.StartingSoon;
    } else {
        return EventStatus.Ended;
    }
}

function getTimeText(date, startTime, endTime) {
    const status = getStatus(date, startTime, endTime);
    const start = moment(`${date} ${startTime}`, "DD/MM/YYYY HH:mm");
    const end = moment(`${date} ${endTime}`, "DD/MM/YYYY HH:mm");
    const current = moment();

    switch (status) {
        case EventStatus.OnGoing:
            return `End in ${moment.duration(end.diff(current)).format()}`;
        case EventStatus.StartingSoon:
            return `Start in ${moment.duration(start.diff(current)).format()}`;
        case EventStatus.Ended:
            return `Ended ${moment.duration(current.diff(end)).format()} ago`;
        default:
            return "";
    }
}

function getColor(date, startTime, endTime) {
    const status = getStatus(date, startTime, endTime);

    switch (status) {
        case EventStatus.OnGoing:
            return "#248A3D";
        case EventStatus.StartingSoon:
            return "#FFB340";
        case EventStatus.Ended:
            return "#D70015";
        default:
            return "#FFFFFF";
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
    verified,
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
                    {verified && <VerifyLabel />}
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
        filter: "grayscale(100%)",
    },
});
