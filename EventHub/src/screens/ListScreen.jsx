import { useState, useEffect, Fragment } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlatList, TextInput, Button, TouchableOpacity } from 'react-native';
import { updateData, getData } from "../firebase/database";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateEvent from "./CreateEvent";
import CreateEventLocation from "./CreateEventLocation";
import { useIsFocused } from "@react-navigation/native";
import Dialog, { DialogContent } from "react-native-popup-dialog";
import Ionicons from "react-native-vector-icons/Ionicons";

{/* icon name list:
    add-circle-outline
    people
    calendar
    location
    checkmark-circle-outline 
*/}

const Stack = createNativeStackNavigator();

const List = ({navigation}) => {

    const isFocused = useIsFocused();

    const [realData, setRealData] = useState([{}]);

    const catagoryColor = {
        Sports: "lightgreen",
        Study: "lightblue",
        Arts: "pink",
        Social: "yellow",
        Leisure: "#e28743",
    }

    useEffect(() => {
        getData("Events").then((data) => {
            const tempArray = [];
        
            for (let i = 0; i < data.length; i++) {
                const tempData = data[i].data();
                tempData.id = data[i].id;
                tempArray.push(tempData);
            }
            setRealData(tempArray);
        });
    }, [isFocused]);

    console.log(realData);

    const MyList = () => {
        const [searchText, setSearchText] = useState('');
        const [filteredData, setFilteredData] = useState(realData); // switch to realData

        const [visible, setVisible] = useState(false);

        const [activeItem, setActiveItem] = useState({});

        useEffect(() => {
            if (searchText === '') {
                setFilteredData(realData);
            } else {
                const filtered = realData.filter(item =>  // switch to realData
                item.title.toLowerCase().includes(searchText.toLowerCase())
                );
                setFilteredData(filtered);
            }
        }, [searchText]);
      
        const handleSort = () => {
          const sorted = [...filteredData].sort((a, b) =>
            a.title.localeCompare(b.title)
          );
          setFilteredData(sorted);
        };

        const showDetails = (item) => {

            return (
                    <View style={{width: 290, padding: 10, paddingTop:20}}>
                        <Text style={{fontSize:20}}>{item.title}</Text>
                        <Text>
                            Description:{'\n'}{item.description}{'\n'} 
                        </Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text>
                                Location: {'\n'}
                                Date: {'\n'}
                                Time: {'\n'}
                                Participants: {'\n'}
                                Category: {'\n'}
                                Host: 
                            </Text>
                            <Text style={{width: 150}}>
                                    {item.location}{'\n'}
                                    {item.date}{'\n'}
                                    {item.startTime} - {item.endTime}{'\n'}
                                    {item.numOfParticipants}/{item.maxParticipants}{'\n'}
                                    {item.category}{'\n'}

                                    {item.host}
                            </Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.joinButton}
                            onPress={() => {
                                updateData("Events", item.id, {
                                    numOfParticipants: item.numOfParticipants + 1,
                                });
                            }}
                        >
                            <Text>Join</Text>
                        </TouchableOpacity>
                    </View>
            );
        };


        const renderItem = ({ item }) => (
            
            <TouchableOpacity 
                onPress={ () => {
                        setActiveItem(item);
                        setVisible(true);
                    } 
                }>

                <View style={styles.itemContainer}>

                    <Text style={{fontSize: 20}}>{item.title}</Text>
                    <View style={styles.smallerContainer}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row'}}>
                                <Ionicons name="people" size={12} />
                                <Text style={{fontSize: 12}}> {item.numOfParticipants?item.numOfParticipants:0}/{item.maxParticipants}</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Ionicons name="calendar" size={12} />
                                <Text style={{fontSize: 12}}> {item.date} {item.startTime}-{item.endTime}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row'}}>
                                <Ionicons name="location" size={12} />
                                <Text style={{fontSize: 12}}> {item.location}</Text>
                            </View>
                            <View style={{backgroundColor: catagoryColor[item.category], borderRadius: 5}}>
                                <Text style={{fontSize: 12}}> {item.category}</Text>
                            </View>

                        </View>
                    </View>
                </View>
                
            </TouchableOpacity>

        );

        return (
            
            <View style={styles.container}>
                {/* horizontal view*/}
                <View style={{flexDirection: 'row'}}>
                    <TextInput
                        placeholder="Search key"
                        value={searchText}
                        flex={3}
                        width="auto"
                        borderBottomWidth={1}
                        borderBottomColor="gray"
                        onChangeText={text => setSearchText(text)}
                        
                    />
                    <Button
                        title="Sort" 
                        flex={1}

                        onPress={handleSort} />
                </View>

                <Dialog
                    visible={visible}
                    onTouchOutside={() => {
                        setVisible(false);
                    }}
                >
                    <DialogContent>
                        {showDetails(activeItem)}
                    </DialogContent>
                </Dialog>
                
                <FlatList
                    paddingTop={10}
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={{flex: 1, alignSelf: 'center', width: '90%',}}
                    ItemSeparatorComponent={() => (
                        <View style={{height: 5}} />
                    )}   
                />
            </View>
        );
    };

    return (
        <View style={styles.mainContainer}>
            <MyList />
            <TouchableOpacity style={styles.createEventButton}
                onPress={() => navigation.navigate("Event")}
            >
                <Text style={{fontSize: 16}}>Create Event</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    smallContainer: {
        padding: 5,
        margin: 5,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "space-between",
    },
    itemContainer: {
        borderWidth: 1,
        borderColor: "darkorange",
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: "100%",
        alignItems: "stretch",
        backgroundColor: "white",
        borderRadius: 8,
      },
    button: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#001F3F",
        
    },
    createEventButton: {
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "lightgrey",
        paddingVertical: 10,
        marginVertical: 10,
        width: "80%",
    },
    joinButton: {
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "lightgreen",
        paddingVertical: 5,
        marginTop: 20,
        width: 60,
        borderRadius: 5,
    },
});


const ListScreen = () => {

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "orange",
                    borderStyle: "solid",
                    shadowColor: "transparent",
                    height: 43.5,
                },
                headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 20,
                    color: "white",
                },
                headerTintColor: "white",
            }}
            initialRouteName="List"
        >
            <Stack.Screen 
                name="List" 
                component={List} 
                options={{
                    headerTitle: () => (
                        <Text style={{color: "white", fontSize: 20, fontWeight: "bold"}}>Event List</Text>
                    ),    
                }}
                un
            />
            <Stack.Screen 
                name="Event" 
                component={CreateEvent} 
                options={{
                    headerTitle: () => (
                        <Text style={{color: "white", fontSize: 20, fontWeight: "bold"}}>Create Event</Text>
                    ),    
                }}
            />

            <Stack.Screen 
                name="CreateEventLocation" 
                component={CreateEventLocation} 
                options={{
                    headerTitle: () => (
                        <Text style={{color: "white", fontSize: 20, fontWeight: "bold"}}>Select Location</Text>
                    ),    
                }}
            />

        </Stack.Navigator>
    );
}


export default ListScreen;
