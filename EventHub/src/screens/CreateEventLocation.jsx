import React, {useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { addData } from "../firebase/database";
import { useRoute } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import * as ImagePicker from 'expo-image-picker';


const CreateEventLocation = ({navigation}) => {


    const [eventLocation, seteventLocation] = useState(null);
    const [radius, setRadius] = useState(1);  // default value is 1
    const [image, setImage] = useState(null);

    const openImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
      
        //   console.log(result);
      
          if (!result.canceled) {
            setImage(result.assets[0].uri);
            // firebase.storage().ref().child("images/" + result.assets[0].uri).put(result.assets[0]);
          }
    }

    const route = useRoute();
    const event = route.params.event;
    let updatedEvent = event;

    eventLocation? 
    updatedEvent = {...event, latitude: eventLocation.latitude, longitude: eventLocation.longitude}
    : null;

    updatedEvent = {...updatedEvent, radius: radius};

    console.log(updatedEvent);

    return (
        <View style={styles.container}>
            <View style={[styles.rows, {marginTop: 20}]}>
                <Text style={styles.columnText}>Event Area (metres)</Text>
                <View style={styles.slider}>
                    <Text style={{bottom: -8}}>{radius}</Text>
                    <Slider
                        style={{width: '100%', height: 10}}
                        minimumValue={1}
                        maximumValue={30}
                        minimumTrackTintColor="orange"
                        maximumTrackTintColor="lightgrey"
                        value={radius}
                        onValueChange={value => setRadius(value)}
                        step={1}
                    />
                </View>
            </View>


            <View style={styles.rows}>
                <Text style={styles.columnText}>Event Photo</Text>
                <View style={styles.columnInput}>
                    {
                        image === null ?
                        <TouchableOpacity onPress={openImagePicker}>   
                            <Text style={{fontSize: 16, color: "blue"}}>Upload</Text>
                        </TouchableOpacity>
                        :
                        <Text>{image}</Text>
                    }
                </View>
            </View>

            
            <Text style={{fontSize: 16, fontWeight: "bold"}}>Select Event Location</Text>
            <MapView
                style={{
                    width: "90%",
                    height: "70%",
                    borderColor: "lightgrey",
                    borderWidth: 2,
                }}
                // HKU coordinates
                initialRegion={{
                    latitude: 22.283138717812534,
                    longitude: 114.13652991004479,
                    latitudeDelta: 0.0005,
                    longitudeDelta: 0.0005,
                }}
                provider="google"
                pitchEnabled={false}
                loadingEnabled
                rotateEnabled={false}
                minZoomLevel={17}
                maxZoomLevel={18}
                showsUserLocation={true}
                showsBuildings={false}
                toolbarEnabled={false}
                zoomControlEnabled={false}
                onPress={(e) => {seteventLocation(e.nativeEvent.coordinate)}}
            >
            {
                eventLocation && 
                <Marker coordinate={eventLocation} />
            }
            </MapView>
            <TouchableOpacity style={styles.createEventButton}
                onPress={() => {
                    addData("Events", updatedEvent);
                    navigation.navigate("List");
                }}
            >
                <Text style={{fontSize: 16}}>Save and Publish</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "white",
        alignItems: "center",
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
    columnText: {
        flex: 1,
        minWidth: 20,
        fontSize: 16,
        fontWeight: "bold",
        marginHorizontal: 10,
        // borderColor: "green",
        // borderWidth: 1,
    },
    slider: {
        flex: 3,
        flexDirection: "column",
        marginHorizontal: 10,
        alignItems: "center",
    },
    columnInput: {
        flex: 3,
        marginHorizontal: 10,
    },
    
});

export default CreateEventLocation;