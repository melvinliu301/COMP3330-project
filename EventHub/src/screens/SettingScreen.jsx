import { useState, useEffect } from "react";
import { StyleSheet, View, Button, TouchableHighlight, Pressable, Modal, Text, FlatList } from "react-native";
import { auth } from "../firebase/auth";
import {
    onAuthStateChanged,
    sendEmailVerification,
    signOut,
} from "firebase/auth";
import { ALLOWED_EMAILS } from "../common/constants";

const SettingScreen = () => {
    const [user, setUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

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
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}>
                    <View style={styles.modalView}>
                        <View style={styles.infoView}>
                            <View>
                                <Text>You are not holding an event. Go and organize one!</Text>
                            </View>
                            
                            <Pressable
                                style={[styles.closebutton]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                {modalVisible && <Text>Close</Text>}
                            </Pressable>
                        </View>
                    </View>
            </Modal>

            {/*my profile*/}
            <View style={styles.myProfileView}>
                <Text style={{fontSize:24, fontWeight: "bold"}}>My profile</Text>
                <View style={{ flexDirection: "row" }}>
                    <View style={{margin:10}}>
                        <Text>any profile pic</Text>
                    </View>
                    <View>
                        <Text style={styles.text}>any username</Text>
                        <Text style={styles.text}>any email</Text>
                    </View>
                </View>
            </View>
            <View>
                <Pressable style={styles.viewMyEventButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.viewMyEventButtonText}>View My Events</Text>
                </Pressable>
            </View>
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
    text: {
        fontSize: 16,
        padding: 10,
    },
    touchableHighlight: {
        margin: 10,
    },
    myProfileView: {
        borderWidth: 3,
        borderColor: "gray",
        borderRadius: 10,
        padding:10,
        margin: 10,
    },
    viewMyEventButton: {
        alignItems: "center",
        paddingVertical: 10,
    },
    viewMyEventButtonText: {
        fontSize: 24,
        textDecorationLine: "underline",
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        transparent: true,
        backgroundColor: "rgba(0,0,0,0.5)",
      },
      infoView: {
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: "orange",
        backgroundColor: "white",
        margin: 20,
        padding: 35,
        alignItems: 'center',
        // shadowColor: '#000',
        // shadowOffset: {
        //   width: 0,
        //   height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 5,
      },
      closebutton: {
        backgroundColor: "orange",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
});

export default SettingScreen;
