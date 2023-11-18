import React from "react";
import { StyleSheet, Text } from "react-native";

export const VerifyLabel = () => {
    return <Text style={styles.verifyLabel}>V</Text>;
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
