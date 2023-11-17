import { useState, useEffect, Fragment } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlatList, TextInput, Button, TouchableOpacity, Pressable } from 'react-native';
import { getData } from "../firebase/database";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateEvent from "./CreateEvent";
import { useIsFocused } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

const List = ({navigation}) => {

    const isFocused = useIsFocused();

    // remove later, for testing only
    // const [data, setData] = useState([]);

    // useEffect(() => {
    //     getData("test").then((data) => {
    //         setData(data);
    //     });
    // }, []);

    // fake data for testing
    const fakedata = [
        {
            id: "0001",
            title: "Running",
            catagory: ["Sports", "Fitness"],
            creator: "Edan",
            location: "Exit A, HKU Station",
            datetime: "2023/12/14H10:00",
            latitude: 22.283138717812534,
            longitude: 114.13652991004479,
            duration: "1",

            expanded: false,
        },
        {
            id: "0002",
            title: "Dance Team Showcase",
            catagory: ["Dance", "Performance"],
            creator: "Ian",
            location: "Lecture Hall 1, HKU",
            datetime: "2023/11/19 12:00",
            latitude: 22.283138717812534,
            longitude: 114.13652991004479,
            duration: "1",

            expanded: false,
        },
        {
            id: "0003",
            title: "HKUBand Busking",
            catagory: ["Music", "Performance"],
            creator: "HKUBand",
            location: "Main Building, HKU",
            datetime: "2023/11/19 12:00",
            latitude: 22.283138717812534,
            longitude: 114.13652991004479,
            duration: "2",

            expanded: false,
        },
        {
            id: "0004",
            title: "EENG1340 Study Group",
            catagory: ["Academic", "Study"],
            creator: "Falculty of Engineering",
            location: "Innovation Wing, HKU",
            datetime: "2023/11/31 14:00",
            latitude: 22.283138717812534,
            longitude: 114.13652991004479,
            duration: "3",

            expanded: false,
        },
        {
            id: "0005",
            title: "testing",
            catagory: ["Academic", "Study"],
            creator: "Falculty of Engineering",
            location: "Innovation Wing, HKU",
            datetime: "2023/11/31 14:00",
            latitude: 22.283138717812534,
            longitude: 114.13652991004479,
            duration: "3",

            expanded: false,
        },
    ];
    const [data, setData] = useState(fakedata);

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
      
        const handleSearch = () => {
          const filtered = realData.filter(item =>  // switch to realData
            item.title.toLowerCase().includes(searchText.toLowerCase())
          );
          setFilteredData(filtered);
        };
      
        const handleSort = () => {
          const sorted = [...filteredData].sort((a, b) =>
            a.title.localeCompare(b.title)
          );
          setFilteredData(sorted);
        };
        
        const toggleItemExpansion = (id) => {
            setRealData((prevData) =>   // switch to realData
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
                <View>
                    <Text>
                        {'\n'}
                        Description:{'\n'}{item.description}{'\n\n'}
                        Location: {item.location}{'\n'}
                        Date: {item.date}{'\n'}
                        Time: {item.startTime} - {item.endTime}{'\n'}
                        Participants: 0/{item.numOfParticipants}{'\n'}
                        Category: {item.category}{'\n'}

                        Host: {item.creator}{'\n'}

                        
                    </Text>
                </View>
            );
        };


        const renderItem = ({ item }) => (
            
            <TouchableOpacity 
                onPress={ () => toggleItemExpansion(item.id)}
            >

                <View 
                    style={styles.itemContainer}
                >
                    <Text style={{fontSize: 20}}>{item.title}</Text>
                    {item.expanded && <Text>{showExpanded(item)}</Text>}
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
                        title="Search" 
                        flex={1} 

                        onPress={handleSearch} />
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
                />
            </View>
        );
    };

    return (
        <View style={styles.mainContainer}>
            <MyList />
            <TouchableOpacity style={styles.createEventButton}
                onPress={() => navigation.navigate("CreateEvent")}
            >
                <Text style={{fontSize: 16}}>Create Event</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "space-between",
    },
    itemContainer: {
        borderWidth: 1,
        borderColor: "orange",
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: "100%",
      },
    button: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#001F3F",
        
    },
    createEventButton: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "lightgrey",
        paddingVertical: 10,
        width: "100%",
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
                name="CreateEvent" 
                component={CreateEvent} 
                options={{
                    headerTitle: () => (
                        <Text style={{color: "white", fontSize: 20, fontWeight: "bold"}}>Create Event</Text>
                    ),    
                }}
            />

        </Stack.Navigator>
    );
}


export default ListScreen;
