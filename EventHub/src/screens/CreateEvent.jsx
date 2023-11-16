import React, {useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import Slider from "@react-native-community/slider";
import { addData } from "../firebase/database";

// updates needed: use map to select location, creator


const CreateEvent = ({navigation}) => {

    const [eventTitle, seteventTitle] = useState("");
    const [eventDescription, seteventDescription] = useState("");
    const [eventLocation, seteventLocation] = useState("");
    const [eventDate, seteventDate] = useState(new Date());
    const [eventStartTime, seteventStartTime] = useState(new Date());
    const [eventEndTime, seteventEndTime] = useState(new Date());
    const [course, setCourse] = useState("");
    const [numOfParticipants, setnumOfParticipants] = useState(0);
    const [eventCatagory, seteventCatagory] = useState([]);


    // for dropdown picker
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        {label: 'Sports', value: 'Sports'},
        {label: 'Study', value: 'Study'},
        {label: 'Arts', value: 'Arts'},
        {label: 'Social', value: 'Social'},
        {label: 'Leisure', value: 'Leisure'},
    ]);

    console.log(eventTitle, eventDescription, eventLocation, eventDate.toLocaleDateString(), 
    eventStartTime.toLocaleTimeString(), eventEndTime.toLocaleTimeString(), course, numOfParticipants, eventCatagory);

    return (
        <View style={styles.container}>

            <View style={{marginTop: 10}}>
                <View style={styles.rows}>
                    <Text style={styles.columnText}>Event Title</Text>
                    <TextInput
                        placeholder=" an interesting title"
                        style={styles.columnInput}
                        value={eventTitle}
                        onChangeText={text => seteventTitle(text)}
                    />
                </View>

                <View style={styles.rows}>
                    <Text style={styles.columnText}>Description</Text>
                    <TextInput
                        placeholder=" what is your event about?"
                        style={styles.columnInput}
                        value={eventDescription}
                        onChangeText={text => seteventDescription(text)}
                    />
                </View>

                <View style={styles.rows}>
                    <Text style={styles.columnText}>Location</Text>
                    <TextInput
                        placeholder=" where is your event?"
                        style={styles.columnInput}
                        value={eventLocation}
                        onChangeText={text => seteventLocation(text)}
                    />
                </View>

                <View style={styles.rows}>
                    <Text style={styles.columnText}>Date</Text>
                    <View style={styles.dateTime}>
                        <RNDateTimePicker 
                            value={eventDate} 
                            style={styles.dateTimeSelector}
                            onChange={(event, selectedDate) => {
                                seteventDate(selectedDate);
                            }}
                        />
                    </View>
                </View>

                <View style={styles.rows}>
                    <Text style={styles.columnText}>Start Time</Text>
                    <View style={styles.dateTime}>
                        <RNDateTimePicker 
                            value={eventStartTime} 
                            style={styles.dateTimeSelector}
                            mode="time"
                            onChange={(event, selectedTime) => {
                                seteventStartTime(selectedTime);
                            }}
                        />
                    </View>
                </View>

                <View style={styles.rows}>
                    <Text style={styles.columnText}>End Time</Text>
                    <View style={styles.dateTime}>
                        <RNDateTimePicker 
                            value={eventEndTime} 
                            style={styles.dateTimeSelector}
                            mode="time"
                            onChange={(event, selectedTime) => {
                                seteventEndTime(selectedTime);
                            }}
                        />
                    </View>
                </View>

                <View style={styles.rows}>
                    <Text style={styles.columnText}>Course Related</Text>
                    <TextInput
                        placeholder=" (optional)"
                        style={styles.columnInput}
                        value={course}
                        onChangeText={text => setCourse(text)}
                    />
                </View>

                <View style={styles.rows}>
                    <Text style={styles.columnText}>Number of Participants</Text>
                    <View style={styles.slider}>
                        <Text style={{bottom: -8}}>{numOfParticipants}</Text>
                        <Slider
                            style={{width: '100%', height: 10}}
                            minimumValue={0}
                            maximumValue={100}
                            minimumTrackTintColor="orange"
                            maximumTrackTintColor="lightgrey"
                            value={numOfParticipants}
                            onValueChange={value => setnumOfParticipants(value)}
                            step={1}
                        />
                    </View>
                </View>


                <View style={styles.rows}>
                    <Text style={styles.columnText}>Catagory</Text>
                    <View style={styles.dropDownContainer}>
                        <DropDownPicker
                                open={open}
                                value={eventCatagory}
                                items={items}
                                setOpen={setOpen}
                                setValue={seteventCatagory}
                                dropDownContainerStyle={{height: 105}}
                            />
                    </View>
                </View>

            </View>

            <TouchableOpacity style={styles.createEventButton}
                onPress={() => {
                    addData("Events", {
                        title: eventTitle,
                        description: eventDescription,
                        location: eventLocation,
                        date: eventDate.toLocaleDateString(),
                        startTime: eventStartTime.toLocaleTimeString(),
                        endTime: eventEndTime.toLocaleTimeString(),
                        course: course,
                        numOfParticipants: numOfParticipants,
                        catagory: eventCatagory,
                    });
                    navigation.navigate("List")}
                }
            >
                <Text style={{fontSize: 16}}>Save and Publish</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
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
    }
});

export default CreateEvent;