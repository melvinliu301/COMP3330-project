import { useState, useEffect, Fragment } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlatList, TextInput, Button, TouchableOpacity } from 'react-native';
import { updateData, getData } from "../firebase/database";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateEvent from "./CreateEvent";
import CreateEventLocation from "./CreateEventLocation";
import { useIsFocused } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { categoryColor } from "../common/constants";
import { auth } from "../firebase/auth";

{/* ionicons:
    add-circle-outline
    people
    calendar
    location
    checkmark-circle-outline 
    information-circle-outline
    time-outline

    material icons:
    connect-without-contact
*/}

const Stack = createNativeStackNavigator();

const List = ({navigation}) => {

    const isFocused = useIsFocused();

    const [realData, setRealData] = useState([{}]);

    useEffect(() => {
        getData("Events").then((data) => {
            const tempArray = [];
            for (let i = 0; i < data.length; i++) {
                const tempData = data[i].data();
                tempData.id = data[i].id;
                tempData.expanded = false;
                tempArray.push(tempData);
                
            }
            setRealData(tempArray);
        });
    }, [isFocused]);

    console.log(realData);

    const MyList = () => {
        const [searchText, setSearchText] = useState('');
        const [filteredData, setFilteredData] = useState(realData); // switch to realData
      
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
        
        const toggleItemExpansion = (id) => {
            setFilteredData((prevData) =>   // switch to realData
                prevData.map((item) => {
                    if (item.id === id) {
                        return { ...item, expanded: !item.expanded };
                    }
                    return item;
                })
            );
        };

        const showExpanded = (item) => {
            
            {/* show other fields in data */}
            return (
                <View style={{width: 290, padding: 5}}>

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
                onPress={ () => toggleItemExpansion(item.id)}
            >

                <View style={styles.itemContainer}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>{item.title}</Text>
                        {item.verified && <Ionicons name="checkmark-circle-outline" size={24} color='green' />}
                    </View>
                    <View style={{backgroundColor: 'white'}}>
                        {item.expanded && <Text>{showExpanded(item)}</Text>}
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
                <Text style={{fontSize:16}}>Create Event</Text>
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
    infoText: {
        fontSize: 16,
        padding: 3,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "space-between",
    },
    itemContainer: {
        borderWidth: 2,
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
        alignSelf: "flex-end",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "lightgreen",
        paddingVertical: 5,
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
