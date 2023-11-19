import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Button,
    Platform,
} from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import Slider from "@react-native-community/slider";
import { getData } from "../firebase/database";
import moment from "moment";
import { getUserName, getUserVerified, getUserID } from "./SettingScreen";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

// updates needed: use map to select location, creator

const CreateEvent = ({ navigation }) => {
    const [eventTitle, seteventTitle] = useState("");
    const [eventDescription, seteventDescription] = useState("");
    const [eventLocation, seteventLocation] = useState("");
    const [eventDate, seteventDate] = useState(new Date());
    const [eventStartTime, seteventStartTime] = useState(new Date());
    const [eventEndTime, seteventEndTime] = useState(new Date());
    const [course, setCourse] = useState("");
    const [maxParticipants, setmaxParticipants] = useState(2); // default value is 2
    const [eventCategory, seteventCategory] = useState("General");
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS === "ios");
    const [showStartTimePicker, setShowStartTimePicker] = useState(Platform.OS === "ios");
    const [showEndTimePicker, setShowEndTimePicker] = useState(Platform.OS === "ios");

    const userHasProfilePic = async () => {
        const userID = getUserID();
        const profilePic = await getData("users", userID, "profilePic");
        return profilePic;
    };

    // for dropdown picker
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: "Sports", value: "Sports" },
        { label: "Study", value: "Study" },
        { label: "Arts", value: "Arts" },
        { label: "Social", value: "Social" },
        { label: "Leisure", value: "Leisure" },
    ]);

    console.log(
        eventTitle,
        eventDescription,
        eventLocation,
        eventDate.toLocaleDateString(),
        moment(eventStartTime).format("HH:mm"),
        moment(eventEndTime).format("HH:mm"),
        course,
        maxParticipants,
        eventCategory
    );

    return (
        <View style={styles.container}>
            <View style={{ marginTop: 10 }}>
                <View style={styles.rows}>
                    <Text style={styles.columnText}>Event Title</Text>
                    <TextInput
                        placeholder=" an interesting title"
                        style={styles.columnInput}
                        // value={eventTitle}
                        onChangeText={(text) => seteventTitle(text)}
                    />
                </View>

                <View style={styles.rows}>
                    <Text style={styles.columnText}>Description</Text>
                    <TextInput
                        placeholder=" what is your event about?"
                        style={styles.columnInput}
                        // value={eventDescription}
                        onChangeText={(text) => seteventDescription(text)}
                    />
                </View>

                <View style={styles.rows}>
                    <Text style={styles.columnText}>Location</Text>
                    <TextInput
                        placeholder=" where is your event?"
                        style={styles.columnInput}
                        // value={eventLocation}
                        onChangeText={(text) => seteventLocation(text)}
                    />
                </View>

                <View style={styles.rows}>
                    <Text style={styles.columnText}>Date</Text>
                    <View style={styles.dateTime}>
                        {Platform.OS !== "ios" && (
                            <Button
                                title={moment(eventDate).format("DD/MM/YYYY")}
                                onPress={() => setShowDatePicker(true)}
                            />
                        )}
                        {showDatePicker && (
                            <RNDateTimePicker
                                value={eventDate}
                                style={styles.dateTimeSelector}
                                onChange={(event, selectedDate) => {
                                    seteventDate(selectedDate);
                                    setShowDatePicker(Platform.OS === "ios");
                                }}
                            />
                        )}
                    </View>
                </View>

                <View style={styles.rows}>
                    <Text style={styles.columnText}>Start Time</Text>
                    <View style={styles.dateTime}>
                        {Platform.OS !== "ios" && (
                            <Button
                                title={moment(eventStartTime).format("HH:mm")}
                                onPress={() => setShowStartTimePicker(true)}
                            />
                        )}
                        {showStartTimePicker && (
                            <RNDateTimePicker
                                value={eventStartTime}
                                style={styles.dateTimeSelector}
                                mode="time"
                                onChange={(event, selectedTime) => {
                                    seteventStartTime(selectedTime);
                                    setShowStartTimePicker(Platform.OS === "ios");
                                }}
                            />
                        )}
                    </View>
                </View>

                <View style={styles.rows}>
                    <Text style={styles.columnText}>End Time</Text>
                    <View style={styles.dateTime}>
                        {Platform.OS !== "ios" && (
                            <Button
                                title={moment(eventEndTime).format("HH:mm")}
                                onPress={() => setShowEndTimePicker(true)}
                            />
                        )}
                        {showEndTimePicker && (
                            <RNDateTimePicker
                                value={eventEndTime}
                                style={styles.dateTimeSelector}
                                mode="time"
                                onChange={(event, selectedTime) => {
                                    seteventEndTime(selectedTime);
                                    setShowEndTimePicker(Platform.OS === "ios");
                                }}
                            />
                        )}
                    </View>
                </View>

                <View style={styles.rows}>
                    <Text style={styles.columnText}>Course Related</Text>
                    <TextInput
                        placeholder=" (optional)"
                        style={styles.columnInput}
                        // value={course}
                        onChangeText={(text) => setCourse(text)}
                    />
                </View>

                <View style={styles.rows}>
                    <Text style={styles.columnText}>Number of Participants</Text>
                    <View style={styles.slider}>
                        <Text style={{ bottom: -8 }}>{maxParticipants}</Text>
                        <Slider
                            style={{ width: "100%", height: 10 }}
                            minimumValue={2}
                            maximumValue={100}
                            minimumTrackTintColor="orange"
                            maximumTrackTintColor="lightgrey"
                            value={maxParticipants}
                            onValueChange={(value) => setmaxParticipants(value)}
                            step={1}
                        />
                    </View>
                </View>

                <View style={styles.rows}>
                    <Text style={styles.columnText}>Category</Text>
                    <View style={styles.dropDownContainer}>
                        <DropDownPicker
                            open={open}
                            value={eventCategory}
                            items={items}
                            setOpen={setOpen}
                            setValue={seteventCategory}
                            dropDownContainerStyle={{ height: 105 }}
                        />
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={styles.createEventButton}
                onPress={() => {
                    const event = {
                        title: eventTitle,
                        description: eventDescription,
                        location: eventLocation,
                        date: moment(eventDate).format("DD/MM/YYYY"),
                        startTime: moment(eventStartTime).format("HH:mm"),
                        endTime: moment(eventEndTime).format("HH:mm"),
                        course: course,
                        numOfParticipants: 1,
                        maxParticipants: maxParticipants,
                        category: eventCategory,
                        host: getUserName(),
                        verified: getUserVerified(),
                        radius: 10, // default radius is 10
                        latitude: 22.284023, // default latitude: HKU Main Building
                        longitude: 114.137753, // default longitude: HKU Main Building
                        imagePath: userHasProfilePic() ? 
                            ("profilePic/" + getUserID()) :
                            "User-Icon-Grey-300x300.png",
                        
                    };
                    navigation.navigate("CreateEventLocation", { event: event });
                }}
            >
                <Text style={{ fontSize: 16 }}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "white",
    },
    columnText: {
        flex: 1,
        minWidth: 20,
        fontSize: 16,
        fontWeight: "bold",
        marginHorizontal: 10,
        // borderColor: "green",
        // borderWidth: 1,
    },
    columnInput: {
        flex: 3,
        marginHorizontal: 10,
        borderBottomWidth: 1,
        // borderColor: "green",
        // borderWidth: 1,
    },
    createEventButton: {
        alignItems: "center",
        backgroundColor: "lightgreen",
        paddingVertical: 10,
        width: "100%",
    },
    rows: {
        flexDirection: "row",
        paddingHorizontal: 10,
        width: "100%",
        alignItems: "center",
        height: 40,
        marginVertical: 8,
    },
    dateTime: {
        flex: 3,
        marginHorizontal: 10,
        alignItems: "flex-start",
    },
    dateTimeSelector: {
        left: -10,
        zIndex: 0,
    },
    dropDownContainer: {
        flex: 3,
        marginHorizontal: 10,
        alignItems: "flex-start",
    },
    slider: {
        flex: 3,
        flexDirection: "column",
        marginHorizontal: 10,
        alignItems: "center",
    },
});

export default CreateEvent;
