import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ListScreen = () => {
    return (
        <View style={styles.container}>
            <Text>the screen for lists</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default ListScreen;