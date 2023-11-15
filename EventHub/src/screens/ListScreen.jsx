import { useState, useEffect, Fragment } from "react";
import { View, Text, StyleSheet } from "react-native";
import { addData, getData } from "../firebase/database";

const ListScreen = () => {
    // remove later, for testing only
    const [data, setData] = useState([]);

    useEffect(() => {
        getData("test").then((data) => {
            setData(data);
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text>the screen for lists</Text>
            
            {/* remove later, for testing only */}
            <Text>Test result (reading from database):</Text>
            {data.map((item) => (
                <Fragment key={item.id}>
                    <Text>{"1: " + item.data().test1}</Text>
                    <Text>{"2: " + item.data().test2}</Text>
                    <Text>{"3: " + item.data().test3}</Text>
                    <Text>{"4: " + item.data().test4}</Text>
                </Fragment>
            ))}
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

export default ListScreen;
