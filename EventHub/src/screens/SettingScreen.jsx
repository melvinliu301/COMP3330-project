import { useState, useEffect } from "react";
import { StyleSheet, View, Button, TouchableHighlight } from "react-native";
import { auth } from "../firebase/auth";
import {
    onAuthStateChanged,
    sendEmailVerification,
    signOut,
} from "firebase/auth";
import { ALLOWED_EMAILS } from "../common/constants";

const SettingScreen = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            console.log(user);
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
    }, []);

    const handleSignOut = async () => {
        await signOut(auth);
    };

    const handleVerifyEmail = async () => {
        await sendEmailVerification(user);
    };

    return (
        <View style={styles.container}>
            {user &&
                !user.emailVerified &&
                ALLOWED_EMAILS.includes(user.email || "") && (
                    <TouchableHighlight style={styles.touchableHighlight}>
                        <Button
                            title="Verify email"
                            mode="outlined"
                            style={styles.button}
                            onPress={handleVerifyEmail}
                        />
                    </TouchableHighlight>
                )}
            <TouchableHighlight style={styles.touchableHighlight}>
                <Button
                    title="Sign out"
                    mode="outlined"
                    style={styles.button}
                    onPress={handleSignOut}
                />
            </TouchableHighlight>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        justifyContent: "space-between",
    },
    button: {
        alignSelf: "stretch",
        borderRaius: 2,
    },
    touchableHighlight: {
        margin: 10,
    },
});

export default SettingScreen;
