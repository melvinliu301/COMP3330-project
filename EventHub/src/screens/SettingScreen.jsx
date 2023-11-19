import { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Button,
    TouchableHighlight,
    Pressable,
    Text,
    FlatList,
} from "react-native";
import { auth } from "../firebase/auth";
import { sendEmailVerification, signOut } from "firebase/auth";
import { ALLOWED_EMAILS } from "../common/constants";
import Dialog, { DialogContent } from "react-native-popup-dialog";
import {getData, getDataById} from '../firebase/database';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { categoryColor } from "../common/constants";

export const getUserName = () => {
    return auth.currentUser.displayName;
};

export const getUserVerified = () => {
    return auth.currentUser.emailVerified;
};

export const getUserID = () => {
    return auth.currentUser.uid;
};

const SettingScreen = () => {
    const [user, setUser] = useState(auth.currentUser);
    const [myEventVisible, setmyEventVisible] = useState(false);
    const [myEventsID, setmyEventsID] = useState([]);
    const [myEvents, setmyEvents] = useState([]);

    useEffect(() => {
        getDataById("Users", user.uid).then((data) => {
            setmyEventsID(data.events);
        });
    }, [user]);

    useEffect(() => {
        const tempArray = [];
        for (let i = 0; i < myEventsID.length; i++) {
            getDataById("Events", myEventsID[i]).then((data) => {
                tempArray.push(data);
            });
        }
        setmyEvents(tempArray);
        console.log(tempArray);
    }, [myEventsID]);

    const handleSignOut = async () => {
        await signOut(auth);
    };

    const handleReloadUserProfile = () => {
        auth.currentUser.reload().then(() => {
            // https://stackoverflow.com/questions/56266575/why-is-usestate-not-triggering-re-render
            setUser({...auth.currentUser});
        });
    };

    const handleVerifyEmail = async () => {
        await sendEmailVerification(user);
    };

    const editProfile = () => {
        console.log("edit profile");
    };

    return (
        <View style={styles.container}>
            <Dialog
                visible={myEventVisible}
                onTouchOutside={() => {
                    setmyEventVisible(false);
                }}
                height={0.7} // = 70%
            >
                <DialogContent>
                    <View style={styles.dialogView}>
                        {myEvents.length > 0 ? (
                            <FlatList
                                data={myEvents}
                                style={{ flex: 1 }}
                                renderItem={({ item }) => (
                                    <View style={{borderWidth: 1, borderColor: "gray", borderRadius: 10, margin: 10, padding:10}}>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>{item.title}</Text>
                                            {item.verified && <Ionicons name="checkmark-circle-outline" size={30} color='green' />}
                                        </View>
                                        <View style={styles.smallerContainer}>
                                            <View style={{flexDirection: 'row'}}>
                                                <MaterialIcons name="connect-without-contact" size={16} />
                                                <Text style={styles.infoText}> {item.host}</Text>
                                            </View>
                                            <View style={{flexDirection: 'row'}}>
                                                <Ionicons name="calendar" size={16} />
                                                <Text style={styles.infoText}> {item.date}</Text>
                                            </View>
                                            <View style={{flexDirection: 'row'}}>
                                                <Ionicons name="time-outline" size={16} />
                                                <Text style={styles.infoText}> {item.startTime}-{item.endTime}</Text>
                                            </View>
                                            
                                            <View style={{flexDirection: 'row'}}>
                                                <Ionicons name="location" size={16} />
                                                <Text style={styles.infoText}> {item.location}</Text>
                                            </View>
                                            
                                            <View style={{flexDirection: 'row'}}>
                                                <Ionicons name="people" size={16} />
                                                <Text style={styles.infoText}> {item.numOfParticipants?item.numOfParticipants:0}/{item.maxParticipants}</Text>
                                            </View>
                                            <View style={{flexDirection: 'row'}}>
                                                <View style={{backgroundColor: categoryColor[item.category], borderRadius: 5, alignSelf: 'baseline', padding:5}}>
                                                    <Text style={styles.infoText}> {item.category}</Text>
                                                </View>
                                                    {(item.course!=='') && <Text style={styles.infoText}>{item.course}</Text>}
                                            </View>

                                        </View>
                                        
                                        <Text style={{borderBottomColor:'gray',borderBottomWidth:1, fontSize:16}}>
                                            Description:{'\n'}{item.description}{'\n'} 
                                        </Text>
                                        
                                    </View>
                                )}
                                keyExtractor={(item) => item.id}
                            />
                        ) : (
                            <Text>
                                You are not holding an event. Go and organize one!
                            </Text>
                        )}
                    </View>
                </DialogContent>
            </Dialog>

            {/*my profile*/}
            <View style={styles.myProfileView}>
                <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: 24, fontWeight: "bold", flex: 3 }}>
                        My profile
                    </Text>
                    <Pressable
                        style={styles.editProfileButton}
                        onPress={editProfile}
                    >
                        <Text style={styles.editProfileButtonText}>Edit</Text>
                    </Pressable>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ margin: 10, flex: 1 }}>
                        <Text>any profile pic</Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        {user.displayName ? (
                            <Text style={styles.text}>{user.displayName}</Text>
                        ) : (
                            <Text style={[styles.text, { fontStyle: "italic" }]}>
                                Go give yourself a name!
                            </Text>
                        )}
                        <Text style={styles.text}>{user.email}</Text>
                        {user.emailVerified && (
                            <Text style={{ ...styles.text, color: "green" }}>
                                Verified
                            </Text>
                        )}
                    </View>

                </View>
            </View>

            {/*view my events*/}
            <View>
                <Pressable
                    style={styles.viewMyEventButton}
                    onPress={() => setmyEventVisible(true)}
                >
                    <Text style={styles.viewMyEventButtonText}>
                        View My Events
                    </Text>
                </Pressable>
            </View>

            {/*reload user profile*/}
            <TouchableHighlight style={styles.touchableHighlight}>
                <Button
                    title="Reload user profile"
                    mode="outlined"
                    style={styles.button}
                    onPress={handleReloadUserProfile}
                />
            </TouchableHighlight>

            {/*verify email*/}
            {!user.emailVerified &&
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

            {/*sign out*/}
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
    smallerContainer: {
        margin: 10,
        paddingVertical: 10,
    },
    dialogContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        margin: 10,
        borderWidth: 1,
        borderColor: "red",
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
        padding: 10,
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
    dialogView: {
        // margin: 10,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        alignSelf: "center",
    },
    editProfileButton: {
        alignItems: "center",
        padding: 5,
        flex: 1,
        alignSelf: "center",
        borderRadius: 10,
        backgroundColor: "orange",
    },
    editProfileButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
    },
});

export default SettingScreen;
