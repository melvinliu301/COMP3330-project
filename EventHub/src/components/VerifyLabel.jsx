import React from "react";
import { StyleSheet, Text } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";

export const VerifyLabel = () => {
    // return <Text style={styles.verifyLabel}>V</Text>;
    return <IonIcons name="checkmark-circle" size={20} color="green" style={styles.verifyLabel}/>;
};

const styles = StyleSheet.create({
    verifyLabel: {
        position: "absolute",
        bottom: 0,
        borderRadius: 50,
        textAlign: "center",
        alignItems: "center",
        width: 20,
        height: 20,
        backgroundColor: "#FFA500",
    },
});
